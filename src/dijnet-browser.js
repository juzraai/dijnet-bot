const fs = require('fs');
const path = require('path');
const waitMs = require('util').promisify(setTimeout);
const mkdirp = require('mkdirp').sync;
const Browser = require('./browser');
const Config = require('./config');
const Logger = require('./logger');

/**
 * Extension to `Browser`. Adds Díjnet specific base URL and HTTP headers, and
 * is able to write out HTML files and cookies for further investigation.
 */
class DijnetBrowser extends Browser {
	/**
	 * @param {Config} config Configuration
	 * @param {Logger} logger Logger
	 */
	constructor(config, logger) {
		super();
		this.config = config || new Config();
		this.logger = logger || new Logger(this.config);

		this.baseUrl = 'https://www.dijnet.hu/ekonto';
	}

	/**
	 * Creates temporary directory if set.
	 *
	 * @returns {DijnetBrowser} This object
	 */
	init() {
		if (this.config.tempDir) {
			this.logger.verbose(`Könyvtár létrehozása: ${this.config.tempDir}`);
			mkdirp(this.config.tempDir);
		}
		return this;
	}

	/**
	 * Waits before sending the request, and also adds required headers and Dijnet base URL.
	 *
	 * @param {string} dijnetPath Díjnet path, relative to `baseUrl`
	 * @param {got.GotJSONOptions} options Request options (method, headers, body, encoding, etc.)
	 * @returns {got.GotPromise<got.Response>} Response
	 */
	async request(dijnetPath, options) {
		this.logger.verbose(`${this.config.sleep}s várakozás...`);
		await waitMs(this.config.sleep * 1000);

		this.logger.verbose(`${options.method} ${this.baseUrl}${dijnetPath}`);
		const headers = Object.assign({
			'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
			'accept-language': 'hu-HU,hu;q=0.9,en-US;q=0.8,en;q=0.7'
		}, options.headers || {});

		return super.request(dijnetPath, Object.assign({ prefixUrl: this.baseUrl, encoding: 'latin1' }, options, { headers }));
	}

	/**
	 * Sends a GET request to the given Díjnet path, then stores the response in `lastNavigationResponse`.
	 * If temporary directory is set, outputs the body into a HTML file as well.
	 *
	 * @param {string} dijnetPath Díjnet path, relative to `baseUrl`
	 * @returns {got.GotPromise<got.Response>} Response
	 */
	async navigate(dijnetPath) {
		await super.navigate(dijnetPath);
		this.saveTempFile(dijnetPath);
		return this.lastNavigationResponse;
	}

	/**
	 * Sends a POST request to the given Díjnet path, then stores the response in `lastNavigationResponse`.
	 * Also adds required headers.
	 * If temporary directory is set, outputs the body into a HTML file as well.
	 *
	 * @param {string} dijnetPath Díjnet path, relative to `baseUrl`
	 * @param {string} body Request body
	 * @returns {got.GotPromise<got.Response>} Response
	 */
	async submit(dijnetPath, body) {
		const headers = { 'content-type': 'application/x-www-form-urlencoded' };
		await super.submit(dijnetPath, { headers, body });
		this.saveTempFile(dijnetPath);
		return this.lastNavigationResponse;
	}

	/**
	 * Downloads a file from the given Díjnet path. Filename is defined by
	 * Díjnet.
	 *
	 * @param {string} dijnetPath Díjnet path, relative to `baseUrl`
	 * @param {string} targetDir Target directory
	 */
	async download(dijnetPath, targetDir) {
		const r = await this.request(dijnetPath, { method: 'GET', responseType: 'buffer' });
		const fn = r.headers['content-disposition'].replace(/.*filename=/, '');
		const kb = Math.round(r.body.length / 102.4) / 10;
		this.logger.verbose(`Fájl mentése (${kb} KB): ${fn}`);
		fs.writeFileSync(path.join(targetDir, fn), r.body, 'binary');
	}

	/**
	 * If temporary directory is set, outputs the last response body and the
	 * state of the cookie jar into files. Filenames will include a timestamp
	 * and a normalized form of the Díjnet path.
	 *
	 * @param {string} dijnetPath Díjnet path, relative to `baseUrl`
	 */
	saveTempFile(dijnetPath) {
		if (this.config.tempDir) {
			const now = new Date();
			const ts = (now.toISOString().slice(0, 10) + ' ' + now.toLocaleTimeString()).replace(/\D/g, '');
			const nu = dijnetPath.replace(/.*dijnet.*?\//, '').replace(/[^A-Za-z0-9]+/g, '_');
			const fn = path.join(this.config.tempDir, `${ts}_${nu}.html`);
			this.logger.verbose(`HTML fájl kiírása: ${fn}`);
			fs.writeFileSync(fn, this.lastNavigationResponse.body);

			const fn2 = fn.replace('.html', '.cookies');
			this.logger.verbose(`Sütik kiírása: ${fn2}`);
			fs.writeFileSync(fn2, JSON.stringify(this.cookieJar, null, 2));
		}
	}
}

module.exports = DijnetBrowser;

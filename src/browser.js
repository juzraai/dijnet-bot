const got = require('got');
const { CookieJar } = require('tough-cookie');

/**
 * Wrapper around `got` HTTP client. Adds a cookie jar and stores the last successful response.
 */
class Browser {
	constructor() {
		this.cookieJar = new CookieJar();
		/** @type {got.Response} */
		this.lastNavigationResponse = null;
	}

	/**
	 * Sends a HTTP request to the given URL.
	 *
	 * @param {string} url Requested URL
	 * @param {got.GotJSONOptions} options Request options (method, headers, body, encoding, etc.)
	 * @returns {got.GotPromise<got.Response>} Response
	 */
	async request(url, options) {
		return got(url, Object.assign({ cookieJar: this.cookieJar }, options));
	}

	/**
	 * Sends a GET request to the given URL, then stores the response in `lastNavigationResponse`.
	 *
	 * @param {string} url Requested URL
	 * @param {got.GotJSONOptions} options Request options (headers, encoding, etc.)
	 * @returns {got.GotPromise<got.Response>} Response
	 */
	async navigate(url, options) {
		this.lastNavigationResponse = await this.request(url, Object.assign({ method: 'GET' }, options));
		return this.lastNavigationResponse;
	}

	/**
	 * Sends a POST request to the given URL, then stores the response in `lastNavigationResponse`.
	 *
	 * @param {string} url Requested URL
	 * @param {got.GotJSONOptions} options Request options (body, headers, encoding, etc.)
	 * @returns {got.GotPromise<got.Response>} Response
	 */
	async submit(url, options) {
		this.lastNavigationResponse = await this.request(url, Object.assign({ method: 'POST' }, options));
		return this.lastNavigationResponse;
	}
}

module.exports = Browser;

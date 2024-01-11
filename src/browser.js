import got from 'got';
import { CookieJar } from 'tough-cookie';

/**
 * Wrapper around `got` HTTP client. Adds a cookie jar and stores the last successful response.
 */
export default class Browser {
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
		return got(url, {
			cookieJar: this.cookieJar,
			dnsCache: new Map(),
			...options,
		});
	}

	/**
	 * Sends a GET request to the given URL, then stores the response in `lastNavigationResponse`.
	 *
	 * @param {string} url Requested URL
	 * @param {got.GotJSONOptions} options Request options (headers, encoding, etc.)
	 * @returns {got.GotPromise<got.Response>} Response
	 */
	async navigate(url, options) {
		this.lastNavigationResponse = await this.request(url, { method: 'GET', ...options });
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
		this.lastNavigationResponse = await this.request(url, { method: 'POST', ...options });
		return this.lastNavigationResponse;
	}
}

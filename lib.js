const setTimeoutP = require('util').promisify(setTimeout);
const got = require('got');
const { CookieJar } = require('tough-cookie');
const log = require('./logger');

const cookieJar = new CookieJar();

async function _request(path, test, body) {
	log.trace('%s %s', body ? 'POST' : 'GET', path);
	const baseUrl = 'https://www.dijnet.hu/ekonto';
	const headers = body ? {
		'content-type': 'application/x-www-form-urlencoded'
	} : null;
	const options = { baseUrl, body, cookieJar, headers };
	try {
		const response = await got(path, options);
		if (test && response.body.indexOf(test) === -1) {
			// TODO write out body to file for debugging
			throw new Error(`Érvénytelen lap, nem tartalmazza ezt: ${test}`);
		}
		return response;
	} catch (error) {
		throw error;
	}
}

function login(dijnet_user, dijnet_pass) {
	log.info('Bejelentkezés');
	return _request(
		'/login/login_check_password', 'href="/ekonto/control/szamla_search"',
		`vfw_form=login_check_password&username=${dijnet_user}&password=${dijnet_pass}`);
}

function szamla_search() {
	log.info('Számla kereső megnyitása');
	return _request('/control/szamla_search', 'action="szamla_search_submit"');
}

async function sleep(s) {
	log.trace('Várunk %d másorpercet', s);
	await setTimeoutP(s * 1000);
}

module.exports = {
	// Díjnet
	login,
	szamla_search,
	// util
	sleep
};

const setTimeoutP = require('util').promisify(setTimeout);
const cheerio = require('cheerio');
const deburr = require('lodash.deburr');
const got = require('got');
const { CookieJar } = require('tough-cookie');
const log = require('./logger');

const cookieJar = new CookieJar();

async function _request(path, test, body) {
	log.trace('%s %s', body ? 'POST' : 'GET', path);
	const baseUrl = 'https://www.dijnet.hu/ekonto';
	const headers = body ? {
		'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
		'accept-language': 'hu-HU,hu;q=0.9,en-US;q=0.8,en;q=0.7',
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

function szamla_search_submit() {
	log.info('Számla kereső űrlap elküldése');
	return _request('/control/szamla_search_submit', '/control/szamla_select',
		'vfw_form=szamla_search_submit&vfw_coll=szamla_search_params&regszolgid=&szlaszolgid=&datumtol=&datumig=');
}

function normalize(s) {
	// A probléma az, hogy nagyon fura encoding-gal jönnek az ő/ű betűk, és sehogy nem tudom őket olvashatóvá konvertálni.
	// Így azt találtam ki, hogy eltávolítom az ékezeteket (á->a), a nem-betű karaktereket meg kidobálom.
	return deburr(s).replace(/[^a-z0-9\-_]+/gi, ' ').trim();
}

function parse_szamla_list(body) {
	const $ = cheerio.load(body, { normalizeWhitespace: true });
	const cols = [];
	$('.szamla_table th').each((_, th) => cols.push(normalize($(th).text())));
	/*
		'Szolgaltato',
		'Szamlakibocsatoi azonosito',
		'Szamlaszam',
		'Kiallitas datuma',
		'Szamla vegosszege',
		'Fizetesi hatarid',
		'Fizetend',
		'Allapot'
	*/
	function indexOfOrThrowError(col) {
		const i = cols.indexOf(col);
		if (i === -1) {
			throw new Error(`Érvénytelen lap, nem tartalmazza a(z) ${col} oszlopot`);
		}
		return i;
	}
	const providerIndex = indexOfOrThrowError('Szolgaltato');
	const customNameIndex = indexOfOrThrowError('Szamlakibocsatoi azonosito');
	const dateIndex = indexOfOrThrowError('Kiallitas datuma');
	const invoices = [];
	$('.szamla_table tbody tr').each((i, tr) => {
		const invoice = {
			rowid: $(tr).html().toString().match(/rowid=(\d+)/)[1],
			provider: normalize($(tr.childNodes[providerIndex]).text()),
			customName: normalize($(tr.childNodes[customNameIndex]).text()),
			date: $(tr.childNodes[dateIndex]).text()
		};
		invoices.push(invoice);
	});
	return invoices;
}

async function sleep(s) {
	log.trace('Várunk %d másorpercet', s);
	await setTimeoutP(s * 1000);
}

module.exports = {
	// Díjnet
	login,
	szamla_search,
	szamla_search_submit,
	parse_szamla_list,
	// util
	sleep
};

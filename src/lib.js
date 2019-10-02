const fs = require('fs');
const path = require('path');
const setTimeoutP = require('util').promisify(setTimeout);
const cheerio = require('cheerio');
const deburr = require('lodash.deburr');
const got = require('got');
const { CookieJar } = require('tough-cookie');
const log = require('./logger');

const baseUrl = 'https://www.dijnet.hu/ekonto';
const cookieJar = new CookieJar();

async function _request(dijnet_path, outfile, test, body) {
	log.trace('%s %s', body ? 'POST' : 'GET', dijnet_path);
	const formHeaders = body ? { 'content-type': 'application/x-www-form-urlencoded' } : {};
	const headers = Object.assign({
		'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
		'accept-language': 'hu-HU,hu;q=0.9,en-US;q=0.8,en;q=0.7'
	}, formHeaders);
	const options = { baseUrl, body, cookieJar, headers };
	try {
		const response = await got(dijnet_path, options);
		if (outfile) {
			log.trace('Kapott válasz (%dKB) mentése ide: %s', Math.round(response.body.length / 102.4) / 10, outfile);
			fs.writeFileSync(outfile, response.body);
		}
		if (test && response.body.indexOf(test) === -1) {
			throw new Error(`Érvénytelen lap, nem tartalmazza ezt: ${test}`);
		}
		return response;
	} catch (error) {
		throw error;
	}
}

async function download(dijnet_path, outdir) {
	log.trace('GET (binary) %s', dijnet_path);
	const options = { baseUrl, cookieJar, encoding: null };
	try {
		const response = await got(dijnet_path, options);
		const filename = response.headers['content-disposition'].replace(/.*filename=/, '');
		const outfile = path.join(outdir, filename);
		log.trace('Fájl (%d KB) mentése ide: %s', Math.round(response.body.length / 102.4) / 10, outfile);
		fs.writeFileSync(outfile, response.body, 'binary');
	} catch (error) {
		throw error;
	}
}

function login(dijnet_user, dijnet_pass, outfile) {
	return _request(
		'/login/login_check_password', outfile,
		'href="/ekonto/control/szamla_search"',
		`vfw_form=login_check_password&username=${dijnet_user}&password=${dijnet_pass}`);
}

function szamla_search(outfile) {
	return _request('/control/szamla_search', outfile, 'action="szamla_search_submit"');
}

function szamla_search_submit(outfile) {
	return _request('/control/szamla_search_submit', outfile,
		'/control/szamla_select',
		'vfw_form=szamla_search_submit&vfw_coll=szamla_search_params&regszolgid=&szlaszolgid=&datumtol=&datumig=');
}

function szamla_select(rowid, outfile) {
	return _request(
		`/control/szamla_select?vfw_coll=szamla_list&vfw_coll_index=0&vfw_rowid=${rowid}&vfw_colid=ugyfelazon|S`,
		outfile, 'href="szamla_letolt"');
}

function szamla_letolt(outfile) {
	return _request('/control/szamla_letolt', outfile, 'class="xt_link__download"');
}

function szamla_list(outfile) {
	return _request('/control/szamla_list', outfile, '/control/szamla_select');
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
	const billIdIndex = indexOfOrThrowError('Szamlaszam Bizonylatszam');
	const invoices = [];
	$('.szamla_table tbody tr').each((i, tr) => {
		const invoice = {
			rowid: $(tr).html().toString().match(/rowid=(\d+)/)[1],
			provider: normalize($(tr.childNodes[providerIndex]).text()),
			customName: normalize($(tr.childNodes[customNameIndex]).text()),
			date: $(tr.childNodes[dateIndex]).text(),
			billId: $(tr.childNodes[billIdIndex]).text()
		};
		invoices.push(invoice);
	});
	return invoices;
}

function parse_szamla_letolt(body) {
	const $ = cheerio.load(body, { normalizeWhitespace: true });
	const downloads = [];
	$('a.xt_link__download').each((_, a) => {
		const { href } = a.attribs;
		if (href.indexOf('://') === -1) {
			downloads.push(`/control/${href}`);
		}
	});
	return downloads;
}

async function sleep(s) {
	log.trace('Várunk %d másodpercet', s);
	await setTimeoutP(s * 1000);
}

module.exports = {
	// Díjnet
	login,
	szamla_search,
	szamla_search_submit,
	szamla_select,
	szamla_letolt,
	szamla_list,
	parse_szamla_list,
	parse_szamla_letolt,
	download,
	// util
	sleep
};

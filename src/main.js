require('dotenv').config();
const path = require('path');
const mkdirp = require('util').promisify(require('mkdirp'));
const dijnet = require('./lib');
const log = require('./logger');

process.env.OUTPUT_DIR = process.env.OUTPUT_DIR || './szamlak';
process.env.SLEEP = process.env.SLEEP || 3;
process.env.TEMP_DIR = (process.env.TEMP_DIR || '').trim();
function tmp(name) {
	return process.env.TEMP_DIR.length === 0 ? null : path.join(process.env.TEMP_DIR, name);
}

const start = async () => {
	try {
		log.success('Díjnet-bot indul');

		log.info('Könyvtárak létrehozása');
		log.trace('Kimeneti könyvtár létrehozása: %s', process.env.OUTPUT_DIR);
		await mkdirp(process.env.OUTPUT_DIR);
		if (process.env.TEMP_DIR.length > 0) {
			log.trace('Segédfájlok könyvtár létrehozása: %s', process.env.TEMP_DIR);
			await mkdirp(process.env.TEMP_DIR);
		}

		log.info('Bejelentkezés');
		await dijnet.login(process.env.DIJNET_USER, process.env.DIJNET_PASS, tmp('login.html'));

		log.info('Számla kereső megnyitása');
		await dijnet.sleep(process.env.SLEEP);
		await dijnet.szamla_search(tmp('szamla_search.html'));

		log.info('Számla kereső űrlap elküldése');
		await dijnet.sleep(process.env.SLEEP);
		const szamla_list_response = (await dijnet.szamla_search_submit(tmp('szamla_search_submit.html'))).body;

		const invoices = dijnet.parse_szamla_list(szamla_list_response);
		log.success('%d db számlánk van', invoices.length);

		for (let i = 0; i < invoices.length; i++) {
			const invoice = invoices[i];
			const dir = path.join(process.env.OUTPUT_DIR, `${invoice.provider} - ${invoice.customName}`, invoice.date);

			log.info('[%d/%d] Számla #%d kiválasztása', i + 1, invoices.length, invoice.rowid);
			await mkdirp(dir);
			await dijnet.sleep(process.env.SLEEP);
			await dijnet.szamla_select(invoice.rowid, tmp(`szamla_select_${invoice.rowid}.html`));

			await dijnet.sleep(process.env.SLEEP);
			const szamla_letolt_response = (await dijnet.szamla_letolt(tmp(`szamla_letolt_${invoice.rowid}.html`))).body;

			const files = dijnet.parse_szamla_letolt(szamla_letolt_response);
			for (let f = 0; f < files.length; f++) {
				const file = files[f];
				log.info('%s letöltése', file);
				await dijnet.sleep(process.env.SLEEP);
				await dijnet.download(file, dir);
			}

			log.success('[%d/%d] Számla #%d fájljai (%d db) lementve', i + 1, invoices.length, invoice.rowid, files.length);
			log.info('Visszatérés a számla listához');
			await dijnet.sleep(3);
			await dijnet.szamla_list(tmp(`szamla_list_${invoice.rowid}.html`));
		}
		log.success('Kész');
	} catch (error) {
		log.error(error.message);
		log.trace(error.stack);
		process.exit(1);
	}
};

module.exports = { start };

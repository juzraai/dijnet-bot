require('dotenv').config();
const path = require('path');
const mkdirp = require('util').promisify(require('mkdirp'));
const dijnet = require('./lib');
const log = require('./logger');

function tmp(name) {
	return path.join(process.env.TEMP_DIR, name);
}

(async () => {
	try {
		log.info('Könyvtárak létrehozása');
		await mkdirp(process.env.OUTPUT_DIR);
		await mkdirp(process.env.TEMP_DIR);

		log.info('Bejelentkezés');
		await dijnet.login(process.env.DIJNET_USER, process.env.DIJNET_PASS, tmp('login.html'));

		log.info('Számla kereső megnyitása');
		await dijnet.sleep(3);
		await dijnet.szamla_search(tmp('szamla_search.html'));

		log.info('Számla kereső űrlap elküldése');
		await dijnet.sleep(3);
		const szamla_list_response = (await dijnet.szamla_search_submit(tmp('szamla_search_submit.html'))).body;

		const invoices = dijnet.parse_szamla_list(szamla_list_response);
		log.success('%d db számlánk van', invoices.length);

		for (let i = 0; i < invoices.length; i++) {
			const invoice = invoices[i];
			const dir = path.join(process.env.OUTPUT_DIR, `${invoice.provider} - ${invoice.customName}`, invoice.date)
			log.info('[%d/%d] Számla #%d kiválasztása', i + 1, invoices.length, invoice.rowid);
			await mkdirp(dir);
			await dijnet.sleep(3);
			await dijnet.szamla_select(invoice.rowid, tmp(`szamla_select_${invoice.rowid}.html`));
			await dijnet.sleep(3);
			const szamla_letolt_response = (await dijnet.szamla_letolt(tmp(`szamla_letolt_${invoice.rowid}.html`))).body;
			const files = dijnet.parse_szamla_letolt(szamla_letolt_response);
			for (let f = 0; f < files.length; f++) {
				const file = files[f];
				log.info('%s letöltése', file);
				await dijnet.sleep(3);
				await dijnet.download(file, dir);
			}
			log.success('[%d/%d] Számla #%d fájljai (%d db) lementve', i + 1, invoices.length, invoice.rowid, files.length);
			// TODO lista
			break;
		}
	} catch (error) {
		log.error(error.message);
	}
})();

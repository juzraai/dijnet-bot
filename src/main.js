const fs = require('fs');
const path = require('path');
const mkdirp = require('util').promisify(require('mkdirp'));
const packageJson = require('../package.json');
const configurate = require('./conf');
const { handleError } = require('./err');

console.log(`Díjnet Bot v${packageJson.version}\n`);

configurate();
const log = require('./logger');
const dijnet = require('./lib');

function tmp(name) {
	return process.env.TEMP_DIR.length === 0 ? null : path.join(process.env.TEMP_DIR, name);
}

const alreadyCrawledIdsFile = path.join(process.env.OUTPUT_DIR, 'kesz.txt');
let alreadyCrawledIds = null;
function isAlreadyCrawled(id) {
	if (alreadyCrawledIds === null) {
		if (fs.existsSync(alreadyCrawledIdsFile)) {
			alreadyCrawledIds = fs.readFileSync(alreadyCrawledIdsFile, 'utf8').split('\n');
		} else {
			alreadyCrawledIds = [];
		}
	}
	return alreadyCrawledIds.includes(id);
}

function markAlreadyCrawled(id) {
	fs.appendFileSync(alreadyCrawledIdsFile, id + '\n');
}

const start = async () => {
	try {
		log.success('Díjnet-bot indul');

		log.trace('Könyvtárak létrehozása');
		log.trace('Kimeneti könyvtár létrehozása: %s', process.env.OUTPUT_DIR);
		await mkdirp(process.env.OUTPUT_DIR);
		if (process.env.TEMP_DIR.length > 0) {
			log.trace('Segédfájlok könyvtár létrehozása: %s', process.env.TEMP_DIR);
			await mkdirp(process.env.TEMP_DIR);
		}

		log.info('Bejelentkezés...');
		await dijnet.login(process.env.DIJNET_USER, process.env.DIJNET_PASS, tmp('login.html'));
		log.success(`Bejelentkezve: ${process.env.DIJNET_USER}`);

		log.info('Számlák keresése...');
		await dijnet.sleep(process.env.SLEEP);
		await dijnet.szamla_search(tmp('szamla_search.html'));
		await dijnet.sleep(process.env.SLEEP);
		const szamla_list_response = (await dijnet.szamla_search_submit(tmp('szamla_search_submit.html'))).body;

		let invoices = dijnet.parse_szamla_list(szamla_list_response);
		const allBillsCount = invoices.length;
		invoices = invoices.filter(invoice => !isAlreadyCrawled(invoice.billId));
		log.success(`${allBillsCount} db számla van a rendszerben, ebből ${allBillsCount - invoices.length} db lementve korábban`);

		for (let i = 0; i < invoices.length; i++) {
			const invoice = invoices[i];
			const dir = path.join(process.env.OUTPUT_DIR, `${invoice.provider} - ${invoice.customName}`, invoice.date);

			log.info(`Számla lementése: ${invoice.date}, ${invoice.provider}`);

			const logPrefix = `Számla ${i + 1}/${invoices.length} (${invoice.date}, ${invoice.provider}):`;

			log.trace(`${logPrefix} megnyitás`);
			await mkdirp(dir);
			await dijnet.sleep(process.env.SLEEP);
			await dijnet.szamla_select(invoice.rowid, tmp(`szamla_select_${invoice.rowid}.html`));

			await dijnet.sleep(process.env.SLEEP);
			const szamla_letolt_response = (await dijnet.szamla_letolt(tmp(`szamla_letolt_${invoice.rowid}.html`))).body;

			const files = dijnet.parse_szamla_letolt(szamla_letolt_response);
			for (let f = 0; f < files.length; f++) {
				const file = files[f];
				log.trace(`${logPrefix} ${file} letöltése`);
				await dijnet.sleep(process.env.SLEEP);
				await dijnet.download(file, dir);
			}

			markAlreadyCrawled(invoice.billId);
			log.trace(`${logPrefix} ${files.length} fájl lementve`);
			log.success(`${invoices.length} db új számlából ${i + 1} db lementve [${Math.round((i + 1) / invoices.length * 100)}%]`);
			log.trace('Visszatérés a számla listához');
			await dijnet.sleep(3);
			await dijnet.szamla_list(tmp(`szamla_list_${invoice.rowid}.html`));
		}
		log.success('Kész');

		process.exit(0); // Windows 10-en Git Bash-ben különben nem áll le a program valamiért
	} catch (error) {
		log.trace(error.stack);
		log.error(error.message);
		handleError(error);
	}
};

module.exports = { start };

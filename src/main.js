/* eslint-disable no-await-in-loop */
import { getConfig } from './configurator.js';
import DijnetAgent from './dijnet-agent.js';
import DijnetBrowser from './dijnet-browser.js';
import {
	parseBillDownloads,
	parseBillSearchResults,
	parseBillSearchToken,
} from './dijnet-parser.js';
import Logger from './logger.js';
import Repo from './repo.js';

/**
 * Díjnet Bot itself. Loads configuration, initializes components, logs in to
 * Díjnet, searches for bills, iterates over them and downloads every file it
 * founds. Maintains a list of previously completed bills and skips them.
 */
export async function start() {
	const config = await getConfig();
	const logger = new Logger(config).init();
	const repo = new Repo(config, logger).init();
	const browser = new DijnetBrowser(config, logger).init();
	const agent = new DijnetAgent(config, logger, browser);

	logger.info('Bejelentkezés...');
	await agent.login();
	logger.success(`Bejelentkezve: ${config.user}`);

	logger.info('Számlák keresése...');
	await agent.openBillSearch();
	const token = parseBillSearchToken(agent.browser.lastNavigationResponse.body);
	await agent.submitBillSearchForm(token);
	let bills = parseBillSearchResults(agent.browser.lastNavigationResponse.body);
	const allBillsCount = bills.length;
	bills = bills.filter(repo.isNew.bind(repo));
	logger.success(
		`${allBillsCount} db számla van a rendszerben: ${bills.length} db új, ${
			allBillsCount - bills.length
		} db lementve korábban`,
	);

	let billsDownloaded = 0;
	for (let i = 0; i < bills.length; i++) {
		const bill = bills[i];
		const prefix = `${i}/${bills.length} db új számla lementve (${Math.round(
			(i / bills.length) * 100,
		)}%) | ${bill.dateOfIssue} ${bill.serviceProvider}`;
		logger.info(`${prefix} | Megnyitás...`);
		await agent.openBill(bill.rowId);
		await agent.openBillDownloads();

		const files = parseBillDownloads(agent.browser.lastNavigationResponse.body);
		let allFilesDownloaded = true;
		for (let j = 0; j < files.length; j++) {
			const file = files[j];
			logger.info(`${prefix} | [${j + 1}/${files.length}] ${file.name}`);
			const s = await browser.download(file.dijnetPath, repo.directoryFor(bill));
			if (!s) {
				logger.error(`${prefix} | Nem sikerült letölteni: ${file.name}`);
				allFilesDownloaded = false;
			}
		}

		if (allFilesDownloaded) {
			billsDownloaded++;
			repo.markAsDone(bill);
		}

		await agent.openBillList();
	}

	logger.success(`${billsDownloaded} db új számla lementve!`);
	process.exit(0);
}

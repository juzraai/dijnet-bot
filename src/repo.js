const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp').sync;
const Bill = require('./bill'); // eslint-disable-line no-unused-vars
const Config = require('./config');
const Logger = require('./logger');

/**
 * Utility for output directory management and maintaining completed bills.
 */
class Repo {
	/**
	 * @param {Config} config Configuration
	 * @param {Logger} logger Logger
	 */
	constructor(config, logger) {
		this.config = config || new Config();
		this.logger = logger || new Logger(this.config);

		this.crawledBillIds = [];
		this.doneFile = path.join(this.config.outputDir, this.config.doneFile);
	}

	/**
	 * Creates output directory, then loads bill IDs from done-file.
	 *
	 * @returns {Repo} This object
	 */
	init() {
		this.logger.verbose(`Könyvtár létrehozása: ${this.config.outputDir}`);
		mkdirp(this.config.outputDir);

		this.logger.verbose(`Kész-lista beolvasása: ${this.doneFile}`);
		if (fs.existsSync(this.doneFile)) {
			this.crawledBillIds = fs.readFileSync(this.doneFile, 'utf8').split('\n');
		}
		this.logger.verbose(`${this.crawledBillIds.length} db számla van a kimeneti mappában`);

		return this;
	}

	/**
	 * Creates new directory for given bill, returns directory path.
	 *
	 * @param {Bill} bill Bill
	 * @returns {string} Download directory for given bill
	 */
	directoryFor(bill) {
		const d = path.join(this.config.outputDir, `${bill.serviceProvider} - ${bill.billIssuerId}`, bill.dateOfIssue);
		mkdirp(d);
		return d;
	}

	/**
	 * @param {Bill} bill Bill
	 * @returns {boolean} Whether bill is already downloaded completely (false means it is new)
	 */
	isDone(bill) {
		return this.crawledBillIds.includes(this.normalizeBillId(bill));
	}

	/**
	 * @param {Bill} bill Bill
	 * @returns {boolean} Whether bill is new (false means it is already downloaded)
	 */
	isNew(bill) {
		return !this.isDone(bill);
	}

	/**
	 * Marks given bill as downloaded completely.
	 *
	 * @param {Bill} bill Bill
	 */
	markAsDone(bill) {
		fs.appendFileSync(this.doneFile, `${this.normalizeBillId(bill)}\n`);
	}

	/**
	 * Normalizes bill ID by removing newline characters.
	 *
	 * @param {Bill} bill Bill
	 * @returns {string} Normalized bill ID
	 */
	normalizeBillId(bill) {
		return bill.billId.replace(/[\r\n]+/, ' ').trim();
	}
}

module.exports = Repo;

const cheerio = require('cheerio');
const deburr = require('lodash.deburr');
const Bill = require('./bill');
const BillFile = require('./bill-file');

/**
 * @param {string} body Response body, it should be the HTML code of a bill list page
 * @returns {Bill[]} Bills' metadata
 */
function parseBillSearchResults(body) {
	const $ = cheerio.load(body, { normalizeWhitespace: true });
	const thIds = $('table thead th')
		.toArray()
		.map((th) => $(th).attr('id'));
	const TH_ID = {
		billId: 'szl',
		billIssuerId: 'aln',
		dateOfIssue: 'bdt',
		dueDate: 'fdt',
		finalAmount: 'oss',
		payable: 'egy',
		serviceProvider: 'szn',
		status: 'dst',
	};

	function col(id) {
		const i = thIds.indexOf(id);
		if (i === -1) {
			throw new Error(`Nem találom a következő oszlopot: ${id} (talált oszlopok: ${thIds})`);
		}
		return i;
	}

	function cell(tr, headerText) {
		const index = col(headerText);
		const text = $(tr.childNodes[index]).text();
		return text.trim();
	}

	const bills = $('table tbody tr')
		.toArray()
		.map((tr) => {
			const bill = new Bill();
			Object.entries(TH_ID).forEach((e) => {
				const [field, id] = e;
				bill[field] = cell(tr, id);
			});
			bill.billIssuerId = normalize(bill.billIssuerId);
			bill.serviceProvider = normalize(bill.serviceProvider);
			bill.rowId = $(tr)
				.attr('id')
				.match(/r_(\d+)/)[1];
			return bill;
		});
	return bills;
}

/**
 * @param {string} body Response body, it should be the HTML code of a bill's downloads page
 * @returns {BillFile[]} Downloadable files' metadata
 */
function parseBillDownloads(body) {
	const $ = cheerio.load(body, { normalizeWhitespace: true });
	return $('.panel_bs a[href*=_]')
		.toArray()
		.map((a) => new BillFile(normalize($(a).text()), `/control/${a.attribs.href}`))
		.filter((bf) => !bf.dijnetPath.includes('://'));
}

/**
 * @param {string} s String to be normalized
 * @returns {string} Normalizes input string by removing accents (á -> a), and removing non-alphanumeric characters.
 */
function normalize(s) {
	return deburr(s)
		.replace(/[^a-z0-9\-_]+/gi, ' ')
		.trim();
}

module.exports = {
	normalize,
	parseBillSearchResults,
	parseBillDownloads,
};

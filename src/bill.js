/**
 * Represents bill metadata.
 */
export default class Bill {
	/**
	 * @param {Bill} data Bill metadata available on Díjnet
	 * @param {string} data.rowId Row ID in search results
	 * @param {string} data.serviceProvider Service provider
	 * @param {string} data.billIssuerId Bill issuer ID
	 * @param {string} data.billId Bill ID
	 * @param {string} data.dateOfIssue Date of issue
	 * @param {string} data.finalAmount Final amount
	 * @param {string} data.dueDate Due date
	 * @param {string} data.payable Payable
	 * @param {string} data.status Status
	 */
	constructor(data) {
		data = data || {};
		this.rowId = data.rowId;
		this.serviceProvider = data.serviceProvider;
		this.billIssuerId = data.billIssuerId;
		this.billId = data.billId;
		this.dateOfIssue = data.dateOfIssue;
		this.finalAmount = data.finalAmount;
		this.dueDate = data.dueDate;
		this.payable = data.payable;
		this.status = data.status;
	}
}

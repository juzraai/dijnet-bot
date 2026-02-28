import Config from './config.js';
import DijnetBrowser from './dijnet-browser.js';
import Logger from './logger.js';

/**
 * Provides an API to Díjnet's functions / links. Knows which page depends on
 * which another page, throws errors if functions called in wrong order.
 */
export default class DijnetAgent {
	/**
	 * @param {Config} config Configuration
	 * @param {Logger} logger Logger
	 * @param {DijnetBrowser} dijnetBrowser DijnetBrowser
	 */
	constructor(config, logger, dijnetBrowser) {
		this.config = config || new Config();
		this.logger = logger || new Logger(this.config);
		this.browser = dijnetBrowser || new DijnetBrowser(this.config, this.logger);
	}

	/**
	 * Logs in to Díjnet.
	 */
	async login() {
		const body = new URLSearchParams({
			// eslint-disable-next-line camelcase
			vfw_form: 'login_check_password',
			username: this.config.user,
			password: this.config.pass,
		}).toString();
		await this.browser.submit('/login/login_check_password', body);
		this.checkIfLoggedIn();
	}

	/**
	 * Opens bill search page.
	 */
	async openBillSearch() {
		this.checkBillSearchLink();
		await this.browser.navigate('/control/szamla_search');
	}

	/**
	 * Submits bill search form.
	 */
	async submitBillSearchForm(token) {
		this.checkIfLoggedIn();
		this.checkBillSearchForm();
		const body = `vfw_form=szamla_search_submit&vfw_token=${token}&vfw_coll=szamla_search_params&szlaszolgnev=&regszolgid=&datumtol=&datumig=`;
		await this.browser.submit('/control/szamla_search_submit', body);
	}

	/**
	 * Opens a bill.
	 *
	 * @param {string} rowId Bill's row ID
	 */
	async openBill(rowId) {
		this.checkIfLoggedIn();
		this.checkBillSelectCode();
		await this.browser.navigate(
			`/control/szamla_select?vfw_coll=szamla_list&vfw_rowid=${rowId}`,
		);
	}

	/**
	 * Opens download page of the previously opened bill.
	 */
	async openBillDownloads() {
		this.checkIfLoggedIn();
		this.checkBillDownloadsLink();
		await this.browser.navigate('/control/szamla_letolt');
	}

	/**
	 * Opens bill list, which will display the results of the previous search.
	 */
	async openBillList() {
		this.checkIfLoggedIn();
		await this.browser.navigate('/control/szamla_list');
	}

	checkIfLoggedIn() {
		this.check('logged_menu', 'Nem vagyunk bejelentkezve');
		this.checkBillSearchLink();
	}

	checkBillSearchLink() {
		this.check(
			'href="/ekonto/control/szamla_search"',
			'Számlakereső link nem található / nem vagyunk bejelentkezve',
		);
	}

	checkBillSearchForm() {
		this.check(
			'action="szamla_search_submit"',
			'Számlakereső form nem található / nem a számlakereső oldalon vagyunk',
		);
	}

	checkBillSelectCode() {
		this.check(
			"clickSzamla('szamla_select'",
			'Számla kiválasztás kódja nem található / nem a keresési találatok oldalán vagyunk',
		);
	}

	checkBillDownloadsLink() {
		this.check(
			'href="/ekonto/control/szamla_letolt"',
			'Számla letöltés link nem található / nem egy megnyitott számla oldalán vagyunk',
		);
	}

	check(requiredContent, errorMessage) {
		if (!this.browser.lastNavigationResponse.body.includes(requiredContent)) {
			throw new Error(errorMessage);
		}
	}
}

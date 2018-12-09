require('dotenv').config();
const dijnet = require('./lib');
const log = require('./logger');

(async () => {
	try {
		await dijnet.login(process.env.DIJNET_USER, process.env.DIJNET_PASS);
		await dijnet.sleep(3);
		await dijnet.szamla_search();
		await dijnet.sleep(3);
		const szamla_list_response = await dijnet.szamla_search_submit();
		const invoices = dijnet.parse_szamla_list(szamla_list_response.body);
		log.success('%d db számlánk van', invoices.length);
		// TODO iterate invoices, create dirs, check files, download files
	} catch (error) {
		log.error(error.message);
	}
})();

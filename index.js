require('dotenv').config();
const dijnet = require('./lib');
const log = require('./logger');

(async () => {
	try {
		await dijnet.login(process.env.DIJNET_USER, process.env.DIJNET_PASS);
		await dijnet.sleep(3);
		await dijnet.szamla_search();
	} catch (error) {
		log.error(error.message);
	}
})();

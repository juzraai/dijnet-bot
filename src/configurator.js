const dotenv = require('dotenv');
const cli = require('./cli');
const Config = require('./config');

/**
 * Fetches configuration from environment variables (.env) and command line
 * arguments in this order. If user or pass is missing at the end,
 * it will print out help and exit.
 *
 * @returns {Config} Configuration
 */
async function getConfig() {
	const config = new Config(); // default configuration
	const program = cli.getCli(config);

	loadEnv(config);
	loadArgs(program, config);
	if (!config.user || !config.pass) {
		program.help();
	}

	if (!config.tty && !config.quiet) {
		config.verbose = true;
	}

	return config;
}

/**
 * @param {Config} config Configuration to be updated
 * @returns {Config} The same configuration which is also updated
 */
function loadEnv(config) {
	dotenv.config();
	config.outputDir = process.env.OUTPUT_DIR || config.outputDir;
	config.pass = process.env.DIJNET_PASS || config.pass;

	config.sleep = Math.max(parseInt(process.env.SLEEP || 0, 10), config.sleep);
	config.tempDir = process.env.TEMP_DIR || config.tempDir;
	config.user = process.env.DIJNET_USER || config.user;

	const logLevel = parseInt(process.env.LOG_LEVEL || 2, 10); // for backward compatibility

	const verboseV1 = logLevel > 2;
	const verboseV2 = (process.env.LOG_MODE || '').toLowerCase() === 'verbose';
	if (verboseV1 || verboseV2) {
		config.quiet = false;
		config.verbose = true;
	}

	const quietV1 = logLevel === 0;
	const quietV2 = (process.env.LOG_MODE || '').toLowerCase() === 'quiet';
	if (quietV1 || quietV2) {
		config.quiet = true;
		config.verbose = false;
	}

	return config;
}

/**
 * @param {commander.Command} program Commander.js program definiton
 * @param {Config} config Configuration to be updated
 * @returns {Config} The same configuration which is also updated
 */
function loadArgs(program, config) {
	program.parse(process.argv);

	config.outputDir = program.outputDir || config.outputDir;
	config.pass = program.pass || config.pass;
	config.sleep = Math.max(parseInt(program.sleep || 0, 10), new Config().sleep); // env maybe modified, but CLI supposed to overwrite it, we have to maximize for default value
	config.tempDir = program.tempDir || config.tempDir;
	config.user = program.user || config.user;

	if (program.verbose) {
		config.quiet = false;
		config.verbose = true;
	}

	if (program.quiet) {
		config.quiet = true;
		config.verbose = false;
	}
	return config;
}

module.exports = { getConfig };

const dotenv = require('dotenv');
const cli = require('./cli');

// Load environment variables and defaults
dotenv.config();
process.env.LOG_LEVEL = 2;
process.env.OUTPUT_DIR = process.env.OUTPUT_DIR || './szamlak';
process.env.SLEEP = process.env.SLEEP || 3;
process.env.TEMP_DIR = process.env.TEMP_DIR || '';

// Load command line arguments
cli.config();

// Auto print help
if (!process.env.DIJNET_USER || !process.env.DIJNET_PASS) {
	cli.printHelpAndExit();
}

/**
 * Represents Dijnet Bot configuration.
 */
export default class Config {
	/**
	 * @param {Config} data Configuration
	 * @param {string} doneFile Name of the file (relative to outputDir) where completed bills will be listed
	 * @param {string} errorFile Name of the file where error log will be written
	 * @param {string} outputDir Path to output directory where bills' files will be stored
	 * @param {string} pass Díjnet password
	 * @param {boolean} quiet Quiet mode, true means nothing will be written to standard output
	 * @param {number} sleep Amount of sleep before every request, in seconds
	 * @param {string} tempDir Path to temporary directory where HTML files should be written (optional)
	 * @param {boolean} tty Whether the script runs in an interactive terminal, false means standard output is being redirected
	 * @param {string} user Díjnet username
	 * @param {boolean} verbose Verbose mode, true means every operation will be logged to standard output
	 */
	constructor(data) {
		data = data || {};
		this.doneFile = data.doneFile || 'kesz.txt'; // relative to outputDir!
		this.errorFile = data.errorFile || './error.log';
		this.outputDir = data.outputDir || './szamlak';
		this.pass = data.pass;
		this.quiet = data.quiet;
		this.sleep = data.sleep || 3;
		this.tempDir = data.tempDir;
		this.tty = data.tty || process.stdout.isTTY;
		this.user = data.user;
		this.verbose = data.verbose;
	}
}

const fs = require('fs');
const kleur = require('kleur');
const packageInfo = require('../package.json');
const Config = require('./config');

function getTimestamp() {
	const now = new Date();
	return now.toISOString().slice(0, 10) + ' ' + now.toLocaleTimeString();
}

/**
 * Logger with quiet and verbose mode, and 4 message types. In non-interactive
 * standard outputs (e.g. redirects), verbose mode will be activated. Verbose
 * mode prints out every log message with a timestamp prefix.
 */
class Logger {
	/**
	 * @param {Config} config Configuration
	 */
	constructor(config) {
		this.config = config || new Config();
	}

	/**
	 * Prints out application version.
	 *
	 * @returns {Logger} This object
	 */
	init() {
		this.log(`DíjnetBot v${packageInfo.version}\n`, kleur.white, true);
		return this;
	}

	/**
	 * Prints out the given message to standard output.
	 *
	 * @param {string} message Message
	 * @param {kleur.Color} colorFunc  Kleur color function
	 * @param {boolean} bold Whether message should be displayed with bold font
	 */
	log(message, colorFunc, bold) {
		if (this.config.quiet) {
			return;
		}

		let s = message;

		if (this.config.verbose) {
			s = s.trim()
				.split('\n')
				.filter(line => line.trim().length > 0)
				.join('\n');
		}

		if (this.config.tty) {
			if (bold) {
				s = kleur.bold(s);
			}
			if (colorFunc) {
				s = colorFunc(s);
			}
		}

		if (this.config.verbose || !this.config.tty) {
			const ts = getTimestamp();
			console.log(s.split('\n').map(line => kleur.reset().gray(`${ts} | `) + line).join('\n'));
			return;
		}

		console.log(s);
	}

	/**
	 * Prints out an error message in red.
	 *
	 * @param {(string|Error)} error Error message or object
	 */
	error(error) {
		this.log(error.message || error, kleur.red, true);
		if (error.stack) {
			const s = '\nHa biztos vagy abban, hogy helyesen konfiguráltad a Díjnet Bot-ot, akkor a hiba a programban lehet.\nKérlek, az alábbi linken nyiss egy új issue-t, másold be a hiba részleteit, és írd le röviden, milyen szituációban jelentkezett a hiba!\n\n-->  https://github.com/juzraai/dijnet-bot/issues\n\n';
			this.log(s, kleur.red, true);
			try {
				fs.writeFileSync(this.config.errorFile, `${getTimestamp()}: ${error.message}\n${error.stack}`);
				this.log(`A hiba részleteit megtalálod a(z) ${this.config.errorFile} fájlban.`, kleur.red, true);
			} catch (_) {
				this.log('A hiba részletei:', kleur.red, true);
				this.log(error.stack, kleur.red, false, false);
			}
		}
	}

	/**
	 * Prints out a success message in green.
	 *
	 * @param {string} message Message indicating success
	 */
	success(message) {
		this.log(message, kleur.green, true);
	}

	/**
	 * Prints out an info message.
	 *
	 * @param {string} message Message informing about an operation in progress
	 */
	info(message) {
		this.log(message, null, false);
	}

	/**
	 * Prints out a verbose-level (trace) message in grey.
	 *
	 * @param {string} message Message describing a detail of a process
	 */
	verbose(message) {
		if (this.config.verbose) {
			this.log(message, kleur.grey, false);
		}
	}
}

module.exports = Logger;

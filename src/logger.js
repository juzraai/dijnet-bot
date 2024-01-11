const fs = require('fs');
const kleur = require('kleur');
const packageInfo = require('../package.json');
const Config = require('./config');

function getTimestamp() {
	const now = new Date();
	return now.toISOString().slice(0, 10) + ' ' + now.toLocaleTimeString();
}

/**
 * Logger with 3 operating modes (quiet, verbose and progress display) and 4
 * message types. On interactive terminals and in non-quiet, non-verbose mode,
 * some lines will be overwritten by the next to make the screen as clean as
 * possible, for better understaning of the bot's progress. In non-interactive
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
		this.log(
			`${kleur.green('Díjnet')}${kleur.blue('Bot')} v${packageInfo.version} ${kleur.reset(
				'by juzraai | https://github.com/juzraai/dijnet-bot',
			)}\n`,
			kleur.white,
			true,
			true,
			false,
		);
		return this;
	}

	/**
	 * Prints out the given message to standard output. Clears the current
	 * line before writing out the message. Applying newlines before or
	 * after the message is configurable.
	 *
	 * @param {string} message Message
	 * @param {kleur.Color} colorFunc  Kleur color function
	 * @param {boolean} bold Whether message should be displayed with bold font
	 * @param {boolean} closeLineAfter Whether newline is needed after message (otherwise the current line will be overwritten by the next one)
	 * @param {boolean} closeLineBefore Whether newline is needed before message (otherwise the current line will overwrite the previous one)
	 */
	log(message, colorFunc, bold, closeLineAfter, closeLineBefore) {
		if (this.config.quiet) {
			return;
		}

		let s = message;

		if (this.config.verbose) {
			s = s
				.trim()
				.split('\n')
				.filter((line) => line.trim().length > 0)
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
			console.log(
				s
					.split('\n')
					.map((line) => kleur.reset().gray(`${ts} | `) + line)
					.join('\n'),
			);
			return;
		}

		// not quiet, not verbose, not TTY -> progress screen!

		if (closeLineBefore) {
			process.stdout.write('\n');
		}

		process.stdout.clearLine();
		process.stdout.cursorTo(0);
		process.stdout.write(s);
		if (closeLineAfter) {
			process.stdout.write('\n');
		}
	}

	/**
	 * Prints out an error message in red. Makes sure it will be printed into a
	 * new line and also closes the line after the message to prevent
	 * overwrites. If error stack is available it will be printed to file.
	 *
	 * @param {(string|Error)} error Error message or object
	 */
	error(error) {
		this.log(error.message || error, kleur.red, true, true, true);
		if (error.stack) {
			const s =
				'\nHa biztos vagy abban, hogy helyesen konfiguráltad a Díjnet Bot-ot, akkor a hiba a programban lehet.\nKérlek, az alábbi linken nyiss egy új issue-t, másold be a hiba részleteit, és írd le röviden, milyen szituációban jelentkezett a hiba!\n\n-->  https://github.com/juzraai/dijnet-bot/issues\n\n';
			this.log(s, kleur.red, true, false);
			try {
				fs.writeFileSync(
					this.config.errorFile,
					`${getTimestamp()}: ${error.message}\n${error.stack}`,
				);
				this.log(
					`A hiba részleteit megtalálod a(z) ${this.config.errorFile} fájlban.`,
					kleur.red,
					true,
				);
			} catch (_) {
				this.log('A hiba részletei:', kleur.red, true, false);
				this.log(error.stack, kleur.red, false, false);
			}
		}
	}

	/**
	 * Prints out a success message in green. Overwrites the previous line, but
	 * makes sure this message won't be overwritten.
	 *
	 * @param {string} message Message indicating success
	 */
	success(message) {
		this.log(message, kleur.green, true, true, false);
	}

	/**
	 * Prints out an info message. Overwrites the previous line and this
	 * message will also be overwritten by the next one.
	 *
	 * @param {string} message Message informing about an operation in progress
	 */
	info(message) {
		this.log(message, null, false, false, false);
	}

	/**
	 * Prints out a verbose-level (trace) message in grey. Overwrites the
	 * previous line and this message will also be overwritten by the next one.
	 *
	 * @param {string} message Message describing a detail of a process
	 */
	verbose(message) {
		if (this.config.verbose) {
			this.log(message, kleur.grey, false, false, false);
		}
	}
}

module.exports = Logger;

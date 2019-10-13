const fs = require('fs');
const chalk = require('chalk');

const fn = './error.log';

function printRed(message) {
	console.log(chalk.red(message));
}

function handleError(error) {
	if (error.message && error.stack) {
		printRed(`\nHa biztos vagy abban, hogy a Díjnet felhasználóneved és jelszavad, valamint a konfigurációs paramétereket helyesen adtad meg, akkor a hiba a programban lehet.\n\nA hiba részleteit megtalálod az ${fn} fájlban. Kérlek, az alábbi linken nyiss egy új issue-t, másold be az ${fn} fájl tartalmát, és írd le röviden, milyen szituációban jelentkezett a hiba!\n\n-->  https://github.com/juzraai/dijnet-bot/issues\n`);
		fs.writeFileSync(fn, `${error.message}\n${error.stack}`);
	} else {
		printRed(error);
	}
	process.exit(1);
}

module.exports = { handleError };

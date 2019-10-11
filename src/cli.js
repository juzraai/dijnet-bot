const program = require('commander');

function config() {
	program
		.name('dijnet-bot')
		.description('Automatikusan lementi az összes számládat. :)')
		.option('-u, --user <name>', 'Díjnet felhasználónév')
		.option('-p, --pass <word>', 'Díjnet jelszó')
		.option('-s, --sleep <sec>', `A Díjnet kérések közötti szünet másodpercben (alapértelmezetten ${process.env.SLEEP})`, parseInt)
		.option('-o, --output-dir <path>', `A kimeneti mappa útvonala, ahová a számlák kerülmek (alapértelmezetten ${process.env.OUTPUT_DIR})`)
		.option('-t, --temp-dir <path>', 'Ha meg van adva, akkor ide menti ki a letöltött HTML lapokat, további kézi elemzés céljára')
		.option('-q, --quiet', 'Csendes mód, nem fog írni a képernyőre')
		.option('-v, --verbose', 'Részletesebb tájékoztatás a folyamatról (alacsonyabb prioritású, mint `-q`)')
		.helpOption('-h, --help', 'Megjeleníti ezeket a sorokat')
		.on('--help', () => {
			console.log('');
			console.log('Példa:');
			console.log('  $ dijnet-bot -u felhasználónév -p jelszó -s 5 -o ./osszes-szamla');
			console.log('');
			console.log('A Díjnet felhasználónév és jelszó megadható környezeti változók formájában is, valamint az aktuális mappában elhelyezett `.env` fájlban is. A változók nevei DIJNET_USER és DIJNET_PASS. Az `.env` fájl szintaxisa a következő:');
			console.log('');
			console.log('DIJNET_USER=felhasználónév');
			console.log('DIJNET_PASS=jelszó');
			console.log('');
		});

	program.parse(process.argv);

	process.env.DIJNET_USER = program.user || process.env.DIJNET_USER;
	process.env.DIJNET_PASS = program.pass || process.env.DIJNET_PASS;
	process.env.OUTPUT_DIR = program.outputDir || process.env.OUTPUT_DIR;
	process.env.SLEEP = Math.max(program.sleep || process.env.SLEEP, 1);
	process.env.TEMP_DIR = program.tempDir || process.env.TEMP_DIR;
	if (program.verbose) {
		process.env.LOG_LEVEL = 4;
	}
	if (program.quiet) {
		process.env.LOG_LEVEL = 0;
	}
}

function printHelpAndExit() {
	program.help();
}

module.exports = {
	config,
	printHelpAndExit
};

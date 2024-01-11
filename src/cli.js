import commander from 'commander';

/** @typedef {import('./config')} Config */

/**
 * Creates a Commander.js program definition.
 *
 * @param {Config} defaultConfig Configuration to be used to print default values
 * @returns {commander.Command} Commander.js program definition
 */
export function getCli(defaultConfig) {
	const program = new commander.Command();
	program
		.name('dijnet-bot')
		.description('Az összes számlád még egy helyen. :)')
		.option('-u, --user <name>', 'Díjnet felhasználónév')
		.option('-p, --pass <word>', 'Díjnet jelszó')
		.option(
			'-s, --sleep <sec>',
			`A Díjnet kérések közötti szünet másodpercben (alapértelmezetten ${defaultConfig.sleep})`,
			parseInt,
		)
		.option(
			'-o, --output-dir <path>',
			`A kimeneti mappa útvonala, ahová a számlák kerülmek (alapértelmezetten ${defaultConfig.outputDir})`,
		)
		.option(
			'-t, --temp-dir <path>',
			'Ha meg van adva, akkor ide menti ki a letöltött HTML lapokat és cookie-kat, további kézi elemzés céljára',
		)
		.option('-q, --quiet', 'Csendes mód, nem fog írni a képernyőre')
		.option(
			'-v, --verbose',
			'Részletesebb tájékoztatás a folyamatról (alacsonyabb prioritású, mint `-q`)',
		)
		.helpOption('-h, --help', 'Megjeleníti ezeket a sorokat')
		.on('--help', () => {
			console.log('');
			console.log('Példa:');
			console.log('  $ node dijnet-bot -u felhasználónév -p jelszó -s 5 -o ./osszes-szamla');
			console.log('');
			console.log(
				'A Díjnet felhasználónév és jelszó megadható környezeti változók formájában is, valamint az aktuális mappában elhelyezett `.env` fájlban is. A változók nevei DIJNET_USER és DIJNET_PASS. Az `.env` fájl szintaxisa a következő:',
			);
			console.log('');
			console.log('DIJNET_USER=felhasználónév');
			console.log('DIJNET_PASS=jelszó');
			console.log('');
		});
	return program;
}

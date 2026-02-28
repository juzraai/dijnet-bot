import fs from 'fs';
import esbuild from 'esbuild';

const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
// reading instead of importing is intentional here

const OUTPUT_FILE = 'dist/dijnet-bot.cjs';

const banner = `
/*
	Díjnet Bot v${packageJson.version}
	${packageJson.homepage}
	Licensed under ${packageJson.license}
*/
`;

console.log('Bundling...');
console.time('Bundling done in');
await esbuild.build({
	banner: {
		js: banner,
	},
	bundle: true,
	entryPoints: ['index.ts'],
	format: 'cjs',
	minify: true,
	outfile: OUTPUT_FILE,
	platform: 'node',
	target: 'node24',
});
console.timeEnd('Bundling done in');
console.log(OUTPUT_FILE, Math.round((fs.statSync(OUTPUT_FILE).size / 1024) * 10) / 10, 'KB');

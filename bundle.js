import fs from 'fs';
import esbuild from 'esbuild';

const OUTPUT_FILE = 'dijnet-bot.js';

const banner = `
/*
	Díjnet Bot v${process.env.npm_package_version}
	${process.env.npm_package_homepage}
	Licensed under ${process.env.npm_package_license}
*/
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
`;

console.log('Bundling...');
console.time('Bundling done in');
await esbuild.build({
	banner: {
		js: banner,
	},
	bundle: true,
	entryPoints: ['index.js'],
	minify: true,
	outfile: OUTPUT_FILE,
	platform: 'node',
});
console.timeEnd('Bundling done in');
console.log(OUTPUT_FILE, Math.round((fs.statSync('dijnet-bot.js').size / 1024) * 10) / 10, 'KB');

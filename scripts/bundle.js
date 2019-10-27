/*
	This script calls Browserify then Terser on index.js to create a
	single-file bundle from Díjnet Bot. This way end-users will only need to
	install Node, they won't have to run NPM and store 10MB+ of dependencies.

	Call this script via `npm run bundle`.
*/

const fs = require('fs');
const browserify = require('browserify');
const banner = require('browserify-banner');
const terser = require('terser');

const INPUT_FILE = './index.js';
const OUTPUT_FILE ='./dijnet-bot.js';

/** @type {browserify.Options} */
const browserifyOptions = {
	// --node
	bare: true,
	browserField: false
};

const bannerOptions = {
	template: `
<%= pkg.name %> v<%= pkg.version %>
<%= pkg.description %>

<%= pkg.homepage %>

@author <%= pkg.author %>
@license <%= pkg.license %>`.trim()
};

console.log('Running Browserify to create bundle...');
browserify(INPUT_FILE, browserifyOptions)
	.plugin(banner, bannerOptions)
	.bundle((error, buffer) => {
		if (error) {
			throw error;
		}
		const bundle = buffer.toString();
		console.log(`Bundle size:   ${Math.floor(bundle.length / 1024 / 10) * 10} KB`);

		console.log('Running Terser to minify bundle...');
		const minified = terser.minify(bundle).code;
		console.log(`Minified size: ${Math.floor(minified.length / 1024 / 10) * 10} KB`);

		fs.writeFileSync(OUTPUT_FILE, minified);
	});

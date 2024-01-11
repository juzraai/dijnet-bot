#!/usr/bin/env node
const SingleInstance = require('single-instance');
const Logger = require('./src/logger');
const { start } = require('./src/main');

new SingleInstance('dijnet-bot')
	.lock()
	.then(start)
	.catch((error) => {
		try {
			new Logger().error(
				error.stack ? error : 'A Díjnet bot már fut, és nem futtatható több példányban.',
			);
		} catch (error2) {
			// in case Logger is also dead
			console.log(error2);
		}

		process.exit(1);
	});

#!/usr/bin/env node
import SingleInstance from 'single-instance';
import Logger from './src/old/logger.js';
import { start } from './src/old/main.js';

(async () => {
	try {
		const singleInstance = new SingleInstance('dijnet-bot');
		await singleInstance.lock();
		start();
	} catch (error: unknown) {
		try {
			new Logger().error(
				error && typeof error === 'object' && 'stack' in error
					? error
					: 'A Díjnet bot már fut, és nem futtatható több példányban.',
			);
		} catch (error2) {
			// in case Logger is also dead
			console.log(error2);
		}

		process.exit(1);
	}
})();

#!/usr/bin/env node
import SingleInstance from 'single-instance';
import Logger from './src/logger';
import { start } from './src/main';

try {
	const singleInstance = new SingleInstance('dijnet-bot');
	await singleInstance.lock();
	start();
} catch (error) {
	try {
		new Logger().error(
			error.stack ? error : 'A Díjnet bot már fut, és nem futtatható több példányban.',
		);
	} catch (error2) {
		// in case Logger is also dead
		console.log(error2);
	}

	process.exit(1);
}

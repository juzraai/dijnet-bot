#!/usr/bin/env node
const SingleInstance = require('single-instance');
const { start } = require('./src/main');
const { handleError } = require('./src/err');

new SingleInstance('dijnet-bot').lock().then(start).catch(error => {
	handleError(error.stack ? error : 'A Díjnet bot már fut, és nem futtatható több példányban.');
});

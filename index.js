#!/usr/bin/env node
const SingleInstance = require('single-instance');
const { start } = require('./src/main');

new SingleInstance('dijnet-bot').lock().then(start).catch(_ => {
	console.log('A Díjnet bot már fut, és nem futtatható több példányban.');
});

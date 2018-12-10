const chalk = require('chalk');
const { Signale } = require('signale');

const options = {
	types: {
		trace: {
			badge: '…',
			color: 'gray'
		},
		info: {
			badge: '·',
			color: 'blue'
		},
		warn: {
			color: 'yellow'
		},
		error: {
			color: 'red'
		},
		success: {
			color: 'green'
		}
	}
};

const log = new Signale(options);
Object.keys(options.types).forEach(t => {
	const original = log[t];
	log[t] = (...s) => {
		const { color } = options.types[t];
		s[0] = chalk[color](s[0]);
		original(...s);
	};
});

const types = { trace: 4, info: 3, success: 2, error: 1 }; // ezeket használjuk csak
Object.keys(types).forEach(t => {
	const l = types[t];
	if ((process.env.LOG_LEVEL || 4) < l) {
		log[t] = () => {};
	}
});

module.exports = log;

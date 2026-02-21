import xo from 'eslint-config-xo';
import prettier from 'eslint-config-prettier';

export default [
	...xo,
	prettier,
	{
		rules: {
			'capitalized-comments': 'off',
		},
	},
];

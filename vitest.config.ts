import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		environment: 'node',
		watchTriggerPatterns: [
			{
				pattern: /index\.ts/,
				testsToRun: () => 'index.test.ts',
			},
		],
	},
});

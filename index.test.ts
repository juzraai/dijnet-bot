import { describe, it, expect, afterEach } from 'vitest';
import { spawn, ChildProcess } from 'child_process';

// Timeout constants (in milliseconds)
const STDOUT_CHECK_TIMEOUT = 1000; // Max time to wait for expected stdout messages

/**
 * Spawn a bot instance with standard arguments
 */
function spawnBotInstance(): ChildProcess {
	return spawn('node', ['index.ts', '-s', '999'], {
		env: {
			...process.env,
			DIJNET_USER: '',
			DIJNET_PASS: '',
		},
		cwd: process.cwd(),
	});
}

/**
 * Helper function to wait for specific output patterns from a process
 */
function waitForOutput(
	process: ChildProcess,
	options: {
		includes?: string[];
		excludes?: string[];
		timeout: number;
	},
): Promise<{
	matched: string | null;
	excluded: string | null;
	timedOut: boolean;
}> {
	return new Promise((resolve) => {
		const timer = setTimeout(() => {
			resolve({ matched: null, excluded: null, timedOut: true });
		}, options.timeout);

		const handleData = (data: Buffer) => {
			const output = data.toString();

			// Check for excluded patterns first
			if (options.excludes) {
				for (const pattern of options.excludes) {
					if (output.includes(pattern)) {
						clearTimeout(timer);
						resolve({ matched: null, excluded: pattern, timedOut: false });
						return;
					}
				}
			}

			// Check for included patterns
			if (options.includes) {
				for (const pattern of options.includes) {
					if (output.includes(pattern)) {
						clearTimeout(timer);
						resolve({ matched: pattern, excluded: null, timedOut: false });
						return;
					}
				}
			}
		};

		process.stdout?.on('data', handleData);
		process.stderr?.on('data', handleData);

		process.on('exit', () => {
			clearTimeout(timer);
		});
	});
}

describe('Single-instance lock', () => {
	let firstProcess: ChildProcess | null = null;
	let secondProcess: ChildProcess | null = null;

	afterEach(() => {
		// Cleanup: kill any remaining processes
		if (firstProcess && !firstProcess.killed) {
			firstProcess.kill('SIGTERM');
		}
		if (secondProcess && !secondProcess.killed) {
			secondProcess.kill('SIGTERM');
		}
		firstProcess = null;
		secondProcess = null;
	});

	it('should prevent second instance from running', async () => {
		// Start first instance with long sleep to keep it running
		firstProcess = spawnBotInstance();

		// Wait for first process to successfully start and reach login
		const firstResult = await waitForOutput(firstProcess, {
			includes: ['felhasználó'],
			timeout: STDOUT_CHECK_TIMEOUT,
		});

		if (firstResult.timedOut) {
			throw new Error('First process failed to start within timeout');
		}

		// Start second instance - should fail with lock error
		secondProcess = spawnBotInstance();

		// Wait for second process to show lock error (and NOT reach login)
		const secondResult = await waitForOutput(secondProcess, {
			includes: ['már fut'],
			excludes: ['Bejelentkezés'],
			timeout: STDOUT_CHECK_TIMEOUT,
		});

		// Verify results
		expect(secondResult.timedOut, 'Second process should exit quickly with lock error').toBe(
			false,
		);
		expect(
			secondResult.excluded,
			'Second process should not reach login - lock should prevent it',
		).toBeNull();
		expect(secondResult.matched, 'Second process should show lock error message').toBe(
			'már fut',
		);
	});
});

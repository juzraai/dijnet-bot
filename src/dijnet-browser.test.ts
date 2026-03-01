import { describe, it, expect } from 'vitest';
import { createClientWithCookieJar } from './dijnet-browser.js';

const TESTED_URL = 'https://www.dijnet.hu/';
const TESTED_COOKIE_NAME = 'HAPROXY_SESSION';
const SLEEP_BETWEEN_REQUESTS_MS = 3000;

describe('Díjnet browser', () => {
	it('should handle cookies correctly', async () => {
		const { client, cookieJar } = createClientWithCookieJar();

		const initialCookies = await cookieJar.getCookies(TESTED_URL);
		expect(initialCookies).toHaveLength(0);

		await client(TESTED_URL);

		const cookiesAfterFirst = await cookieJar.getCookies(TESTED_URL);
		const testedCookieValue = cookiesAfterFirst.find(
			(c) => c.key === TESTED_COOKIE_NAME,
		)?.value;
		expect(testedCookieValue).toBeTruthy();

		await new Promise((resolve) => setTimeout(resolve, SLEEP_BETWEEN_REQUESTS_MS));

		let sentCookies: string | null = null;
		const clientWithSpy = client.extend({
			hooks: {
				beforeRequest: [
					(request) => {
						sentCookies = request.headers.get('cookie');
					},
				],
			},
		});

		await clientWithSpy(TESTED_URL);

		expect(sentCookies).toBeTruthy();
		expect(sentCookies).toContain(`${TESTED_COOKIE_NAME}=${testedCookieValue}`);
	});
});

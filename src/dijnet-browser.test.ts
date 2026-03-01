import { describe, it, expect } from 'vitest';
import { client } from './dijnet-browser.js';
import type { KyRequest, KyResponse, NormalizedOptions } from 'ky';

const TESTED_URL = 'https://www.dijnet.hu/';
const SESSION_COOKIE_NAME = 'HAPROXY_SESSION';
const SLEEP_BETWEEN_REQUESTS_MS = 1000;

describe('Díjnet browser', () => {
	it('should handle cookies correctly', async () => {
		let receivedValue: string | undefined = undefined;
		let sentCookies: string | null = null;

		const testClient = client.extend((options) => ({
			hooks: {
				beforeRequest: [
					...((options.hooks?.beforeRequest as any) ?? []),
					async (request: KyRequest) => {
						sentCookies = request.headers.get('cookie');
					},
				],
				afterResponse: [
					...(options.hooks?.afterResponse ?? []),
					(_request: KyRequest, _options: NormalizedOptions, response: KyResponse) => {
						const cookies = response.headers.getSetCookie();
						const cookie = cookies.find((cookie) =>
							cookie.startsWith(`${SESSION_COOKIE_NAME}=`),
						);
						if (cookie) {
							receivedValue = cookie.split(';')[0]?.split(/=(.*)/s)[1];
						}
						return response;
					},
				],
			},
		}));
		await testClient(TESTED_URL);
		expect(receivedValue).toBeTruthy();

		// rate limiting
		await new Promise((resolve) => setTimeout(resolve, SLEEP_BETWEEN_REQUESTS_MS));

		sentCookies = null; // reset before second request
		await testClient(TESTED_URL);
		expect(sentCookies).toBeTruthy();
		expect(sentCookies).toContain(`${SESSION_COOKIE_NAME}=${receivedValue}`);
	});
});

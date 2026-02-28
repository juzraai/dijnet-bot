import fs from 'fs';
import ky from 'ky';
import { Cookie, CookieJar } from 'tough-cookie';

const cookieJar = new CookieJar();

const client = ky.create({
	headers: {
		accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
		'accept-language': 'hu-HU,hu;q=0.9,en-US;q=0.8,en;q=0.7',
		'user-agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:148.0) Gecko/20100101 Firefox/148.0',
	},
	hooks: {
		beforeRequest: [
			async (request) => {
				const cookies = await cookieJar.getCookieString(request.url);
				request.headers.set('cookie', cookies);
			},
		],
		afterResponse: [
			async (_request, _options, response) => {
				const setCookies = response.headers.getSetCookie();
				for (const setCookie of setCookies) {
					const cookie = Cookie.parse(setCookie);
					if (cookie) {
						await cookieJar.setCookie(cookie, response.url);
					}
				}
				return response;
			},
		],
	},
});

function request(url: string, formData: FormData | null = null) {
	return client(url, {
		method: formData ? 'POST' : 'GET',
		body: formData,
	}).arrayBuffer();
}

export async function dijnetRequest(dijnetPath: string, formData: FormData | null = null) {
	const url = new URL(dijnetPath, 'https://www.dijnet.hu/ekonto');
	return request(url.toString(), formData);
}

export async function getDijnetPage(
	url: string,
	encoding: string = 'utf-8',
	body: FormData | null = null,
) {
	const buffer = await dijnetRequest(url, body);
	return new TextDecoder(encoding).decode(buffer);
}

export async function downloadDijnetFile(url: string, filename: string) {
	const buffer = await dijnetRequest(url);
	await fs.writeFileSync(filename, Buffer.from(buffer));
}

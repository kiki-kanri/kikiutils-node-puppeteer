import { executablePath, PuppeteerLaunchOptions } from 'puppeteer';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

import PuppeteerBrowser from './browser';

interface ExtraOptions extends PuppeteerLaunchOptions {
	userAgent?: string;
}

puppeteer.use(StealthPlugin());
const defaultOptions: ExtraOptions = {
	userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36'
};

export const getPuppeteerBrowser = async (extraOptions?: ExtraOptions, replaceArgs: boolean = false) => {
	if (!extraOptions) extraOptions = { ...defaultOptions };
	if (!extraOptions.userAgent) extraOptions.userAgent = defaultOptions.userAgent;
	const options: PuppeteerLaunchOptions = {
		args: [
			'--arc-disable-app-sync',
			'--autoplay-policy=no-user-gesture-required',
			'--disable-background-networking',
			'--disable-blink-features=AutomationControlled',
			'--disable-default-apps',
			'--disable-dev-shm-usage',
			'--disable-extensions',
			'--disable-gpu',
			'--disable-setuid-sandbox',
			'--disable-software-rasterizer',
			'--disable-stack-profiler',
			'--metrics-recording-only',
			'--no-default-browser-check',
			'--no-first-run',
			'--no-sandbox',
			'--no-startup-window',
			'--no-zygote'
		],
		defaultViewport: null,
		dumpio: false,
		executablePath: executablePath(),
		headless: false,
		ignoreDefaultArgs: false,
		ignoreHTTPSErrors: true,
		userDataDir: './.cache/pyppeteer_browsers/main',
		waitForInitialPage: false
	};

	if (!replaceArgs) {
		options.args?.push(...(extraOptions.args || []));
		delete extraOptions.args;
	}

	options.args?.push(`--user-agent=${extraOptions.userAgent}`);
	delete extraOptions.userAgent;
	const browser = await puppeteer.launch({ ...options, ...extraOptions });
	const puppeteerBrowser = new PuppeteerBrowser(browser);
	const firstPage = (await browser.pages())[0];
	if (firstPage) await firstPage.setExtraHTTPHeaders({ 'Accept-Language': 'zh-TW' });
	return puppeteerBrowser;
}

export { PuppeteerBrowser }
export { default as PuppeteerBrowserPage } from './page';
export * from './utils';

import { executablePath, PuppeteerLaunchOptions } from 'puppeteer';
import puppeteer from 'puppeteer-extra';
import { PuppeteerExtraPlugin } from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

import PuppeteerBrowser from './browser';
import { ExtraOptions } from './types';

const stealthPlugin = StealthPlugin();

// Remove evasions when platform is windows.
if (process.platform === 'win32') {
	stealthPlugin.enabledEvasions.delete('navigator.languages');
	stealthPlugin.enabledEvasions.delete('user-agent-override');
}

puppeteer.use(stealthPlugin as unknown as PuppeteerExtraPlugin);
const defaultOptions: ExtraOptions = {
	userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36'
};

export const getPuppeteerBrowser = async (extraOptions: ExtraOptions = { ...defaultOptions }, replaceArgs: boolean = false) => {
	if (extraOptions.userAgent === undefined) extraOptions.userAgent = defaultOptions.userAgent;
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

	if (extraOptions.userAgent) options.args?.push(`--user-agent=${extraOptions.userAgent}`);
	delete extraOptions.userAgent;
	if (options.args) options.args = [...new Set(options.args)];
	const browser = await puppeteer.launch({ ...options, ...extraOptions });
	const puppeteerBrowser = new PuppeteerBrowser(browser);
	const firstPage = (await browser.pages())[0];
	if (firstPage) await firstPage.setExtraHTTPHeaders({ 'Accept-Language': 'zh-TW' });
	return puppeteerBrowser;
}

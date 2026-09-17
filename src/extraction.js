const cheerio = require('cheerio');
const { assertPublicHost } = require('./security');

const FETCH_TIMEOUT_MS = 10000;
const MAX_PAGE_BYTES = 1024 * 1024;
const MAX_PAGES = 5;
const PAGE_HINTS = /about|service|product|solution|industry|pricing|contact/i;

function cleanText(value) {
  return value.replace(/\s+/g, ' ').trim();
}

function extractPage(html, url) {
  const $ = cheerio.load(html);
  $('script, style, noscript, svg, nav, footer, header, form').remove();
  const title = cleanText($('title').first().text()) || null;
  const description = cleanText($('meta[name="description"]').attr('content') || '') || null;
  const headings = $('h1, h2, h3').map((_, element) => cleanText($(element).text())).get().filter(Boolean).slice(0, 30);
  const paragraphs = $('p, li').map((_, element) => cleanText($(element).text())).get().filter(text => text.length > 25).slice(0, 120);
  const text = cleanText([title, description, headings.join('. '), paragraphs.join('. ')].filter(Boolean).join('. '));
  return { url, title, description, headings, text: text.slice(0, 16000) };
}

function discoverLinks(html, baseUrl) {
  const $ = cheerio.load(html);
  const base = new URL(baseUrl);
  const links = $('a[href]').map((_, element) => $(element).attr('href')).get();
  return [...new Set(links.map(href => {
    try {
      const url = new URL(href, base);
      url.hash = '';
      return url;
    } catch {
      return null;
    }
  }).filter(url => url && url.origin === base.origin && url.protocol === base.protocol && PAGE_HINTS.test(`${url.pathname} ${url.href}`)).map(url => url.toString()))].slice(0, MAX_PAGES - 1);
}

async function fetchHtml(url, fetchImpl = fetch, redirectCount = 0) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const response = await fetchImpl(url, { signal: controller.signal, redirect: 'manual', headers: { 'User-Agent': 'ProspectIntelligenceAgent/1.0 (+research demo)' } });
    if (response.status >= 300 && response.status < 400) {
      if (redirectCount >= 3) throw new Error('The website redirected too many times.');
      const location = response.headers.get('location');
      if (!location) throw new Error('The website returned an invalid redirect.');
      const redirectedUrl = new URL(location, url).toString();
      await assertPublicHost(redirectedUrl);
      return fetchHtml(redirectedUrl, fetchImpl, redirectCount + 1);
    }
    if (!response.ok) throw new Error(`The website returned HTTP ${response.status}.`);
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('text/html')) throw new Error('The supplied URL did not return an HTML page.');
    const contentLength = Number(response.headers.get('content-length') || 0);
    if (contentLength > MAX_PAGE_BYTES) throw new Error('The page is too large to analyze.');
    const html = await response.text();
    if (Buffer.byteLength(html, 'utf8') > MAX_PAGE_BYTES) throw new Error('The page is too large to analyze.');
    return html;
  } finally {
    clearTimeout(timeout);
  }
}

async function extractWebsite(url, fetchImpl = fetch) {
  const homepageHtml = await fetchHtml(url, fetchImpl);
  const homepage = extractPage(homepageHtml, url);
  if (!homepage.text) throw new Error('No readable public content was found on that website.');

  const pages = [homepage];
  for (const link of discoverLinks(homepageHtml, url)) {
    try {
      const page = extractPage(await fetchHtml(link, fetchImpl), link);
      if (page.text) pages.push(page);
    } catch {
      // One unavailable secondary page should not discard the usable homepage.
    }
  }

  return { pages, combinedText: pages.map(page => `SOURCE: ${page.url}\n${page.text}`).join('\n\n').slice(0, 60000) };
}

module.exports = { extractPage, extractWebsite, fetchHtml, discoverLinks };
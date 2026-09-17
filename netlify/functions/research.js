const { randomUUID } = require('node:crypto');
const { extractWebsite } = require('../../src/extraction');
const { createLocalResearch } = require('../../src/local-research');
const { assertPublicHost, normalizeUrl } = require('../../src/security');
const { validateResearch } = require('../../src/schema');

const responseHeaders = { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' };
const requestLog = new Map();
const MAX_BODY_BYTES = 12000;
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT = 10;

function json(statusCode, body) {
  return { statusCode, headers: responseHeaders, body: JSON.stringify(body) };
}

function errorCode(error) {
  if (/URL|website URL|HTTP and HTTPS|credentials|Private|local network/i.test(error.message)) return 'INVALID_URL';
  if (/timeout|aborted/i.test(error.message)) return 'FETCH_TIMEOUT';
  if (/readable|HTML|HTTP|page is too large/i.test(error.message)) return 'EXTRACTION_FAILED';
  return 'INTERNAL_ERROR';
}

function clientKey(event) {
  return (event.headers?.['x-forwarded-for'] || event.headers?.['client-ip'] || 'anonymous').split(',')[0].trim();
}

function isRateLimited(key) {
  const now = Date.now();
  const recent = (requestLog.get(key) || []).filter(timestamp => now - timestamp < RATE_WINDOW_MS);
  recent.push(now);
  requestLog.set(key, recent);
  return recent.length > RATE_LIMIT;
}

async function handleResearch(event) {
  if (event.httpMethod !== 'POST') return json(405, { success: false, error: { code: 'METHOD_NOT_ALLOWED', message: 'Use POST for research requests.', retryable: false } });
  if (isRateLimited(clientKey(event))) return json(429, { success: false, error: { code: 'RATE_LIMITED', message: 'Too many research requests. Please try again later.', retryable: true } });
  if (Buffer.byteLength(event.body || '', 'utf8') > MAX_BODY_BYTES) return json(413, { success: false, error: { code: 'REQUEST_TOO_LARGE', message: 'The research request is too large.', retryable: false } });

  let input;
  try {
    input = JSON.parse(event.body || '{}');
  } catch {
    return json(400, { success: false, error: { code: 'INVALID_REQUEST', message: 'The request body must be valid JSON.', retryable: false } });
  }

  try {
    const websiteUrl = normalizeUrl(input.websiteUrl);
    const userOffer = typeof input.userOffer === 'string' ? input.userOffer.trim().slice(0, 2000) : '';
    await assertPublicHost(websiteUrl);
    const startedAt = Date.now();
    const extracted = await extractWebsite(websiteUrl);
    const data = validateResearch(createLocalResearch(extracted, websiteUrl, userOffer));
    return json(200, { success: true, data: { runId: randomUUID(), input: { websiteUrl, userOffer: userOffer || null }, ...data, sources: extracted.pages.map(page => ({ url: page.url, title: page.title, pagesFetched: extracted.pages.length })), metadata: { generatedAt: new Date().toISOString(), provider: 'local-deterministic', processingTimeMs: Date.now() - startedAt } } });
  } catch (error) {
    const code = error.name === 'ZodError' || error instanceof SyntaxError ? 'MALFORMED_RESPONSE' : errorCode(error);
    const status = code === 'INVALID_URL' ? 400 : code === 'FETCH_TIMEOUT' ? 504 : code === 'MALFORMED_RESPONSE' ? 502 : 502;
    const message = code === 'MALFORMED_RESPONSE' ? 'The local research provider returned an invalid structure. Please try again.' : error.message || 'The research request could not be completed.';
    return json(status, { success: false, error: { code, message, retryable: !['INVALID_URL', 'MALFORMED_RESPONSE'].includes(code) } });
  }
}

exports.handler = async function handler(event) {
  try {
    return await handleResearch(event);
  } catch {
    return json(500, { success: false, error: { code: 'INTERNAL_ERROR', message: 'The research service encountered an unexpected error. Please try again.', retryable: true } });
  }
};
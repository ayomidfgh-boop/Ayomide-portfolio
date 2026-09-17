const dns = require('node:dns').promises;
const net = require('node:net');

const MAX_URL_LENGTH = 2048;

function isPrivateIp(address) {
  if (net.isIPv4(address)) {
    const [first, second] = address.split('.').map(Number);
    return first === 10 || first === 127 || (first === 169 && second === 254) || (first === 172 && second >= 16 && second <= 31) || (first === 192 && second === 168) || first === 0;
  }

  if (net.isIPv6(address)) {
    const normalized = address.toLowerCase();
    return normalized === '::1' || normalized === '::' || normalized.startsWith('fc') || normalized.startsWith('fd') || normalized.startsWith('fe80:');
  }

  return false;
}

function normalizeUrl(value) {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error('Please enter a company website URL.');
  }

  const trimmed = value.trim();
  if (trimmed.length > MAX_URL_LENGTH) throw new Error('The website URL is too long.');

  let parsed;
  try {
    parsed = new URL(trimmed);
  } catch {
    throw new Error('Enter a complete website URL, including https://.');
  }

  if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error('Only public HTTP and HTTPS websites are supported.');
  if (!parsed.hostname || parsed.username || parsed.password) throw new Error('Enter a public website URL without login credentials.');
  if (parsed.hostname === 'localhost' || parsed.hostname.endsWith('.local') || isPrivateIp(parsed.hostname)) throw new Error('Private and local network addresses are not allowed.');

  parsed.hash = '';
  return parsed.toString();
}

async function assertPublicHost(url) {
  const parsed = new URL(url);
  if (isPrivateIp(parsed.hostname)) throw new Error('Private and local network addresses are not allowed.');

  const addresses = await dns.lookup(parsed.hostname, { all: true });
  if (!addresses.length || addresses.some(({ address }) => isPrivateIp(address))) throw new Error('The website resolves to a private or unavailable network address.');
}

module.exports = { assertPublicHost, isPrivateIp, normalizeUrl };
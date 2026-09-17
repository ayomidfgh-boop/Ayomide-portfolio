const test = require('node:test');
const assert = require('node:assert/strict');
const { isPrivateIp, normalizeUrl } = require('../src/security');

test('normalizes a public URL and removes its fragment', () => {
  assert.equal(normalizeUrl(' https://example.com/about#team '), 'https://example.com/about');
});

test('rejects incomplete, unsupported, and private URLs', () => {
  assert.throws(() => normalizeUrl('example.com'), /complete website URL/);
  assert.throws(() => normalizeUrl('file:///tmp/site.html'), /HTTP and HTTPS/);
  assert.throws(() => normalizeUrl('http://127.0.0.1:3000'), /Private and local/);
  assert.equal(isPrivateIp('192.168.1.2'), true);
  assert.equal(isPrivateIp('8.8.8.8'), false);
});
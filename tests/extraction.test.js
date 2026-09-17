const test = require('node:test');
const assert = require('node:assert/strict');
const { extractPage, extractWebsite } = require('../src/extraction');

const homepage = '<html><head><title>Acme Systems</title><meta name="description" content="Workflow software for operations teams."></head><body><nav>Menu</nav><h1>Operations software</h1><p>Acme helps operations teams manage recurring work.</p><a href="/services">Services</a><script>alert(1)</script></body></html>';
const services = '<html><head><title>Services</title></head><body><h1>Services</h1><p>Implementation and workflow services for growing teams.</p></body></html>';

function response(body, status = 200, contentType = 'text/html') {
  return new Response(body, { status, headers: { 'content-type': contentType } });
}

test('extracts readable content and excludes navigation and scripts', () => {
  const page = extractPage(homepage, 'https://acme.test');
  assert.match(page.text, /Acme helps operations teams/);
  assert.doesNotMatch(page.text, /alert/);
  assert.doesNotMatch(page.text, /Menu/);
});

test('fetches the homepage and a relevant same-domain page', async () => {
  const fetchMock = async url => response(url.endsWith('/services') ? services : homepage);
  const result = await extractWebsite('https://acme.test', fetchMock);
  assert.equal(result.pages.length, 2);
  assert.match(result.combinedText, /Implementation and workflow services/);
});
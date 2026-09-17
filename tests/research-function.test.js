const test = require('node:test');
const assert = require('node:assert/strict');
const { handler } = require('../netlify/functions/research');

test('returns JSON for unsupported methods', async () => {
  const response = await handler({ httpMethod: 'GET', headers: {} });
  assert.equal(response.statusCode, 405);
  assert.match(response.headers['Content-Type'], /application\/json/);
  assert.equal(JSON.parse(response.body).error.code, 'METHOD_NOT_ALLOWED');
});

test('runs the basic research flow without an AI secret', async () => {
  const previousKey = process.env.OPENAI_API_KEY;
  delete process.env.OPENAI_API_KEY;
  const response = await handler({ httpMethod: 'POST', headers: {}, body: JSON.stringify({ websiteUrl: 'https://stripe.com' }) });
  if (previousKey) process.env.OPENAI_API_KEY = previousKey;
  assert.equal(response.statusCode, 200);
  assert.match(response.headers['Content-Type'], /application\/json/);
  const result = JSON.parse(response.body);
  assert.equal(result.success, true);
  assert.equal(result.data.metadata.provider, 'local-deterministic');
  assert.ok(result.data.company.name);
});
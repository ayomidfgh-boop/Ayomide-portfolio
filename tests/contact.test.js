const test = require('node:test');
const assert = require('node:assert/strict');
const { handler } = require('../netlify/functions/contact');

test('returns a JSON configuration error when contact delivery is not configured', async () => {
  const previous = {
    key: process.env.RESEND_API_KEY,
    receiver: process.env.CONTACT_RECEIVER_EMAIL,
    sender: process.env.CONTACT_SENDER_EMAIL
  };
  delete process.env.RESEND_API_KEY;
  delete process.env.CONTACT_RECEIVER_EMAIL;
  delete process.env.CONTACT_SENDER_EMAIL;
  const response = await handler({ httpMethod: 'POST', body: JSON.stringify({ name: 'Ayo', email: 'client@example.com', projectType: 'Website', message: 'A valid project message.' }) });
  Object.assign(process.env, { RESEND_API_KEY: previous.key, CONTACT_RECEIVER_EMAIL: previous.receiver, CONTACT_SENDER_EMAIL: previous.sender });
  assert.equal(response.statusCode, 503);
  assert.match(response.headers['Content-Type'], /application\/json/);
  assert.equal(JSON.parse(response.body).error.code, 'CONTACT_NOT_CONFIGURED');
});

test('rejects unsupported contact methods with JSON', async () => {
  const response = await handler({ httpMethod: 'GET' });
  assert.equal(response.statusCode, 405);
  assert.equal(JSON.parse(response.body).error.code, 'METHOD_NOT_ALLOWED');
});

test('reports success only after the email provider accepts the message', async () => {
  const previous = { key: process.env.RESEND_API_KEY, receiver: process.env.CONTACT_RECEIVER_EMAIL, sender: process.env.CONTACT_SENDER_EMAIL, fetch: global.fetch };
  let request;
  process.env.RESEND_API_KEY = 'test-key';
  process.env.CONTACT_RECEIVER_EMAIL = 'owner@example.com';
  process.env.CONTACT_SENDER_EMAIL = 'Portfolio <sender@example.com>';
  global.fetch = async (url, options) => { request = { url, options }; return new Response(JSON.stringify({ id: 'test-email' }), { status: 200, headers: { 'content-type': 'application/json' } }); };
  const response = await handler({ httpMethod: 'POST', body: JSON.stringify({ name: 'Test Client', email: 'client@example.com', projectType: 'AI automation', message: 'Please help improve this workflow.' }) });
  process.env.RESEND_API_KEY = previous.key || '';
  process.env.CONTACT_RECEIVER_EMAIL = previous.receiver || '';
  process.env.CONTACT_SENDER_EMAIL = previous.sender || '';
  global.fetch = previous.fetch;
  assert.equal(response.statusCode, 200);
  assert.equal(JSON.parse(response.body).success, true);
  const sent = JSON.parse(request.options.body);
  assert.equal(sent.reply_to, 'client@example.com');
  assert.equal(sent.subject, 'New Portfolio Inquiry — AI automation');
  assert.match(sent.text, /Source:\nPortfolio contact form/);
});

test('validates invalid email and empty message before provider configuration', async () => {
  const response = await handler({ httpMethod: 'POST', body: JSON.stringify({ name: 'Test Client', email: 'invalid', projectType: 'AI automation', message: '' }) });
  assert.equal(response.statusCode, 400);
  assert.equal(JSON.parse(response.body).error.code, 'VALIDATION_ERROR');
});
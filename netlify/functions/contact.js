const responseHeaders = { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' };

function json(statusCode, body) {
  return { statusCode, headers: responseHeaders, body: JSON.stringify(body) };
}

function clean(value, maxLength) {
  return typeof value === 'string' ? value.replace(/[<>]/g, '').replace(/\s+/g, ' ').trim().slice(0, maxLength) : '';
}

function validEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

exports.handler = async function handler(event) {
  if (event.httpMethod !== 'POST') return json(405, { success: false, error: { code: 'METHOD_NOT_ALLOWED', message: 'Use POST for contact requests.' } });
  let input;
  try { input = JSON.parse(event.body || '{}'); } catch { return json(400, { success: false, error: { code: 'INVALID_REQUEST', message: 'The contact request was invalid.' } }); }
  const name = clean(input.name, 100);
  const email = clean(input.email, 200);
  const projectType = clean(input.projectType, 100);
  const message = clean(input.message, 4000);
  if (input.website) return json(400, { success: false, error: { code: 'INVALID_REQUEST', message: 'The contact request was invalid.' } });
  if (name.length < 2 || !validEmail(email) || projectType.length < 2 || message.length < 10) return json(400, { success: false, error: { code: 'VALIDATION_ERROR', message: 'Please complete every contact field with valid information.' } });
  if (!process.env.RESEND_API_KEY || !process.env.CONTACT_RECEIVER_EMAIL || !process.env.CONTACT_SENDER_EMAIL) return json(503, { success: false, error: { code: 'CONTACT_NOT_CONFIGURED', message: 'The contact service is not configured yet.' } });

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: process.env.CONTACT_SENDER_EMAIL, to: [process.env.CONTACT_RECEIVER_EMAIL], reply_to: email, subject: `New Portfolio Inquiry — ${projectType}`, text: `New portfolio inquiry\n\nName:\n${name}\n\nEmail:\n${email}\n\nProject type:\n${projectType}\n\nMessage:\n${message}\n\nSource:\nPortfolio contact form` })
    });
    if (!response.ok) return json(502, { success: false, error: { code: 'DELIVERY_FAILED', message: 'Something went wrong while sending your message. Please try again.' } });
    return json(200, { success: true });
  } catch {
    return json(502, { success: false, error: { code: 'DELIVERY_FAILED', message: 'Something went wrong while sending your message. Please try again.' } });
  }
};
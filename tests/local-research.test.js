const test = require('node:test');
const assert = require('node:assert/strict');
const { createLocalResearch } = require('../src/local-research');

test('creates a source-backed brief with labeled hypotheses', () => {
  const result = createLocalResearch({ pages: [{
    url: 'https://stripe.com',
    title: 'Stripe | Financial Infrastructure for the Internet',
    description: 'Stripe builds economic infrastructure for the internet.',
    headings: ['Payments', 'Billing', 'For businesses'],
    text: 'Stripe builds economic infrastructure for the internet. Businesses use Stripe for payments and billing. For businesses of all sizes.'
  }] }, 'https://stripe.com');
  assert.equal(result.company.industry, 'payments and financial technology');
  assert.ok(result.verifiedFacts.length > 0);
  assert.ok(result.productsAndServices.length > 0);
  assert.equal(result.businessModel.classification, 'inferred');
  assert.match(result.limitations[0], /deterministic local rules/);
});
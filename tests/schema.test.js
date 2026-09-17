const test = require('node:test');
const assert = require('node:assert/strict');
const { validateResearch } = require('../src/schema');

const validResult = {
  company: { name: 'Acme', description: 'Software company', websiteType: 'B2B SaaS', industry: 'software and technology', location: null },
  verifiedFacts: [{ url: 'https://acme.test', title: 'Acme', evidence: 'Acme provides software.', confidence: 'high' }],
  productsAndServices: [{ name: 'Platform', description: 'Workflow software', sourceUrl: 'https://acme.test', confidence: 'high' }],
  targetAudience: [{ audience: 'Operations teams', reasoning: 'The page states this audience.', evidenceSourceUrls: ['https://acme.test'], classification: 'stated' }],
  businessModel: { model: 'B2B SaaS', reasoning: 'Inferred from the product description.', classification: 'inferred', sourceUrls: ['https://acme.test'] },
  aiAnalysis: { likelyBusinessPriorities: ['Improve operations'], possiblePainPoints: ['Manual work'], relevantOpportunities: ['Research workflow'], qualificationReasoning: 'Potential fit.', recommendedNextAction: 'Review the source pages.' },
  limitations: ['Only public pages were analyzed.']
};

test('accepts the complete research shape', () => {
  assert.deepEqual(validateResearch(validResult), validResult);
});

test('rejects facts without a source URL', () => {
  assert.throws(() => validateResearch({ ...validResult, verifiedFacts: [{ ...validResult.verifiedFacts[0], url: 'not-a-url' }] }), /Invalid/);
});
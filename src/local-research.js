const INDUSTRY_RULES = [
  ['payments and financial technology', /payments?|billing|invoic|financ|banking|money movement|treasury/i],
  ['software and technology', /software|platform|api|developer|cloud|data|technology|saas/i],
  ['e-commerce and retail', /shop|commerce|retail|store|checkout|merchandise/i],
  ['marketing and advertising', /marketing|advertis|campaign|brand|creative|agency/i],
  ['healthcare and life sciences', /health|medical|patient|clinical|pharma/i],
  ['education', /education|learning|school|course|student|university/i],
  ['professional services', /consulting|legal|accounting|advisory|professional services/i]
];

const AUDIENCE_PATTERNS = [
  /(?:for|help(?:s|ing)?|built for|serving) ([^.!?]{3,90})/gi,
  /(?:teams|businesses|companies|developers|organizations|customers) ([^.!?]{0,70})/gi
];

function unique(values) {
  return [...new Set(values.map(value => value.replace(/\s+/g, ' ').trim()).filter(Boolean))];
}

function sentenceList(text) {
  return unique(text.split(/(?<=[.!?])\s+/).map(sentence => sentence.trim()).filter(sentence => sentence.length >= 25)).slice(0, 8);
}

function findIndustry(text) {
  return INDUSTRY_RULES.find(([, pattern]) => pattern.test(text))?.[0] || null;
}

function companyName(homepage, websiteUrl) {
  const title = homepage.title?.split(/[|–—-]/)[0]?.trim();
  if (title && !/home|official site|welcome/i.test(title)) return title;
  return new URL(websiteUrl).hostname.replace(/^www\./, '').split('.')[0].replace(/[-_]/g, ' ').replace(/\b\w/g, character => character.toUpperCase());
}

function extractAudiences(pages) {
  const matches = [];
  for (const page of pages) {
    for (const pattern of AUDIENCE_PATTERNS) {
      for (const match of page.text.matchAll(pattern)) {
        const value = match[1].replace(/[,:;].*$/, '').trim();
        if (value.length >= 3 && value.length <= 90) matches.push({ audience: value, url: page.url });
      }
    }
  }
  return unique(matches.map(match => match.audience)).slice(0, 5).map(audience => {
    const source = matches.find(match => match.audience === audience);
    return { audience, reasoning: 'This audience is stated or closely associated with language found on the public website.', evidenceSourceUrls: [source.url], classification: 'stated' };
  });
}

function extractProducts(pages) {
  const products = [];
  for (const page of pages) {
    const candidates = [...page.headings, ...sentenceList(page.text).filter(sentence => /product|service|platform|solution|tool|api|software/i.test(sentence))];
    candidates.slice(0, 8).forEach(candidate => products.push({ name: candidate.slice(0, 100), description: candidate, sourceUrl: page.url, confidence: page === pages[0] ? 'medium' : 'high' }));
  }
  const seen = new Set();
  return products.filter(product => { const key = product.name.toLowerCase(); if (seen.has(key) || key.length < 4) return false; seen.add(key); return true; }).slice(0, 8);
}

function createLocalResearch(extracted, websiteUrl, userOffer = '') {
  const homepage = extracted.pages[0];
  const allText = extracted.pages.map(page => page.text).join(' ');
  const industry = findIndustry(allText);
  const description = homepage.description || sentenceList(homepage.text)[0] || null;
  const facts = [];
  if (homepage.title) facts.push({ url: homepage.url, title: homepage.title, statement: `The website title is “${homepage.title}”.`, evidence: homepage.title, confidence: 'high' });
  if (description) facts.push({ url: homepage.url, title: homepage.title, statement: 'The website publishes the following description.', evidence: description, confidence: 'high' });
  extracted.pages.slice(0, 5).forEach(page => page.headings.slice(0, 3).forEach(heading => facts.push({ url: page.url, title: page.title, statement: `The page presents “${heading}” as a topic or offering.`, evidence: heading, confidence: 'medium' })));
  const products = extractProducts(extracted.pages);
  const audiences = extractAudiences(extracted.pages);
  const keyPages = extracted.pages.map(page => page.title || page.url).slice(0, 5);
  const offerContext = userOffer ? ` against the user's stated context: ${userOffer.slice(0, 240)}` : '';
  return {
    company: { name: companyName(homepage, websiteUrl), description, websiteType: industry ? `${industry} website` : 'Public company website', industry, location: null },
    verifiedFacts: facts.slice(0, 15),
    productsAndServices: products,
    targetAudience: audiences,
    businessModel: { model: industry ? 'Commercial organization or product/service business' : null, reasoning: 'This is a hypothesis based on public positioning language; the website does not provide enough evidence to verify a specific revenue model.', classification: 'inferred', sourceUrls: extracted.pages.map(page => page.url) },
    aiAnalysis: {
      likelyBusinessPriorities: ['Communicate the value of the publicly described offering', 'Help visitors understand the relevant product or service path'],
      possiblePainPoints: ['The public pages may not reveal the full buying process or operational priorities'],
      relevantOpportunities: [`Review the public offering and audience signals before starting outreach${offerContext}`],
      qualificationReasoning: 'This is a deterministic research hypothesis based on publicly visible website content, not a verified qualification decision.',
      recommendedNextAction: 'Review the source pages and confirm the company, audience, and offering with a human before using this brief.'
    },
    limitations: [
      'This brief was generated with deterministic local rules; no AI model was used.',
      'Facts are limited to readable content from the fetched public pages.',
      `Key pages found or analyzed: ${keyPages.join('; ')}.`,
      'Audience, business model, priorities, pain points, and opportunities may be incomplete or inferred.'
    ]
  };
}

module.exports = { createLocalResearch, findIndustry, extractAudiences, extractProducts };
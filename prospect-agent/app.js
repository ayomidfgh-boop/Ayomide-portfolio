const form = document.querySelector('#research-form');
const submitButton = document.querySelector('#submit-button');
const exampleButton = document.querySelector('#example-button');
const errorMessage = document.querySelector('#form-error');
const results = document.querySelector('#results');
let latestResult = null;

const $ = selector => document.querySelector(selector);

function setText(selector, text) {
  $(selector).textContent = text || 'Not available from the supplied pages.';
}

function list(selector, items, emptyText = 'No supported information found.') {
  const element = $(selector);
  element.replaceChildren();
  if (!items?.length) { element.textContent = emptyText; return; }
  items.forEach(item => {
    const li = document.createElement('li');
    li.textContent = typeof item === 'string' ? item : item.name || item.audience || item.statement || item.title || '';
    element.append(li);
  });
}

function tag(label, cssClass) {
  const span = document.createElement('span');
  span.className = `tag ${cssClass}`;
  span.textContent = label;
  return span;
}

function renderResult(data) {
  const company = data.company || {};
  setText('#result-title', company.name || 'Research brief');
  setText('#result-meta', `${data.input.websiteUrl} · ${data.sources?.length || 0} source page(s) · ${data.metadata?.processingTimeMs || 0}ms · ${(data.metadata?.provider || 'local-deterministic').replace('-', ' ')}`);

  const overview = $('#company-overview');
  overview.replaceChildren();
  const overviewText = document.createElement('p'); overviewText.textContent = company.description || 'No company description was stated on the supplied pages.'; overview.append(overviewText);
  const chips = document.createElement('div'); chips.className = 'detail-chips';
  [company.websiteType && `Website type: ${company.websiteType}`, company.location && `Location: ${company.location}`].filter(Boolean).forEach(value => { const chip = document.createElement('span'); chip.textContent = value; chips.append(chip); });
  if (chips.childElementCount) overview.append(chips);

  const model = data.businessModel || {};
  const modelElement = $('#business-model');
  modelElement.replaceChildren();
  const industry = company.industry;
  const modelTitle = document.createElement('strong');
  if (industry) modelTitle.append(industry, tag('INDUSTRY', 'tag-fact'), ' · ');
  modelTitle.append(model.model || 'Not surfaced');
  const stamp = tag(model.classification?.toUpperCase() || 'INFERRED', model.classification === 'stated' ? 'tag-fact' : 'tag-hyp');
  modelTitle.append(' ', stamp);
  const modelText = document.createElement('p'); modelText.textContent = model.reasoning || 'No reasoning available for this label.'; modelElement.append(modelTitle, modelText);

  const audience = $('#audience-list');
  audience.replaceChildren();
  if (!data.targetAudience?.length) audience.textContent = 'No audience signal was surfaced.';
  data.targetAudience?.forEach(item => {
    const row = document.createElement('div'); row.className = 'audience-row';
    const strong = document.createElement('strong'); strong.textContent = item.audience;
    row.append(strong, tag(item.classification?.toUpperCase() || 'INFERRED', item.classification === 'stated' ? 'tag-fact' : 'tag-hyp'));
    const note = document.createElement('p'); note.textContent = item.reasoning || 'Inferred from public page language.'; row.append(note);
    audience.append(row);
  });

  list('#products-list', data.productsAndServices);

  const priorities = $('#priorities-list');
  priorities.replaceChildren();
  const priorityText = document.createElement('p'); priorityText.textContent = data.aiAnalysis?.likelyBusinessPriorities?.length ? data.aiAnalysis.likelyBusinessPriorities.join(' · ') : 'No priorities returned.'; priorities.append(priorityText);

  const problems = $('#business-problems');
  problems.replaceChildren();
  const problemText = document.createElement('p'); problemText.textContent = data.aiAnalysis?.possiblePainPoints?.length ? data.aiAnalysis.possiblePainPoints.join(' · ') : 'No pain points surfaced by this research pass.'; problems.append(problemText);

  const opportunities = $('#opportunities-list');
  opportunities.replaceChildren();
  if (!data.aiAnalysis?.relevantOpportunities?.length) opportunities.textContent = 'No opportunity surfaced by this pass.';
  else data.aiAnalysis.relevantOpportunities.forEach(item => { const row = document.createElement('div'); row.className = 'opportunity-row'; row.textContent = item; opportunities.append(row); });

  const action = $('#action-plan');
  action.replaceChildren();
  const next = document.createElement('strong'); next.textContent = data.aiAnalysis?.recommendedNextAction || 'Review the sources before deciding on a next step.';
  const reasonLabel = document.createElement('span'); reasonLabel.className = 'plan-label'; reasonLabel.textContent = 'Qualification reasoning';
  const reason = document.createElement('p'); reason.textContent = data.aiAnalysis?.qualificationReasoning || 'No reasoning returned.';
  const actions = document.createElement('div'); actions.className = 'action-steps';
  const step1 = document.createElement('div'); step1.append(tag('1', 'tag-rec'), document.createTextNode(' Open each cited source and confirm the claims you rely on.'));
  const step2 = document.createElement('div'); step2.append(tag('2', 'tag-rec'), document.createTextNode(' Decide which hypothesis deserves a human follow-up.'));
  const step3 = document.createElement('div'); step3.append(tag('3', 'tag-rec'), document.createTextNode(' Use the recommended action as the starting point for outreach.'));
  actions.append(step1, step2, step3);
  action.append(next, reasonLabel, reason, actions);

  const facts = $('#facts-list'); facts.replaceChildren();
  if (!data.verifiedFacts?.length) facts.textContent = 'No directly supported facts were returned.';
  data.verifiedFacts?.forEach(fact => {
    const item = document.createElement('div'); item.className = 'fact-item';
    const top = document.createElement('div'); top.className = 'fact-top';
    const statement = document.createElement('strong'); statement.textContent = fact.statement; top.append(statement); top.append(tag(fact.confidence.toUpperCase(), fact.confidence === 'high' ? 'tag-fact' : fact.confidence === 'medium' ? 'tag-hyp' : 'tag-opp'));
    const evidence = document.createElement('p'); evidence.textContent = fact.evidence;
    const source = document.createElement('a'); source.href = fact.url; source.target = '_blank'; source.rel = 'noreferrer'; source.textContent = fact.url;
    item.append(top, evidence, source);
    facts.append(item);
  });

  const map = $('#signal-map');
  map.replaceChildren();
  const rows = [
    ['Industry', company.industry || 'Not surfaced', company.industry ? 'fact-like signal' : null, 'Classified from page language.', 'tag-hyp'],
    ['Business model', model.model || 'Not surfaced', null, model.reasoning || '', 'tag-hyp'],
    ['Technology signals', 'Not surfaced by this pass', null, 'The local extractor focuses on positioning language, not stack enumeration.', 'tag-hyp'],
    ['Marketing signals', 'Not surfaced by this pass', null, 'Headlines and structure are read; channel signals are outside this pass.', 'tag-hyp'],
    ['Competitor / market signals', 'Not surfaced by this pass', null, 'External market sources are outside the current scope.', 'tag-hyp'],
    ['AI automation opportunities', data.aiAnalysis?.relevantOpportunities?.[0] || 'Not surfaced', null, 'Derived from the opportunities list above.', 'tag-opp']
  ];
  rows.forEach(([label, value, secondary, note, cssClass]) => {
    const row = document.createElement('div'); row.className = 'signal-row';
    const left = document.createElement('span'); left.className = 'signal-label'; left.textContent = label; row.append(left);
    const main = document.createElement('strong'); main.textContent = value; if (secondary) main.textContent += secondary;
    row.append(main, tag(note ? 'HYPOTHESIS' : 'N/A', cssClass));
    if (note) { const p = document.createElement('p'); p.textContent = note; row.append(p); }
    map.append(row);
  });

  list('#sources-list', data.sources?.map(source => source.url), 'No source metadata returned.');
  list('#limitations-list', data.limitations, 'No limitations returned.');
  results.hidden = false; results.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function setLoading(loading) { submitButton.disabled = loading; submitButton.innerHTML = loading ? 'Researching website…' : 'Generate research brief <span class="icon-arrow" aria-hidden="true"><svg viewBox="0 0 24 24" focusable="false"><path d="M7 17 17 7M8 7h9v9"/></svg></span>'; }

async function readJsonResponse(response) {
  const contentType = response.headers.get('content-type') || '';
  const rawBody = await response.text();
  if (!rawBody.trim()) {
    throw new Error(response.status === 404
      ? 'The research backend was not found. Start this project with “npx netlify dev” so the serverless function is available.'
      : `The research backend returned an empty response (HTTP ${response.status}).`);
  }
  if (!contentType.toLowerCase().includes('application/json')) {
    throw new Error(response.status === 404
      ? 'The research backend was not found. Start this project with “npx netlify dev” so the serverless function is available.'
      : `The research backend returned an unexpected response (HTTP ${response.status}).`);
  }
  try {
    return JSON.parse(rawBody);
  } catch {
    throw new Error('The research backend returned invalid JSON. Please try again.');
  }
}

form.addEventListener('submit', async event => {
  event.preventDefault(); errorMessage.hidden = true; results.hidden = true;
  const formData = new FormData(form); const websiteUrl = formData.get('websiteUrl').trim(); const userOffer = formData.get('userOffer').trim();
  try { new URL(websiteUrl); } catch { errorMessage.textContent = 'Enter a complete website URL, including https://.'; errorMessage.hidden = false; return; }
  setLoading(true);
  try {
    const response = await fetch('/.netlify/functions/research', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ websiteUrl, userOffer }) });
    const payload = await readJsonResponse(response);
    if (!response.ok || !payload.success) throw new Error(payload.error?.message || 'The research request could not be completed.');
    latestResult = payload.data; renderResult(latestResult);
  } catch (error) { errorMessage.textContent = error.message || 'Something went wrong. Please try again.'; errorMessage.hidden = false; }
  finally { setLoading(false); }
});

exampleButton.addEventListener('click', () => { $('#website-url').value = 'https://www.notion.so'; $('#user-offer').value = 'We help growing teams improve lead research and qualification workflows.'; $('#website-url').focus(); });
$('#copy-button').addEventListener('click', async () => { if (!latestResult) return; await navigator.clipboard.writeText(JSON.stringify(latestResult, null, 2)); $('#copy-button').textContent = 'Copied'; setTimeout(() => { $('#copy-button').textContent = 'Copy JSON'; }, 1600); });
$('#download-button').addEventListener('click', () => { if (!latestResult) return; const blob = new Blob([JSON.stringify(latestResult, null, 2)], { type: 'application/json' }); const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = 'prospect-research-brief.json'; link.click(); URL.revokeObjectURL(link.href); });
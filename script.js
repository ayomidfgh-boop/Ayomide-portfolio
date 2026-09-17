document.documentElement.classList.add('js');

const themeToggle = document.querySelector('#theme-toggle');
const menuToggle = document.querySelector('#menu-toggle');
const mobileMenu = document.querySelector('#mobile-menu');
const contactForm = document.querySelector('#contact-form');
const contactSubmit = contactForm.querySelector('button[type="submit"]');
const contactStatus = document.querySelector('#form-status');

const icons = {
  sun: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>',
  moon: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M20 15.5A8.5 8.5 0 0 1 8.5 4 8.5 8.5 0 1 0 20 15.5Z"/></svg>'
};

function setMenuState(open) {
  mobileMenu.classList.toggle('open', open);
  document.body.classList.toggle('menu-open', open);
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  mobileMenu.setAttribute('aria-hidden', String(!open));
}

menuToggle.addEventListener('click', () => setMenuState(!mobileMenu.classList.contains('open')));
mobileMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenuState(false)));

const savedTheme = localStorage.getItem('ayomide-theme');
if (savedTheme === 'light') document.body.classList.add('light'); else document.body.classList.add('dark');
function updateThemeButton() {
  const dark = document.body.classList.contains('dark');
  themeToggle.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
  themeToggle.querySelector('.theme-icon').innerHTML = icons[dark ? 'sun' : 'moon'];
}
updateThemeButton();
themeToggle.addEventListener('click', () => {
  const light = document.body.classList.toggle('light');
  document.body.classList.toggle('dark', !light);
  localStorage.setItem('ayomide-theme', light ? 'light' : 'dark');
  updateThemeButton();
});

const agentStepCopy = [
  ['User request', 'A qualified lead, public site URL, or a clear business question comes in. Ambiguous, private, or unsupported inputs are rejected early instead of being guessed at.'],
  ['Agent', 'The agent is the orchestrator, not the guesser. It decides the next step, applies defined rules, and never runs outside its declared boundary.'],
  ['Tools', 'Bounded tools handle the mechanics: HTTP fetching, classification, and structured JSON — each with explicit capabilities and guardrails.'],
  ['Research', 'Research validates the right signals from public pages and source checks, collecting evidence instead of inventing context.'],
  ['Reasoning', 'Reasoning separates facts from interpretation. Every outcome is labeled FACT, HYPOTHESIS, or OPPORTUNITY so a reviewer always knows the basis for a claim.'],
  ['Action', 'Where the rules allow, the agent executes the defined next step — generate a brief, update a record, or trigger a notification — and logs the action.'],
  ['Handoff / Result', 'The run ends with a reviewable result: sources, confidence labels, and a clear next action. Judgment that carries business weight always goes to a human.']
];
const agentSteps = [...document.querySelectorAll('.af-step')];
const agentPanelTitle = document.querySelector('#agent-panel-title');
const agentPanelText = document.querySelector('#agent-panel-text');
function setAgentStep(index) {
  agentSteps.forEach(step => step.classList.toggle('active', Number(step.dataset.step) === index));
  agentPanelTitle.textContent = agentStepCopy[index][0];
  agentPanelText.textContent = agentStepCopy[index][1];
}
if (agentSteps.length) {
  setAgentStep(0);
  agentSteps.forEach(step => step.addEventListener('click', () => setAgentStep(Number(step.dataset.step))));
}

const sectionLinks = [...document.querySelectorAll('.nav-link')];
const sectionObserver = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) sectionLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
}), { rootMargin: '-35% 0px -55% 0px' });
document.querySelectorAll('main section[id]').forEach(section => sectionObserver.observe(section));

const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) { entry.target.classList.add('is-visible'); revealObserver.unobserve(entry.target); }
}), { threshold: 0.08 });
document.querySelectorAll('.section-reveal').forEach(element => revealObserver.observe(element));

contactForm.addEventListener('submit', async event => {
  event.preventDefault();
  if (!contactForm.reportValidity() || contactSubmitting) return;
  const formData = new FormData(contactForm);
  if (formData.get('website')) return;
  contactSubmitting = true;
  contactSubmit.disabled = true;
  contactSubmit.textContent = 'Sending message...';
  contactStatus.className = 'form-status';
  contactStatus.textContent = 'Sending message...';
  try {
    const response = await fetch('/.netlify/functions/contact', { method: 'POST', headers: { Accept: 'application/json', 'Content-Type': 'application/json' }, body: JSON.stringify(Object.fromEntries(formData.entries())) });
    const raw = await response.text();
    let payload;
    try { payload = JSON.parse(raw); } catch { throw new Error('The contact service returned an invalid response.'); }
    if (!response.ok || !payload.success) throw new Error(payload.error?.message || 'Something went wrong while sending your message. Please try again.');
    contactForm.reset();
    contactStatus.className = 'form-status success';
    contactStatus.textContent = "Message sent successfully. I'll get back to you soon.";
  } catch (error) {
    contactStatus.className = 'form-status error';
    contactStatus.textContent = error.message || 'Something went wrong while sending your message. Please try again.';
  } finally {
    contactSubmitting = false;
    contactSubmit.disabled = false;
    contactSubmit.innerHTML = 'Send message <span aria-hidden="true">↗</span>';
  }
});
let contactSubmitting = false;

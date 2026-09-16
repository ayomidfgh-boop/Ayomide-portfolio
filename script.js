const brandConfig = {
  name: 'Abdul Fatai Ibrahim Ayomide',
  shortName: 'Ayomide',
  title: 'Digital Marketing & AI-Powered Digital Solutions Specialist',
  summary: 'A digital professional with 3 years of experience helping businesses build visibility, strengthen their online presence, create engaging content, and improve customer communication through digital channels.',
  location: 'Lagos, Nigeria',
  email: 'ayomidfgh@gmail.com',
  formspreeEndpoint: '',
  links: {
    x: 'https://x.com/ibrahim_ay62338',
    facebook: 'https://www.facebook.com/share/1JPLAz8tw/?mibextid=wwXIfr',
    cv: 'assets/documents/Abdul_Fatai_Ibrahim_Ayomide_CV.pdf'
  },
  profileImage: 'assets/profile.jpg'
};

const contactOptions = [
  ['Work with me', 'Digital marketing, AI-powered solutions, automation, web and legitimate digital projects.', 'Project Inquiry', 'I would like to discuss a project or service opportunity.'],
  ['AI Coaching / Mentorship', 'Learn practical AI, Agentic AI, automation, or how to apply AI to your business.', 'AI Coaching Inquiry', 'I would like to discuss AI, Agentic AI, automation, or practical AI coaching.'],
  ['Partner with me', 'Explore an idea, project, collaboration, or business opportunity together.', 'Partnership Opportunity', 'I would like to discuss a potential partnership or collaboration.'],
  ['Business / Investment Inquiry', 'Discuss a business idea, digital opportunity, or potential collaboration.', 'Business Inquiry', 'I would like to discuss a business idea, digital opportunity, or collaboration.'],
  ['Request a meeting', 'Have an idea or opportunity to discuss? Start a conversation by email.', 'Meeting Request', 'I would like to request a meeting to discuss an idea or opportunity.']
];

const projects = [
  { id: 'agent', number: '01', title: 'AI Business Agent', category: 'AI & Automation', description: 'A practical agent direction for researching businesses, finding opportunities and preparing useful next steps.', tags: ['AI agents', 'Research', 'Outreach'], image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1000&q=82', status: 'Concept / prototype', featured: true },
  { id: 'gtm', number: '02', title: 'GTM Lead Research System', category: 'GTM Engineering', description: 'An AI-assisted workflow for account research, qualification and personalized outreach context.', tags: ['GTM', 'Lead research', 'APIs'], image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1000&q=82', status: 'Project in development', featured: true },
  { id: 'ayotech', number: '03', title: 'Ayotech Business Solution', category: 'Business Systems', description: 'A digital and AI-focused brand for helping businesses automate repetitive work and grow with better systems.', tags: ['Automation', 'Digital growth', 'Strategy'], image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1000&q=82', status: 'Business concept', featured: true },
  { id: 'ayolux', number: '04', title: 'Ayolux E-commerce', category: 'E-commerce', description: 'A premium wristwatch brand and e-commerce direction shaped around identity, experience and online sales.', tags: ['Shopify', 'Brand identity', 'E-commerce'], image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=1000&q=82', status: 'Concept / prototype', featured: false },
  { id: 'assistant', number: '05', title: 'AI Business Assistant', category: 'AI & Automation', description: 'An assistant concept for handling common customer questions while keeping human support close at hand.', tags: ['Customer support', 'Workflows', 'AI'], image: 'https://images.unsplash.com/photo-1535378917042-10a22c95931a?auto=format&fit=crop&w=1000&q=82', status: 'In progress', featured: false }
];

const services = [
  ['✦', 'AI Agent Development', 'Practical agents designed around a real business workflow.'], ['↗', 'GTM Engineering', 'Research and outreach systems that make good context easier to act on.'], ['◎', 'AI Automation', 'Connect repetitive tasks into workflows that save attention.'], ['⌁', 'Web Development', 'Clear, responsive digital experiences for useful products and brands.'], ['◌', 'Digital Growth Systems', 'Simple systems for finding, serving and learning from customers.'], ['◈', 'E-commerce Solutions', 'Thoughtful storefront and brand experiences built for online selling.']
];

const skillGroups = {
  'Marketing & Growth': ['Digital marketing', 'Campaign strategy', 'Brand positioning', 'Basic analytics', 'Performance review'],
  'Content & Social': ['Content strategy', 'Social media management', 'Content planning', 'Copywriting', 'Brand communication'],
  'Web & AI Solutions': ['Website development', 'Landing pages', 'Responsive UI / UX', 'AI tools', 'AI-assisted workflows', 'Workflow automation'],
  'Professional Practice': ['Client communication', 'Remote collaboration', 'Project planning', 'Independent execution', 'Creative problem solving']
};

const insights = [
  { category: 'Agentic AI', title: 'What makes an AI agent useful in the real world?', date: 'Coming soon', text: 'A note on context, boundaries and designing agents around decisions instead of novelty.' },
  { category: 'GTM Engineering', title: 'The gap between research and action', date: 'Coming soon', text: 'Why good account research should make the next human step easier, not just produce more data.' },
  { category: 'Automation', title: 'Start with the repetitive moment', date: 'Coming soon', text: 'A practical way to spot automation opportunities inside everyday business operations.' }
];

const projectGrid = document.querySelector('#project-grid');
const servicesGrid = document.querySelector('#services-grid');
const skillGroupsElement = document.querySelector('#skill-groups');
const insightList = document.querySelector('#insight-list');
const dialog = document.querySelector('#project-dialog');
const dialogContent = document.querySelector('#dialog-content');

projectGrid.innerHTML = projects.map((project, index) => `<article class="project-card ${project.featured ? 'featured' : ''} section-reveal" data-project="${project.id}" tabindex="0" role="button" aria-label="View details for ${project.title}"><div class="project-image"><img src="${project.image}" alt="Abstract visual for ${project.title}" loading="lazy" /><span class="project-number">${project.number}</span><span class="project-status">${project.status}</span></div><div class="project-card-body"><div><span class="project-category">${project.category}</span><h3>${project.title}</h3><p>${project.description}</p><div class="tag-list">${project.tags.map(tag => `<span>${tag}</span>`).join('')}</div></div><span class="card-arrow">↗</span></div></article>`).join('');

servicesGrid.innerHTML = services.map(([icon, title, description]) => `<button class="service-card" type="button" data-service="${title}"><span class="service-icon">${icon}</span><span><strong>${title}</strong><small>${description}</small></span><span class="service-arrow">↗</span></button>`).join('');
skillGroupsElement.innerHTML = Object.entries(skillGroups).map(([group, skills]) => `<div class="skill-group"><h3>${group}</h3><div>${skills.map(skill => `<span>${skill}</span>`).join('')}</div></div>`).join('');
insightList.innerHTML = insights.map((insight, index) => `<article class="insight-row" tabindex="0" role="button" aria-label="Read ${insight.title}"><span class="insight-index">0${index + 1}</span><div><span class="project-category">${insight.category}</span><h3>${insight.title}</h3><p>${insight.text}</p></div><span class="insight-date">${insight.date}</span><button type="button" class="round-arrow" tabindex="-1" aria-hidden="true">↗</button></article>`).join('');
document.querySelectorAll('.insight-row').forEach((row, index) => {
  const openInsight = () => {
  const insight = insights[index];
  dialogContent.innerHTML = `<div class="dialog-hero"><span class="project-category">${insight.category}</span><h2>${insight.title}</h2><p>${insight.text}</p></div><div class="dialog-grid"><div><span class="dialog-label">Status</span><p>This note is planned for a future writing update.</p></div><div><span class="dialog-label">Topic</span><p>${insight.category} · Practical systems · Business context</p></div></div><div class="dialog-actions"><a class="button button-primary" href="mailto:${brandConfig.email}?subject=${encodeURIComponent(`Discuss: ${insight.title}`)}">Discuss this topic <span>↗</span></a></div>`;
  dialog.showModal();
  };
  row.addEventListener('click', openInsight);
  row.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openInsight(); } });
});
document.querySelector('#contact-options').innerHTML = contactOptions.map(([title, description, subject, body]) => `<a class="contact-option" href="mailto:${brandConfig.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`${body}\n\nName:\nCompany or project:\nPreferred next step:`)}"><span><strong>${title}</strong><small>${description}</small></span><span>↗</span></a>`).join('');
document.querySelectorAll('[data-email-link]').forEach(link => { link.href = `mailto:${brandConfig.email}`; link.textContent = brandConfig.email; });
document.querySelectorAll('[data-x-link]').forEach(link => { link.href = brandConfig.links.x; });
document.querySelectorAll('[data-facebook-link]').forEach(link => { link.href = brandConfig.links.facebook; });
document.querySelectorAll('[data-cv-link]').forEach(link => { link.href = brandConfig.links.cv; });
document.querySelectorAll('[data-brand-name]').forEach(element => { element.textContent = brandConfig.shortName; });
document.querySelectorAll('[data-full-name]').forEach(element => { element.textContent = brandConfig.name; });
document.querySelectorAll('[data-professional-title]').forEach(element => { element.textContent = brandConfig.title; });
document.querySelector('[data-summary]').textContent = brandConfig.summary;
document.querySelector('[data-profile-image]').src = brandConfig.profileImage;
document.querySelector('[data-location]').textContent = brandConfig.location;

function openProject(project) {
  dialogContent.innerHTML = `<div class="dialog-hero"><span class="project-category">${project.category}</span><h2>${project.title}</h2><p>${project.description}</p></div><div class="dialog-grid"><div><span class="dialog-label">Overview</span><p>${project.title} is a ${project.status.toLowerCase()} exploring how technology can create a clearer, more useful business workflow.</p></div><div><span class="dialog-label">What it could do</span><p>Research context, surface opportunities, reduce repetitive work and give people a stronger starting point for the next decision.</p></div><div><span class="dialog-label">Technology direction</span><p>${project.tags.join(' · ')}</p></div><div><span class="dialog-label">Current status</span><p>${project.status}</p></div></div><div class="dialog-actions"><a class="button button-primary" href="#contact" onclick="dialog.close()">Talk about this <span>↗</span></a></div>`;
  dialog.showModal();
}

document.querySelectorAll('.project-card').forEach(card => { card.addEventListener('click', () => openProject(projects.find(project => project.id === card.dataset.project))); card.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); card.click(); } }); });
document.querySelector('#dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
document.querySelectorAll('.service-card').forEach(card => card.addEventListener('click', () => { const service = services.find(item => item[1] === card.dataset.service); dialogContent.innerHTML = `<div class="dialog-hero"><span class="project-category">Service direction</span><h2>${service[1]}</h2><p>${service[2]}</p></div><div class="dialog-grid"><div><span class="dialog-label">How I approach it</span><p>Start with the business goal, map the moments that slow people down, then build a focused system that can be tested and improved.</p></div><div><span class="dialog-label">Next step</span><p>Bring a real workflow or rough idea. We can shape the smallest useful version together.</p></div></div><div class="dialog-actions"><a class="button button-primary" href="#contact" onclick="dialog.close()">Start a conversation <span>↗</span></a></div>`; dialog.showModal(); }));

const contactForm = document.querySelector('#contact-form');
const contactSubmit = contactForm.querySelector('button[type="submit"]');
const contactStatus = document.querySelector('#form-status');
let contactSubmitting = false;
contactForm.addEventListener('submit', async event => {
  event.preventDefault();
  if (contactSubmitting) return;
  if (!contactForm.reportValidity()) return;
  const formData = new FormData(contactForm);
  if (formData.get('website')) return;
  if (!brandConfig.formspreeEndpoint) {
    const subject = `Portfolio enquiry from ${formData.get('name')}`;
    const body = `Name: ${formData.get('name')}\nEmail: ${formData.get('email')}\n\n${formData.get('message')}`;
    contactStatus.className = 'form-status';
    contactStatus.textContent = 'Opening your email app with the message prepared.';
    window.location.href = `mailto:${brandConfig.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    return;
  }
  contactSubmitting = true;
  contactSubmit.disabled = true;
  contactSubmit.textContent = 'Sending...';
  contactStatus.className = 'form-status';
  contactStatus.textContent = 'Sending your message...';
  try {
    const response = await fetch(brandConfig.formspreeEndpoint, { method: 'POST', body: formData, headers: { Accept: 'application/json' } });
    if (!response.ok) throw new Error('Submission failed');
    contactForm.reset();
    contactStatus.className = 'form-status success';
    contactStatus.textContent = 'Thanks. Your message was sent successfully.';
  } catch (error) {
    contactStatus.className = 'form-status error';
    contactStatus.textContent = 'We could not send your message. Please try again or email ayomidfgh@gmail.com directly.';
  } finally {
    contactSubmitting = false;
    contactSubmit.disabled = false;
    contactSubmit.innerHTML = 'Send message <span>↗</span>';
  }
});

const themeToggle = document.querySelector('#theme-toggle');
const savedTheme = localStorage.getItem('ayomide-theme');
if (savedTheme === 'light') document.body.classList.add('light'); else document.body.classList.add('dark');
function updateThemeButton() { const dark = !document.body.classList.contains('light'); themeToggle.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode'); themeToggle.querySelector('.theme-icon').textContent = dark ? '☼' : '◐'; }
updateThemeButton();
themeToggle.addEventListener('click', () => { const light = document.body.classList.toggle('light'); document.body.classList.toggle('dark', !light); localStorage.setItem('ayomide-theme', light ? 'light' : 'dark'); updateThemeButton(); });

const menuToggle = document.querySelector('#menu-toggle');
const mobileMenu = document.querySelector('#mobile-menu');
function setMenuState(open) { mobileMenu.classList.toggle('open', open); document.body.classList.toggle('menu-open', open); menuToggle.setAttribute('aria-expanded', open); menuToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation'); mobileMenu.setAttribute('aria-hidden', !open); }
menuToggle.addEventListener('click', () => setMenuState(!mobileMenu.classList.contains('open')));
mobileMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenuState(false)));

const sectionLinks = [...document.querySelectorAll('.nav-link')];
const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) sectionLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`)); }), { rootMargin: '-35% 0px -55% 0px' });
document.querySelectorAll('main section[id]').forEach(section => observer.observe(section));
const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); revealObserver.unobserve(entry.target); } }), { threshold: 0.12 });
document.querySelectorAll('.section-reveal').forEach(element => revealObserver.observe(element));
document.querySelectorAll('.section-reveal').forEach(element => {
  const bounds = element.getBoundingClientRect();
  if (bounds.top < window.innerHeight && bounds.bottom > 0) element.classList.add('is-visible');
});

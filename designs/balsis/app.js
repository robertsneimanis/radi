import { initI18n } from '../i18n.js';

initI18n('sv');

const sections = [...document.querySelectorAll('main section')];
const nowTrack = document.getElementById('nowTrack');
const plTime = document.getElementById('plTime');
const wave = document.getElementById('wave');
let current = 0;

/* build the fake equaliser */
for (let i = 0; i < 48; i++) {
	const b = document.createElement('i');
	b.style.animationDelay = (i % 12) * -0.09 + 's';
	wave.appendChild(b);
}
const bars = [...wave.children];

function setCurrent(i) {
	current = Math.max(0, Math.min(sections.length - 1, i));
	const s = sections[current];
	nowTrack.textContent = s.dataset.track || '';
	plTime.textContent = String(current + 1).padStart(2, '0') + ' / ' + String(sections.length).padStart(2, '0');
	const lit = Math.round(((current + 1) / sections.length) * bars.length);
	bars.forEach((b, n) => b.classList.toggle('on', n < lit));
}

const io = new IntersectionObserver((entries) => {
	entries.forEach((e) => {
		if (e.isIntersecting) setCurrent(sections.indexOf(e.target));
	});
}, { threshold: 0.55 });
sections.forEach((s) => io.observe(s));

document.getElementById('next').addEventListener('click', () => {
	sections[Math.min(current + 1, sections.length - 1)].scrollIntoView({ behavior: 'smooth' });
});
document.getElementById('prev').addEventListener('click', () => {
	sections[Math.max(current - 1, 0)].scrollIntoView({ behavior: 'smooth' });
});

setCurrent(0);

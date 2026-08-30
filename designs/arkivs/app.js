import { initI18n } from '../i18n.js';

initI18n('sv');

const rail = document.getElementById('rail');
const bar = document.getElementById('bar');
const isHorizontal = () => window.matchMedia('(min-width: 861px)').matches;

/* translate vertical wheel into horizontal travel on desktop */
rail.addEventListener('wheel', (e) => {
	if (!isHorizontal()) return;
	if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
	e.preventDefault();
	rail.scrollLeft += e.deltaY;
}, { passive: false });

/* progress bar */
const updateBar = () => {
	if (!isHorizontal()) { bar.style.width = '0'; return; }
	const max = rail.scrollWidth - rail.clientWidth;
	bar.style.width = max > 0 ? (rail.scrollLeft / max) * 100 + '%' : '0';
};
rail.addEventListener('scroll', updateBar, { passive: true });
window.addEventListener('resize', updateBar);
updateBar();

/* smooth in-rail anchor jumps */
document.querySelectorAll('a[href^="#p"]').forEach((a) => {
	a.addEventListener('click', (e) => {
		const target = document.querySelector(a.getAttribute('href'));
		if (!target) return;
		e.preventDefault();
		if (isHorizontal()) {
			rail.scrollTo({ left: target.offsetLeft, behavior: 'smooth' });
		} else {
			target.scrollIntoView({ behavior: 'smooth' });
		}
	});
});

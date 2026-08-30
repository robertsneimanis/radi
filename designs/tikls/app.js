import { initI18n, translations } from '../i18n.js';

const applyLang = initI18n('sv');

/* ticker content, rebuilt on language change */
const tickerRun = document.getElementById('tickerRun');
function buildTicker() {
	const lang = document.documentElement.lang || 'sv';
	const t = translations[lang] || translations.sv;
	const words = [t.eyebrow, t.location, t.storiesTitle, t.teamTitle, 'RaDi Latvieši'];
	const once = words.map((w) => `<span>${w} ·</span>`).join('');
	tickerRun.innerHTML = once + once;
}
buildTicker();
document.querySelectorAll('[data-lang]').forEach((b) =>
	b.addEventListener('click', () => setTimeout(buildTicker, 0))
);

/* tile -> dialog */
const sheet = document.getElementById('sheet');
const sheetBody = document.getElementById('sheetBody');

document.querySelectorAll('.tile[data-open]').forEach((tile) => {
	tile.addEventListener('click', (e) => {
		if (e.target.closest('a, button')) return;
		sheetBody.innerHTML = tile.innerHTML;
		sheet.showModal();
	});
});

document.getElementById('sheetClose').addEventListener('click', () => sheet.close());
sheet.addEventListener('click', (e) => {
	const box = sheet.getBoundingClientRect();
	if (e.clientX < box.left || e.clientX > box.right || e.clientY < box.top || e.clientY > box.bottom) {
		sheet.close();
	}
});

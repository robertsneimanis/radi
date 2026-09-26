// Scroll-driven dark → light palette. Each key maps to a CSS custom property (--bg, --fg, ...).
const DARK = {
  bg:[10,10,11,1], bg2:[17,17,19,1], fg:[243,240,233,1], dim:[154,150,140,1], soft:[207,203,193,1],
  line:[243,240,233,.14], stroke:[243,240,233,.22], navbg:[10,10,11,.86]
};
const LIGHT = {
  bg:[245,242,234,1], bg2:[233,228,217,1], fg:[26,24,18,1], dim:[110,104,92,1], soft:[74,70,60,1],
  line:[26,24,18,.16], stroke:[26,24,18,.22], navbg:[245,242,234,.9]
};
const KEYS = Object.keys(DARK);

function mix(k, t){
  const a = DARK[k], b = LIGHT[k];
  const r = Math.round(a[0]+(b[0]-a[0])*t);
  const g = Math.round(a[1]+(b[1]-a[1])*t);
  const bl = Math.round(a[2]+(b[2]-a[2])*t);
  const al = (a[3]+(b[3]-a[3])*t).toFixed(3);
  return `rgba(${r},${g},${bl},${al})`;
}

export function paint(){
  const root = document.documentElement;
  const vh = innerHeight;
  const start = vh * 0.85;                              // stays fully dark through the hero
  const end = root.scrollHeight - vh * 1.15;            // fully light near the footer
  let t = (scrollY - start) / Math.max(1, end - start);
  t = Math.max(0, Math.min(1, t));
  t = t * t * (3 - 2 * t);                              // smoothstep
  KEYS.forEach(k => root.style.setProperty('--' + k, mix(k, t)));
}

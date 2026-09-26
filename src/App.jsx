import { useEffect, useRef, useState } from 'react';
import { I18N } from './i18n.js';
import { paint } from './theme.js';

const LANGS = ['lv', 'en', 'sv'];
const STORAGE_KEY = 'radi-language';

// I18N values may contain markup (<span>, <b>), so render them as HTML.
const html = s => ({ dangerouslySetInnerHTML: { __html: s } });

function initialLang(){
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (LANGS.includes(saved)) return saved;
  } catch {}
  return 'lv';
}

export default function App(){
  const [lang, setLang] = useState(initialLang);
  const t = I18N[lang];

  useEffect(() => {
    document.documentElement.lang = lang;
    try { localStorage.setItem(STORAGE_KEY, lang); } catch {}
    paint(); // copy length changes page height
  }, [lang]);

  const scroll = useScroll();
  useReveal();

  return (
    <>
      <ProgressBar {...scroll} />
      <Nav t={t} lang={lang} setLang={setLang} scrolled={scroll.y > scroll.vh * 0.7} />
      <Hero t={t} />
      <Bridge t={t} />
      <Reel t={t} />
      <section className="statement reveal">
        <p {...html(t.statement)} />
        <p className="sub" {...html(t.activities2)} />
      </section>
      <section className="team reveal" id="team">
        <div className="role" {...html(t.founderRole)} />
        <h2 {...html(t.founderName)} />
        <p {...html(t.founderBio)} />
      </section>
      <section className="contact" id="contact">
        <h2 className="reveal" {...html(t.contactTitle)} />
        <p className="reveal" {...html(t.contactNote)} />
        <a className="mail reveal" href="mailto:Radi.latviesi@gmail.com">Radi.latviesi@gmail.com</a>
      </section>
      <Footer />
    </>
  );
}

// Adds .in to .reveal elements once they scroll into view.
function useReveal(){
  useEffect(() => {
    const io = new IntersectionObserver(es => {
      es.forEach(e => { if (e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.15 });
    document.querySelectorAll('.reveal').forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
}

// One rAF-throttled scroll/resize listener: repaints the dark → light palette
// and returns the values the progress bar and nav need.
function useScroll(){
  const [s, setS] = useState({ y: 0, vh: 1, max: 1 });
  useEffect(() => {
    let ticking = false;
    const update = () => {
      setS({ y: scrollY, vh: innerHeight, max: document.documentElement.scrollHeight - innerHeight });
      paint();
      ticking = false;
    };
    const onScroll = () => { if (!ticking){ ticking = true; requestAnimationFrame(update); } };
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', onScroll, { passive: true });
    addEventListener('load', onScroll);
    update();
    return () => {
      removeEventListener('scroll', onScroll);
      removeEventListener('resize', onScroll);
      removeEventListener('load', onScroll);
    };
  }, []);
  return s;
}

function ProgressBar({ y, max }){
  return <div id="bar" style={{ width: (max > 0 ? y / max * 100 : 0) + '%' }} />;
}

function Nav({ t, lang, setLang, scrolled }){
  return (
    <nav className={'nav' + (scrolled ? ' solid' : '')} id="nav">
      <a className="brand" href="#top"><img src="/images/logo-website.png" alt="RaDi Latvieši — Radošā diaspora" /></a>
      <div className="links">
        <a href="#bridge" {...html(t.navAbout)} />
        <a href="#reel" {...html(t.navStories)} />
        <a href="#team" {...html(t.navTeam)} />
        <a className="keep" href="#contact" {...html(t.navContact)} />
        <span className="lang">
          {LANGS.map(l => (
            <button key={l} className={l === lang ? 'on' : undefined} onClick={() => setLang(l)}>
              {l.toUpperCase()}
            </button>
          ))}
        </span>
      </div>
    </nav>
  );
}

function Hero({ t }){
  return (
    <header className="hero" id="top">
      <div className="bg" />
      <div className="inner">
        <div className="eyebrow" {...html(t.eyebrow)} />
        <h1 {...html(t.heroTitle)} />
        <p {...html(t.heroIntro)} />
        <p className="hero-motto" {...html(t.motto)} />
        <div className="cta">
          <a className="btn solid" href="#reel" {...html(t.ctaExplore)} />
          <a className="btn ghost" href="https://www.youtube.com/watch?v=m3q-g9-DSDE&t=1s" target="_blank" rel="noreferrer" {...html(t.ctaFilm)} />
        </div>
      </div>
      <div className="scroll-hint" {...html(t.scrollHint)} />
    </header>
  );
}

function Bridge({ t }){
  return (
    <section className="diptych" id="bridge">
      <div className="txt reveal">
        <h2 {...html(t.manifestoTitle)} />
        <p {...html(t.manifestoLead)} />
        <p className="small" {...html(t.manifestoNote)} />
      </div>
      <div className="mark">
        <div className="vlabel" {...html(t.foundedLabel)} />
        <div className="year">2019</div>
      </div>
    </section>
  );
}

function Reel({ t }){
  const track = useRef(null);
  const scroll = dir => track.current.scrollBy({ left: dir * Math.min(innerWidth * 0.78, 460), behavior: 'smooth' });
  return (
    <section className="reel-wrap" id="reel">
      <div className="reel-head reveal">
        <div>
          <h2 {...html(t.storiesTitle)} />
        </div>
        <p {...html(t.storiesNote)} />
        <div className="reel-nav">
          <button aria-label="prev" onClick={() => scroll(-1)}>←</button>
          <button aria-label="next" onClick={() => scroll(1)}>→</button>
        </div>
      </div>
      <div className="reel" id="reelTrack" ref={track}>
        {t.reel.map(c => (
          <a className="card" key={c.n} href={c.href} target="_blank" rel="noreferrer">
            <div className="num">{c.n}</div>
            <h3>{c.t}</h3>
            <div>
              <div className="type">{c.ty}</div>
              <div className="go">{c.go}</div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

function Footer(){
  return (
    <footer>
      <span>© 2026 RaDi Latvieši</span>
      <span>
        <a href="https://www.facebook.com/radosielatviesi" target="_blank" rel="noreferrer">Facebook</a> ·{' '}
        <a href="https://www.youtube.com/results?search_query=radi+latviesi" target="_blank" rel="noreferrer">YouTube</a> ·{' '}
        <a href="https://www.instagram.com/radi_latviesi/" target="_blank" rel="noreferrer">Instagram</a>
      </span>
    </footer>
  );
}

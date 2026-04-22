/* ─── SITE APP ─────────────────────────────────────────────────────────────
   Loads content from content.json (served by the CMS server or any static
   host). Falls back to window.CONTENT_DEFAULTS when opening as file://.
   ─────────────────────────────────────────────────────────────────────── */

const { useState, useEffect, useRef } = React;

// ─── ICON REGISTRY ───────────────────────────────────────────────────────────
const ICONS = {
  instagram: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5"/>
      <circle cx="12" cy="12" r="4"/>
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
    </svg>
  ),
  github: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.09.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.741 0 .267.18.577.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
    </svg>
  ),
  cosmos: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="3"/>
      <ellipse cx="12" cy="12" rx="10" ry="4"/>
      <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)"/>
      <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)"/>
    </svg>
  ),
  twitter: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  ),
  linkedin: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/>
      <circle cx="4" cy="4" r="2"/>
    </svg>
  ),
  behance: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M22 7h-7V5h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.506.109 1.188.095 2.14H15.97c.13 3.211 3.483 3.312 4.588 2.029h3.168zm-7.686-4h4.965c-.105-1.547-1.136-2.219-2.477-2.219-1.466 0-2.277.768-2.488 2.219zm-9.574 6.988H0V5.021h6.953c5.476.081 5.58 5.444 2.72 6.906 3.461 1.26 3.579 7.061-3.207 7.061zM3 11h3.584c2.508 0 2.906-3-.312-3H3v3zm3.391 3H3v3.016h3.341c3.055 0 2.868-3.016.05-3.016z"/>
    </svg>
  ),
  dribbble: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10"/>
      <path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-15.38c-3.72 4.35-8.94 5.66-16.88 5.85m19.5 1.9c-3.5-.93-6.63-.82-8.94 0-2.58.92-5.01 2.86-7.44 6.32"/>
    </svg>
  ),
};

// ─── THEME HELPERS ───────────────────────────────────────────────────────────
function hexToRgba(hex, a) {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0,2),16);
  const g = parseInt(h.slice(2,4),16);
  const b = parseInt(h.slice(4,6),16);
  return `rgba(${r},${g},${b},${a})`;
}

function applyTheme(theme) {
  const r = document.documentElement;
  r.style.setProperty('--bg',      theme.bg);
  r.style.setProperty('--fg',      theme.fg);
  r.style.setProperty('--fg-dim',  hexToRgba(theme.fg, 0.38));
  r.style.setProperty('--fg-mid',  hexToRgba(theme.fg, 0.65));
  r.style.setProperty('--border',  hexToRgba(theme.fg, 0.1));
  r.style.setProperty('--accent',  theme.fg);
}

function applyFavicon(logoImage) {
  if (!logoImage) return;
  ['site-favicon', 'site-favicon-32', 'site-apple-touch-icon', 'site-shortcut-icon'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.href = logoImage;
  });
}

function applyFonts(branding) {
  const bodyFont    = branding.bodyFont    || branding.font    || 'Urbanist';
  const headingFont = branding.headingFont || branding.font    || bodyFont;
  const bodyUrl     = branding.bodyFontUrl    || branding.fontUrl || '';
  const headingUrl  = branding.headingFontUrl || branding.fontUrl || '';

  const r = document.documentElement;
  r.style.setProperty('--font-body',    `'${bodyFont}', sans-serif`);
  r.style.setProperty('--font-heading', `'${headingFont}', sans-serif`);

  const bodyLink    = document.getElementById('site-font-link');
  const headingLink = document.getElementById('site-font-link-heading');
  if (bodyLink    && bodyUrl    && bodyLink.href    !== bodyUrl)    bodyLink.href    = bodyUrl;
  if (headingLink && headingUrl && headingLink.href !== headingUrl) headingLink.href = headingUrl;
}

// ─── CONTENT LOADER ──────────────────────────────────────────────────────────
// Tries content.json (works on any HTTP server), falls back to CONTENT_DEFAULTS.
async function loadContent() {
  try {
    const res = await fetch('content.json', { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      return deepMerge(window.CONTENT_DEFAULTS, data);
    }
  } catch (_) { /* file:// or offline — use defaults */ }
  return window.CONTENT_DEFAULTS;
}

function deepMerge(base, override) {
  const out = { ...base };
  for (const key of Object.keys(override)) {
    if (
      override[key] !== null &&
      typeof override[key] === 'object' &&
      !Array.isArray(override[key])
    ) {
      out[key] = deepMerge(base[key] || {}, override[key]);
    } else {
      out[key] = override[key];
    }
  }
  return out;
}

// ─── SEO UPDATER (client-side nav) ───────────────────────────────────────────
function updateDocMeta(content) {
  const { seo, branding } = content;
  document.title = seo.pageTitle || 'Sihle Bomela';
  const setMeta = (sel, val) => { const el = document.querySelector(sel); if (el) el.setAttribute('content', val); };
  setMeta('meta[name="description"]',        seo.description   || '');
  setMeta('meta[name="keywords"]',           seo.keywords      || '');
  setMeta('meta[name="author"]',             branding.logoText || '');
  setMeta('meta[property="og:title"]',       seo.pageTitle     || '');
  setMeta('meta[property="og:description"]', seo.description   || '');
  setMeta('meta[property="og:image"]',       seo.ogImage       || '');
  setMeta('meta[property="og:url"]',         seo.canonicalUrl  || '');
  setMeta('meta[name="twitter:title"]',      seo.pageTitle     || '');
  setMeta('meta[name="twitter:description"]',seo.description   || '');
  setMeta('meta[name="twitter:image"]',      seo.ogImage       || '');
  setMeta('meta[name="twitter:site"]',       seo.twitterHandle || '');
}

// ─── REVEAL HOOK ─────────────────────────────────────────────────────────────
function useReveal(ref) {
  useEffect(() => {
    if (!ref.current) return;
    const els = ref.current.querySelectorAll('.reveal');
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

// ─── SHADER CANVAS ───────────────────────────────────────────────────────────
function ShaderCanvas() {
  const canvasRef = useRef(null);
  const rafRef    = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext('2d');
    const SPACING = 80, SIZE = 6, OPACITY = 0.12;
    const resize = () => { canvas.width = innerWidth; canvas.height = innerHeight; };
    resize();
    window.addEventListener('resize', resize);
    let tick = 0;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cols = Math.ceil(canvas.width  / SPACING) + 1;
      const rows = Math.ceil(canvas.height / SPACING) + 1;
      const offX = (canvas.width  % SPACING) / 2;
      const offY = (canvas.height % SPACING) / 2;
      for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
        const x = offX + c * SPACING, y = offY + r * SPACING;
        const alpha = OPACITY * (0.55 + 0.45 * Math.sin(tick * 0.004 + (r * cols + c) * 0.37));
        ctx.save(); ctx.globalAlpha = alpha; ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 0.8;
        ctx.beginPath(); ctx.moveTo(x - SIZE, y); ctx.lineTo(x + SIZE, y);
        ctx.moveTo(x, y - SIZE); ctx.lineTo(x, y + SIZE); ctx.stroke(); ctx.restore();
      }
      tick++; rafRef.current = requestAnimationFrame(draw);
    };
    rafRef.current = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(rafRef.current); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={canvasRef} style={{ position:'fixed', inset:0, width:'100%', height:'100%', zIndex:0, pointerEvents:'none' }} />;
}

// ─── NAV ─────────────────────────────────────────────────────────────────────
function Nav({ page, setPage, content }) {
  const { branding, nav } = content;
  return (
    <nav>
      <button className="nav-logo" onClick={() => setPage('home')} style={{ background:'none', border:'none' }}>
        {branding.logoImage
          ? <img src={branding.logoImage} alt={branding.logoText} style={{ height:28, objectFit:'contain' }} />
          : branding.logoText}
      </button>
      <ul className="nav-links">
        {[['work','Work'],['about','About'],['contact','Contact']].map(([p,l]) => (
          <li key={p}><button className={page===p?'active':''} onClick={() => setPage(p)}>{l}</button></li>
        ))}
      </ul>
      {nav.availShow && (
        <div className="nav-avail">
          <span className="avail-dot" style={{ background: branding.availDotColor || '#aaffaa' }} />
          {nav.availText}
        </div>
      )}
    </nav>
  );
}

// ─── IMAGE TILE (gallery) ────────────────────────────────────────────────────
function ImgTile({ img, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      style={{ position:'relative', aspectRatio:img.ratio, background:'#0f0f0f', overflow:'hidden', cursor:'pointer' }}
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      {img.src
        ? <img src={img.src} alt={img.label} style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover' }} />
        : (
          <div style={{ position:'absolute', inset:0, background:'repeating-linear-gradient(45deg,transparent,transparent 18px,rgba(255,255,255,0.018) 18px,rgba(255,255,255,0.018) 19px)', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:10 }}>
            <svg width="28" height="28" viewBox="0 0 48 48" fill="none" style={{opacity:0.15}}>
              <rect x="4" y="8" width="40" height="32" rx="2" stroke="white" strokeWidth="1.5"/>
              <circle cx="16" cy="19" r="4" stroke="white" strokeWidth="1.5"/>
              <path d="M4 32 L14 22 L22 30 L30 22 L44 35" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
            </svg>
            <span style={{ fontSize:9, letterSpacing:'0.1em', textTransform:'uppercase', color:'rgba(255,255,255,0.2)' }}>{img.label}</span>
          </div>
        )
      }
      {hov && (
        <div style={{ position:'absolute', inset:0, background:'rgba(255,255,255,0.04)', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <span style={{ fontSize:10, letterSpacing:'0.12em', textTransform:'uppercase', color:'rgba(255,255,255,0.5)' }}>View ↗</span>
        </div>
      )}
    </div>
  );
}

// ─── LIGHTBOX ────────────────────────────────────────────────────────────────
function Lightbox({ images, index, onClose }) {
  const [cur, setCur] = useState(index);
  const prev = () => setCur(c => (c - 1 + images.length) % images.length);
  const next = () => setCur(c => (c + 1) % images.length);
  useEffect(() => {
    const h = e => { if(e.key==='ArrowLeft')prev(); if(e.key==='ArrowRight')next(); if(e.key==='Escape')onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);
  const img = images[cur];
  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.96)', zIndex:1000, display:'flex', flexDirection:'column' }} onClick={onClose}>
      <div style={{ display:'flex', justifyContent:'space-between', padding:'18px 28px', flexShrink:0 }} onClick={e=>e.stopPropagation()}>
        <span style={{ fontSize:11, letterSpacing:'0.1em', textTransform:'uppercase', color:'rgba(255,255,255,0.4)' }}>{cur+1} / {images.length}</span>
        <button onClick={onClose} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.6)', fontSize:22, cursor:'pointer', padding:'4px 8px' }}>✕</button>
      </div>
      <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', padding:'0 80px', position:'relative' }} onClick={e=>e.stopPropagation()}>
        <button onClick={prev} className="lb-arrow lb-prev">←</button>
        <div style={{ maxWidth:'80vw', maxHeight:'75vh', width:'100%', aspectRatio:img.ratio, position:'relative', overflow:'hidden', background:'#111' }}>
          {img.src
            ? <img src={img.src} alt={img.label} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
            : <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:12, background:'repeating-linear-gradient(45deg,transparent,transparent 20px,rgba(255,255,255,0.018) 20px,rgba(255,255,255,0.018) 21px)' }}>
                <span style={{ fontSize:10, letterSpacing:'0.12em', textTransform:'uppercase', color:'rgba(255,255,255,0.25)' }}>{img.label}</span>
              </div>
          }
        </div>
        <button onClick={next} className="lb-arrow lb-next">→</button>
      </div>
      <div style={{ textAlign:'center', padding:'16px 28px 28px', fontSize:12, letterSpacing:'0.08em', color:'rgba(255,255,255,0.35)', textTransform:'uppercase', flexShrink:0 }}>{img.label}</div>
    </div>
  );
}

// ─── PROJECT OVERLAY ─────────────────────────────────────────────────────────
function ProjectOverlay({ project, projects, onClose, onNext }) {
  const [open, setOpen] = useState(false);
  const [lbIdx, setLbIdx] = useState(null);
  const ref = useRef(null);
  useEffect(() => { requestAnimationFrame(() => setOpen(true)); }, []);
  useEffect(() => { if (ref.current) ref.current.scrollTop = 0; }, [project]);
  const close = () => { setOpen(false); setTimeout(onClose, 600); };
  const images = project.images || [];

  // Group images into rows
  const rows = [];
  let i = 0;
  while (i < images.length) {
    const img = images[i];
    if (img.span === 'full') { rows.push([img]); i++; }
    else if (img.span === 'half') {
      const nxt = images[i+1];
      if (nxt && nxt.span === 'half') { rows.push([img, nxt]); i += 2; } else { rows.push([img]); i++; }
    } else if (img.span === 'third') {
      const grp = [];
      while (i < images.length && images[i].span === 'third' && grp.length < 3) { grp.push(images[i]); i++; }
      rows.push(grp);
    } else { rows.push([img]); i++; }
  }

  const idx      = projects.findIndex(p => p.id === project.id);
  const nextProj = projects[(idx + 1) % projects.length];

  return (
    <>
      <div className={`project-overlay ${open?'open':''}`} ref={ref}>
        <div className="overlay-nav">
          <button className="overlay-back" onClick={close}>Back</button>
          <div style={{ display:'flex', gap:32, alignItems:'center' }}>
            <span style={{ fontSize:11, letterSpacing:'0.08em', color:'var(--fg-dim)', textTransform:'uppercase' }}>{project.type}</span>
            <span style={{ fontSize:11, letterSpacing:'0.08em', color:'var(--fg-dim)' }}>{project.year}</span>
          </div>
        </div>
        <div style={{ padding:'52px 48px 40px', borderBottom:'1px solid var(--border)' }}>
          <h2 className="overlay-title">{project.name}</h2>
          <div className="overlay-info-grid">
            <div className="info-block"><label>Role</label><p>{project.role}</p></div>
            <div className="info-block"><label>Duration</label><p>{project.duration}</p></div>
            <div className="info-block"><label>Year</label><p>{project.year}</p></div>
          </div>
          <p className="overlay-desc">{project.desc}</p>
        </div>
        <div className="proj-gallery">
          {rows.map((row, ri) => (
            <div key={ri} className={`gallery-row gallery-row--${row.length===1?(row[0].span==='full'?'full':'single'):row.length===2?'half':'third'}`}>
              {row.map((img, ii) => (
                <ImgTile key={ii} img={img} onClick={() => setLbIdx(images.indexOf(img))} />
              ))}
            </div>
          ))}
        </div>
        <div className="proj-end-cta">
          <div className="proj-end-divider" />
          <div className="proj-end-inner">
            <div>
              <span className="proj-end-label">Next Project</span>
              {nextProj && nextProj.id !== project.id && (
                <button className="proj-end-next-name" onClick={() => onNext && onNext(nextProj)}>{nextProj.name} →</button>
              )}
            </div>
            <div className="proj-end-contact">
              <span className="proj-end-label">Like what you see?</span>
              <a href={`mailto:hey@thewholesihle`} className="proj-end-cta-link">Get in touch</a>
            </div>
          </div>
        </div>
      </div>
      {lbIdx !== null && <Lightbox images={images} index={lbIdx} onClose={() => setLbIdx(null)} />}
    </>
  );
}

// ─── HOME PAGE ───────────────────────────────────────────────────────────────
function HomePage({ content, setPage }) {
  const { home, about, projects, branding } = content;
  return (
    <div className="page-enter">
      <div className="home-hero">
        <h1 className="home-name" dangerouslySetInnerHTML={{ __html: home.heroName.replace('\n','<br/>') }} />
        <p className="home-bio" dangerouslySetInnerHTML={{ __html: home.heroBio }} />
        <div className="pill-group">
          <a href={`mailto:${home.heroEmail}`} className="pill email">{home.heroEmail}</a>
        </div>
      </div>

      <div className="home-work-preview">
        <div className="home-section-label">{home.workSectionLabel}</div>
        <div className="home-thumb-grid">
          {projects.map(p => (
            <div key={p.id} className="home-thumb-item" onClick={() => setPage('work')} style={{ cursor:'none' }}>
              <div style={{ position:'relative', width:'100%', aspectRatio:'4/3', background:'#141414', overflow:'hidden', marginBottom:12 }}
                onMouseEnter={e => e.currentTarget.querySelector('.thumb-ov').style.opacity='1'}
                onMouseLeave={e => e.currentTarget.querySelector('.thumb-ov').style.opacity='0'}>
                {p.images?.[0]?.src
                  ? <img src={p.images[0].src} alt={p.name} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                  : <div style={{ position:'absolute', inset:0, background:'repeating-linear-gradient(45deg,transparent,transparent 18px,rgba(240,237,232,0.025) 18px,rgba(240,237,232,0.025) 19px)', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:10 }}>
                      <svg width="36" height="36" viewBox="0 0 48 48" fill="none" style={{opacity:0.18}}>
                        <rect x="4" y="8" width="40" height="32" rx="2" stroke="#f0ede8" strokeWidth="1.5"/>
                        <circle cx="16" cy="19" r="4" stroke="#f0ede8" strokeWidth="1.5"/>
                        <path d="M4 32 L14 22 L22 30 L30 22 L44 35" stroke="#f0ede8" strokeWidth="1.5" strokeLinejoin="round"/>
                      </svg>
                      <span style={{ fontSize:9, letterSpacing:'0.12em', textTransform:'uppercase', color:'rgba(240,237,232,0.25)' }}>Project imagery</span>
                    </div>
                }
                <div className="thumb-ov" style={{ position:'absolute', inset:0, background:'rgba(240,237,232,0.06)', display:'flex', alignItems:'center', justifyContent:'center', opacity:0, transition:'opacity 0.25s ease' }}>
                  <span style={{ fontSize:11, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--fg)' }}>View →</span>
                </div>
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline' }}>
                <span style={{ fontSize:14, fontWeight:500, color:'var(--fg)', letterSpacing:'-0.01em' }}>{p.name}</span>
                <span style={{ fontSize:10, letterSpacing:'0.08em', textTransform:'uppercase', color:'var(--fg-dim)' }}>{p.type}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="marquee-section">
        <div className="marquee-label">{home.clientsLabel}</div>
        <div className="marquee-track">
          {[...about.clients, ...about.clients].map((c,i) => (
            <span key={i} className="marquee-item">{c}</span>
          ))}
        </div>
      </div>
      <div className="home-scroll-hint">Scroll</div>
    </div>
  );
}

// ─── WORK PAGE ───────────────────────────────────────────────────────────────
function WorkPage({ content }) {
  const ref = useRef(null);
  useReveal(ref);
  const [open, setOpen] = useState(null);
  const { projects } = content;
  return (
    <div className="work-page page-enter" ref={ref}>
      <div className="work-header">
        <span className="work-title">Selected Work</span>
        <span className="work-count">{projects.length} Project{projects.length !== 1 ? 's' : ''}</span>
      </div>
      <div className="project-grid">
        {projects.map((p, i) => (
          <div key={p.id} className="project-card reveal" style={{ transitionDelay:`${i*100}ms` }} onClick={() => setOpen(p)}>
            <div className="project-card-num">0{i+1}</div>
            <div className="project-card-thumb">
              <div className="project-card-thumb-inner">
                {p.images?.[0]?.src
                  ? <img src={p.images[0].src} alt={p.name} style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover' }} />
                  : <>
                      <svg width="36" height="36" viewBox="0 0 48 48" fill="none" style={{opacity:0.18}}>
                        <rect x="4" y="8" width="40" height="32" rx="2" stroke="#f0ede8" strokeWidth="1.5"/>
                        <circle cx="16" cy="19" r="4" stroke="#f0ede8" strokeWidth="1.5"/>
                        <path d="M4 32 L14 22 L22 30 L30 22 L44 35" stroke="#f0ede8" strokeWidth="1.5" strokeLinejoin="round"/>
                      </svg>
                      <span style={{ fontSize:9, letterSpacing:'0.12em', textTransform:'uppercase', color:'rgba(240,237,232,0.25)' }}>Project imagery</span>
                    </>
                }
              </div>
              <div className="project-card-hover"><span style={{ fontSize:11, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--fg)' }}>View →</span></div>
            </div>
            <div className="project-card-caption">
              <span className="project-card-name">{p.name}</span>
              <span className="project-card-type">{p.type} · {p.year}</span>
            </div>
          </div>
        ))}
      </div>
      {open && <ProjectOverlay project={open} projects={projects} onClose={() => setOpen(null)} onNext={p => setOpen(p)} />}
    </div>
  );
}

// ─── ABOUT PAGE ──────────────────────────────────────────────────────────────
function AboutPage({ content }) {
  const ref = useRef(null);
  useReveal(ref);
  const { about, branding } = content;
  return (
    <div className="about-page page-enter" ref={ref}>
      <div className="about-left">
        <div className="about-section-label">About</div>
        {about.bio.split('\n\n').filter(Boolean).map((p, i) => (
          <p key={i} className="about-bio-text" dangerouslySetInnerHTML={{ __html: p }} />
        ))}
        <a href={about.cvUrl} className="about-resume-btn" download><span>↓</span> {about.cvLabel}</a>
        <div style={{ marginTop:64 }}>
          <div className="about-section-label">Experience</div>
          <div className="exp-list">
            {about.experience.map(e => (
              <div key={e.id} className="exp-item">
                <div className="exp-top"><span className="exp-company">{e.company}</span><span className="exp-period">{e.period}</span></div>
                <div className="exp-bottom"><span className="exp-role">{e.role}</span><span className="exp-type">{e.type}</span></div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ marginTop:52 }}>
          <div className="about-section-label">Selected Clients</div>
          <div className="clients-grid">
            {about.clients.map(c => <div key={c} className="client-item">{c}</div>)}
          </div>
        </div>
      </div>
      <div className="about-right">
        <div className="about-section-label">Services</div>
        <ul className="services-list">
          {about.services.map((s, i) => (
            <li key={s.id} className="reveal" style={{ transitionDelay:`${i*60}ms` }}>{s.name}<span>{s.tag}</span></li>
          ))}
        </ul>
        <div style={{ marginTop:48 }}>
          <div className="about-section-label">Currently</div>
          <p style={{ fontSize:14, fontWeight:300, color:'var(--fg-mid)', lineHeight:1.7 }}>
            {about.currentRole}<br/><span style={{ color:'var(--fg)' }}>{about.currentCompany}</span><br/>{about.currentLocation}
          </p>
          <div style={{ marginTop:20, display:'flex', alignItems:'center', gap:8, fontSize:12, color:'var(--fg-dim)', letterSpacing:'0.06em' }}>
            <span className="avail-dot" style={{ background: branding.availDotColor || '#aaffaa' }} />
            {about.availText}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── CONTACT PAGE ────────────────────────────────────────────────────────────
function ContactPage({ content }) {
  const { contact } = content;
  return (
    <div className="contact-page page-enter">
      <div className="contact-label">{contact.label}</div>
      <h2 className="contact-cta">{contact.heading}</h2>
      <a href={`mailto:${contact.email}`} className="contact-email-link">{contact.email}</a>
      <div className="contact-socials">
        {contact.socials.map(s => (
          <a key={s.id} href={s.url} target="_blank" rel="noreferrer" className="contact-social">
            <span className="contact-social-label">{ICONS[s.icon] || null}{s.label}</span>
            <span>{s.handle}</span>
          </a>
        ))}
      </div>
    </div>
  );
}

// ─── MAINTENANCE PAGE ────────────────────────────────────────────────────────
function MaintenancePage({ content }) {
  const { maintenance, projects, contact } = content;
  const email = maintenance.email || contact.email;

  // Collect all images with a src; tile them to fill the grid (~40+ cells)
  const srcs = projects.flatMap(p =>
    (p.images || []).filter(img => img.src).map(img => ({ src: img.src, name: p.name }))
  );
  const CELLS = 48;
  const cells = Array.from({ length: CELLS }, (_, i) =>
    srcs.length > 0 ? srcs[i % srcs.length] : { src: '', name: '' }
  );

  return (
    <div style={{ position: 'fixed', inset: 0, overflow: 'hidden' }}>
      <div className="maint-grid">
        {cells.map((cell, i) => (
          <div key={i} className="maint-cell" style={{ opacity: 0.55 + (i % 3) * 0.1 }}>
            {cell.src
              ? <img src={cell.src} alt={cell.name} />
              : <div className="maint-cell-ph" style={{ background: `hsl(${(i * 41) % 360}, 8%, ${10 + (i % 4) * 2}%)` }} />
            }
          </div>
        ))}
      </div>
      <div className="maint-overlay" />
      <div className="maint-content">
        <div className="maint-tag">Under Maintenance</div>
        <h1 className="maint-heading">{maintenance.heading || 'Back soon.'}</h1>
        {maintenance.message && (
          <p className="maint-msg">{maintenance.message}</p>
        )}
        <a href={`mailto:${email}`} className="maint-email">{email}</a>
        {contact.socials?.filter(s => s.url).length > 0 && (
          <div className="maint-socials">
            {contact.socials.filter(s => s.url).map(s => (
              <a key={s.id} href={s.url} target="_blank" rel="noopener noreferrer" className="maint-social-link" title={s.label}>
                {ICONS[s.icon]}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── LOADING SCREEN ───────────────────────────────────────────────────────────
function LoadingScreen() {
  return (
    <div style={{ position:'fixed', inset:0, background:'var(--bg)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:9999 }}>
      <div style={{ textAlign:'center' }}>
        <div style={{ width:32, height:32, border:'1px solid var(--border)', borderTopColor:'var(--fg-mid)', borderRadius:'50%', animation:'spin 0.8s linear infinite', margin:'0 auto 16px' }} />
        <div style={{ fontSize:11, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--fg-dim)' }}>Loading</div>
      </div>
    </div>
  );
}

// ─── APP ─────────────────────────────────────────────────────────────────────
function App() {
  const [content, setContent] = useState(null);
  const [page, setPage]       = useState(() => {
    try { return sessionStorage.getItem('sb_page') || 'home'; } catch { return 'home'; }
  });
  const [pageKey, setPageKey] = useState(0);

  // Load content once on mount
  useEffect(() => {
    loadContent().then(c => {
      setContent(c);
      applyTheme(c.branding.theme);
      updateDocMeta(c);
    });
  }, []);

  // Listen for storage changes from the CMS admin (same origin)
  useEffect(() => {
    const reload = () => {
      loadContent().then(c => {
        setContent(c);
        applyTheme(c.branding.theme);
        applyFonts(c.branding);
        applyFavicon(c.branding.logoImage);
        updateDocMeta(c);
      });
    };
    window.addEventListener('cms:content-updated', reload);
    return () => window.removeEventListener('cms:content-updated', reload);
  }, []);

  if (!content) return <LoadingScreen />;

  if (content.maintenance?.enabled) {
    return (
      <div className="page-wrapper">
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <ShaderCanvas />
        <MaintenancePage content={content} />
      </div>
    );
  }

  const navigate = p => {
    setPage(p);
    setPageKey(k => k + 1);
    try { sessionStorage.setItem('sb_page', p); } catch {}
  };

  return (
    <div className="page-wrapper">
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <ShaderCanvas />
      <Nav page={page} setPage={navigate} content={content} />
      <div className="page-content">
        {page === 'home'    && <HomePage    key={pageKey} content={content} setPage={navigate} />}
        {page === 'work'    && <WorkPage    key={pageKey} content={content} />}
        {page === 'about'   && <AboutPage   key={pageKey} content={content} />}
        {page === 'contact' && <ContactPage key={pageKey} content={content} />}
        <footer className="site-footer" style={{ borderTop:'1px solid var(--border)', padding:'20px 48px', display:'flex', justifyContent:'space-between', alignItems:'center', flexShrink:0 }}>
          <span style={{ fontSize:11, letterSpacing:'0.06em', textTransform:'uppercase', color:'var(--fg-dim)' }}>
            © {new Date().getFullYear()} {content.footer.copyright}
          </span>
          <div className="footer-socials" style={{ display:'flex', gap:20 }}>
            {content.contact.socials.map(s => (
              <a key={s.id} href={s.url} target="_blank" rel="noreferrer" className="footer-icon-link" title={s.label}
                style={{ color:'var(--fg-dim)', display:'flex', alignItems:'center', minHeight:44, minWidth:44, justifyContent:'center' }}
                onMouseEnter={e => e.currentTarget.style.color='var(--fg)'}
                onMouseLeave={e => e.currentTarget.style.color='var(--fg-dim)'}>
                {ICONS[s.icon] || null}
              </a>
            ))}
          </div>
        </footer>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);

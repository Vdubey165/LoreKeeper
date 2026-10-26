import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useThemeStore from '../store/themeStore';


const ROUTES = { signIn: '/login', register: '/register', demo: '/demo' };
const IMG = '/img/';

const FONT_HREF =
  'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..600;1,9..144,300..500&family=Instrument+Sans:wght@400;500;600&display=swap';

const THEME = `
/* Colours come straight from the workspace tokens (client/src/index.css):
   warm = :root, dark = .dark. Accent = --ink / --ink-hover. */
.lk-root[data-theme="warm"]{
  --bg:#f5f0e8; --surface:#faf7f2; --surface2:#ede8e0; --line:#e0dbd4;
  --text:#2c2825; --text2:#4a4540; --muted:#6b6560; --faint:#9b9590;
  --accent:#8b7355; --accent-hover:#6b5840; --accent-text:#6b5840; --on-accent:#faf7f2;
  --accent-soft:rgba(139,115,85,.12); --accent-line:rgba(139,115,85,.38);
  --sage:#4f7a6c; --sage-soft:rgba(79,122,108,.11); --sage-line:rgba(79,122,108,.38); --sage-text:#3b6558;
  --red:#a5493c; --red-soft:rgba(165,73,60,.09); --red-line:rgba(165,73,60,.35); --red-text:#8f3a2e;
  --neutral-line:#b0a99f;
  --glass:rgba(250,247,242,.93); --nav:rgba(245,240,232,.85);
  --graph-a:#faf7f2; --graph-b:#ede8e0;
  --shadow:0 24px 60px -24px rgba(70,50,30,.32); --shadow-sm:0 10px 24px -10px rgba(70,50,30,.28);
}
.lk-root[data-theme="dark"]{
  --bg:#1a1814; --surface:#221f1a; --surface2:#2e2a25; --line:#3a3530;
  --text:#d4cfc8; --text2:#bdb8b0; --muted:#9b9590; --faint:#6b6560;
  --accent:#a08060; --accent-hover:#c09070; --accent-text:#c09070; --on-accent:#1a1814;
  --accent-soft:rgba(160,128,96,.14); --accent-line:rgba(160,128,96,.40);
  --sage:#7fa597; --sage-soft:rgba(127,165,151,.12); --sage-line:rgba(127,165,151,.40); --sage-text:#9fc4b8;
  --red:#b5543f; --red-soft:rgba(181,84,63,.12); --red-line:rgba(181,84,63,.40); --red-text:#e08a76;
  --neutral-line:#6b6560;
  --glass:rgba(34,31,26,.92); --nav:rgba(26,24,20,.85);
  --graph-a:#262320; --graph-b:#1d1a16;
  --shadow:0 30px 80px -20px rgba(0,0,0,.8); --shadow-sm:0 14px 30px -8px rgba(0,0,0,.8);
}
`;

const CSS = `
${THEME}
.lk-root{font-family:'Instrument Sans',system-ui,sans-serif;background:var(--bg);color:var(--text);transition:background .25s,color .25s}
.lk-display{font-family:'Fraunces',Georgia,serif;font-variation-settings:'opsz' 96}
.lk-serif{font-family:'Fraunces',Georgia,serif}
.lk-surface{background:var(--surface)} .lk-surface2{background:var(--surface2)} .lk-bg{background:var(--bg)}
.lk-glass{background:var(--glass);backdrop-filter:blur(8px);border:1px solid var(--line)}
.lk-line{border-color:var(--line)}
.lk-text{color:var(--text)} .lk-muted{color:var(--muted)} .lk-faint{color:var(--faint)} .lk-acc{color:var(--accent-text)}
.lk-btn-primary{background:var(--accent);color:var(--on-accent)} .lk-btn-primary:hover{background:var(--accent-hover)}
.lk-btn-ghost{background:var(--surface);border:1px solid var(--line);color:var(--text)} .lk-btn-ghost:hover{border-color:var(--accent-line)}
.lk-chip{border:1px solid var(--line);background:var(--surface2);color:var(--text2)}
.lk-chip-copper{border:1px solid var(--accent-line);background:var(--accent-soft);color:var(--accent-text)}
.lk-chip-sage{border:1px solid var(--sage-line);background:var(--sage-soft);color:var(--sage-text)}
.lk-chip-red{border:1px solid var(--red-line);background:var(--red-soft);color:var(--red-text)}
.lk-graph{background:radial-gradient(ellipse at center,var(--graph-a) 0%,var(--graph-b) 75%)}
.lk-nodelabel{background:var(--graph-b);border-radius:8px;padding:1px 6px}
.lk-focus:focus-visible,button:focus-visible,a:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
@keyframes lk-rise{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
@keyframes lk-caret{0%,49%{opacity:1}50%,100%{opacity:0}}
.lk-rise{opacity:0;animation:lk-rise .8s cubic-bezier(.2,.7,.2,1) forwards;animation-delay:var(--d,0s)}
.lk-caret{animation:lk-caret 1.1s steps(1) infinite}
@media (prefers-reduced-motion:reduce){
  .lk-rise{opacity:1;animation:none}
  .lk-caret{animation:none}
}
`;

/* ---------- small pieces ---------- */

const Quill = ({ className = 'h-5 w-5' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" />
    <path d="M16 8 2 22" />
    <path d="M17.5 15H9" />
  </svg>
);

const Sun = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="h-[18px] w-[18px]" aria-hidden="true">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </svg>
);
const Moon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-[18px] w-[18px]" aria-hidden="true">
    <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
  </svg>
);

const Check = () => (
  <svg viewBox="0 0 20 20" className="lk-acc mx-auto h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-label="Yes">
    <path d="m4 10.5 4 4 8-9" />
  </svg>
);
const Cross = () => (
  <svg viewBox="0 0 20 20" className="lk-faint mx-auto h-4 w-4 opacity-70" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-label="No">
    <path d="m5 5 10 10M15 5 5 15" />
  </svg>
);

const Chip = ({ children, tone = 'neutral', img }) => {
  const cls = { neutral: 'lk-chip', copper: 'lk-chip-copper', sage: 'lk-chip-sage', red: 'lk-chip-red' }[tone];
  return (
    <span className={`${cls} inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium leading-none`}>
      {img && <img src={IMG + img} alt="" className="h-4 w-4 rounded-full object-cover" />}
      {children}
    </span>
  );
};

const Tile = ({ title, className = '', children, glow = false }) => (
  <div className={`lk-surface lk-line relative flex flex-col overflow-hidden rounded-3xl border p-6 ${className}`}>
    {glow && (
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full blur-3xl" style={{ background: 'var(--accent-soft)' }} />
    )}
    <h3 className="lk-serif lk-text relative text-2xl font-normal">{title}</h3>
    <div className="relative mt-4 flex-1">{children}</div>
  </div>
);

/* graph node */
const Node = ({ x, y, img, label, sub, size = 64, ring = 'var(--accent)', crest = false }) => (
  <div
    className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center text-center"
    style={{ left: `${x}%`, top: `${y}%` }}
  >
    <div
      className={`overflow-hidden rounded-full ${crest ? 'p-1.5' : ''}`}
      style={{ width: size, height: size, background: '#14110e', boxShadow: `0 0 0 2px ${ring}, var(--shadow-sm)` }}
    >
      <img src={IMG + img} alt={label} className={`h-full w-full ${crest ? 'object-contain' : 'object-cover'}`} />
    </div>
    <div className="lk-nodelabel mt-2">
      <div className="lk-serif lk-text text-[13px] leading-tight sm:text-sm">{label}</div>
      {sub && <div className="lk-muted text-[11px] leading-tight">{sub}</div>}
    </div>
  </div>
);

const EdgeLabel = ({ x, y, children }) => (
  <span
    className="lk-glass lk-muted absolute -translate-x-1/2 -translate-y-1/2 rounded-full px-2 py-0.5 text-[10px] sm:text-[11px]"
    style={{ left: `${x}%`, top: `${y}%` }}
  >
    {children}
  </span>
);

/* ---------- page ---------- */

export default function Landing({ onOpenDemo }) {
  const navigate = useNavigate();
  const openDemo = onOpenDemo || (() => navigate(ROUTES.demo));

  // Shared with the workspace: same store, same localStorage key ('theme'), dark by default.
  const theme = useThemeStore((st) => st.theme);
  const toggleTheme = useThemeStore((st) => st.toggle);

  useEffect(() => {
    if (!document.querySelector('link[data-lk-fonts]')) {
      const l = document.createElement('link');
      l.rel = 'stylesheet';
      l.href = FONT_HREF;
      l.setAttribute('data-lk-fonts', '1');
      document.head.appendChild(l);
    }
  }, []);

  const btn = 'inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold transition';

  return (
    <div data-theme={theme} className="lk-root min-h-screen overflow-x-hidden antialiased">
      <style>{CSS}</style>

      {/* NAV */}
      <header className="lk-line sticky top-0 z-40 border-b backdrop-blur" style={{ background: 'var(--nav)' }}>
        <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          <a href="/" className="lk-acc flex items-center gap-2.5">
            <Quill />
            <span className="lk-serif lk-text text-xl">Lorekeeper</span>
          </a>
          <div className="flex items-center gap-1.5 sm:gap-5">
            <a href="#features" className="lk-muted hidden text-sm transition hover:opacity-80 sm:block">Features</a>
            <button onClick={openDemo} className="lk-muted hidden text-sm transition hover:opacity-80 sm:block">Live demo</button>
            <button
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to warm mode' : 'Switch to dark mode'}
              className="lk-btn-ghost flex h-9 w-9 items-center justify-center rounded-lg"
            >
              {theme === 'dark' ? <Sun /> : <Moon />}
            </button>
            <button onClick={() => navigate(ROUTES.signIn)} className="lk-text px-3 py-2 text-sm">Sign in</button>
            <button onClick={() => navigate(ROUTES.register)} className="lk-btn-primary rounded-lg px-4 py-2 text-sm font-semibold transition">
              Get started
            </button>
          </div>
        </nav>
      </header>

      <main>
        {/* HERO */}
        <section className="mx-auto grid max-w-6xl items-center gap-10 px-5 pb-10 pt-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-6 lg:pb-14 lg:pt-12">
          <div>
            <h1 className="lk-display lk-text text-5xl font-light leading-[1.03] tracking-tight sm:text-6xl lg:text-[4.5rem]">
              Build the story.
              <br />
              Keep the world.
            </h1>
            <p className="lk-muted mt-5 max-w-sm text-lg">A writing workspace that remembers everything you invent.</p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <button onClick={openDemo} className={`${btn} lk-btn-primary`}>Open the live workspace</button>
              <button onClick={() => navigate(ROUTES.register)} className={`${btn} lk-btn-ghost`}>Create a free account</button>
            </div>
          </div>

          {/* the one memorable thing: the map with the story's own cards floating on it */}
          <div className="relative mx-auto w-full max-w-[640px] pb-8 lg:pb-0">
            <div className="absolute -inset-6 rounded-[2rem] blur-3xl" style={{ background: 'var(--accent-soft)' }} />
            <div className="lk-line relative overflow-hidden rounded-3xl border" style={{ boxShadow: 'var(--shadow)' }}>
              <img src={IMG + 'hero-map.webp'} alt="Hand-drawn map of the realm of Aethelgard" className="aspect-[16/11] w-full object-cover" />
            </div>

            <div className="lk-rise lk-glass absolute -left-2 top-5 w-[210px] rounded-2xl p-3 sm:-left-8 sm:w-[240px]" style={{ '--d': '.35s', boxShadow: 'var(--shadow-sm)' }}>
              <div className="flex items-center gap-3">
                <img src={IMG + 'sable.webp'} alt="Sable" className="h-12 w-12 rounded-full object-cover" style={{ boxShadow: '0 0 0 2px var(--accent)' }} />
                <div>
                  <div className="lk-serif lk-text text-lg leading-none">Sable</div>
                  <div className="mt-1.5 flex gap-1.5"><Chip tone="sage">Scholar</Chip><Chip tone="copper">Rogue</Chip></div>
                </div>
              </div>
            </div>

            <div className="lk-rise lk-glass absolute -right-1 top-[34%] w-[220px] rounded-2xl p-3.5 sm:-right-8 sm:w-[250px]" style={{ '--d': '.6s', boxShadow: 'var(--shadow-sm)', borderColor: 'var(--accent-line)' }}>
              <p className="lk-text text-[13px] leading-snug">Silver absorbs resonant echoes within three leagues.</p>
              <div className="mt-2.5 flex gap-1.5">
                <Chip tone="copper">World Bible</Chip>
                <Chip img="sable.webp">Sable</Chip>
              </div>
            </div>

            <div className="lk-rise lk-glass absolute -bottom-2 left-3 w-[250px] rounded-2xl p-3.5 sm:bottom-6 sm:left-6 sm:w-[280px]" style={{ '--d': '.85s', boxShadow: 'var(--shadow-sm)' }}>
              <div className="lk-muted flex items-center justify-between text-[11px]">
                <span>Chapter 1</span><Chip tone="sage">Draft</Chip>
              </div>
              <p className="lk-serif lk-text mt-2 text-[15px] italic leading-snug">“The wax on the seal carried the scent of crushed juniper…”</p>
            </div>
          </div>
        </section>

        {/* GRAPH */}
        <section className="mx-auto max-w-6xl px-5 py-8 lg:py-10">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <h2 className="lk-display lk-text text-4xl font-light sm:text-5xl">See the whole story.</h2>
            <div className="flex flex-wrap gap-2">
              <Chip tone="copper">Alliance</Chip>
              <Chip tone="red">Blood debt</Chip>
              <Chip tone="sage">Informant</Chip>
            </div>
          </div>

          <div className="lk-graph lk-line relative aspect-[10/9] w-full overflow-hidden rounded-3xl border sm:aspect-[1000/470]">
            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1000 520" preserveAspectRatio="none" aria-hidden="true">
              <g fill="none" strokeLinecap="round">
                <line x1="500" y1="260" x2="140" y2="114" style={{ stroke: 'var(--sage)' }} strokeWidth="2" strokeDasharray="5 7" vectorEffect="non-scaling-stroke" />
                <line x1="140" y1="114" x2="200" y2="416" style={{ stroke: 'var(--sage)' }} strokeWidth="1.5" strokeDasharray="3 8" opacity=".6" vectorEffect="non-scaling-stroke" />
                <line x1="500" y1="260" x2="200" y2="416" style={{ stroke: 'var(--accent)' }} strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
                <line x1="500" y1="260" x2="820" y2="104" style={{ stroke: 'var(--red)' }} strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
                <line x1="820" y1="104" x2="905" y2="364" style={{ stroke: 'var(--accent)' }} strokeWidth="1.5" opacity=".6" vectorEffect="non-scaling-stroke" />
                <line x1="500" y1="260" x2="650" y2="440" style={{ stroke: 'var(--neutral-line)' }} strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
              </g>
            </svg>

            <EdgeLabel x={32} y={36}>Informant</EdgeLabel>
            <EdgeLabel x={35} y={65}>Silver Accord</EdgeLabel>
            <EdgeLabel x={66} y={35}>Blood debt</EdgeLabel>
            <EdgeLabel x={57.5} y={67}>Neutral</EdgeLabel>

            <Node x={50} y={50} img="sable.webp" label="Sable" sub="Protagonist" size={92} />
            <Node x={14} y={22} img="vance.webp" label="Vance" sub="Street contact" size={64} ring="var(--sage)" />
            <Node x={20} y={80} img="crest-guild.webp" label="Undercity Guild" size={64} crest />
            <Node x={82} y={20} img="kael.webp" label="Kael" sub="Inquisitor" size={72} ring="var(--red)" />
            <Node x={90.5} y={70} img="crest-order.webp" label="Inquisition" size={58} ring="var(--red)" crest />
            <Node x={65} y={85} img="crest-watchers.webp" label="Spire Watchers" size={58} ring="var(--neutral-line)" crest />
          </div>
        </section>

        {/* BENTO */}
        <section id="features" className="mx-auto max-w-6xl px-5 py-8 lg:py-10">
          <div className="grid gap-4 md:grid-cols-6">
            {/* Write */}
            <Tile title="Write" className="min-h-[290px] md:col-span-3 lg:col-span-2">
              <div className="flex items-start justify-between">
                <Chip tone="sage">Draft</Chip>
                <svg viewBox="0 0 44 44" className="h-11 w-11 -rotate-90" aria-label="Word goal progress">
                  <circle cx="22" cy="22" r="18" fill="none" style={{ stroke: 'var(--line)' }} strokeWidth="3" />
                  <circle cx="22" cy="22" r="18" fill="none" style={{ stroke: 'var(--accent)' }} strokeWidth="3" strokeLinecap="round" strokeDasharray="113" strokeDashoffset="44" />
                </svg>
              </div>
              <p className="lk-serif lk-text mt-6 text-[22px] leading-[1.45]">
                She turned the vellum slowly. The ink had faded to copper
                <span className="lk-caret ml-0.5 inline-block h-[1.05em] w-[2px] translate-y-1" style={{ background: 'var(--accent)' }} />
              </p>
              <p className="lk-faint mt-5 text-xs">1,840 words today</p>
            </Tile>

            {/* Characters */}
            <Tile title="Characters" className="min-h-[290px] md:col-span-3 lg:col-span-2">
              <div className="relative mx-auto h-[205px] w-full max-w-[280px]">
                {[
                  { img: 'kael.webp', cls: '-rotate-[9deg] -translate-x-[88px] translate-y-3 z-0' },
                  { img: 'vance.webp', cls: 'rotate-[9deg] translate-x-[88px] translate-y-3 z-0' },
                  { img: 'sable.webp', cls: 'z-10 scale-[1.12]' },
                ].map((c) => (
                  <div key={c.img} className={`absolute left-1/2 top-0 -ml-[62px] w-[124px] ${c.cls}`}>
                    <div className="relative" style={{ boxShadow: 'var(--shadow-sm)' }}>
                      <img src={IMG + 'character-card.webp'} alt="" className="block w-full" />
                      <img src={IMG + c.img} alt="" className="absolute rounded-[10%] object-cover" style={{ left: '23%', top: '18.5%', width: '54%', height: '50%' }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-center"><Chip>32 dossiers</Chip></div>
            </Tile>

            {/* World */}
            <Tile title="World" className="min-h-[290px] md:col-span-6 lg:col-span-2">
              <div className="lk-line relative h-[200px] overflow-hidden rounded-2xl border">
                <img src={IMG + 'world-region.webp'} alt="Region map with pinned locations" className="h-full w-full object-cover" />
                {[
                  { l: '78%', t: '30%', n: 'Tall Spire' },
                  { l: '34%', t: '52%', n: 'Whispering Woods' },
                ].map((p) => (
                  <div key={p.n} className="absolute" style={{ left: p.l, top: p.t }}>
                    <span className="block h-3 w-3 rounded-full" style={{ background: 'var(--accent)', boxShadow: '0 0 0 4px var(--accent-line)' }} />
                    <span className="lk-glass lk-text absolute left-4 top-[-4px] whitespace-nowrap rounded-full px-2 py-0.5 text-[11px]">{p.n}</span>
                  </div>
                ))}
              </div>
            </Tile>

            {/* Plot */}
            <Tile title="Plot" className="min-h-[270px] md:col-span-6 lg:col-span-2">
              <div className="grid grid-cols-3 gap-2 text-[11px]">
                {[
                  { act: 'Act I', scenes: ['Market arrival', 'Broken seal'], on: false },
                  { act: 'Act II', scenes: ['Spire ascent', 'The betrayal'], on: true },
                  { act: 'Act III', scenes: ['Sea siege'], on: false },
                ].map((a) => (
                  <div key={a.act} className="lk-surface2 rounded-xl p-2">
                    <div className="lk-muted mb-2 px-1">{a.act}</div>
                    <div className="space-y-1.5">
                      {a.scenes.map((s, i) => {
                        const active = a.on && i === 0;
                        return (
                          <div
                            key={s}
                            className="lk-text rounded-lg border-l-2 px-2 py-2"
                            style={{
                              borderColor: active ? 'var(--accent)' : 'var(--line)',
                              background: active ? 'var(--accent-soft)' : 'var(--surface)',
                            }}
                          >
                            {s}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </Tile>

            {/* Ask (the big one) */}
            <Tile title="Ask your canon" glow className="min-h-[270px] md:col-span-6 lg:col-span-4">
              <div className="flex h-full flex-col justify-center gap-3.5">
                <div className="lk-chip lk-text self-end rounded-2xl rounded-br-md px-4 py-2.5 text-sm">What are the rules for silver?</div>
                <div className="lk-glass max-w-[560px] rounded-2xl rounded-bl-md p-5" style={{ borderColor: 'var(--accent-line)' }}>
                  <p className="lk-serif lk-text text-[19px] leading-snug">
                    Silver absorbs resonant echoes within three leagues. Direct contact burns corrupted bloodlines.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Chip tone="copper">World Bible · Silver</Chip>
                    <Chip img="sable.webp">Sable</Chip>
                    <Chip img="crest-guild.webp">Undercity Guild</Chip>
                  </div>
                </div>
                <p className="lk-faint text-xs">Every answer cites your own manuscript.</p>
              </div>
            </Tile>
          </div>
        </section>

        {/* COMPARISON */}
        <section className="mx-auto grid max-w-6xl items-center gap-6 px-5 py-8 lg:grid-cols-[0.75fr_1.25fr] lg:gap-12 lg:py-12">
          <h2 className="lk-display lk-text text-4xl font-light leading-tight sm:text-5xl">One workspace, not four tabs.</h2>
          <div className="lk-surface lk-line overflow-x-auto rounded-3xl border">
            <table className="w-full min-w-[500px] text-left text-sm">
              <thead>
                <tr className="lk-line lk-muted border-b">
                  <th className="p-4 font-medium"></th>
                  <th className="p-4 text-center font-medium">Scrivener</th>
                  <th className="p-4 text-center font-medium">Notion</th>
                  <th className="p-4 text-center font-medium">Docs</th>
                  <th className="lk-acc p-4 text-center font-semibold" style={{ background: 'var(--accent-soft)' }}>Lorekeeper</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Remembers your canon', 0, 0, 0],
                  ['Character & world wiki', 0, 1, 0],
                  ['Distraction-free drafting', 1, 0, 0],
                  ['AI that has read your story', 0, 0, 0],
                ].map(([label, a, b, c]) => (
                  <tr key={label} className="lk-line border-b last:border-0">
                    <td className="lk-text p-4">{label}</td>
                    {[a, b, c].map((v, i) => (
                      <td key={i} className="p-4">{v ? <Check /> : <Cross />}</td>
                    ))}
                    <td className="p-4" style={{ background: 'var(--accent-soft)' }}><Check /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* CTA (stays dark in both themes: it sits on a night-sky image) */}
        <section className="mx-auto max-w-6xl px-5 pb-12 pt-2">
          <div className="relative overflow-hidden rounded-3xl" style={{ boxShadow: 'var(--shadow)' }}>
            <img src={IMG + 'cta-spire.webp'} alt="" className="absolute inset-0 h-full w-full object-cover object-[70%_30%]" />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(26,23,20,.95), rgba(26,23,20,.7) 45%, rgba(26,23,20,.05))' }} />
            <div className="relative px-7 py-14 sm:px-14 sm:py-20">
              <h2 className="lk-display max-w-md text-4xl font-light leading-tight sm:text-5xl" style={{ color: '#f0e8dd' }}>
                Your world deserves its keeper.
              </h2>
              <button
                onClick={() => navigate(ROUTES.register)}
                className={`${btn} mt-7`}
                style={{ background: '#a08060', color: '#1a1814' }}
              >
                Start writing, free
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="lk-line border-t">
        <div className="lk-faint mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-6 text-sm">
          <div className="lk-acc flex items-center gap-2">
            <Quill className="h-4 w-4" />
            <span className="lk-serif lk-text text-base">Lorekeeper</span>
          </div>
          <div className="flex gap-6">
            <button onClick={() => navigate(ROUTES.signIn)} className="transition hover:opacity-80">Sign in</button>
            <button onClick={() => navigate(ROUTES.register)} className="transition hover:opacity-80">Get started</button>
          </div>
          <span>© 2026 Lorekeeper</span>
        </div>
      </footer>
    </div>
  );
}

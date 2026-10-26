import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';



// Wire these to your real routes / demo-login logic.
const ROUTES = { signIn: '/login', register: '/register', demo: '/login' };
const IMG = '/img/';

const FONT_HREF =
  'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..600;1,9..144,300..500&family=Instrument+Sans:wght@400;500;600&display=swap';

const CSS = `
.lk-root{font-family:'Instrument Sans',system-ui,sans-serif}
.lk-display{font-family:'Fraunces',Georgia,serif;font-variation-settings:'opsz' 96}
.lk-serif{font-family:'Fraunces',Georgia,serif}
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

const Check = () => (
  <svg viewBox="0 0 20 20" className="mx-auto h-4 w-4 text-[#c08a5d]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-label="Yes">
    <path d="m4 10.5 4 4 8-9" />
  </svg>
);
const Cross = () => (
  <svg viewBox="0 0 20 20" className="mx-auto h-4 w-4 text-[#6b6258]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-label="No">
    <path d="m5 5 10 10M15 5 5 15" />
  </svg>
);

const Chip = ({ children, tone = 'neutral', img }) => {
  const tones = {
    neutral: 'border-[#3a332b] bg-[#2b251f] text-[#d9cfc3]',
    copper: 'border-[#c08a5d]/40 bg-[#c08a5d]/10 text-[#e0b48a]',
    sage: 'border-[#6f9a8d]/40 bg-[#6f9a8d]/10 text-[#9fc4b8]',
  };
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium leading-none ${tones[tone]}`}>
      {img && <img src={IMG + img} alt="" className="h-4 w-4 rounded-full object-cover" />}
      {children}
    </span>
  );
};

const Tile = ({ title, className = '', children, glow = false }) => (
  <div
    className={`relative flex flex-col overflow-hidden rounded-3xl border border-[#332c25] bg-[#211d19] p-6 ${className}`}
  >
    {glow && (
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#c08a5d]/15 blur-3xl" />
    )}
    <h3 className="lk-serif relative text-2xl font-normal text-[#f0e8dd]">{title}</h3>
    <div className="relative mt-5 flex-1">{children}</div>
  </div>
);

/* graph node */
const Node = ({ x, y, img, label, sub, size = 64, ring = '#c08a5d', crest = false }) => (
  <div
    className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center text-center"
    style={{ left: `${x}%`, top: `${y}%` }}
  >
    <div
      className={`overflow-hidden rounded-full bg-[#14110e] ${crest ? 'p-1.5' : ''}`}
      style={{ width: size, height: size, boxShadow: `0 0 0 2px ${ring}, 0 0 28px ${ring}33` }}
    >
      <img src={IMG + img} alt={label} className={`h-full w-full ${crest ? 'object-contain' : 'object-cover'}`} />
    </div>
    <div className="lk-serif mt-2 text-[13px] leading-tight text-[#f0e8dd] sm:text-sm">{label}</div>
    {sub && <div className="text-[11px] leading-tight text-[#b8aea3]">{sub}</div>}
  </div>
);

const EdgeLabel = ({ x, y, children }) => (
  <span
    className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#3a332b] bg-[#1a1714]/90 px-2 py-0.5 text-[10px] text-[#b8aea3] sm:text-[11px]"
    style={{ left: `${x}%`, top: `${y}%` }}
  >
    {children}
  </span>
);

/* ---------- page ---------- */

export default function Landing({ onOpenDemo }) {
  const navigate = useNavigate();
  const openDemo = onOpenDemo || (() => navigate(ROUTES.demo));

  useEffect(() => {
    if (!document.querySelector('link[data-lk-fonts]')) {
      const l = document.createElement('link');
      l.rel = 'stylesheet';
      l.href = FONT_HREF;
      l.setAttribute('data-lk-fonts', '1');
      document.head.appendChild(l);
    }
  }, []);

  const btnPrimary =
    'inline-flex items-center justify-center rounded-xl bg-[#c08a5d] px-6 py-3 text-sm font-semibold text-[#1a1714] transition hover:bg-[#d09a6c] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e0b48a]';
  const btnGhost =
    'inline-flex items-center justify-center rounded-xl border border-[#3a332b] bg-[#211d19] px-6 py-3 text-sm font-semibold text-[#f0e8dd] transition hover:border-[#c08a5d]/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e0b48a]';

  return (
    <div className="lk-root min-h-screen overflow-x-hidden bg-[#1a1714] text-[#f0e8dd] antialiased">
      <style>{CSS}</style>

      {/* NAV */}
      <header className="sticky top-0 z-40 border-b border-[#2a241e] bg-[#1a1714]/85 backdrop-blur">
        <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          <a href="/" className="flex items-center gap-2.5 text-[#e0b48a]">
            <Quill />
            <span className="lk-serif text-xl text-[#f0e8dd]">Lorekeeper</span>
          </a>
          <div className="flex items-center gap-2 sm:gap-6">
            <a href="#features" className="hidden text-sm text-[#b8aea3] transition hover:text-[#f0e8dd] sm:block">Features</a>
            <button onClick={openDemo} className="hidden text-sm text-[#b8aea3] transition hover:text-[#f0e8dd] sm:block">Live demo</button>
            <button onClick={() => navigate(ROUTES.signIn)} className="px-3 py-2 text-sm text-[#f0e8dd]">Sign in</button>
            <button onClick={() => navigate(ROUTES.register)} className="rounded-lg bg-[#c08a5d] px-4 py-2 text-sm font-semibold text-[#1a1714] transition hover:bg-[#d09a6c]">
              Get started
            </button>
          </div>
        </nav>
      </header>

      <main>
        {/* HERO */}
        <section className="mx-auto grid max-w-6xl items-center gap-12 px-5 pb-16 pt-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-6 lg:pb-24 lg:pt-20">
          <div>
            <h1 className="lk-display text-5xl font-light leading-[1.03] tracking-tight sm:text-6xl lg:text-[4.5rem]">
              Build the story.
              <br />
              Keep the world.
            </h1>
            <p className="mt-6 max-w-sm text-lg text-[#b8aea3]">
              A writing workspace that remembers everything you invent.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <button onClick={openDemo} className={btnPrimary}>Open the live workspace</button>
              <button onClick={() => navigate(ROUTES.register)} className={btnGhost}>Create a free account</button>
            </div>
          </div>

          {/* the one memorable thing: the map with the story's own cards floating on it */}
          <div className="relative mx-auto w-full max-w-[640px] pb-10 lg:pb-0">
            <div className="absolute -inset-6 rounded-[2rem] bg-[#c08a5d]/10 blur-3xl" />
            <div className="relative overflow-hidden rounded-3xl border border-[#3a332b] shadow-[0_30px_80px_-20px_rgba(0,0,0,.8)]">
              <img src={IMG + 'hero-map.webp'} alt="Hand-drawn map of the realm of Aethelgard" className="aspect-[16/11] w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a1714]/50 via-transparent to-[#1a1714]/10" />
            </div>

            <div className="lk-rise absolute -left-2 top-5 w-[210px] rounded-2xl border border-[#3a332b] bg-[#1a1714]/90 p-3 shadow-xl backdrop-blur sm:-left-8 sm:w-[240px]" style={{ '--d': '.35s' }}>
              <div className="flex items-center gap-3">
                <img src={IMG + 'sable.webp'} alt="Sable" className="h-12 w-12 rounded-full object-cover ring-2 ring-[#c08a5d]" />
                <div>
                  <div className="lk-serif text-lg leading-none">Sable</div>
                  <div className="mt-1.5 flex gap-1.5"><Chip tone="sage">Scholar</Chip><Chip tone="copper">Rogue</Chip></div>
                </div>
              </div>
            </div>

            <div className="lk-rise absolute -right-1 top-[34%] w-[220px] rounded-2xl border border-[#c08a5d]/30 bg-[#1a1714]/92 p-3.5 shadow-xl backdrop-blur sm:-right-8 sm:w-[250px]" style={{ '--d': '.6s' }}>
              <p className="text-[13px] leading-snug text-[#f0e8dd]">Silver absorbs resonant echoes within three leagues.</p>
              <div className="mt-2.5 flex gap-1.5">
                <Chip tone="copper">World Bible</Chip>
                <Chip img="sable.webp">Sable</Chip>
              </div>
            </div>

            <div className="lk-rise absolute -bottom-2 left-3 w-[250px] rounded-2xl border border-[#3a332b] bg-[#1a1714]/92 p-3.5 shadow-xl backdrop-blur sm:bottom-6 sm:left-6 sm:w-[280px]" style={{ '--d': '.85s' }}>
              <div className="flex items-center justify-between text-[11px] text-[#b8aea3]">
                <span>Chapter 1</span><Chip tone="sage">Draft</Chip>
              </div>
              <p className="lk-serif mt-2 text-[15px] italic leading-snug text-[#e8dccd]">“The wax on the seal carried the scent of crushed juniper…”</p>
            </div>
          </div>
        </section>

        {/* GRAPH */}
        <section className="mx-auto max-w-6xl px-5 py-12 lg:py-20">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <h2 className="lk-display text-4xl font-light sm:text-5xl">See the whole story.</h2>
            <div className="flex flex-wrap gap-2">
              <Chip tone="copper">Alliance</Chip>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#b5543f]/40 bg-[#b5543f]/10 px-2.5 py-1 text-[11px] font-medium leading-none text-[#e08a76]">Blood debt</span>
              <Chip tone="sage">Informant</Chip>
            </div>
          </div>

          <div className="relative aspect-[10/9] w-full overflow-hidden rounded-3xl border border-[#332c25] bg-[radial-gradient(ellipse_at_center,#2a231c_0%,#1e1a16_70%)] sm:aspect-[1000/520]">
            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1000 520" preserveAspectRatio="none" aria-hidden="true">
              <g fill="none" strokeLinecap="round" vectorEffect="non-scaling-stroke">
                <line x1="500" y1="260" x2="140" y2="114" stroke="#6f9a8d" strokeWidth="2" strokeDasharray="5 7" vectorEffect="non-scaling-stroke" />
                <line x1="140" y1="114" x2="200" y2="416" stroke="#6f9a8d" strokeWidth="1.5" strokeDasharray="3 8" opacity=".6" vectorEffect="non-scaling-stroke" />
                <line x1="500" y1="260" x2="200" y2="416" stroke="#c08a5d" strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
                <line x1="500" y1="260" x2="820" y2="104" stroke="#b5543f" strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
                <line x1="820" y1="104" x2="905" y2="364" stroke="#c08a5d" strokeWidth="1.5" opacity=".6" vectorEffect="non-scaling-stroke" />
                <line x1="500" y1="260" x2="650" y2="440" stroke="#6b6258" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
              </g>
            </svg>

            <EdgeLabel x={32} y={36}>Informant</EdgeLabel>
            <EdgeLabel x={35} y={65}>Silver Accord</EdgeLabel>
            <EdgeLabel x={66} y={35}>Blood debt</EdgeLabel>
            <EdgeLabel x={57.5} y={67}>Neutral</EdgeLabel>

            <Node x={50} y={50} img="sable.webp" label="Sable" sub="Protagonist" size={92} />
            <Node x={14} y={22} img="vance.webp" label="Vance" sub="Informant" size={64} ring="#6f9a8d" />
            <Node x={20} y={80} img="crest-guild.webp" label="Undercity Guild" size={64} crest />
            <Node x={82} y={20} img="kael.webp" label="Kael" sub="Inquisitor" size={72} ring="#b5543f" />
            <Node x={90.5} y={70} img="crest-order.webp" label="Inquisition" size={58} ring="#b5543f" crest />
            <Node x={65} y={85} img="crest-watchers.webp" label="Spire Watchers" size={58} ring="#6b6258" crest />
          </div>
        </section>

        {/* BENTO */}
        <section id="features" className="mx-auto max-w-6xl px-5 py-12 lg:py-16">
          <div className="grid gap-4 md:grid-cols-6">
            {/* Write */}
            <Tile title="Write" className="min-h-[320px] md:col-span-3 lg:col-span-2">
              <div className="flex items-start justify-between">
                <Chip tone="sage">Draft</Chip>
                <div className="relative h-11 w-11">
                  <svg viewBox="0 0 44 44" className="h-11 w-11 -rotate-90">
                    <circle cx="22" cy="22" r="18" fill="none" stroke="#3a332b" strokeWidth="3" />
                    <circle cx="22" cy="22" r="18" fill="none" stroke="#c08a5d" strokeWidth="3" strokeLinecap="round" strokeDasharray="113" strokeDashoffset="44" />
                  </svg>
                </div>
              </div>
              <p className="lk-serif mt-8 text-[22px] leading-[1.45] text-[#f0e8dd]">
                She turned the vellum slowly. The ink had faded to copper
                <span className="lk-caret ml-0.5 inline-block h-[1.05em] w-[2px] translate-y-1 bg-[#c08a5d]" />
              </p>
              <p className="mt-6 text-xs text-[#8f857a]">1,840 words today</p>
            </Tile>

            {/* Characters */}
            <Tile title="Characters" className="min-h-[320px] md:col-span-3 lg:col-span-2">
              <div className="relative mx-auto mt-2 h-[220px] w-full max-w-[280px]">
                {[
                  { img: 'kael.webp', cls: '-rotate-[9deg] -translate-x-[88px] translate-y-3 z-0' },
                  { img: 'vance.webp', cls: 'rotate-[9deg] translate-x-[88px] translate-y-3 z-0' },
                  { img: 'sable.webp', cls: 'z-10 scale-[1.12]' },
                ].map((c) => (
                  <div key={c.img} className={`absolute left-1/2 top-0 -ml-[62px] w-[124px] transition-transform ${c.cls}`}>
                    <div className="relative shadow-[0_14px_30px_-8px_rgba(0,0,0,.8)]">
                      <img src={IMG + 'character-card.webp'} alt="" className="block w-full" />
                      <img src={IMG + c.img} alt="" className="absolute rounded-[10%] object-cover" style={{ left: '23%', top: '18.5%', width: '54%', height: '50%' }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-2 flex justify-center"><Chip>32 dossiers</Chip></div>
            </Tile>

            {/* World */}
            <Tile title="World" className="min-h-[320px] md:col-span-6 lg:col-span-2">
              <div className="relative h-[210px] overflow-hidden rounded-2xl border border-[#3a332b]">
                <img src={IMG + 'world-region.webp'} alt="Region map with pinned locations" className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a1714]/50 to-transparent" />
                {[
                  { l: '78%', t: '30%', n: 'Tall Spire' },
                  { l: '34%', t: '52%', n: 'Whispering Woods' },
                ].map((p) => (
                  <div key={p.n} className="absolute" style={{ left: p.l, top: p.t }}>
                    <span className="block h-3 w-3 rounded-full bg-[#c08a5d] ring-4 ring-[#c08a5d]/30" />
                    <span className="absolute left-4 top-[-4px] whitespace-nowrap rounded-full border border-[#3a332b] bg-[#1a1714]/90 px-2 py-0.5 text-[11px] text-[#f0e8dd]">{p.n}</span>
                  </div>
                ))}
              </div>
            </Tile>

            {/* Plot */}
            <Tile title="Plot" className="min-h-[300px] md:col-span-6 lg:col-span-2">
              <div className="grid grid-cols-3 gap-2 text-[11px]">
                {[
                  { act: 'Act I', scenes: ['Market arrival', 'Broken seal'], on: false },
                  { act: 'Act II', scenes: ['Spire ascent', 'The betrayal'], on: true },
                  { act: 'Act III', scenes: ['Sea siege'], on: false },
                ].map((a) => (
                  <div key={a.act} className="rounded-xl bg-[#1a1714] p-2">
                    <div className="mb-2 px-1 text-[#b8aea3]">{a.act}</div>
                    <div className="space-y-1.5">
                      {a.scenes.map((s, i) => (
                        <div
                          key={s}
                          className={`rounded-lg border-l-2 px-2 py-2 text-[#f0e8dd] ${
                            a.on && i === 0 ? 'border-[#c08a5d] bg-[#c08a5d]/15' : 'border-[#4a4238] bg-[#2b251f]'
                          }`}
                        >
                          {s}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Tile>

            {/* Ask (the big one) */}
            <Tile title="Ask your canon" glow className="min-h-[300px] md:col-span-6 lg:col-span-4">
              <div className="flex h-full flex-col justify-center gap-4">
                <div className="self-end rounded-2xl rounded-br-md border border-[#3a332b] bg-[#2b251f] px-4 py-2.5 text-sm">
                  What are the rules for silver?
                </div>
                <div className="max-w-[560px] rounded-2xl rounded-bl-md border border-[#c08a5d]/30 bg-[#1a1714]/80 p-5">
                  <p className="lk-serif text-[19px] leading-snug text-[#f0e8dd]">
                    Silver absorbs resonant echoes within three leagues. Direct contact burns corrupted bloodlines.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Chip tone="copper">World Bible · Silver</Chip>
                    <Chip img="sable.webp">Sable</Chip>
                    <Chip img="crest-guild.webp">Undercity Guild</Chip>
                  </div>
                </div>
                <p className="text-xs text-[#8f857a]">Every answer cites your own manuscript.</p>
              </div>
            </Tile>
          </div>
        </section>

        {/* COMPARISON */}
        <section className="mx-auto max-w-4xl px-5 py-12 lg:py-20">
          <h2 className="lk-display mb-8 text-4xl font-light sm:text-5xl">One workspace, not four tabs.</h2>
          <div className="overflow-x-auto rounded-3xl border border-[#332c25] bg-[#211d19]">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead>
                <tr className="border-b border-[#332c25] text-[#b8aea3]">
                  <th className="p-4 font-medium"></th>
                  <th className="p-4 text-center font-medium">Scrivener</th>
                  <th className="p-4 text-center font-medium">Notion</th>
                  <th className="p-4 text-center font-medium">Docs</th>
                  <th className="bg-[#c08a5d]/10 p-4 text-center font-semibold text-[#e0b48a]">Lorekeeper</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Remembers your canon', 0, 0, 0],
                  ['Character & world wiki', 0, 1, 0],
                  ['Distraction-free drafting', 1, 0, 0],
                  ['AI that has read your story', 0, 0, 0],
                ].map(([label, a, b, c]) => (
                  <tr key={label} className="border-b border-[#2a241e] last:border-0">
                    <td className="p-4 text-[#f0e8dd]">{label}</td>
                    {[a, b, c].map((v, i) => (
                      <td key={i} className="p-4">{v ? <Check /> : <Cross />}</td>
                    ))}
                    <td className="bg-[#c08a5d]/10 p-4"><Check /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-6xl px-5 pb-20 pt-6">
          <div className="relative overflow-hidden rounded-3xl border border-[#332c25]">
            <img src={IMG + 'cta-spire.webp'} alt="" className="absolute inset-0 h-full w-full object-cover object-[70%_30%]" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#1a1714] via-[#1a1714]/70 to-[#1a1714]/10" />
            <div className="relative px-7 py-20 sm:px-14 sm:py-28">
              <h2 className="lk-display max-w-md text-4xl font-light leading-tight sm:text-5xl">Your world deserves its keeper.</h2>
              <button onClick={() => navigate(ROUTES.register)} className={`${btnPrimary} mt-8`}>Start writing, free</button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#2a241e]">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-8 text-sm text-[#8f857a]">
          <div className="flex items-center gap-2 text-[#e0b48a]">
            <Quill className="h-4 w-4" />
            <span className="lk-serif text-base text-[#f0e8dd]">Lorekeeper</span>
          </div>
          <div className="flex gap-6">
            <button onClick={() => navigate(ROUTES.signIn)} className="transition hover:text-[#f0e8dd]">Sign in</button>
            <button onClick={() => navigate(ROUTES.register)} className="transition hover:text-[#f0e8dd]">Get started</button>
          </div>
          <span>© 2026 Lorekeeper</span>
        </div>
      </footer>
    </div>
  );
}

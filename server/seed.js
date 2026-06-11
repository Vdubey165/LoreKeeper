/**
 * Lorekeeper seed script
 * Usage: node seed.js
 *
 * Populates your account with the template story for screenshots.
 * Run from the server/ directory after filling in your credentials below.
 */

const BASE_URL = 'http://localhost:5000/api' // or your Render URL

const EMAIL    = 'vaibhav1@gmail.com'   // ← your account email
const PASSWORD = '123456'     // ← your account password

// ─── Template data (copy of client/src/lib/templateData.js) ───────────────

const TEMPLATE_STORY = {
  title: 'The Ashen Crown',
  description: 'In a dying empire built on stolen magic, a disgraced archivist uncovers a secret that could unravel the throne — or burn what remains of the world.',
  genre: 'fantasy',
}

const TEMPLATE_CHARACTERS = [
  {
    name: 'Sable Voss',
    role: 'protagonist',
    aliases: ['The Archivist', 'Ash'],
    traits: ['Methodical', 'Distrustful', 'Quietly ruthless'],
    appearance: 'Lean and sharp-featured, with ink-stained fingers and close-cropped dark hair. Always wears a coat with too many pockets. Her left eye is grey; her right is pale gold — a mark of partial Binding.',
    backstory: "Once the empire's most trusted archivist, Sable was stripped of her position after she documented evidence of the Crown's illegal Binding practices. She destroyed the evidence before they could use it against her — a decision she has never fully explained, even to herself.",
    motivations: 'To understand what the Crown is building before it is too late to stop it. She does not believe she can win — she only believes someone should try.',
  },
  {
    name: 'Cael Dorne',
    role: 'supporting',
    aliases: ['The Lapsed'],
    traits: ['Sardonic', 'Loyal to a fault', 'Physically imposing'],
    appearance: 'Broad-shouldered with a broken nose that healed wrong and a voice like gravel. Former soldier. Carries no weapons visibly, which is somehow more threatening.',
    backstory: 'Cael served the Crown\'s military for twelve years before deserting during the Siege of Vel Nara. He met Sable in a debtor\'s prison three years ago. He has never told her why he was there.',
    motivations: 'He stopped believing in causes a long time ago. He believes in Sable, which is more dangerous.',
  },
  {
    name: 'Empress Vethara Solen',
    role: 'antagonist',
    aliases: ['The Bound Empress', 'Her Radiance'],
    traits: ['Brilliant', 'Utterly convinced of her own righteousness', 'Capable of genuine warmth'],
    appearance: 'Tall, ageless in the way only the Bound can be. Silver hair worn loose. Her eyes are entirely white.',
    backstory: 'Vethara did not inherit the throne. She took it, at twenty-three, during the Sundering. She has ruled for forty years. No one alive remembers what the empire looked like before her.',
    motivations: 'She believes the empire is the only thing standing between humanity and the Void. She is probably right. She is also willing to do anything to preserve it.',
  },
]

const TEMPLATE_WORLD_ENTRIES = [
  {
    type: 'lore',
    title: 'The Binding',
    body: "The Binding is the empire's foundational magic — a process by which a person's life force is tethered to an object, a place, or another person, granting extraordinary abilities at the cost of autonomy. The Bound cannot act against their tether's interests.\n\nWhat the Crown does not publish: the Binding is irreversible, degrades the soul over time, and was originally stolen from the Ashen peoples of the eastern territories during the Sundering.",
    tags: ['magic', 'empire', 'central conflict'],
  },
  {
    type: 'location',
    title: 'The Vault of Unwritten Things',
    body: 'Deep beneath the imperial palace lies the Vault — a vast archive of documents the Crown has chosen to make officially non-existent. Confiscated histories, redacted census records, the original Binding texts. Sable spent six years working in the upper levels before her dismissal.',
    tags: ['palace', 'archive', 'key location'],
  },
  {
    type: 'location',
    title: 'The Greymarket, Vel Sarne',
    body: "The capital city's unofficial underbelly — a shifting network of stalls, tenements, and back-room dealings that occupies the oldest quarter of Vel Sarne. Sable and Cael operate out of a room above a cartographer's shop here.",
    tags: ['city', 'base of operations'],
  },
  {
    type: 'faction',
    title: 'The Ashen Compact',
    body: 'A loose coalition of survivors from the eastern territories, operating underground throughout the empire. They share knowledge: oral histories, pre-Sundering texts, and a deep understanding of what the Binding actually is and where it came from.',
    tags: ['faction', 'underground', 'eastern territories'],
  },
  {
    type: 'lore',
    title: 'The Ashen Crown (the object)',
    body: "Not the empire's crown of state. The Ashen Crown is something older: a circlet of blackened bone that predates the empire by at least three centuries, recovered during the Sundering from the ruins of Vel Nara. The Ashen Compact calls it the source.",
    tags: ['artefact', 'central mystery'],
  },
]

const TEMPLATE_PLOT_NODES = [
  { act: 1, title: 'Sable receives an anonymous package — redacted pages from the Vault', status: 'done', notes: "Opens in media res. She already knows it's a trap. She opens it anyway.", order: 0 },
  { act: 1, title: "She goes to Cael. He tells her to burn it. She doesn't.", status: 'done', notes: 'First scene together. Establish dynamic — he is the voice of reason she systematically ignores.', order: 1 },
  { act: 1, title: 'The pages reference something called the Second Binding — and name the Empress as its subject', status: 'draft', notes: 'End of act one reveal. The Empress is not the one doing the Binding. She is the one being Bound. To what?', order: 2 },
  { act: 2, title: 'Sable makes contact with the Ashen Compact to understand what the Second Binding means', status: 'idea', notes: 'They know more than she expected. They are also more frightened than she expected.', order: 3 },
]

const TEMPLATE_CHAPTER = {
  title: 'Chapter One — The Package',
  status: 'draft',
  order: 0,
  plainText: 'The package arrived on a Vethday...',
  content: {
    type: 'doc',
    content: [
      { type: 'paragraph', content: [{ type: 'text', text: "The package arrived on a Vethday, which Sable had always considered the empire's least inspired contribution to the calendar. A day named for the Empress felt like an overclaim. She signed for it without looking at the courier's face — a habit from her archive years, when you learned quickly that the less you knew about the delivery, the less you could be made to testify about." }] },
      { type: 'paragraph', content: [{ type: 'text', text: 'Inside: seven pages, edges burned clean in the way that suggested someone had been careful rather than hasty. Imperial watermark on the upper left, the seal of the Vault of Unwritten Things pressed into the corner in ink that had been regulation black once and had faded to something closer to grief.' }] },
      { type: 'paragraph', content: [{ type: 'text', text: 'She read the first page standing up. She sat down for the second. By the third she had stopped breathing in any meaningful sense and was simply moving air through her lungs on principle.' }] },
      { type: 'paragraph', content: [{ type: 'text', text: "Cael found her like that twenty minutes later — still at the table, the pages arranged in front of her with the precision of someone who had been trained to treat documents as evidence. He looked at her face, then at the pages, then back at her face." }] },
      { type: 'paragraph', content: [{ type: 'text', text: '"Burn it," he said.' }] },
      { type: 'paragraph', content: [{ type: 'text', text: '"I\'m not going to burn it."' }] },
      { type: 'paragraph', content: [{ type: 'text', text: '"I know." He pulled out the chair across from her and sat down with the resignation of a man who had made his peace with bad outcomes. "I\'m telling you to burn it so that later, when everything has gone wrong, I can say I told you to burn it."' }] },
      { type: 'paragraph', content: [{ type: 'text', text: 'Sable looked up from the pages for the first time. "Everything hasn\'t gone wrong yet."' }] },
      { type: 'paragraph', content: [{ type: 'text', text: '"No," Cael agreed. "But you\'re holding seven pages from the Vault with your own dismissal order stapled to the back of them, which means someone inside the palace knows who you are and where you live and wants you to know something they can\'t say out loud." He folded his hands on the table. "That\'s not a beginning, Sable. That\'s already the middle."' }] },
      { type: 'paragraph', content: [{ type: 'text', text: 'She turned the fourth page over. Two words survived in the lower margin, in handwriting she recognised.' }] },
      { type: 'paragraph', content: [{ type: 'text', text: 'Her own.' }] },
      { type: 'blockquote', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Second Binding.' }] }] },
      { type: 'paragraph', content: [{ type: 'text', text: 'She had no memory of writing it. That was, she decided, the most frightening thing she had encountered in a career that had not been short on frightening things.' }] },
      { type: 'paragraph', content: [{ type: 'text', text: '"Tell me," Cael said quietly, "that you\'re going to burn it."' }] },
      { type: 'paragraph', content: [{ type: 'text', text: "Sable folded the pages carefully and put them in the inside pocket of her coat, next to her heart, where she kept things she could not afford to lose." }] },
      { type: 'paragraph', content: [{ type: 'text', text: '"I need to find someone who knows what the Second Binding is," she said. "And I need to do it before whoever sent this realises I\'m not frightened enough to stay home."' }] },
      { type: 'paragraph', content: [{ type: 'text', text: '"You are frightened," he said.' }] },
      { type: 'paragraph', content: [{ type: 'text', text: '"Yes," Sable agreed. "But I\'m also curious, which has always been the more dangerous of the two."' }] },
    ],
  },
}

// ─── Seed ────────────────────────────────────────────────────────────────────

async function request(method, path, body, token) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || `${method} ${path} failed`)
  return data
}

async function seed() {
  console.log('🌱 Lorekeeper seed script\n')

  // 1. Login
  console.log('→ Logging in...')
  const { token } = await request('POST', '/auth/login', { email: EMAIL, password: PASSWORD })
  console.log('✓ Logged in\n')

  // 2. Create story
  console.log('→ Creating story...')
  const story = await request('POST', '/stories', TEMPLATE_STORY, token)
  console.log(`✓ Story created: "${story.title}" (${story._id})\n`)

  const sid = story._id

  // 3. Characters
  console.log('→ Creating characters...')
  for (const char of TEMPLATE_CHARACTERS) {
    const c = await request('POST', `/stories/${sid}/characters`, char, token)
    console.log(`  ✓ ${c.name}`)
  }

  // 4. World entries
  console.log('\n→ Creating world entries...')
  for (const entry of TEMPLATE_WORLD_ENTRIES) {
    const e = await request('POST', `/stories/${sid}/world`, entry, token)
    console.log(`  ✓ [${e.type}] ${e.title}`)
  }

  // 5. Plot nodes
  console.log('\n→ Creating plot nodes...')
  for (const node of TEMPLATE_PLOT_NODES) {
    const n = await request('POST', `/stories/${sid}/plot`, node, token)
    console.log(`  ✓ Act ${n.act}: ${n.title.slice(0, 50)}...`)
  }

  // 6. Chapter
  console.log('\n→ Creating chapter...')
  const chapter = await request('POST', `/stories/${sid}/chapters`, TEMPLATE_CHAPTER, token)
  console.log(`  ✓ ${chapter.title}`)

  console.log('\n✅ Done! Open Lorekeeper and you should see "The Ashen Crown" in your dashboard.')
  console.log(`   Story ID: ${sid}`)
}

seed().catch(err => {
  console.error('\n❌ Seed failed:', err.message)
  process.exit(1)
})

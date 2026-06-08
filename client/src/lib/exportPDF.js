// Converts Tiptap JSON content to clean HTML for print
function tiptapToHtml(content) {
  if (!content || !content.content) return ''
  return content.content.map(node => nodeToHtml(node)).join('')
}

function nodeToHtml(node) {
  if (!node) return ''
  switch (node.type) {
    case 'paragraph':
      return `<p>${(node.content || []).map(inlineToHtml).join('') || '&nbsp;'}</p>`
    case 'heading':
      return `<h${node.attrs?.level || 2}>${(node.content || []).map(inlineToHtml).join('')}</h${node.attrs?.level || 2}>`
    case 'blockquote':
      return `<blockquote>${(node.content || []).map(nodeToHtml).join('')}</blockquote>`
    case 'bulletList':
      return `<ul>${(node.content || []).map(nodeToHtml).join('')}</ul>`
    case 'orderedList':
      return `<ol>${(node.content || []).map(nodeToHtml).join('')}</ol>`
    case 'listItem':
      return `<li>${(node.content || []).map(nodeToHtml).join('')}</li>`
    case 'horizontalRule':
      return `<hr/>`
    default:
      return (node.content || []).map(nodeToHtml).join('')
  }
}

function inlineToHtml(node) {
  if (!node) return ''
  if (node.type === 'hardBreak') return '<br/>'
  let text = node.text || ''
  if (!text) return ''
  text = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  const marks = node.marks || []
  marks.forEach(mark => {
    if (mark.type === 'bold')   text = `<strong>${text}</strong>`
    if (mark.type === 'italic') text = `<em>${text}</em>`
    if (mark.type === 'underline') text = `<u>${text}</u>`
  })
  return text
}

const PRINT_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,600;1,400&family=Inter:wght@400;500;600&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    font-family: 'EB Garamond', Georgia, serif;
    font-size: 12pt;
    line-height: 1.8;
    color: #1a1a1a;
    background: #fff;
  }

  .cover-page {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    text-align: center;
    padding: 60px 40px;
    page-break-after: always;
    border-bottom: none;
  }

  .cover-label {
    font-family: 'Inter', sans-serif;
    font-size: 9pt;
    font-weight: 500;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: #888;
    margin-bottom: 24px;
  }

  .cover-title {
    font-family: 'EB Garamond', Georgia, serif;
    font-size: 36pt;
    font-weight: 600;
    line-height: 1.2;
    color: #1a1a1a;
    margin-bottom: 16px;
  }

  .cover-genre {
    font-family: 'Inter', sans-serif;
    font-size: 10pt;
    color: #888;
    margin-bottom: 8px;
    text-transform: capitalize;
  }

  .cover-meta {
    font-family: 'Inter', sans-serif;
    font-size: 9pt;
    color: #aaa;
    margin-top: 48px;
  }

  .cover-divider {
    width: 48px;
    height: 1px;
    background: #ccc;
    margin: 24px auto;
  }

  .chapter-page {
    padding: 48px 72px;
    page-break-before: always;
    max-width: 100%;
  }

  .chapter-number {
    font-family: 'Inter', sans-serif;
    font-size: 8pt;
    font-weight: 500;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: #aaa;
    margin-bottom: 8px;
  }

  .chapter-title {
    font-family: 'EB Garamond', Georgia, serif;
    font-size: 22pt;
    font-weight: 600;
    color: #1a1a1a;
    margin-bottom: 4px;
    line-height: 1.3;
  }

  .chapter-divider {
    width: 32px;
    height: 1px;
    background: #ccc;
    margin: 20px 0 32px;
  }

  .chapter-content p {
    margin-bottom: 1em;
    text-align: justify;
    hyphens: auto;
  }

  .chapter-content p + p {
    text-indent: 1.5em;
  }

  .chapter-content blockquote {
    border-left: 2px solid #ccc;
    padding-left: 16px;
    color: #555;
    font-style: italic;
    margin: 1.5em 0;
  }

  .chapter-content ul, .chapter-content ol {
    margin: 1em 0 1em 2em;
  }

  .chapter-content hr {
    border: none;
    border-top: 1px solid #ddd;
    margin: 2em auto;
    width: 64px;
  }

  .chapter-content strong { font-weight: 600; }
  .chapter-content em { font-style: italic; }

  /* Wiki styles */
  .wiki-section {
    padding: 40px 72px;
    page-break-before: always;
  }

  .wiki-section-title {
    font-family: 'Inter', sans-serif;
    font-size: 9pt;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #888;
    margin-bottom: 24px;
    padding-bottom: 8px;
    border-bottom: 1px solid #eee;
  }

  .wiki-entry {
    margin-bottom: 28px;
    padding-bottom: 28px;
    border-bottom: 1px solid #f0f0f0;
  }

  .wiki-entry:last-child { border-bottom: none; }

  .wiki-entry-name {
    font-family: 'EB Garamond', Georgia, serif;
    font-size: 15pt;
    font-weight: 600;
    color: #1a1a1a;
    margin-bottom: 2px;
  }

  .wiki-entry-role {
    font-family: 'Inter', sans-serif;
    font-size: 8pt;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #aaa;
    margin-bottom: 10px;
  }

  .wiki-entry-field {
    margin-bottom: 8px;
  }

  .wiki-entry-label {
    font-family: 'Inter', sans-serif;
    font-size: 8pt;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #999;
    margin-bottom: 2px;
  }

  .wiki-entry-value {
    font-size: 11pt;
    line-height: 1.6;
    color: #333;
  }

  .wiki-traits {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 4px;
  }

  .wiki-trait {
    font-family: 'Inter', sans-serif;
    font-size: 8pt;
    padding: 2px 8px;
    border: 1px solid #ddd;
    border-radius: 20px;
    color: #555;
  }

  @page {
    margin: 0;
    size: A4;
  }

  @media print {
    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  }
`

export function exportChaptersPDF(story, chapters) {
  const body = `
    <div class="cover-page">
      <div class="cover-label">Story</div>
      <div class="cover-title">${story.title}</div>
      <div class="cover-divider"></div>
      <div class="cover-genre">${story.genre}</div>
      ${story.description ? `<p style="font-size:11pt;color:#555;max-width:400px;margin:16px auto;line-height:1.6">${story.description}</p>` : ''}
      <div class="cover-meta">
        ${story.wordCount?.toLocaleString() || 0} words &nbsp;·&nbsp;
        ${chapters.length} chapter${chapters.length !== 1 ? 's' : ''} &nbsp;·&nbsp;
        ${new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
      </div>
    </div>

    ${chapters.map((ch, i) => `
      <div class="chapter-page">
        <div class="chapter-number">Chapter ${i + 1}</div>
        <div class="chapter-title">${ch.title}</div>
        <div class="chapter-divider"></div>
        <div class="chapter-content">
          ${ch.content ? tiptapToHtml(ch.content) : '<p style="color:#aaa;font-style:italic">No content yet.</p>'}
        </div>
      </div>
    `).join('')}
  `
  triggerPrint(body, `${story.title} — Chapters`)
}

export function exportWikiPDF(story, characters, worldEntries) {
  const byType = (type) => worldEntries.filter(e => e.type === type)
  const types = ['location', 'faction', 'lore', 'item', 'event', 'other']

  const characterSection = characters.length > 0 ? `
    <div class="wiki-section">
      <div class="wiki-section-title">Characters</div>
      ${characters.map(c => `
        <div class="wiki-entry">
          <div class="wiki-entry-name">${c.name}</div>
          <div class="wiki-entry-role">${c.role}${c.aliases?.length ? ` · ${c.aliases.join(', ')}` : ''}</div>
          ${c.traits?.length ? `
            <div class="wiki-entry-field">
              <div class="wiki-entry-label">Traits</div>
              <div class="wiki-traits">${c.traits.map(t => `<span class="wiki-trait">${t}</span>`).join('')}</div>
            </div>` : ''}
          ${c.appearance ? `<div class="wiki-entry-field"><div class="wiki-entry-label">Appearance</div><div class="wiki-entry-value">${c.appearance}</div></div>` : ''}
          ${c.backstory ? `<div class="wiki-entry-field"><div class="wiki-entry-label">Backstory</div><div class="wiki-entry-value">${c.backstory}</div></div>` : ''}
          ${c.motivations ? `<div class="wiki-entry-field"><div class="wiki-entry-label">Motivations</div><div class="wiki-entry-value">${c.motivations}</div></div>` : ''}
        </div>
      `).join('')}
    </div>` : ''

  const worldSections = types.map(type => {
    const entries = byType(type)
    if (!entries.length) return ''
    return `
      <div class="wiki-section">
        <div class="wiki-section-title">${type.charAt(0).toUpperCase() + type.slice(1)}s</div>
        ${entries.map(e => `
          <div class="wiki-entry">
            <div class="wiki-entry-name">${e.title}</div>
            ${e.tags?.length ? `<div class="wiki-entry-role">${e.tags.join(' · ')}</div>` : ''}
            ${e.body ? `<div class="wiki-entry-value" style="margin-top:8px">${e.body}</div>` : ''}
          </div>
        `).join('')}
      </div>`
  }).join('')

  const body = `
    <div class="cover-page">
      <div class="cover-label">World Bible</div>
      <div class="cover-title">${story.title}</div>
      <div class="cover-divider"></div>
      <div class="cover-meta">
        ${characters.length} character${characters.length !== 1 ? 's' : ''} &nbsp;·&nbsp;
        ${worldEntries.length} world entr${worldEntries.length !== 1 ? 'ies' : 'y'} &nbsp;·&nbsp;
        ${new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
      </div>
    </div>
    ${characterSection}
    ${worldSections}
  `
  triggerPrint(body, `${story.title} — World Bible`)
}

export function exportFullStoryPDF(story, chapters, characters, worldEntries) {
  // Combine both — chapters first, then wiki as appendix
  const tempStory = { ...story }
  const win = openPrintWindow(`${story.title} — Full Export`)

  const chaptersHtml = chapters.map((ch, i) => `
    <div class="chapter-page">
      <div class="chapter-number">Chapter ${i + 1}</div>
      <div class="chapter-title">${ch.title}</div>
      <div class="chapter-divider"></div>
      <div class="chapter-content">
        ${ch.content ? tiptapToHtml(ch.content) : '<p style="color:#aaa;font-style:italic">No content yet.</p>'}
      </div>
    </div>
  `).join('')

  const appendixHtml = `
    <div class="wiki-section" style="page-break-before:always">
      <div class="cover-label" style="text-align:center;margin-bottom:48px">Appendix — World Bible</div>
    </div>
  `

  const body = `
    <div class="cover-page">
      <div class="cover-label">Full Story</div>
      <div class="cover-title">${story.title}</div>
      <div class="cover-divider"></div>
      <div class="cover-genre">${story.genre}</div>
      ${story.description ? `<p style="font-size:11pt;color:#555;max-width:400px;margin:16px auto;line-height:1.6">${story.description}</p>` : ''}
      <div class="cover-meta">
        ${story.wordCount?.toLocaleString() || 0} words &nbsp;·&nbsp; ${chapters.length} chapters
      </div>
    </div>
    ${chaptersHtml}
    ${appendixHtml}
  `
  triggerPrint(body, `${story.title}`)
}

function triggerPrint(bodyHtml, title) {
  const win = window.open('', '_blank')
  if (!win) { alert('Please allow popups to export PDF'); return }
  win.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8"/>
        <title>${title}</title>
        <style>${PRINT_STYLES}</style>
      </head>
      <body>${bodyHtml}</body>
    </html>
  `)
  win.document.close()
  win.onload = () => {
    setTimeout(() => { win.print(); win.close() }, 600)
  }
}

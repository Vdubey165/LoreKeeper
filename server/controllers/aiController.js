import Story from '../models/Story.js';
import Character from '../models/Character.js';
import WorldEntry from '../models/WorldEntry.js';
import Chapter from '../models/Chapter.js';

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'openai/gpt-oss-20b';

// Replacement for buildStoryContext in server/controllers/aiController.js
// Drop this in place of the existing function.

const truncate = (str, maxChars) =>
  str.length > maxChars ? str.slice(0, maxChars).trim() + '…' : str;

const buildStoryContext = async (storyId, latestUserMessage = '') => {
  const [story, characters, worldEntries, chapters] = await Promise.all([
    Story.findById(storyId),
    Character.find({ storyId }),
    WorldEntry.find({ storyId }),
    Chapter.find({ storyId }).sort({ order: -1 }).limit(3).select('title plainText order'),
  ]);

  let context = `STORY: "${story.title}" (${story.genre})\n`;
  if (story.description) context += `PREMISE: ${story.description}\n`;

  const mentionsName = (name) =>
    latestUserMessage.toLowerCase().includes(name.toLowerCase());

  // --- Characters: full detail for protagonists/antagonists or anyone named
  // in the current message; everyone else gets a one-line index entry so the
  // assistant still knows they exist without burning tokens on their full bio.
  if (characters.length > 0) {
    context += `\nCHARACTERS:\n`;
    characters.forEach((c) => {
      const isKeyRole = c.role === 'protagonist' || c.role === 'antagonist';
      const isMentioned = mentionsName(c.name) || c.aliases?.some(mentionsName);
      const includeFull = isKeyRole || isMentioned;

      if (includeFull) {
        let entry = `- ${c.name} (${c.role})`;
        if (c.aliases?.length) entry += `, aka: ${c.aliases.join(', ')}`;
        if (c.traits?.length) entry += `. Traits: ${c.traits.join(', ')}`;
        if (c.backstory) entry += `. Backstory: ${truncate(c.backstory, 500)}`;
        if (c.motivations) entry += `. Motivations: ${truncate(c.motivations, 150)}`;
        context += entry + '\n';
      } else {
        context += `- ${c.name} (${c.role})${c.aliases?.length ? `, aka: ${c.aliases[0]}` : ''}\n`;
      }
    });
  }

  // --- World entries: same pattern — full body if named in the message,
  // otherwise just title + type so the assistant knows it exists.
  if (worldEntries.length > 0) {
    context += `\nWORLD BIBLE:\n`;
    worldEntries.forEach((e) => {
      const isMentioned = mentionsName(e.title);
      if (isMentioned) {
        context += `[${e.type.toUpperCase()}] ${e.title}: ${truncate(e.body || '', 500)}\n`;
      } else {
        context += `[${e.type.toUpperCase()}] ${e.title}\n`;
      }
    });
  }

  if (chapters.length > 0) {
    const sorted = chapters.sort((a, b) => a.order - b.order);
    context += `\nRECENT CHAPTERS:\n`;
    sorted.forEach((ch) => {
      context += `Chapter: "${ch.title}"\n${truncate(ch.plainText || 'No content yet', 600)}\n---\n`;
    });
  }

  // Hard safety cap regardless of the above — protects against pathological
  // cases (e.g. many characters all named in one message at once).
  const HARD_CAP_CHARS = 12000; // ~ 8-9k tokens, well under most free-tier TPM limits
  if (context.length > HARD_CAP_CHARS) {
    context = context.slice(0, HARD_CAP_CHARS) + '\n[context truncated for length]';
  }

  return { context, storyTitle: story.title };
};

export const chat = async (req, res, next) => {
  try {
    const { storyId, messages } = req.body;

    const story = await Story.findOne({ _id: storyId, userId: req.user._id });
    if (!story) return res.status(404).json({ message: 'Story not found' });

    const latestUserMessage = messages[messages.length - 1]?.content || '';
    const { context, storyTitle } = await buildStoryContext(storyId, latestUserMessage);

    const systemPrompt = `You are a creative writing assistant embedded inside Lorekeeper, a story writing platform.
You have deep knowledge of the story called "${storyTitle}" — its characters, world, and plot.
Your ONLY purpose is to help the writer with this specific story. You do not answer general knowledge questions, coding questions, math, or anything unrelated to creative writing or this story.

If the user asks something unrelated to writing or this story, respond with:
"I'm your lore assistant — I can only help with your story, characters, world-building, and writing. Try asking me something about ${storyTitle}."

${context}

Guidelines:
- Only answer questions about this story, its characters, world, plot, or creative writing in general
- Stay consistent with established lore and character traits above
- Flag contradictions when you spot them
- Reference actual character names and locations from the story
- Be concise but creative
- Never answer questions about real-world topics, other stories, code, math, or anything outside this story's context`;

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        message: 'GROQ_API_KEY not configured. Add it to your .env file. Get a free key at console.groq.com',
      });
    }

    const groqMessages = [
      { role: 'system', content: systemPrompt },
      ...messages.map((m) => ({ role: m.role, content: m.content })),
    ];

    const response = await fetch(GROQ_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: groqMessages,
        max_tokens: 800,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const err = await response.json();

      // Rate limit — show clean message instead of raw API error
      if (response.status === 429) {
        return res.status(429).json({
          message: "Daily AI limit reached. Groq's free tier resets every 24 hours. Try again tomorrow.",
          rateLimited: true,
        });
      }

      return res.status(500).json({ message: err.error?.message || 'Groq API error' });
    }

    const data = await response.json();
    res.json({ reply: data.choices[0].message.content });
  } catch (error) {
    next(error);
  }
};

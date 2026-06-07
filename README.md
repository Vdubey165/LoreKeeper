# Lorekeeper

A unified story writing workspace — character wiki, world bible, plot outline, chapter editor, and an AI assistant that knows your story.

## Stack
- **Frontend** React + Vite + Tailwind (Phase 2)
- **Backend** Node.js + Express
- **Database** MongoDB + Mongoose
- **AI** Anthropic Claude API
- **Auth** JWT

## Project Structure
```
lorekeeper/
├── client/          # React frontend (Phase 2)
└── server/
    ├── config/      # DB connection
    ├── controllers/ # Business logic
    ├── middleware/  # Auth, error handling
    ├── models/      # Mongoose schemas
    ├── routes/      # Express routers
    └── utils/       # Helpers
```

## Setup

```bash
cd server
cp .env.example .env   # fill in your values
npm install
npm run dev
```

## API Reference

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login |
| GET | /api/auth/me | Get current user |

### Stories
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/stories | Get all stories |
| POST | /api/stories | Create story |
| GET | /api/stories/:id | Get story |
| PUT | /api/stories/:id | Update story |
| DELETE | /api/stories/:id | Delete story |

### Characters (nested under story)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/stories/:storyId/characters | List characters |
| POST | /api/stories/:storyId/characters | Create character |
| GET | /api/stories/:storyId/characters/:id | Get character |
| PUT | /api/stories/:storyId/characters/:id | Update character |
| DELETE | /api/stories/:storyId/characters/:id | Delete character |

### World Bible
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/stories/:storyId/world?type=location | List entries (filter by type) |
| POST | /api/stories/:storyId/world | Create entry |
| GET | /api/stories/:storyId/world/:id | Get entry |
| PUT | /api/stories/:storyId/world/:id | Update entry |
| DELETE | /api/stories/:storyId/world/:id | Delete entry |

### Chapters
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/stories/:storyId/chapters | List chapters (no content) |
| POST | /api/stories/:storyId/chapters | Create chapter |
| GET | /api/stories/:storyId/chapters/:id | Get chapter with content |
| PUT | /api/stories/:storyId/chapters/:id | Update/autosave chapter |
| DELETE | /api/stories/:storyId/chapters/:id | Delete chapter |
| POST | /api/stories/:storyId/chapters/reorder | Reorder chapters |

### Plot Outline
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/stories/:storyId/plot | Get all plot nodes |
| POST | /api/stories/:storyId/plot | Create plot node |
| PUT | /api/stories/:storyId/plot/:id | Update plot node |
| DELETE | /api/stories/:storyId/plot/:id | Delete plot node |
| POST | /api/stories/:storyId/plot/reorder | Reorder nodes |

### AI Assistant
| Method | Endpoint | Body | Description |
|--------|----------|------|-------------|
| POST | /api/ai/chat | { storyId, messages[] } | Chat with story-aware AI |

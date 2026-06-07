import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import errorHandler from './middleware/errorHandler.js';

import authRoutes from './routes/auth.js';
import storyRoutes from './routes/stories.js';
import characterRoutes from './routes/characters.js';
import worldEntryRoutes from './routes/worldEntries.js';
import chapterRoutes from './routes/chapters.js';
import plotNodeRoutes from './routes/plotNodes.js';
import aiRoutes from './routes/ai.js';

connectDB();

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json({ limit: '5mb' })); // chapters can be large

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/stories', storyRoutes);
app.use('/api/stories/:storyId/characters', characterRoutes);
app.use('/api/stories/:storyId/world', worldEntryRoutes);
app.use('/api/stories/:storyId/chapters', chapterRoutes);
app.use('/api/stories/:storyId/plot', plotNodeRoutes);
app.use('/api/ai', aiRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Lorekeeper server running on port ${PORT}`));

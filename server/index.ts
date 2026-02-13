import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import booksRouter from './routes/books.js';
import chaptersRouter from './routes/chapters.js';
import problemsRouter from './routes/problems.js';
import examsRouter from './routes/exams.js';
import skillsRouter from './routes/skills.js';
import settingsRouter from './routes/settings.js';
import aiRouter from './routes/ai.js';
import uploadHistoryRouter from './routes/uploadHistory.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static file serving for uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/books', booksRouter);
app.use('/api/books', chaptersRouter);
app.use('/api/problems', problemsRouter);
app.use('/api/exams', examsRouter);
app.use('/api/skills', skillsRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/ai', aiRouter);
app.use('/api/upload-history', uploadHistoryRouter);

// Health check
app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
    console.log(`🚀 MathMind API Server running on http://localhost:${PORT}`);
    console.log(`📡 API endpoints available at http://localhost:${PORT}/api`);
});

export default app;

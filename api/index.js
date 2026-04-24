import express from 'express';
import cors from 'cors';
import sql from '../lib/db.js';
import { buildQuery } from '../lib/queryBuilder.js';
import { NLPParser } from '../lib/nlpParser.js';
import { uuidv7 } from 'uuidv7';

const app = express();

// Enable CORS for all origins
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

// GET /api/profiles - filtered, sorted, paginated list
app.get('/api/profiles', async (req, res) => {
  try {
    const filters = req.query;
    const { query, values } = buildQuery(filters);
    const result = await sql(query, values);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

// GET /api/profiles/search?q= - rule-based NLP search
app.get('/api/profiles/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || typeof q !== 'string') {
      return res.status(400).json({ status: 'error', message: 'Query parameter q is required' });
    }

    // Parse the natural language query
    const filters = NLPParser.parse(q);
    const { query, values } = buildQuery(filters);
    const result = await sql(query, values);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

// Error handling for 404
app.use((req, res) => {
  res.status(404).json({ status: 'error', message: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ status: 'error', message: 'Internal server error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
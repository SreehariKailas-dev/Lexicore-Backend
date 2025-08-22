/**
 * LexiCore AI – Project Review Tool
 * Version: 1.1.2
 * Release Date: 21-Aug-2025
 * Description: Main backend entry point for LexiCore AI – serves APIs for frontend (hosted separately).
 */

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const helmet = require('helmet');
const fs = require('fs');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// -------------------- MIDDLEWARE --------------------
app.use(
  cors({
    origin: "*", // allow all (Netlify frontend)
    methods: "GET,POST,PUT,DELETE,OPTIONS",
    allowedHeaders: "Content-Type,Authorization"
  })
);

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// -------------------- STATIC FILES --------------------
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// -------------------- ROUTES --------------------
const fileUploadRoute = require('./routes/fileUploadRoute');
const reviewRoute = require('./routes/reviewRoute');

app.use('/api/upload', fileUploadRoute);

// Shortcut for greetings
app.post('/api/review/:projectId', async (req, res, next) => {
  const greetings = ['hi', 'hello', 'hey', 'yo'];
  const prompt = req.body?.prompt || '';
  if (prompt && greetings.includes(prompt.toLowerCase().trim())) {
    return res.json({
      message: 'Hey there! How can I help you with your project today?'
    });
  }
  next(); // pass to normal reviewRoute
});

// AI review route
app.use('/api/review', reviewRoute);

// Serve projects.json directly
app.get('/projects.json', (req, res) => {
  const projectsFile = path.join(__dirname, 'projects.json');

  if (!fs.existsSync(projectsFile)) return res.json([]);

  fs.readFile(projectsFile, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading projects.json:', err);
      return res.status(500).json({ error: 'Error reading projects file' });
    }

    try {
      res.json(JSON.parse(data || '[]'));
    } catch (parseErr) {
      console.error('Invalid JSON format in projects.json:', parseErr);
      res.status(500).json({ error: 'Invalid projects file format' });
    }
  });
});

// -------------------- ROOT ENDPOINT --------------------
app.get('/', (req, res) => {
  res.send('✅ LexiCore AI Backend is Running on Render 🚀');
});

// -------------------- ERROR HANDLER --------------------
app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack);
  res.status(500).json({ message: 'Something broke!' });
});

// -------------------- START SERVER --------------------
app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});

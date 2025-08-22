/**
 * LexiCore AI – Project Review Tool
 * Version: 1.1.1
 * Release Date: 21-Aug-2025
 * Description: Handles PDF file uploads, stores project metadata in projects.json
 */

const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Ensure uploads folder exists
const uploadPath = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadPath),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const sanitized = file.originalname.replace(/\s+/g, '_');
    cb(null, `${uniqueSuffix}-${sanitized}`);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== 'application/pdf') {
      return cb(new Error('Only PDF files are allowed!'));
    }
    cb(null, true);
  }
});

// POST /api/upload
router.post('/', upload.single('pdfFile'), (req, res) => {
  try {
    const { name, description, query } = req.body;

    if (!name || !query || !req.file) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const diskPath = path.join(uploadPath, req.file.filename);
    const urlPath = `/uploads/${req.file.filename}`;

    const projectsFile = path.join(__dirname, '../projects.json');
    let projects = [];

    if (fs.existsSync(projectsFile)) {
      try {
        projects = JSON.parse(fs.readFileSync(projectsFile, 'utf8') || '[]');
      } catch {
        projects = [];
      }
    }

    const newProject = {
      id: `${Date.now()}-${Math.round(Math.random() * 1e6)}`,
      name,
      description: description || '',
      query,
      filePath: diskPath, // full path for backend
      fileUrl: urlPath   // relative URL for frontend
    };

    projects.push(newProject);
    fs.writeFileSync(projectsFile, JSON.stringify(projects, null, 2));

    res.json({ message: '✅ Project saved successfully', project: newProject });
  } catch (err) {
    console.error('❌ Error saving project:', err);
    res.status(500).json({ error: 'Server error while saving project' });
  }
});

module.exports = router;


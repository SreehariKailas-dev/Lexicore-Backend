// backend/routes/reviewRoute.js
const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

/**
 * POST /api/review/:projectId
 * Handles project review queries.
 */
router.post('/:projectId', async (req, res) => {
  const { projectId } = req.params;
  const { prompt } = req.body;

  if (!prompt || prompt.trim() === "") {
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
    // Load projects.json to check if project exists
    const projectsFile = path.join(__dirname, '../projects.json');
    let projects = [];
    if (fs.existsSync(projectsFile)) {
      const raw = fs.readFileSync(projectsFile, 'utf8');
      projects = JSON.parse(raw || "[]");
    }

    const project = projects.find(p => p.id === projectId);

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    // Dummy AI Response (replace with OpenRouter/Azure later)
    const aiResponse = `🔍 Reviewing project "${project.name}" for query: "${prompt}"...`;

    return res.json({
      projectId,
      projectName: project.name,
      response: aiResponse
    });
  } catch (error) {
    console.error("Review error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;

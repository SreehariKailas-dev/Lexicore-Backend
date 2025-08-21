// backend/routes/reviewRoute.js
const express = require('express');
const router = express.Router();

// Simple mock "AI" for now
router.post('/:projectId', async (req, res) => {
  const { projectId } = req.params;
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  // Handle greetings shortcut here
  const greetings = ['hi', 'hello', 'hey', 'yo'];
  if (greetings.includes(prompt.toLowerCase().trim())) {
    return res.json({
      projectId,
      message: 'Hey there! How can I help you with your project today?'
    });
  }

  // Mock AI response (replace with OpenRouter/OpenAI later)
  return res.json({
    projectId,
    answer: `🤖 AI response for project ${projectId}: "${prompt}"`
  });
});

module.exports = router;

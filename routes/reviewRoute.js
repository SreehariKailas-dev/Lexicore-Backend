// routes/reviewRoute.js
const express = require("express");
const router = express.Router();
const pdfParse = require("pdf-parse");
const fs = require("fs");

router.post("/:id", async (req, res) => {
  try {
    const { query, projectName, pdfPath } = req.body;

    // Validate inputs
    if (!query || !projectName || !pdfPath) {
      return res.status(400).json({
        error: "Missing required fields: query, projectName, or pdfPath",
        received: req.body
      });
    }

    // Read and parse PDF
    if (!fs.existsSync(pdfPath)) {
      return res.status(404).json({ error: "PDF file not found", pdfPath });
    }

    const pdfBuffer = fs.readFileSync(pdfPath);
    const data = await pdfParse(pdfBuffer);

    // Simple AI-like response
    const found = data.text.includes(query);
    const response = found
      ? `✅ Found "${query}" in project ${projectName}.`
      : `❌ Could not find "${query}" in project ${projectName}.`;

    res.json({ response });
  } catch (error) {
    console.error("Review error:", error);
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
});

module.exports = router;

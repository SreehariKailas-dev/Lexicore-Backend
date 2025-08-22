const express = require("express");
const router = express.Router();
const pdfParse = require("pdf-parse");
const fs = require("fs");
const path = require("path");

const projectsFile = path.join(__dirname, "../projects.json");

router.post("/:id", async (req, res) => {
  try {
    const { query } = req.body;
    const projectId = req.params.id;

    if (!query) {
      return res.status(400).json({ error: "Missing query in request body" });
    }

    if (!fs.existsSync(projectsFile)) {
      return res.status(404).json({ error: "No projects found" });
    }

    const projects = JSON.parse(fs.readFileSync(projectsFile, "utf8") || "[]");
    const project = projects.find(p => p.id === projectId);

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    if (!fs.existsSync(project.filePath)) {
      return res.status(404).json({ error: "PDF file not found on server" });
    }

    const pdfBuffer = fs.readFileSync(project.filePath);
    const data = await pdfParse(pdfBuffer);

    const found = data.text.includes(query);
    const response = found
      ? `✅ Found "${query}" in project ${project.name}.`
      : `❌ Could not find "${query}" in project ${project.name}.`;

    res.json({ response });
  } catch (error) {
    console.error("Review error:", error);
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
});

module.exports = router;

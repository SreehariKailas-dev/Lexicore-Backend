const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();
const projectsFile = path.join(__dirname, "../projects.json");

// GET all projects
router.get("/", (req, res) => {
  if (!fs.existsSync(projectsFile)) return res.json([]);
  try {
    const projects = JSON.parse(fs.readFileSync(projectsFile, "utf8") || "[]");
    res.json(projects);
  } catch {
    res.json([]);
  }
});

// GET single project by id
router.get("/:id", (req, res) => {
  if (!fs.existsSync(projectsFile)) return res.status(404).json({ error: "No projects found" });
  const projects = JSON.parse(fs.readFileSync(projectsFile, "utf8") || "[]");
  const project = projects.find(p => p.id === req.params.id);
  if (!project) return res.status(404).json({ error: "Project not found" });
  res.json(project);
});

module.exports = router;

// routes/projectRoute.js
import express from "express";
import fs from "fs";

const router = express.Router();

// JSON file where projects will be stored
const PROJECTS_FILE = "./projects.json";

// 🔹 GET all projects
router.get("/", (req, res) => {
  try {
    if (!fs.existsSync(PROJECTS_FILE)) {
      fs.writeFileSync(PROJECTS_FILE, "[]");
    }
    const data = fs.readFileSync(PROJECTS_FILE, "utf8");
    const projects = JSON.parse(data || "[]");
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: "Failed to load projects" });
  }
});

// 🔹 POST new project
router.post("/", (req, res) => {
  try {
    const { projectName, description, pdfPath } = req.body;
    if (!projectName) {
      return res.status(400).json({ error: "Project name required" });
    }

    let projects = [];
    if (fs.existsSync(PROJECTS_FILE)) {
      const data = fs.readFileSync(PROJECTS_FILE, "utf8");
      projects = JSON.parse(data || "[]");
    }

    const newProject = {
      id: Date.now(),
      projectName,
      description: description || "",
      pdfPath: pdfPath || null,
    };

    projects.push(newProject);
    fs.writeFileSync(PROJECTS_FILE, JSON.stringify(projects, null, 2));

    res.status(201).json(newProject);
  } catch (err) {
    res.status(500).json({ error: "Failed to save project" });
  }
});

export default router;


const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();

const projectsFile = path.join(__dirname, "../projects.json");

// Ensure projects.json exists
function ensureProjectsFile() {
  if (!fs.existsSync(projectsFile)) {
    fs.writeFileSync(projectsFile, JSON.stringify([], null, 2));
    console.log('📁 Created projects.json file');
  }
}

// GET all projects
router.get("/", (req, res) => {
  try {
    ensureProjectsFile();
    
    const data = fs.readFileSync(projectsFile, "utf8");
    const projects = JSON.parse(data || "[]");
    
    console.log(`📋 Retrieved ${projects.length} projects`);
    res.json({
      success: true,
      count: projects.length,
      projects: projects
    });
  } catch (error) {
    console.error('❌ Error reading projects:', error);
    res.status(500).json({ 
      success: false, 
      error: "Failed to read projects",
      message: error.message 
    });
  }
});

// GET single project by id
router.get("/:id", (req, res) => {
  try {
    ensureProjectsFile();
    
    const data = fs.readFileSync(projectsFile, "utf8");
    const projects = JSON.parse(data || "[]");
    const project = projects.find(p => p.id === req.params.id);
    
    if (!project) {
      return res.status(404).json({ 
        success: false,
        error: "Project not found",
        id: req.params.id
      });
    }
    
    console.log(`📋 Retrieved project: ${project.name}`);
    res.json({
      success: true,
      project: project
    });
  } catch (error) {
    console.error('❌ Error reading project:', error);
    res.status(500).json({ 
      success: false,
      error: "Failed to read project",
      message: error.message 
    });
  }
});

// POST - Create new project (optional, if you want to create projects without file upload)
router.post("/", (req, res) => {
  try {
    const { name, description, query } = req.body;
    
    if (!name || !query) {
      return res.status(400).json({
        success: false,
        error: "Name and query are required"
      });
    }
    
    ensureProjectsFile();
    
    const data = fs.readFileSync(projectsFile, "utf8");
    const projects = JSON.parse(data || "[]");
    
    const newProject = {
      id: `${Date.now()}-${Math.round(Math.random() * 1e6)}`,
      name: name.trim(),
      description: (description || '').trim(),
      query: query.trim(),
      filePath: null,
      fileUrl: null,
      createdAt: new Date().toISOString()
    };
    
    projects.push(newProject);
    fs.writeFileSync(projectsFile, JSON.stringify(projects, null, 2));
    
    console.log(`✅ Created project: ${newProject.name}`);
    res.status(201).json({
      success: true,
      message: "Project created successfully",
      project: newProject
    });
  } catch (error) {
    console.error('❌ Error creating project:', error);
    res.status(500).json({ 
      success: false,
      error: "Failed to create project",
      message: error.message 
    });
  }
});

// DELETE project by id
router.delete("/:id", (req, res) => {
  try {
    ensureProjectsFile();
    
    const data = fs.readFileSync(projectsFile, "utf8");
    let projects = JSON.parse(data || "[]");
    const projectIndex = projects.findIndex(p => p.id === req.params.id);
    
    if (projectIndex === -1) {
      return res.status(404).json({ 
        success: false,
        error: "Project not found",
        id: req.params.id
      });
    }
    
    const deletedProject = projects[projectIndex];
    
    // Delete associated file if exists
    if (deletedProject.filePath && fs.existsSync(deletedProject.filePath)) {
      try {
        fs.unlinkSync(deletedProject.filePath);
        console.log(`🗑️ Deleted file: ${deletedProject.filePath}`);
      } catch (fileErr) {
        console.warn(`⚠️ Could not delete file: ${fileErr.message}`);
      }
    }
    
    projects.splice(projectIndex, 1);
    fs.writeFileSync(projectsFile, JSON.stringify(projects, null, 2));
    
    console.log(`🗑️ Deleted project: ${deletedProject.name}`);
    res.json({
      success: true,
      message: "Project deleted successfully",
      project: deletedProject
    });
  } catch (error) {
    console.error('❌ Error deleting project:', error);
    res.status(500).json({ 
      success: false,
      error: "Failed to delete project",
      message: error.message 
    });
  }
});

module.exports = router;

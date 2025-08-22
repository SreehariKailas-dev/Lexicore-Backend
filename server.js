/**
 * LexiCore AI – Project Review Tool
 * Version: 1.2.0
 * Release Date: 21-Aug-2025
 * Description: Main backend entry point for LexiCore AI – serves APIs for frontend (hosted separately).
 */

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const path = require("path");

const fileUploadRoute = require("./routes/fileUploadRoute");
const reviewRoute = require("./routes/reviewRoute");
const projectsRoute = require("./routes/projectsRoute");

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploads statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// API routes
app.use("/api/upload", fileUploadRoute);
app.use("/api/review", reviewRoute);
app.use("/api/projects", projectsRoute);

// Health check
app.get("/", (req, res) => res.send("✅ Backend is running"));

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));



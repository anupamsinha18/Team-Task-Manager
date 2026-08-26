const express = require("express");
const ProjectRouter = express.Router();
const { createProject, getProjects, getProjectById } = require("../controllers/project.controllers");
const { authMiddleware } = require("../middlewares/auth.middleware");

ProjectRouter.post("/", authMiddleware(), createProject);
ProjectRouter.get("/", authMiddleware(), getProjects);
ProjectRouter.get("/:id", authMiddleware(), getProjectById);

module.exports = { ProjectRouter };
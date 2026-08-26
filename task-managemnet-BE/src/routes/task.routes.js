const express = require("express");
const TaskRouter = express.Router();
const { createTask, updateStatus, getTasksByProject, getTaskById } = require("../controllers/task.controllers");
const { authMiddleware } = require("../middlewares/auth.middleware");

TaskRouter.post("/", authMiddleware(), createTask);
TaskRouter.patch("/:taskId", authMiddleware(), updateStatus);
TaskRouter.get("/:projectId", authMiddleware(), getTasksByProject);
TaskRouter.get("/:taskId", authMiddleware(), getTaskById);

module.exports = {TaskRouter}
const ProjectModel = require("../models/project.model");

const createProject = async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title) {
      return res.status(400).json({ message: "Title is required." });
    }

    const existingProject = await ProjectModel.findOne({ title });
    if (existingProject) {
      return res.status(400).json({ message: "Project with this title already exists." });
    }
    const project = await ProjectModel.create({ title, description, createdBy: req.user });
    return res.status(201).json({ message: "Project created successfully.", project });
  } catch (error) {
    res.status(500).json({ message: "Something Went Wrong, Please Try Again Later." });
  }
};

const getProjects = async (req, res) => {
  try {
    const projects = await ProjectModel.find({ createdBy: req.user }).populate("createdBy", "name email");
    return res.status(200).json({ message: "Projects fetched successfully.", projects });
  } catch (error) {
    res.status(500).json({ message: "Something Went Wrong, Please Try Again Later." });
  }
}

const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await ProjectModel.findById(id)
    if (!project) {
      return res.status(404).json({ message: "Project not found." });
    }
    return res.status(200).json({ message: "Project fetched successfully.", project });
  } catch (error) {
    res.status(500).json({ message: "Something Went Wrong, Please Try Again Later." });
  }
}

module.exports = { createProject, getProjects, getProjectById };
const express = require("express");
const TaskRouter = express.Router();
const TaskModel = require("../models/task.model");
const ProjectModel = require("../models/project.model");
const UserModel = require("../models/user.model");

 const createTask = async(req,res)=>{
    try{
        const { title, description, dueDate, assignedTo, project, createdBy } = req.body;
        if(!title || !dueDate || !assignedTo || !project || !createdBy){
            return res.status(400).json({ message: "Please Fill All The Fields." });
        }
        const task = await TaskModel.create({ title, description, dueDate, assignedTo, project, createdBy });
        const projectData = await ProjectModel.findById(project);
        projectData.tasks.push(task._id);
        await projectData.save();
        const userData = await UserModel.findById(assignedTo);
        userData.projects.push(project);
        await userData.save();
        return res.status(201).json({ message: "Task Created Successfully", task });
    }catch(error){
        res.status(500).json({ message: "Something Went Wrong, Please Try Again Later." });
    }
 }

 const updateStatus = async(req,res)=>{
    try{
        const { taskId } = req.params;
        const { status } = req.body;
        if(!status){
            return res.status(400).json({ message: "Please Provide Status." });
        }
        const task = await TaskModel.findById(taskId);
        if(!task){
            return res.status(404).json({ message: "Task Not Found." });
        }
        task.status = status;
        if(status === "done"){
            task.completedAt = new Date();
        }
        await task.save();
        return res.status(200).json({ message: "Task Status Updated Successfully", task });
    }catch(error){
        res.status(500).json({ message: "Something Went Wrong, Please Try Again Later." });
    }
}

const getTasksByProject = async(req,res)=>{
    try{
        const { projectId } = req.params;
        const tasks = await TaskModel.find({ project: projectId, assignedTo: req.user })
        return res.status(200).json({ message: "Tasks Retrieved Successfully", tasks });
    }catch(error){
        res.status(500).json({ message: "Something Went Wrong, Please Try Again Later." });
    }
}

const getTaskById = async(req,res)=>{
    try{
        const { taskId } = req.params;
        const task = await TaskModel.findById(taskId);
        if(!task){
            return res.status(404).json({ message: "Task Not Found." });
        }
        return res.status(200).json({ message: "Task Retrieved Successfully", task });
    }catch(error){
        res.status(500).json({ message: "Something Went Wrong, Please Try Again Later." });
    }
}

module.exports = { createTask, updateStatus, getTasksByProject, getTaskById };
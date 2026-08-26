const TaskModel = require("../models/task.model");
const UserModel = require("../models/user.model");

// GET /tasks with search, filtering, sorting and pagination
const getAllTasks = async (req, res) => {
  try {
    const { search = "", status = "All", priority = "All", sortBy = "dueDate", sortOrder = "asc", page = 1, limit = 10 } = req.query;

    const query = {};

    // Search by title, description or tag
    if (search.trim()) {
      query.$or = [
        { title: { $regex: search.trim(), $options: "i" } },
        { description: { $regex: search.trim(), $options: "i" } },
        { tags: { $in: [new RegExp(search.trim(), "i")] } }
      ];
    }

    // Filter by status
    if (status !== "All") {
      query.status = status;
    }

    // Filter by priority
    if (priority !== "All") {
      query.priority = priority;
    }

    // Sorting
    const sortOptions = {};
    const orderDirection = sortOrder === "desc" ? -1 : 1;

    if (sortBy === "dueDate") sortOptions.dueDate = orderDirection;
    else if (sortBy === "createdAt") sortOptions.createdAt = orderDirection;
    else if (sortBy === "title") sortOptions.title = orderDirection;
    else if (sortBy === "priority") sortOptions.priority = orderDirection;
    else sortOptions.createdAt = -1;

    const pageNum = parseInt(page, 10) || 1;
    const pageSize = parseInt(limit, 10) || 10;
    const skip = (pageNum - 1) * pageSize;

    const total = await TaskModel.countDocuments(query);
    const tasks = await TaskModel.find(query).sort(sortOptions).skip(skip).limit(pageSize);

    return res.status(200).json({
      data: tasks,
      total,
      page: pageNum,
      pageSize,
      totalPages: Math.ceil(total / pageSize) || 1,
    });
  } catch (error) {
    console.error("Error getting tasks:", error);
    res.status(500).json({ message: "Failed to fetch tasks" });
  }
};

// GET /tasks/stats
const getTaskStats = async (req, res) => {
  try {
    const total = await TaskModel.countDocuments();
    const pending = await TaskModel.countDocuments({ status: { $in: ["Pending", "todo"] } });
    const inProgress = await TaskModel.countDocuments({ status: { $in: ["In Progress", "in-progress"] } });
    const completed = await TaskModel.countDocuments({ status: { $in: ["Completed", "done"] } });
    const highPriority = await TaskModel.countDocuments({ priority: { $in: ["High", "high"] } });
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return res.status(200).json({
      total,
      pending,
      inProgress,
      completed,
      highPriority,
      completionRate,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ message: "Failed to fetch task statistics" });
  }
};

// POST /tasks - Create task
const createTask = async (req, res) => {
  try {
    const { title, description, dueDate, assignedUserId, priority, status, tags } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: "Task title is required." });
    }

    let assignedUser = {
      id: assignedUserId || 'user-1',
      name: "Alex Morgan",
      email: "alex.morgan@company.com",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80"
    };

    if (assignedUserId) {
      try {
        const userObj = await UserModel.findById(assignedUserId);
        if (userObj) {
          assignedUser = {
            id: userObj._id.toString(),
            name: userObj.name,
            email: userObj.email,
          };
        }
      } catch {
        // Fallback user defaults if not an ObjectId
      }
    }

    const newTask = await TaskModel.create({
      title: title.trim(),
      description: description || "",
      dueDate: dueDate || new Date().toISOString().split("T")[0],
      priority: priority || "Medium",
      status: status || "Pending",
      tags: tags || ["Task"],
      assignedUser,
      createdBy: req.user || null,
    });

    return res.status(201).json(newTask);
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ message: "Failed to create task" });
  }
};

// PUT /tasks/:taskId - Update task
const updateTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const updateData = req.body;

    const task = await TaskModel.findByIdAndUpdate(taskId, updateData, { new: true });
    if (!task) {
      return res.status(404).json({ message: "Task not found." });
    }

    return res.status(200).json(task);
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ message: "Failed to update task" });
  }
};

// PATCH /tasks/:taskId - Quick status update
const updateStatus = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Status is required." });
    }

    const task = await TaskModel.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found." });
    }

    task.status = status;
    await task.save();

    return res.status(200).json(task);
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ message: "Failed to update status" });
  }
};

// DELETE /tasks/:taskId
const deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const task = await TaskModel.findByIdAndDelete(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found." });
    }
    return res.status(200).json({ message: "Task deleted successfully", id: taskId });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ message: "Failed to delete task" });
  }
};

// GET /tasks/:taskId
const getTaskById = async (req, res) => {
  try {
    const { taskId } = req.params;
    const task = await TaskModel.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found." });
    }
    return res.status(200).json(task);
  } catch (error) {
    console.error("Error getting task:", error);
    res.status(500).json({ message: "Failed to retrieve task" });
  }
};

module.exports = {
  getAllTasks,
  getTaskStats,
  createTask,
  updateTask,
  updateStatus,
  deleteTask,
  getTaskById,
};
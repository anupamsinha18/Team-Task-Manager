const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true, default: "" },
  status: { 
    type: String, 
    enum: ["Pending", "In Progress", "Completed", "todo", "in-progress", "done"], 
    default: "Pending" 
  },
  priority: { 
    type: String, 
    enum: ["Low", "Medium", "High", "low", "medium", "high"], 
    default: "Medium" 
  },
  dueDate: { type: String, required: true },
  tags: [{ type: String }],
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  assignedUser: {
    id: { type: String },
    name: { type: String, default: "Alex Morgan" },
    email: { type: String, default: "alex.morgan@company.com" },
    avatarUrl: { type: String }
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

// Transform output for frontend compatibility
taskSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    if (!ret.assignedUser || !ret.assignedUser.name) {
      ret.assignedUser = {
        id: ret.assignedTo ? ret.assignedTo.toString() : 'user-1',
        name: 'Alex Morgan',
        email: 'alex.morgan@company.com'
      };
    }
    // Normalize status & priority case
    if (ret.status === "todo") ret.status = "Pending";
    if (ret.status === "in-progress") ret.status = "In Progress";
    if (ret.status === "done") ret.status = "Completed";
    if (ret.priority === "low") ret.priority = "Low";
    if (ret.priority === "medium") ret.priority = "Medium";
    if (ret.priority === "high") ret.priority = "High";
    delete ret.__v;
    return ret;
  }
});

const TaskModel = mongoose.model("Task", taskSchema);
module.exports = TaskModel;

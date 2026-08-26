const mongoose = require('mongoose');   
const bcrypt = require('bcrypt');
const UserModel = require('../models/user.model');
const TaskModel = require('../models/task.model');
require('dotenv').config();

const DEMO_USERS = [
    { name: "Alex Morgan", email: "alex.morgan@company.com", password: "password123", role: "Admin" },
    { name: "Sarah Chen", email: "sarah.chen@company.com", password: "password123", role: "Project Manager" },
    { name: "David Miller", email: "david.miller@company.com", password: "password123", role: "Developer" },
    { name: "Emily Taylor", email: "emily.taylor@company.com", password: "password123", role: "Developer" },
];

const INITIAL_TASKS = [
  {
    title: 'Fix login button styling on mobile',
    description: 'The login button looks misaligned on smaller screens. Need to fix flex layout and padding.',
    priority: 'High',
    status: 'In Progress',
    dueDate: '2026-08-28',
    tags: ['Bug', 'UI', 'Mobile'],
    assignedUser: { id: 'user-1', name: 'Alex Morgan', email: 'alex.morgan@company.com' }
  },
  {
    title: 'Update dashboard header layout',
    description: 'Add user avatar dropdown menu and fix spacing between action buttons.',
    priority: 'High',
    status: 'Completed',
    dueDate: '2026-08-24',
    tags: ['Dashboard', 'Frontend'],
    assignedUser: { id: 'user-2', name: 'Sarah Chen', email: 'sarah.chen@company.com' }
  },
  {
    title: 'Add unit tests for login page',
    description: 'Write test cases for email validation, wrong password error message, and redirect flow.',
    priority: 'Medium',
    status: 'Pending',
    dueDate: '2026-08-30',
    tags: ['Testing', 'QA'],
    assignedUser: { id: 'user-3', name: 'David Miller', email: 'david.miller@company.com' }
  },
  {
    title: 'Fix search bar lag on mobile',
    description: 'Debounce search keystrokes so the task list doesn’t re-render on every letter typed.',
    priority: 'High',
    status: 'In Progress',
    dueDate: '2026-08-27',
    tags: ['Performance', 'React'],
    assignedUser: { id: 'user-4', name: 'Emily Taylor', email: 'emily.taylor@company.com' }
  },
  {
    title: 'Setup staging build script',
    description: 'Create docker build script and github action for automatic deployment to staging.',
    priority: 'Medium',
    status: 'Pending',
    dueDate: '2026-09-02',
    tags: ['DevOps', 'Docker'],
    assignedUser: { id: 'user-1', name: 'Alex Morgan', email: 'alex.morgan@company.com' }
  },
  {
    title: 'Update user API endpoints',
    description: 'Clean up user profile service calls and handle 401 unauthenticated response properly.',
    priority: 'High',
    status: 'Completed',
    dueDate: '2026-08-25',
    tags: ['API', 'Backend'],
    assignedUser: { id: 'user-3', name: 'David Miller', email: 'david.miller@company.com' }
  },
  {
    title: 'Fix dark mode color contrast',
    description: 'Check contrast ratio on task priority badges and modal background text in dark mode.',
    priority: 'Low',
    status: 'Completed',
    dueDate: '2026-08-22',
    tags: ['CSS', 'Design'],
    assignedUser: { id: 'user-2', name: 'Sarah Chen', email: 'sarah.chen@company.com' }
  },
  {
    title: 'Add status column view for task board',
    description: 'Create Kanban view with columns for Pending, In Progress, and Completed tasks.',
    priority: 'Low',
    status: 'Pending',
    dueDate: '2026-09-05',
    tags: ['Kanban', 'Feature'],
    assignedUser: { id: 'user-4', name: 'Emily Taylor', email: 'emily.taylor@company.com' }
  },
];

const seedInitialData = async () => {
    try {
        // 1. Seed Demo Users
        for (const user of DEMO_USERS) {
            const exists = await UserModel.findOne({ email: user.email });
            if (!exists) {
                const hashedPassword = await bcrypt.hash(user.password, 10);
                await UserModel.create({
                    name: user.name,
                    email: user.email,
                    password: hashedPassword,
                    role: user.role,
                    isActive: true,
                });
                console.log(`Seeded demo user: ${user.email}`);
            }
        }

        // 2. Seed Tasks if empty
        const taskCount = await TaskModel.countDocuments();
        if (taskCount === 0) {
            await TaskModel.insertMany(INITIAL_TASKS);
            console.log(`Seeded ${INITIAL_TASKS.length} initial tasks into database`);
        }
    } catch (err) {
        console.error("Error seeding initial data:", err);
    }
};

const connectToDB = async () => {
    try {
        const uri = process.env.MONGO_URI || process.env.MONGO_URL;
        if (!uri) {
            console.warn("Warning: Neither MONGO_URI nor MONGO_URL is set.");
            return;
        }
        await mongoose.connect(uri);
        console.log("Connected to database successfully");
        await seedInitialData();
    } catch (error) {
        console.error("Error connecting to database:", error);
    }
}

module.exports = connectToDB;
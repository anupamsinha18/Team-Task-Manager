const mongoose = require('mongoose');   
const bcrypt = require('bcrypt');
const UserModel = require('../models/user.model');
require('dotenv').config();

const DEMO_USERS = [
    { name: "Alex Morgan", email: "alex.morgan@company.com", password: "password123", role: "Admin" },
    { name: "Sarah Chen", email: "sarah.chen@company.com", password: "password123", role: "Project Manager" },
    { name: "David Miller", email: "david.miller@company.com", password: "password123", role: "Developer" },
    { name: "Emily Taylor", email: "emily.taylor@company.com", password: "password123", role: "Developer" },
];

const seedDemoUsers = async () => {
    try {
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
    } catch (err) {
        console.error("Error seeding demo users:", err);
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
        await seedDemoUsers();
    } catch (error) {
        console.error("Error connecting to database:", error);
    }
}

module.exports = connectToDB;
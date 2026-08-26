const mongoose = require('mongoose');   
require('dotenv').config();

const connectToDB = async () => {
    try {
        const uri = process.env.MONGO_URI || process.env.MONGO_URL;
        if (!uri) {
            console.warn("Warning: Neither MONGO_URI nor MONGO_URL is set.");
            return;
        }
        await mongoose.connect(uri);
        console.log("Connected to database successfully");
    } catch (error) {
        console.error("Error connecting to database:", error);
    }
}

module.exports = connectToDB;
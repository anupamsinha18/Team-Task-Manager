const mongoose = require('mongoose');   
require('dotenv').config();

const connectToDB=async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to database successfully");
    } catch (error) {
        console.error("Error connecting to database:", error);
    }
}

module.exports=connectToDB;
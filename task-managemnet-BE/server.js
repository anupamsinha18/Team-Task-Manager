const express=require('express');
const connectToDB = require('./src/configs/db.config');
const app=express();
const { AuthRouter } = require("./src/routes/auth.routes")
const { ProjectRouter } = require("./src/routes/project.routes");
const { TaskRouter } = require('./src/routes/task.routes');
require('dotenv').config();
app.use(express.json());

connectToDB();

const port=process.env.SERVER_PORT || 8080;

app.use('/health',(req,res)=>{
    res.status(200).json({message:"Server running successfully"});
})

app.use("/auth",AuthRouter)

app.use("/projects", ProjectRouter);

app.use("/tasks", TaskRouter)

app.use((req, res) => {
  res.status(404).json({ message: "Invalid Route" });
});

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})
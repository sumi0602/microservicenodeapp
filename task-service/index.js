const express = require("express");
const connectDB = require("./utils/db");
const { connectRabbitMQ } = require("./utils/rabbitmq");
const Task = require("./models/Task");

const app = express();
const port = 3002;

app.use(express.json());

// Global variables for RabbitMQ
let channel = null;
let rabbitConnected = false;

// Connect MongoDB
connectDB();

// Connect RabbitMQ
(async () => {
  try {
    const rabbit = await connectRabbitMQ("task_created");
    channel = rabbit.channel;
    rabbitConnected = true;
    console.log("✅ RabbitMQ is ready for sending messages");
  } catch (err) {
    console.error("❌ Failed to connect RabbitMQ:", err.message);
  }
})();

// GET all tasks
app.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: "Error fetching tasks" });
  }
});

// POST new task
app.post("/tasks", async (req, res) => {
  try {
    const { title, description, userId } = req.body;

    if (!title || !userId) {
      return res.status(400).json({ error: "Title and userId are required" });
    }

    const task = new Task({ title, description, userId });
    await task.save();

    if (rabbitConnected && channel) {
      const message = { taskId: task._id, title, userId };
      channel.sendToQueue("task_created", Buffer.from(JSON.stringify(message)));
      console.log("📤 Message sent to RabbitMQ queue");
    } else {
      console.warn("⚠️ RabbitMQ not connected, message not sent");
    }

    res.status(201).json(task);
  } catch (err) {
    console.error("❌ POST /tasks error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Task service running on http://localhost:${port}`);
});

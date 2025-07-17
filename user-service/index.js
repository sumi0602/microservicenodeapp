const express = require("express");
const connectDB = require("../task-service/utils/db");
const User = require("./model/User");

const app = express();
const port = 3001;

app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Error fetching users" });
  }
});

app.post("/users", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    console.error("❌ Error saving user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`✅ User Service listening on http://localhost:${port}`);
});

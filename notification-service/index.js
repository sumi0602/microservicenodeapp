// notification-service/index.js
const express = require("express");
const { connectRabbitMQ } = require("./utils/rabbitmq");

const app = express();
const port = 3003;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Notification Service is live");
});

app.listen(port, async () => {
  console.log(`🚀 Notification service running on port ${port}`);

  try {
    await connectRabbitMQ("task_created", 10, 5000, (data) => {
      console.log("📥 Notification received:", data);
      // Simulate sending notification logic...
    });
  } catch (err) {
    console.error(err.message);
  }
});

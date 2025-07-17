// utils/worker.js
const { parentPort } = require("worker_threads");

parentPort.on("message", (taskData) => {
  // Simulate heavy processing (e.g., image processing, PDF generation)
  console.log("👷 Worker started task:", taskData);

  const result = {
    ...taskData,
    processedAt: new Date(),
    message: `Task '${taskData.title}' processed successfully`,
  };

  // Send result back
  parentPort.postMessage(result);
});

const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  status: {
    type: String,
    default: "Pending",
  },
  priority: {
    type: String,
    default: "Medium",
  },
  dueDate: Date,
});

module.exports = mongoose.model("Task", taskSchema);
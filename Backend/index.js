const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./Routes/authRoutes");
const taskRoutes = require("./Routes/taskRoutes");

const app = express();

/* =======================
   MIDDLEWARE
======================= */

// CORS (clean + safe for development)
app.use(cors({
  origin:true,
  credentials:true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// JSON body parser
app.use(express.json());

/* =======================
   ROUTES
======================= */
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

/* =======================
   DATABASE
======================= */
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

/* =======================
   SERVER START
======================= */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
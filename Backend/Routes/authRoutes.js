
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
 console.log("BODY =", req.body);
 console.log("HEADERS =", req.headers);
    try {
    const { name, email, password } = req.body || {};

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name:melvina, email:saniapd2004@gmail.com and password:1234 are required"
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "User registered successfully",
      token
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message
    });
  }
});

// login
router.post("/login", async (req, res) => {
  try {
    console.log("LOGIN BODY =", req.body);
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User not found"
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid password"
      });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login successful",
      token
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message
    });
  }
});

// Get current user (protected)
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update current user profile (protected)
router.put("/me", authMiddleware, async (req, res) => {
  try {
    const { name } = req.body;
    
    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { name },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
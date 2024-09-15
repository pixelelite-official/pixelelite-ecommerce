const express = require("express");
const asyncHandler = require("express-async-handler");
const router = express.Router();
const User = require("../model/user");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
// const jwt = require("jsonwebtoken");

// dotenv.config();
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../middleware/auth/auth");

// // Helper function to generate access token
// const generateAccessToken = (user) => {
//   return jwt.sign({ id: user._id, name: user.name }, process.env.JWT_SECRET, {
//     expiresIn: process.env.JWT_ACCESS_EXPIRY,
//   });
// };

// // Helper function to generate refresh token
// const generateRefreshToken = (user) => {
//   return jwt.sign(
//     { id: user._id, name: user.name },
//     process.env.JWT_REFRESH_SECRET,
//     { expiresIn: process.env.JWT_REFRESH_EXPIRY }
//   );
// };

// Get all users
router.get(
  "/",
  asyncHandler(async (req, res) => {
    try {
      const users = await User.find();
      res.json({
        success: true,
        message: "Users retrieved successfully.",
        data: users,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  })
);

// login
router.post("/login", async (req, res) => {
  const { name, password } = req.body;

  try {
    // Check if the user exists
    const user = await User.findOne({ name });

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid name or password." });
    }

    // Check if the password is correct using bcrypt.compare
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid name or password." });
    }
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    // Authentication successful
    return res.status(200).json({
      success: true,
      message: "Login successful.",
      data: {
        name: user.name,
        accessToken: accessToken,
        refreshToken: refreshToken,
      },
    });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

// Get a user by ID
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    try {
      const userID = req.params.id;
      const user = await User.findById(userID);
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found." });
      }
      res.json({
        success: true,
        message: "User retrieved successfully.",
        data: user,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  })
);

// Create a new user
router.post(
  "/register",
  asyncHandler(async (req, res) => {
    const { name, password } = req.body;

    if (!name || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Name and password are required." });
    }

    try {
      // Hashing the password
      const saltRounds = parseInt(process.env.SALT, 10) || 10; // Use 10 if SALT is undefined or invalid
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Creating a new user
      const user = new User({ name, password: hashedPassword });
      const newUser = await user.save();

      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);

      return res.json({
        success: true,
        message: "User created successfully.",
        data: {
          name: user.name,
          accessToken: accessToken,
          refreshToken: refreshToken,
        },
      });
    } catch (error) {
      console.error("Error creating user:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  })
);

// Update a user
router.put(
  "/:id",
  asyncHandler(async (req, res) => {
    try {
      const userID = req.params.id;
      const { name, password } = req.body;
      if (!name || !password) {
        return res.status(400).json({
          success: false,
          message: "Name,  and password are required.",
        });
      }

      const updatedUser = await User.findByIdAndUpdate(
        userID,
        { name, password },
        { new: true }
      );

      if (!updatedUser) {
        return res
          .status(404)
          .json({ success: false, message: "User not found." });
      }

      res.json({
        success: true,
        message: "User updated successfully.",
        data: updatedUser,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  })
);

// Delete a user
router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    try {
      const userID = req.params.id;
      const deletedUser = await User.findByIdAndDelete(userID);
      if (!deletedUser) {
        return res
          .status(404)
          .json({ success: false, message: "User not found." });
      }
      res.json({ success: true, message: "User deleted successfully." });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  })
);

module.exports = router;

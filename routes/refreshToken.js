const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const { getRefreshToken } = require("../middleware/auth/auth");

// Get RefreshTokens
router.get(
  "/",
  asyncHandler(async (req, res) => {
    try {
      return getRefreshToken(req, res);
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  })
);

module.exports = router;

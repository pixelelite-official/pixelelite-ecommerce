const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

// Middleware to authenticate the JWT token
function authenticateToken(req, res, next) {
  // Get the token from the Authorization header
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // 'Bearer <token>'

  if (!token) {
    return res.status(401).json({ success: false, message: "Token not found" });
  }

  // Verify the token
  jwt.verify(token, process.env.JWT_ACCESS_SECRET, (err, user) => {
    if (err) {
      return res
        .status(403)
        .json({ success: false, message: "Invalid or expired token" });
    }
    req.user = user; // Attach the decoded user to the request object
    next(); // Proceed to the next middleware or route handler
  });
}

// Helper function to generate access token
const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user._id, name: user.name },
    process.env.JWT_ACCESS_SECRET,
    {
      expiresIn: process.env.JWT_ACCESS_EXPIRY,
    }
  );
};

// Helper function to generate refresh token
const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user._id, name: user.name },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRY }
  );
};
// Middleware to handle refresh token verification and generation
function getRefreshToken(req, res) {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res
      .status(401)
      .json({ success: false, message: "Refresh token not found" });
  }

  // Verify the refresh token
  jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, user) => {
    if (err) {
      return res
        .status(403)
        .json({ success: false, message: "Invalid refresh token" });
    }

    // Generate a new access token
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    return res.json({
      success: true,
      message: "New access token generated",
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
  });
}

module.exports = {
  authenticateToken,
  generateAccessToken,
  generateRefreshToken,
  getRefreshToken,
};

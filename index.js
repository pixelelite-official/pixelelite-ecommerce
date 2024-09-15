const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const dotenv = require("dotenv");
const { authenticateToken } = require("./middleware/auth/auth");

dotenv.config();

const app = express();
//?Middle wair
app.use(cors({ origin: "*" }));
app.use(bodyParser.json());
//? setting static folder path
app.use("/image/products", express.static("public/products"));
app.use("/image/category", express.static("public/category"));
app.use("/image/poster", express.static("public/posters"));

const URL = process.env.MONGO_URL;
mongoose.connect(URL);
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to Database"));

// Routes
app.use("/categories", authenticateToken, require("./routes/category"));
app.use("/subCategories", authenticateToken, require("./routes/subCategory"));
app.use("/brands", authenticateToken, require("./routes/brand"));
app.use("/variantTypes", authenticateToken, require("./routes/variantType"));
app.use("/variants", authenticateToken, require("./routes/variant"));
app.use("/products", authenticateToken, require("./routes/product"));
app.use("/couponCodes", authenticateToken, require("./routes/couponCode"));
app.use("/posters", authenticateToken, require("./routes/poster"));
app.use("/users", authenticateToken, require("./routes/user"));
app.use("/orders", authenticateToken, require("./routes/order"));
app.use("/payment", authenticateToken, require("./routes/payment"));
app.use("/notification", authenticateToken, require("./routes/notification"));
app.use("/refreshToken", authenticateToken, require("./routes/refreshToken"));

// Example route using asyncHandler directly in app.js
app.get(
  "/",
  asyncHandler(async (req, res) => {
    res.json({
      success: true,
      message: "API working successfully",
      data: null,
    });
  })
);

// Global error handler
app.use((error, req, res, next) => {
  res.status(500).json({ success: false, message: error.message, data: null });
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port http:localhost:${process.env.PORT}`);
});

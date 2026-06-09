const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

// Load environment variables

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/superadmin", require("./routes/superadmin/authRoutes"));
app.use("/api/superadmin", require("./routes/superadmin/orgRoutes"));

app.use("/api/admin", require("./routes/admin/authRoutes"));
app.use("/api/admin", require("./routes/admin/flagRoutes"));

app.use("/api/user", require("./routes/user/flagRoutes"));

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "Server is running", timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal server error", error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const express = require('express');
const cors = require('cors');
const emailRoutes = require('./routes/emailRoutes');

const app = express();

// Middleware
app.use(cors({
  // origin: "http://localhost:5173",
  origin: "https://gktechhub.com",
  // origin: "*",
  methods: "GET,POST,PUT,DELETE",
  credentials: true
}));
app.use(express.json());

// Wake-up / health check route
app.get("/api/wake-up", (req, res) => {
  res.status(200).json({ message: "Server is awake 🚀" });
});

// Routes
app.use('/api', emailRoutes);

module.exports = app;

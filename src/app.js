const express = require('express');
const cors = require('cors');
const emailRoutes = require('./routes/emailRoutes');

const app = express();

// Middleware
app.use(cors({
  // origin: "http://localhost:5173",
  origin: "https://portfolio-lime-beta-19.vercel.app",
  // origin: "*",
  methods: "GET,POST,PUT,DELETE",
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api', emailRoutes);

module.exports = app;

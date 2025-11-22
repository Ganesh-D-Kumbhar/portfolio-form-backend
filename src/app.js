const express = require('express');
const cors = require('cors');
const emailRoutes = require('./routes/emailRoutes');

const app = express();

// Middleware
app.use(cors({
  origin: [
    "https://gktechhub.com",
    "https://www.gktechhub.com"
  ],
  methods: "GET,POST,PUT,DELETE",
  credentials: true
}));

app.use(express.json());

// Routes
app.use('/api', emailRoutes);

module.exports = app;

const express = require('express');
const { contactForm } = require('../controllers/contactForm');

const router = express.Router();

// Route to send email
router.post('/contact-form', contactForm);

module.exports = router;

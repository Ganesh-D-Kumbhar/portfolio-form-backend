const express = require('express');
const { contactForm } = require('../controllers/contactForm');

const router = express.Router();
// Wake-up route
router.get('/wake-up', (req, res) => {
  res.status(200).send('Server is awake!');
});

// Route to send email
router.post('/contact-form', contactForm);

module.exports = router;

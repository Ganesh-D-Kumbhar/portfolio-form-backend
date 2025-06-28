const nodemailer = require("nodemailer");
require("dotenv").config();

// Destructure environment variables
const {
  EMAIL_HOST,
  EMAIL_PORT,
  EMAIL_USER,
  EMAIL_PASS,
  EMAIL_FROM,
} = process.env;

// Validate required env variables
if (!EMAIL_HOST || !EMAIL_PORT || !EMAIL_USER || !EMAIL_PASS || !EMAIL_FROM) {
  throw new Error("Missing required environment variables. Please check your .env file.");
}

// Create the transporter using SMTP with App Password
const transporterInstance = nodemailer.createTransport({
  host: EMAIL_HOST,
  port: Number(EMAIL_PORT),
  secure: Number(EMAIL_PORT) === 465, // true for 465 (SSL), false for 587 (TLS)
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

// Reusable transport wrapper
const transporter = {
  sendMail: async function (mailOptions) {
    try {
      const result = await transporterInstance.sendMail({
        from: EMAIL_FROM, // Default from address
        ...mailOptions,
      });
      return result;
    } catch (error) {
      console.error("Email sending failed:", error.message);
      throw error;
    }
  },
};

module.exports = transporter;

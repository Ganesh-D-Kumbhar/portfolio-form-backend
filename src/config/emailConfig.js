const nodemailer = require("nodemailer");
require("dotenv").config();

// Destructure environment variables
const {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASS,
  SMTP_FROM
} = process.env;

// Debug: Show loaded environment variables (excluding password)
console.log("=== SMTP CONFIG LOADED ===");
console.log("SMTP_HOST:", SMTP_HOST);
console.log("SMTP_PORT:", SMTP_PORT);
console.log("SMTP_USER:", SMTP_USER);
console.log("SMTP_FROM:", SMTP_FROM);
console.log("==========================");

// Validate env variables
if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !SMTP_FROM) {
  console.error("❌ Missing required environment variables.");
  throw new Error("Missing required environment variables. Please check your .env file.");
}

// Create the transporter
console.log("🚀 Creating SMTP transporter...");
const transporterInstance = nodemailer.createTransport({
  host: SMTP_HOST,
  port: Number(SMTP_PORT),
  secure: false,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

// Verify transporter connection
transporterInstance.verify((error, success) => {
  if (error) {
    console.error("❌ Transporter verification failed:", error.message);
  } else {
    console.log("✅ Transporter verified. Ready to send emails.");
  }
});

// Reusable transport wrapper
const transporter = {
  sendMail: async function (mailOptions) {
    console.log("📨 Preparing to send email...");
    console.log("To:", mailOptions.to);
    console.log("Subject:", mailOptions.subject);

    try {
      const result = await transporterInstance.sendMail({
        from: SMTP_FROM,
        ...mailOptions,
      });

      console.log("✅ Email sent successfully!");
      console.log("Message ID:", result.messageId);
      console.log("Response:", result.response);

      return result;

    } catch (error) {
      console.error("❌ Email sending failed:");
      console.error("Error Message:", error.message);
      console.error("Stack Trace:", error.stack);
      throw error;
    }
  },
};

module.exports = transporter;

// config/emailConfig.js
require("dotenv").config();
const Brevo = require("@getbrevo/brevo");

// Load env
const { BREVO_API_KEY, EMAIL_FROM } = process.env;

// Debug Logs
console.log("\n=== BREVO API CONFIG LOADED ===");
console.log("BREVO_API_KEY:", BREVO_API_KEY ? "Loaded ✔" : "❌ Missing");
console.log("EMAIL_FROM:", EMAIL_FROM);
console.log("===============================\n");

// Validate
if (!BREVO_API_KEY || !EMAIL_FROM) {
  console.error("❌ Missing Brevo API environment variables.");
  throw new Error("Missing Brevo API environment variables.");
}

// Initialize Brevo Client
const apiInstance = new Brevo.TransactionalEmailsApi();
apiInstance.setApiKey(Brevo.TransactionalEmailsApiApiKeys.apiKey, BREVO_API_KEY);

// Wrapper Function
async function sendEmail({ to, subject, html }) {
  console.log("\n📧 ==== Preparing to send email via Brevo API ==== ");
  console.log("To:", to);
  console.log("Subject:", subject);

  try {
    const emailData = {
      sender: { email: EMAIL_FROM, name: "Ganesh Kumbhar" },
      to: [{ email: to }],
      subject,
      htmlContent: html,
    };

    console.log("📨 Email Data Prepared:", emailData);

    const response = await apiInstance.sendTransacEmail(emailData);

    console.log("\n✅ Email Sent Successfully!");
    console.log("Brevo Message ID:", response.messageId || "N/A");
    console.log("Full Response:", response);

    return response;

  } catch (error) {
    console.error("\n❌ Email sending failed!");
    console.error("Error Message:", error.message);
    console.error("Error Response:", error.response?.body || "No response body");
    throw error;
  }
}

module.exports = { sendEmail };

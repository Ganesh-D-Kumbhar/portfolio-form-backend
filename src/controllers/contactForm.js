// controllers/contactController.js
const { sendEmail } = require("../config/emailConfig");

const contactForm = async (req, res) => {
  console.log("\n================= NEW CONTACT FORM REQUEST =================");
  console.log("Timestamp:", new Date().toLocaleString());
  console.log("Incoming Body:", req.body);
  console.log("============================================================\n");

  const timestamp = new Date().toLocaleString();
  const { fullName, email, mobNo, city, msg } = req.body;

  // Validation
  if (!fullName || !email || !mobNo || !city || !msg) {
    console.log("❌ Validation Failed: Missing fields.");
    return res.status(400).json({ error: "All fields are required" });
  }

  console.log("✔ Validation Passed");

  const formData = {
    "Full Name": fullName,
    Email: email,
    "Mobile Number": mobNo,
    City: city,
    Message: msg,
  };

  console.log("✔ Form Data Compiled:", formData);

  // Table Generator
  const tableRows = Object.entries(formData)
    .map(
      ([key, value]) => `
      <tr>
        <td style="padding: 8px; border-right: 1px solid #ddd; border-bottom: 1px solid #ddd;">${key}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${value}</td>
      </tr>`
    )
    .join("");

  // Email Subjects
  const adminEmailSubject = `New Contact Form Submission | ${timestamp}`;
  const userEmailSubject = `Thank you for contacting me! | ${timestamp}`;

  // User Email Template
  const userEmailHTML = `
    <div style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.6;">
      <h2>Hi ${fullName},</h2>
      <p>Thank you for reaching out! I will review your message and contact you shortly.</p>
      <p>Regards,<br/>Ganesh Kumbhar</p>
    </div>
  `;

  console.log("✔ User Email Template Created");

  try {
    console.log("\n📤 Sending Admin Email...");
    await sendEmail({
      to: process.env.EMAIL_USER,
      subject: adminEmailSubject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px;">
          <h2>Contact Form Submission</h2>
          <table style="border-collapse: collapse; width: 100%; border: 1px solid #ddd;">
            <thead>
              <tr style="background-color: #f4f4f4;">
                <th style="padding: 10px; text-align: left; border-right: 1px solid #ddd;">Field</th>
                <th style="padding: 10px; text-align: left;">Value</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
          </table>
        </div>
      `,
    });

    console.log("✔ Admin Email Sent Successfully");

    console.log("\n📤 Sending User Email...");
    await sendEmail({
      to: email,
      subject: userEmailSubject,
      html: userEmailHTML,
    });

    console.log("✔ User Email Sent Successfully");

    console.log("\n🎉 ALL EMAILS SENT SUCCESSFULLY!");

    res.status(200).json({ message: "Emails sent successfully!" });

  } catch (error) {
    console.error("\n❌ ERROR SENDING EMAILS:");
    console.error("Message:", error.message);
    console.error("Stack Trace:", error.stack);
    console.log("============================================================\n");

    res.status(500).json({
      error: "Failed to send email",
      details: error.message,
    });
  }
};

module.exports = { contactForm };

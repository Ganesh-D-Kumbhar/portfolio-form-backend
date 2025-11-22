const transporter = require('../config/emailConfig');
const path = require('path');

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
    return res.status(400).json({ error: 'All fields are required' });
  }

  console.log("✔ Validation Passed");

  // Form data object
  const formData = {
    'Full Name': fullName,
    'Email': email,
    'Mobile Number': mobNo,
    'City': city,
    'Message': msg
  };

  console.log("Form Data Compiled:", formData);

  // Generate email table
  const tableRows = Object.entries(formData)
    .map(([key, value]) => `
      <tr>
        <td style="padding: 8px; border-right: 1px solid #ddd; border-bottom: 1px solid #ddd;">${key}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${value}</td>
      </tr>`
    )
    .join('');

  const adminEmailSubject = `New Contact Form Submission`;
  const userEmailSubject = `Thank you for contacting me!`;

  // Debug: Email templates being generated
  console.log("✔ Email HTML template generated for user");

  const emailTemplate = `
  <div style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.6;">
    <h2>Hi ${fullName},</h2>
    <p>Thank you for reaching out! ...</p>
  </div>
  `;

  try {

    console.log("\n📤 Preparing to send Admin Email...");
    console.log("Admin Email To:", process.env.EMAIL_USER);

    console.log("📤 Preparing to send User Email...");
    console.log("User Email To:", email);

    await Promise.all([
      // Admin Notification Email
      transporter.sendMail({
        from: `"Ganesh Kumbhar" <${process.env.EMAIL_FROM}>`,
        to: process.env.EMAIL_USER,
        subject: `${adminEmailSubject} | ${timestamp}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="text-align: center;">Contact Form Submission</h2>
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
      }),

      // User Thank You Email
      transporter.sendMail({
        from: `"Ganesh Kumbhar" <${process.env.EMAIL_FROM}>`,
        to: email,
        subject: `${userEmailSubject} | ${timestamp}`,
        html: emailTemplate,
      }),
    ]);

    console.log("✅ Both emails sent successfully!");

    res.status(200).json({ message: 'Emails sent successfully!' });

  } catch (error) {
    console.error("\n❌ ERROR SENDING EMAILS:");
    console.error("Message:", error.message);
    console.error("Stack Trace:", error.stack);
    console.log("============================================================\n");

    res.status(500).json({
      error: 'Failed to send email',
      details: error.message,
    });
  }
};

module.exports = { contactForm };

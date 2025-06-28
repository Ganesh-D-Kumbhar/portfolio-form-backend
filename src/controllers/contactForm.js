const transporter = require('../config/emailConfig');
const path = require('path');

const contactForm = async (req, res) => {
  const timestamp = new Date().toLocaleString();
  const { fullName, email, mobNo, city, msg } = req.body;

  // Validation
  if (!fullName || !email || !mobNo || !city || !msg) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Build the form data into an object for email rendering
  const formData = {
    'Full Name': fullName,
    'Email': email,
    'Mobile Number': mobNo,
    'City': city,
    'Message': msg
  };

  // Generate email table
  const tableRows = Object.entries(formData)
    .map(([key, value]) => `
      <tr>
        <td style="padding: 8px; border-right: 1px solid #ddd; border-bottom: 1px solid #ddd;">${key}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${value}</td>
      </tr>`)
    .join('');

  // Optional: Customize the subject
  const adminEmailSubject = `New Contact Form Submission`;
  const userEmailSubject = `Thank you for contacting me!`;

  // Thank You Email Template (for user)
  const emailTemplate = `
  <div style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.6;">
    <h2>Hi ${fullName},</h2>
    <p>Thank you for reaching out! I appreciate you taking the time to connect.</p>

    <p>As a passionate <strong>Full-Stack Developer</strong> specializing in modern JavaScript frameworks like <strong>React.js</strong>, <strong>Next.js</strong>, <strong>Node.js</strong>, and databases such as <strong>MongoDB</strong> and <strong>MySQL</strong>, I am dedicated to building scalable, user-focused web applications.</p>

    <p>I’ve received your message and will get back to you shortly. In the meantime, feel free to explore some of my work and connect with me on other platforms:</p>

    <ul>
      <li><strong>📂 Portfolio:</strong> <a href="https://portfolio-lime-beta-19.vercel.app/" target="_blank">View Projects</a></li>
      <li><strong>💻 GitHub:</strong> <a href="https://github.com/ganeshhh2003" target="_blank">github.com/ganeshhh2003</a></li>
      <li><strong>🔗 LinkedIn:</strong> <a href="https://www.linkedin.com/in/ganesh-d-kumbhar" target="_blank">linkedin.com/in/ganeshhh2003</a></li>
      <li><strong>🎯 HackerRank:</strong> <a href="https://www.hackerrank.com/profile/ganeshhh2003" target="_blank">hackerrank.com/ganeshhh2003</a></li>
    </ul>

    <p>If your message is regarding collaboration, a project, or job opportunity, I’ll be happy to discuss it further.</p>

    <p style="margin-top: 30px;">Best regards,<br>
    <strong>Ganesh Kumbhar</strong><br>
    Full-Stack Developer<br>
    📌 Pune, Maharashtra – 411004<br>
    📧 <a href="mailto:ganeshhh2003@gmail.com">ganeshhh2003@gmail.com</a><br>
    📞 +91 9096378354</p>
  </div>
`;


  try {
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

    res.status(200).json({ message: 'Emails sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({
      error: 'Failed to send email',
      details: error.message,
    });
  }
};

module.exports = { contactForm };

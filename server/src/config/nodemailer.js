import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587', 10),
  secure: process.env.SMTP_PORT === '465',
  auth: {
    user: process.env.SMTP_USER || 'bittaalo@gmail.com',
    pass: process.env.SMTP_PASS || '',
  },
});

export const sendEmail = async ({ to, subject, html, text }) => {
  const from = process.env.EMAIL_FROM || 'BITTAALO <bittaalo@gmail.com>';

  // If mock/placeholder password or dev without credentials, log and resolve gracefully
  if (!process.env.SMTP_PASS || process.env.SMTP_PASS.includes('mock') || process.env.SMTP_PASS.includes('placeholder')) {
    console.log(`\n--- [EMAIL SIMULATION] ---`);
    console.log(`To: ${to}`);
    console.log(`From: ${from}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body Snippet: ${text || html?.substring(0, 150)}...`);
    console.log(`--------------------------\n`);
    return { messageId: `mock_${Date.now()}` };
  }

  try {
    const info = await transporter.sendMail({
      from,
      to,
      subject,
      text,
      html,
    });
    console.log(`[Email] Sent successfully to ${to}: ${info.messageId}`);
    return info;
  } catch (err) {
    console.warn(`[Email] Failed to send email to ${to}:`, err.message);
    // Don't throw error to avoid breaking checkout/contact form
    return { error: err.message };
  }
};

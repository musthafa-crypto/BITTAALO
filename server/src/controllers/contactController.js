import { ContactMessage } from '../models/ContactMessage.js';
import { sendEmail } from '../config/nodemailer.js';

export const submitContact = async (req, res, next) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required fields (Name, Email, Subject, Message)',
      });
    }

    const savedMessage = await ContactMessage.create({
      name,
      email,
      phone: phone || '',
      subject,
      message,
    });

    // Send email notification to bittaalo@gmail.com
    sendEmail({
      to: 'bittaalo@gmail.com',
      subject: `[New Inquiry] ${subject} - from ${name}`,
      text: `New contact inquiry received:\nName: ${name}\nEmail: ${email}\nPhone: ${phone || 'N/A'}\nSubject: ${subject}\n\nMessage:\n${message}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px; border: 1px solid #eee;">
          <h2 style="color: #111;">New Customer Inquiry - BITTAALO</h2>
          <p><strong>From:</strong> ${name} (&lt;${email}&gt;)</p>
          <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 16px 0;" />
          <p style="white-space: pre-wrap; color: #333; line-height: 1.6;">${message}</p>
        </div>
      `,
    }).catch((e) => console.warn('[Contact Email Note]', e.message));

    res.status(201).json({
      success: true,
      message: 'Thank you! Your message has been sent to the BITTAALO team. We will get back to you shortly.',
      contactId: savedMessage._id,
    });
  } catch (err) {
    next(err);
  }
};

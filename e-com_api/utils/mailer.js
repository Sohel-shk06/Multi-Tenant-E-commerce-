import nodemailer from 'nodemailer';
import { config } from '../config/env.js';

console.log('🔧 SMTP Configuration:');
console.log('  Host:', config.SMTP_HOST);
console.log('  Port:', config.SMTP_PORT);
console.log('  User:', config.SMTP_USER);
console.log('  Pass:', config.SMTP_PASS ? '***' : '❌ MISSING');

// Create transporter
const transporter = nodemailer.createTransport({
  host: config.SMTP_HOST,
  port: config.SMTP_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: config.SMTP_USER,
    pass: config.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Verify connection on startup
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ SMTP Connection Error:', error.message);
    console.error('❌ Error Code:', error.code);
  } else {
    console.log('✅ SMTP Server is ready to send emails');
  }
});

// Send email function
export const sendEmail = async ({ to, subject, html }) => {
  try {
    console.log('📤 Sending email...');
    console.log('  To:', to);
    console.log('  Subject:', subject);
    
    const info = await transporter.sendMail({
      from: `"Your App" <${config.SMTP_USER}>`,
      to,
      subject,
      html,
    });

    console.log('✅ Email sent successfully!');
    console.log('  Message ID:', info.messageId);
    console.log('  Response:', info.response);
    
    return info;
  } catch (error) {
    console.error('❌ Email send failed!');
    console.error('  Error:', error.message);
    console.error('  Code:', error.code);
    console.error('  Response:', error.response);
    throw error;
  }
};

// OTP email template
export const sendOtpEmail = async (email, otp, purpose = 'OTP Verification') => {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; }
        .header { background: linear-gradient(135deg, #6366F1 0%, #4338CA 100%); color: white; padding: 30px; text-align: center; }
        .content { padding: 40px 30px; }
        .otp-box { background-color: #EEF2FF; border: 2px dashed #6366F1; border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0; }
        .otp-code { font-size: 32px; font-weight: bold; color: #4338CA; letter-spacing: 8px; }
        .footer { background-color: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>${purpose}</h1>
        </div>
        <div class="content">
          <h2>Hello!</h2>
          <p>Your One-Time Password (OTP) is:</p>
          
          <div class="otp-box">
            <div class="otp-code">${otp}</div>
          </div>
          
          <p>This OTP is valid for <strong>10 minutes</strong>.</p>
          <p>If you didn't request this, please ignore this email.</p>
        </div>
        <div class="footer">
          <p>This is an automated email. Please do not reply.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: `${purpose} - Your OTP Code`,
    html: htmlContent,
  });
};
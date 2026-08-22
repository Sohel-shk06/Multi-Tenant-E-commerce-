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

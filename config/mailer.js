const nodemailer = require("nodemailer");

// Initialize transporter synchronously using credentials
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.ethereal.email", // e.g., ://brevo.com
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true",          // true for 465, false for 587
  auth: {
    user: process.env.SMTP_USER,                       // Your free SMTP username
    pass: process.env.SMTP_PASS,                       // Your free SMTP password/key
  },
});

// Export it immediately so standard require() statements don't crash
module.exports = transporter;

const sgMail =   require('@sendgrid/mail');

// sgMail.setApiKey(import.meta.env.SENDGRID_API_KEY);

//  dotenv from "dotenv";
require("dotenv").config();
// dotenv.config(); // load .env file

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async (options) => {
  const msg = {
    to: options.to,
    from: 'brosebba@gmail.com',
    subject: options.subject,
    html: options.html,
  };

  try {
    await sgMail.send(msg);
    console.log('✅ Verification email sent successfully!');
  } catch (error) {
    console.error('❌ Error sending verification email:', error);
    if (error.response) {
      console.error(error.response.body);
    }
  }
};

module.exports = { sendEmail };
const nodemailer = require('nodemailer');

const sendBookingConfirmation = async (userEmail, carDetails) => {
  let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const message = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: 'Booking Confirmation',
    text: `Your booking for the car ${carDetails.make} ${carDetails.model} has been confirmed.`,
  };

  await transporter.sendMail(message);
};

module.exports = sendBookingConfirmation;

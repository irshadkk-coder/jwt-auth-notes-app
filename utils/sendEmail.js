import nodemailer from 'nodemailer'



const sendEmail = async (options) => {
  try {

    console.log("📧 Sending email to:", options.to);

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      family: 4,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: options.to,
      subject: options.subject,
      text: options.text,
    });

    console.log("✅ Email sent successfully");

  } catch (error) {

    console.log("❌ EMAIL ERROR:", error);

  }
};

export default sendEmail;
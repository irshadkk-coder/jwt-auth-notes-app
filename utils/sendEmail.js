import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (options) => {
  try {

    console.log("📧 Sending email to:", options.to);

    const data = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: options.to,
      subject: options.subject,
      text: options.text,
    });

    console.log("✅ Email sent:", data);

  } catch (error) {

    console.log("❌ EMAIL ERROR:", error);

    throw error;
  }
};

export default sendEmail;
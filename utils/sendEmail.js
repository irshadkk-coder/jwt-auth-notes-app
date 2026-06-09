import SibApiV3Sdk from "sib-api-v3-sdk";

const defaultClient = SibApiV3Sdk.ApiClient.instance;

const apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey = process.env.BREVO_API_KEY;

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

const sendEmail = async (options) => {
  try {
    const sendSmtpEmail = {
      sender: {
        email: "irshadkk519082@gmail.com",
        name: "NotesFlow",
      },
      to: [{ email: options.to }],
      subject: options.subject,
      textContent: options.text,
    };

    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);

    console.log("✅ Email sent:", data);
  } catch (error) {
    console.log("❌ EMAIL ERROR:", error);
    throw error;
  }
};

export default sendEmail;
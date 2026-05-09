import nodemailer from 'nodemailer'



const sendEmail=async(options)=>{
      console.log("📧 Sending email to:", options.to); 
   const transporter = nodemailer.createTransport({
  service: 'gmail',
  family: 4,        // ✅ only this needs to be added
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


    await transporter.sendMail({
        from:process.env.EMAIL_USER,
        to:options.to,
        subject:options.subject,
        text:options.text,
    })
     
  console.log("✅ Email sent successfully");
}

export default sendEmail;
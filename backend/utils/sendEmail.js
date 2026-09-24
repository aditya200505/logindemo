import nodemailer from "nodemailer";

const sendOtpEmail = async (email, otp) => {
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
        throw new Error("SMTP settings are missing from the environment");
    }

    const smtpPort = Number(process.env.SMTP_PORT || 587);
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS.replace(/\s+/g, "")
        }
    });

    try {
        await transporter.sendMail({
            from: process.env.SMTP_USER,
            to: email,
            subject: "Verify your email",
            text: `Your verification code is ${otp}. It expires in 5 minutes.`
        });
    } catch (error) {
        console.error("SMTP email failed:", error.code || "UNKNOWN", error.message);
        throw new Error("The verification email could not be sent. Check the Gmail App Password in backend/.env.");
    }
};

export default sendOtpEmail;
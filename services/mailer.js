const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_HOST,
    port: process.env.MAILTRAP_PORT,
    auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS
    }
});

const sendMail = async ({ to, subject, text, html }) => {
    return transporter.sendMail({
        from: '"Livelooot" <no-reply@livelooot.com>',
        to,
        subject,
        text,
        html
    });
};

module.exports = { sendMail };

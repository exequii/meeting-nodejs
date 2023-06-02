const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: `${process.env.EMAIL_USER}`,
        pass: `${process.env.EMAIL_PASSWORD}`,
    },
});


transporter.verify().then(() => {
    console.log('Ready for send emails');
}).catch(error => {
    console.log(error);
});

module.exports = { transporter };
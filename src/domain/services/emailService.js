const { transporter } = require("../utils/mailer")

const sendEmail = async (user, email, message) => {

    try{
        await transporter.sendMail({
            from: `<${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Meeting - Alguien esta intentando contactarte",
            html: `
                <h1>Meeting - Conectando Personas</h1>
                <b>Tenes un mensaje del usuario: ${user.email}</b>
                <p>${message}</p>
            `,
        });
    }catch(error){
        console.log(error);
        throw new Error(error);
    }
};

module.exports = { sendEmail };


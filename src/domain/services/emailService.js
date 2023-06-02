const { transporter } = require("../utils/mailer")

const sendEmail = async (user, email, message, project) => {

    try{
        await transporter.sendMail({
            from: `<${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Meeting - Alguien esta intentando contactarte",
            html: `
                <h1>Meeting - ${project ? 'Unite a este Proyecto' : 'Conectamos Personas'}</h1>
                <b>Tenes un mensaje del usuario: ${user.email}</b>
                <p>${message}</p>
                ${project ? `<a href="${process.env.FRONTEND_URL}/projects/${project._id}">Ir al Proyecto</a>` : ''}
                <br/>
                <span>Gracias por usar Meeting</span>
                <br/>
                <span>Seguinos en nuestras redes sociales</span>
                <br/>
                <a href="${process.env.INSTAGRAM_URL}">Instagram</a>

            `,
        });
    }catch(error){
        console.log(error);
        throw new Error(error);
    }
};

module.exports = { sendEmail };


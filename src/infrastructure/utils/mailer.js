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

if (process.env.NODE_ENV !== 'test') {
    transporter.verify().then(() => {
        console.log('Ready for send emails');
    }).catch(error => {
        console.log(error);
    });
}


const sendEmail = async (user, email, message, project, post) => {

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
                    ${post ? `<a href="${process.env.FRONTEND_URL}/projects/${post._id}">Ir al Post</a>` : ''}
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
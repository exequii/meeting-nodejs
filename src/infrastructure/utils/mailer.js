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
                    <style>
                        @import url('https://fonts.googleapis.com/css2?family=Poppins&display=swap');
                        *{
                            font-family: 'Poppins', sans-serif;
                        }
                        hr{
                            border: 1px solid #c42e6c;
                            width: 50%;
                        }
                        #contenedor{
                            background-color: #ffffff;
                            padding: 20px;
                            text-align: center;
                            border: 1px solid #c42e6c;
                            border-radius: 10px;
                        }
                        .button{
                            padding: 5px 10px;
                            border-radius: 5px;
                            background-color: #c42e6c;
                            color: white;
                            text-decoration: none;
                            margin-bottom: 15px;
                        }
                        #proyecto{
                            background-color: #ffffff;
                            padding: 20px;
                            text-align: center;
                            border: 1px solid #c42e6c;
                            border-radius: 10px;
                        }
                    </style>
                    <div id="contenedor">
                        <h1>Meeting - ${project ? 'Unite a este Proyecto' : 'Conectamos Personas'}</h1>
                        <p>Tenes un mensaje del usuario: <b>${user.email}</b></p>
                        <p>${message}</p>
                        <br/>
                        ${project || post ? `
                            <div id="proyecto">
                                <h2>${project ? project.name : post ? post.title : ''}</h2>
                                <hr>
                                <p>${project ? project.description : post ? post.body : ''}</p>
                                <br/>
                                ${project ? `<a href="${process.env.FRONTEND_URL}/projects/${project._id}" class="button">Ir al Proyecto</a>` : ''}
                                ${post ? `<a href="${process.env.FRONTEND_URL}/projects/${post._id}" class="button">Ir al Post</a>` : ''}
                            </div>
                        ` : ''}
                        <br>
                        <span>Gracias por usar Meeting</span>
                        <br/>
                        <span>Seguinos en nuestras redes sociales</span>
                        <br/><br/>
                        <div>
                            <a href="${process.env.INSTAGRAM_URL}" class="button">Instagram</a>
                            <a href="${process.env.TWITTER_URL}" class="button">Twitter</a>
                            <a href="${process.env.LINKEDIN_URL}" class="button">LinkedIn</a>
                        </div>
                    </div>
                `,
        });
    }catch(error){
        console.log(error);
        throw new Error(error);
    }
};

const sendEmailPlatform = async (user, projects) => {
    try{
        await transporter.sendMail({
            from: `<${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: "Meeting - Hace mucho que no te vemos, te extrañamos",
            html: `
                    <style>
                        @import url('https://fonts.googleapis.com/css2?family=Poppins&display=swap');
                        *{
                            font-family: 'Poppins', sans-serif;
                        }
                        hr{
                            border: 1px solid #c42e6c;
                            width: 50%;
                        }
                        #contenedor{
                            background-color: #ffffff;
                            padding: 20px;
                            text-align: center;
                            border: 1px solid #c42e6c;
                            border-radius: 10px;
                        }
                        .button{
                            padding: 5px 10px;
                            border-radius: 5px;
                            background-color: #c42e6c;
                            color: white;
                            text-decoration: none;
                            margin-bottom: 15px;
                        }
                        #proyecto{
                            background-color: #ffffff;
                            padding: 20px;
                            text-align: center;
                            border: 1px solid #c42e6c;
                            border-radius: 10px;
                        }
                    </style>
                    <div id="contenedor">
                        <h1>¡Creemos que estos proyectos podrían motivarte a volver!</h1>
                        <p>Los proyectos son nuestro hilo conductor hacia un futuro mejor en tu carrera profesional.</p>
                        ${projects.map(project => {
                            return `
                            <div id="proyecto">
                                <h3>${project.name}</h3>
                                <hr>
                                <p>${project.description}</p>
                                <br/>
                                <p>Si te interesa, podes verlo en el siguiente link:</p>
                                <br/>
                                <a href="${process.env.FRONTEND_URL}/projects/${project._id}" class="button">${project.name}</a>
                            </div>
                            `
                        })}
                        <br>
                        <span>Gracias por usar Meeting</span>
                        <br/>
                        <span>Seguinos en nuestras redes sociales</span>
                        <br/><br/>
                        <div>
                            <a href="${process.env.INSTAGRAM_URL}" class="button">Instagram</a>
                            <a href="${process.env.TWITTER_URL}" class="button">Twitter</a>
                            <a href="${process.env.LINKEDIN_URL}" class="button">LinkedIn</a>
                        </div>
                    </div>
                `,
        });
    }catch(error){
        console.log(error);
        throw new Error(error);
    }
};

const sendRequest = async (user,leader,project, status) => {
    try{
        await transporter.sendMail({
            from: `<${process.env.EMAIL_USER}>`,
            to: leader.email,
            subject: "Meeting - Solicitudes de tu Proyecto",
            html: `
                <style>
                    @import url('https://fonts.googleapis.com/css2?family=Poppins&display=swap');
                    *{
                        font-family: 'Poppins', sans-serif;
                    }
                    hr{
                        border: 1px solid #c42e6c;
                        width: 50%;
                    }
                    #contenedor{
                        background-color: #ffffff;
                        padding: 20px;
                        text-align: center;
                        border: 1px solid #c42e6c;
                        border-radius: 10px;
                    }
                    .button{
                        padding: 5px 10px;
                        border-radius: 5px;
                        background-color: #c42e6c;
                        color: white;
                        text-decoration: none;
                        margin-bottom: 15px;
                    }
                    #proyecto{
                        background-color: #ffffff;
                        padding: 20px;
                        text-align: center;
                        border: 1px solid #c42e6c;
                        border-radius: 10px;
                    }
                </style>
                <div id="contenedor">
                <h1>¡Has recibido una actualizacion de solicitudes de tu proyecto ${project.name}!</h1>
                <p>Recuerda revisar detalladamente el perfil del usuario para verificar que cumpla con tus requisitos.</p>
                <div id="proyecto">
                    <h3>${user.name} - ${status ? 'Ha solicitado unirse' : 'Ha cancelado la solicitud'}</h3>
                    <hr>
                    <p>${user.level}</p>
                    <br/>
                    <p>Si te interesa, podes verlo en el siguiente link:</p>
                    <br/>
                    <a href="${process.env.FRONTEND_URL}/projects/${project._id}" class="button">${project.name}</a>
                </div>
                <br>
                <span>Gracias por usar Meeting</span>
                <br/>
                <span>Seguinos en nuestras redes sociales</span>
                <br/><br/>
                <div>
                    <a href="${process.env.INSTAGRAM_URL}" class="button">Instagram</a>
                    <a href="${process.env.TWITTER_URL}" class="button">Twitter</a>
                    <a href="${process.env.LINKEDIN_URL}" class="button">LinkedIn</a>
                </div>
            </div>
            `
        });
    }catch(error){
        console.log(error);
        throw new Error(error);
    }
}


module.exports = { sendEmail, sendEmailPlatform, sendRequest };
const { sendEmail } = require('../../infrastructure/utils/mailer');

const sendTypeEmail = async (user, email, message, project, post) => {
    try{
        await sendEmail(user,email,message,project,post);
    }catch(error){
        console.log(error);
        throw new Error(error);
    }
};

module.exports = { sendTypeEmail };



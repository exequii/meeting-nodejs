const { sendEmail, sendEmailPlatform, sendRequest, sendUpdateStatusProyect } = require('../../infrastructure/utils/mailer');
const userService = require('../../domain/services/userService');

const sendTypeEmail = async (user, email, message, project, post) => {
    try{
        await sendEmail(user,email,message,project,post);
    }catch(error){
        console.log(error);
        throw new Error(error);
    }
};

const sendEmailPlatformMeeting = async (user,projects) => {
    try{
        await sendEmailPlatform(user,projects);
    }catch(error){
        console.log(error);
        throw new Error(error);
    }
};

const sendEmailRequest = async (project, idUser, status) => {
    try{
        const userRequest = await userService.getUserById(idUser);
        const userLeader = await userService.getUserById(project.leader);
        await sendRequest(userRequest,userLeader,project,status);
    }catch(error){
        console.log(error);
        throw new Error(error);
    }
}

const sendEmailUpdateStatusProyect = async (user, project) => {
    try{
        await sendUpdateStatusProyect(user,project);
    }catch(error){
        console.log(error);
        throw new Error(error);
    }
}

module.exports = { sendTypeEmail, sendEmailPlatformMeeting, sendEmailRequest, sendEmailUpdateStatusProyect};



const { sendEmail, sendEmailPlatform } = require('../../infrastructure/utils/mailer');
const { getAllProjects } = require('../../domain/services/projectService');

const sendTypeEmail = async (user, email, message, project, post) => {
    try{
        await sendEmail(user,email,message,project,post);
    }catch(error){
        console.log(error);
        throw new Error(error);
    }
};

const sendEmailPlatformMeeting = async (user) => {
    try{
        const projects = await getAllProjects();
        const projectsSend = projects.results.slice(0,3);
        await sendEmailPlatform(user,projectsSend);
    }catch(error){
        console.log(error);
        throw new Error(error);
    }
};

module.exports = { sendTypeEmail, sendEmailPlatformMeeting};



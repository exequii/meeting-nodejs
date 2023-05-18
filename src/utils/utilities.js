const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const Project = require('../models/project');
const User = require('../models/user');
const Post = require('../models/post');

const generateHash = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    return passwordHash;
};

const comparePasswordWithHash = async (password, passwordHash) => {
    const validPassword = await bcrypt.compare(password, passwordHash);
    return validPassword;
};

const getSkipPage = (pagination) => {
    const resultsPerPage = 10;
    const skipPage = (parseInt(pagination) * resultsPerPage) - resultsPerPage ;
    return skipPage;
};

const updateProjectAndUser = async (userId, projectId) => {
    const session = await mongoose.startSession();
    try{
        let project = {};
        await session.withTransaction(async () => {
            await User.findByIdAndUpdate(userId, { $push: { projects: projectId } }, { session });
            project = await Project.findByIdAndUpdate(projectId, { $push: { participants: userId } }, { session, new: true });
        });
        await session.commitTransaction();
        return project;
    }catch(error){
        await session.abortTransaction();
        throw new Error(error);
    }finally{
        session.endSession();
    }
}

const createProjectAndUpdateUser = async (projectData) => {
    const session = await mongoose.startSession();
    try{
        let project = {};
        await session.withTransaction(async () => {
            project = await projectData.save();
            await User.findByIdAndUpdate(project.leader, { $push: { projects: project._id } }, { session });
        });
        await session.commitTransaction();
        return project;
    }catch(error){
        await session.abortTransaction();
        throw new Error(error);
    }finally{
        session.endSession();
    }
}

const createPostAndUpdateRelations = async (postData) => {
    const session = await mongoose.startSession();
    try{
        let post = {};
        await session.withTransaction(async () => {
            post = await postData.save();
            if(postData.project) await Project.findByIdAndUpdate(postData.project, { $push: { posts: post._id } }, { session });
            if(postData.author) await User.findByIdAndUpdate(postData.author, { $push: { posts: post._id } }, { session });
        });
        await session.commitTransaction();
        return post;
    }catch(error){
        await session.abortTransaction();
        throw new Error(error);
    }finally{
        session.endSession();
    }
}

const createMessageAndUpdateRelations = async (messageData) => {
    const session = await mongoose.startSession();
    try{
        let message = {};
        await session.withTransaction(async () => {
            message = await messageData.save();
            await Post.findByIdAndUpdate(messageData.post, { $push: { messages: message._id } }, { session });
        });
        await session.commitTransaction();
        return message;
    }catch(error){
        await session.abortTransaction();
        throw new Error(error);
    }finally{
        session.endSession();
    }
};

const getTechnologieForQuestions = (technologies,user) => {
    var technologie;
    do{
        technologie = technologies[Math.floor(Math.random() * technologies.length)];
    }while(user.preferences.includes(technologie) || user.disinterest.includes(technologie))
    return technologie;
}

const formatQuestionOfTechnologies = (questionsOfTechnologies,technologie) => {
    var question = questionsOfTechnologies[Math.floor(Math.random() * questionsOfTechnologies.length)];
    return question.replace("{{technologie}}",technologie);
}


module.exports = { 
    generateHash,
    comparePasswordWithHash,
    getSkipPage, updateProjectAndUser,
    createProjectAndUpdateUser,
    createPostAndUpdateRelations, 
    createMessageAndUpdateRelations,
    getTechnologieForQuestions,
    formatQuestionOfTechnologies
};


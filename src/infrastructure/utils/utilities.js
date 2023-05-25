const mongoose = require('mongoose');
const Project = require('../models/project');
const User = require('../models/user');
const Post = require('../models/post');


const updateProjectAndUser = async (userId, projectId,support) => {
    const session = await mongoose.startSession();
    try{
        let project = {};
        await session.withTransaction(async () => {
            if(support){
                await User.findByIdAndUpdate(userId, { $push: { supporting: projectId } }, { session });
                project = await Project.findByIdAndUpdate(projectId, { $push: { supports: userId } }, { session, new: true });
            }else{
                await User.findByIdAndUpdate(userId, { $push: { projects: projectId } }, { session });
                project = await Project.findByIdAndUpdate(projectId, { $push: { participants: userId } }, { session, new: true });
            }
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

const updateScoreUsersAndFinishProyect = async (projectId,scores) => {
    const session = await mongoose.startSession();
    try{
        let project = {}
        await session.withTransaction(async () => {
            project = await Project.findByIdAndUpdate(projectId, { status: 'Done' }, { new: true });
            scores.forEach(async (score) => {
                await User.findByIdAndUpdate(score.userId, { $inc: { score: score.score } });
            });
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

module.exports = { 
    updateProjectAndUser,
    createProjectAndUpdateUser,
    createPostAndUpdateRelations, 
    createMessageAndUpdateRelations,
    updateScoreUsersAndFinishProyect
};
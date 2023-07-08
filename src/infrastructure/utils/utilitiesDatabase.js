const mongoose = require('mongoose');
const Project = require('../schemas/project');
const User = require('../schemas/user');
const Post = require('../schemas/post');


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
                project = await Project.findByIdAndUpdate(projectId, { $push: { participants: userId }, $pull: {requests: userId} }, { session, new: true });
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

const setLevel = (newScore) => {
    if(newScore < 100) return 'Trainee';
    if(newScore > 100 && newScore < 200) return 'Junior';
    else if(newScore > 200 && newScore < 400) return 'Semi Senior';
    else if(newScore > 400) return 'Senior';
}

const leaveProjectAndUpdateUser = async (userId, projectId) => {
    const session = await mongoose.startSession();
    try{
        let project = {};
        await session.withTransaction(async () => {
            let userUpdated = await User.findByIdAndUpdate(userId, { $pull: { projects: projectId }, $inc: {score: -500}}, { session,new: true });
            let levelUpdated = setLevel(userUpdated)
            await User.findByIdAndUpdate(userId, { level: levelUpdated }, { session });
            project = await Project.findByIdAndUpdate(projectId, { $pull: { participants: userId }}, { session, new: true });
            // console.log(project)
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
            if(project.leader) await User.findByIdAndUpdate(project.leader, { $push: { projects: project._id } }, { session });
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
        console.log(error)
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
        const currentDate = new Date();
        currentDate.setHours(currentDate.getHours() - 3);

        await session.withTransaction(async () => {
            project = await Project.findByIdAndUpdate(projectId, { status: 'Done', endDate: currentDate}, { session,new: true });
            for (const score of scores) {
                let multiplyComplexity = project.complexity == 'Trainee' ? 1 : project.complexity == 'Junior' ? 2 : project.complexity == 'Semisenior' ? 3 : 5;
                let userToUpdate =await User.findById(score.userId).exec();
                let newScore = userToUpdate.score + (score.score * multiplyComplexity);
                let levelUpdated = setLevel(newScore)
                await User.findByIdAndUpdate(score.userId, { level: levelUpdated, score : newScore }, { session });
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


const getSkipPage = (pagination) => {
    const resultsPerPage = 10;
    const skipPage = (parseInt(pagination) * resultsPerPage) - resultsPerPage ;
    return skipPage;
};


module.exports = { 
    updateProjectAndUser,
    createProjectAndUpdateUser,
    createPostAndUpdateRelations, 
    createMessageAndUpdateRelations,
    updateScoreUsersAndFinishProyect,
    leaveProjectAndUpdateUser,
    getSkipPage
};
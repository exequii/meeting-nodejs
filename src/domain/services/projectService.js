const Project = require('../models/project');
const { updateProjectAndUser, createProjectAndUpdateUser, updateScoreUsersAndFinishProyect } = require('../utils/utilities');
const githubService = require('../services/githubService');

const createProject = async (projectData) => {
    try{
        let project = new Project(projectData);
        project = await createProjectAndUpdateUser(project);
        return project;
    }catch(error){
        throw new Error(error);
    }
}

const getProjectsByFilters = async(body) => {
    try {
        const projects = await Project.find(body);
        if(!projects || projects.length == 0) return null;
        return projects;
    } catch (error) {
        throw new Error(error);
    }
}

const getAllProjects = async () => {
    try{
        const projects = await Project.find();
        if(!projects || projects.length == 0) return null;
        return projects;
    }catch(error){
        throw new Error(error);
    }
}

const getProjectById = async (id) => {
    try{
        const project = await Project.findById(id)
        .populate({path: 'leader', select: '-password'})
        .populate({path: 'participants', select: '-password'})
        .populate({path: 'supports',select: '-password'})
        .populate('posts');
        if(!project) return null;
        return project;
    }catch(error){
        throw new Error(error);
    }
}


const updateProjectById = async (id, newData) => {
    try{
        const projectUpdated = await Project.findByIdAndUpdate(id,newData, { new: true });
        if(!projectUpdated) return null;
        return projectUpdated;
    }catch(error){
        throw new Error(error);
    }
}

const deleteProjectById = async (id) => {
    try{
        const projectDeleted = await Project.findByIdAndDelete(id);
        if(!projectDeleted) return null;
        return projectDeleted;
    }catch(error){
        throw new Error(error);
    }
}

const addProjectToUser = async (userId, projectId, support) => {
    try{
        let project = await getProjectsByFilters({ _id: projectId ,participants: userId });
        if(!project){
            project = await updateProjectAndUser(userId, projectId,support);
        }
        return project;
    }catch(error){
        throw new Error(error);
    }
}

const getSuggestedProjects = async (user) => {
    try{
        let projects = []
        projects = await Project.find({ technologies: { $in: user.preferences }}).limit(5);
        if(projects.length < 5) {
            var concatenacion = await Project.find({ technologies: { $nin: user.preferences }}).limit(5 - projects.length)
            if(projects.length == 0) projects = concatenacion;
            else projects.concat(concatenacion);
        }
        return projects;
    }catch(error){
        throw new Error(error);
    }
}

const finishProject = async (projectId,scores) => {
    try{
        const project = await updateScoreUsersAndFinishProyect(projectId,scores);
        return project;
    }catch(error){
        throw new Error(error);
    }
}

const getMetricsByRepo = async (projectId) => {
    try{
        const project = await getProjectById(projectId);

        if(project.urlRepository === null) {
            return false;
        }

        const metrics = await githubService.getMetricsByRepo(project.urlRepository);

        return metrics;
    }catch(error){
        throw new Error(error);
    }
}

module.exports = {createProject,getProjectsByFilters, getAllProjects, getProjectById, updateProjectById, deleteProjectById, addProjectToUser, getSuggestedProjects, finishProject, getMetricsByRepo };


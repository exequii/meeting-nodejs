const Project = require('../models/project');
const githubService = require('../services/githubService');

const createProject = async (projectData) => {
    try{
        const project = new Project(projectData);
        await project.save();
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
        const project = await Project.findById(id);
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

module.exports = {createProject,getProjectsByFilters, getAllProjects, getProjectById, updateProjectById, deleteProjectById, getMetricsByRepo };
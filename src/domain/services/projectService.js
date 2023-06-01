const Project = require('../models/project');
const githubService = require('../services/githubService');
const ProjectRepository = require('../../infrastructure/persistence/projectRepository');

const createProject = async (projectData) => {
    try{
        let project = new Project(projectData);
        if(!project.validateEssentialData()) throw new Error("Invalid project data");
        return await ProjectRepository.create(project);
    }catch(error){
        throw new Error(error);
    }
}

const getProjectsByFilters = async(filters) => {
    try {
        const projects = await ProjectRepository.getByFilters(filters);
        if(!projects || projects.length == 0) return null;
        return projects;
    } catch (error) {
        throw new Error(error);
    }
}

const getAllProjects = async () => {
    try{
        const projects = await ProjectRepository.getAll();
        if(!projects || projects.length == 0) return null;
        return projects;
    }catch(error){
        throw new Error(error);
    }
}

const getProjectById = async (id) => {
    try{
        const project = await ProjectRepository.getById(id);
        if(!project) return null;
        return project;
    }catch(error){
        throw new Error(error);
    }
}


const updateProjectById = async (id, newData) => {
    try{
        const projectUpdated = await ProjectRepository.updateById(id,newData);
        if(!projectUpdated) return null;
        return projectUpdated;
    }catch(error){
        throw new Error(error);
    }
}

const deleteProjectById = async (id) => {
    try{
        const response = await ProjectRepository.deleteById(id);
        if(!response) return null;
        return response;
    }catch(error){
        throw new Error(error);
    }
}

const addProjectToUser = async (userId, projectId, support) => {
    try{
        let project = await getProjectsByFilters({ _id: projectId ,participants: userId });
        if(!project){
            project = await ProjectRepository.addProjectToUser(userId, projectId,support);
        }
        return project;
    }catch(error){
        throw new Error(error);
    }
}

const getSuggestedProjects = async (user) => {
    try{
        const projects = await ProjectRepository.getSuggestedProjects(user);
        if(!projects || projects.length == 0) return null;
        return projects;
    }catch(error){
        throw new Error(error);
    }
}

const finishProject = async (projectId,scores) => {
    try{
        const project = await ProjectRepository.finishProject(projectId,scores);
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


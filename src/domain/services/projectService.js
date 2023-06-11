const Project = require('../models/project');
const githubService = require('../services/githubService');
const gitlabService = require('../services/gitlabService');
const ProjectRepository = require('../../infrastructure/persistence/projectRepository');
const { getSkipPage } = require('../utils/utilities');
const userRepository = require('../../infrastructure/persistence/userRepository');
const NodeCache = require('node-cache');
const cache = new NodeCache();
const { getSkipPage } = require('../utils/utilities');

const createProject = async (projectData) => {
    try{
        let project = new Project(projectData);
        if(!project.validateEssentialData()) throw new Error("Invalid project data");
        return await ProjectRepository.create(project);
    }catch(error){
        throw new Error(error);
    }
}

const sortProjects = async (projects, userId) => {
    const leaderProjects = [];
    const participantProjects = [];
    const supportProjects = [];
    const otherProjects = [];

    //TODO: Refactor this
    for (const project of projects) {
        if (project.leader == userId) {
            leaderProjects.push({ ...project.toObject(), roleUser: 'leader' });
        } else if (project.participants.includes(userId)) {
            participantProjects.push({ ...project.toObject(), roleUser: 'participant' });
        } else if (project.supports.includes(userId)) {
            supportProjects.push({ ...project.toObject(), roleUser: 'support' });
        } else {
            otherProjects.push(project);
        }
    }

    return [
        ...leaderProjects,
        ...participantProjects,
        ...supportProjects,
        ...otherProjects,
    ];
}

const getProjectsByFilters = async(filters, pagination) => {
    try {
        let userId = null;
        let skipPage = 0;
        if(pagination) {
            skipPage = getSkipPage(pagination);
        }
        //TODO: Delivery?
        if (filters.userId) {
            userId = filters.userId;
            delete filters.userId;
        }

        const projects = await ProjectRepository.getByFilters(filters, skipPage);
        if(!projects || projects.length == 0) return null;
        if (userId) {
            return sortProjects(projects.results, userId);
        }
        return projects.results;
    } catch (error) {
        throw new Error(error);
    }
}

const getAllProjects = async (pagination) => {
    try{
        let skipPage = 0;
        if(pagination) {
            skipPage = getSkipPage(pagination);
        }
        const projects = await ProjectRepository.getAll(skipPage);
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
        let project = await validateParticipantInProject(projectId,userId);
        if(!project) return { message: "El usuario ya forma parte del proyecto indicado" };
        let user = await userRepository.getById(userId);
        if(project.validateSystem && user) {
            if(!validateJoinProject(project, user)) {
                return { message: "No puedes unirte. Almenos una tecnologia de tus preferencias debe coincidir con las del proyecto." };
            }
            return await ProjectRepository.addProjectToUser(userId, projectId,support);
        }
        return { message: "No se encontro el proyecto o usuario indicado" };
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
    let metrics;
    const project = await getProjectById(projectId);

    if (cache.has("project" + projectId)) {
        return cache.get("project" + projectId);
    }

    try{
        if(project.urlRepository === null) {
            return false;
        }
        if (project.urlRepository.includes('github')) {
            metrics = await githubService.getMetricsByRepo(project.urlRepository);
        } else {
            metrics = await gitlabService.getMetricsByRepo(project.urlRepository);
        }
        cache.set("project" + projectId, metrics, 60 * 60 * 24);
        return metrics;
    }catch(error){
        throw new Error(error);
    }
}

const validateJoinProject = (project, user) => {
    try{
        const validate = project.technologies.some(tech => user.preferences.includes(tech));
        return validate;
    }catch(error){
        throw new Error(error);
    }
}

const validateParticipantInProject = async (projectId, userId) => {
    try{
        let project = await getProjectsByFilters({ _id: projectId ,participants: userId });
        if(project.length != 0) return null;
        project = await getProjectById({ _id: projectId });
        return project;
    }catch(error){
        throw new Error(error);
    }
}


module.exports = {createProject,getProjectsByFilters, getAllProjects, getProjectById, updateProjectById, deleteProjectById, addProjectToUser, getSuggestedProjects, finishProject, getMetricsByRepo };


const projectService = require('../services/projectService');

const createProject = async (req, res) => {
    try{
        const project = await projectService.createProject(req.body);
        res.status(201).json(project);
    }catch(error){
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}

const getProjectsByFilters = async (req, res) => {
    try{
        const projects = await projectService.getProjectsByFilters(req.body);
        if(!projects){
            return res.status(404).json({ message: 'Projects not found' });
        }
        res.status(200).json(projects);
    }catch(error){
        res.status(500).json({ message: 'Internal Server Error' ,error: error.message});
    }
}

const getAllProjects = async (req, res) => {
    try{
        const projects = await projectService.getAllProjects();
        if(!projects) {
            return res.status(404).json({ message: 'Projects not found' })
        }
        res.status(200).json(projects);
    }catch(error){
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}

const getProjectById = async (req, res) => {
    try{
        const project = await projectService.getProjectById(req.params.id);
        if(!project) {
            return res.status(404).json({ message: 'Project not found' })
        }
        res.status(200).json(project);
    }catch(error){
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}

const updateProjectById = async (req, res) => {
    try{
        const project = await projectService.updateProjectById(req.params.id, req.body);
        if(!project) {
            return res.status(404).json({ message: 'Project not found' })
        }
        res.status(200).json(project);
    }catch(error){
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}

const deleteProjectById = async (req, res) => {
    try{
        const project = await projectService.deleteProjectById(req.params.id);
        if(!project) {
            return res.status(404).json({ message: 'Project not found' })
        }
        res.status(200).json(project);
    }catch(error){
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}

const getMetricsByRepo = async (req, res) => {
    try{
        const metrics = await projectService.getMetricsByRepo(req.params.id);

        if(!metrics) {
            return res.status(204).json({ message: 'Project sync failed' })
        }

        res.status(200).json(metrics);
    }catch(error){
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}

module.exports = {createProject,getProjectsByFilters, getAllProjects, getProjectById, updateProjectById, deleteProjectById, getMetricsByRepo };
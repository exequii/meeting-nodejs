const projectService = require('../../domain/services/projectService');
const emailService = require('../../domain/services/emailService');

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
        const projects = await projectService.getProjectsByFilters(req.body,req?.params?.pagination);
        if(!projects){
            return res.status(204).json({results:[], message: 'Projects not found' });
        }
        res.status(200).json(projects);
    }catch(error){
        res.status(500).json({ message: 'Internal Server Error' ,error: error.message});
    }
}

const getAllProjects = async (req, res) => {
    try{
        const projects = await projectService.getAllProjects(req?.params?.pagination);
        if(!projects) {
            return res.status(204).json({results:[], message: 'Projects not found' })
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
            return res.status(204).json({ message: 'Project not found' })
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
            return res.status(204).json({ message: 'Project not found' })
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
            return res.status(204).json({ message: 'Project not found' })
        }
        res.status(200).json(project);
    }catch(error){
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}

const addProjectToUser = async (req, res) => {
    try{
        const project = await projectService.addProjectToUser(req.body.userId, req.body.projectId,req.body.support);
        if(!project) {
            return res.status(204).json({message: 'Project or User not found' })
        }
        res.status(200).json(project);
    }catch(error){
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}

const getSuggestedProjects = async (req, res) => {
    try{
        const projects = await projectService.getSuggestedProjects(req.body);
        if(!projects) res.status(204).json({results:[], message: 'Projects not found' });
        res.status(200).json({result: projects});
    }catch(error){
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}

const finishProject = async (req, res) => {
    try{
        const project = await projectService.finishProject(req.params.id, req.body.scores);
        if(!project) res.status(204).json({results:[], message: 'Projects not found' });
        res.status(200).json({result: project});
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

const sendEmailInvite = async (req, res) => {
    try{
        const { user, email, message, project } = req.body;
        const emailResponse = await emailService.sendEmail(user, email, message, project);
        res.status(200).json(emailResponse);
    }catch(error){
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}

module.exports = {createProject, getProjectsByFilters,
    getAllProjects, getProjectById, 
    updateProjectById, deleteProjectById, 
    addProjectToUser, getSuggestedProjects, 
    finishProject, getMetricsByRepo,
    sendEmailInvite 
};


/*
{
    "userId":"6439eca53007118f2d62a99e",
    "projectId": "645e41a995e8389f0484e8ce"
}
*/
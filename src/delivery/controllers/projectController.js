const projectService = require('../../domain/services/projectService');
const emailService = require('../../domain/services/emailService');
const pdfService = require('../../domain/services/pdfService');
const {verify} = require("jsonwebtoken");

const createProject = async (req, res) => {
    try{
        const project = await projectService.createProject(req.body);
        res.status(201).json(project);
    }catch(error){
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}
function getRoleUser(project, userId) {
    if (project.leader == userId) {
        return 'leader';
    }

    if (project.participants.includes(userId)) {
        return 'participant';
    }

    if (project.supports.includes(userId)) {
        return 'support';
    }

    return 'none';
}

const sortProjects = async (projects, userId, ownProject = false) => {
    const projectsWithRole = [];
    const roleProjects = {
        leader: [],
        participant: [],
        support: [],
        none: []
    };

    projects.forEach((project) => {
        const roleUser = getRoleUser(project, userId);
        roleProjects[roleUser].push({ ...project.toObject(), 'roleUser': roleUser });
    });

    if (ownProject) {
        projectsWithRole.push([
            ...roleProjects.leader,
            ...roleProjects.participant,
            ...roleProjects.support
        ]);
    } else {
        projectsWithRole.push([
            ...roleProjects.leader,
            ...roleProjects.participant,
            ...roleProjects.support,
            ...roleProjects.none
        ]);
    }

    return projectsWithRole[0];
};

const getProjectsByFilters = async (req, res) => {
    try{
        let decoded;
        if (req.headers.authorization) {
            const token = req.headers.authorization.split(' ')[1];
            decoded = verify(token, process.env.JWT_SECRET);
            if (decoded.userId) {
                req.body.userId = decoded.userId;
            }
        }

        let projects = await projectService.getProjectsByFilters(req.body,req?.params?.pagination);
        if(!projects){
            return res.status(204).json({results:[], message: 'Projects not found' });

        }
        
        if (decoded?.userId) {
            projects.results = await sortProjects(projects.results, decoded.userId, req.body.ownProject);
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
        if(!project || project.message != undefined) {
            return res.status(207).json(project)
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
        res.status(200).json(metrics);
    }catch(error){
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}

const sendEmailInvite = async (req, res) => {
    try{
        const { user, email, message, project } = req.body;
        const emailResponse = await emailService.sendTypeEmail(user, email, message, project);
        res.status(200).json(emailResponse);
    }catch(error){
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}

const updateRequestProject = async (req, res) => {
    try{
        const project = await projectService.updateRequestProject(req.params.id,req.body.idUser,req.body.accepted);
        if(!project) {
            return res.status(204).json({ message: 'Project or User not found' })
        }
        res.status(200).json(project);
    }catch(error){
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}

const leaveProject = async (req, res) => {
    try{
        const project = await projectService.leaveProject(req.params.id,req.body.userId);
        if(!project) {
            return res.status(204).json({ message: 'Project or User not found' })
        }
        res.status(200).json(project);
    }catch(error){
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}

const updateRequestByProjectId = async (req, res) => {
    try{
        const project = await projectService.updateRequestByProjectId(req.params.id, req.body);
        if(!project) {
            return res.status(204).json({ message: 'Project not found' })
        }
        res.status(200).json(project);
    }catch(error){
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}

const downloadPDF = async (req, res) => {
    try{
        const pdf = await pdfService.downloadCertificatePDF(req.body.html);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=file.pdf');
        res.status(200).send(pdf);
    }catch(error){
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}

module.exports = {createProject, getProjectsByFilters,
    getAllProjects, getProjectById, 
    updateProjectById, deleteProjectById, 
    addProjectToUser, getSuggestedProjects, 
    finishProject, getMetricsByRepo,
    sendEmailInvite, updateRequestProject,
    leaveProject,updateRequestByProjectId,downloadPDF
};


/*
{
    "userId":"6439eca53007118f2d62a99e",
    "projectId": "645e41a995e8389f0484e8ce"
}
*/
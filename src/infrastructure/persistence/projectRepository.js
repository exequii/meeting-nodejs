const Project = require('../schemas/project');
const { updateProjectAndUser, createProjectAndUpdateUser, updateScoreUsersAndFinishProyect, getSkipPage} = require('../utils/utilities');

const create = async (projectData) => {
    try{
        if(projectData.leader == "") delete projectData.leader;
        let project = new Project(projectData);
        return await createProjectAndUpdateUser(project);
    }catch(error){
        throw new Error(error);
    }
}

const getLength = async (projects) => {
    try{
        const count = await Project.count();
        return {results: projects, count};
    }catch(error){
        throw new Error(error);
    }
}

const getByFilters = async(filters, pagination) => {
    try {
        let skipPage = 0;
        if(pagination) {
            skipPage = getSkipPage(pagination);
        }
        if(filters.technologies?.$all?.length == 0) delete filters.technologies;
        let projects = await Project.find(filters).skip(skipPage).limit(10).cursor().toArray();
        projects = await getLength(projects);
        if(!projects || projects.length == 0) return null;
        return projects;
    } catch (error) {
        throw new Error(error);
    }
}

const getAll = async (pagination) => {
    try{
        let skipPage = 0;
        if(pagination) {
            skipPage = getSkipPage(pagination);
        }
        let projects = await Project.find().skip(skipPage).limit(10).cursor().toArray();
        projects = await getLength(projects);
        if(!projects || projects.length == 0) return null;
        return projects;
    }catch(error){
        throw new Error(error);
    }
}

const getById = async (id) => {
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


const updateById = async (id, newData) => {
    try{
        const projectUpdated = await Project.findByIdAndUpdate(id,newData, { new: true });
        if(!projectUpdated) return null;
        return projectUpdated;
    }catch(error){
        throw new Error(error);
    }
}

const deleteById = async (id) => {
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
        project = await updateProjectAndUser(userId, projectId,support);
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
            else projects = projects.concat(concatenacion);
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


module.exports = {create,getByFilters, getAll, getById, updateById, deleteById, addProjectToUser, getSuggestedProjects, finishProject };


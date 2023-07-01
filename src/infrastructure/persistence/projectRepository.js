const Project = require('../schemas/project');
const { updateProjectAndUser, createProjectAndUpdateUser, updateScoreUsersAndFinishProyect,leaveProjectAndUpdateUser, getSkipPage} = require('../utils/utilitiesDatabase');

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

const getFilters = (filters) => {
    let userId = null;
    let ownProject = false;

    if (filters.userId) {
        userId = filters.userId;
        delete filters.userId;
    }

    if (typeof filters.ownProject !== 'undefined' && filters.ownProject !== null) {
        ownProject = filters.ownProject
        delete filters.ownProject
    }

    if (filters.technologies?.$all?.length == 0) delete filters.technologies;


    return {
        'userId': userId,
        'ownProject': ownProject,
    };
};

const getByFilters = async (filters, pagination) => {
    try {
        const skipPage = pagination ? getSkipPage(pagination) : 0;
        const customFilters = getFilters(filters);

        const updatedFilters = customFilters.ownProject ? addOwnProjectFilters(filters, customFilters) : filters;

        const projects = await Project.find(updatedFilters);
        const count = projects.length;

        const sortedProjects = sortProjectsByCriteria(projects, customFilters.userId);

        const paginatedProjects = sortedProjects.slice(skipPage, skipPage + 10);

        return {
            results: paginatedProjects,
            count: count
        };
    } catch (error) {
        throw new Error(error);
    }
};

const addOwnProjectFilters = (filters, customFilters) => {
    return {
        $or: [
            { leader: customFilters.userId },
            { participants: customFilters.userId },
            { supports: customFilters.userId }
        ],
        ...filters
    };
};

const sortProjectsByCriteria = (projects, userId) => {
    const criteria = [
        { field: 'leader', value: userId },
        { field: 'participants', value: userId },
        { field: 'supports', value: userId }
    ];

    return projects.sort((a, b) => {
        for (const criterion of criteria) {
            const aValue = a[criterion.field];
            const bValue = b[criterion.field];
            const hasAValue = Array.isArray(aValue) ? aValue.includes(criterion.value) : aValue === criterion.value;
            const hasBValue = Array.isArray(bValue) ? bValue.includes(criterion.value) : bValue === criterion.value;

            if (hasAValue && !hasBValue) {
                return -1;
            } else if (!hasAValue && hasBValue) {
                return 1;
            }
        }

        return 0;
    });
};

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
        .populate({path: 'requests', select: '-password'})
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
        const projectUpdated = await Project.findByIdAndUpdate(id,newData, { new: true }).populate({path: 'participants', select: '-password'});
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

const updateRequest = async (projectId, userId, accepted) => {
    try{
        let project = {};
        if(accepted) 
            project = await updateProjectAndUser(userId, projectId, false);
        else 
            project = await Project.findByIdAndUpdate(projectId,{ $pull: {requests: userId}},{ new: true });
        return project;
    }catch(error){
        throw new Error(error);
    }
}

const leave = async (projectId, userId) => {
    try{
        const project = await leaveProjectAndUpdateUser(userId, projectId);
        return project;
    }catch(error){
        throw new Error(error);
    }
}

module.exports = {create,getByFilters, getAll, getById, updateById, deleteById, addProjectToUser, getSuggestedProjects, finishProject, updateRequest, leave};


const User = require('../schemas/user');
const { getSkipPage } = require('../utils/utilitiesDatabase');


const create = async (userData) => {
    try {
        const user = new User(userData);
        await user.save();
        return {...user._doc, password: undefined};
    } catch (error) {
        throw new Error(error);
    }
};

const getByCredentials = async(email) => {
    try {
        const user = await User.findOne({email});
        if(!user) return null;
        return user;
    } catch (error) {
        throw new Error(error);
    }
};

const getByFilters = async(filters) => {
    try {
        const users = await User.find(filters).select('-password');
        if(!users || users.length == 0) return null;
        return users;
    } catch (error) {
        throw new Error(error);
    }
};


const getAll = async () => {
    try {
        const users = await User.find().select('-password');
        if (!users || users.length == 0) return null;
        return users;
    } catch (error) {
        throw new Error(error);
    }
};

const getById = async (id) => {
    try {
    const user = await User.findById(id).select('-password').populate('projects').populate('supporting').populate('posts');
    if (!user) return null;
        if(user.projects.length > 0){
            for (const project of user.projects) {
                let roleUser;

                if (project.leader.toString() == id) {
                    roleUser = 'leader';
                } else if (project.participants.includes(id)) {
                    roleUser = 'participant';
                } else if (project.supports.includes(id)) {
                    roleUser = 'support';
                } else {
                    roleUser = 'none';
                }
                project._doc.roleUser = roleUser;
            }
        }

        return user;
    } catch (error) {
    throw new Error(error);
    }
};

const updateTechnologies = async (id, technologiesToSave) => {
    try {
        const userUpdated = await User.findByIdAndUpdate(id, {technologies: technologiesToSave}, { new: true,runValidators: true });
        if(!userUpdated) return null;
    } catch (error) {
        throw new Error(error);
    }
}

const updateById = async (id, newData) => {
    try {
        const userUpdated = await User.findByIdAndUpdate(id,newData, { new: true }).select('-password');
        if(!userUpdated) return null;
        return userUpdated;
    } catch (error) {
        throw new Error(error);
    }
};

const deleteById = async (id) => {
    try {
        const response = await User.deleteOne({ _id: id });
        if(response.deletedCount == 0) return null;
        return response;
    } catch (error) {
        throw new Error(error);
    }
};

const getByRanking = async (pagination) => {
    try {
        const skipPage = getSkipPage(pagination);
        let users = await User.find().select('-password').sort({ score: -1 }).skip(skipPage).limit(10).cursor().toArray();
        users = await getLength(users);
        if (!users || users.length == 0) return null;
        return users;
    } catch (error) {
        throw new Error(error);
    }
};

const getLength = async (users) => {
    try{
        const count = await User.count();
        return {results: users, count};
    }catch(error){
        throw new Error(error);
    }
}



module.exports = { create, getAll, getById, updateById, deleteById, getByCredentials, getByFilters, getByRanking, updateTechnologies };
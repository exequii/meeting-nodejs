const User = require('../models/user');
const { getSkipPage } = require('../utils/utilities');

const createUser = async (userData) => {
  try {
    const user = new User(userData);
    await user.save();
    return {...user._doc, password: undefined};
  } catch (error) {
    throw new Error(error);
  }
};

const getUserByCredentials = async(email) => {
  try {
      const user = await User.findOne({email});
      if(!user) return null;
      return user;
  } catch (error) {
    throw new Error(error);
  }
};

const getUserByFilters = async(body) => {
  try {
      const users = await User.find(body).select('-password');
      if(!users || users.length == 0) return null;
      return users;
  } catch (error) {
    throw new Error(error);
  }
};


const getAllUsers = async () => {
  try {
    const users = await User.find().select('-password');
    if (!users || users.length == 0) return null;
    return users;
  } catch (error) {
    throw new Error(error);
  }
};

  const getUserById = async (id) => {
    try {
      const user = await User.findById(id).select('-password').populate('projects').populate('supporting').populate('posts');
      if (!user) return null;
      return user;
    } catch (error) {
      throw new Error(error);
    }
  };

const updateUserById = async (id, newData) => {
  try {
    const userUpdated = await User.findByIdAndUpdate(id,newData, { new: true }).select('-password');
    if(!userUpdated) return null;
    return userUpdated;
  } catch (error) {
    throw new Error(error);
  }
};

const deleteUserById = async (id) => {
  try {
    const response = await User.deleteOne({ _id: id }).select('-password');
    if(response.deletedCount == 0) return null;
    return response;
  } catch (error) {
    throw new Error(error);
  }
};

const getUsersByRanking = async (pagination) => {
  try {
    const skipPage = getSkipPage(pagination);
    let users = await User.find().select('-password').sort({ score: -1 }).skip(skipPage).limit(10).cursor().toArray();
    users = await getLengthUsers(users);
    if (!users || users.length == 0) return null;
    return users;
  } catch (error) {
    throw new Error(error);
  }
};

const getLengthUsers = async (users) => {
  try {
    const count = await User.count();
    users = {users, count};
    return users;
  } catch (error) {
    throw new Error(error);
  }
};


module.exports = { createUser, getAllUsers, getUserById, updateUserById, deleteUserById, getUserByCredentials, getUserByFilters, getUsersByRanking };

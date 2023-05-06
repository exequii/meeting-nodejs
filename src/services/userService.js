const User = require('../models/user');

const createUser = async (userData) => {
  try {
    const user = new User(userData);
    await user.save();
    return user;
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
      const users = await User.find(body);
      if(!users || users.length == 0) return null;
      return users;
  } catch (error) {
    throw new Error(error);
  }
};


const getAllUsers = async () => {
  try {
    const users = await User.find();
    if (!users || users.length == 0) return null;
    return users;
  } catch (error) {
    throw new Error(error);
  }
};

  const getUserById = async (id) => {
    try {
      const user = await User.findById(id);
      if (!user) return null;
      return user;
    } catch (error) {
      throw new Error(error);
    }
  };

const updateUserById = async (id, newData) => {
  try {
    const userUpdated = await User.findByIdAndUpdate(id,newData, { new: true });
    if(!userUpdated) return null;
    return userUpdated;
  } catch (error) {
    throw new Error(error);
  }
};

const deleteUserById = async (id) => {
  try {
    const user = await User.deleteOne({ _id: id });
    if(!user) return null;
    return user;
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = { createUser, getAllUsers, getUserById, updateUserById, deleteUserById, getUserByCredentials, getUserByFilters };
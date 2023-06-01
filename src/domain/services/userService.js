const User = require('../models/user');
const UserRepository = require("../../infrastructure/persistence/userRepository")
const { getSkipPage } = require('../utils/utilities');

const createUser = async (userData) => {
  try {
    const user = new User(userData);
    if (!user.validateEssentialData()) throw new Error("Invalid user data");
    return await UserRepository.create(user);
  } catch (error) {
    throw new Error(error);
  }
};

const getUserByCredentials = async(email) => {
  try {
      const user = await UserRepository.getByCredentials(email);
      if(!user) return null;
      return user;
  } catch (error) {
    throw new Error(error);
  }
};

const getUserByFilters = async(filters) => {
  try {
      const users = await UserRepository.getByFilters(filters);
      if(!users || users.length == 0) return null;
      return users;
  } catch (error) {
    throw new Error(error);
  }
};


const getAllUsers = async () => {
  try {
    const users = await UserRepository.getAll();
    if (!users || users.length == 0) return null;
    return users;
  } catch (error) {
    throw new Error(error);
  }
};

  const getUserById = async (id) => {
    try {
      const user = await UserRepository.getById(id);
      if (!user) return null;
      return user;
    } catch (error) {
      throw new Error(error);
    }
  };

const updateUserById = async (id, newData) => {
  try {
    const userUpdated = await UserRepository.updateById(id, newData);
    if(!userUpdated) return null;
    return userUpdated;
  } catch (error) {
    throw new Error(error);
  }
};

const deleteUserById = async (id) => {
  try {
    const response = await UserRepository.deleteById(id);
    if(!response) return null;
    return response;
  } catch (error) {
    throw new Error(error);
  }
};

const getUsersByRanking = async (pagination) => {
  try {
    const skipPage = getSkipPage(pagination);
    const users = await UserRepository.getByRanking(skipPage);
    if (!users || users.length == 0) return null;
    return users;
  } catch (error) {
    throw new Error(error);
  }
};



module.exports = { createUser, getAllUsers, getUserById, updateUserById, deleteUserById, getUserByCredentials, getUserByFilters, getUsersByRanking };

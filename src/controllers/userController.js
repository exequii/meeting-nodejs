const userService = require('../services/userService');
const { generateHash, comparePasswordWithHash } = require('../utils/utilities');


const createUser = async (req, res) => {
  try {
    const existUser = await userService.getUserByFilters({ email: req.body.email });
    if(existUser) return res.status(400).json({ message: 'User already exists' });
    const passwordHashed = await generateHash(req.body.password);
    const user = await userService.createUser({ ...req.body, password: passwordHashed });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    if (!users) {
      return res.status(404).json({ message: 'Users not found' });
    }
    res.status(200).json(users);
  } catch (error) {
    //console.error(error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

  const getUserById = async (req, res) => {
    try {
      const user = await userService.getUserById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json(user);
    } catch (error) {
      //console.error(error);
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  };

const getUserByCredentials = async (req, res) => {
  try{
    const user = await userService.getUserByCredentials(req.body.email);
    if(!user) return res.status(404).json({ message: 'User not found' });
    const validPassword = await comparePasswordWithHash(req.body.password, user.password);
    if (!validPassword) return res.status(400).json({ message: 'Password not valid' })
    res.status(200).json(user);
  }catch(error){
    //console.error(error)
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

const getUserByFilters = async (req, res) => {
  try{
    const user = await userService.getUserByFilters(req.body);
    if(!user){
      return res.status(404).json({ message: 'Users not found' });
    }
    res.status(200).json(user);
  }catch(error){
    //console.error(error)
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

const updateUserById = async (req, res) => {
  try {
    const user = await userService.updateUserById(req.params.id, req.body);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    //console.error(error)
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

const deleteUserById = async (req, res) => {
  try {
    const user = await userService.deleteUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(204).end();
  } catch (error) {
    //console.error(error)
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

module.exports = { createUser, getAllUsers, getUserById, updateUserById, deleteUserById, getUserByCredentials, getUserByFilters };
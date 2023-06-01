const userService = require('../services/userService');
const githubService = require('../services/githubService');
const { generateHash, comparePasswordWithHash } = require('../utils/utilities');
const jwt = require('jsonwebtoken');


const createUser = async (req, res) => {
  try {
    const existUser = await userService.getUserByFilters({ email: req.body.email });
    if(existUser) return res.status(400).json({ message: 'User already exists' });
    const passwordHashed = await generateHash(req.body.password);
    const user = await userService.createUser({ ...req.body, password: passwordHashed });
    const token = jwt.sign({ user: user._id }, process.env.JWT_SECRET);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    if (!users) {
      return res.status(204).json({results:[], message: 'Users not found' });
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
        return res.status(204).json({ message: 'User not found' });
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
    if(!user) return res.status(204).json({ message: 'User not found' });
    const validPassword = await comparePasswordWithHash(req.body.password, user.password);
    if (!validPassword) return res.status(400).json({ message: 'Password not valid' })
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION });
    res.status(200).json({'token' : token, 'user': user});
  }catch(error){
    //console.error(error)
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

const getUserByFilters = async (req, res) => {
  try{
    const user = await userService.getUserByFilters(req.body);
    if(!user){
      return res.status(204).json({results:[], message: 'Users not found' });
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
      return res.status(204).json({ message: 'User not found' });
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
      return res.status(204).json({ message: 'User not found' });
    }
    res.status(204).end();
  } catch (error) {
    //console.error(error)
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

const getUsersByRanking = async (req, res) => {
  try {
    const users = await userService.getUsersByRanking(req.params.pagination);
    if (!users) {
      return res.status(204).json({ message: 'Users not found' });
    }
    res.status(200).json(users);
  } catch (error) {
    //console.error(error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};


const getLanguagesByRepos = async (req, res) => {
  try {
    const languages = await githubService.getLanguagesForUser(req.params.username);
    res.status(200).json(languages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}

const getUserMetricsByRepos = async (req, res) => {
  try {
    const username = req.params.username
    const metrics = []
    const issues = await githubService.getReportedIssuesCount(username);
    const pullRequests = await githubService.hasContributionsInExternalProjects(username);
    const projectStats = await githubService.calculateAveragePopularity(username);
    const quantityProjects = await githubService.getQuantityProjects(username);
    const commitCounts = await githubService.getUserCommitCounts(username);



    metrics.push({'issuesReported' : issues,
                  'contributionsExternalProjects' : pullRequests,
                  'averagePopularityProjects': projectStats.averagePopularity,
                  'maxStarsProject': projectStats.maxStars,
                  'personalProjects': quantityProjects.quantityPersonalProjects,
                  'outsideProjects': quantityProjects.quantityOutsidelProjects,
                  'commits': commitCounts
    })

    res.status(200).json(metrics);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }

}


module.exports = { createUser, getAllUsers, getLanguagesByRepos, getUserById, updateUserById, deleteUserById, getUserByCredentials, getUserByFilters, getUsersByRanking, getUserMetricsByRepos };
const githubService = require('./githubService');
const gitlabService = require('./gitlabService');
const User = require('../models/user');
const UserRepository = require("../../infrastructure/persistence/userRepository")
const NodeCache = require('node-cache');
const cache = new NodeCache();

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
    const users = await UserRepository.getByRanking(pagination);
    if (!users || users.length == 0) return null;
    return users;
  } catch (error) {
    throw new Error(error);
  }
};
async function getGithubMetrics(username) {
  try{
    const issues = await githubService.getReportedIssuesCount(username);
    const pullRequests = await githubService.hasContributionsInExternalProjects(username);
    const projectStats = await githubService.calculateAveragePopularity(username);
    const quantityProjects = await githubService.getQuantityProjects(username);
    const commitCounts = await githubService.getUserCommitCounts(username);

    return {
      'issues' : issues,
      'pullRequests' : pullRequests,
      'projectStats' : projectStats,
      'quantityProjects' : quantityProjects,
      'commitCounts' : commitCounts
    }
  } catch (error) {
    console.error(error);
    return { message: 'Internal server error', error: error.message };
  }
}
async function getGitlabMetrics(username) {
  try{
    const commitCounts = await gitlabService.getUserCommitCounts(username);
    const issues = await gitlabService.getReportedIssuesCount(username);
    const pullRequests = await gitlabService.hasContributionsInExternalProjects(username);
    const projectStats = await gitlabService.calculateAveragePopularity(username);
    const quantityProjects = await gitlabService.getQuantityProjects(username);

    return {
      'issues' : issues,
      'pullRequests' : pullRequests,
      'projectStats' : projectStats,
      'quantityProjects' : quantityProjects,
      'commitCounts' : commitCounts
    }
  } catch (error) {
    console.error(error);
    return { message: 'Internal server error', error: error.message };
  }
}
async function getUserMetricsByRepos(id) {
  let metrics = {};
  const user = await UserRepository.getById(id);

  if (cache.has("metrics" + user.githubUsername + user.gitlabUsername)) {
    return cache.get("metrics" + user.githubUsername + user.gitlabUsername);
  }

  try {
    if (user.githubUsername !== '') {
      metrics.githubMetrics = await getGithubMetrics(user.githubUsername);
    }

    if (user.gitlabUsername !== '') {
      metrics.gitlabMetrics = await getGitlabMetrics(user.gitlabUsername);
    }

    cache.set("metrics" + user.githubUsername + user.gitlabUsername, metrics, 60 * 60 * 24);
    return metrics;
  } catch (error) {
    console.error(error);
    return { message: 'Internal server error', error: error.message };
  }
}


async function getLanguagesForUser(id) {
  let languages = {};
  let githubLanguages = [];
  let gitlabLanguages = [];
  const user = await UserRepository.getById(id);

  if (cache.has("languages" + user.githubUsername + user.gitlabUsername)) {
    return cache.get("languages" + user.githubUsername + user.gitlabUsername);
  }

  try {

    if (user.githubUsername !== ''){
      githubLanguages = await githubService.getLanguagesForUser(user.githubUsername);
      languages.githubLanguages = githubLanguages;
    }

    if (user.gitlabUsername !== ''){
      gitlabLanguages = await gitlabService.getLanguagesForUser(user.gitlabUsername);
      languages.gitlabLanguages = gitlabLanguages;
    }
    cache.set("languages" + user.githubUsername + user.gitlabUsername, languages, 60*60*24);
    return languages;
  } catch (error) {
    console.error(error);
    return { message: 'Internal server error', error: error.message };
  }
}

module.exports = { createUser, getAllUsers, getUserById, updateUserById, deleteUserById, getUserByCredentials, getUserByFilters, getUsersByRanking, getLanguagesForUser, getGithubMetrics, getGitlabMetrics, getUserMetricsByRepos };

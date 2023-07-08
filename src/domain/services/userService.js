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

function getExperienceRank(experience) {
  switch (experience) {
    case 'Trainee':
      return 0;
    case 'Junior':
      return 1;
    case 'Semi senior':
      return 2;
    case 'Senior':
      return 3;
    default:
      return -1;
  }
}
function getNameTechnologie(technology) {
  const words = technology.toLowerCase().split(' ');

  const capitalizedWords = words.map(word => word.charAt(0).toUpperCase() + word.slice(1));

  return capitalizedWords.join(' ');
}

function getExperience(technology) {
  return technology > 10 ? 'Senior' : technology > 7 ? 'Semi Senior' : technology > 5 ? 'Junior' : 'Trainee';
}

function getFormattedTechnologies(technologiesByRepos) {
  const result = [];
  const technologyCount = {};

  technologiesByRepos.forEach((tech) => {
      let { technology, quantity } = tech;
      technology = getNameTechnologie(technology);
      if (technologyCount.hasOwnProperty(technology)) {
        technologyCount[technology] += quantity;
      } else {
        technologyCount[technology] = quantity;
      }
  });

  for (const technology in technologyCount) {
    result.push({ technology, quantity: technologyCount[technology] });
  }

  return result.sort((a, b) => b.quantity - a.quantity);
}

async function getAllTechnologies(user) {
  let languages = await getLanguagesForUser(user);
  let technologiesByRepos = [];

  if (Array.isArray(languages.gitlabLanguages) && languages.gitlabLanguages.length > 0) {
    let gitlabLanguages = languages.gitlabLanguages;
    technologiesByRepos = technologiesByRepos.concat(gitlabLanguages);
  }

  if (Array.isArray(languages.githubLanguages) && languages.githubLanguages.length > 0) {
    let githubLanguages = languages.githubLanguages;
    technologiesByRepos = technologiesByRepos.concat(githubLanguages);

  }

  if (Array.isArray(languages.projectsLanguages) && languages.projectsLanguages.length > 0) {
    let projectsLanguages = languages.projectsLanguages;
    technologiesByRepos = technologiesByRepos.concat(projectsLanguages);

  }

  if (technologiesByRepos.length < 3) {
    let preferencesToAdd = formatPreferences(user.preferences,3 - technologiesByRepos.length);
    technologiesByRepos = technologiesByRepos.concat(preferencesToAdd);
  }

  return getFormattedTechnologies(technologiesByRepos);
}
function formatPreferences(userPreferences, remainingSlots) {
  let preferences = [];
  if (userPreferences.length >= 3){
    preferences = userPreferences.slice(0, 3);
  } else {
    let defaultPreferences = ["HTML", "CSS", "Javascript"].slice(0, (3 - userPreferences.length))
    preferences = userPreferences.concat(defaultPreferences)
  }

  return preferences.map((technology) => {
    return { technology: technology, quantity: 1 };
  });
}

async function updateTechnologies(user) {
  let technologiesToSave = [];
  let technologiesByRepos = [];
  let technologies = user.technologies;

  technologiesByRepos = await getAllTechnologies(user);

  technologiesByRepos = technologiesByRepos.slice(0, 3);

  technologiesByRepos.forEach(technology => {
    technologiesToSave.push({
      'nameTechnologie': getNameTechnologie(technology.technology),
      'experience': getExperience(technology.quantity)
    });
  });

  if (technologiesToSave.length > 0) {
    user.technologies = technologiesToSave;
    await UserRepository.updateTechnologies(user._id, technologiesToSave);
  }
}

const getUserById = async (id) => {
    try {
      const user = await UserRepository.getById(id);
      await updateTechnologies(user);
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
      const githubUserExists = await githubService.checkGitHubUserExists(user.githubUsername);
      if (githubUserExists) {
        metrics.githubMetrics = await getGithubMetrics(user.githubUsername);
      } else {
        throw new Error();
      }
    }

    if (user.gitlabUsername !== '') {
      const gitlabUserExists = await gitlabService.checkGitLabUserExists(user.gitlabUsername);
      if (gitlabUserExists) {
        metrics.gitlabMetrics = await getGitlabMetrics(user.gitlabUsername);
      } else {
        throw new Error();
      }
    }

    cache.set("metrics" + user.githubUsername + user.gitlabUsername, metrics, 60 * 60 * 24);
    return metrics;
  } catch (error) {
      return { message: 'User not found', error: "El usuario no existe" };
  }
}


async function getLanguagesFromProjects(user) {
  const languages = [];

  user.projects.forEach((project) => {
    project.technologies.forEach((technology) => {
      const existingTechnology = languages.find((item) => item.technology === technology);
      if (existingTechnology) {
        existingTechnology.quantity++;
      } else {
        languages.push({ technology: technology, quantity: 1 });
      }
    });
  });
  return languages;
}

async function getLanguagesForUser(id) {
  let languages = {};
  let githubLanguages = [];
  let gitlabLanguages = [];
  let projectLanguages = [];
  const user = await UserRepository.getById(id);

  let cacheKey = "languages" + user.githubUsername + user.gitlabUsername + user.projects.length;

  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }

  try {
    if (user.githubUsername !== '') {
      const githubUserExists = await githubService.checkGitHubUserExists(user.githubUsername);
      if (githubUserExists) {
        githubLanguages = await githubService.getLanguagesForUser(user.githubUsername);
        languages.githubLanguages = githubLanguages.sort((a, b) => b.quantity - a.quantity);
      }
    }

    if (user.gitlabUsername !== '') {
      const gitlabUserExists = await gitlabService.checkGitLabUserExists(user.gitlabUsername);
      if (gitlabUserExists) {
        gitlabLanguages = await gitlabService.getLanguagesForUser(user.gitlabUsername);
        languages.gitlabLanguages = gitlabLanguages.sort((a, b) => b.quantity - a.quantity);
      }
    }

    if (!githubUserExists  && !gitlabUserExists) {
      throw new Error();
    }



    if (user.projects.length > 0) {
      projectLanguages = await getLanguagesFromProjects(user);
      languages.projectsLanguages = projectLanguages.sort((a, b) => b.quantity - a.quantity);
    }

    cache.set(cacheKey, languages, 60*60*24);
    return {languages, githubUserExists, gitlabUserExists};
  } catch (error) {
    return { message: 'User not found', error: "El usuario no existe" };
  }
}

module.exports = { createUser, getAllUsers, getUserById, updateUserById, deleteUserById, getUserByCredentials, getUserByFilters, getUsersByRanking, getLanguagesForUser, getUserMetricsByRepos, getAllTechnologies, getExperience };

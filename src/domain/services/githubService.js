const axios = require('axios');
const credentials = process.env.GITHUB_ACCES_TOKEN

const headers = {
    Authorization: `Bearer ${credentials}`
};
const getCommits = async (owner, repo) => {
        try {
            const response = await axios.get(`https://api.github.com/repos/${owner}/${repo}/commits`, {headers});
            const commits = response.data;
            return commits.length;
        } catch (error) {
            console.error(error);
            throw new Error(error);
        }
}

async function getReposUser(username, all = false) {
    try{
        if (all) {
            const response = await axios.get(`https://api.github.com/users/${username}/repos?type=all`, {headers});
            return response.data;
        }
        const response = await axios.get(`https://api.github.com/users/${username}/repos`, {headers});
        return response.data;
    }catch(error){
        console.error(error);
        throw new Error(error);
    }
}

async function getLanguagesForUser(username) {
    try {
        const repos = await getReposUser(username);
        const languages = [];
        repos.forEach((repo) => {
            const lang = repo.language;
            if (lang) {
                const existingLanguage = languages.find((item) => item.technology === lang);
                if (existingLanguage) {
                    existingLanguage.quantity++;
                } else {
                    languages.push({ technology: lang, quantity: 1 });
                }
            }
        });
        return languages;
    } catch (error) {
        console.error(error);
        throw new Error(error);
    }
}

async function getReportedIssuesCount(username) {
    try {
        return await getIssuesUser(username);
    } catch (error) {
        console.error(error);
        throw new Error(error);
    }
}

async function getIssuesUser(username) {
    try {
        const response = await axios.get(`https://api.github.com/search/issues?q=type:issue+author:${username}`, {headers});
        const data = response.data;
        // const response = await fetch(`https://api.github.com/search/issues?q=type:issue+author:${username}`);
        // const data = await response.json();
        return data.total_count;
    } catch (error) {
        console.error(error);
        throw new Error(error);
    }
}

async function hasContributionsInExternalProjects(username) {
    try {
        const pullRequests = await getPullRequestsUser(username);
        return pullRequests;
    } catch (error) {
        console.error(error);
        throw new Error(error);
    }
}

async function getPullRequestsUser(username) {
    try {
        const response = await axios.get(`https://api.github.com/search/issues?q=type:pr+author:${username}`, {headers});
        const data = response.data;
        return data.total_count;
    } catch (error) {
        console.error(error);
        throw new Error(error);
    }
}

async function calculateAveragePopularity(username) {
    try {
        const repos = await getReposUser(username);
        let totalStars = 0;
        let maxStars = 0;

        if (Array.isArray(repos)) {
            repos.forEach(repo => {
                totalStars += repo.stargazers_count;
                if (repo.stargazers_count > maxStars) {
                    maxStars = repo.stargazers_count;
                }
            });
        }

        const averagePopularity = Math.round(totalStars / repos.length);
        return { averagePopularity, maxStars };
    } catch (error) {
        console.error(error);
        throw new Error(error);
    }
}

const getQuantityProjects = async (username) => {
    try {
        const repositories = await getReposUser(username, true);

        const personalProjects = repositories.filter(repo => repo.owner.login == username);
        const outsidelProjects = repositories.filter(repo => repo.owner.login !== username);

        const quantityPersonalProjects = personalProjects.length
        const quantityOutsidelProjects = outsidelProjects.length

        return {quantityPersonalProjects , quantityOutsidelProjects};
    } catch (error) {
        console.error(error);
        throw new Error(error);
    }
};

const getUserCommitCounts = async (username) => {
    try {
        const repositories = await getReposUser(username);

        const commitCountsByRepo = [];

        for (const repository of repositories) {
            const repositoryName = repository.name;

            const commitCount = await getCommitCountByRepository(username, repositoryName);

            commitCountsByRepo.push({'nameRepository' : repositoryName,
                'quantityCommits' : commitCount
            })
        }

        return commitCountsByRepo;
    } catch (error) {
        console.error(error);
        throw new Error(error);
    }
};

const getCommitCountByRepository = async (owner, repo) => {
    try {
        const response = await axios.get(`https://api.github.com/repos/${owner}/${repo}/commits`, {headers});
        const commits = response.data;
        return commits.length;
    } catch (error) {
        console.error(error);
        throw new Error(error);
    }
};

async function getDevelopersUsernames(owner, repo) {
    try {
        const url = `https://api.github.com/repos/${owner}/${repo}/contributors`;
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error(error);
        throw new Error('Error al obtener los desarrolladores del repositorio');
    }
}

const getMetricsByRepo = async (url) => {
    try{
        const myUrl = new URL(url);
    
        const owner = myUrl.pathname.split('/')[1];
        const repo = myUrl.pathname.split('/')[2];

        const contributionsData = {};
        let commitsByDevelopers = [];

        const developersUsernames = await getDevelopersUsernames(owner, repo);
        for (const developerUsername of developersUsernames) {
            const commitFrequency = await getCommitFrequencyByDeveloper(owner, repo, developerUsername.login);

            commitsByDevelopers.push({
                'developerUsername': developerUsername.login,
                'commits': commitFrequency,
            })
        }
        const contributionDistributionByType = await getContributionDistributionByType(owner, repo);

        contributionsData.commitsByDeveloper = commitsByDevelopers;
        contributionsData.contributionDistributionByType = contributionDistributionByType
        return contributionsData
    }catch(error){
        console.error(error);
        throw new Error(error);
    }
};

const getCommitFrequencyByDeveloper = async (owner, repo, developerUsername) => {
    try {
        const response = await axios.get(`https://api.github.com/repos/${owner}/${repo}/commits?author=${developerUsername}&all=true&per_page=100`, {headers});
        const commits = response.data;

        const commitCount = Math.round(commits.length);

        if (commitCount < 2) {
            return 0
        }

        const firstCommitDate = new Date(commits[commitCount - 1].commit.author.date);
        const lastCommitDate = new Date(commits[0].commit.author.date);
        const timeDiffInDays = Math.abs(lastCommitDate - firstCommitDate) / (1000 * 60 * 60 * 24);

        const commitFrequency = Math.round(commitCount / timeDiffInDays);
        return ({
            'commitCount' : commitCount,
            "commitFrequencyByDay" : commitFrequency});

    } catch (error) {
        console.error(error);
        throw new Error(error);
    }
};

const getContributionDistributionByType = async (owner, repo) => {
    try {
        const response = await axios.get(`https://api.github.com/repos/${owner}/${repo}/contributors`, { headers });
        const contributors = response.data;

        const contributionDistribution = {
            commits: {},
            issues: {},
            pullRequests: {}
        };

        for (const contributor of contributors) {
            const username = contributor.login;

            const commitsResponse = await axios.get(`https://api.github.com/repos/${owner}/${repo}/commits?author=${username}&all=true&per_page=100`, { headers });
            const commitsByUser = commitsResponse.data;

            const pullRequestResponse = await axios.get(`https://api.github.com/repos/${owner}/${repo}/pulls?state=all`, { headers });
            const pullRequestsByUser = pullRequestResponse.data.filter(pullRequest => pullRequest.user.login === username);

            const issuesResponse = await axios.get(`https://api.github.com/repos/amitsingh-007/bypass-links/issues`, { headers });
            const issuesByUser = issuesResponse.data.filter(issue => issue.user.login === username);

            contributionDistribution.commits[username] = commitsByUser.length;
            contributionDistribution.issues[username] = issuesByUser.length;
            contributionDistribution.pullRequests[username] = pullRequestsByUser.length;
        }

        return contributionDistribution;
    } catch (error) {
        console.error(error);
        throw new Error(error);
    }
};

module.exports = {getCommits,getLanguagesForUser,getReportedIssuesCount, hasContributionsInExternalProjects, calculateAveragePopularity, getQuantityProjects, getUserCommitCounts, getMetricsByRepo};
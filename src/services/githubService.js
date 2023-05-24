const axios = require('axios');
const credentials = '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'

const headers = {
    Authorization: `Bearer ${credentials}`
};
const getCommits = async (owner, repo) => {
        try {
            const response = await axios.get(`https://api.github.com/repos/${owner}/${repo}/commits`, {headers});
            console.log("commit",credentials)
            const commits = response.data;
            return commits.length;
        } catch (error) {
            console.error(error);
            throw new Error('Failed to fetch commits from Github API');
        }
}

async function getReposUser(username) {
    const response = await axios.get(`https://api.github.com/users/${username}/repos`, {headers});
    return response.data;
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
    }
}

async function getReportedIssuesCount(username) {
    try {
        return await getIssuesUser(username);
    } catch (error) {
        console.error(error);
        throw error;
    }
}

async function getIssuesUser(username) {
    try {
        const response = await fetch(`https://api.github.com/search/issues?q=type:issue+author:${username}`);
        const data = await response.json();
        return data.total_count;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

async function hasContributionsInExternalProjects(username) {
    try {
        const pullRequests = await getPullRequestsUser(username);
        return pullRequests;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

async function getPullRequestsUser(username) {
    try {
        const response = await fetch(`https://api.github.com/search/issues?q=type:pr+author:${username}`);
        const data = await response.json();
        return data.total_count;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

async function calculateAveragePopularity(username) {
    try {
        const forks = await getForksUser(username);
        let totalStars = 0;
        let maxStars = 0;

        // console.log(forks);
        if (Array.isArray(forks)) {
            forks.forEach(fork => {
                totalStars += fork.stargazers_count;
                if (fork.stargazers_count > maxStars) {
                    maxStars = fork.stargazers_count;
                }
            });
        }

        const averagePopularity = Math.round(totalStars / forks.length);
        return { averagePopularity, maxStars };
    } catch (error) {
        console.error(error);
        throw error;
    }
}

async function getForksUser(username) {
    try {
        const response = await fetch(`https://api.github.com/users/${username}/repos?type=forks`);
        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
}

const getQuantityProjects = async (username) => {
    try {
        const repositories = await getReposUser(username);

        const personalProjects = repositories.filter(repo => !repo.fork && repo.owner.login !== username);
        const outsidelProjects = repositories.filter(repo => repo.fork);

        const quantityPersonalProjects = personalProjects.length
        const quantityOutsidelProjects = outsidelProjects.length

        return {quantityPersonalProjects , quantityOutsidelProjects};
    } catch (error) {
        console.error(error);
        throw error;
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
        // Manejar el error
        throw new Error(error.message);
    }
};

const getCommitCountByRepository = async (owner, repo) => {
    try {
        const response = await axios.get(`https://api.github.com/repos/${owner}/${repo}/commits`, {headers});
        const commits = response.data;
        return commits.length;
    } catch (error) {
        throw new Error('Error al obtener la cantidad de commits');
    }
};

const getMetricsByRepo = async (url) => {
    const myUrl = new URL(url);

    const owner = myUrl.pathname.split('/')[1];
    const repo = myUrl.pathname.split('/')[2];

    const contributionsData = [];

    const developersUsernames = ['NahuelSavedra', 'exequii', 'JoelE7','jessicadlg','Diego2985'];

    for (const developerUsername of developersUsernames) {
        const commitFrequency = await getCommitFrequencyByDeveloper(owner, repo, developerUsername);

        contributionsData.push({
            'developerUsername': developerUsername,
            'commits': commitFrequency,
            })
    }
    // const contributionDistributionByType = await getContributionDistributionByType(owner, repo);
    //
    // contributionsData.push({
    //     'contributionDistributionByType': contributionDistributionByType
    // })

    return contributionsData
};

const getCommitFrequencyByDeveloper = async (owner, repo, developerUsername) => {
    try {
        const response = await axios.get(`https://api.github.com/repos/${owner}/${repo}/commits?author=${developerUsername}`, {headers});
        const commits = response.data;

        const commitCount = Math.round(commits.length);

        if (commitCount < 2) {
            return 0
        }

        const firstCommitDate = new Date(commits[commitCount - 1].commit.author.date);
        const lastCommitDate = new Date(commits[0].commit.author.date);
        const timeDiffInDays = Math.abs(lastCommitDate - firstCommitDate) / (1000 * 60 * 60 * 24);

        console.log(commitCount);
        const commitFrequency = Math.round(commitCount / timeDiffInDays);
        return ({
            'commitCount' : commitCount,
            "commitFrequencyByDay" : commitFrequency});

    } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch user commits from GitHub API');
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

            const commitsResponse = await axios.get(`https://api.github.com/repos/${owner}/${repo}/commits?author=${username}`, { headers });
            const commits = commitsResponse.data;

            const commitCount = commits.length;

            contributionDistribution.commits[username] = commitCount;
            contributionDistribution.issues[username] = 0;
            contributionDistribution.pullRequests[username] = 0;
        }

        return contributionDistribution;
    } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch contribution distribution from Github API');
    }
};

module.exports = {getCommits,getLanguagesForUser,getReportedIssuesCount, hasContributionsInExternalProjects, calculateAveragePopularity, getQuantityProjects, getUserCommitCounts, getMetricsByRepo};
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

        for (const repository of repositories.slice(0, 10)) {
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
        const response = await axios.get(`https://api.github.com/repos/${owner}/${repo}/contributors`, {headers});
        return response.data;
    } catch (error) {
        console.error(error);
        throw new Error('Error al obtener los desarrolladores del repositorio');
    }
}

async function checkGitHubUserExists(username) {
    try {
        const response = await axios.get(`https://api.github.com/users/${username}`);
        return response.status === 200;
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return false;
        }
    }
}

async function checkGitHubRepoExists (repositoryUrl) {
    try {
        const response = await axios.get(repositoryUrl);
        return response.status === 200;
    } catch (error) {
        return false;
    }
};

async function getCommitActivity(owner, repo) {
    try {
        const response = await axios.get(`https://api.github.com/repos/${owner}/${repo}/commits`, {headers});
        const commits = response.data;

        const commitsByAuthor = [];

        for (const commit of commits) {
            const author = commit.author.login;
            const commitData = {
                message: commit.commit.message,
                date: commit.commit.author.date,
                html_url: commit.html_url
            };

            if (commitsByAuthor[author]) {
                commitsByAuthor[author].push(commitData);
            } else {
                commitsByAuthor[author] = [commitData];
            }
        }

        const lastCommitsByAuthor = [];

        for (const author in commitsByAuthor) {
            lastCommitsByAuthor.push({'developerUsername': author,'data' : commitsByAuthor[author].slice(0, 3)});
        }

        return lastCommitsByAuthor;
    } catch (error) {
        console.error(error);
        throw new Error('Error al obtener los últimos commits');
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

        const commitActivity = await getCommitActivity(owner, repo);

        contributionsData.commitByUser = commitsByDevelopers;
        contributionsData.contributionDistributionByType = contributionDistributionByType
        contributionsData.commitActivity = commitActivity

        return contributionsData
    }catch(error){
        console.error(error);
        throw new Error(error);
    }
};

function getCommitFrequency(commits, newCommitCount) {
    const firstCommitDate = new Date(commits[newCommitCount - 1].commit.author.date);
    const lastCommitDate = new Date(commits[0].commit.author.date);
    const timeDiffInDays = Math.abs(lastCommitDate - firstCommitDate) / (1000 * 60 * 60 * 24);

    return Math.round(newCommitCount / timeDiffInDays);
}

const getCommitFrequencyByDeveloper = async (owner, repo, developerUsername) => {
    let page = 1;
    let commitCount = 0;
    let commitFrequency = 0;

    try {
        while (true) {
            const response = await axios.get(`https://api.github.com/repos/${owner}/${repo}/commits?author=${developerUsername}&all=true&per_page=100&page=${page}`, { headers });
            const commits = response.data;
            const newCommitCount = Math.round(commits.length);

            if (newCommitCount < 2) {
                break;
            }
            const newCommitFrequency = getCommitFrequency(commits, newCommitCount);

            commitCount += newCommitCount;
            commitFrequency += newCommitFrequency;

            if (newCommitCount < 100) {
                break;
            }

            page++;
        }

        return {
            commitCount,
            commitFrequencyByDay: commitFrequency
        };
    } catch (error) {
        console.error(error);
        throw new Error(error);
    }
};

const getContributionDistributionByType = async (owner, repo) => {
    try {
        const response = await axios.get(`https://api.github.com/repos/${owner}/${repo}/contributors`, { headers });
        const contributors = response.data;

        const contributionDistribution = [];
        const releases = [];
        const pullRequests = [];
        const issues = [];

        for (const contributor of contributors) {
            const username = contributor.login;

            const releasesResponse = await axios.get(`https://api.github.com/repos/${owner}/${repo}/releases`, { headers });
            const releasesByUser = releasesResponse.data.filter(release => release.author.login === username);

            const pullRequestResponse = await axios.get(`https://api.github.com/repos/${owner}/${repo}/pulls?state=all`, { headers });
            const pullRequestsByUser = pullRequestResponse.data.filter(pullRequest => pullRequest.user.login === username);

            const issuesResponse = await axios.get(`https://api.github.com/repos/${owner}/${repo}/issues`, { headers });
            const issuesByUser = issuesResponse.data.filter(issue => issue.user.login === username);

            releases.push({'developerUsername' : username, 'quantity' : releasesByUser.length});
            pullRequests.push({'developerUsername' : username, 'quantity' : pullRequestsByUser.length});
            issues.push({'developerUsername' : username, 'quantity' : issuesByUser.length});
        }
        contributionDistribution.push({'type' : 'releases', 'data' : releases});
        contributionDistribution.push({'type' : 'pullRequests', 'data' : pullRequests});
        contributionDistribution.push({'type' : 'issues', 'data' : issues});

        return contributionDistribution;
    } catch (error) {
        console.error(error);
        throw new Error(error);
    }
};

module.exports = {getCommits,getLanguagesForUser,getReportedIssuesCount, hasContributionsInExternalProjects, calculateAveragePopularity, getQuantityProjects, getUserCommitCounts, getMetricsByRepo, checkGitHubUserExists, checkGitHubRepoExists};
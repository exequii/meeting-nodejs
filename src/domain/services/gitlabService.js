const axios = require('axios');
const credentials = process.env.GITLAB_ACCES_TOKEN

const headers = {
    Authorization: `Bearer ${credentials}`
};

async function getReposUser(username) {
    try {
        const response = await axios.get(`https://gitlab.com/api/v4/users/${username}/projects`, { headers });
        return response.data;
    } catch (error) {
        console.error(error);
        throw new Error(error);
    }
}

async function getLanguagesForUser(username) {
    try {
        const repos = await getReposUser(username);
        const languageCounts = {};

        for (const repo of repos) {
            const languages = await getLanguagesForRepo(repo.id);

            for (const language in languages) {
                if (languageCounts.hasOwnProperty(language)) {
                    languageCounts[language].quantity++;
                } else {
                    languageCounts[language] = { technology: language, quantity: 1 };
                }
            }
        }
        return Object.values(languageCounts);
    } catch (error) {
        console.error(error);
        throw new Error(error);
    }
}

const getUserCommitCounts = async (username) => {
    try {
        const repos = await getReposUser(username);
        const commitCountsByRepo = [];

        for (const repo of repos.slice(0, 10)) {
            const repositoryName = repo.name;

            const commitCount = await getCommitCountByRepository(repo.id);

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

const hasContributionsInExternalProjects = async (username) => {
    try {
        const response = await axios.get(`https://gitlab.com/api/v4/merge_requests?author_username=${username}`, { headers });
        const pullRequests = response.data;
        return pullRequests.length;
    } catch (error) {
        console.error(error);
        throw new Error(error);
    }
};

async function calculateAveragePopularity(username) {
    try {
        const repositories = await getReposUser(username);
        let totalStars = 0;
        let maxStars = 0;

        if (Array.isArray(repositories)) {
            repositories.forEach(repo => {
                totalStars += repo.star_count;
                if (repo.star_count > maxStars) {
                    maxStars = repo.star_count;
                }
            });
        }

        const averagePopularity = Math.round(totalStars / repositories.length);
        return { averagePopularity, maxStars };
    } catch (error) {
        console.error(error);
        throw new Error(error);
    }
}

const getQuantityProjects = async (username) => {
    try {
        const repos = await getReposUser(username);

        const personalProjects = repos.filter(repo => !repo.shared_with_groups.length);
        const collaboratorProjects = repos.filter(repo => repo.shared_with_groups.length);

        const quantityPersonalProjects = personalProjects.length;
        const quantityCollaboratorProjects = collaboratorProjects.length;

        return { quantityPersonalProjects, quantityCollaboratorProjects };
    } catch (error) {
        console.error(error);
        throw new Error(error);
    }
};

const getReportedIssuesCount = async (username) => {
    try {
        const response = await axios.get(`https://gitlab.com/api/v4/issues?author_username=${username}`, { headers });
        const issues = response.data;
        return issues.length;
    } catch (error) {
        console.error(error);
        throw new Error(error);
    }
};

//Metrics by only repo
async function getLanguagesForRepo(projectId) {
    try {
        const languagesUrl = `https://gitlab.com/api/v4/projects/${projectId}/languages`;
        const response = await axios.get(languagesUrl, { headers });
        return response.data;
    } catch (error) {
        console.error(error);
        throw new Error(error);
    }
}


const getCommitCountByRepository = async (projectId) => {
    try {
        const response = await axios.get(`https://gitlab.com/api/v4/projects/${projectId}/repository/commits`, { headers });
        const commits = response.data;
        return commits.length;
    } catch (error) {
        console.error(error);
        throw new Error(error);
    }
};

async function getRepo(owner, repoName) {
    try {
        const response = await axios.get(`https://gitlab.com/api/v4/projects/${owner}%2F${repoName}`, { headers });
        return response.data;
    } catch (error) {
        console.error(error);
        throw new Error(error);
    }
}

async function getDevelopersUsernames(repoId) {
    try {
        const response = await axios.get(`https://gitlab.com/api/v4/projects/${repoId}/repository/contributors`, {headers});
        const contributors = response.data;

        const developers = [];
        for (const contributor of contributors) {
            developers.push(contributor.name);
        }
        return developers;
    } catch (error) {
        console.error(error);
        throw new Error(error);
    }
}

async function getContributionDistributionByType(repoId, owner, repo) {
    try{
        const response = await axios.get(`https://gitlab.com/api/v4/projects/${repoId}/repository/contributors`, { headers });
        const contributors = response.data;

        const contributionDistribution = {
            commits: {},
            issues: {},
            pullRequest: {}
        };
        for (const contributor of contributors) {
            const username = contributor.name;
            const issuesResponse = await axios.get(`https://gitlab.com/api/v4/projects/${owner}%2F${repo}/issues?author_username=${username}`, { headers });

            const issues = issuesResponse.data;
            const mergeRequestsResponse = await axios.get(`https://gitlab.com/api/v4/projects/${owner}%2F${repo}/merge_requests?author_username=${username}`, { headers });
            const mergeRequests = mergeRequestsResponse.data;
            console.log(contributor)

            contributionDistribution.commits[username] = contributor.commits;
            contributionDistribution.issues[username] = issues.length;
            contributionDistribution.pullRequest[username] = mergeRequests.length;
        }

        return contributionDistribution;
    } catch (error) {
        console.error(error);
        throw new Error(error);
    }
}

const getMetricsByRepo = async (url) => {
    try{
        const myUrl = new URL(url);
        const owner = myUrl.pathname.split('/')[1];
        const repoName = myUrl.pathname.split('/')[2];

        const repo = await getRepo(owner, repoName);


        const developersUsernames = await getDevelopersUsernames(repo.id);

        const contributionsData = {};
        const commitByUser = [];

        for (const developerUsername of developersUsernames) {
            const commitFrequency = await getCommitFrequencyByDeveloper(repo.id, developerUsername);

            commitByUser.push({
                'developerUsername': developerUsername,
                'commits': commitFrequency,
            })
        }
        const contributionDistributionByType = await getContributionDistributionByType(repo.id, owner, repoName);

        contributionsData.commitByUser = commitByUser;
        contributionsData.contributionDistributionByType = contributionDistributionByType;

        return contributionsData
    }catch(error){
        console.error(error);
        throw new Error(error);
    }
};

const getCommitFrequencyByDeveloper = async (repoId, developerUsername) => {
    try {
        const response = await axios.get(`https://gitlab.com/api/v4/projects/${repoId}/repository/commits?author_username=${developerUsername}`, {headers});
        const commits = response.data;
        const commitCount = Math.round(commits.filter(commit => commit.author_name === developerUsername).length);

        if (commitCount == 0) {
            return ({
                'commitCount' : 0,
                "commitFrequencyByDay" : 0});
        }

        const firstCommitDate = new Date(commits[commitCount - 1].committed_date);
        const lastCommitDate = new Date(commits[0].committed_date);
        const timeDiffInDays = Math.abs(lastCommitDate - firstCommitDate) / (1000 * 60 * 60 * 24);

        const commitFrequency = Math.round(commitCount / timeDiffInDays);
        return ({
            'commitCount' : commitCount,
            "commitFrequencyByDay" : commitFrequency});

    } catch (error) {
        console.error(error);
        throw new Error(error);
    }
}

module.exports = {getLanguagesForUser, getUserCommitCounts, getReportedIssuesCount, hasContributionsInExternalProjects, getQuantityProjects, calculateAveragePopularity, getMetricsByRepo};
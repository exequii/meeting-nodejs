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

async function getDevelopersUsernames(repoId, developersByProject) {
    try {
        const response = await axios.get(`https://gitlab.com/api/v4/projects/${repoId}/repository/contributors`, {headers});
        const contributors = response.data;

        let developersByRepo = [];
        for (const contributor of contributors) {
            developersByRepo.push(contributor.name);
        }
        return removeNonMatchingNames(developersByRepo, developersByProject);
    } catch (error) {
        console.error(error);
        throw new Error(error);
    }
}

function removeNonMatchingNames(array1, names) {
    return array1.filter(item1 => {
        for (const name of names) {
            const item1Lower = item1.toLowerCase();
            const nameLower = name.toLowerCase();
            const intersection = new Set([...item1Lower].filter(char => nameLower.includes(char)));
            const union = new Set([...item1Lower, ...nameLower]);
            const similarity = intersection.size / union.size;
            if (similarity >= 0.5) {
                return true;
            }
        }
        return false;
    });
}

async function checkGitLabUserExists(username) {
    try {
        const response = await axios.get(`https://gitlab.com/api/v4/users?username=${username}`);
        return response.data.length > 0;
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return false;
        }
        throw error;
    }
}

const checkGitLabRepoExists = async (repositoryUrl) => {
    try {
        const response = await axios.get(repositoryUrl, {headers});
        return response.status === 200;
    } catch (error) {
        return false;
    }
};

async function getContributionDistributionByType(repoId, owner, repo) {
    try{
        const response = await axios.get(`https://gitlab.com/api/v4/projects/${repoId}/repository/contributors`, { headers });
        const contributors = response.data;

        const contributionDistribution = [];
        const commits = [];
        const pullRequests = [];
        const issues = [];

        let issuesByUser;
        let mergeRequestsByUser;
        let releasesByUser;

        for (const contributor of contributors) {
            const username = contributor.name;
            issuesByUser = [];
            mergeRequestsByUser = [];
            releasesByUser = [];

            const releasesResponse = await axios.get(`https://gitlab.com/api/v4/projects/${repoId}/releases`, { headers });
            if (releasesResponse.data.length > 0){
                releasesByUser = releasesResponse.data.filter(release => release.author.name === username);
            }

            const issuesResponse = await axios.get(`https://gitlab.com/api/v4/projects/${repoId}/issues`, { headers });
            if (issuesResponse.data.length > 0){
                issuesByUser = issuesResponse.data.filter(issue => issue.author.name === username);
            }

            const mergeRequestsResponse = await axios.get(`https://gitlab.com/api/v4/projects/${repoId}/merge_requests`, { headers });
            if (mergeRequestsResponse.data.length > 0){
                mergeRequestsByUser = mergeRequestsResponse.data.filter(request => request.author.name === username);
            }

            commits.push({'developerUsername' : username, 'quantity' : (releasesByUser.length ?? 0)});
            pullRequests.push({'developerUsername' : username, 'quantity' : (mergeRequestsByUser.length ?? 0)});
            issues.push({'developerUsername' : username, 'quantity' : (issuesByUser.length ?? 0)});
        }
        contributionDistribution.push({'type' : 'releases', 'data' : commits});
        contributionDistribution.push({'type' : 'pullRequests', 'data' : pullRequests});
        contributionDistribution.push({'type' : 'issues', 'data' : issues});


        return contributionDistribution;
    } catch (error) {
        console.error(error);
        throw new Error(error);
    }
}

async function getCommitActivity(repoId, username) {
    try {
        const response = await axios.get(`https://gitlab.com/api/v4/projects/${repoId}/repository/commits`, { headers });
        const commits = response.data;

        const commitsByAuthor = {};

        for (const commit of commits) {
            const author = commit.author_name;
            const commitData = {
                message: commit.message,
                date: commit.committed_date,
                html_url: commit.web_url
            };
            commitData.date = commit.committed_date;

            if (commitsByAuthor[author]) {
                commitsByAuthor[author].push(commitData);
            } else {
                commitsByAuthor[author] = [commitData];
            }

            commit.web_url = undefined;
            commit.committed_date = undefined;
        }

        const lastCommitsByAuthor = [];

        for (const author in commitsByAuthor) {
            lastCommitsByAuthor.push({ developerUsername: author, data: commitsByAuthor[author].slice(0, 3) });
        }

        return lastCommitsByAuthor;
    } catch (error) {
        console.error(error);
        throw new Error('Error al obtener los últimos commits');
    }

}

async function getDevelopersByProject(project) {
    const developersByProject = [];

    if (project.leader && project.leader.name) {
        developersByProject.push(project.leader.name);
    }

    if (project.participants && project.participants.length > 0) {
        project.participants.forEach(participant => {
            if (participant.name) {
                developersByProject.push(participant.name);
            }
        });
    }

    if (project.supports && project.supports.length > 0) {
        project.supports.forEach(support => {
            if (support.name) {
                developersByProject.push(support.name);
            }
        });
    }

    return developersByProject;
}

const getMetricsByRepo = async (project) => {
    try{
        const myUrl = new URL(project.urlRepository);
        const owner = myUrl.pathname.split('/')[1];
        const repoName = myUrl.pathname.split('/')[2];

        const repo = await getRepo(owner, repoName);

        const developersByProject = await getDevelopersByProject(project);

        const developersUsernames = await getDevelopersUsernames(repo.id, developersByProject);

        const contributionsData = {};
        const commitByUser = [];
        const commitActivity = [];

        for (const developerUsername of developersUsernames) {
            const commitFrequency = await getCommitFrequencyByDeveloper(repo.id, developerUsername);

            commitByUser.push({
                'developerUsername': developerUsername,
                'commits': commitFrequency,
            })
            commitActivity.push(await getCommitActivity(repo.id, developerUsername));
        }

        const contributionDistributionByType = await getContributionDistributionByType(repo.id, owner, repoName);

        contributionsData.commitByUser = commitByUser;
        contributionsData.contributionDistributionByType = contributionDistributionByType;
        contributionsData.commitActivity = commitActivity[0]

        return contributionsData
    }catch(error){
        console.error(error);
        throw new Error(error);
    }
};

const getCommitFrequencyByDeveloper = async (repoId, developerUsername) => {
    try {
        const response = await axios.get(`https://gitlab.com/api/v4/projects/${repoId}/repository/commits?committer_name=${developerUsername}`, {headers});
        const commits = response.data;
        const commitCount = Math.round(commits.filter(commit => commit.author_name === developerUsername).length);

        if (commitCount == 0) {
            return ({
                'commitCount' : 0,
                "commitFrequencyByDay" : 0});
        }

        const firstCommitDate = new Date(commits[commitCount - 1].created_at);
        const lastCommitDate = new Date(commits[0].created_at);
        const timeDiffInDays = Math.abs(lastCommitDate - firstCommitDate) / (1000 * 60 * 60 * 24);

        let commitFrequency;

        if (timeDiffInDays === 0 || isNaN(timeDiffInDays)) {
            commitFrequency = 0;
        } else {
            commitFrequency = Math.round(commitCount / timeDiffInDays);
        }

        return {
            'commitCount': commitCount,
            'commitFrequencyByDay': commitFrequency,
        };

    } catch (error) {
        console.error(error);
        throw new Error(error);
    }
}

module.exports = {getLanguagesForUser, getUserCommitCounts, getReportedIssuesCount, hasContributionsInExternalProjects, getQuantityProjects, calculateAveragePopularity, getMetricsByRepo, checkGitLabUserExists, checkGitLabRepoExists};
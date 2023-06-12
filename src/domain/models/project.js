const typesProject = {
    name: 'string',
    description: 'string',
    type: 'string',
    urlRepository: 'string',
    urlRepositoryGitlab: 'string',
    complexity: 'string',
    amountParticipants: 'number',
    leader: 'string',
    participants: 'object',
    supports: 'object',
    posts: 'object',
    startDate: 'string',
    endDate: 'string',
    technologies: 'object',
    status: 'string',
    requestSupport: 'boolean',
    validateSystem: 'boolean',
}

class Project{
    name = "";
    description = "";
    type = "Web";
    urlRepository = "";
    urlRepositoryGitlab = "";
    complexity = "Trainee";
    amountParticipants = 1;
    leader = "";
    participants = [];
    supports = [];
    posts = [];
    startDate = new Date();
    endDate;
    technologies = [];
    status = "To Do";
    requestSupport = false;
    validateSystem = true;

    constructor(projectData) {
        for(let key in projectData){
            if(this.hasOwnProperty(key)){
                if(typeof projectData[key] === typesProject[key])
                    this[key] = projectData[key];
                else throw new Error("Invalid type for property " + key)
            }
        }
    }

    validateEssentialData(){
        if(!this.name || !this.description || !this.type || !this.complexity || !this.amountParticipants) return false;
        return true;
    }
    
    validateFilters(filters){
        let valid = true;
        for(let key in filters){
            if(!this.hasOwnProperty(key)){
                valid = false;
                break;
            }
        }
        return valid;
    }
}

module.exports = Project;
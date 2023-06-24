const typesPost = {
    title: 'string',
    body: 'string',
    date: 'string',
    author: 'string',
    messages: 'object',
    project: 'string',
    technologies: 'object',
    experience: 'object',
}

class Post{
    title = "";
    body = "";
    date = new Date()
    author;
    messages = [];
    technologies = [];
    project;
    experience = [];

    constructor(postData) {
        for(let key in postData){
            if(this.hasOwnProperty(key)){
                if(typeof postData[key] === typesPost[key])
                    this[key] = postData[key];
                else throw new Error("Invalid type for property " + key)
            }
        }
    }

    validateEssentialData(){
        if(!this.title || !this.body || !this.date) return false;
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

module.exports = Post;
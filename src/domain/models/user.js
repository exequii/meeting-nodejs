const typesUser = {
  name: 'string',
  email: 'string',
  password: 'string',
  role: 'string',
  preferences: 'object',
  disinterest: 'object',
  score: 'number',
  githubUsername: 'string',
  gitlabUsername: 'string',
  projects: 'object',
  posts: 'object',
  supporting: 'object',
  level: 'string',
  mailEnabled: 'boolean',
  technologies: 'object',
};


class User {
  name = "";
  email = "";
  password = "";
  role = 'Otro';
  preferences = [];
  disinterest = [];
  score = 0;
  githubUsername = '';
  gitlabUsername = '';
  projects = [];
  posts = [];
  supporting = [];
  level='Junior';
  mailEnabled = true;
  technologies = [];

  constructor(userData) {
    for(let key in userData){
      if(this.hasOwnProperty(key)){
        if(typeof userData[key] === typesUser[key])
          this[key] = userData[key];
        else throw new Error("Invalid type for property " + key)
      }
    }
    this.setLevel();
  }

  setLevel(){
    if(this.score < 100) this.level = 'Trainee';
    if(this.score > 100 && this.score < 200) this.level = 'Junior';
    else if(this.score > 200 && this.score < 400) this.level = 'Semi Senior';
    else if(this.score > 400) this.level = 'Senior';
  }

  validateEssentialData(){
    if(!this.name || !this.email || !this.password) return false;
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

module.exports = User;





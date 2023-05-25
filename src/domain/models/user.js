class User {
  name = "";
  email = "";
  password = "";
  role = 'Otro';
  preferences = [];
  disinterest = [];
  score = 0;
  githubUsername = '';
  projects = [];
  posts = [];
  supporting = [];

  constructor(userData) {
    for(let key in userData){
      if(this.hasOwnProperty(key)){
        this[key] = userData[key];
      }
    }
  }

  validateEssentialData(){
    if(!this.name || !this.email || !this.password) return false;
    return true;
  }

  validateFilters(filters){
    const validUser = new User();
    let valid = true;
    for(let key in filters){
      if(!validUser.hasOwnProperty(key)){
        valid = false;
        break;
      }
    }
    return valid;
  }
  
}

module.exports = User;





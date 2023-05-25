class User {
  id;
  name;
  email;
  password;
  role;
  preferences;
  disinterest;
  score;
  githubUsername;
  projects;
  posts;
  supporting;

  constructor(id,name, email, password, role, preferences, disinterest, score, githubUsername, projects, posts, supporting) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.role = role || 'Otro';
    this.preferences = preferences || [];
    this.disinterest = disinterest || [];
    this.score = score || 0;
    this.githubUsername = githubUsername || '';
    this.projects = projects || [];
    this.posts = posts || [];
    this.supporting = supporting || [];
  }

  validate(user){
    
  }

  validateFilters(filters){

  }
  
}

module.exports = User;




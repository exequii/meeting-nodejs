const mongoose = require('mongoose');
const { Schema } = mongoose;

const technologies = ['Angular','React','Vue','Django','Express','Laravel','Spring','Nodejs','Javascript','C#.NET','Java','Php','Python','Ruby','Swift','Typescript',
  'C++','C','C#','Go','Kotlin','Objective-c','Scala','SQL','Sql','Dart','Html','Css',
  'Sass','Less','Bash','Powershell','R','Rust','Swift','Visual Basic','Svelte'];

const levels = ['Trainee','Junior','Semi Senior','Senior'];

const roles = ['FullStack','Frontend','Backend','Diseñador/a','QA','Analista Funcional','Otro'];

const technologySchema = new mongoose.Schema({
  nameTechnologie:{
    type: String,
    enum: technologies,
  },
  experience:{
    type: String,
    enum: levels
  }
}, { _id: false });

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    minLength: [3, 'Name must be at least 3 characters long'],
    maxLength: [20, 'Name must be at most 20 characters long'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true, //el unique no es una validacion
    match: [/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/, 'Email is not valid']
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: roles,
    default: 'Otro'
  },
  preferences: {
    type: [String],
    required: false,
    enum: technologies,
    default: []
  },
  disinterest: {
    type: [String],
    required: false,
    enum: technologies,
    default: []
  },
  score: {
    type: Number,
    required: false,
    default: 0,
  },
  level: {
    type: String,
    enum: levels,
    default: 'Junior'
  },
  mailEnabled: {
    type: Boolean,
    required: false,
    default: true
  },
  githubUsername: {
    type: String,
    required: false,
    default:''
  },
  gitlabUsername: {
    type: String,
    required: false,
    default:''
  },
  projects: [{
    type: Schema.Types.ObjectId,
    ref: 'Project',
    required: false,
    default: []
  }],
  posts: [{
    type: Schema.Types.ObjectId,
    ref: 'Post',
    required: false,
    default: []
  }],
  supporting: [{
    type: Schema.Types.ObjectId,
    ref: 'Project',
    required: false,
    default: []
  }],
  technologies: {
    type: [technologySchema],
    validate: {
      validator: function(arr) {
        return arr.length <= 3;
      },
      message: 'El campo "technologies" no puede contener más de 3 elementos.'
    },
    default: []
  },
    urlImage: {
      type: String,
      required: false,
      default: 'https://bootdey.com/img/Content/avatar/avatar5.png'
    }
});

module.exports = mongoose.model('User', userSchema);

/*
  {
    "name": "Ezequiel",
    "email": "eze@eze.com",
    "password": "asdasd98",
    "role": "user",
    "preferences": ["javascript","C#.NET","java","php","python","ruby","swift","typescript"],
    "score": 0,
  }
*/

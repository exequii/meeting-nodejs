const mongoose = require('mongoose');
const { Schema } = mongoose;

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
    //minLength: [8, 'Password must be at least 8 characters long'], SACO LAS VALIDACIONES DE PASSWORD YA QUE GUARDAREMOS SOLO EL HASH
    //match: [/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, 'Password must contain at least one uppercase letter, one lowercase letter and one number']
  },
  role: {
    type: String,
    enum: ['user','recruiter','admin'],
    default: 'user'
  },
  githubUsername: {
    type: String,
    required: false,
    default: ''
  },
});

module.exports = mongoose.model('User', userSchema);
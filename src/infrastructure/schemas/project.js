const mongoose = require('mongoose');
const { Schema } = mongoose;

const projectSchema = new Schema({
    name: {
        type: String,
        required: true,
        minLength: [3, 'The name must be at least 3 characters long'],
        maxLength: [100, 'The name must be at most 100 characters long'],
    },
    description: {
        type: String,
        required: true,
        minLength: [10, 'The description must be at least 10 characters long'],
        maxLength: [500, 'The description must be at most 500 characters long'],
    },
    type: {
        type: String,
        enum: ['Web','Mobile','Videogames','Desktop'],
        default: 'Web',
        required: true
    },
    urlRepository: {
        type: String,
        default: ""
    },
    complexity: {
        type: String,
        enum: ['Trainee','Junior','Semisenior','Senior'],
        default: 'Trainee',
        required: true
    },
    amountParticipants: {
        type: Number,
        required: true,
        min: [1, 'The amount of participants must be at least 1'],
        max: [10, 'The amount of participants must be at most 10'],
    },
    leader: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: false,
    },
    participants : [{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: false,
        default: []
    }],
    supports: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: false,
        default: []
    }],
    requests: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: false,
        default: []
    }],
    posts : [{
        type: Schema.Types.ObjectId,
        ref: 'Post',
        required: false,
        default: []
    }],
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: false
    },
    technologies: {
        type: [String],
        required: false,
        enum: ['Angular','React','Vue','Django','Express','Laravel','Spring','Nodejs','Javascript','C#.NET','Java','Php','Python','Ruby','Swift','Typescript',
        'C++','C','C#','Go','Kotlin','Objective-c','Scala','SQL','Dart','Html','Css',
        'Sass','Less','Bash','Powershell','R','Rust','Swift','Visual Basic','Svelte'],
        default: []
    },
    status: {
        type: String,
        enum: ['To Do','In Progress','Done','Cancel'],
        default: 'To Do',
        required: true,
    },
    requestSupport: {
        type: Boolean,
        default: false,
    },
    validateSystem: {
        type: Boolean,
        default: true,
    },
});

module.exports = mongoose.model('Project', projectSchema);


/*

{
    "name": "Project 2",
    "description": "Description 2",
    "startDate": "2023-04-17T15:00:32.172Z",
    "type": "web",
    "status": "To Do",
    "complexity": "trainee",
    "amountParticipants": 5,
    "leader": "5f9f1b9b9c9d440000a1b0f1",
    "participants": [
        "645e405b228bdffa4aa98a1c"
    ],
    "lenguages": [
        "javascript",
        "typescript"
    ],
    "technologies": [
        "angular",
        "react"
    ]
}

*/
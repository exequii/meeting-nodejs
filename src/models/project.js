const mongoose = require('mongoose');
const { Schema } = mongoose;

const projectSchema = new Schema({
    name: {
        type: String,
        required: true,
        minLength: [3, 'The name must be at least 3 characters long'],
        maxLength: [20, 'The name must be at most 20 characters long'],
    },
    description: {
        type: String,
        required: true,
        minLength: [10, 'The description must be at least 10 characters long'],
        maxLength: [100, 'The description must be at most 100 characters long'],
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
        required: true,
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
    }
});

module.exports = mongoose.model('Project', projectSchema);
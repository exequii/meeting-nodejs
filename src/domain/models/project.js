// const mongoose = require('mongoose');
// const { Schema } = mongoose;

// const projectSchema = new Schema({
//     name: {
//         type: String,
//         required: true,
//         minLength: [3, 'The name must be at least 3 characters long'],
//         maxLength: [20, 'The name must be at most 20 characters long'],
//     },
//     description: {
//         type: String,
//         required: true,
//         minLength: [10, 'The description must be at least 10 characters long'],
//         maxLength: [100, 'The description must be at most 100 characters long'],
//     },
//     type: {
//         type: String,
//         enum: ['Web','Mobile','Videogames','Desktop'],
//         default: 'Web',
//         required: true
//     },
//     urlRepository: {
//         type: String,
//         default: ""
//     },
//     complexity: {
//         type: String,
//         enum: ['Trainee','Junior','Semisenior','Senior'],
//         default: 'Trainee',
//         required: true
//     },
//     amountParticipants: {
//         type: Number,
//         required: true,
//         min: [1, 'The amount of participants must be at least 1'],
//         max: [10, 'The amount of participants must be at most 10'],
//     },
//     leader: {
//         type: Schema.Types.ObjectId,
//         ref: 'User',
//         required: true,
//     },
//     participants : [{
//         type: Schema.Types.ObjectId,
//         ref: 'User',
//         required: false,
//         default: []
//     }],
//     supports: [{
//         type: Schema.Types.ObjectId,
//         ref: 'User',
//         required: false,
//         default: []
//     }],
//     posts : [{
//         type: Schema.Types.ObjectId,
//         ref: 'Post',
//         required: false,
//         default: []
//     }],
//     startDate: {
//         type: Date,
//         required: true
//     },
//     endDate: {
//         type: Date,
//         required: false
//     },
//     technologies: {
//         type: [String],
//         required: false,
//         enum: ['Angular','React','Vue','Django','Express','Laravel','Spring','Nodejs','Javascript','C#.NET','Java','Php','Python','Ruby','Swift','Typescript',
//         'C++','C','C#','Go','Kotlin','Objective-c','Scala','SQL','Dart','Html','Css',
//         'Sass','Less','Bash','Powershell','R','Rust','Swift','Visual Basic','Svelte'],
//         default: []
//     },
//     status: {
//         type: String,
//         enum: ['To Do','In Progress','Done','Cancel'],
//         default: 'To Do',
//         required: true,
//     },
//     requestSupport: {
//         type: Boolean,
//         default: false,
//     }
// });

// module.exports = mongoose.model('Project', projectSchema);


class Project{
    id;
    name;
    description;
    type;
    urlRepository;
    complexity;
    amountParticipants;
    leader;
    participants;
    supports;
    posts;
    startDate;
    endDate;
    technologies;
    status;
    requestSupport;

    constructor(id,name, description, type, urlRepository, complexity, amountParticipants, leader, participants, supports, posts, startDate, endDate, technologies, status, requestSupport) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.type = type || 'Web';
        this.urlRepository = urlRepository || "";
        this.complexity = complexity || 'Trainee';
        this.amountParticipants = amountParticipants || 1;
        this.leader = leader;
        this.participants = participants || [];
        this.supports = supports || [];
        this.posts = posts || [];
        this.startDate = startDate || new Date();
        this.endDate = endDate;
        this.technologies = technologies || [];
        this.status = status || 'To Do';
        this.requestSupport = requestSupport || false;
    }
}

module.exports = Project;
// const mongoose = require('mongoose');
// const { Schema } = mongoose;

// const postSchema = new Schema({
//     title: {
//         type: String,
//         required: [true, 'Title is required'],
//         minLength: [3, 'Name must be at least 3 characters long'],
//         maxLength: [30, 'Name must be at most 30 characters long'],
//     },
//     body: {
//         type: String,
//         required: [true, 'Body is required'],
//         minLength: [5, 'Name must be at least 5 characters long'],
//         maxLength: [300, 'Name must be at most 300 characters long'],
//     },
//     technologies: {
//         type: [String],
//         required: false,
//         enum: ['Angular','React','Vue','Django','Express','Laravel','Spring','Nodejs','Javascript','C#.NET','Java','Php','Python','Ruby','Swift','Typescript',
//         'C++','C','C#','Go','Kotlin','Objective-c','Scala','SQL','Dart','Html','Css',
//         'Sass','Less','Bash','Powershell','R','Rust','Swift','Visual Basic','Svelte'],
//         deafult: []
//     },
//     date: {
//         type: Date,
//         required: true,
//         default: new Date(),
//     },
//     author: {
//         type: Schema.Types.ObjectId,
//         ref: 'User',
//         required: true,
//     },
//     messages: [{
//         type: Schema.Types.ObjectId,
//         ref: 'Message',
//         required: false,
//         default: []
//     }],
//     project : {
//         type: Schema.Types.ObjectId,
//         ref: 'Project',
//         required: false,
//     }
// });

// module.exports = mongoose.model('Post', postSchema);

class Post {
    id;
    title;
    body;
    technologies;
    date;
    author;
    messages;
    project;
    

    constructor(id, title, body, technologies, date, author, messages, project) {
        this.id = id;
        this.title = title;
        this.body = body;
        this.technologies = technologies || [];
        this.date = date || new Date();
        this.author = author;
        this.messages = messages || [];
        this.project = project;
    }
}

module.exports = Post;
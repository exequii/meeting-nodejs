const mongoose = require('mongoose');
const { Schema } = mongoose;

const postSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        minLength: [3, 'Name must be at least 3 characters long'],
        maxLength: [100, 'Name must be at most 100 characters long'],
    },
    body: {
        type: String,
        required: [true, 'Body is required'],
        minLength: [5, 'Name must be at least 5 characters long'],
        maxLength: [1000, 'Name must be at most 500 characters long'],
    },
    technologies: {
        type: [String],
        required: false,
        enum: ['Angular','React','Vue','Django','Express','Laravel','Spring','Nodejs','Javascript','C#.NET','Java','Php','Python','Ruby','Swift','Typescript',
        'C++','C','C#','Go','Kotlin','Objective-c','Scala','SQL','Dart','Html','Css',
        'Sass','Less','Bash','Powershell','R','Rust','Swift','Visual Basic','Svelte'],
        deafult: [],
    },
    date: {
        type: Date,
        required: true,
        default: new Date(),
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: false,
    },
    messages: [{
        type: Schema.Types.ObjectId,
        ref: 'Message',
        required: false,
        default: [],
    }],
    project : {
        type: Schema.Types.ObjectId,
        ref: 'Project',
        required: false,
    },
    experience : {
        type: String,
        required: true,
        default: 'Trainee'
    },
});

module.exports = mongoose.model('Post', postSchema);

/*
    {
        "title": "Post 1",
        "body": "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
        "type": "informative",
        "date": "2021-05-05T00:00:00.000Z",
        "authorId": "60a9b0b9e1b3a1b4b8b0b8b0",
        "messages": []
    }
*/


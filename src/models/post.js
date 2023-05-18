const mongoose = require('mongoose');
const { Schema } = mongoose;

const postSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        minLength: [3, 'Name must be at least 3 characters long'],
        maxLength: [30, 'Name must be at most 30 characters long'],
    },
    body: {
        type: String,
        required: [true, 'Body is required'],
        minLength: [5, 'Name must be at least 5 characters long'],
        maxLength: [300, 'Name must be at most 300 characters long'],
    },
    type:{
        type: String,
        enum: ['informative','collaborative'],
        default: 'informative',
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: new Date(),
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    messages: [{
        type: Schema.Types.ObjectId,
        ref: 'Message',
        required: false,
        default: []
    }],
    project : {
        type: Schema.Types.ObjectId,
        ref: 'Project',
        required: false,
    }
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


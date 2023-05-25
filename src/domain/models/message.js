// const mongoose = require('mongoose');
// const { Schema } = mongoose;

// const messageSchema = new Schema({
//     message: {
//         type: String,
//         required: [true, 'Message is required'],
//         minLength: [0, 'Name must be at least 3 characters long'],
//         maxLength: [300, 'Name must be at most 300 characters long'],
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
//     post: {
//         type: Schema.Types.ObjectId,
//         ref: 'Post',
//         required: true,
//     },
// });

// module.exports = mongoose.model('Message', messageSchema);

class Message {
    id;
    message;
    date;
    author;
    post;

    constructor(id, message, date, author, post) {
        this.id = id;
        this.message = message;
        this.date = date || new Date();
        this.author = author;
        this.post = post;
    }
}

module.exports = Message;
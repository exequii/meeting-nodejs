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
        enum: ['web','mobile','videogames','desktop'],
        default: 'web',
        required: true
    },
    complexity: {
        type: String,
        enum: ['trainee','junior','semisenior','senior'],
        default: 'trainee',
        required: true
    },
    amountParticipants: {
        type: Number,
        required: true,
        min: [1, 'The amount of participants must be at least 1'],
        max: [10, 'The amount of participants must be at most 10'],
    },
    leaderId: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: false
    },
    participantsId: {
        type: [String],
        required: false
    },
    languages: {
        type: [String],
        required: false,
        enum: ['javascript','C#.NET','java','php','python','ruby','swift','typescript',
        'c++','c','c#','go','kotlin','objective-c','scala','sql','dart','html','css',
        'sass','less','bash','powershell','r','rust','swift','typescript','visual basic'],
    },
    technologies: {
        type: [String],
        required: false,
        enum: ['angular','react','vue','django','express','laravel','spring','nodejs'],
    },
    status: {
        type: String,
        enum: ['to do','in progress','done','cancel'],
        default: 'to do',
        required: true,
    },
    requestSupport: {
        type: Boolean,
        default: false,
    }
});

module.exports = mongoose.model('Project', projectSchema);
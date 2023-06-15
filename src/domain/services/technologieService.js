const { technologies,technologiesLength } = require('../models/technologies');
const { questionsOfTechnologies } = require('../models/questions');

const getTechnologieForQuestions = (user) => {
    var technologie;
    do{
        technologie = technologies[Math.floor(Math.random() * technologiesLength)];
    }while(user.preferences.includes(technologie) || user.disinterest.includes(technologie))
    return technologie;
}

const formatQuestionOfTechnologies = (technologie) => {
    var question = questionsOfTechnologies[Math.floor(Math.random() * questionsOfTechnologies.length)];
    return question.replace("{{technologie}}",technologie);
}

module.exports = { getTechnologieForQuestions, formatQuestionOfTechnologies }
const bcrypt = require('bcrypt');
const { technologies,technologiesLength } = require('../models/technologies');
const { questionsOfTechnologies } = require('../models/questions');

const generateHash = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    return passwordHash;
};

const comparePasswordWithHash = async (password, passwordHash) => {
    const validPassword = await bcrypt.compare(password, passwordHash);
    return validPassword;
};

const getSkipPage = (pagination) => {
    const resultsPerPage = 10;
    const skipPage = (parseInt(pagination) * resultsPerPage) - resultsPerPage ;
    return skipPage;
};


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




module.exports = { 
    generateHash,
    comparePasswordWithHash,
    getSkipPage,
    getTechnologieForQuestions,
    formatQuestionOfTechnologies,
};


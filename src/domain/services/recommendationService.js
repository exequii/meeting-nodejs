const { technologies} = require('../models/technologies');
const { questionsOfTechnologies , questionsOfPosts, questionsOfProyects } = require('../models/questions');
const { getTechnologieForQuestions,formatQuestionOfTechnologies } = require('../utils/utilities');

const getRecommendation = async (user) => {
    try{
        var type = "Preferences";
        var technologie = getTechnologieForQuestions(technologies,user);
        var question = formatQuestionOfTechnologies(questionsOfTechnologies,technologie);
        return {type, question, technologie};
    }catch(error){
        throw new Error(error);
    }
}


module.exports = { getRecommendation }
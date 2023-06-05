const { technologies} = require('../models/technologies');
const { questionsOfTechnologies , questionsOfPosts, questionsOfProyects } = require('../models/questions');
const { getTechnologieForQuestions,formatQuestionOfTechnologies } = require('../utils/utilities');
const projectService = require('../../domain/services/projectService');
const postService = require('../../domain/services/postService');

const getRecommendation = async (user) => {
    try{
        var type = getTypeRecommendation(user);
        var result;
        switch(type){
            case "recommendation":
                result = getQuestionOfTechnologies(user);
                break;
            case "proyect":
                result = getProyectsRecommendation(user);
                break;
            case "post":
                result = getPostsRecommendation(user);
                break;
        }
        return {type, result};
    }catch(error){
        throw new Error(error);
    }
}

const getTypeRecommendation = async (user) => {
    try{
        var randomNumber = Math.floor(Math.random() * 30);
        if(randomNumber <= 10 && (user.preferences.length + user.desinterest.length != technologies.length)){ //Pregunta de Tecnologias
            return "recommendation"
        }
        if(randomNumber <= 20 && user.preferences.length > 2){ //Recomendacion Proyectos
            return "proyect"
        }
        return "post" //Recomendacion Posts
    }catch(error){
        throw new Error(error);
    }
}

const getQuestionOfTechnologies = async (user) => {
    try{
        var technologie = getTechnologieForQuestions(technologies,user);
        var question = formatQuestionOfTechnologies(questionsOfTechnologies,technologie);
        return {technologie, question};
    }catch(error){
        throw new Error(error);
    }
}

const getProyectsRecommendation = async (user) => {
    try{
        var technologie = user.preferences[Math.floor(Math.random() * user.preferences.length)];
        var question = questionsOfProyects[Math.floor(Math.random() * questionsOfProyects.length)];
        var proyects = await projectService.getProjectsByFilters({technologies: technologie}, {limit: 3});
        return {technologie, question, proyects};
    }catch(error){
        throw new Error(error);
    }
}

const getPostsRecommendation = async (user) => {
    try{
        var technologie = user.preferences[Math.floor(Math.random() * user.preferences.length)] || technologies[Math.floor(Math.random() * technologies.length)];
        var question = questionsOfPosts[Math.floor(Math.random() * questionsOfPosts.length)];
        var posts = await postService.getPostsByFilters({technologies: technologie}, {limit: 3});
        return {technologie, question, posts};
    }catch(error){
        throw new Error(error);
    }
}


module.exports = { getRecommendation }
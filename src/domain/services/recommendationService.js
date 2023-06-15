const { technologies, technologiesLength } = require('../models/technologies');
const { questionsOfPosts, questionsOfProyects } = require('../models/questions');
const { getTechnologieForQuestions,formatQuestionOfTechnologies } = require('../services/technologieService');
const projectService = require('../../domain/services/projectService');
const postService = require('../../domain/services/postService');

const getRecommendation = async (user) => {
    try{
        do{
            var type = getTypeRecommendation(user);
            var result;
            switch(type){
                case "recommendation":
                    result = getQuestionOfTechnologies(user);
                    break;
                case "project":
                    result = await getProyectsRecommendation(user);
                    break;
                case "post":
                    result = await getPostsRecommendation(user);
                    break;
            }
        }while(result == null)
        return {type, result};
    }catch(error){
        throw new Error(error);
    }
}

const getTypeRecommendation = (user) => {
    try{
        var randomNumber = Math.floor(Math.random() * 30);
        var summatory = user.preferences.length + user.disinterest.length;
        if(randomNumber <= 10 && (summatory != technologiesLength)){ //Pregunta de Tecnologias
            return "recommendation"
        }
        if(randomNumber <= 20 && user.preferences.length > 2){ //Recomendacion Proyectos
            return "project"
        }
        return "post" //Recomendacion Posts
    }catch(error){
        throw new Error(error);
    }
}

const getQuestionOfTechnologies = (user) => {
    try{
        var technologie = getTechnologieForQuestions(user);
        var question = formatQuestionOfTechnologies(technologie);
        return {technologie, question};
    }catch(error){
        throw new Error(error);
    }
}

const getProyectsRecommendation = async (user) => {
    try{
        var technologie = user.preferences[Math.floor(Math.random() * user.preferences.length)];
        var question = questionsOfProyects[Math.floor(Math.random() * questionsOfProyects.length)];
        var projects = await projectService.getProjectsByFilters({technologies: technologie}, {limit: 1});
        if(projects == null || projects.results.length < 1) return null
        return {technologie, question, results: projects.results};
    }catch(error){
        throw new Error(error);
    }
}

const getPostsRecommendation = async (user) => {
    try{
        var technologie = user.preferences[Math.floor(Math.random() * user.preferences.length)] || technologies[Math.floor(Math.random() * technologies.length)];
        var question = questionsOfPosts[Math.floor(Math.random() * questionsOfPosts.length)];
        var posts = await postService.getPostsByFilters({technologies: technologie}, {limit: 1});
        if(posts == null || posts.results.length < 1) return null
        return {technologie, question, results: posts.results};
    }catch(error){
        throw new Error(error);
    }
}


module.exports = { getRecommendation }
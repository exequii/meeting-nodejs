const Post = require('../models/post');
const PostRepository = require('../../infrastructure/persistence/postRepository');
const userService = require('./userService');

const getPostTechnologiesExperience = async (post) => {
    const technologies = post.technologies
    const user = await userService.getUserById(post.author);
    const languages = await userService.getAllTechnologies(user);

    if (technologies.length > 0) {
        post.experience = technologies.map((tech) => {
            const foundTech = languages.find((language) => language.technology === tech);
            const quantity = foundTech ? foundTech.quantity : 0;
            return {nameTechnologie: tech, experience: userService.getExperience(quantity)};
        });
    }
    return post;
}

const createPost = async (postData) => {
    try{
        let post = new Post(postData);
        if (!post.validateEssentialData()) throw new Error("Invalid post data");
        post = await getPostTechnologiesExperience(post);
        return await PostRepository.create(post);
    }catch(error){
        throw new Error(error);
    }
}

const getPostsByFilters = async(filters,pagination) => {
    try {
        const posts = await PostRepository.getByFilters(filters,pagination);
        if(!posts || posts.length == 0) return null;
        return posts;
    } catch (error) {
        throw new Error(error);
    }
}

const getAllPosts = async (pagination) => {
    try{
        const posts = await PostRepository.getAll(pagination);
        if(!posts || posts.length == 0) return null;
        return posts;
    }catch(error){
        throw new Error(error);
    }
}

const getPostById = async (id) => {
    try{
        const post = await PostRepository.getById(id);
        if(!post) return null;
        return post;
    }catch(error){
        throw new Error(error);
    }
}

const updatePostById = async (id, newData) => {
    try{
        const postUpdated = await PostRepository.updateById(id,newData);
        if(!postUpdated) return null;
        return postUpdated;
    }catch(error){
        throw new Error(error);
    }
}

const deletePostById = async (id) => {
    try{
        const postDeleted = await PostRepository.deleteById(id);
        if(!postDeleted) return null;
        return postDeleted;
    }catch(error){
        throw new Error(error);
    }
}

module.exports = {
    createPost,
    getPostsByFilters,
    getAllPosts,
    getPostById,
    updatePostById,
    deletePostById
};
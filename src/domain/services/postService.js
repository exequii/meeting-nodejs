const Post = require('../models/post');
const PostRepository = require('../../infrastructure/persistence/postRepository');
const { getSkipPage } = require('../utils/utilities');

const createPost = async (postData) => {
    try{
        let post = new Post(postData);
        if (!post.validateEssentialData()) throw new Error("Invalid post data");
        return await PostRepository.create(post);
    }catch(error){
        throw new Error(error);
    }
}

const getPostsByFilters = async(filters,pagination) => {
    try {
        let skipPage = 0;
        if(pagination) {
            skipPage = getSkipPage(pagination);
        }
        const posts = await PostRepository.getByFilters(filters,skipPage);
        if(!posts || posts.length == 0) return null;
        return posts;
    } catch (error) {
        throw new Error(error);
    }
}

const getAllPosts = async (pagination) => {
    try{
        let skipPage = 0;
        if(pagination) {
            skipPage = getSkipPage(pagination);
        }
        const posts = await PostRepository.getAll(skipPage);
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
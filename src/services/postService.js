const Post = require('../models/post');
const { createPostAndUpdateRelations } = require('../utils/utilities');

const createPost = async (postData) => {
    try{
        let post = new Post(postData);
        post = await createPostAndUpdateRelations(post);
        return post;
    }catch(error){
        throw new Error(error);
    }
}

const getPostsByFilters = async(body) => {
    try {
        const posts = await Post.find(body).populate({path: 'author', select: '-password'});
        if(!posts || posts.length == 0) return null;
        return posts;
    } catch (error) {
        throw new Error(error);
    }
}

const getAllPosts = async () => {
    try{
        const posts = await Post.find().populate({path: 'author', select: '-password'});
        if(!posts || posts.length == 0) return null;
        return posts;
    }catch(error){
        throw new Error(error);
    }
}

const getPostById = async (id) => {
    try{
        const post = await Post.findById(id).populate({path:'author', select: '-password'}).populate({path: 'messages', populate: { path: 'author', select: '-password' }});
        if(!post) return null;
        return post;
    }catch(error){
        throw new Error(error);
    }
}

const updatePostById = async (id, newData) => {
    try{
        const postUpdated = await Post.findByIdAndUpdate(id,newData, { new: true });
        if(!postUpdated) return null;
        return postUpdated;
    }catch(error){
        throw new Error(error);
    }
}

const deletePostById = async (id) => {
    try{
        const postDeleted = await Post.findByIdAndDelete(id);
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
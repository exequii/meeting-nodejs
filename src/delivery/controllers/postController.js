const postService = require('../../domain/services/postService');

const createPost = async (req, res) => {
    try{
        const post = await postService.createPost(req.body);
        res.status(201).json(post);
    }catch(error){
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}

const getPostsByFilters = async (req, res) => {
    try{
        const posts = await postService.getPostsByFilters(req.body);
        if(!posts){
            return res.status(204).json({results:[], message: 'Posts not found' });
        }
        res.status(200).json(posts);
    }catch(error){
        res.status(500).json({ message: 'Internal Server Error' ,error: error.message});
    }
}

const getAllPosts = async (req, res) => {
    try{
        const posts = await postService.getAllPosts();
        if(!posts) {
            return res.status(204).json({results:[], message: 'Posts not found' })
        }
        res.status(200).json(posts);
    }catch(error){
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}

const getPostById = async (req, res) => {
    try{
        const post = await postService.getPostById(req.params.id);
        if(!post) {
            return res.status(204).json({ message: 'Post not found' })
        }
        res.status(200).json(post);
    }catch(error){
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}

const updatePostById = async (req, res) => {
    try{
        const post = await postService.updatePostById(req.params.id, req.body);
        if(!post) {
            return res.status(204).json({ message: 'Post not found' })
        }
        res.status(200).json(post);
    }catch(error){
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}

const deletePostById = async (req, res) => {
    try{
        const post = await postService.deletePostById(req.params.id);
        if(!post) {
            return res.status(204).json({ message: 'Post not found' })
        }
        res.status(200).json(post);
    }catch(error){
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}

module.exports = {
    createPost,
    getPostsByFilters,
    getAllPosts,
    getPostById,
    updatePostById,
    deletePostById
}
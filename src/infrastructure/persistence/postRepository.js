const Post = require('../schemas/post');
const { createPostAndUpdateRelations, getLength } = require('../utils/utilities');

const create = async (postData) => {
    try{
        let post = new Post(postData);
        console.log(post);
        return await createPostAndUpdateRelations(post);
    }catch(error){
        throw new Error(error);
    }
}

const getByFilters = async(filters, skipPage) => {
    try {
        let posts = await Post.find(filters).populate({path: 'author', select: '-password'}).skip(skipPage).limit(10).cursor().toArray();
        posts = await getLength(posts);
        if(!posts || posts.length == 0) return null;
        return posts;
    } catch (error) {
        throw new Error(error);
    }
}

const getAll = async (skipPage) => {
    try{
        let posts = await Post.find().populate({path: 'author', select: '-password'}).skip(skipPage).limit(10).cursor().toArray();
        posts = await getLength(posts);
        if(!posts || posts.length == 0) return null;
        return posts;
    }catch(error){
        throw new Error(error);
    }
}

const getById = async (id) => {
    try{
        const post = await Post.findById(id).populate({path:'author', select: '-password'}).populate({path: 'messages', populate: { path: 'author', select: '-password' }});
        if(!post) return null;
        return post;
    }catch(error){
        throw new Error(error);
    }
}


const updateById = async (id, newData) => {
    try{
        const postUpdated = await Post.findByIdAndUpdate(id,newData, { new: true });
        if(!postUpdated) return null;
        return postUpdated;
    }catch(error){
        throw new Error(error);
    }
}

const deleteById = async (id) => {
    try{
        const postDeleted = await Post.findByIdAndDelete(id);
        if(!postDeleted) return null;
        return postDeleted;
    }catch(error){
        throw new Error(error);
    }
}

module.exports = {create,getByFilters, getAll, getById, updateById, deleteById};
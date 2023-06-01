const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const {createPost,getPostsByFilters, getAllPosts, getPostById, updatePostById, deletePostById } = require('../controllers/postController');

router.post('/', authMiddleware, createPost);
router.post('/filter', getPostsByFilters);
router.get('/', getAllPosts);
router.get('/:id', getPostById);
router.put('/:id', authMiddleware, updatePostById);
router.delete('/:id', authMiddleware, deletePostById);



module.exports = router;
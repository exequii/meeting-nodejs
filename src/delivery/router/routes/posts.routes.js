const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middlewares/authMiddleware');
const {createPost,getPostsByFilters, getAllPosts, getPostById, updatePostById, deletePostById, sendEmailSuggest } = require('../../controllers/postController');

router.post('/', authMiddleware, createPost);
router.post('/filter', authMiddleware, getPostsByFilters);
router.post('/suggest', authMiddleware, sendEmailSuggest);
router.get('/', authMiddleware, getAllPosts);
router.get('/:id', authMiddleware, getPostById);
router.put('/:id', authMiddleware, updatePostById);
router.delete('/:id', authMiddleware, deletePostById);



module.exports = router;
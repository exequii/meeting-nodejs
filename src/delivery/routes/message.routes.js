const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const {createMessage,getMessagesByFilters, updateMessageById, deleteMessageById } = require('../controllers/messageController');

router.post('/', authMiddleware, createMessage);
router.post('/filter', authMiddleware, getMessagesByFilters);
router.put('/:id', authMiddleware, updateMessageById);
router.delete('/:id', authMiddleware, deleteMessageById);

module.exports = router;
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { createUser, getAllUsers, getUserById, updateUserById, deleteUserById, getUserByCredentials, getUserByFilters, getUsersByRanking, getLanguagesByRepos,getUserMetricsByRepos, sendEmailContact } = require('../controllers/userController');

router.post('/', authMiddleware, createUser);
router.post('/login', authMiddleware ,getUserByCredentials);
router.post('/find' ,authMiddleware, getUserByFilters);
router.post('/contact', authMiddleware, sendEmailContact);
router.get('/', authMiddleware, getAllUsers);
router.get('/:id', authMiddleware, getUserById);
router.get('/ranking/:pagination', authMiddleware, getUsersByRanking);
router.get('/languages/:username', authMiddleware ,getLanguagesByRepos);
router.get('/metrics/:username', authMiddleware , getUserMetricsByRepos);
router.put('/:id', authMiddleware, updateUserById);
router.delete('/:id', authMiddleware, deleteUserById);



module.exports = router;

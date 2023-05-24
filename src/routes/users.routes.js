const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { createUser, getAllUsers, getUserById, updateUserById, deleteUserById, getUserByCredentials, getUserByFilters , getLanguagesByRepos, getUserMetricsByRepos} = require('../controllers/userController');

router.post('/', authMiddleware, createUser);
router.post('/login', authMiddleware ,getUserByCredentials);
router.post('/find' ,authMiddleware, getUserByFilters);
router.get('/', authMiddleware, getAllUsers);
router.get('/:id', authMiddleware, getUserById);
router.put('/:id', authMiddleware, updateUserById);
router.delete('/:id', authMiddleware, deleteUserById);
router.get('/languages/:username', authMiddleware ,getLanguagesByRepos);
router.get('/metrics/:username', authMiddleware , getUserMetricsByRepos);


module.exports = router;
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { createUser, getAllUsers, getUserById, updateUserById, deleteUserById, getUserByCredentials, getUserByFilters, getUsersByRanking, getLanguagesByRepos,getUserMetricsByRepos, verifyCurrentUser } = require('../controllers/userController');

router.post('/', createUser);
router.post('/login', getUserByCredentials);
router.post('/find' , getUserByFilters);
router.get('/ranking/:pagination', getUsersByRanking);
router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.put('/:id', authMiddleware, updateUserById);
router.delete('/:id', authMiddleware, deleteUserById);
router.get('/languages/:username' ,getLanguagesByRepos);
router.get('/metrics/:username' , getUserMetricsByRepos);
router.post('/verify' , verifyCurrentUser);



module.exports = router;

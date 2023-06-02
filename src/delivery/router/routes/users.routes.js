const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middlewares/authMiddleware');
const { createUser, getAllUsers, getUserById, updateUserById, deleteUserById, getUserByCredentials, getUserByFilters, getUsersByRanking, getLanguagesByRepos,getUserMetricsByRepos, sendEmailContact, verifyCurrentUser } = require('../../controllers/userController');

router.post('/', createUser);
router.post('/login',getUserByCredentials);
router.post('/find' , getUserByFilters);
router.post('/contact', authMiddleware, sendEmailContact);
router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.get('/ranking/:pagination', getUsersByRanking);
router.get('/languages/:username',getLanguagesByRepos);
router.get('/metrics/:username', getUserMetricsByRepos);
router.put('/:id', authMiddleware, updateUserById);
router.delete('/:id', authMiddleware, deleteUserById);
router.post('/verify' , verifyCurrentUser);



module.exports = router;

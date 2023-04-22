const express = require('express');
const router = express.Router();
const { createUser, getAllUsers, getUserById, updateUserById, deleteUserById, getUserByCredentials, getUserByFilters } = require('../controllers/userController');

router.post('/', createUser);
router.post('/login' ,getUserByCredentials);
router.post('/find', getUserByFilters);
router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.put('/:id', updateUserById);
router.delete('/:id', deleteUserById);



module.exports = router;
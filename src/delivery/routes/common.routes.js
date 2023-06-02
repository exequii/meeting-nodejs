const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const {getTechnologies} = require('../controllers/commonController');

router.get('/technologies', authMiddleware, getTechnologies);

module.exports = router;
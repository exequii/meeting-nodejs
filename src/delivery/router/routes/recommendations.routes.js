const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middlewares/authMiddleware');
const { getRecommendation } = require('../../controllers/recommendationController');

router.post('/', authMiddleware, getRecommendation);

module.exports = router;
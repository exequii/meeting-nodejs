const express = require('express');
const router = express.Router();
const {getTechnologies} = require('../../controllers/commonController');

router.get('/technologies', getTechnologies);

module.exports = router;
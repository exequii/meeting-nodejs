const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const {createProject,getProjectsByFilters, getAllProjects, getProjectById, updateProjectById, deleteProjectById, getMetricsByRepo } = require('../controllers/projectController');

router.post('/', authMiddleware, createProject);
router.post('/filter', authMiddleware, getProjectsByFilters);
router.get('/', authMiddleware, getAllProjects);
router.get('/:id', authMiddleware, getProjectById);
router.put('/:id', authMiddleware, updateProjectById);
router.delete('/:id', authMiddleware, deleteProjectById);
router.get('/getMetrics/:id', authMiddleware , getMetricsByRepo);



module.exports = router;
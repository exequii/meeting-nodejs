const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const {createProject,getProjectsByFilters, getAllProjects, getProjectById, updateProjectById, deleteProjectById, addProjectToUser, getSuggestedProjects, finishProject , getMetricsByRepo} = require('../controllers/projectController');

router.post('/', authMiddleware, createProject);
router.post('/join', authMiddleware, addProjectToUser)
router.post('/filter', getProjectsByFilters);
router.post('/suggestions', getSuggestedProjects);
router.post('/finish/:id', authMiddleware, finishProject);
router.get('/', getAllProjects);
router.get('/:id', getProjectById);
router.put('/:id', authMiddleware, updateProjectById);
router.delete('/:id', authMiddleware, deleteProjectById);
router.get('/getMetrics/:id' , getMetricsByRepo);



module.exports = router;
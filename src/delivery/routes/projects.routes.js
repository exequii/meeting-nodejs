const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const {createProject,getProjectsByFilters, getAllProjects, getProjectById, updateProjectById, deleteProjectById, addProjectToUser, getSuggestedProjects, finishProject , getMetricsByRepo, sendEmailInvite} = require('../controllers/projectController');

router.post('/', authMiddleware, createProject);
router.post('/join', authMiddleware, addProjectToUser)
router.post('/filter', authMiddleware, getProjectsByFilters);
router.post('/suggestions', authMiddleware, getSuggestedProjects);
router.post('/finish/:id', authMiddleware, finishProject);
router.post('/invite', authMiddleware, sendEmailInvite)
router.get('/:pagination?', authMiddleware, getAllProjects);
router.get('/:id', authMiddleware, getProjectById);
router.put('/:id', authMiddleware, updateProjectById);
router.get('/getMetrics/:id', authMiddleware , getMetricsByRepo);
router.delete('/:id', authMiddleware, deleteProjectById);



module.exports = router;
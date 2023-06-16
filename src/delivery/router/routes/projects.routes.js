const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middlewares/authMiddleware');
const {createProject,getProjectsByFilters, getAllProjects, getProjectById,
    updateProjectById, deleteProjectById, addProjectToUser, getSuggestedProjects,
    finishProject , getMetricsByRepo, sendEmailInvite, updateRequestProject, leaveProject
} = require('../../controllers/projectController');

router.post('/', authMiddleware, createProject);
router.post('/join', authMiddleware, addProjectToUser)
router.post('/filter/:pagination?', getProjectsByFilters);
router.post('/suggestions', getSuggestedProjects);
router.post('/finish/:id', authMiddleware, finishProject);
router.post('/invite', authMiddleware, sendEmailInvite)
router.post('/request/:id', authMiddleware, updateRequestProject)
router.get('/:id', getProjectById);
router.put('/:id', authMiddleware, updateProjectById);
router.put('/leave/:id', authMiddleware, leaveProject);
router.get('/getMetrics/:id' , getMetricsByRepo);
router.delete('/:id', authMiddleware, deleteProjectById);



module.exports = router;
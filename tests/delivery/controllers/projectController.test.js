const {createProject,getProjectsByFilters, getAllProjects, getProjectById, updateProjectById, deleteProjectById } = require('../../../src/delivery/controllers/projectController');
const projectService = require('../../../src/domain/services/projectService');
jest.mock('../../../src/domain/services/projectService');


describe('projectController Test', () => {
    describe('createProject', () => {
        const fakeReq = {
            body: {
                name: 'Project 1',
                description: 'Description 1',
                startDate: new Date,
                type: 'web',
                complexity: 'trainee',
                amountParticipants: 5,
                leaderId: '5f9f1b9b9c9d440000a1b0f1',
                participantsId: ['5f9f1b9b9c9d440000a1b0f1','5f9f1b9b9c9d440000a1b0f1'],
                languages: ['javascript','typescript'],
                technologies: ['angular','react'], 
            },
        }
        const fakeRes = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };

        afterEach(() => {
            jest.clearAllMocks();
        });

        it('should return the project', async () => {
            const fakeProject = fakeReq.body;
            projectService.createProject.mockResolvedValue(fakeProject);
            await createProject(fakeReq, fakeRes);

            expect(fakeRes.json).toHaveBeenCalledWith(fakeProject);
            expect(projectService.createProject).toHaveBeenCalledWith(fakeReq.body);
            expect(fakeRes.status).toHaveBeenCalledWith(201);
        });

        it('should return a 500 if an error occurs', async () => {
            const fakeError = new Error({message:'Error'});
            projectService.createProject.mockRejectedValue(fakeError);
            await createProject(fakeReq, fakeRes);

            expect(fakeRes.json).toHaveBeenCalledWith({ message: 'Internal server error', error: fakeError.message });
            expect(fakeRes.status).toHaveBeenCalledWith(500);
        });
    });

    /********************************************************************* */

    describe('getProjectsByFilters', () => {
        const fakeReq = {
            params: {
                pagination: 1,
            },
            body:{
                complexity: "trainee",
                type: "web",
                languages: ["javascript","typescript"],
            }
        };
        const fakeRes = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };

        // afterEach(() => {
        //     jest.clearAllMocks();
        // });

    //     it('should return projects by filters', async () => {
    //         const fakeProjects = [
    //             {
    //                 name: 'Project 1',
    //                 description: 'Description 1',
    //                 startDate: new Date,
    //                 type: 'web',
    //                 complexity: 'trainee',
    //                 amountParticipants: 5,
    //                 leaderId: '5f9f1b9b9c9d440000a1b0f1',
    //                 participantsId: ['5f9f1b9b9c9d440000a1b0f1','5f9f1b9b9c9d440000a1b0f1'],
    //                 languages: ['javascript','typescript'],
    //                 technologies: ['angular','react'],
    //             },
    //             {
    //                 name: 'Project 2',
    //                 description: 'Description 2',
    //                 startDate: new Date,
    //                 type: 'web',
    //                 complexity: 'trainee',
    //                 amountParticipants: 5,
    //                 leaderId: '5f9f1b9b9c9d440000a1b0f1',
    //                 participantsId: ['5f9f1b9b9c9d440000a1b0f1','5f9f1b9b9c9d440000a1b0f1'],
    //                 languages: ['javascript','typescript'],
    //                 technologies: ['angular','react'],
    //             },
    //         ];

    //         projectService.getProjectsByFilters.mockResolvedValue(fakeProjects);
    //         await getProjectsByFilters(fakeReq,fakeRes);

    //         expect(fakeRes.json).toHaveBeenCalledWith(fakeProjects);
    //         expect(projectService.getProjectsByFilters).toHaveBeenCalledWith(fakeReq.body,fakeReq.params.pagination);
    //         expect(fakeRes.status).toHaveBeenCalledWith(200);
    //     });

    //     it('should return a 204 if projects not found', async () => {
    //         projectService.getProjectsByFilters.mockResolvedValue(null);
    //         await getProjectsByFilters(fakeReq,fakeRes);

    //         expect(fakeRes.json).toHaveBeenCalledWith({ results:[], message: 'Projects not found'});
    //         expect(fakeRes.status).toHaveBeenCalledWith(204);
    //     });

    //     it('should return a 500 if an error occurs', async () => {
    //         const fakeError = new Error({message:'Error'});
    //         projectService.getProjectsByFilters.mockRejectedValue(fakeError);
    //         await getProjectsByFilters(fakeReq,fakeRes);

    //         expect(fakeRes.json).toHaveBeenCalledWith({ message: 'Internal Server Error', error: fakeError.message });
    //         expect(fakeRes.status).toHaveBeenCalledWith(500);
    //     });
    });

    /********************************************************************* */

    describe('getAllProjects', () => {
        const fakeReq = {};
        const fakeRes = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };

        afterEach(() => {
            jest.clearAllMocks();
        });

        it('should return all projects', async () => {
            const fakeProjects = [
                {
                    name: 'Project 1',
                    description: 'Description 1',
                    startDate: new Date,
                    type: 'web',
                    complexity: 'trainee',
                    amountParticipants: 5,
                    leaderId: '5f9f1b9b9c9d440000a1b0f1',
                    participantsId: ['5f9f1b9b9c9d440000a1b0f1','5f9f1b9b9c9d440000a1b0f1'],
                    languages: ['javascript','typescript'],
                    technologies: ['angular','react'], 
                    status: 'active',
                },
                {
                    name: 'Project 2',
                    description: 'Description 2',
                    startDate: new Date,
                    type: 'web',
                    complexity: 'trainee',
                    amountParticipants: 5,
                    leaderId: '5f9f1b9b9c9d440000a1b0f1',
                    participantsId: ['5f9f1b9b9c9d440000a1b0f1','5f9f1b9b9c9d440000a1b0f1'],
                    languages: ['javascript','typescript'],
                    technologies: ['angular','react'], 
                    status: 'active',
                },
            ];
            projectService.getAllProjects.mockResolvedValue(fakeProjects);
            await getAllProjects(fakeReq,fakeRes);

            expect(fakeRes.json).toHaveBeenCalledWith(fakeProjects);
            expect(projectService.getAllProjects).toHaveBeenCalled();
            expect(fakeRes.status).toHaveBeenCalledWith(200);
        });

        it('should return a 204 if projects not found', async () => {
            projectService.getAllProjects.mockResolvedValue(null);
            await getAllProjects(fakeReq,fakeRes);

            expect(fakeRes.json).toHaveBeenCalledWith({ results: [], message: 'Projects not found' });
            expect(fakeRes.status).toHaveBeenCalledWith(204);
        });

        it('should return a 500 if an error occurs', async () => {
            const fakeError = new Error({messafe:'Error'});
            projectService.getAllProjects.mockRejectedValue(fakeError);
            await getAllProjects(fakeReq,fakeRes);

            expect(fakeRes.json).toHaveBeenCalledWith({ message: 'Internal server error', error: fakeError.message });
            expect(fakeRes.status).toHaveBeenCalledWith(500);
        });
    });

    /********************************************************************* */

    describe('getProjectById', () => {
        const fakeReq = {
            params: {
                id: '643d5f11323e6b96c8f24c97',
            }
        };
        const fakeRes = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };

        afterEach(() => {
            jest.clearAllMocks();
        });
        it('should return the project by id', async () => {
            const fakeProject = {
                name: 'Project 1',
                description: 'Description 1',
                startDate: new Date,
                type: 'web',
                complexity: 'trainee',
                amountParticipants: 5,
                leaderId: '5f9f1b9b9c9d440000a1b0f1',
                participantsId: ['5f9f1b9b9c9d440000a1b0f1','5f9f1b9b9c9d440000a1b0f1'],
                languages: ['javascript','typescript'],
                technologies: ['angular','react'], 
                status: 'active',
            };
            projectService.getProjectById.mockResolvedValue(fakeProject);
            await getProjectById(fakeReq,fakeRes);

            expect(fakeRes.json).toHaveBeenCalledWith(fakeProject);
            expect(projectService.getProjectById).toHaveBeenCalledWith(fakeReq.params.id);
            expect(fakeRes.status).toHaveBeenCalledWith(200);
        });

        it('should return a 204 if project not found', async () => {
            projectService.getProjectById.mockResolvedValue(null);
            await getProjectById(fakeReq,fakeRes);

            expect(fakeRes.json).toHaveBeenCalledWith({ message: 'Project not found' });
            expect(fakeRes.status).toHaveBeenCalledWith(204);
        });

        it('should return a 500 if an error occurs', async () => {
            const fakeError = new Error({message:'Error'});
            projectService.getProjectById.mockRejectedValue(fakeError);
            await getProjectById(fakeReq,fakeRes);

            expect(fakeRes.json).toHaveBeenCalledWith({ message: 'Internal server error', error: fakeError.message });
            expect(fakeRes.status).toHaveBeenCalledWith(500);
        });
    });

    /********************************************************************* */

    describe('updateProjectById', () => {
        const fakeReq = {
            params: {
                id: '643d5f11323e6b96c8f24c97',
            },
            body: {
                complexity: "trainee",
                description: "Description 1 Updated",
            }
        };
        const fakeRes = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };

        afterEach(() => {
            jest.clearAllMocks();
        });
        it('should return the project updated', async () => {
            const fakeProject = {
                name: 'Project 1',
                description: 'Description 1',
                startDate: new Date,
                type: 'web',
                complexity: 'trainee',
                amountParticipants: 5,
                leaderId: '5f9f1b9b9c9d440000a1b0f1',
                participantsId: ['5f9f1b9b9c9d440000a1b0f1','5f9f1b9b9c9d440000a1b0f1'],
                languages: ['javascript','typescript'],
                technologies: ['angular','react'], 
                status: 'active',
            };
            projectService.updateProjectById.mockResolvedValue(fakeProject);
            await updateProjectById(fakeReq,fakeRes);

            expect(fakeRes.json).toHaveBeenCalledWith(fakeProject);
            expect(projectService.updateProjectById).toHaveBeenCalledWith(fakeReq.params.id, fakeReq.body);
            expect(fakeRes.status).toHaveBeenCalledWith(200);
        });

        it('should return a 204 if project not found', async () => {
            projectService.updateProjectById.mockResolvedValue(null);
            await updateProjectById(fakeReq,fakeRes);

            expect(fakeRes.json).toHaveBeenCalledWith({ message: 'Project not found' });
            expect(fakeRes.status).toHaveBeenCalledWith(204);
        });

        it('should return a 500 if an error occurs', async () => {
            const fakeError = new Error({message:'Error'});
            projectService.updateProjectById.mockRejectedValue(fakeError);
            await updateProjectById(fakeReq,fakeRes);

            expect(fakeRes.json).toHaveBeenCalledWith({ message: 'Internal server error', error: fakeError.message });
            expect(fakeRes.status).toHaveBeenCalledWith(500);
        });
    });

    /********************************************************************* */

    describe('deleteProjectById', () => {
        const fakeReq = {
            params: {
                id: '643d5f11323e6b96c8f24c97',
            },
        };
        const fakeRes = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };

        afterEach(() => {
            jest.clearAllMocks();
        });

        it('should return the project deleted', async () => {
            const fakeProject = {
                name: 'Project 1',
                description: 'Description 1',
                startDate: new Date,
                type: 'web',
                complexity: 'trainee',
                amountParticipants: 5,
                leaderId: '5f9f1b9b9c9d440000a1b0f1',
                participantsId: ['5f9f1b9b9c9d440000a1b0f1','5f9f1b9b9c9d440000a1b0f1'],
                languages: ['javascript','typescript'],
                technologies: ['angular','react'], 
                status: 'active',
            };
            projectService.deleteProjectById.mockResolvedValue(fakeProject);
            await deleteProjectById(fakeReq,fakeRes);

            expect(fakeRes.json).toHaveBeenCalledWith(fakeProject);
            expect(projectService.deleteProjectById).toHaveBeenCalledWith(fakeReq.params.id);
            expect(fakeRes.status).toHaveBeenCalledWith(200);
        });

        it('should return a 204 if project not found', async () => {
            projectService.deleteProjectById.mockResolvedValue(null);
            await deleteProjectById(fakeReq,fakeRes);

            expect(fakeRes.json).toHaveBeenCalledWith({ message: 'Project not found' });
            expect(fakeRes.status).toHaveBeenCalledWith(204);
        });

        it('should return a 500 if an error occurs', async () => {
            const fakeError = new Error({message:'Error'});
            projectService.deleteProjectById.mockRejectedValue(fakeError);
            await deleteProjectById(fakeReq,fakeRes);

            expect(fakeRes.json).toHaveBeenCalledWith({ message: 'Internal server error', error: fakeError.message });
            expect(fakeRes.status).toHaveBeenCalledWith(500);
        });
    });
});

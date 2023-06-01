const { createProject, getAllProjects, getProjectById, getProjectsByFilters, updateProjectById, deleteProjectById } = require("../../../src/domain/services/projectService");
const projectRepository = require("../../../src/infrastructure/persistence/projectRepository");
const Utils = require("../../../src/infrastructure/utils/utilities");
jest.mock('../../../src/infrastructure/utils/utilities');
jest.mock('../../../src/infrastructure/persistence/projectRepository');

describe("Project Service Test", () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });
    describe("createProject", () => {
        it("should create a project", async () => {
            const project = {
                name: 'Project 2',
                description: 'Description 2',
                startDate: '19/10/2020',
                type: 'Web',
                complexity: 'Trainee',
                amountParticipants: 5,
                leaderId: '5f9f1b9b9c9d440000a1b0f1',
                participantsId: ['5f9f1b9b9c9d440000a1b0f1','5f9f1b9b9c9d440000a1b0f1'],
                languages: ['javascript','typescript'],
                technologies: ['angular','react'],
                leader: '5f9f1b9b9c9d440000a1b0f1'
            };
            projectRepository.create.mockResolvedValue(project);
            const result = await createProject(project);

            expect(result.name).toEqual(project.name);
            expect(result.description).toEqual(project.description);
            expect(result.complexity).toEqual(project.complexity);
            expect(projectRepository.create).toHaveBeenCalled();
        });

        it("should throw an error", async () => {
            const project = {
                name: 'Project 2',
                description: 'Description 2',
                startDate: '19/10/2020',
                type: 'Web',
                complexity: 'Trainee',
                amountParticipants: 5,
                leaderId: '5f9f1b9b9c9d440000a1b0f1',
                participantsId: ['5f9f1b9b9c9d440000a1b0f1','5f9f1b9b9c9d440000a1b0f1'],
                languages: ['javascript','typescript'],
                technologies: ['angular','react'],
                leader: '5f9f1b9b9c9d440000a1b0f1'
            };
            projectRepository.create.mockRejectedValue(new Error());
            await expect(createProject(project)).rejects.toThrowError();
            expect(projectRepository.create).toHaveBeenCalled();
        });
    });

//     /********************************************************************************************** */

    describe("getAllProjects", () => {
        it("should get all projects", async () => {
            const projects = [
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
                },
                {
                    name: 'Project 3',
                    description: 'Description 4',
                    startDate: new Date,
                    type: 'web',
                    complexity: 'trainee',
                    amountParticipants: 5,
                    leaderId: '5f9f1b9b9c9d440000a1b0f1',
                    participantsId: ['5f9f1b9b9c9d440000a1b0f1','5f9f1b9b9c9d440000a1b0f1'],
                    languages: ['javascript','typescript'],
                    technologies: ['angular','react'],
                }
            ]
            projectRepository.getAll.mockResolvedValue(projects);
            const result = await getAllProjects();

            expect(result).toEqual(projects);
            expect(projectRepository.getAll).toHaveBeenCalled();
        });

        it("should return null if not found projects", async () => {
            projectRepository.getAll.mockResolvedValue([]);
            const result = await getAllProjects();

            expect(result).toEqual(null);
            expect(projectRepository.getAll).toHaveBeenCalled();

        });

        it("should throw an error when i try get all projects", async () => {
            projectRepository.getAll.mockRejectedValue(new Error());
            await expect(getAllProjects()).rejects.toThrowError();
            expect(projectRepository.getAll).toHaveBeenCalled();
        });
    });

//         /********************************************************************************************** */

        describe("getProjectById", () => {
            it("should get a project by id", async () => {
                const project = {
                    name: 'Project 2',
                    description: 'Description 2',
                    startDate: new Date,
                    type: 'web',
                    complexity: 'trainee',
                    amountParticipants: 5,
                    leaderId: '5f9f1b9b9c9d440000a1b0f1',
                    participants: ['5f9f1b9b9c9d440000a1b0f1'],
                    languages: ['javascript','typescript'],
                    technologies: ['angular','react'],
                };
                projectRepository.getById.mockResolvedValue(project);
                const result = await getProjectById("5f9f1b9b9c9d440000a1b0f1");

                expect(result).toEqual(project);
                expect(projectRepository.getById).toHaveBeenCalled();
            });

            it("should return null if not found project", async () => {
                projectRepository.getById.mockResolvedValue(null);
                const result = await getProjectById("5f9f1b9b9c9d440000a1b0f1");

                expect(result).toEqual(null);
                expect(projectRepository.getById).toHaveBeenCalled();

            });

            it("should throw an error when i try get a project by id", async () => {
                projectRepository.getById.mockRejectedValue(new Error());
                await expect(getProjectById("5f9f1b9b9c9d440000a1b0f1")).rejects.toThrowError();
                expect(projectRepository.getById).toHaveBeenCalled();
            });
        });

//         /********************************************************************************************** */

        describe("getProjectsByFilters", () => {
            it("should get projects by filters", async () => {
                const projects = [
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
                    },
                    {
                        name: 'Project 3',
                        description: 'Description 4',
                        startDate: new Date,
                        type: 'web',
                        complexity: 'trainee',
                        amountParticipants: 5,
                        leaderId: '5f9f1b9b9c9d440000a1b0f1',
                        participantsId: ['5f9f1b9b9c9d440000a1b0f1','5f9f1b9b9c9d440000a1b0f1'],
                        languages: ['javascript','typescript'],
                        technologies: ['angular','react'],
                    }
                ]
                const body = {
                    type: "web"
                }
                projectRepository.getByFilters.mockResolvedValue(projects);
                const result = await getProjectsByFilters(body);

                expect(result).toEqual(projects);
                expect(projectRepository.getByFilters).toHaveBeenCalled();
            });

            it("should return null if not found projects", async () => {
                const body = {
                    type: "web"
                }
                projectRepository.getByFilters.mockResolvedValue([]);
                const result = await getProjectsByFilters(body);

                expect(result).toEqual(null);
                expect(projectRepository.getByFilters).toHaveBeenCalled();

            });

            it("should throw an error when i try get projects by filters", async () => {
                const body = {
                    type: "web"
                }
                projectRepository.getByFilters.mockRejectedValue(new Error());
                await expect(getProjectsByFilters(body)).rejects.toThrowError();
                expect(projectRepository.getByFilters).toHaveBeenCalled();
            });
        });

//         /********************************************************************************************** */

        describe("updateProjectById", () => {
            it("should update a project by id", async () => {
                const body = {
                    languages: ['javascript','typescript'],
                    technologies: ['angular','react'],
                }
                const response = {
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
                }
                const fakeId = "5f9f1b9b9c9d440000a1b0f1"
                projectRepository.updateById.mockResolvedValue(response);
                const result = await updateProjectById(fakeId, body);

                expect(result).toEqual(response);
                expect(projectRepository.updateById).toHaveBeenCalled();
            });

            it("should return null if not found project", async () => {
                const body = {
                    languages: ['javascript','typescript'],
                    technologies: ['angular','react'],
                }
                const fakeId = "5f9f1b9b9c9d440000a1b0f1"
                projectRepository.updateById.mockResolvedValue(null);
                const result = await updateProjectById(fakeId, body);

                expect(result).toEqual(null);
                expect(projectRepository.updateById).toHaveBeenCalled();

            });

            it("should throw an error when i try update a project by id", async () => {
                const body = {
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
                }
                const fakeId = null
                projectRepository.updateById.mockRejectedValue(new Error());
                await expect(updateProjectById(fakeId, body)).rejects.toThrowError();
                expect(projectRepository.updateById).toHaveBeenCalled();
            });
        });

//         /********************************************************************************************** */

        describe("deleteProjectById", () => {
            it("should delete a project by id", async () => {
                const fakeId = "5f9f1b9b9c9d440000a1b0f1"
                projectRepository.deleteById.mockResolvedValue(fakeId);
                const result = await deleteProjectById(fakeId);

                expect(result).toEqual(fakeId);
                expect(projectRepository.deleteById).toHaveBeenCalled();
            });

            it("should return null if not found project", async () => {
                const fakeId = "5f9f1b9b9c9d440000a1b0f1"
                projectRepository.deleteById.mockResolvedValue(null);
                const result = await deleteProjectById(fakeId);

                expect(result).toEqual(null);
                expect(projectRepository.deleteById).toHaveBeenCalled();

            });

            it("should throw an error when i try delete a project by id", async () => {
                const fakeId = null
                projectRepository.deleteById.mockRejectedValue(new Error());
                await expect(deleteProjectById(fakeId)).rejects.toThrowError();
                expect(projectRepository.deleteById).toHaveBeenCalled();
            });
        });
});
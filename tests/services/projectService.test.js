const Project = require("../.././src/models/project");
const { createProject, getAllProjects, getProjectById, getProjectsByFilters, updateProjectById, deleteProjectById } = require("../.././src/services/projectService");
const Utils = require("../.././src/utils/utilities");
jest.mock('../.././src/utils/utilities');

describe("Project Service Test", () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });
    describe("createProject", () => {
        it("should create a project", async () => {
            const project = {
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
            };
            const spy = jest.spyOn(Utils, "createProjectAndUpdateUser").mockImplementation(jest.fn().mockResolvedValue(project));
            const result = await createProject(project);

            expect(result.name).toEqual(project.name);
            expect(result.description).toEqual(project.description);
            expect(result.complexity).toEqual(project.complexity);
            expect(spy).toHaveBeenCalled();
        });

        it("should throw an error", async () => {
            const project = {
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
            };
            const spy = jest.spyOn(Utils, "createProjectAndUpdateUser").mockImplementation(jest.fn().mockRejectedValue(new Error("Error")));
            await expect(createProject(project)).rejects.toThrowError("Error");
            expect(spy).toHaveBeenCalled();
        });
    });

    /********************************************************************************************** */

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
            const spy = jest.spyOn(Project, "find").mockResolvedValue(projects);
            const result = await getAllProjects();

            expect(result).toEqual(projects);
            expect(spy).toHaveBeenCalled();
        });

        it("should return null if not found projects", async () => {
            const spy = jest.spyOn(Project, "find").mockResolvedValue([]);
            const result = await getAllProjects();

            expect(result).toEqual(null);
            expect(spy).toHaveBeenCalled();

        });

        it("should throw an error when i try get all projects", async () => {
            const spy = jest.spyOn(Project, "find").mockRejectedValue(new Error("Error"));
            await expect(getAllProjects()).rejects.toThrowError("Error");
            expect(spy).toHaveBeenCalled();
        });
    });

        /********************************************************************************************** */

        describe("getProjectById", () => {
            // it("should get a project by id", async () => {
            //     const project = {
            //         name: 'Project 2',
            //         description: 'Description 2',
            //         startDate: new Date,
            //         type: 'web',
            //         complexity: 'trainee',
            //         amountParticipants: 5,
            //         leaderId: '5f9f1b9b9c9d440000a1b0f1',
            //         participants: ['5f9f1b9b9c9d440000a1b0f1'],
            //         languages: ['javascript','typescript'],
            //         technologies: ['angular','react'],
            //     };
            //     const spy = jest.spyOn(Project, "findById").mockResolvedValue(project);
            //     const result = await getProjectById("5f9f1b9b9c9d440000a1b0f1");

            //     expect(result).toEqual(project);
            //     expect(spy).toHaveBeenCalled();
            // });

            // it("should return null if not found project", async () => {
            //     const spy = jest.spyOn(Project, "findById").mockResolvedValue(null);
            //     const result = await getProjectById("5f9f1b9b9c9d440000a1b0f1");

            //     expect(result).toEqual(null);
            //     expect(spy).toHaveBeenCalled();

            // });

            // it("should throw an error when i try get a project by id", async () => {
            //     const spy = jest.spyOn(Project, "findById").mockRejectedValue(new Error("Error"));
            //     await expect(getProjectById("5f9f1b9b9c9d440000a1b0f1")).rejects.toThrowError("Error");
            //     expect(spy).toHaveBeenCalled();
            // });
        });

        /********************************************************************************************** */

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
                const spy = jest.spyOn(Project, "find").mockResolvedValue(projects);
                const result = await getProjectsByFilters(body);

                expect(result).toEqual(projects);
                expect(spy).toHaveBeenCalled();
            });

            it("should return null if not found projects", async () => {
                const body = {
                    type: "web"
                }
                const spy = jest.spyOn(Project, "find").mockResolvedValue([]);
                const result = await getProjectsByFilters(body);

                expect(result).toEqual(null);
                expect(spy).toHaveBeenCalled();

            });

            it("should throw an error when i try get projects by filters", async () => {
                const body = {
                    type: "web"
                }
                const spy = jest.spyOn(Project, "find").mockRejectedValue(new Error("Error"));
                await expect(getProjectsByFilters(body)).rejects.toThrowError("Error");
                expect(spy).toHaveBeenCalled();
            });
        });

        /********************************************************************************************** */

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
                const spy = jest.spyOn(Project, "findByIdAndUpdate").mockResolvedValue(response);
                const result = await updateProjectById(fakeId, body);

                expect(result).toEqual(response);
                expect(spy).toHaveBeenCalled();
            });

            it("should return null if not found project", async () => {
                const body = {
                    languages: ['javascript','typescript'],
                    technologies: ['angular','react'],
                }
                const fakeId = "5f9f1b9b9c9d440000a1b0f1"
                const spy = jest.spyOn(Project, "findByIdAndUpdate").mockResolvedValue(null);
                const result = await updateProjectById(fakeId, body);

                expect(result).toEqual(null);
                expect(spy).toHaveBeenCalled();

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
                const spy = jest.spyOn(Project, "findByIdAndUpdate").mockRejectedValue(new Error("Error"));
                await expect(updateProjectById(fakeId, body)).rejects.toThrowError("Error");
                expect(spy).toHaveBeenCalled();
            });
        });

        /********************************************************************************************** */

        describe("deleteProjectById", () => {
            it("should delete a project by id", async () => {
                const fakeId = "5f9f1b9b9c9d440000a1b0f1"
                const spy = jest.spyOn(Project, "findByIdAndDelete").mockResolvedValue(fakeId);
                const result = await deleteProjectById(fakeId);

                expect(result).toEqual(fakeId);
                expect(spy).toHaveBeenCalled();
            });

            it("should return null if not found project", async () => {
                const fakeId = "5f9f1b9b9c9d440000a1b0f1"
                const spy = jest.spyOn(Project, "findByIdAndDelete").mockResolvedValue(null);
                const result = await deleteProjectById(fakeId);

                expect(result).toEqual(null);
                expect(spy).toHaveBeenCalled();

            });

            it("should throw an error when i try delete a project by id", async () => {
                const fakeId = null
                const spy = jest.spyOn(Project, "findByIdAndDelete").mockRejectedValue(new Error("Error"));
                await expect(deleteProjectById(fakeId)).rejects.toThrowError("Error");
                expect(spy).toHaveBeenCalled();
            });
        });
});
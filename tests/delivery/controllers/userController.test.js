const { createUser, getAllUsers, getUserById, updateUserById, deleteUserById,getUserByCredentials, getUserByFilters, getUsersByRanking } = require('../../../src/delivery/controllers/userController');
const { generateHash, comparePasswordWithHash } = require('../../../src/domain/utils/utilities');
const userService = require('../../../src/domain/services/userService');
jest.mock('../../../src/domain/services/userService');
jest.mock('../../../src/domain/utils/utilities');

describe('userController Test', () => {
    describe('getUserById', () => {
        const fakeReq = { params: { id: 1 } };
        const fakeRes = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };

        afterEach(() => {
            jest.clearAllMocks();
        });

        it('should return the user', async () => {
            const fakeUser = { id: 1, name: 'Carlos' };
            userService.getUserById.mockResolvedValue(fakeUser);

            await getUserById(fakeReq, fakeRes);

            expect(userService.getUserById).toHaveBeenCalledWith(fakeReq.params.id);
            expect(fakeRes.json).toHaveBeenCalledWith(fakeUser);
            expect(fakeRes.status).toHaveBeenCalledWith(200);
        });

        it('should return a 204 if user is not found', async () => {
            userService.getUserById.mockResolvedValue(null);

            await getUserById(fakeReq, fakeRes);

            expect(userService.getUserById).toHaveBeenCalledWith(fakeReq.params.id);
            expect(fakeRes.status).toHaveBeenCalledWith(204);
            expect(fakeRes.json).toHaveBeenCalledWith({ message: 'User not found' });
        });

        it('should return a 500 if an error occurs', async () => {
            const fakeError = new Error({message:'Fake error'});
            userService.getUserById.mockRejectedValue(fakeError);

            await getUserById(fakeReq, fakeRes);

            expect(userService.getUserById).toHaveBeenCalledWith(fakeReq.params.id);
            expect(fakeRes.status).toHaveBeenCalledWith(500);
            expect(fakeRes.json).toHaveBeenCalledWith({ message: 'Internal server error', error: fakeError.message });
        });
    });

    /**************************************************************************************************/

    describe('getAllUser', () => {
        const fakeReq = {};
        const fakeRes = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };

        afterEach(() => {
            jest.clearAllMocks();
        });

        it('should return all users', async () => {
            const fakeUsers = [{ id: 1, name: 'Carlos' }, { id: 2, name: 'Juan' }];
            userService.getAllUsers.mockResolvedValue(fakeUsers);

            await getAllUsers(fakeReq, fakeRes);

            expect(userService.getAllUsers).toHaveBeenCalled();
            expect(fakeRes.json).toHaveBeenCalledWith(fakeUsers);
            expect(fakeRes.status).toHaveBeenCalledWith(200);
        });

        it('should return a 204 if user is not found', async () => {
            userService.getAllUsers.mockResolvedValue(null);

            await getAllUsers(fakeReq, fakeRes);

            expect(userService.getAllUsers).toHaveBeenCalled();
            expect(fakeRes.status).toHaveBeenCalledWith(204);
            expect(fakeRes.json).toHaveBeenCalledWith({ results:[], message: 'Users not found' });
        });

        it('should return a 500 if an error occurs', async () => {
            const fakeError = new Error({message:'Fake error'});
            userService.getAllUsers.mockRejectedValue(fakeError);

            await getAllUsers(fakeReq, fakeRes);

            expect(userService.getAllUsers).toHaveBeenCalled();
            expect(fakeRes.status).toHaveBeenCalledWith(500);
            expect(fakeRes.json).toHaveBeenCalledWith({ message: 'Internal server error' , error: fakeError.message});
        });
    });

    /**************************************************************************************************/

    describe('createUser', () => {
        const fakeReq = {
            body: {
                name: 'Test User',
                email: 'test@example.com',
                password: 'testpassword',
            }
        };
        const fakeRes = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };

        afterEach(() => {
            jest.clearAllMocks();
        });

        it('should create the user and return a 201 code', async () => {
            const fakeUser = {
                name: 'Test User',
                email: 'test@example.com',
                password: 'testpassword',
            }
            userService.getUserByFilters.mockResolvedValue(false);
            generateHash.mockResolvedValue('testpassword');
            userService.createUser.mockResolvedValue(fakeUser);
            await createUser(fakeReq,fakeRes)

            expect(userService.getUserByFilters).toHaveBeenCalledWith({email: fakeReq.body.email});
            expect(generateHash).toHaveBeenCalledWith(fakeReq.body.password);
            expect(userService.createUser).toHaveBeenCalledWith({...fakeReq.body, password: 'testpassword'});
            expect(fakeRes.json).toHaveBeenCalledWith(fakeUser);
            expect(fakeRes.status).toHaveBeenCalledWith(201);
        });

        it('should return a 400 if the user already exists', async () => {
            const fakeUser = {
                name: 'Test User'
            }
            userService.getUserByFilters.mockResolvedValue(fakeUser);
            await createUser(fakeReq, fakeRes);

            expect(fakeRes.status).toHaveBeenCalledWith(400);
            expect(fakeRes.json).toHaveBeenCalledWith({ message: 'User already exists'});
        });

        it('should return a 500 if an error occurs', async () => {
            const error = new Error({message:'Internal server error'});
            userService.getUserByFilters.mockResolvedValue(false);
            generateHash.mockResolvedValue('testpassword')
            userService.createUser.mockRejectedValue(error);
            await createUser(fakeReq, fakeRes);

            expect(fakeRes.status).toHaveBeenCalledWith(500);
            expect(fakeRes.json).toHaveBeenCalledWith({ message: 'Internal server error', error: error.message});
        });
    });

    /**************************************************************************************************/

    describe('getUserByCredentials', () => {
        const fakeReq = {
            body: {
                email: 'test@example.com',
                password: 'asdasd',
            }
        };
        const fakeRes = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };

        afterEach(() => {
            jest.clearAllMocks();
        });

        it('should create the user and return a 200 code', async () => {
            const fakeUser = {
                name: 'Test User',
                email: 'asdasd',
            }
            userService.getUserByCredentials.mockResolvedValue(fakeUser);
            comparePasswordWithHash.mockResolvedValue(true);
            await getUserByCredentials(fakeReq, fakeRes);

            expect(userService.getUserByCredentials).toHaveBeenCalledWith(fakeReq.body.email);
            expect(fakeRes.json).toHaveBeenCalledWith(fakeUser);
            expect(fakeRes.status).toHaveBeenCalledWith(200);
        });

        it('should return a 204 if user is not found', async () => {
            userService.getUserByCredentials.mockResolvedValue(null);
            await getUserByCredentials(fakeReq, fakeRes);

            expect(fakeRes.status).toHaveBeenCalledWith(204);
            expect(fakeRes.json).toHaveBeenCalledWith({ message: 'User not found' });
        });

        it('should return code 400 if the password is incorrect', async () => {
            const mockUser = {
                name: 'Test User',
                email: 'asdasd',
            }
            const fakeReq2 = {
                body: {
                    email: 'asd',
                    password: 'asdasd'
                }
            }
            userService.getUserByCredentials.mockResolvedValue(mockUser);
            comparePasswordWithHash.mockResolvedValue(false);
            await getUserByCredentials(fakeReq2, fakeRes);
            expect(userService.getUserByCredentials).toHaveBeenCalledWith(fakeReq2.body.email);
            expect(comparePasswordWithHash).toHaveBeenCalledWith(fakeReq2.body.password, mockUser.password);
            expect(fakeRes.status).toHaveBeenCalledWith(400);
            expect(fakeRes.json).toHaveBeenCalledWith({ message: 'Password not valid' });
        });

        it('should return a 500 if an error occurs', async () => {
            const error = new Error({message:'Internal server error'});
            userService.getUserByCredentials.mockRejectedValue(error);
            await getUserByCredentials(fakeReq, fakeRes);

            expect(fakeRes.status).toHaveBeenCalledWith(500);
            expect(fakeRes.json).toHaveBeenCalledWith({ message: 'Internal Server Error', error: error.message });
        });
    });

        /**************************************************************************************************/

        describe('getUserByFilters', () => {
            const fakeReq = {
                body:{
                    role: "user",
                }
            };
            const fakeRes = {
                json: jest.fn(),
                status: jest.fn().mockReturnThis(),
            };
    
            afterEach(() => {
                jest.clearAllMocks();
            });
    
            it('should create the user and return a 200 code', async () => {
                const fakeUsers = [{
                    name: 'Test User',
                    email: 'test@example.com',
                    password: 'testpassword',
                    role: 'user'
                },
                {
                    name: 'Test User',
                    email: 'test2@example.com',
                    password: 'testpassword',
                    role: 'user'
                }
                ];
                userService.getUserByFilters.mockResolvedValue(fakeUsers);
                await getUserByFilters(fakeReq,fakeRes)

                expect(userService.getUserByFilters).toHaveBeenCalledWith(fakeReq.body);
                expect(fakeRes.json).toHaveBeenCalledWith(fakeUsers);
                expect(fakeRes.status).toHaveBeenCalledWith(200);
            });
    
            it('should return a 204 if user is not found', async () => {
                userService.getUserByFilters.mockResolvedValue(null);
                await getUserByFilters(fakeReq, fakeRes);

                expect(fakeRes.status).toHaveBeenCalledWith(204);
                expect(fakeRes.json).toHaveBeenCalledWith({results:[], message: 'Users not found' });
            });
    
            it('should return a 500 if an error occurs', async () => {
                const error = new Error({message:'Internal server error'});
                userService.getUserByFilters.mockRejectedValue(error);
                await getUserByFilters(fakeReq, fakeRes);
    
                expect(fakeRes.status).toHaveBeenCalledWith(500);
                expect(fakeRes.json).toHaveBeenCalledWith({ message: 'Internal Server Error', error: error.message });
            });
        });
    
        /**************************************************************************************************/

    /**************************************************************************************************/

    describe('updateUserById', () => {
        const fakeReq = {
            params: {
                id: '1'
            },
            body: {
                name: 'Test User',
            }
        };
        const fakeRes = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };

        afterEach(() => {
            jest.clearAllMocks();
        });

        it('should create the user and return a 200 code', async () => {
            const fakeUser = {
                name: 'Test User',
            }
            userService.updateUserById.mockResolvedValue(fakeUser);
            await updateUserById(fakeReq, fakeRes);

            expect(userService.updateUserById).toHaveBeenCalledWith('1', fakeReq.body);
            expect(fakeRes.json).toHaveBeenCalledWith(fakeUser);
            expect(fakeRes.status).toHaveBeenCalledWith(200);
        });

        it('should return a 204 if user is not found', async () => {
            userService.updateUserById.mockResolvedValue(null);
            await updateUserById(fakeReq, fakeRes);

            expect(fakeRes.status).toHaveBeenCalledWith(204);
            expect(fakeRes.json).toHaveBeenCalledWith({ message: 'User not found' });
        });

        it('should return a 500 if an error occurs', async () => {
            const error = new Error({message:'Internal server error'});
            userService.updateUserById.mockRejectedValue(error);
            await updateUserById(fakeReq, fakeRes);

            expect(fakeRes.status).toHaveBeenCalledWith(500);
            expect(fakeRes.json).toHaveBeenCalledWith({ message: 'Internal Server Error', error: error.message });
        });
    });

    /**************************************************************************************************/

    describe('deleteUserById', () => {
        const fakeReq = {
            params: {
                id: '1'
            }
        };
        const fakeRes = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
            end: jest.fn()
        };

        afterEach(() => {
            jest.clearAllMocks();
        });

        it('should create the user and return a 204 code', async () => {
            userService.deleteUserById.mockResolvedValue(true);
            await deleteUserById(fakeReq, fakeRes);

            expect(fakeRes.status).toHaveBeenCalledWith(204);
            expect(fakeRes.end).toHaveBeenCalled();
            expect(userService.deleteUserById).toHaveBeenCalledWith('1');
        });

        it('should return a 204 if user is not found', async () => {
            userService.deleteUserById.mockResolvedValue(false);
            await deleteUserById(fakeReq, fakeRes);

            expect(fakeRes.status).toHaveBeenCalledWith(204);
            expect(fakeRes.json).toHaveBeenCalledWith({ message: 'User not found' });
            expect(fakeRes.end).not.toHaveBeenCalled();
            expect(userService.deleteUserById).toHaveBeenCalledWith('1');

        });

        it('should return a 500 if an error occurs', async () => {
            const error = new Error({message:'Internal server error'})
            userService.deleteUserById.mockRejectedValue(error);
            await deleteUserById(fakeReq, fakeRes);

            expect(fakeRes.status).toHaveBeenCalledWith(500);
            expect(fakeRes.json).toHaveBeenCalledWith({ message: 'Internal server error', error: error.message });
            expect(fakeRes.end).not.toHaveBeenCalled();
            expect(userService.deleteUserById).toHaveBeenCalledWith('1');
        });
    });

    /**************************************************************************************************/

    describe('getUsersByRanking', () => {
        const fakeReq = {
            params: {
                pagination: '1'
            }
        };
        const fakeRes = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
            end: jest.fn()
        };

        afterEach(() => {
            jest.clearAllMocks();
        });

        it('should get 10 users order by ranking and return a 200 code', async () => {
            const fakeUsers = [{
                name: 'Test User1',
                email: 'asd1@hotmail.com',
                password: 'testpassword',
                role: 'user',
                ranking: 50
                },
                {
                    name: 'Test User2',
                    email: 'asd2@hotmail.com',
                    password: 'testpassword',
                    role: 'user',
                    ranking: 40
                },
                {
                    name: 'Test User3',
                    email: 'asd3@hotmail.com',
                    password: 'testpassword',
                    role: 'user',
                    ranking: 30
                },
            ]
            userService.getUsersByRanking.mockResolvedValue(fakeUsers);
            await getUsersByRanking(fakeReq, fakeRes);

            expect(fakeRes.status).toHaveBeenCalledWith(200);
            expect(fakeRes.json).toHaveBeenCalledWith(fakeUsers);
            expect(userService.getUsersByRanking).toHaveBeenCalledWith(fakeReq.params.pagination);
        });

        it('should return a 204 if users are not found', async () => {
            userService.getUsersByRanking.mockResolvedValue(null);
            await getUsersByRanking(fakeReq, fakeRes);

            expect(fakeRes.status).toHaveBeenCalledWith(204);
            expect(fakeRes.json).toHaveBeenCalledWith({ message: 'Users not found' });
            expect(userService.getUsersByRanking).toHaveBeenCalledWith(fakeReq.params.pagination);
        });

        it('should return a 500 if an error occurs', async () => {
            const error = new Error({message:'Internal server error'})
            userService.getUsersByRanking.mockRejectedValue(error);
            await getUsersByRanking(fakeReq, fakeRes);

            expect(fakeRes.status).toHaveBeenCalledWith(500);
            expect(fakeRes.json).toHaveBeenCalledWith({ message: 'Internal server error', error: error.message });
            expect(userService.getUsersByRanking).toHaveBeenCalledWith(fakeReq.params.pagination);
        });
    });
});
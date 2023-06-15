const { createUser, getAllUsers, getUserById, getUserByCredentials, updateUserById, deleteUserById, getUserByFilters, getUsersByRanking } = require('../../../src/domain/services/userService');
const userRepository = require('../../../src/infrastructure/persistence/userRepository');
jest.mock('../../../src/infrastructure/persistence/userRepository');

describe('UserService Test', () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });
    describe('createUser', () => {
            test("should create an user", async () => {
                const mockUser = {
                    name: "Test",
                    email: "test@example.com",
                    password: "password"
                };
                userRepository.create.mockResolvedValue(mockUser);
                const result = await createUser(mockUser);

                expect(result.email).toEqual(mockUser.email);
                expect(result.name).toEqual(mockUser.name);
                expect(result.password).toEqual(mockUser.password);
            });

            it('should throw an error when user data is invalid', async () => {
            const userData = {
                name: 'Test User',
                email: 'invalid-email',
                password: '123'
            };
            userRepository.create.mockRejectedValue(new Error());

            await expect(createUser(userData)).rejects.toThrow();
            });
    });

    /**************************************************************************************************/

    describe('getUserByCredentials', () => {
        it('should return a user if the credentials are correct', async () => {
            const email = 'test@test.com';
            const user = {
                _id: 'someid',
                name: 'Test User',
                email,
            };
            userRepository.getByCredentials.mockResolvedValue(user);

            const result = await getUserByCredentials(email);

            expect(userRepository.getByCredentials).toHaveBeenCalledWith(email);
            expect(result).toEqual(user);
        });

        it('should return null if the credentials are incorrect', async () => {
            const email = 'test@test.com';

            userRepository.getByCredentials.mockResolvedValue(null);

            const result = await getUserByCredentials(email);

            expect(userRepository.getByCredentials).toHaveBeenCalledWith(email);
            expect(result).toBeNull();
        });

        it('should throw an error if there is a problem retrieving the user', async () => {
            const email = 'test@test.com';

            userRepository.getByCredentials.mockRejectedValue(new Error());

            await expect(getUserByCredentials(email)).rejects.toThrow();
            expect(userRepository.getByCredentials).toHaveBeenCalledWith(email);
        });
    });

    /**************************************************************************************************/

    describe('getUserByFilters', () => {
        test('should return user if found', async () => {
            const mockUser = { _id: '123', email: 'test@test.com' };

            const mockSelect = jest.fn().mockReturnThis(mockUser);
            const mockFind = jest.fn().mockReturnValue({ select: mockSelect }); 

            userRepository.getByFilters.mockResolvedValue(mockFind);
            const filters = { email: 'test@test.com' };
            const result = await getUserByFilters(filters);

            expect(userRepository.getByFilters).toHaveBeenCalledWith(filters);
            expect(result).notNull;
        });

        test("should not return user ", async () => {
            const body = { name: 'Test' };

            userRepository.getByFilters.mockResolvedValue(null);
        
            const result = await getUserByFilters(body);
        
            expect(userRepository.getByFilters).toHaveBeenCalledWith(body);
            expect(result).toBeNull();
        });

        test('should throw an error if the database throws an error', async () => {
            userRepository.getByFilters.mockRejectedValue(new Error());

            const filters = { email: 'test@test.com' };
            expect(getUserByFilters(filters)).rejects.toThrow();
            expect(userRepository.getByFilters).toHaveBeenCalledWith(filters);
        });
    });

    // /**************************************************************************************************/

    describe('getAllUsers', () => {
        it('should return all users', async () => {
                const mockUsers = [{
                    name: "Test",
                    email: "test@example.com",
                    password: "password"
                },{
                    name: "Test 1",
                    email: "test1@example.com",
                    password: "password"
                }];

            userRepository.getAll.mockResolvedValue(mockUsers);

            const result = await getAllUsers();

            expect(userRepository.getAll).toHaveBeenCalled();
            expect(result).toEqual(mockUsers);

            expect(result.length).toBe(mockUsers.length);
            expect(result[0].name).toBe(mockUsers[0].name);
            expect(result[1].name).toBe(mockUsers[1].name);
        });

        it('should return empty array if no users are found', async () => {
            userRepository.getAll.mockResolvedValue(null);
            const result = await getAllUsers();

            expect(userRepository.getAll).toHaveBeenCalled();
            expect(result).toEqual(null);
        });

        it('should throw an error when user data is invalid', async () => {
            userRepository.getAll.mockRejectedValue(new Error());

            await expect(getAllUsers()).rejects.toThrow();
        });
    });

    // /**************************************************************************************************/

    describe('getUserById', () => {
    //     test('should return a user if found', async () => {
    //         const mockUser = { _id: '123', name: 'Test User', email: 'test@test.com' };
    //         const mockFindById = jest.spyOn(User, 'findById').mockReturnValue({
    //             select: jest.fn().mockReturnValue(mockUser),
    //             populate: jest.fn().mockResolvedValue(mockUser)
    //         });
    //         User.populate = jest.fn(() => Promise.resolve(user));

    //         const result = await getUserById(mockUser._id);

    //         expect(mockFindById).toHaveBeenCalledWith(mockUser._id);
    //         expect(result).toEqual(mockUser);
    //     });

        // test('should return null if no user is found', async () => {
        //     const mockFindById = jest.spyOn(User, 'findById').mockReturnValue({
        //         populate: jest.fn().mockResolvedValue(null),
        //         select: jest.fn().mockResolvedValue(null),
        //         exec: jest.fn().mockResolvedValue(null),
        //     });

        //     const result = await getUserById('123');

        //     expect(mockFindById).toHaveBeenCalledWith('123');
        //     expect(result).toBeNull();
        // });

        // test('should throw an error if there is an error during query', async () => {
        //     const mockFindById = jest.spyOn(User, 'findById').mockResolvedValue({
        //         populate: jest.fn().mockRejectedValue(new Error()),
        //         select: jest.fn().mockResolvedValue(),
        //         exec: jest.fn().mockResolvedValue(),
        //     });
        //     await expect(getUserById('123')).rejects.toThrow();
        // });
    });

    // /**************************************************************************************************/

    describe('updateUserById', () => {
        test('should update and return the user with the given id', async () => {
            const id = '123';
            const newData = { name: 'Test', email: 'Test@example.com' };
            const updatedUser = { _id: id, ...newData };

            userRepository.updateById.mockResolvedValue(updatedUser)

            const result = await updateUserById(id, newData);

            expect(userRepository.updateById).toHaveBeenCalledWith(id, newData);
            expect(result).toEqual(updatedUser);
        });

        test('should return null if no user is found with the given id', async () => {
            const id = '123';
            const newData = { name: 'Test', email: 'Test@example.com' };

            userRepository.updateById.mockResolvedValue(null)

            const result = await updateUserById(id, newData);

            expect(userRepository.updateById).toHaveBeenCalledWith(id, newData);
            expect(result).toBeNull();
        });

        test('should throw an error if the database throws an error', async () => {
            const id = '123';
            const newData = { name: 'Test', email: 'Test@example.com' };
            userRepository.updateById.mockRejectedValue(new Error());

            await expect(updateUserById(id, newData)).rejects.toThrow();
            await expect(userRepository.updateById).toHaveBeenCalledWith(id, newData);
        });
    });

    // /**************************************************************************************************/

    describe('deleteUserById', () => {
        it('should delete an user', async () => {
            const mockUser = {
                _id: '123456789012',
                name: 'Test User',
                email: 'test@test.com',
                password: 'password',
            };

            userRepository.deleteById.mockResolvedValue(mockUser);

            const result = await deleteUserById(mockUser._id);

            expect(userRepository.deleteById).toHaveBeenCalledTimes(1);
            expect(userRepository.deleteById).toHaveBeenCalledWith(mockUser._id);
        });

        it('should return null if no user is found', async () => {
            const mockId = '1';
            userRepository.deleteById.mockResolvedValue(null);
            const result = await deleteUserById(mockId);

            expect(result).toBeNull();
            expect(userRepository.deleteById).toHaveBeenCalledTimes(1);
        });

        it('should throw an error if fails', async () => {
            const mockId = '123456789012';

            userRepository.deleteById.mockRejectedValue(new Error());

            await expect(deleteUserById(mockId)).rejects.toThrow();
            expect(userRepository.deleteById).toHaveBeenCalledTimes(1);
            expect(userRepository.deleteById).toHaveBeenCalledWith(mockId);
        });
    });

    /**************************************************************************************************/

    // describe('getUsersByRanking', () => {
    //     it('should return all users ordered by ranking', async () => {

    //     });

    //     it('should return null if no user is found', async () => {

    //     });

    //     it('should throw an error if fails', async () => {

    //     });
    // });
});

const User = require('../.././src/models/user');
const { createUser, getAllUsers, getUserById, getUserByCredentials, updateUserById, deleteUserById, getUserByFilters, getUsersByRanking } = require('../.././src/services/userService');
const { getSkipPage } = require('../.././src/utils/utilities');

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
                const mockSave = jest.fn();
                jest.spyOn(User.prototype, 'save').mockImplementation(mockSave);
                const result = await createUser(mockUser);

                expect(result.email).toEqual(mockUser.email);
                expect(result.name).toEqual(mockUser.name);
                expect(result.password).toEqual(undefined);
                expect(mockSave).toHaveBeenCalled();
            });

            it('should throw an error when user data is invalid', async () => {
            const userData = {
                name: 'Test User',
                email: 'invalid-email',
                password: '123'
            };
            const mockSave = jest.fn().mockRejectedValue(new Error());
            jest.spyOn(User.prototype, 'save').mockImplementation(mockSave);

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

            jest.spyOn(User, 'findOne').mockResolvedValueOnce(user);

            const result = await getUserByCredentials(email);

            expect(User.findOne).toHaveBeenCalledWith({ email });
            expect(result).toEqual(user);
        });

        it('should return null if the credentials are incorrect', async () => {
            const email = 'test@test.com';

            jest.spyOn(User, 'findOne').mockResolvedValueOnce(null);

            const result = await getUserByCredentials(email);

            expect(User.findOne).toHaveBeenCalledWith({ email });
            expect(result).toBeNull();
        });

        it('should throw an error if there is a problem retrieving the user', async () => {
            const email = 'test@test.com';

            jest.spyOn(User, 'findOne').mockRejectedValueOnce(new Error());

            await expect(getUserByCredentials(email)).rejects.toThrow();
            expect(User.findOne).toHaveBeenCalledWith({ email });
        });
    });

    /**************************************************************************************************/

    describe('getUserByFilters', () => {
        test('should return user if found', async () => {
            const mockUser = { _id: '123', email: 'test@test.com' };
            // User.find = jest.fn().mockReturnValue({
            //     find: jest.fn().mockResolvedValue(null)
            // });
            const mockSelect = jest.fn().mockReturnThis(mockUser);
            const mockFind = jest.fn().mockReturnValue({ select: mockSelect }); 

            jest.spyOn(User, 'find').mockImplementation(mockFind);
            const filters = { email: 'test@test.com' };
            const result = await getUserByFilters(filters);

            expect(User.find).toHaveBeenCalledWith(filters);
            expect(result).notNull;
        });

        test("should not return user ", async () => {
            const body = { name: 'Test' };

            const findMock = jest.spyOn(User, 'find').mockReturnValue({
                select: jest.fn().mockReturnValue(null),
                exec: jest.fn().mockResolvedValue(null),
            });
        
            const result = await getUserByFilters(body);
        
            expect(findMock).toHaveBeenCalledWith(body);
            expect(result).toBeNull();
        });

        test('should throw an error if the database throws an error', async () => {
            const findMock = jest.spyOn(User, 'find').mockResolvedValue({
                select: jest.fn().mockResolvedValue(),
                exec: jest.fn().mockRejectedValue(new Error()),
            });

            const filters = { email: 'test@test.com' };
            expect(getUserByFilters(filters)).rejects.toThrow();
            expect(User.find).toHaveBeenCalledWith(filters);
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

            const findMock = jest.spyOn(User, 'find').mockReturnValue({
                    select: jest.fn().mockReturnValue(mockUsers),
                    exec: jest.fn().mockResolvedValue(mockUsers),
                });

            const result = await getAllUsers();

            expect(findMock).toHaveBeenCalled();
            expect(result).toEqual(mockUsers);

            expect(result.length).toBe(mockUsers.length);
            expect(result[0].name).toBe(mockUsers[0].name);
            expect(result[1].name).toBe(mockUsers[1].name);
        });

        it('should return empty array if no users are found', async () => {
            const findMock = jest.spyOn(User, 'find').mockReturnValue({
                select: jest.fn().mockReturnValue(null),
                exec: jest.fn().mockResolvedValue(null),
            });
            const result = await getAllUsers();

            expect(findMock).toHaveBeenCalled();
            expect(result).toEqual(null);
        });

        it('should throw an error when user data is invalid', async () => {
            const findMock = jest.spyOn(User, 'find').mockResolvedValue({
                select: jest.fn().mockResolvedValue(),
                exec: jest.fn().mockRejectedValue(new Error()),
            });

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

            const mockFindByIdAndUpdate = jest.spyOn(User, 'findByIdAndUpdate').mockReturnValue({
                select: jest.fn().mockResolvedValue(updatedUser),
                exec: jest.fn().mockResolvedValue(updatedUser),
            });

            const result = await updateUserById(id, newData);

            expect(User.findByIdAndUpdate).toHaveBeenCalledWith(id, newData, { new: true });
            expect(result).toEqual(updatedUser);
        });

        test('should return null if no user is found with the given id', async () => {
            const id = '123';
            const newData = { name: 'Test', email: 'Test@example.com' };

            const mockFindByIdAndUpdate = jest.spyOn(User, 'findByIdAndUpdate').mockReturnValue({
                select: jest.fn().mockResolvedValue(null),
                exec: jest.fn().mockResolvedValue(null),
            });

            const result = await updateUserById(id, newData);

            expect(User.findByIdAndUpdate).toHaveBeenCalledWith(id, newData, { new: true });
            expect(result).toBeNull();
        });

        test('should throw an error if the database throws an error', async () => {
            const id = '123';
            const newData = { name: 'Test', email: 'Test@example.com' };
            const mockFindByIdAndUpdate = jest.spyOn(User, 'findByIdAndUpdate').mockResolvedValue({
                select: jest.fn().mockRejectedValue(new Error()),
                exec: jest.fn().mockResolvedValue(),
            });

            await expect(updateUserById(id, newData)).rejects.toThrow();
            await expect(User.findByIdAndUpdate).toHaveBeenCalledWith(id, newData, { new: true });
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

            const mockDeleteOne = jest.spyOn(User, 'deleteOne').mockReturnValue({
                select: jest.fn().mockResolvedValue(mockUser),
                exec: jest.fn().mockResolvedValue(mockUser),
            });

            const result = await deleteUserById(mockUser._id);

            expect(User.deleteOne).toHaveBeenCalledTimes(1);
            expect(User.deleteOne).toHaveBeenCalledWith({ _id: mockUser._id });
        });

        it('should return null if no user is found', async () => {
            const mockId = '1';
            const mockDeleteOne = jest.spyOn(User, 'deleteOne').mockReturnValue({
                select: jest.fn().mockResolvedValue({deletedCount:0}),
                exec: jest.fn().mockResolvedValue({deletedCount:0}),
            });
            const result = await deleteUserById(mockId);

            expect(result).toBeNull();
            expect(User.deleteOne).toHaveBeenCalledTimes(1);
        });

        it('should throw an error if fails', async () => {
            const mockId = '123456789012';

            const mockDeleteOne = jest.spyOn(User, 'deleteOne').mockResolvedValue({
                select: jest.fn().mockRejectedValue(new Error()),
                exec: jest.fn().mockResolvedValue(),
            });

            await expect(deleteUserById(mockId)).rejects.toThrow();
            expect(User.deleteOne).toHaveBeenCalledTimes(1);
            expect(User.deleteOne).toHaveBeenCalledWith({ _id: mockId });
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

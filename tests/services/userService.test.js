const User = require('../.././src/models/user');
const { createUser, getAllUsers, getUserById, getUserByCredentials, updateUserById, deleteUserById, getUserByFilters } = require('../.././src/services/userService');
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
            expect(result.password).toEqual(mockUser.password);
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
            User.find = jest.fn().mockReturnValue({
                find: jest.fn().mockResolvedValue(null)
            });

            const filters = { email: 'test@test.com' };
            const result = await getUserByFilters(filters);

            expect(User.find).toHaveBeenCalledWith(filters);
            expect(result).notNull;
        });

        test("should not return user ", async () => {
            const body = { name: "Test" };
            jest.spyOn(User, "find").mockResolvedValue(null);

            const result = await getUserByFilters(body);
            expect(result).toBeNull();
        });

        test('should throw an error if the database throws an error', async () => {
            const mockFind = jest.fn().mockRejectedValue(new Error());
            jest.spyOn(User, 'find').mockImplementation(mockFind);

            const filters = { email: 'test@test.com' };
            await expect(getUserByFilters(filters)).rejects.toThrow();
            expect(User.find).toHaveBeenCalledWith(filters);
        });
    });

    /**************************************************************************************************/

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

            const findMock = jest.spyOn(User, 'find').mockResolvedValue(mockUsers);

            const result = await getAllUsers();

            expect(findMock).toHaveBeenCalled();
            expect(result).toEqual(mockUsers);

            expect(result.length).toBe(mockUsers.length);
            expect(result[0].name).toBe(mockUsers[0].name);
            expect(result[1].name).toBe(mockUsers[1].name);
        });

        it('should return empty array if no users are found', async () => {
            const mockUsers = [];
            const spy = jest.spyOn(User, 'find').mockResolvedValue(mockUsers);
            const result = await getAllUsers();

            expect(spy).toHaveBeenCalled();
            expect(result).toEqual(null);
        });

        it('should throw an error when user data is invalid', async () => {
            User.find = jest.fn().mockRejectedValue(new Error());

            await expect(getAllUsers()).rejects.toThrow();
        });
    });

    /**************************************************************************************************/

    describe('getUserById', () => {
        test('should return a user if found', async () => {
            const mockUser = { _id: '123', name: 'Test User', email: 'test@test.com' };
            const mockFindById = jest.spyOn(User, 'findById');
            mockFindById.mockImplementation(() => Promise.resolve(mockUser));

            const result = await getUserById(mockUser._id);

            expect(mockFindById).toHaveBeenCalledWith(mockUser._id);
            expect(result).toEqual(mockUser);
        });

        test('should return null if no user is found', async () => {
            const mockFindById = jest.spyOn(User, 'findById');
            mockFindById.mockImplementation(() => Promise.resolve(null));

            const result = await getUserById('123');

            expect(mockFindById).toHaveBeenCalledWith('123');
            expect(result).toBeNull();
        });

        test('should throw an error if there is an error during query', async () => {
            const mockFindById = jest.spyOn(User, 'findById');
            mockFindById.mockImplementation(() => Promise.reject(new Error()));

            await expect(getUserById('123')).rejects.toThrow();
            expect(mockFindById).toHaveBeenCalledWith('123');
        });
    });

    /**************************************************************************************************/

    describe('updateUserById', () => {
        test('should update and return the user with the given id', async () => {
            const id = '123';
            const newData = { name: 'Test', email: 'Test@example.com' };
            const updatedUser = { _id: id, ...newData };

            jest.spyOn(User, 'findByIdAndUpdate').mockResolvedValue(updatedUser);

            const result = await updateUserById(id, newData);

            expect(User.findByIdAndUpdate).toHaveBeenCalledWith(id, newData, { new: true });
            expect(result).toEqual(updatedUser);
        });

        test('should return null if no user is found with the given id', async () => {
            const id = '123';
            const newData = { name: 'Test', email: 'Test@example.com' };

            jest.spyOn(User, 'findByIdAndUpdate').mockResolvedValue(null);

            const result = await updateUserById(id, newData);

            expect(User.findByIdAndUpdate).toHaveBeenCalledWith(id, newData, { new: true });
            expect(result).toBeNull();
        });

        test('should throw an error if the database throws an error', async () => {
            const id = '123';
            const newData = { name: 'Test', email: 'Test@example.com' };

            jest.spyOn(User, 'findByIdAndUpdate').mockRejectedValue(new Error());

            await expect(updateUserById(id, newData)).rejects.toThrow();
            expect(User.findByIdAndUpdate).toHaveBeenCalledWith(id, newData, { new: true });
        });
    });

    /**************************************************************************************************/

    describe('deleteUserById', () => {
        it('should delete an user', async () => {
            const mockUser = {
                _id: '123456789012',
                name: 'Test User',
                email: 'test@test.com',
                password: 'password',
            };

            jest.spyOn(User, 'deleteOne').mockResolvedValue({ deletedCount: 1 });

            const result = await deleteUserById(mockUser._id);

            expect(User.deleteOne).toHaveBeenCalledTimes(1);
            expect(User.deleteOne).toHaveBeenCalledWith({ _id: mockUser._id });
            expect(result).toEqual({ deletedCount: 1 });
        });

        it('should return null if no user is found', async () => {
            const mockId = null;
            jest.spyOn(User,'deleteOne').mockResolvedValue(null);
            const result = await deleteUserById(mockId);

            expect(result).toBeNull();
            expect(User.deleteOne).toHaveBeenCalledTimes(1);
            expect(User.deleteOne).toHaveBeenCalledWith({"_id": null});
        });

        it('should throw an error if fails', async () => {
            const mockId = '123456789012';

            jest.spyOn(User, 'deleteOne').mockRejectedValue(new Error());

            await expect(deleteUserById(mockId)).rejects.toThrow();
            expect(User.deleteOne).toHaveBeenCalledTimes(1);
            expect(User.deleteOne).toHaveBeenCalledWith({ _id: mockId });
        });
    });
});

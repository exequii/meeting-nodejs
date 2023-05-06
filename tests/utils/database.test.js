const { connectToDatabase } = require('../.././src/utils/database');
const mongoose = require('mongoose');

jest.mock('mongoose', () => ({
    set: jest.fn(),
    connect: jest.fn().mockReturnThis(true),
}));

describe('database', () => {
    beforeEach(() => {
        process.env.MONGODB_URL = 'mongodb+srv://dev:rRJqPSiXAPt3i3yH@cluster-meeting.vi0ksfc.mongodb.net/test';
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should call mongoose connect with the correct url', async () => {
        await connectToDatabase();
        expect(mongoose.connect).toHaveBeenCalledWith(process.env.MONGODB_URL);
    });

    it('should call mongoose set with the correct value', async () => {
        await connectToDatabase();
        expect(mongoose.set).toHaveBeenCalledWith('strictQuery', false);
    });

    /******************* */

    it('should call mongoose connect and log "Connected to database!" when successful', async () => {
        mongoose.connect.mockResolvedValueOnce();
        console.log = jest.fn();

        await connectToDatabase();

        expect(mongoose.connect).toHaveBeenCalledWith(process.env.MONGODB_URL);
        expect(console.log).toHaveBeenCalledWith('Connected to database!');
    });

    test('should call mongoose connect and log the error message when failed', async () => {
        const errorMessage = 'Connection failed!';
        mongoose.connect.mockRejectedValueOnce(new Error(errorMessage));
        console.log = jest.fn();

        await connectToDatabase();

        expect(mongoose.connect).toHaveBeenCalledWith(process.env.MONGODB_URL);
        expect(console.log).toHaveBeenCalledWith(expect.any(Error));
        expect(console.log.mock.calls[0][0].message).toBe(errorMessage); //debugeando el error se ve que es un objeto con un atributo message
    });

});
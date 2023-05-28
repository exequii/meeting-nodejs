const authMiddleware = require('../.././src/middlewares/authMiddleware');
const jwt = require('jsonwebtoken');

jest.mock('jsonwebtoken');

describe('authMiddleware', () => {
    let req;
    let res;
    let next;

    beforeEach(() => {
        req = {
            headers: {
                authorization: 'Bearer token'
            }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            setHeader: jest.fn()
        };
        next = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return 401 if authorization header is not found', async () => {
        req.headers.authorization = undefined;
        await authMiddleware(req, res, next);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Authorization header not found' });
    });

    it('should return 401 if token is invalid', async () => {
        jwt.verify.mockImplementation(() => {
            throw new Error();
        });
        await authMiddleware(req, res, next);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Invalid token' });
    });

    it('should set req.userId and call next if token is valid', async () => {
        jwt.verify.mockReturnValue({ userId: '123' });
        await authMiddleware(req, res, next);
        expect(req.userId).toBe('123');
        expect(next).toHaveBeenCalled();
    });

    //TODO ver refresh token
    // it('should set Authorization header with new token if remaining time is less than 1 hour', async () => {
    //     jwt.verify.mockReturnValue({ userId: '123', exp: Math.floor(Date.now() / 1000) + 30 });
    //     jwt.sign.mockReturnValue('newToken');
    //     await authMiddleware(req, res, next);
    //     expect(res.setHeader).toHaveBeenCalledWith('Authorization', 'Bearer newToken');
    //     expect(next).toHaveBeenCalled();
    // });

    it('should not set Authorization header with new token if remaining time is more than 1 hour', async () => {
        jwt.verify.mockReturnValue({ userId: '123', exp: Math.floor(Date.now() / 1000) + 60 * 60 });
        await authMiddleware(req, res, next);
        expect(res.setHeader).not.toHaveBeenCalled();
        expect(next).toHaveBeenCalled();
    });
});
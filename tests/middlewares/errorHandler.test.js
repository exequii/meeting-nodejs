const { logErrors, errorHandler, errorNotFound } = require("../.././src/middlewares/errorHandler")

describe('errorHandler middleware', () => {
    it('should log the error', () => {
        const err = new Error('Test Error');
        const req = {};
        const res = {};
        const next = jest.fn();
        console.error = jest.fn();

        logErrors(err, req, res, next);

        expect(console.error).toHaveBeenCalledWith(err);
        expect(next).toHaveBeenCalledWith(err);
    });

    it('should return a 404 error', () => {
        const req = {};
        const res = {};
        const next = jest.fn();

        errorNotFound(req, res, next);

        expect(next).toHaveBeenCalledWith(expect.any(Error));
        expect(next.mock.calls[0][0].status).toBe(404);
        expect(next.mock.calls[0][0].message).toBe('Not Found');
    });

    it('should return a 500 error', () => {
        const err = new Error('Test Error');
        const req = {};
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };
        const next = jest.fn();

        errorHandler(err, req, res, next);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith({ error: { message: err.message } });
        expect(res.json).toHaveBeenCalledTimes(1);
    });
});
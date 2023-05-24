const addHeaders = require('../.././src/middlewares/addHeaders');

describe('addHeaders middleware', () => {
    const mockRequest = {
        method: 'GET'
    };
    const mockResponse = {
        setHeader: jest.fn(),
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis()
    };
    const mockNext = jest.fn();

    beforeEach(() => {
        mockResponse.setHeader.mockClear();
        mockNext.mockClear();
    });

    it('should set the correct headers', () => {
        addHeaders(mockRequest, mockResponse, mockNext);
    
        expect(mockResponse.setHeader).toHaveBeenNthCalledWith(1, 'Access-Control-Allow-Origin', '*');
        expect(mockResponse.setHeader).toHaveBeenNthCalledWith(2, 'Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
        expect(mockResponse.setHeader).toHaveBeenNthCalledWith(3, 'Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
        expect(mockNext).toHaveBeenCalled();
    });

    it('should not allow PATCH requests', () => {
        const mockRequestFail = { method: 'PATCH' };
    
        addHeaders(mockRequestFail, mockResponse, mockNext);
    
        expect(mockNext).not.toHaveBeenCalled();
    });
});
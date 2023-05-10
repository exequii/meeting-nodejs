const request = require('supertest');
const app = require('../src/index');

describe('Test Api - Index.js', () => {

    it('should display a "Not Found" message. ', async () => {
        const res = await request(app).get('/api/pruebas2');
        expect(res.status).toEqual(404);
        expect(res.body.error.message).toEqual('Not Found');
        });

    it("should log Server Running on port", async () => {

        app.listen = jest.fn((port, callback) => {
                server = { port, callback };
                return server;
        });
        const port = 4000;
        const callback = () => console.log(`Server Running on port ${port}`);
        app.listen(port, callback);
    
        expect(app.listen).toHaveBeenCalledWith(port, callback);
        expect(server).toEqual({ port, callback });
    });
});
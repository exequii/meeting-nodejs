const {createMessage, getMessagesByFilters, updateMessageById, deleteMessageById } = require('../.././src/controllers/messageController');
const messageService = require('../.././src/services/messageService');
jest.mock('../.././src/services/messageService');

describe('Message Controller', () => {

    afterEach(() => {
        jest.clearAllMocks();
    });

    const fakeReq = {
        params: {
            id: "60a9b0b9e1b3a1b4b8b0b8b0"
        },
        body: {
            message: "Message 1",
            date: "2021-05-05T00:00:00.000Z",
            author: "60a9b0b9e1b3a1b4b8b0b8b0",
            post: "60a9b0b9e1b3a1b4b8b0b8b0"
        },
    }

    const fakeRes = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
    };


    describe('createMessage', () => {
        it('should create a message', async () => {
            const fakeMessage = fakeReq.body;
            messageService.createMessage.mockResolvedValue(fakeMessage);
            await createMessage(fakeReq, fakeRes);

            expect(fakeRes.json).toHaveBeenCalledWith(fakeMessage);
            expect(messageService.createMessage).toHaveBeenCalledWith(fakeReq.body);
            expect(fakeRes.status).toHaveBeenCalledWith(201);
        });

        it('should return a 500 if an error occurs', async () => {
            const fakeError = new Error({message:'Error'});
            messageService.createMessage.mockRejectedValue(fakeError);
            await createMessage(fakeReq, fakeRes);

            expect(fakeRes.json).toHaveBeenCalledWith({ message: 'Internal server error', error: fakeError.message });
            expect(fakeRes.status).toHaveBeenCalledWith(500);
        });
    });

    /**************************************************************** */

    describe('updateMessageById', () => {
        it('should update a message', async () => {
            const fakeMessage = fakeReq.body;
            messageService.updateMessageById.mockResolvedValue(fakeMessage);
            await updateMessageById(fakeReq, fakeRes);

            expect(fakeRes.json).toHaveBeenCalledWith(fakeMessage);
            expect(messageService.updateMessageById).toHaveBeenCalledWith(fakeReq.params.id, fakeReq.body);
            expect(fakeRes.status).toHaveBeenCalledWith(200);
        });

        it('should return a 404 if no message is found', async () => {
            const fakeMessage = null;
            messageService.updateMessageById.mockResolvedValue(fakeMessage);
            await updateMessageById(fakeReq, fakeRes);

            expect(fakeRes.json).toHaveBeenCalledWith({ message: 'Message not found' });
            expect(fakeRes.status).toHaveBeenCalledWith(404);
        });

        it('should return a 500 if an error occurs', async () => {
            const fakeError = new Error({message:'Error'});
            messageService.updateMessageById.mockRejectedValue(fakeError);
            await updateMessageById(fakeReq, fakeRes);

            expect(fakeRes.json).toHaveBeenCalledWith({ message: 'Internal server error', error: fakeError.message });
            expect(fakeRes.status).toHaveBeenCalledWith(500);
        });
    });
    
    /**************************************************************** */

    
    describe('deleteMessageById', () => {
        it('should delete a message', async () => {
            const fakeMessage = fakeReq.body;
            messageService.deleteMessageById.mockResolvedValue(fakeMessage);
            await deleteMessageById(fakeReq, fakeRes);

            expect(fakeRes.json).toHaveBeenCalledWith(fakeMessage);
            expect(messageService.deleteMessageById).toHaveBeenCalledWith(fakeReq.params.id);
            expect(fakeRes.status).toHaveBeenCalledWith(200);
        });

        it('should return a 404 if no message is found', async () => {
            const fakeMessage = null;
            messageService.deleteMessageById.mockResolvedValue(fakeMessage);
            await deleteMessageById(fakeReq, fakeRes);

            expect(fakeRes.json).toHaveBeenCalledWith({ message: 'Message not found' });
            expect(fakeRes.status).toHaveBeenCalledWith(404);
        });

        it('should return a 500 if an error occurs', async () => {
            const fakeError = new Error({message:'Error'});
            messageService.deleteMessageById.mockRejectedValue(fakeError);
            await deleteMessageById(fakeReq, fakeRes);

            expect(fakeRes.json).toHaveBeenCalledWith({ message: 'Internal server error', error: fakeError.message });
            expect(fakeRes.status).toHaveBeenCalledWith(500);
        });

    });

});
const {createMessage, getMessagesByFilters, updateMessageById, deleteMessageById } = require('../../../src/delivery/controllers/messageController');
const messageService = require('../../../src/domain/services/messageService');
const Message = require('../../../src/domain/models/message');
jest.mock('../../../src/domain/services/messageService');

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
            //given
            const fakeMessage = givenAFullMessage(fakeReq.body);
            //when
            await whenSaveTheMessage(fakeMessage,fakeReq,fakeRes);
            //then
            thenMessageSavedSuccessfully(fakeRes, fakeMessage,fakeReq);
        });

        it('should return a 500 if an error occurs', async () => {
            //given
            const fakeError = givenAFullMessageWithError();
            //when
            await whenSaveTheMessageWithError(fakeError,fakeReq,fakeRes);
            //then
            thenMessageRejected(fakeRes,fakeError);
        });
    });

    /**************************************************************** */

    describe('updateMessageById', () => {
        it('should update a message', async () => {
            //given
            const fakeMessage = givenAFullMessage(fakeReq.body);
            //when
            await whenUpdateTheMessage(fakeMessage,fakeReq, fakeRes);
            //then
            thenMessageUpdatedSuccessfully(fakeRes, fakeMessage,fakeReq);
        });

        it('should return a 204 if no message is found', async () => {
            //given
            const fakeMessage = givenANullMessage();
            //when
            await whenUpdateTheMessage(fakeMessage,fakeReq, fakeRes);
            //then
            thenUpdateOrDeleteWithNullMessage(fakeRes);
        });

        it('should return a 500 if an error occurs', async () => {
            //given
            const fakeError = givenAFullMessageWithError();
            //when
            await whenUpdateTheMessageWithError(fakeError,fakeReq, fakeRes);
            //then
            thenUpdateOrDeleteMessage(fakeRes,fakeError);
        });
    });
    
    /**************************************************************** */

    
    describe('deleteMessageById', () => {
        it('should delete a message', async () => {
            //given
            const fakeMessage = givenAFullMessage(fakeReq.body);
            //when
            await whenDeleteTheMessage(fakeMessage,fakeReq, fakeRes);
            //then
            thenMessageDeletedSuccessfully(fakeRes, fakeMessage,fakeReq);
        });

        it('should return a 204 if no message is found', async () => {
            //given
            const fakeMessage = givenANullMessage();
            //when
            await whenDeleteTheMessage(fakeMessage,fakeReq, fakeRes);
            //then
            thenUpdateOrDeleteWithNullMessage(fakeRes);
        });

        it('should return a 500 if an error occurs', async () => {
            //given
            const fakeError = givenAFullMessageWithError();
            //when
            await whenDeleteTheMessageWithError(fakeError,fakeReq, fakeRes);
            //then
            thenUpdateOrDeleteMessage(fakeRes,fakeError);
        });

    });

    /*************************************************************************** GIVEN ********************************************************************/

    const givenAFullMessage = (fakeMessage) => {
        const message = new Message(fakeMessage);
        if(message.validateEssentialData()) return message;
        else return new Error("");
    }

    const givenAFullMessageWithError = () => {
        const message = new Message({});
        if(message.validateEssentialData()) return message;
        else return new Error("Error");
    }

    const givenANullMessage = () => {
        return null;
    }

/*************************************************************************** WHEN ********************************************************************/

    const whenSaveTheMessage = async (fakeMessage,fakeReq,fakeRes) => {
        messageService.createMessage.mockResolvedValue(fakeMessage);
        return await createMessage(fakeReq, fakeRes);
    }

    const whenSaveTheMessageWithError = async (fakeError,fakeReq,fakeRes) => {
        messageService.createMessage.mockRejectedValue(fakeError);
        return await createMessage(fakeReq, fakeRes);
    }

    const whenUpdateTheMessage = async (fakeMessage,fakeReq,fakeRes) => {
        messageService.updateMessageById.mockResolvedValue(fakeMessage);
        return await updateMessageById(fakeReq, fakeRes);
    }

    const whenUpdateTheMessageWithError = async (fakeError,fakeReq,fakeRes) => {
        messageService.updateMessageById.mockRejectedValue(fakeError);
        return await updateMessageById(fakeReq, fakeRes);
    }

    const whenDeleteTheMessage = async (fakeMessage,fakeReq,fakeRes) => {
        messageService.deleteMessageById.mockResolvedValue(fakeMessage);
        return await deleteMessageById(fakeReq, fakeRes);
    }

    const whenDeleteTheMessageWithError = async (fakeError,fakeReq,fakeRes) => {
        messageService.deleteMessageById.mockRejectedValue(fakeError);
        return await deleteMessageById(fakeReq, fakeRes);
    }

/*************************************************************************** THEN ********************************************************************/

    const thenMessageSavedSuccessfully = (fakeRes, fakeMessage,fakeReq) => {
        expect(fakeRes.json).toHaveBeenCalledWith(fakeMessage);
        expect(messageService.createMessage).toHaveBeenCalledWith(fakeReq.body);
        expect(fakeRes.status).toHaveBeenCalledWith(201);
    }

    const thenMessageRejected = (fakeRes, fakeError) => {
        expect(fakeRes.json).toHaveBeenCalledWith({ message: 'Internal server error', error: fakeError.message });
        expect(fakeRes.status).toHaveBeenCalledWith(500);
    }

    const thenUpdateOrDeleteWithNullMessage = (fakeRes) => {
        expect(fakeRes.json).toHaveBeenCalledWith({ message: 'Message not found' });
        expect(fakeRes.status).toHaveBeenCalledWith(204);
    }

    const thenUpdateOrDeleteMessage = (fakeRes, fakeError) => {
        expect(fakeRes.json).toHaveBeenCalledWith({ message: 'Internal server error', error: fakeError.message });
        expect(fakeRes.status).toHaveBeenCalledWith(500);
    }

    const thenMessageUpdatedSuccessfully = (fakeRes, fakeMessage,fakeReq) => {
        expect(fakeRes.json).toHaveBeenCalledWith(fakeMessage);
        expect(messageService.updateMessageById).toHaveBeenCalledWith(fakeReq.params.id,fakeReq.body);
        expect(fakeRes.status).toHaveBeenCalledWith(200);
    }

    const thenMessageDeletedSuccessfully = (fakeRes, fakeMessage,fakeReq) => {
        expect(fakeRes.json).toHaveBeenCalledWith(fakeMessage);
        expect(messageService.deleteMessageById).toHaveBeenCalledWith(fakeReq.params.id);
        expect(fakeRes.status).toHaveBeenCalledWith(200);
    }

});





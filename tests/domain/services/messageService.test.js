const messageRepository = require('../../../src/infrastructure/persistence/messageRepository');
const { createMessage, updateMessageById, deleteMessageById } = require("../../../src/domain/services/messageService");
jest.mock('../../../src/infrastructure/persistence/messageRepository');

describe("Message Service Test", () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    const message = {
        message: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
        date: "19/10/2020",
        author: "60a9b0b9e1b3a1b4b8b0b8b0",
        post: "60a9b0b9e1b3a1b4b8b0b8b0"
    };

    const id = "60a9b0b9e1b3a1b4b8b0b8b0";

    describe("createMessage", () => {
        it('should create a message', async () => {
            messageRepository.create.mockResolvedValue(message);
            const result = await createMessage(message);

            expect(result.message).toEqual(message.message);
            expect(result.date).toEqual(message.date);
            expect(result.author).toEqual(message.author);
            expect(messageRepository.create).toHaveBeenCalled();
        });

        it('should return an error if an error occurs', async () => {
            messageRepository.create.mockRejectedValue(new Error("Error"));
            await expect(createMessage(message)).rejects.toThrowError("Error");
            expect(messageRepository.create).toHaveBeenCalled();
        });
    });

//     /****************************************************************** */

    describe("updateMessageById", () => {
        it('should update a message', async () => {
            messageRepository.updateById.mockResolvedValue(message);
            const result = await updateMessageById(id, message);

            expect(result.message).toEqual(message.message);
            expect(result.date).toEqual(message.date);
            expect(result.author).toEqual(message.author);
            expect(messageRepository.updateById).toHaveBeenCalled();
        });

        it('should return an error if an error occurs', async () => {
            messageRepository.updateById.mockRejectedValue(new Error("Error"));
            await expect(updateMessageById(id, message)).rejects.toThrowError("Error");
            expect(messageRepository.updateById).toHaveBeenCalled();
        });

        it('should return an error if the message does not exist', async () => {
            messageRepository.updateById.mockResolvedValue(null);
            const result = await updateMessageById(id, message)
            expect(result).toEqual(null);
            expect(messageRepository.updateById).toHaveBeenCalled();
        });
    });

//     /****************************************************************** */

    describe("deleteMessageById", () => {
        it('should delete a message', async () => {
            messageRepository.deleteById.mockResolvedValue(message);
            const result = await deleteMessageById(id);

            expect(result.message).toEqual(message.message);
            expect(result.date).toEqual(message.date);
            expect(result.author).toEqual(message.author);
            expect(messageRepository.deleteById).toHaveBeenCalled();
        });

        it('should return an error if an error occurs', async () => {
            messageRepository.deleteById.mockRejectedValue(new Error("Error"));
            await expect(deleteMessageById(id)).rejects.toThrowError("Error");
            expect(messageRepository.deleteById).toHaveBeenCalled();
        });

        it('should return an error if the message does not exist', async () => {
            messageRepository.deleteById.mockResolvedValue(null);
            const result = await deleteMessageById(id)
            expect(result).toEqual(null);
            expect(messageRepository.deleteById).toHaveBeenCalled();
        });
    });

});
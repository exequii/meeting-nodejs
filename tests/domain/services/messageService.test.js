// const Message = require("../.././src/models/message");
// const { createMessage, updateMessageById, deleteMessageById } = require("../.././src/services/messageService");
// const Utils = require("../.././src/utils/utilities");
// jest.mock('../.././src/utils/utilities');

// describe("Message Service Test", () => {
//     afterEach(() => {
//         jest.restoreAllMocks();
//     });

//     const message = {
//         _id: "60a9b0b9e1b3a1b4b8b0b8b0",
//         title: "Message 1",
//         body: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
//         date: "2021-05-05T00:00:00.000Z",
//         author: "60a9b0b9e1b3a1b4b8b0b8b0",
//         project: "60a9b0b9e1b3a1b4b8b0b8b0"
//     };

//     describe("createMessage", () => {
//         it('should create a message', async () => {
//             const spy = jest.spyOn(Utils, "createMessageAndUpdateRelations").mockImplementation(jest.fn().mockResolvedValue(message));
//             const result = await createMessage(message);

//             expect(result.title).toEqual(message.title);
//             expect(result.body).toEqual(message.body);
//             expect(result.author).toEqual(message.author);
//             expect(spy).toHaveBeenCalled();
//         });

//         it('should return an error if an error occurs', async () => {
//             const spy = jest.spyOn(Utils, "createMessageAndUpdateRelations").mockImplementation(jest.fn().mockRejectedValue(new Error("Error")));
//             await expect(createMessage(message)).rejects.toThrowError("Error");
//             expect(spy).toHaveBeenCalled();
//         });
//     });

//     /****************************************************************** */

//     describe("updateMessageById", () => {
//         it('should update a message', async () => {
//             const spy = jest.spyOn(Message, "findByIdAndUpdate").mockImplementation(jest.fn().mockResolvedValue(message));
//             const result = await updateMessageById(message._id, message);

//             expect(result.title).toEqual(message.title);
//             expect(result.body).toEqual(message.body);
//             expect(result.author).toEqual(message.author);
//             expect(spy).toHaveBeenCalled();
//         });

//         it('should return an error if an error occurs', async () => {
//             const spy = jest.spyOn(Message, "findByIdAndUpdate").mockImplementation(jest.fn().mockRejectedValue(new Error("Error")));
//             await expect(updateMessageById(message._id, message)).rejects.toThrowError("Error");
//             expect(spy).toHaveBeenCalled();
//         });

//         it('should return an error if the message does not exist', async () => {
//             const spy = jest.spyOn(Message, "findByIdAndUpdate").mockImplementation(jest.fn().mockResolvedValue(null));
//             const result = await updateMessageById(message._id, message)
//             expect(result).toEqual(null);
//             expect(spy).toHaveBeenCalled();
//         });
//     });

//     /****************************************************************** */

//     describe("deleteMessageById", () => {
//         it('should delete a message', async () => {
//             const spy = jest.spyOn(Message, "findByIdAndDelete").mockImplementation(jest.fn().mockResolvedValue(message));
//             const result = await deleteMessageById(message._id);

//             expect(result.title).toEqual(message.title);
//             expect(result.body).toEqual(message.body);
//             expect(result.author).toEqual(message.author);
//             expect(spy).toHaveBeenCalled();
//         });

//         it('should return an error if an error occurs', async () => {
//             const spy = jest.spyOn(Message, "findByIdAndDelete").mockImplementation(jest.fn().mockRejectedValue(new Error("Error")));
//             await expect(deleteMessageById(message._id)).rejects.toThrowError("Error");
//             expect(spy).toHaveBeenCalled();
//         });

//         it('should return an error if the message does not exist', async () => {
//             const spy = jest.spyOn(Message, "findByIdAndDelete").mockImplementation(jest.fn().mockResolvedValue(null));
//             const result = await deleteMessageById(message._id)
//             expect(result).toEqual(null);
//             expect(spy).toHaveBeenCalled();
//         });
//     });

// });
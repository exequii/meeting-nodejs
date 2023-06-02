const Message = require('../models/message');
const MessageRepository = require('../../infrastructure/persistence/messageRepository');

const createMessage = async (messageData) => {
    try{
        let message = new Message(messageData);
        console.log(message)
        if (!message.validateEssentialData()) throw new Error("Invalid message data");
        return await MessageRepository.create(message);
    }catch(error){
        throw new Error(error);
    }
}

const updateMessageById = async (id, newData) => {
    try{
        const messageUpdated = await MessageRepository.updateById(id,newData, { new: true });
        if(!messageUpdated) return null;
        return messageUpdated;
    }catch(error){
        throw new Error(error);
    }
}

const deleteMessageById = async (id) => {
    try{
        const response = await MessageRepository.deleteById(id);
        if(!response) return null;
        return response;
    }catch(error){
        throw new Error(error);
    }
}

module.exports = {
    createMessage,
    updateMessageById,
    deleteMessageById,
}


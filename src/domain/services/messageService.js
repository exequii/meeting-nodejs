const Message = require('../models/message');
const { createMessageAndUpdateRelations } = require('../utils/utilities');

const createMessage = async (messageData) => {
    try{
        let message = new Message(messageData);
        message = await createMessageAndUpdateRelations(message);
        return message;
    }catch(error){
        throw new Error(error);
    }
}

const updateMessageById = async (id, newData) => {
    try{
        const messageUpdated = await Message.findByIdAndUpdate(id,newData, { new: true });
        if(!messageUpdated) return null;
        return messageUpdated;
    }catch(error){
        throw new Error(error);
    }
}

const deleteMessageById = async (id) => {
    try{
        const messageDeleted = await Message.findByIdAndDelete(id);
        if(!messageDeleted) return null;
        return messageDeleted;
    }catch(error){
        throw new Error(error);
    }
}

module.exports = {
    createMessage,
    updateMessageById,
    deleteMessageById,
}


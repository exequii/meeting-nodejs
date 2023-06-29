const Message = require('../schemas/message');
const { createMessageAndUpdateRelations } = require('../utils/utilitiesDatabase');

const create = async (messageData) => {
    try{
        let message = new Message(messageData);
        return await createMessageAndUpdateRelations(message);
    }catch(error){
        throw new Error(error);
    }
}

const updateById = async (id, newData) => {
    try{
        const messageUpdated = await Message.findByIdAndUpdate(id,newData, { new: true });
        if(!messageUpdated) return null;
        return messageUpdated;
    }catch(error){
        throw new Error(error);
    }
}

const deleteById = async (id) => {
    try{
        const messageDeleted = await Message.findByIdAndDelete(id);
        if(!messageDeleted) return null;
        return messageDeleted;
    }catch(error){
        throw new Error(error);
    }
}


module.exports = {create, updateById, deleteById };


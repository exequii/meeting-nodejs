const messageService = require('../../domain/services/messageService');

const createMessage = async (req, res) => {
    try{
        const message = await messageService.createMessage(req.body);
        res.status(201).json(message);
    }catch(error){
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}

const getMessagesByFilters = async (req, res) => {
    try{
        const messages = await messageService.getMessagesByFilters(req.body);
        if(!messages){
            return res.status(204).json({results:[], message: 'Messages not found' });
        }
        res.status(200).json(messages);
    }catch(error){
        res.status(500).json({ message: 'Internal Server Error' ,error: error.message});
    }
}


const updateMessageById = async (req, res) => {
    try{
        const message = await messageService.updateMessageById(req.params.id, req.body);
        if(!message) {
            return res.status(204).json({ message: 'Message not found' })
        }
        res.status(200).json(message);
    }catch(error){
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}

const deleteMessageById = async (req, res) => {
    try{
        const message = await messageService.deleteMessageById(req.params.id);
        if(!message) {
            return res.status(204).json({ message: 'Message not found' })
        }
        res.status(200).json(message);
    }catch(error){
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}

module.exports = {
    createMessage,
    getMessagesByFilters,
    updateMessageById,
    deleteMessageById
}
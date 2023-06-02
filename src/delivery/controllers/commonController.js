const technologies = require("../../domain/models/technologies");

const getTechnologies = async (req, res) => {
    try{
        const response = technologies
        if(!response) return res.status(204).json({results:[], message: 'Technologies not found' });
        res.status(200).json(response);
    }catch(error){
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

module.exports = { getTechnologies }
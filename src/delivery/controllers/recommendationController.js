const recommendationService = require('../../domain/services/recommendationService');

const getRecommendation = async (req, res) => {
    try{
        const recommendation = await recommendationService.getRecommendation(req.body);
        res.status(200).json(recommendation);
    }catch(error){
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}


module.exports = { getRecommendation }
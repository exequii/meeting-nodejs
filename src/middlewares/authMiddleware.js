const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware = async (req, res, next) => {
  try {
    // const token = req.header('Authorization').replace('Bearer ', '');
    // const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // req.user = decoded;
    next();
  } catch (error) {
    // //console.error(error);
    // res.status(401).json({ message: 'Unauthorized' });
  }
};

module.exports = authMiddleware;
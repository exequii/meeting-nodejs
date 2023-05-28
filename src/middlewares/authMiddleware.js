const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization header not found' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.userId) {
      req.userId = decoded.userId;
    }

    //TODO VER Endpoint refresh token
    // const remainingTime = decoded.exp - Math.floor(Date.now() / 1000);
    // if (remainingTime < 60 * 60 * 24) {
    //   console.log("ENTRA EN IF DE TIEMPO")
    //   const newToken = jwt.sign({ userId: decoded.userId }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION });
    //   req.headers.authorization = 'Bearer ' + newToken;
    // }

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = authMiddleware;
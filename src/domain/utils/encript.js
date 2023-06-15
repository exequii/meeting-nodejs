const bcrypt = require('bcrypt');

const generateHash = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    return passwordHash;
};

const comparePasswordWithHash = async (password, passwordHash) => {
    const validPassword = await bcrypt.compare(password, passwordHash);
    return validPassword;
};

module.exports = { 
    generateHash,
    comparePasswordWithHash,
};


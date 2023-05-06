const bcrypt = require('bcrypt');

async function generateHash (password) {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    return passwordHash;
}

async function comparePasswordWithHash (password, passwordHash) {
    const validPassword = await bcrypt.compare(password, passwordHash);
    return validPassword;
}


module.exports = { generateHash, comparePasswordWithHash };


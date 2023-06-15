const bcrypt = require('bcrypt');
const { generateHash, comparePasswordWithHash} = require('../../../src/domain/utils/encript');

jest.mock('bcrypt', () => ({
    genSalt: jest.fn(() => Promise.resolve('mockedSalt')),
    hash: jest.fn((password, salt) => Promise.resolve(`mockedHash(${password},${salt})`)),
    compare: jest.fn((password, passwordHash) => Promise.resolve(password === passwordHash))
}));

describe('generateHash', () => {
    it('should call bcrypt.genSalt() and bcrypt.hash() with the given password', async () => {
        const password = 'password';
        const expectedSalt = 'mockedSalt';
        const expectedHash = 'mockedHash(password,mockedSalt)';
        const passwordHash = await generateHash(password);
        expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
        expect(bcrypt.hash).toHaveBeenCalledWith(password, expectedSalt);
        expect(passwordHash).toEqual(expectedHash);
    });
});

describe('comparePasswordWithHash', () => {
    it('should call bcrypt.compare() with the given password and passwordHash', async () => {
        const password = 'password';
        const passwordHash = 'password';
        const validPassword = await comparePasswordWithHash(password, passwordHash);
        expect(bcrypt.compare).toHaveBeenCalledWith(password, passwordHash);
        expect(validPassword).toEqual(true);
    });
});



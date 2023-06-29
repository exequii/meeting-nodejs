const { getSkipPage } = require('../../../src/infrastructure/utils/utilitiesDatabase');


describe('getSkipPage', () => {
    it('should return the correct skipPage', () => {
        const pagination = '1';
        const skipPage = 0;
        expect(getSkipPage(pagination)).toEqual(skipPage);
    });
});
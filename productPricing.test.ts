import { getProductPrice } from './productPricing'

describe('getting the price of products', () => {
    it('returns the price of a single valid item', () => {
        expect(getProductPrice('linguine')).toEqual(1.49);
    });
});
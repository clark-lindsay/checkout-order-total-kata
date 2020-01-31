import { getProductPrice } from './productPricing'

describe('getting the price of products', () => {
    it('returns the price of a single valid item', () => {
        expect(getProductPrice('linguine')).toEqual(1.49);
    });

    it('returns the price for an item that is priced by weight', () => {
        expect(getProductPrice('parmesan', 0.8)).toEqual(8);
    });

    it('throws an error if the product is not carried', () => {
        expect(() => getProductPrice('productThatDoesNotExist')).toThrow();
    });

    it('throws an error if the product is priced by weight and no weight is given', () => {
        expect(() => getProductPrice('parmesan')).toThrow();
    });

    it('can support a markdown on a product', () => {
        expect(getProductPrice('black beans')).toEqual(0.79);
    });
});
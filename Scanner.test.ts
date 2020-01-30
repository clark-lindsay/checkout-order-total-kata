import { Scanner } from './Scanner'

describe('Scanner', () => {
    it('returns the price of a valid item', () => {
        const scanner = new Scanner();
        expect(scanner.scan('linguine')).toEqual(1.49);
    });
});
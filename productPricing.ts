export function getProductPrice(product: string, weight: number = undefined) {
    if (productPrices[product]) {
        const { price, hasWeight } = productPrices[product];
        
        if (hasWeight && !weight) {
            throw Error(`A weight must be given to calculate a price for ${product}`);
        }
        return hasWeight ? price * weight : price;
    }
    throw Error(`${product} is not in the product catalog`);
}

const productPrices = {
    'linguine': { price: 1.49, hasWeight: false },
    'parmesan': { price: 10, hasWeight: true },
};
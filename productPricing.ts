export function getProductPrice(product: string, weight: number = undefined) {
    if (productPrices[product]) {
        var { price } = productPrices[product];
        const { pricedByWeight, markdown } = productPrices[product];

        price = applyMarkdown(price, markdown);
        if (pricedByWeight) {
            price = calculateWeightedPrice(price, weight);
        }

        return price;
    }
    throw Error(`${product} is not in the product catalog`);
}

function applyMarkdown(price: number, markdown: number) {
    return markdown ? (price - markdown) : price;
}

function calculateWeightedPrice(price: number, weight: number) {
    if (!weight) {
        throw Error(`A weight must be given to calculate a price for a per pound product`);
    }
    return price * weight;
}

const productPrices = {
    'linguine': { price: 1.49, pricedByWeight: false },
    'parmesan': { price: 10, pricedByWeight: true },
    'black beans': { price: 0.89, pricedByWeight: false, markdown: 0.1 },
};
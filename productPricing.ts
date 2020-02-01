const ProductDoesNotExistError = new Error(
  "This product is not in the product catalog"
);

export function getProductPrice(
  product: string,
  weight: number = undefined
): number {
  if (!productPrices[product]) {
    throw ProductDoesNotExistError;
  }
  var price = getUnitPrice(product);
  const markdown = getMarkdown(product);
  const isPricedByWeight = getIsPricedByWeight(product);

  price = applyMarkdown(price, markdown);
  if (isPricedByWeight) {
    price = calculateWeightedPrice(price, weight);
  }

  return price;
}

function getUnitPrice(product: string): number {
  return productPrices[product].price;
}

function getMarkdown(product: string): number {
  return productPrices[product].markdown;
}

function applyMarkdown(price: number, markdown: number): number {
  return markdown ? price - markdown : price;
}

function getIsPricedByWeight(product: string): boolean {
  return productPrices[product].isPricedByWeight;
}

function calculateWeightedPrice(price: number, weight: number): number {
  if (!weight) {
    throw Error(
      `A weight must be given to calculate a price for a per pound product`
    );
  }
  return price * weight;
}

const productPrices = {
  linguine: { price: 1.49, isPricedByWeight: false },
  parmesan: { price: 10, isPricedByWeight: true },
  "black beans": { price: 0.89, isPricedByWeight: false, markdown: 0.1 }
};

export function getProduct(name: string, amountOrWeight?: number): Product {
  if (!products[name]) {
    throw ProductDoesNotExistError(name);
  }
  return products[name](amountOrWeight);
}

export class Product {
  private name: string = '';
  private price: number = undefined;
  private isPricedByWeight: boolean = false;
  private amountOrWeight: number = 0;
  private markdown: number = 0;

  constructor(name: string, price: number, isPricedByWeight: boolean, amountOrWeight?: number) {
    if (isPricedByWeight && !amountOrWeight) {
      throw ProductNeedsWeightError(name);
    }
    this.name = name;
    this.price = price;
    this.isPricedByWeight = isPricedByWeight;
    this.amountOrWeight = amountOrWeight || 1;
  }

  getPrice(): number {
    const priceAfterMarkdown = this.price - this.markdown;
    const totalPrice = this.amountOrWeight * priceAfterMarkdown;
    return totalPrice > 0 ? totalPrice : 0;
  }

  getAmount(): number {
    return this.amountOrWeight;
  }

  setAmount(amountOrWeight: number): void {
    this.amountOrWeight = amountOrWeight;
  }

  getName(): string {
    return this.name;
  }

  setBasePrice(cost: number): void {
    this.price = cost;
  }

  setMarkdown(priceReduction: number): void {
    this.markdown = priceReduction;
  }
}

const products = {
  linguine: amount => new Product('linquine', 1.49, false, amount),
  parmesan: weight => new Product('parmesan', 10, true, weight),
  'black beans': amount => new Product('black beans', 0.89, false, amount),
  'red lentils': weight => new Product('red lentils', 1, true, weight),
  yogurt: amount => new Product('yogurt', 4, false, amount),
  'almond milk': amount => new Product('almond milk', 4, false, amount),
  banana: weight => new Product('banana', 0.77, true, weight)
};

const ProductDoesNotExistError = (name?: string) =>
  new Error(`${name || 'This product'} does not exist in the product catalog.`);
const ProductNeedsWeightError = (name?: string) => {
  new Error(
    `${name} is priced by weight. A weight must be given to calcultate the price of a product that is priced by weight.`
  );
};

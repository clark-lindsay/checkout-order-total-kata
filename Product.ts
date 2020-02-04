export function getProduct(name: string, weight?: number): Product {
  if (!products[name]) {
    throw ProductDoesNotExistError(name);
  }
  return products[name](weight);
}

export class Product {
  private name: string = "";
  private price: number = undefined;
  private isPricedByWeight: boolean = false;
  private weight: number = 0;
  private markdown: number = 0;

  constructor(
    name: string,
    price: number,
    isPricedByWeight: boolean,
    weight?: number
  ) {
    if (isPricedByWeight && !weight) {
      throw ProductNeedsWeightError(name);
    }
    this.name = name;
    this.price = price;
    this.isPricedByWeight = isPricedByWeight;
    this.weight = weight || 1;
  }

  getPrice(): number {
    const priceAfterMarkdown = this.price - this.markdown;
    const totalPrice = this.isPricedByWeight
      ? priceAfterMarkdown * this.weight
      : priceAfterMarkdown;
    return totalPrice > 0 ? totalPrice : 0;
  }

  setBasePrice(cost: number): void {
    this.price = cost;
  }

  setMarkdown(priceReduction: number): void {
    this.markdown = priceReduction;
  }
}

const products = {
  linguine: () => new Product("linquine", 1.49, false),
  parmesan: weight => new Product("parmesan", 10, true, weight),
  "black beans": () => new Product("black beans", 0.89, false),
  "red lentils": weight => new Product("red lentils", 1, true, weight),
  yogurt: () => new Product("yogurt", 4, false),
  "almond milk": () => new Product("almond milk", 4, false),
  banana: weight => new Product("banana", 0.77, true, weight)
};

const ProductDoesNotExistError = (name?: string) =>
  new Error(`${name || "This product"} does not exist in the product catalog.`);
const ProductNeedsWeightError = (name?: string) => {
  new Error(
    `${name} is priced by weight. A weight must be given to calcultate the price of a product that is priced by weight.`
  );
};

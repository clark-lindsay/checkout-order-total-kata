export function getProduct(name: string): Product {
  if (!products[name]) {
    throw new Error(`${name} does not exist in the product catalog`);
  }
  return products[name]();
}

export class Product {
  private name: string = "";
  private price: number = undefined;
  private isPricedByWeight: boolean = false;
  private markdown: number = 0;

  constructor(name: string, price: number, isPricedByWeight: boolean) {
    this.name = name;
    this.price = price;
    this.isPricedByWeight = isPricedByWeight;
  }

  getPrice(weight?: number): number {
    if (this.isPricedByWeight && !weight) {
      throw Error(
        `A weight must be given to calculate a price for a per pound product`
      );
    }
    const totalPrice =
      (weight ? this.price * weight : this.price) - this.markdown;
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
  parmesan: () => new Product("parmesan", 10, true),
  "black beans": () => new Product("black beans", 0.89, false)
};

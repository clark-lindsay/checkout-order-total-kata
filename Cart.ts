import { Product } from "./Product";

export class Cart {
  private contents: Product[] = [];
  constructor() {}

  add(item: Product) {
    this.contents.push(item);
  }

  contains(productName: string) {
    let totalProduct: number = 0;
    for (const item of this.contents) {
      if (item.getName() === productName) {
        totalProduct += item.getAmount();
      }
    }
    return totalProduct;
  }
}

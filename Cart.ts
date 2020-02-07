import { Product, getProduct } from './Product';
import { NForXSpecial, BOGOSpecial } from './Specials';

export class Cart {
  private contents = new Map<string, Product>();
  private nForXSpecials: NForXSpecial[] = [];
  private bogoSpecials: BOGOSpecial[] = [];
  constructor() {}

  add(productName: string, amountOrWeight: number): void {
    if (amountOrWeight <= 0) {
      throw new Error('The amount of product to be added to the cart must be greater than 0');
    }
    if (this.contains(productName)) {
      const item = this.contents.get(productName);
      item.setAmount(item.getAmount() + amountOrWeight);
    } else {
      this.contents.set(productName, getProduct(productName, amountOrWeight));
    }
  }

  contains(productName: string) {
    if (this.contents.has(productName)) {
      return this.contents.get(productName).getAmount();
    }
    return 0;
  }

  remove(productName: string, amount: number): void {
    if (this.contains(productName)) {
      const item = this.contents.get(productName);
      item.setAmount(item.getAmount() - amount);
      if (item.getAmount() <= 0) {
        this.contents.delete(productName);
      }
    }
  }

  getPrice(): number {
    let totalPrice = 0;
    for (const item of this.contents.values()) {
      totalPrice += item.getPrice();
    }
    totalPrice -= this.getTotalDiscount();

    return totalPrice;
  }

  private getTotalDiscount(): number {
    let totalDiscount: number = 0;

    for (const special of this.nForXSpecials) {
      totalDiscount += special.getDiscount(this);
    }
    for (const special of this.bogoSpecials) {
      totalDiscount += special.getDiscount(this);
    }

    return totalDiscount;
  }

  addNForXSpecial(
    productName: string,
    productThreshold: number,
    adjustedCost: number,
    totalProductLimit?: number
  ): void {
    this.nForXSpecials.push(new NForXSpecial(productName, productThreshold, adjustedCost, totalProductLimit));
  }

  addBOGOSpecial(
    productName: string,
    productThreshold: number,
    amountOfDiscountedProduct: number,
    discountPercentage: number,
    totalProductLimit?: number
  ): void {
    this.bogoSpecials.push(
      new BOGOSpecial(productName, productThreshold, amountOfDiscountedProduct, discountPercentage, totalProductLimit)
    );
  }
}

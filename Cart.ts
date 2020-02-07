import { Product, getProduct } from './Product';
import { NForXSpecial, BOGOSpecial } from './Specials';

export class Cart {
  private contents: Product[] = [];
  private nForXSpecials: NForXSpecial[] = [];
  private bogoSpecials: BOGOSpecial[] = [];
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

  remove(productName: string, amount: number): void {
    if (this.contains(productName)) {
      for (const [index, item] of this.contents.entries()) {
        if (item.getName() === productName) {
          item.setAmount(item.getAmount() - amount);
          if (item.getAmount() <= 0) {
            this.contents.splice(index, 1);
          }
        }
      }
    }
  }

  getPrice(): number {
    let totalPrice: number = this.contents.reduce(totalCostReducer, 0);
    totalPrice -= this.getTotalDiscount();

    return totalPrice;

    function totalCostReducer(accumulator: number, currentValue: Product): number {
      return accumulator + currentValue.getPrice();
    }
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

  // TODO: consider if there should be a generic 'addDiscount' function, which takes a special/discount object? might clarify responsibilities
  // TODO: consider taking in the arguments for this function as an object, to better self-document the code
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

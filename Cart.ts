import { Product, getProduct } from "./Product";

export class Cart {
  private contents: Product[] = [];
  private nForXSpecials: NForXSpecial[] = [];
  constructor() {}

  // TODO: change this so that you can just give a name and an optional weight; then product is entirely abstracted away
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

  getPrice(): number {
    let totalPrice: number = this.contents.reduce(totalCostReducer, 0);

    for (const special of this.nForXSpecials) {
      totalPrice -= this.calculateNForXDiscount(special);
    }

    return totalPrice;

    function totalCostReducer(
      accumulator: number,
      currentValue: Product
    ): number {
      return accumulator + currentValue.getPrice();
    }
  }

  private calculateNForXDiscount(special: NForXSpecial): number {
    let numApplicableItems: number = this.contains(special.productName);
    if (special.productLimit) {
      numApplicableItems = Math.min(numApplicableItems, special.productLimit);
    }
    const numDiscountApplications = Math.floor(
      numApplicableItems / special.amountOfItems
    );

    return getBaseCostOfAffectedItems() - getSpecialCostOfAffectedItems();

    function getBaseCostOfAffectedItems(): number {
      return (
        numDiscountApplications *
        special.amountOfItems *
        getProduct(special.productName, 1).getPrice()
      );
    }

    function getSpecialCostOfAffectedItems(): number {
      return numDiscountApplications * special.adjustedCost;
    }
  }

  addNForXSpecial(
    productName: string,
    amountOfItems: number,
    adjustedCost: number,
    productLimit?: number
  ) {
    this.nForXSpecials.push(
      new NForXSpecial(productName, amountOfItems, adjustedCost, productLimit)
    );
  }
}

class NForXSpecial {
  public productName: string;
  public amountOfItems: number;
  public adjustedCost: number;
  public productLimit: number;
  constructor(
    productName: string,
    amountOfItems: number,
    adjustedCost: number,
    productLimit?: number
  ) {
    this.productName = productName;
    this.productLimit = productLimit;
    this.amountOfItems = amountOfItems;
    this.adjustedCost = adjustedCost;
  }
}

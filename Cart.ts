import { Product, getProduct } from './Product';

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
      totalDiscount += this.calculateNForXDiscount(special);
    }
    for (const special of this.bogoSpecials) {
      totalDiscount += this.calculateBOGODiscount(special);
    }

    return totalDiscount;
  }

  private calculateNForXDiscount(special: NForXSpecial): number {
    const numApplicableItems = this.getNumberOfItemsAffectedBySpecial(special);
    const numDiscountApplications = Math.floor(numApplicableItems / special.productThreshold);

    return getBaseCostOfAffectedItems() - getSpecialCostOfAffectedItems();

    function getBaseCostOfAffectedItems(): number {
      return numDiscountApplications * special.productThreshold * getProduct(special.productName, 1).getPrice();
    }

    function getSpecialCostOfAffectedItems(): number {
      return numDiscountApplications * special.adjustedCost;
    }
  }

  private calculateBOGODiscount(special: BOGOSpecial): number {
    let numApplicableItems = this.getNumberOfItemsAffectedBySpecial(special);
    let totalAmountOfDiscountedProduct: number = 0;
    while (numApplicableItems > special.productThreshold) {
      numApplicableItems -= special.productThreshold;
      let discountedProduct: number = Math.min(special.amountOfDiscountedProduct, numApplicableItems);
      numApplicableItems -= discountedProduct;
      totalAmountOfDiscountedProduct += discountedProduct * special.discountPercentage;
    }

    return totalAmountOfDiscountedProduct * getProduct(special.productName, 1).getPrice();
  }

  private getNumberOfItemsAffectedBySpecial(special: BOGOSpecial | NForXSpecial): number {
    let numAffectedItems: number = this.contains(special.productName);
    if (special.totalProductLimit) {
      numAffectedItems = Math.min(numAffectedItems, special.totalProductLimit);
    }
    return numAffectedItems;
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

class NForXSpecial {
  public productName: string;
  public productThreshold: number;
  public adjustedCost: number;
  public totalProductLimit: number;
  constructor(productName: string, productThreshold: number, adjustedCost: number, totalProductLimit?: number) {
    this.productName = productName;
    this.totalProductLimit = totalProductLimit;
    this.productThreshold = productThreshold;
    this.adjustedCost = adjustedCost;
  }
}

class BOGOSpecial {
  public productName: string;
  public productThreshold: number;
  public amountOfDiscountedProduct: number;
  public discountPercentage: number;
  public totalProductLimit?: number;
  constructor(productName, productThreshold, amountOfDiscountedProduct, discountPercentage, totalProductLimit) {
    if (discountPercentage <= 0 || discountPercentage > 1.0) {
      throw new Error('The discount percent for a BOGO special must be in the range (0, 1]');
    }
    this.productName = productName;
    this.productThreshold = productThreshold;
    this.amountOfDiscountedProduct = amountOfDiscountedProduct;
    this.discountPercentage = discountPercentage;
    this.totalProductLimit = totalProductLimit;
  }
}

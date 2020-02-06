import { Cart } from './Cart';
import { getProduct } from './Product';

export class NForXSpecial {
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
  getDiscount(cart: Cart): number {
    const { productThreshold, productName, adjustedCost } = this;
    const numApplicableItems = this.getNumberOfItemsAffectedBySpecial(cart);
    const numDiscountApplications = Math.floor(numApplicableItems / productThreshold);

    return getBaseCostOfAffectedItems() - getSpecialCostOfAffectedItems();

    function getBaseCostOfAffectedItems(): number {
      return numDiscountApplications * productThreshold * getProduct(productName, 1).getPrice();
    }

    function getSpecialCostOfAffectedItems(): number {
      return numDiscountApplications * adjustedCost;
    }
  }

  private getNumberOfItemsAffectedBySpecial(cart: Cart): number {
    let numAffectedItems: number = cart.contains(this.productName);
    if (this.totalProductLimit) {
      numAffectedItems = Math.min(numAffectedItems, this.totalProductLimit);
    }
    return numAffectedItems;
  }
}

export class BOGOSpecial {
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
  getDiscount(cart: Cart): number {
    let numApplicableItems = this.getNumberOfItemsAffectedBySpecial(cart);
    let totalAmountOfDiscountedProduct: number = 0;
    while (numApplicableItems > this.productThreshold) {
      numApplicableItems -= this.productThreshold;
      let discountedProduct: number = Math.min(this.amountOfDiscountedProduct, numApplicableItems);
      numApplicableItems -= discountedProduct;
      totalAmountOfDiscountedProduct += discountedProduct * this.discountPercentage;
    }

    return totalAmountOfDiscountedProduct * getProduct(this.productName, 1).getPrice();
  }
  private getNumberOfItemsAffectedBySpecial(cart: Cart): number {
    let numAffectedItems: number = cart.contains(this.productName);
    if (this.totalProductLimit) {
      numAffectedItems = Math.min(numAffectedItems, this.totalProductLimit);
    }
    return numAffectedItems;
  }
}

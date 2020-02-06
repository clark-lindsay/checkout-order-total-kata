import { Product, getProduct } from "./Product";

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
      numApplicableItems / special.productThreshold
    );

    return getBaseCostOfAffectedItems() - getSpecialCostOfAffectedItems();

    function getBaseCostOfAffectedItems(): number {
      return (
        numDiscountApplications *
        special.productThreshold *
        getProduct(special.productName, 1).getPrice()
      );
    }

    function getSpecialCostOfAffectedItems(): number {
      return numDiscountApplications * special.adjustedCost;
    }
  }

  // TODO: consider taking in the arguments for this function as an object, to better self-document the code
  addNForXSpecial(
    productName: string,
    productThreshold: number,
    adjustedCost: number,
    productLimit?: number
  ): void {
    this.nForXSpecials.push(
      new NForXSpecial(
        productName,
        productThreshold,
        adjustedCost,
        productLimit
      )
    );
  }

  addBOGOSpecial(
    productName: string,
    productThreshold: number,
    amountOfDiscountedProduct: number,
    discountPercentage: number
  ): void {
    this.bogoSpecials.push(
      new BOGOSpecial(
        productName,
        productThreshold,
        amountOfDiscountedProduct,
        discountPercentage
      )
    );
  }
}

class NForXSpecial {
  public productName: string;
  public productThreshold: number;
  public adjustedCost: number;
  public productLimit: number;
  constructor(
    productName: string,
    productThreshold: number,
    adjustedCost: number,
    productLimit?: number
  ) {
    this.productName = productName;
    this.productLimit = productLimit;
    this.productThreshold = productThreshold;
    this.adjustedCost = adjustedCost;
  }
}

class BOGOSpecial {
  public productName: string;
  public productThreshold: number;
  public amountOfDiscountedProduct: number;
  public discountPercentage: number;
  constructor(
    productName,
    productThreshold,
    amountOfDiscountedProduct,
    discountPercentage
  ) {
    this.productName = productName;
    this.productThreshold = productThreshold;
    this.amountOfDiscountedProduct = amountOfDiscountedProduct;
    this.discountPercentage = discountPercentage;
  }
}

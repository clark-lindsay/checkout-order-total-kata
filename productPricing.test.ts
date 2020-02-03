import { getProduct } from "./productPricing";

describe("getting the price of products", () => {
  it("returns the price of a single valid item", () => {
    const linguine = getProduct("linguine");
    expect(linguine.getPrice()).toEqual(1.49);
  });

  it("returns the price for an item that is priced by weight", () => {
    const parmesan = getProduct("parmesan");
    expect(parmesan.getPrice(0.8)).toEqual(8);
  });

  it("throws an error if the product is not carried", () => {
    expect(() => getProduct("notARealProduct")).toThrow();
  });

  it("throws an error if the product is priced by weight and no weight is given", () => {
    const parmesan = getProduct("parmesan");
    expect(() => parmesan.getPrice()).toThrow();
  });

  it("supports setting markdowns", () => {
    const beans = getProduct("black beans");
    beans.setMarkdown(0.1);
    expect(beans.getPrice()).toEqual(0.79);
  });

  it("does not have persistent changes if we generate a new product", () => {
    const parmesan = getProduct("parmesan");
    parmesan.setBasePrice(5);
    expect(parmesan.getPrice(1)).toEqual(5);

    const differentCheese = getProduct("parmesan");
    expect(differentCheese.getPrice(1)).toEqual(10);
  });

  it("supports setting prices", () => {
    const beans = getProduct("black beans");
    beans.setBasePrice(1);
    expect(beans.getPrice()).toEqual(1);
    beans.setBasePrice(2);
    expect(beans.getPrice()).toEqual(2);
  });
});

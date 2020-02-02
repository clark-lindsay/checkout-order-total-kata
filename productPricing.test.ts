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

  it("can support a markdown on a product", () => {
    const beans = getProduct("black beans");
    beans.setMarkdown(0.1);
    expect(beans.getPrice()).toEqual(0.79);
  });
});

import { Cart } from "./Cart";
import { getProduct } from "./Product";

describe("the Cart object", () => {
  it("can add an item, and determine how much of that item is in the cart", () => {
    const cart = new Cart();
    const cheese = getProduct("parmesan", 1);
    const yogurt = getProduct("yogurt");

    cart.add(cheese);
    expect(cart.contains("parmesan")).toEqual(1.0);
    cart.add(cheese);
    cart.add(yogurt);
    expect(cart.contains("parmesan")).toEqual(2.0);
    expect(cart.contains("yogurt")).toEqual(1.0);
  });

  it("can tell you the total price of the items that are in the cart", () => {
    const cart = new Cart();
    const cheese = getProduct("parmesan", 2.5);
    const almondMilk = getProduct("almond milk");

    cart.add(cheese);
    expect(cart.getPrice()).toEqual(25);
    cart.add(almondMilk);
    expect(cart.getPrice()).toEqual(29);
  });
});

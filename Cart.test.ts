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

  it("supports discounts in the form of 'Buy N for $X' for items that are not priced by weight", () => {
    const cart = new Cart();
    const almondMilk = getProduct("almond milk");

    cart.add(almondMilk);
    cart.add(almondMilk);
    expect(cart.getPrice()).toEqual(8);
    cart.addNForXSpecial("almond milk", 2, 6);
    expect(cart.getPrice()).toEqual(6);
  });

  it("supports N for X discounts that have a limit on the amount of products that can be affected", () => {
    const cart = new Cart();
    const almondMilk = getProduct("almond milk");

    cart.add(almondMilk);
    cart.add(almondMilk);
    cart.add(almondMilk);
    cart.add(almondMilk);
    expect(cart.getPrice()).toEqual(16);
    cart.addNForXSpecial("almond milk", 2, 6, 2);
    expect(cart.getPrice()).toEqual(14);
  });

  it("supports N for X discounts for items that ARE priced by weight", () => {
    const cart = new Cart();
    const cheese = getProduct("parmesan", 2.5);

    cart.add(cheese);
    expect(cart.getPrice()).toEqual(25);
    cart.addNForXSpecial("parmesan", 2, 15);
    expect(cart.getPrice()).toEqual(20);
  });

  it("supports discounts in the form 'Buy N, get M for X% off'", () => {
    const cart = new Cart();
    const cheese = getProduct("parmesan", 3);

    cart.add(cheese);
    expect(cart.getPrice()).toEqual(30);
    cart.addBOGOSpecial("parmesan", 2, 1, 1);
    expect(cart.getPrice()).toEqual(20);
  });
});

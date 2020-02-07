import { Cart } from './Cart';
import { cachedDataVersionTag } from 'v8';
import { createTracing } from 'trace_events';

describe('the Cart object', () => {
  it('can add an item, and determine how much of that item is in the cart', () => {
    const cart = new Cart();

    cart.add('parmesan', 1);
    expect(cart.contains('parmesan')).toEqual(1.0);
    cart.add('parmesan', 1);
    cart.add('yogurt', 1);
    expect(cart.contains('parmesan')).toEqual(2.0);
    expect(cart.contains('yogurt')).toEqual(1.0);
  });

  it('will throw an error if an item is added with an amount <= 0', () => {
    const cart = new Cart();

    expect(() => cart.add('linguine', 0)).toThrow();
    expect(() => cart.add('parmesan', -1)).toThrow();
  });

  it('can tell you the total price of the items that are in the cart', () => {
    const cart = new Cart();

    cart.add('parmesan', 2.5);
    expect(cart.getPrice()).toEqual(25);
    cart.add('almond milk', 1);
    expect(cart.getPrice()).toEqual(29);
  });

  it('can remove an item from the cart, with the change in price reflected', () => {
    const cart = new Cart();

    cart.add('almond milk', 2);
    expect(cart.getPrice()).toEqual(8);
    cart.remove('almond milk', 1);
    expect(cart.getPrice()).toEqual(4);
  });

  it("supports discounts in the form of 'Buy N for $X' for items that are not priced by weight", () => {
    const cart = new Cart();

    cart.add('almond milk', 2);
    expect(cart.getPrice()).toEqual(8);
    cart.addNForXSpecial('almond milk', 2, 6);
    expect(cart.getPrice()).toEqual(6);
  });

  it('supports N for X discounts that have a limit on the amount of products that can be affected', () => {
    const cart = new Cart();

    cart.add('almond milk', 4);
    expect(cart.getPrice()).toEqual(16);
    cart.addNForXSpecial('almond milk', 2, 6, 2);
    expect(cart.getPrice()).toEqual(14);
  });

  it('supports N for X discounts for items that ARE priced by weight', () => {
    const cart = new Cart();

    cart.add('parmesan', 2.5);
    expect(cart.getPrice()).toEqual(25);
    cart.addNForXSpecial('parmesan', 2, 15);
    expect(cart.getPrice()).toEqual(20);
  });

  it('will invalidate an N for X discount if an item that puts the threshold at N is removed from the cart', () => {
    const cart = new Cart();

    cart.add('almond milk', 4);
    expect(cart.getPrice()).toEqual(16);
    cart.addNForXSpecial('almond milk', 2, 6);
    expect(cart.getPrice()).toEqual(12);
    cart.remove('almond milk', 1);
    expect(cart.getPrice()).toEqual(10);
  });

  it("supports discounts in the form 'Buy N, get M for X% off' for items that are priced by weight", () => {
    const cart = new Cart();

    cart.add('parmesan', 3);
    expect(cart.getPrice()).toEqual(30);
    cart.addBOGOSpecial('parmesan', 2, 1, 1);
    expect(cart.getPrice()).toEqual(20);
  });

  it("supports discounts in the form 'Buy N, get M for X% off'", () => {
    const cart = new Cart();

    cart.add('yogurt', 3);
    expect(cart.getPrice()).toEqual(12);
    cart.addBOGOSpecial('yogurt', 2, 1, 1);
    expect(cart.getPrice()).toEqual(8);
  });

  it('invalidates a BOGO special if an item is removed such that the amount in the cart no longer qualifies for the special', () => {
    const cart = new Cart();

    cart.add('parmesan', 3);
    cart.addBOGOSpecial('parmesan', 2, 1, 1);
    expect(cart.getPrice()).toEqual(20);
    cart.remove('parmesan', 1.5);
    expect(cart.getPrice()).toEqual(15);
  });
});

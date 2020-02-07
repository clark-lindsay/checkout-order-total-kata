import { getProduct } from './Product';

describe('getting the price of products', () => {
  it('returns the price of a single valid item', () => {
    const linguine = getProduct('linguine');
    expect(linguine.getPrice()).toEqual(1.49);
  });

  it('returns the price for an item that is priced by weight', () => {
    const parmesan = getProduct('parmesan', 0.8);
    expect(parmesan.getPrice()).toEqual(8);
  });

  it('throws an error if the product is not carried', () => {
    expect(() => getProduct('notARealProduct')).toThrow();
  });

  it('throws an error if the product is priced by weight and no weight is given', () => {
    expect(() => getProduct('parmesan')).toThrow();
  });

  it('allows one to set the amount of product that a single product object refers to', () => {
    const beans = getProduct('black beans');
    expect(beans.getAmount() == 1);
    beans.setAmount(2);
    expect(beans.getAmount() == 2);
    expect(beans.getPrice() == 1.78);
  });
  it('supports setting markdowns', () => {
    const beans = getProduct('black beans');
    beans.setMarkdown(0.1);
    expect(beans.getPrice()).toEqual(0.79);
  });

  it('markdowns on weighted items affect the unit cost, not the final price', () => {
    const parmesan = getProduct('parmesan', 2);
    expect(parmesan.getPrice()).toEqual(20);
    parmesan.setMarkdown(3);
    expect(parmesan.getPrice()).toEqual(14);
  });

  it('does not have persistent changes if we generate a new product', () => {
    const parmesan = getProduct('parmesan', 1);
    parmesan.setBasePrice(5);
    expect(parmesan.getPrice()).toEqual(5);

    const differentCheese = getProduct('parmesan', 1);
    expect(differentCheese.getPrice()).toEqual(10);
  });

  it('supports setting prices', () => {
    const beans = getProduct('black beans');
    beans.setBasePrice(1);
    expect(beans.getPrice()).toEqual(1);
    beans.setBasePrice(2);
    expect(beans.getPrice()).toEqual(2);
  });

  it('can tell you how much product is represented by a single object instance', () => {
    const cheese = getProduct('parmesan', 1.5);
    expect(cheese.getAmount()).toEqual(1.5);

    const beans = getProduct('black beans');
    expect(beans.getAmount()).toEqual(1);

    const yogurt = getProduct('yogurt', 3);
    expect(yogurt.getAmount()).toEqual(3);
  });
});

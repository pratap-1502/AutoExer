import { test, expect } from '../../fixtures/testFixtures';
import type { ProductData } from '../../types/product.types';
import { DataLoader } from '../../utils/DataLoader';

const products = DataLoader.loadArray<ProductData>('data/products.json', [
  'id',
  'name',
  'price',
  'quantity',
]);
const first = products[0];
const second = products[1];
if (!first || !second) throw new Error('Two product records are required');

test(
  'TC_06 adds two different products to the cart @regression @cart',
  { tag: ['@regression', '@cart'] },
  async ({ homePage, productsPage, cartPage }) => {
    await homePage.open();
    await homePage.openProducts();
    await productsPage.addProduct(first.name);
    await productsPage.continueShopping();
    await productsPage.addProduct(second.name);
    await productsPage.viewCartFromModal();

    for (const product of [first, second]) {
      await expect(cartPage.row(product.name)).toBeVisible();
      await expect(cartPage.quantity(product.name)).toHaveText('1');
      await expect(cartPage.price(product.name)).toHaveText(product.price);
    }
  },
);

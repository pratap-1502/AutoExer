import { test, expect } from '../../fixtures/testFixtures';
import type { ProductData } from '../../types/product.types';
import { DataLoader } from '../../utils/DataLoader';

const products = DataLoader.loadArray<ProductData>('data/products.json', ['name']);
const removed = products[0];
const remaining = products[1];
if (!removed || !remaining) throw new Error('Two product records are required');

test(
  'TC_08 removes one cart product and retains the other @regression @cart',
  { tag: ['@regression', '@cart'] },
  async ({ homePage, productsPage, cartPage }) => {
    await homePage.open();
    await homePage.openProducts();
    await productsPage.addProduct(removed.name);
    await productsPage.continueShopping();
    await productsPage.addProduct(remaining.name);
    await productsPage.viewCartFromModal();
    await cartPage.remove(removed.name);
    await expect(cartPage.row(removed.name)).toHaveCount(0);
    await expect(cartPage.row(remaining.name)).toBeVisible();
  },
);

import { test, expect } from '../../fixtures/testFixtures';
import type { ProductData } from '../../types/product.types';
import { DataLoader } from '../../utils/DataLoader';

const product = DataLoader.loadArray<ProductData>('data/products.json', [
  'id',
  'name',
  'quantity',
])[2];
if (!product) throw new Error('Quantity product record is required');
const quantities = [product.quantity, 2] as const;

for (const quantity of quantities) {
  test(
    `TC_07 preserves product quantity ${quantity} in cart @regression @cart`,
    { tag: ['@regression', '@cart'] },
    async ({ productsPage, productDetailsPage, cartPage }) => {
      await productsPage.openProduct(product.id);
      await productDetailsPage.setQuantity(quantity);
      await productDetailsPage.addToCart();
      await productDetailsPage.viewCartFromModal();
      await expect(cartPage.quantity(product.name)).toHaveText(String(quantity));
    },
  );
}

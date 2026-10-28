import { test, expect } from '../../fixtures/testFixtures';
import type { ProductData, ReviewData } from '../../types/product.types';
import { DataLoader } from '../../utils/DataLoader';

const product = DataLoader.loadArray<ProductData>('data/products.json', [
  'id',
  'name',
  'category',
  'price',
  'availability',
  'condition',
])[0];
const review = DataLoader.loadArray<ReviewData>('data/reviews.json', [
  'name',
  'email',
  'message',
])[0];
if (!product || !review) throw new Error('Product and review data are required');

test(
  'TC_10 verifies product details and submits a review @regression @products',
  { tag: ['@regression', '@products'] },
  async ({ productsPage, productDetailsPage }) => {
    await productsPage.openProduct(product.id);

    await test.step('Verify current product details', async () => {
      await expect(productDetailsPage.productName).toHaveText(product.name);
      await expect(productDetailsPage.category).toContainText(product.category);
      await expect(productDetailsPage.price).toHaveText(product.price);
      await expect(productDetailsPage.availability).toContainText(product.availability);
      await expect(productDetailsPage.condition).toContainText(product.condition);
    });

    await test.step('Submit a fictional review', async () => {
      await productDetailsPage.submitReview(review);
      await expect(productDetailsPage.reviewSuccess).toBeVisible();
    });
  },
);

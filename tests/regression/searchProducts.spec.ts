import { test, expect } from '../../fixtures/testFixtures';
import type { SearchData } from '../../types/product.types';
import { DataLoader } from '../../utils/DataLoader';

const searches = DataLoader.loadArray<SearchData>('data/searchData.json', [
  'id',
  'keyword',
  'expectedProducts',
  'expectResults',
]);

for (const search of searches) {
  test(
    `TC_05 searches products: ${search.id} @smoke @products`,
    { tag: ['@smoke', '@products'] },
    async ({ homePage, productsPage }) => {
      await homePage.open();
      await homePage.openProducts();
      await productsPage.search(search.keyword);
      await expect(productsPage.searchedProductsHeading).toBeVisible();

      if (search.expectResults) {
        for (const product of search.expectedProducts)
          await expect(productsPage.productCard(product)).toBeVisible();
      } else {
        await expect(productsPage.productCards).toHaveCount(0);
      }
    },
  );
}

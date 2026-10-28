import type { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';
export class ProductsPage extends BasePage {
  readonly allProductsHeading: Locator;
  readonly searchedProductsHeading: Locator;
  readonly productCards: Locator;
  readonly cartModal: Locator;
  constructor(page: Page) {
    super(page);
    this.allProductsHeading = page.getByRole('heading', { name: 'All Products' });
    this.searchedProductsHeading = page.getByRole('heading', { name: 'Searched Products' });
    this.productCards = page.locator('.features_items .product-image-wrapper');
    this.cartModal = page.locator('#cartModal');
  }
  productCard(name: string): Locator {
    return this.productCards.filter({ hasText: name }).first();
  }
  async search(keyword: string): Promise<void> {
    await this.page.getByPlaceholder('Search Product').fill(keyword);
    await this.page.locator('#submit_search').click();
  }
  async addProduct(name: string): Promise<void> {
    await this.productCard(name).locator('.productinfo a.add-to-cart').click();
  }
  async continueShopping(): Promise<void> {
    await this.cartModal.getByRole('button', { name: 'Continue Shopping' }).click();
  }
  async viewCartFromModal(): Promise<void> {
    await this.cartModal.getByRole('link', { name: 'View Cart' }).click();
  }
  async openProduct(productId: number): Promise<void> {
    await this.goto(`/product_details/${productId}`);
  }
}

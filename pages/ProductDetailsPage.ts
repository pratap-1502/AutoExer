import type { Locator, Page } from '@playwright/test';
import type { ReviewData } from '../types/product.types';
import { BasePage } from './BasePage';
export class ProductDetailsPage extends BasePage {
  readonly details: Locator;
  readonly productName: Locator;
  readonly category: Locator;
  readonly price: Locator;
  readonly availability: Locator;
  readonly condition: Locator;
  readonly quantity: Locator;
  readonly reviewSuccess: Locator;
  constructor(page: Page) {
    super(page);
    this.details = page.locator('.product-information');
    this.productName = this.details.getByRole('heading');
    this.category = this.details.getByText(/Category:/);
    this.price = this.details.locator('span span');
    this.availability = this.details.getByText(/Availability:/);
    this.condition = this.details.getByText(/Condition:/);
    this.quantity = page.locator('#quantity');
    this.reviewSuccess = page.getByText('Thank you for your review.');
  }
  async setQuantity(quantity: number): Promise<void> {
    await this.quantity.fill(String(quantity));
  }
  async addToCart(): Promise<void> {
    await this.page.getByRole('button', { name: 'Add to cart' }).click();
  }
  async viewCartFromModal(): Promise<void> {
    await this.page.locator('#cartModal').getByRole('link', { name: 'View Cart' }).click();
  }
  async submitReview(review: ReviewData): Promise<void> {
    await this.page.getByPlaceholder('Your Name').fill(review.name);
    await this.page.getByPlaceholder('Email Address').fill(review.email);
    await this.page.getByPlaceholder('Add Review Here!').fill(review.message);
    await this.page.locator('#button-review').click();
  }
}

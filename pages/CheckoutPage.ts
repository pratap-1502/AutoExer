import type { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckoutPage extends BasePage {
  readonly deliveryAddress: Locator;
  readonly billingAddress: Locator;
  readonly reviewOrder: Locator;

  constructor(page: Page) {
    super(page);
    this.deliveryAddress = page.locator('#address_delivery');
    this.billingAddress = page.locator('#address_invoice');
    this.reviewOrder = page.locator('#cart_info');
  }

  async addComment(comment: string): Promise<void> {
    await this.page.locator('textarea[name="message"]').fill(comment);
  }

  async placeOrder(): Promise<void> {
    await this.page.getByRole('link', { name: 'Place Order' }).click();
  }
}

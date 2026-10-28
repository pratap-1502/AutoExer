import type { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  readonly rows: Locator;
  readonly emptyMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.rows = page.locator('#cart_info_table tbody tr');
    this.emptyMessage = page.locator('#empty_cart');
  }

  row(name: string): Locator {
    return this.rows.filter({ hasText: name });
  }

  quantity(name: string): Locator {
    return this.row(name).locator('.cart_quantity button');
  }

  price(name: string): Locator {
    return this.row(name).locator('.cart_price p');
  }

  async remove(name: string): Promise<void> {
    await this.row(name).locator('.cart_quantity_delete').click();
  }

  async proceedToCheckout(): Promise<void> {
    await this.page.getByText('Proceed To Checkout').click();
  }
}

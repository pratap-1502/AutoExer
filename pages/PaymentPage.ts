import type { Locator, Page } from '@playwright/test';
import type { CheckoutData } from '../types/checkout.types';
import { BasePage } from './BasePage';

export class PaymentPage extends BasePage {
  readonly confirmation: Locator;

  constructor(page: Page) {
    super(page);
    this.confirmation = page.getByText('Congratulations! Your order has been confirmed!');
  }

  async submitPayment(payment: CheckoutData['payment']): Promise<void> {
    await this.page.locator('[data-qa="name-on-card"]').fill(payment.nameOnCard);
    await this.page.locator('[data-qa="card-number"]').fill(payment.cardNumber);
    await this.page.locator('[data-qa="cvc"]').fill(payment.cvc);
    await this.page.locator('[data-qa="expiry-month"]').fill(payment.expiryMonth);
    await this.page.locator('[data-qa="expiry-year"]').fill(payment.expiryYear);
    await this.page.locator('[data-qa="pay-button"]').click();
  }
}

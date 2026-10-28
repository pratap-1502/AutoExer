import type { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';
export class HomePage extends BasePage {
  readonly hero: Locator;
  readonly loggedInUser: Locator;
  readonly deleteAccountLink: Locator;
  constructor(page: Page) {
    super(page);
    this.hero = page.locator('#slider');
    this.loggedInUser = this.navigation.getByText(/Logged in as/);
    this.deleteAccountLink = this.navigation.getByRole('link', { name: /Delete Account/ });
  }
  async open(): Promise<void> {
    await this.goto('/');
  }
  async openLogin(): Promise<void> {
    await this.openNavigation('Signup / Login');
  }
  async openProducts(): Promise<void> {
    await this.openNavigation('Products');
  }
  async openCart(): Promise<void> {
    await this.openNavigation('Cart');
  }
  async deleteAccount(): Promise<void> {
    await this.deleteAccountLink.click();
  }
}

import type { Locator, Page } from '@playwright/test';
export class BasePage {
  readonly header: Locator;
  readonly logo: Locator;
  readonly navigation: Locator;
  constructor(protected readonly page: Page) {
    this.header = page.locator('header');
    this.logo = page.locator('.logo img');
    this.navigation = page.locator('.shop-menu');
  }
  async goto(path = '/'): Promise<void> {
    await this.page.goto(path);
  }
  async openNavigation(name: 'Home' | 'Products' | 'Cart' | 'Signup / Login'): Promise<void> {
    await this.navigation.getByRole('link', { name, exact: false }).click();
  }
}

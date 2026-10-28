import type { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';
export class LoginPage extends BasePage {
  readonly loginHeading: Locator;
  readonly loginEmail: Locator;
  readonly loginPassword: Locator;
  readonly loginButton: Locator;
  readonly loginError: Locator;
  readonly signupName: Locator;
  readonly signupEmail: Locator;
  readonly signupButton: Locator;
  constructor(page: Page) {
    super(page);
    this.loginHeading = page.getByRole('heading', { name: 'Login to your account' });
    this.loginEmail = page.locator('[data-qa="login-email"]');
    this.loginPassword = page.locator('[data-qa="login-password"]');
    this.loginButton = page.locator('[data-qa="login-button"]');
    this.loginError = page.getByText('Your email or password is incorrect!');
    this.signupName = page.locator('[data-qa="signup-name"]');
    this.signupEmail = page.locator('[data-qa="signup-email"]');
    this.signupButton = page.locator('[data-qa="signup-button"]');
  }
  async login(email: string, password: string): Promise<void> {
    await this.loginEmail.fill(email);
    await this.loginPassword.fill(password);
    await this.loginButton.click();
  }
  async beginSignup(name: string, email: string): Promise<void> {
    await this.signupName.fill(name);
    await this.signupEmail.fill(email);
    await this.signupButton.click();
  }
  async loginValidationMessage(field: 'email' | 'password'): Promise<string> {
    return field === 'email'
      ? this.loginEmail.evaluate((element: HTMLInputElement) => element.validationMessage)
      : this.loginPassword.evaluate((element: HTMLInputElement) => element.validationMessage);
  }
}

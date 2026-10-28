import type { Locator, Page } from '@playwright/test';
import type { TestUser } from '../types/user.types';
import { BasePage } from './BasePage';
export class SignupPage extends BasePage {
  readonly detailsHeading: Locator;
  readonly accountCreatedHeading: Locator;
  readonly accountDeletedHeading: Locator;
  readonly continueButton: Locator;
  constructor(page: Page) {
    super(page);
    this.detailsHeading = page.getByText('Enter Account Information');
    this.accountCreatedHeading = page.locator('[data-qa="account-created"]');
    this.accountDeletedHeading = page.locator('[data-qa="account-deleted"]');
    this.continueButton = page.locator('[data-qa="continue-button"]');
  }
  async completeRegistration(user: TestUser): Promise<void> {
    await this.page.locator(user.title === 'Mr' ? '#id_gender1' : '#id_gender2').check();
    await this.page.locator('[data-qa="password"]').fill(user.password);
    await this.page.locator('[data-qa="days"]').selectOption(user.birthDate);
    await this.page.locator('[data-qa="months"]').selectOption(user.birthMonth);
    await this.page.locator('[data-qa="years"]').selectOption(user.birthYear);
    const address = user.address;
    await this.page.locator('[data-qa="first_name"]').fill(address.firstName);
    await this.page.locator('[data-qa="last_name"]').fill(address.lastName);
    await this.page.locator('[data-qa="company"]').fill(address.company);
    await this.page.locator('[data-qa="address"]').fill(address.address1);
    await this.page.locator('[data-qa="address2"]').fill(address.address2);
    await this.page.locator('[data-qa="country"]').selectOption({ label: address.country });
    await this.page.locator('[data-qa="state"]').fill(address.state);
    await this.page.locator('[data-qa="city"]').fill(address.city);
    await this.page.locator('[data-qa="zipcode"]').fill(address.zipcode);
    await this.page.locator('[data-qa="mobile_number"]').fill(address.mobileNumber);
    await this.page.locator('[data-qa="create-account"]').click();
  }
  async continue(): Promise<void> {
    await this.continueButton.click();
  }
}

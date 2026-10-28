import { test, expect } from '../../fixtures/testFixtures';
import type { UserTemplate } from '../../types/user.types';
import { DataLoader } from '../../utils/DataLoader';
import { TestDataFactory } from '../../utils/TestDataFactory';

const template = DataLoader.loadArray<UserTemplate>('data/users.json', [
  'id',
  'name',
  'emailPrefix',
  'password',
  'address',
])[0];
if (!template) throw new Error('At least one user template is required');

test(
  'TC_02 registers and deletes a new user @regression @authentication',
  { tag: ['@regression', '@authentication'] },
  async ({ homePage, loginPage, signupPage }) => {
    const user = TestDataFactory.uniqueUser(template);

    await test.step('Start signup with a unique identity', async () => {
      await homePage.open();
      await homePage.openLogin();
      await loginPage.beginSignup(user.name, user.email);
      await expect(signupPage.detailsHeading).toBeVisible();
    });

    await test.step('Complete registration', async () => {
      await signupPage.completeRegistration(user);
      await expect(signupPage.accountCreatedHeading).toBeVisible();
      await signupPage.continue();
      await expect(homePage.loggedInUser).toContainText(user.name);
    });

    await test.step('Delete the created account', async () => {
      await homePage.deleteAccount();
      await expect(signupPage.accountDeletedHeading).toBeVisible();
    });
  },
);

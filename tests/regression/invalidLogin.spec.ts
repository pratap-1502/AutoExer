import { test, expect } from '../../fixtures/testFixtures';
import type { InvalidUser } from '../../types/user.types';
import { DataLoader } from '../../utils/DataLoader';

const invalidUsers = DataLoader.loadArray<InvalidUser>('data/invalidUsers.json', [
  'id',
  'email',
  'password',
  'expectedError',
]);

for (const credentials of invalidUsers) {
  test(
    `TC_04 rejects invalid login: ${credentials.id} @negative @regression`,
    { tag: ['@negative', '@regression'] },
    async ({ homePage, loginPage }) => {
      await homePage.open();
      await homePage.openLogin();
      await loginPage.login(credentials.email, credentials.password);

      if (credentials.browserValidation) {
        const field =
          credentials.email === '' || !credentials.email.includes('@') ? 'email' : 'password';
        await expect
          .poll(() => loginPage.loginValidationMessage(field))
          .toContain(credentials.expectedError);
      } else {
        await expect(loginPage.loginError).toHaveText(credentials.expectedError);
      }
    },
  );
}

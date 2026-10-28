import { test, expect } from '../../fixtures/testFixtures';
import type { UserTemplate } from '../../types/user.types';
import { ApiHelper, readApiEnvelope } from '../../utils/ApiHelper';
import { DataLoader } from '../../utils/DataLoader';
import { TestDataFactory } from '../../utils/TestDataFactory';

const template = DataLoader.loadArray<UserTemplate>('data/users.json', [
  'id',
  'name',
  'password',
  'address',
])[0];
if (!template) throw new Error('At least one user template is required');

test(
  'TC_03 logs in with a valid disposable account @smoke @authentication',
  { tag: ['@smoke', '@authentication'] },
  async ({ request, homePage, loginPage }) => {
    const user = TestDataFactory.uniqueUser(template);
    const api = new ApiHelper(request);
    const created = await readApiEnvelope(await api.createAccount(user));
    expect(created.responseCode).toBe(201);

    try {
      await test.step('Open login and authenticate', async () => {
        await homePage.open();
        await homePage.openLogin();
        await loginPage.login(user.email, user.password);
      });

      await test.step('Verify authenticated identity', async () => {
        await expect(homePage.loggedInUser).toContainText(user.name);
      });
    } finally {
      const deleted = await readApiEnvelope(await api.deleteAccount(user.email, user.password));
      expect(deleted.responseCode).toBe(200);
    }
  },
);

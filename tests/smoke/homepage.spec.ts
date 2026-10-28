import { test, expect } from '../../fixtures/testFixtures';

const expectedNavigation = ['Home', 'Products', 'Cart', 'Signup / Login'] as const;

test.describe('Homepage', () => {
  let navigationLabels: readonly string[];

  test.beforeAll(() => {
    navigationLabels = Object.freeze([...expectedNavigation]);
  });

  test.beforeEach(async ({ homePage }) => {
    await homePage.open();
  });

  test(
    'TC_01 verifies homepage identity and navigation @smoke @sanity',
    { tag: ['@smoke', '@sanity'] },
    async ({ page, homePage }) => {
      await test.step('Verify page identity', async () => {
        await expect(page).toHaveTitle(/Automation Exercise/);
        await expect(homePage.logo).toBeVisible();
        await expect(homePage.hero).toBeVisible();
      });

      await test.step('Verify primary navigation', async () => {
        for (const label of navigationLabels)
          await expect(
            homePage.navigation.getByRole('link', { name: label, exact: false }),
          ).toBeVisible();
      });
    },
  );
});

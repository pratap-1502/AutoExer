import { test, expect } from '../../fixtures/testFixtures';
import type { CheckoutData } from '../../types/checkout.types';
import type { ProductData } from '../../types/product.types';
import type { UserTemplate } from '../../types/user.types';
import { ApiHelper, readApiEnvelope } from '../../utils/ApiHelper';
import { DataLoader } from '../../utils/DataLoader';
import { TestDataFactory } from '../../utils/TestDataFactory';

const template = DataLoader.loadArray<UserTemplate>('data/users.json', [
  'name',
  'password',
  'address',
])[0];
const product = DataLoader.loadArray<ProductData>('data/products.json', ['id', 'name'])[0];
const checkout = DataLoader.loadObject<CheckoutData>('data/checkout.json', [
  'address',
  'orderComment',
  'payment',
  'expectedConfirmation',
]);
if (!template || !product) throw new Error('Checkout user and product data are required');

test(
  'TC_09 completes checkout with a disposable authenticated user @critical @e2e @checkout',
  { tag: ['@critical', '@e2e', '@checkout'] },
  async ({
    request,
    homePage,
    loginPage,
    productsPage,
    productDetailsPage,
    cartPage,
    checkoutPage,
    paymentPage,
  }) => {
    const user = TestDataFactory.uniqueUser(template);
    const api = new ApiHelper(request);
    const created = await readApiEnvelope(await api.createAccount(user));
    expect(created.responseCode).toBe(201);

    try {
      await test.step('Authenticate and add a product', async () => {
        await homePage.open();
        await homePage.openLogin();
        await loginPage.login(user.email, user.password);
        await expect(homePage.loggedInUser).toContainText(user.name);
        await productsPage.openProduct(product.id);
        await productDetailsPage.addToCart();
        await productDetailsPage.viewCartFromModal();
      });

      await test.step('Verify checkout addresses and place order', async () => {
        await cartPage.proceedToCheckout();
        for (const address of [checkoutPage.deliveryAddress, checkoutPage.billingAddress]) {
          await expect(address).toContainText(user.address.address1);
          await expect(address).toContainText(user.address.city);
          await expect(address).toContainText(user.address.state);
        }
        await checkoutPage.addComment(checkout.orderComment);
        await checkoutPage.placeOrder();
      });

      await test.step('Submit fictional payment and verify confirmation', async () => {
        await paymentPage.submitPayment(checkout.payment);
        await expect(paymentPage.confirmation).toHaveText(checkout.expectedConfirmation);
      });
    } finally {
      const deleted = await readApiEnvelope(await api.deleteAccount(user.email, user.password));
      expect(deleted.responseCode).toBe(200);
    }
  },
);

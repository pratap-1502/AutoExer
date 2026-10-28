import {
  request as playwrightRequest,
  test,
  expect,
  type APIRequestContext,
} from '@playwright/test';
import { environment } from '../../config/environments';
import { ApiHelper } from '../../utils/ApiHelper';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

test.describe('Documented product APIs @api', { tag: '@api' }, () => {
  let context: APIRequestContext;
  let api: ApiHelper;

  test.beforeAll(async () => {
    context = await playwrightRequest.newContext({ baseURL: environment.baseUrl });
    api = new ApiHelper(context);
  });

  test.afterAll(async () => {
    await context.dispose();
  });

  test('retrieves and validates the product list', async () => {
    const response = await api.getProducts();
    expect(response.status()).toBe(200);
    const body: unknown = JSON.parse(await response.text());
    expect(isRecord(body)).toBe(true);
    if (!isRecord(body)) throw new Error('Product API response must be an object');
    expect(body.responseCode).toBe(200);
    expect(Array.isArray(body.products)).toBe(true);
    if (!Array.isArray(body.products) || body.products.length === 0 || !isRecord(body.products[0]))
      throw new Error('Product API must return structured products');
    expect(body.products[0]).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        name: expect.any(String),
        price: expect.any(String),
        brand: expect.any(String),
      }),
    );
  });

  test('distinguishes HTTP status from documented application error code', async () => {
    const response = await api.postProducts();
    expect(response.status()).toBe(200);
    const body: unknown = JSON.parse(await response.text());
    if (!isRecord(body)) throw new Error('Error response must be an object');
    expect(body.responseCode).toBe(405);
    expect(body.message).toBe('This request method is not supported.');
  });

  test('returns matching products for a documented search', async () => {
    const response = await api.searchProducts('top');
    expect(response.status()).toBe(200);
    const body: unknown = JSON.parse(await response.text());
    if (!isRecord(body)) throw new Error('Search response must be an object');
    expect(body.responseCode).toBe(200);
    expect(Array.isArray(body.products)).toBe(true);
  });

  test('returns application code 400 when search parameter is missing', async () => {
    const response = await api.searchProducts();
    expect(response.status()).toBe(200);
    const body: unknown = JSON.parse(await response.text());
    if (!isRecord(body)) throw new Error('Error response must be an object');
    expect(body.responseCode).toBe(400);
    expect(body.message).toContain('search_product parameter is missing');
  });
});

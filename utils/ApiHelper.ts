import type { APIRequestContext, APIResponse } from '@playwright/test';
import type { TestUser } from '../types/user.types';
export interface ApiEnvelope {
  readonly responseCode: number;
  readonly message?: string;
}

export async function readApiEnvelope(response: APIResponse): Promise<ApiEnvelope> {
  const parsed: unknown = JSON.parse(await response.text());
  if (
    typeof parsed !== 'object' ||
    parsed === null ||
    !('responseCode' in parsed) ||
    typeof parsed.responseCode !== 'number'
  ) {
    throw new Error('API response did not contain a numeric responseCode');
  }
  if ('message' in parsed && typeof parsed.message === 'string')
    return { responseCode: parsed.responseCode, message: parsed.message };
  return { responseCode: parsed.responseCode };
}

export class ApiHelper {
  constructor(private readonly request: APIRequestContext) {}
  getProducts(): Promise<APIResponse> {
    return this.request.get('/api/productsList');
  }
  postProducts(): Promise<APIResponse> {
    return this.request.post('/api/productsList');
  }
  searchProducts(term?: string): Promise<APIResponse> {
    return this.request.post(
      '/api/searchProduct',
      term === undefined ? {} : { form: { search_product: term } },
    );
  }
  createAccount(user: TestUser): Promise<APIResponse> {
    return this.request.post('/api/createAccount', { form: this.accountForm(user) });
  }
  deleteAccount(email: string, password: string): Promise<APIResponse> {
    return this.request.delete('/api/deleteAccount', { form: { email, password } });
  }
  private accountForm(user: TestUser): Record<string, string> {
    return {
      name: user.name,
      email: user.email,
      password: user.password,
      title: user.title,
      birth_date: user.birthDate,
      birth_month: user.birthMonth,
      birth_year: user.birthYear,
      firstname: user.address.firstName,
      lastname: user.address.lastName,
      company: user.address.company,
      address1: user.address.address1,
      address2: user.address.address2,
      country: user.address.country,
      zipcode: user.address.zipcode,
      state: user.address.state,
      city: user.address.city,
      mobile_number: user.address.mobileNumber,
    };
  }
}

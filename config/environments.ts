import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
try {
  require('dotenv/config');
} catch {
  // npm registry access can be unavailable in restricted environments; CI installs dotenv.
}
type TestEnvironment = 'qa' | 'staging' | 'local';
export interface EnvironmentConfig {
  readonly name: TestEnvironment;
  readonly baseUrl: string;
  readonly headless: boolean;
  readonly workers: number;
}
const defaultPublicUrl = 'https://automationexercise.com';
const name = (process.env.TEST_ENV ?? 'qa').toLowerCase();
if (!['qa', 'staging', 'local'].includes(name)) throw new Error(`Invalid TEST_ENV: ${name}`);
const configuredUrl = process.env.BASE_URL ?? defaultPublicUrl;
let parsedUrl: URL;
try {
  parsedUrl = new URL(configuredUrl);
} catch {
  throw new Error(`BASE_URL must be an absolute URL: ${configuredUrl}`);
}
const workers = Number(process.env.WORKERS ?? '4');
if (!Number.isInteger(workers) || workers < 1)
  throw new Error('WORKERS must be a positive integer');
const headlessValue = (process.env.HEADLESS ?? 'true').toLowerCase();
if (!['true', 'false'].includes(headlessValue)) throw new Error('HEADLESS must be true or false');
export const environment: EnvironmentConfig = Object.freeze({
  name: name as TestEnvironment,
  baseUrl: parsedUrl.origin,
  headless: headlessValue === 'true',
  workers,
});

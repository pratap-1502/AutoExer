import { rm } from 'node:fs/promises';
import { resolve } from 'node:path';
const generatedDirectories = [
  'test-results',
  'playwright-report',
  'allure-results',
  'allure-report',
];
for (const directory of generatedDirectories)
  await rm(resolve(process.cwd(), directory), { recursive: true, force: true });
console.log(`Removed generated artifacts: ${generatedDirectories.join(', ')}`);

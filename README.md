# Automation Exercise Playwright Framework

An independent, parallel-safe UI and API automation framework for [Automation Exercise](https://automationexercise.com/), built with Playwright Test, strict TypeScript, Page Objects, typed fixtures, JSON data, HTML/Allure reporting, and GitHub Actions.

## Architecture

- `config/` validates environment selection, URL, headless mode, and workers.
- `pages/` contains focused page actions and stable locators; assertions remain in tests.
- `fixtures/` injects every page object with `test.extend()` and attaches the current URL on failure.
- `data/` holds immutable fictional users, products, checkout, review, and search records.
- `types/` defines the JSON and domain contracts; `utils/` loads/validates data, creates unique users, wraps APIs, and logs safely.
- `tests/smoke`, `tests/regression`, and `tests/api` separate suites by purpose.

```text
config/  data/  fixtures/  pages/  tests/{smoke,regression,api}/
types/   utils/ scripts/   .github/workflows/
```

## Installation and configuration

Use Node.js 20 or newer (CI uses Node 24), then:

```bash
npm ci
npx playwright install --with-deps
```

Copy `.env.example` to `.env` if overrides are needed. `qa`, `staging`, and `local` are accepted environment names. Because no staging URL is published, all environments default to the public practice URL unless `BASE_URL` is explicitly supplied. Never commit `.env` or real credentials.

## Test data, isolation, and lifecycle

JSON is loaded through `DataLoader`, which checks that files are non-empty and required fields exist. `TestDataFactory` combines timestamp, process ID, and random bytes to generate collision-resistant email addresses. Registration creates and deletes its account in the UI. Login and checkout create disposable accounts through the documented API and delete them in `finally` blocks. Tests never share pages, contexts, mutable data, or accounts.

The API suite uses `beforeAll` to allocate one immutable suite request context and `afterAll` to dispose it. UI suites use `beforeEach` for common navigation where appropriate. The automatic fixture teardown attaches the final URL only after failure; Playwright itself captures failure screenshots, retained videos, and first-retry traces.

## Running tests

```bash
npm test
npm run test:smoke
npm run test:regression
npm run test:critical
npm run test:api
npm run test:chromium
npm run test:firefox
npm run test:webkit
npm run test:headed
npm run test:debug
npx playwright test tests/regression/checkout.spec.ts --project=chromium
npx playwright test -g "TC_07" --project=chromium
npx playwright test --grep @smoke
npx playwright test --grep @regression
npx playwright test --grep @critical
npx playwright test --grep-invert @negative
npx playwright test --workers=2
```

The supported tags are `@smoke`, `@sanity`, `@regression`, `@critical`, `@negative`, `@e2e`, `@authentication`, `@products`, `@cart`, `@checkout`, and `@api`.

## Quality, debugging, and reports

```bash
npm run typecheck
npm run lint
npm run lint:fix
npm run format
npm run format:check
npm run test:report
npm run allure:generate
npm run allure:open
```

Use `--headed`, `--debug`, or `PWDEBUG=1` when diagnosing locally. HTML output is written to `playwright-report/`; Allure raw results go to `allure-results/`, with generated output in `allure-report/`. `npm run cleanup` removes only these generated report/result directories.

## CI/CD

`.github/workflows/playwright.yml` runs on pushes and pull requests to `main`. It uses `npm ci`, installs Chromium dependencies, type-checks, lints, runs smoke tests with two workers, and uploads reports plus failure artifacts. No secrets are required.

## Known limitations and troubleshooting

- The application displays advertisements and is a shared public service, so network/ad latency can affect navigation.
- The documented APIs frequently return HTTP 200 with an application-level `responseCode` such as 400 or 405; API tests deliberately assert both layers.
- Fictional payment data is accepted only by this practice site and must never be reused elsewhere.
- If browsers are missing, run `npx playwright install --with-deps`. If a product assertion changes, compare `data/products.json` with the live product/API catalog before updating expectations.
- If account cleanup fails after an upstream outage, the unique email strategy prevents later runs from conflicting.

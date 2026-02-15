import { Page } from '@playwright/test';

interface LoginResponse {
  money: number;
}

/**
 * Intercept POST /api/log-in/ so tests don't need a running backend.
 * Returns configurable JSON (default: { money: 42 }).
 */
export function mockLoginApi(page: Page, response: LoginResponse = { money: 42 }) {
  return page.route('**/api/log-in/', async (route) => {
    if (route.request().method() === 'POST') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(response),
      });
    } else {
      await route.continue();
    }
  });
}

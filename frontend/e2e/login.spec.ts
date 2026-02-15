import { test, expect } from '@playwright/test';
import { mockFirebaseLoggedOut, mockFirebaseLoggedIn } from './helpers/firebase-mock';
import { mockLoginApi } from './helpers/api-mock';

test.describe('Login', () => {
  test('shows login button when unauthenticated', async ({ page }) => {
    await mockFirebaseLoggedOut(page);
    await mockLoginApi(page);

    await page.goto('/');

    const loginButton = page.getByRole('button', { name: 'Zaloguj się' });
    await expect(loginButton).toBeVisible();
    await expect(page.getByText('Czuwaj!')).not.toBeVisible();
  });

  test('login flow: click button -> authenticated -> balance shown', async ({ page }) => {
    await mockFirebaseLoggedOut(page);
    await mockLoginApi(page, { money: 99 });

    await page.goto('/');

    // Click the login button
    await page.getByRole('button', { name: 'Zaloguj się' }).click();

    // After mock sign-in, the app should show balance
    await expect(page.getByText('Czuwaj!')).toBeVisible();
    await expect(page.getByText('99')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Zaloguj się' })).not.toBeVisible();
  });

  test('pre-authenticated: balance shown immediately', async ({ page }) => {
    await mockFirebaseLoggedIn(page);
    await mockLoginApi(page, { money: 150 });

    await page.goto('/');

    await expect(page.getByText('Czuwaj!')).toBeVisible();
    await expect(page.getByText('150')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Zaloguj się' })).not.toBeVisible();
  });

  test('login calls /api/log-in/ with mock ID token', async ({ page }) => {
    let capturedBody: string | null = null;

    await mockFirebaseLoggedIn(page);

    // Intercept the API call and capture the request body
    await page.route('**/api/log-in/', async (route) => {
      if (route.request().method() === 'POST') {
        capturedBody = route.request().postData();
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ money: 10 }),
        });
      } else {
        await route.continue();
      }
    });

    await page.goto('/');

    // Wait for the API call to complete
    await expect(page.getByText('Czuwaj!')).toBeVisible();
    await expect(page.getByText('10')).toBeVisible();

    // Verify the token was sent
    expect(capturedBody).not.toBeNull();
    const parsed = JSON.parse(capturedBody!);
    expect(parsed.id_token).toBe('test_id_token_e2e');
  });
});

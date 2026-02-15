import { Page } from '@playwright/test';

/**
 * Mock Firebase auth for E2E tests.
 *
 * Strategy:
 * Firebase v10 compat SDK doesn't expose `window.firebase` when bundled by
 * webpack. The app's firebase.ts module is compiled into a webpack chunk
 * where `firebase.auth()` creates the auth instance as a local variable.
 *
 * We use a two-pronged approach:
 * 1. `page.addInitScript` sets `window.__E2E_MOCK__` with mock auth/provider.
 * 2. `page.route` intercepts JS chunks and patches any that contain the
 *    Firebase API key, replacing the auth initialization with mock reads.
 */

const FIREBASE_API_KEY = 'AIzaSyCAFTW9lZZs_Rov1vIo-HuXVI-QaCrHsm8';

/**
 * Regex matching the Firebase auth initialization block in the minified bundle.
 * Captures variable names so the replacement works regardless of minification.
 */
const AUTH_INIT_PATTERN =
  /let (\w+)=\w+\.\w+\.auth\(\);\1\.useDeviceLanguage\(\),\w+\.\w+\.firestore\(\);let (\w+)=new \w+\.\w+\.auth\.GoogleAuthProvider;\w+\.\w+\.auth\.Auth\.Persistence/;

function addMockToWindow(page: Page, loggedIn: boolean) {
  return page.addInitScript((loggedIn: boolean) => {
    const mockUser = {
      uid: 'test-uid-123',
      displayName: 'Test User',
      email: 'test@example.com',
      photoURL: null,
      getIdToken: () => Promise.resolve('test_id_token_e2e'),
    };

    const listeners: Array<(user: typeof mockUser | null) => void> = [];

    const authInstance = {
      currentUser: loggedIn ? mockUser : null,
      onAuthStateChanged(callback: (user: typeof mockUser | null) => void) {
        listeners.push(callback);
        const user = loggedIn ? mockUser : null;
        setTimeout(() => callback(user), 0);
        return () => {
          const idx = listeners.indexOf(callback);
          if (idx !== -1) listeners.splice(idx, 1);
        };
      },
      signInWithPopup(_provider: unknown) {
        authInstance.currentUser = mockUser;
        listeners.forEach((cb) => cb(mockUser));
        return Promise.resolve({ user: mockUser });
      },
      signOut() {
        authInstance.currentUser = null;
        listeners.forEach((cb) => cb(null));
        return Promise.resolve();
      },
      useDeviceLanguage() {},
    };

    (window as any).__E2E_MOCK__ = {
      auth: authInstance,
      provider: {},
    };
  }, loggedIn);
}

/**
 * Intercept Next.js page/layout chunks and patch any that contain the
 * Firebase initialization code (identified by the API key).
 */
function patchFirebaseChunks(page: Page) {
  // Only intercept page-* and layout-* chunks (where firebase.ts module lives)
  return page.route(/\/_next\/static\/chunks\/.*(page|layout)-.*\.js$/, async (route) => {
    try {
      const response = await route.fetch();
      const body = await response.text();

      if (!body.includes(FIREBASE_API_KEY)) {
        await route.fulfill({
          body,
          contentType: 'application/javascript; charset=UTF-8',
        });
        return;
      }

      const patched = body.replace(
        AUTH_INIT_PATTERN,
        'let $1=window.__E2E_MOCK__.auth;let $2=window.__E2E_MOCK__.provider',
      );

      await route.fulfill({
        body: patched,
        contentType: 'application/javascript; charset=UTF-8',
      });
    } catch {
      // Page may close while route is in flight - ignore
    }
  });
}

/** Install Firebase mock in "logged out" state. */
export async function mockFirebaseLoggedOut(page: Page) {
  await addMockToWindow(page, false);
  await patchFirebaseChunks(page);
}

/** Install Firebase mock in "logged in" state. */
export async function mockFirebaseLoggedIn(page: Page) {
  await addMockToWindow(page, true);
  await patchFirebaseChunks(page);
}

// Run from the repository root after a production build:
// node docs/harness/evidence/ah-010/keyboard-clearance.cjs /path/to/playwright /path/to/chromium
const assert = require('node:assert/strict');
const { stat } = require('node:fs/promises');
const path = require('node:path');

const [playwrightPath, executablePath] = process.argv.slice(2);
assert.ok(playwrightPath && executablePath, 'Supply absolute Playwright and Chromium paths.');
const { chromium } = require(playwrightPath);
const dist = path.resolve('apps/web/dist/web/browser');
const origin = 'http://amber-hunter.test';

async function checkViewport(browser, width, height, insets) {
  const page = await browser.newPage({ viewport: { width, height } });
  try {
    await page.route('**/*', async (route) => {
      const url = new URL(route.request().url());
      assert.equal(url.origin, origin);
      const asset = path.join(dist, url.pathname);
      if (route.request().isNavigationRequest()) {
        await route.fulfill({ path: path.join(dist, 'index.html') });
      } else if ((await stat(asset).catch(() => null))?.isFile()) {
        await route.fulfill({ path: asset });
      } else {
        await route.fulfill({ status: 404 });
      }
    });

    if (insets) {
      const session = await page.context().newCDPSession(page);
      await session.send('Emulation.setSafeAreaInsetsOverride', { insets });
    }

    await page.goto(origin);
    const home = page.getByRole('link', { name: 'Go to home' });
    await home.waitFor();

    await page.keyboard.press('Tab');
    const skip = page.getByRole('button', { name: 'Skip to content' });
    assert.equal(await skip.evaluate((element) => element === document.activeElement), true);
    if (insets) {
      const box = await skip.boundingBox();
      assert.ok(box.x >= insets.left + 5 && box.y >= insets.top + 5, 'Skip focus must clear the safe area.');
    }

    for (let attempt = 0; attempt < 4; attempt++) {
      await page.keyboard.press('Tab');
      if (await home.evaluate((element) => element === document.activeElement)) break;
    }
    assert.equal(await home.evaluate((element) => element === document.activeElement), true);

    const box = await home.boundingBox();
    const navigation = await page.locator('app-mobile-navigation').boundingBox();
    const outline = await home.evaluate((element) => {
      const style = getComputedStyle(element);
      if (style.outlineStyle === 'none') throw new Error('Keyboard focus outline is missing.');
      return parseFloat(style.outlineWidth) + parseFloat(style.outlineOffset);
    });
    const focusBottom = box.y + box.height + outline;
    assert.ok(box.y >= outline && focusBottom <= (navigation?.y ?? height),
      `Focused link and outline end at ${focusBottom}px; visible area ends at ${navigation?.y ?? height}px.`);
    console.log(`PASS ${width}×${height}${insets ? ' with simulated safe-area insets' : ''}: focus ends at ${focusBottom}px, visible area ends at ${navigation?.y ?? height}px.`);
  } finally {
    await page.close();
  }
}

async function run() {
  const browser = await chromium.launch({ executablePath, chromiumSandbox: true });
  try {
    for (const [width, height] of [[390, 250], [320, 240], [390, 300], [667, 250], [768, 250]]) {
      await checkViewport(browser, width, height);
    }
    await checkViewport(browser, 390, 250, { top: 24, left: 32, right: 0, bottom: 28 });
  } finally {
    await browser.close();
  }
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

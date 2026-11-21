// Run from the repository root after building production and development bundles.
// node docs/harness/evidence/ah-011/browser-smoke.cjs /path/to/playwright /path/to/chromium /path/to/dev/browser
const assert = require('node:assert/strict');
const { stat } = require('node:fs/promises');
const path = require('node:path');

const [playwrightPath, executablePath, development] = process.argv.slice(2);
assert.ok(playwrightPath && executablePath && development, 'Supply Playwright, Chromium and development bundle paths.');
const { chromium } = require(playwrightPath);
const production = path.resolve('apps/web/dist/web/browser');
const origin = 'http://amber-hunter.test';

async function openPage(browser, dist, viewport, insets) {
  const page = await browser.newPage({ viewport, reducedMotion: 'reduce' });
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));

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

  const session = await page.context().newCDPSession(page);
  if (insets) {
    await session.send('Emulation.setSafeAreaInsetsOverride', { insets });
  }
  await page.goto(origin);
  await page.getByRole('heading', { name: 'Coastal forecast', level: 1 }).waitFor();
  await page.evaluate(() => document.fonts.ready);
  return { page, session, errors };
}

async function checkViewport(browser, width, height, screenshot, insets) {
  const { page, session, errors } = await openPage(browser, production, { width, height }, insets);
  try {
    const main = page.getByRole('main');
    const navigation = page.locator('app-mobile-navigation');
    const links = main.getByRole('link');
    assert.equal(await links.count(), 2);
    assert.equal(await page.getByRole('heading', { level: 1 }).count(), 1);
    assert.equal(await page.locator('#outlook-heading + p + ol > li').count(), 7);
    assert.equal(await navigation.isVisible(), width < 768);
    assert.equal(await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches), true);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), width);

    const { nodes } = await session.send('Accessibility.getFullAXTree');
    assert.ok(nodes.some((node) => node.role?.value === 'image'
      && node.name?.value === 'Experimental Amber Index: 71 out of 100, sample data'));
    assert.ok(nodes.some((node) => node.role?.value === 'complementary'
      && node.name?.value === 'Safety status · sample'));

    if (screenshot) {
      if (width < 768) await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
      await page.screenshot({ path: path.join(__dirname, screenshot), fullPage: true });
      await page.evaluate(() => window.scrollTo(0, 0));
    }

    await page.keyboard.press('Tab');
    assert.equal(await page.locator(':focus').textContent(), 'Skip to content');
    if (insets) {
      const skip = await page.locator(':focus').boundingBox();
      assert.ok(skip.x >= insets.left && skip.y >= insets.top);
    }
    await page.keyboard.press('Enter');
    assert.equal(await main.evaluate((element) => element === document.activeElement), true);

    for (const link of await links.all()) {
      await page.keyboard.press('Tab');
      assert.equal(await link.evaluate((element) => element === document.activeElement), true);
      const box = await link.boundingBox();
      const visibleBottom = (await navigation.boundingBox())?.y ?? height;
      const outline = await link.evaluate((element) => {
        const style = getComputedStyle(element);
        if (style.outlineStyle === 'none') throw new Error('Keyboard focus outline missing.');
        return parseFloat(style.outlineWidth) + parseFloat(style.outlineOffset);
      });
      assert.ok(box.height >= 44 && box.width >= 44);
      assert.ok(box.y >= outline && box.y + box.height + outline <= visibleBottom + 1);
      if (insets) assert.ok(box.x >= insets.left && box.x + box.width <= width - insets.right);
    }

    for (const [label, url, heading] of [
      ['Explore Map', '/map', 'Explore Map'],
      ['Amber Academy', '/academy', 'Amber Academy'],
    ]) {
      await main.getByRole('link', { name: label }).click();
      await page.getByRole('heading', { name: heading, level: 1 }).waitFor();
      assert.equal(new URL(page.url()).pathname, url);
      await page.goBack();
      await page.getByRole('heading', { name: 'Coastal forecast' }).waitFor();
    }

    assert.deepEqual(errors, []);
    console.log(`PASS ${width}×${height}${insets ? ' with simulated safe-area insets' : ''}: layout, AX names, reduced-motion preference, keyboard/focus, tap targets, and route links.`);
  } finally {
    await page.close();
  }
}

async function checkContrast(browser) {
  const { page } = await openPage(browser, production, { width: 1440, height: 1000 });
  try {
    const ratios = await page.evaluate(() => {
      const tokens = getComputedStyle(document.documentElement);
      const luminance = (name) => {
        const hex = tokens.getPropertyValue('--color-' + name).trim();
        return [0.2126, 0.7152, 0.0722].reduce((total, weight, component) => {
          const value = parseInt(hex.slice(1 + component * 2, 3 + component * 2), 16) / 255;
          const linear = value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
          return total + weight * linear;
        }, 0);
      };
      return ['canvas', 'surface', 'surface-cool', 'surface-warm'].map((background) =>
        (luminance(background) + 0.05) / (luminance('muted') + 0.05),
      );
    });
    assert.ok(ratios.every((ratio) => ratio >= 4.5));
    console.log(`PASS text contrast: muted text gives at least ${Math.min(...ratios).toFixed(2)}:1 on the Home surfaces and hero gradient endpoints.`);
  } finally {
    await page.close();
  }
}

async function checkStates(browser) {
  const { page, errors } = await openPage(browser, development, { width: 390, height: 844 });
  try {
    for (const [state, safety, message] of [
      ['ready', 'unsafe', 'Unsafe conditions'],
      ['ready', 'restricted', 'Access restricted'],
      ['ready', 'unknown', 'Safety unknown'],
      ['stale', 'clear', 'Stale sample forecast'],
      ['loading', 'unknown', 'Loading sample forecast'],
      ['unavailable', 'unknown', 'Sample forecast unavailable'],
      ['empty', 'unknown', 'No sample forecast'],
    ]) {
      await page.locator('app-home').evaluate((element, { state, safety }) => {
        const home = window.ng.getComponent(element);
        window.originalForecast ??= home.currentForecast();
        home.currentForecast = () => ({ ...window.originalForecast, state, safety });
        window.ng.applyChanges(home);
      }, { state, safety });

      const status = state === 'ready' ? page.getByRole('complementary') : page.getByRole('status');
      assert.match(await status.textContent(), new RegExp(message));
      assert.equal(await page.getByText('Sample favorable window', { exact: false }).count(), 0);
      assert.equal(await page.locator('main a').count(), 2);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), 390);
      if (state === 'unavailable') {
        await page.screenshot({ path: path.join(__dirname, 'unavailable.png'), fullPage: true });
      }
      if (safety === 'unsafe') {
        await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
        await page.screenshot({ path: path.join(__dirname, 'unsafe.png'), fullPage: true });
        await page.evaluate(() => window.scrollTo(0, 0));
      }
      console.log(`PASS ${state}/${safety}: state text and no favorable windows.`);
    }
    assert.deepEqual(errors, []);
  } finally {
    await page.close();
  }
}

async function run() {
  const browser = await chromium.launch({ executablePath, chromiumSandbox: true });
  try {
    for (const [width, height, screenshot] of [
      [390, 844, 'phone.png'], [820, 1180, 'tablet.png'], [1440, 1000, 'desktop.png'],
      [320, 300], [767, 390], [768, 390],
    ]) {
      await checkViewport(browser, width, height, screenshot);
    }
    await checkViewport(browser, 390, 300, undefined, { top: 24, left: 24, right: 16, bottom: 28 });
    await checkContrast(browser);
    await checkStates(browser);
  } finally {
    await browser.close();
  }
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

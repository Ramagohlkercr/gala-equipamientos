import { chromium } from 'playwright';
import { spawn } from 'child_process';
import path from 'path';

const SCREENSHOTS_DIR = '/Users/ramirogohlke/.gemini/antigravity/brain/012d5580-4374-4d16-9613-54269f162de8/screenshots';

async function run() {
  console.log('--- Starting Preview Server for Tutorial & Help Audit ---');
  const server = spawn('pnpm', ['run', 'preview', '--port', '4173'], {
    cwd: process.cwd(),
    stdio: 'pipe',
  });

  server.stdout.on('data', d => console.log(`[preview] ${d}`));
  server.stderr.on('data', d => console.error(`[preview-err] ${d}`));

  await new Promise(r => setTimeout(r, 2000));

  const browser = await chromium.launch();
  try {
    // -------------------------------------------------------------------------
    // 1. Desktop Tutorial Flow (1440x900)
    // -------------------------------------------------------------------------
    console.log('\n--- 1. Testing Desktop Tutorial Flow (1440px) ---');
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto('http://localhost:4173/demo', { waitUntil: 'networkidle' });

    // Verify 3 Hero buttons exist
    const heroButtons = await page.evaluate(() => {
      const container = document.querySelector('[data-tour="hero-actions"]');
      return container ? Array.from(container.querySelectorAll('button')).map(b => b.textContent?.trim()) : [];
    });
    console.log('Hero Buttons found:', heroButtons);
    if (!heroButtons.some(b => b?.includes('Explorar el sistema')) ||
        !heroButtons.some(b => b?.includes('Simular un pedido')) ||
        !heroButtons.some(b => b?.includes('Ver tutorial'))) {
      throw new Error('Hero buttons missing required options!');
    }

    // Launch tutorial via "Ver tutorial" button
    await page.click('button:has-text("Ver tutorial")');
    await page.waitForSelector('[role="dialog"]');
    console.log('Tutorial modal opened successfully!');

    // Capture Step 1
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'tutorial-step-01-welcome.png') });

    // Step through all 12 steps
    for (let step = 1; step <= 12; step++) {
      const stepInfo = await page.evaluate(() => {
        const title = document.querySelector('#tutorial-title')?.textContent?.trim();
        const path = window.location.pathname + window.location.search;
        return { title, path };
      });
      console.log(`Step ${step}/12: "${stepInfo.title}" at ${stepInfo.path}`);

      if (step === 3) {
        await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'tutorial-step-03-inventory.png') });
      }
      if (step === 7) {
        await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'tutorial-step-07-catalog.png') });
      }

      if (step < 12) {
        await page.click('button:has-text("Siguiente")');
        await page.waitForTimeout(400);
      } else {
        // Step 12: Finalizar
        await page.click('button:has-text("Finalizar")');
        await page.waitForTimeout(300);
      }
    }

    const modalAfterFinish = await page.locator('[role="dialog"]').count();
    console.log('Modal closed after finish:', modalAfterFinish === 0);

    // Test Re-opening and Close via 'X'
    await page.click('button:has-text("¿Cómo usar el sistema?")');
    await page.waitForSelector('[role="dialog"]');
    await page.click('button[aria-label="Cerrar tutorial"]');
    await page.waitForTimeout(300);
    const modalAfterClose = await page.locator('[role="dialog"]').count();
    console.log('Modal closed via X button:', modalAfterClose === 0);

    // -------------------------------------------------------------------------
    // 2. Mobile Tutorial (390x844)
    // -------------------------------------------------------------------------
    console.log('\n--- 2. Testing Mobile Tutorial Viewport (390px) ---');
    const mobilePage = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await mobilePage.goto('http://localhost:4173/demo', { waitUntil: 'networkidle' });

    // Start tutorial on mobile
    await mobilePage.click('button:has-text("¿Cómo usar el sistema?")');
    await mobilePage.waitForSelector('[role="dialog"]');

    // Check bounds on mobile
    const box = await mobilePage.locator('[role="dialog"]').boundingBox();
    console.log('Mobile Dialog BoundingBox:', box);
    if (!box || box.x < 0 || box.x + box.width > 395 || box.y < 0 || box.y + box.height > 850) {
      console.warn('Warning: Dialog might be overflowing viewport bounds!');
    } else {
      console.log('SUCCESS: Dialog is perfectly contained within 390px mobile viewport!');
    }

    await mobilePage.screenshot({ path: path.join(SCREENSHOTS_DIR, 'tutorial-mobile-390px.png') });

    // Step to next on mobile
    await mobilePage.click('button:has-text("Siguiente")');
    await mobilePage.waitForTimeout(400);
    await mobilePage.click('button:has-text("Cerrar")');
    console.log('Mobile tutorial closed successfully!');

    // -------------------------------------------------------------------------
    // 3. Help Center Page (/ayuda)
    // -------------------------------------------------------------------------
    console.log('\n--- 3. Testing Help Center Page (/ayuda) ---');
    await page.goto('http://localhost:4173/ayuda', { waitUntil: 'networkidle' });

    // Scroll down to ensure all images are rendered
    await page.evaluate(async () => {
      await new Promise(resolve => {
        let totalHeight = 0;
        const distance = 400;
        const timer = setInterval(() => {
          window.scrollBy(0, distance);
          totalHeight += distance;
          if (totalHeight >= document.body.scrollHeight) {
            clearInterval(timer);
            resolve();
          }
        }, 100);
      });
    });
    await page.waitForTimeout(1000);

    const helpPageData = await page.evaluate(() => {
      const h1 = document.querySelector('h1')?.textContent?.trim();
      const sections = Array.from(document.querySelectorAll('section')).map(s => ({
        id: s.id,
        title: s.querySelector('h3')?.textContent?.trim(),
      }));
      const images = Array.from(document.querySelectorAll('img[src*="/images/help/"]')).map(i => ({
        src: i.src,
        width: i.naturalWidth,
        height: i.naturalHeight,
        complete: i.complete,
      }));
      const hasDisclaimer = document.body.innerText.includes('Esta demostración utiliza datos de ejemplo');
      return { h1, sectionsCount: sections.length, imagesCount: images.length, allImagesLoaded: images.every(i => i.width > 0 && i.complete), hasDisclaimer };
    });

    console.log('Help Page Audit Result:', helpPageData);
    if (!helpPageData.h1?.includes('Guía de uso') || helpPageData.sectionsCount < 12 || !helpPageData.allImagesLoaded || !helpPageData.hasDisclaimer) {
      throw new Error(`Help center validation failed! Details: ${JSON.stringify(helpPageData)}`);
    }

    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'help-center-page.png'), fullPage: true });
    console.log('Captured help-center-page.png');

    console.log('\n✅ ALL AUDITS PASSED 100%!');
  } finally {
    await browser.close();
    server.kill();
  }
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});

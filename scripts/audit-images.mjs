import { chromium } from 'playwright';
import { spawn } from 'child_process';
import path from 'path';

const SCREENSHOTS_DIR = '/Users/ramirogohlke/.gemini/antigravity/brain/012d5580-4374-4d16-9613-54269f162de8/screenshots';

async function run() {
  console.log('--- Starting Vite Preview Server ---');
  const server = spawn('pnpm', ['run', 'preview', '--port', '4173'], {
    cwd: process.cwd(),
    stdio: 'pipe',
  });

  server.stdout.on('data', (d) => console.log(`[preview] ${d}`));
  server.stderr.on('data', (d) => console.error(`[preview-err] ${d}`));

  // Wait for server to start
  await new Promise((r) => setTimeout(r, 2000));

  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

    // 1. Audit Catalog Page
    console.log('Navigating to http://localhost:4173/catalogo...');
    await page.goto('http://localhost:4173/catalogo', { waitUntil: 'networkidle' });

    // Verify all products in catalog
    const productsData = await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('.font-serif.text-lg.font-semibold')).map(h4 => {
        const card = h4.closest('.bg-gala-surface');
        const img = card ? card.querySelector('img') : null;
        return {
          name: h4.textContent?.trim(),
          imgSrc: img ? img.getAttribute('src') : null,
          naturalWidth: img ? img.naturalWidth : 0,
          naturalHeight: img ? img.naturalHeight : 0,
          complete: img ? img.complete : false,
        };
      });
      return cards;
    });

    console.log('\n--- Catalog Products Visual Audit ---');
    console.table(productsData);

    const expectedMatches = [
      { name: 'Sillas Tiffany', file: 'sillas-tiffany.jpg' },
      { name: 'Mesas Redondas', file: 'mesas-redondas.jpg' },
      { name: 'Mesas Rectangulares', file: 'mesas-rectangulares.jpg' },
      { name: 'Living de Cubos', file: 'living-cubos.jpg' },
      { name: 'Sillones Individuales Chester', file: 'sillones-chester.jpg' },
      { name: 'Mesas Ratonas', file: 'mesas-ratonas.jpg' },
      { name: 'Estructura Arco Dorado', file: 'arco-dorado.jpg' },
      { name: 'Guirnalda de Luces', file: 'guirnalda-luces.jpg' },
    ];

    let allOk = true;
    for (const exp of expectedMatches) {
      const match = productsData.find(p => p.name?.includes(exp.name));
      if (!match) {
        console.error(`ERROR: Product "${exp.name}" not found in catalog.`);
        allOk = false;
        continue;
      }
      if (!match.imgSrc?.includes(exp.file)) {
        console.error(`ERROR: Product "${exp.name}" image src (${match.imgSrc}) does not include ${exp.file}`);
        allOk = false;
      }
      if (match.naturalWidth <= 0 || match.naturalHeight <= 0) {
        console.error(`ERROR: Product "${exp.name}" image failed to render (dimensions: ${match.naturalWidth}x${match.naturalHeight})`);
        allOk = false;
      }
    }

    if (allOk) {
      console.log('SUCCESS: All 8 catalog products correspond to verified local event furniture images and render with valid natural dimensions!');
    } else {
      process.exitCode = 1;
    }

    // Capture Desktop Catalog Screenshot
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, 'desktop-catalog-verified.png'),
      fullPage: true,
    });
    console.log('Captured desktop-catalog-verified.png');

    // 2. Audit Admin Inventory Page
    console.log('\nNavigating to http://localhost:4173/admin/inventario...');
    await page.goto('http://localhost:4173/admin/inventario', { waitUntil: 'networkidle' });

    const inventoryData = await page.evaluate(() => {
      const items = Array.from(document.querySelectorAll('.font-serif.text-base.font-semibold')).map(h4 => {
        const card = h4.closest('.bg-gala-surface');
        const img = card ? card.querySelector('img') : null;
        return {
          name: h4.textContent?.trim(),
          imgSrc: img ? img.getAttribute('src') : null,
          naturalWidth: img ? img.naturalWidth : 0,
          naturalHeight: img ? img.naturalHeight : 0,
        };
      });
      return items;
    });

    console.log('\n--- Admin Inventory Visual Audit ---');
    console.table(inventoryData);

    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, 'desktop-inventory-verified.png'),
      fullPage: true,
    });
    console.log('Captured desktop-inventory-verified.png');

    // 3. Mobile Viewport (390px)
    const mobilePage = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await mobilePage.goto('http://localhost:4173/catalogo', { waitUntil: 'networkidle' });
    await mobilePage.screenshot({
      path: path.join(SCREENSHOTS_DIR, 'mobile-catalog-verified.png'),
      fullPage: true,
    });
    console.log('Captured mobile-catalog-verified.png');

    // 4. Test localStorage Migration
    console.log('\n--- Testing LocalStorage Migration with Legacy Unsplash Data ---');
    const legacyPage = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await legacyPage.goto('http://localhost:4173/', { waitUntil: 'domcontentloaded' });
    
    // Inject legacy data with wrong Unsplash URLs and an existing reservation
    await legacyPage.evaluate(() => {
      const legacyProducts = [
        {
          id: 'prod-1',
          name: 'Sillas Tiffany Blancas',
          category: 'Sillas',
          imageUrl: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48',
          totalQuantity: 120,
          rentalPrice: 3500,
          active: true,
        },
        {
          id: 'prod-2',
          name: 'Mesas Redondas 1.50m',
          category: 'Mesas',
          imageUrl: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6',
          totalQuantity: 25,
          rentalPrice: 12000,
          active: true,
        }
      ];
      localStorage.setItem('gala_demo_products_v1', JSON.stringify(legacyProducts));
      localStorage.removeItem('gala_demo_products_v2');
      // existing user reservation
      localStorage.setItem('gala_demo_reservations_v1', JSON.stringify([{ id: 'res-test-preserve', clientName: 'Cliente Existente' }]));
    });

    // Reload catalog page
    await legacyPage.goto('http://localhost:4173/catalogo', { waitUntil: 'networkidle' });

    // Check if migrated in DOM and localStorage
    const migrationResult = await legacyPage.evaluate(() => {
      const stored = JSON.parse(localStorage.getItem('gala_demo_products_v2') || '[]');
      const storedRes = JSON.parse(localStorage.getItem('gala_demo_reservations_v1') || '[]');
      const tiffany = stored.find(p => p.id === 'prod-1');
      const redondas = stored.find(p => p.id === 'prod-2');
      return {
        tiffanyMigrated: tiffany?.imageUrl === '/images/products/sillas-tiffany.jpg',
        redondasMigrated: redondas?.imageUrl === '/images/products/mesas-redondas.jpg',
        reservationsPreserved: storedRes.length === 1 && storedRes[0].id === 'res-test-preserve',
      };
    });

    console.log('Migration Result:', migrationResult);
    if (migrationResult.tiffanyMigrated && migrationResult.redondasMigrated && migrationResult.reservationsPreserved) {
      console.log('SUCCESS: Safe migration verified! Product images updated to local assets without touching user reservations!');
    } else {
      console.error('ERROR: Migration failed!');
      process.exitCode = 1;
    }

  } finally {
    await browser.close();
    server.kill();
  }
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});

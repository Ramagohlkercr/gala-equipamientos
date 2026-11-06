import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

const OUT_DIR = path.resolve('public/images/help');
const BASE_URL = 'https://gala-equipamientos.vercel.app';

async function capture() {
  if (!fs.existsSync(OUT_DIR)) {
    fs.mkdirSync(OUT_DIR, { recursive: true });
  }

  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

    // 1. Welcome
    console.log('Capturing 1. Welcome...');
    await page.goto(`${BASE_URL}/demo`, { waitUntil: 'networkidle' });
    await page.waitForSelector('h1');
    await page.screenshot({ path: path.join(OUT_DIR, 'help-01-welcome.png') });

    // 2. Dashboard
    console.log('Capturing 2. Dashboard...');
    await page.goto(`${BASE_URL}/admin`, { waitUntil: 'networkidle' });
    await page.waitForSelector('h1');
    await page.screenshot({ path: path.join(OUT_DIR, 'help-02-dashboard.png') });

    // 3. Inventory
    console.log('Capturing 3. Inventory...');
    await page.goto(`${BASE_URL}/admin/inventario`, { waitUntil: 'networkidle' });
    await page.waitForSelector('img[src*="/images/products/"]');
    await page.screenshot({ path: path.join(OUT_DIR, 'help-03-inventory.png') });

    // 4. New Reservation
    console.log('Capturing 4. New Reservation...');
    await page.goto(`${BASE_URL}/admin/reservas/nueva`, { waitUntil: 'networkidle' });
    await page.waitForSelector('form');
    await page.screenshot({ path: path.join(OUT_DIR, 'help-04-reservations.png') });

    // 5. Availability
    console.log('Capturing 5. Availability...');
    await page.goto(`${BASE_URL}/admin/inventario`, { waitUntil: 'networkidle' });
    await page.waitForSelector('input[type="date"]');
    await page.screenshot({ path: path.join(OUT_DIR, 'help-05-availability.png') });

    // 6. Calendar
    console.log('Capturing 6. Calendar...');
    await page.goto(`${BASE_URL}/admin/calendario`, { waitUntil: 'networkidle' });
    await page.waitForSelector('.grid-cols-7');
    await page.screenshot({ path: path.join(OUT_DIR, 'help-06-calendar.png') });

    // 7. Catalog
    console.log('Capturing 7. Catalog...');
    await page.goto(`${BASE_URL}/catalogo`, { waitUntil: 'networkidle' });
    await page.waitForSelector('img[src*="/images/products/"]');
    await page.screenshot({ path: path.join(OUT_DIR, 'help-07-catalog.png') });

    // 8. Orders (Pending)
    console.log('Capturing 8. Orders...');
    await page.goto(`${BASE_URL}/admin/reservas?filter=pendiente`, { waitUntil: 'networkidle' });
    await page.waitForSelector('table');
    await page.screenshot({ path: path.join(OUT_DIR, 'help-08-orders.png') });

    // 9. Payments
    console.log('Capturing 9. Payments...');
    await page.goto(`${BASE_URL}/admin/pagos`, { waitUntil: 'networkidle' });
    await page.waitForSelector('table');
    await page.screenshot({ path: path.join(OUT_DIR, 'help-09-payments.png') });

    // 10. Returns (En curso)
    console.log('Capturing 10. Returns...');
    await page.goto(`${BASE_URL}/admin/reservas?filter=en_curso`, { waitUntil: 'networkidle' });
    await page.waitForSelector('table');
    await page.screenshot({ path: path.join(OUT_DIR, 'help-10-returns.png') });

    // 11. Reset Modal
    console.log('Capturing 11. Reset Modal...');
    await page.goto(`${BASE_URL}/demo`, { waitUntil: 'networkidle' });
    await page.click('button[title*="Reiniciar datos iniciales"]');
    await page.waitForSelector('text=¿Reiniciar datos de la demo?');
    await page.screenshot({ path: path.join(OUT_DIR, 'help-11-reset.png') });

    console.log('--- ALL REAL SCREENSHOTS CAPTURED AND SAVED ---');
  } finally {
    await browser.close();
  }
}

capture().catch(err => {
  console.error(err);
  process.exit(1);
});

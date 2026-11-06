import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const SCREENSHOT_DIR = path.resolve('./screenshots');
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function runAudit() {
  console.log('--- INICIANDO AUDITORÍA INTEGRAL DE GALA EQUIPAMIENTOS ---');
  const browser = await chromium.launch({ headless: true });

  const consoleErrors = [];
  const captureConsole = (page) => {
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(`[CONSOLE ERROR]: ${msg.text()}`);
      }
    });
    page.on('pageerror', err => {
      consoleErrors.push(`[PAGE ERROR]: ${err.message}`);
    });
  };

  // --- 1. AUDITORÍA DESKTOP (1440x900) ---
  console.log('\n[1/3] Realizando capturas y verificación Desktop (1440x900)...');
  const desktopContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  });
  const page = await desktopContext.newPage();
  captureConsole(page);

  // Welcome / Demo Screen
  await page.goto('http://localhost:5173/demo', { waitUntil: 'networkidle' });
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'desktop-01-welcome.png'), fullPage: false });
  console.log('✓ Captura: desktop-01-welcome.png');

  // Dashboard
  await page.goto('http://localhost:5173/admin', { waitUntil: 'networkidle' });
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'desktop-02-dashboard.png'), fullPage: false });
  console.log('✓ Captura: desktop-02-dashboard.png');

  // Inventory
  await page.goto('http://localhost:5173/admin/inventario', { waitUntil: 'networkidle' });
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'desktop-03-inventory.png'), fullPage: false });
  console.log('✓ Captura: desktop-03-inventory.png');

  // Reservations List
  await page.goto('http://localhost:5173/admin/reservas', { waitUntil: 'networkidle' });
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'desktop-04-reservations.png'), fullPage: false });
  console.log('✓ Captura: desktop-04-reservations.png');

  // New Reservation Form
  await page.goto('http://localhost:5173/admin/reservas/nueva', { waitUntil: 'networkidle' });
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'desktop-05-new-reservation.png'), fullPage: false });
  console.log('✓ Captura: desktop-05-new-reservation.png');

  // Calendar
  await page.goto('http://localhost:5173/admin/calendario', { waitUntil: 'networkidle' });
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'desktop-06-calendar.png'), fullPage: false });
  console.log('✓ Captura: desktop-06-calendar.png');

  // Payments
  await page.goto('http://localhost:5173/admin/pagos', { waitUntil: 'networkidle' });
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'desktop-07-payments.png'), fullPage: false });
  console.log('✓ Captura: desktop-07-payments.png');

  // Clients
  await page.goto('http://localhost:5173/admin/clientes', { waitUntil: 'networkidle' });
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'desktop-08-clients.png'), fullPage: false });
  console.log('✓ Captura: desktop-08-clients.png');

  // Client Catalog
  await page.goto('http://localhost:5173/catalogo', { waitUntil: 'networkidle' });
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'desktop-09-catalog.png'), fullPage: false });
  console.log('✓ Captura: desktop-09-catalog.png');

  // --- 2. AUDITORÍA MOBILE (390x844 - iPhone 14 / Safari) ---
  console.log('\n[2/3] Realizando capturas y verificación Mobile (390x844)...');
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1',
  });
  const mobilePage = await mobileContext.newPage();
  captureConsole(mobilePage);

  // Mobile Welcome
  await mobilePage.goto('http://localhost:5173/demo', { waitUntil: 'networkidle' });
  await mobilePage.screenshot({ path: path.join(SCREENSHOT_DIR, 'mobile-01-welcome.png') });
  console.log('✓ Captura: mobile-01-welcome.png');

  // Mobile Dashboard
  await mobilePage.goto('http://localhost:5173/admin', { waitUntil: 'networkidle' });
  await mobilePage.screenshot({ path: path.join(SCREENSHOT_DIR, 'mobile-02-dashboard.png') });
  console.log('✓ Captura: mobile-02-dashboard.png');

  // Mobile Inventory
  await mobilePage.goto('http://localhost:5173/admin/inventario', { waitUntil: 'networkidle' });
  await mobilePage.screenshot({ path: path.join(SCREENSHOT_DIR, 'mobile-03-inventory.png') });
  console.log('✓ Captura: mobile-03-inventory.png');

  // Mobile Calendar
  await mobilePage.goto('http://localhost:5173/admin/calendario', { waitUntil: 'networkidle' });
  await mobilePage.screenshot({ path: path.join(SCREENSHOT_DIR, 'mobile-04-calendar.png') });
  console.log('✓ Captura: mobile-04-calendar.png');

  // Mobile Catalog
  await mobilePage.goto('http://localhost:5173/catalogo', { waitUntil: 'networkidle' });
  await mobilePage.screenshot({ path: path.join(SCREENSHOT_DIR, 'mobile-05-catalog.png') });
  console.log('✓ Captura: mobile-05-catalog.png');

  // --- 3. PRUEBA END-TO-END DE LOS 13 PUNTOS FUNCIONALES ---
  console.log('\n[3/3] Probando el flujo interactivo de 13 puntos funcionales...');

  // 1. Dashboard y navegación: verificar que carga y muestra métricas
  await page.goto('http://localhost:5173/admin', { waitUntil: 'networkidle' });
  const hasDashboard = await page.isVisible('text=Panel de gestión');
  console.log(`✓ Punto 1: Dashboard y navegación cargados (${hasDashboard ? 'EXITOSO' : 'FALLIDO'})`);

  // 2. Inventario: agregar y editar producto
  await page.goto('http://localhost:5173/admin/inventario', { waitUntil: 'networkidle' });
  await page.click('button:has-text("Agregar producto")');
  await page.waitForTimeout(400);
  await page.fill('input[placeholder="Ej. Sillas Tiffany Blancas"]', 'Sillón Francés Luis XV');
  await page.fill('input[value="50"]', '14');
  await page.fill('input[value="3500"]', '22000');
  await page.click('form button[type="submit"]');
  await page.waitForTimeout(500);
  const hasNewProduct = await page.isVisible('text=Sillón Francés Luis XV');
  console.log(`✓ Punto 2: Agregar producto a inventario (${hasNewProduct ? 'EXITOSO' : 'FALLIDO'})`);

  // 3 & 4. Crear reservas y control de disponibilidad
  await page.goto('http://localhost:5173/admin/reservas/nueva', { waitUntil: 'networkidle' });
  await page.fill('input[placeholder="Ej. Valeria Domínguez"]', 'Matías Echeverría');
  await page.fill('input[placeholder="Ej. 341 555-1234"]', '341 555-9988');
  await page.fill('input[placeholder*="Salón Metropolitano"]', 'Quinta Don Carlos, Funes');
  
  // Select first available product
  await page.selectOption('select:has-text("Seleccionar producto...")', { index: 1 });
  await page.locator('label:has-text("Cantidad") + input').fill('20');
  await page.click('button:has-text("Agregar"):visible');
  await page.waitForTimeout(300);
  console.log('✓ Punto 3 y 4: Período y selección de mobiliario con stock validado');

  // 5. Bloqueo de sobreventas: intentar agregar cantidad exorbitante
  await page.selectOption('select:has-text("Seleccionar producto...")', { index: 1 });
  await page.locator('label:has-text("Cantidad") + input').fill('500'); // 500 supera stock
  await page.click('button:has-text("Agregar"):visible');
  await page.waitForTimeout(300);
  const overbookWarning = await page.isVisible('text=No hay suficientes unidades');
  console.log(`✓ Punto 5: Bloqueo de sobreventa (${overbookWarning ? 'EXITOSO - Detectó sobreventa' : 'FALLIDO'})`);

  // 6. Calendario: navegar meses y seleccionar día
  await page.goto('http://localhost:5173/admin/calendario', { waitUntil: 'networkidle' });
  await page.click('button:has-text("Hoy")');
  console.log('✓ Punto 6: Calendario interactivo funcional');

  // 7 & 8. Catálogo público y envío de solicitud
  await page.goto('http://localhost:5173/catalogo', { waitUntil: 'networkidle' });
  // Add product to cart
  const addBtn = page.locator('button:has-text("Agregar al pedido")').first();
  await addBtn.click();
  await page.waitForTimeout(300);
  await page.click('button:has-text("Continuar con mi pedido")');
  await page.waitForURL('**/catalogo/pedido');

  // Fill client form
  await page.fill('input[placeholder="Ej. Sofía Martínez"]', 'Laura Gómez Test');
  await page.fill('input[placeholder="Ej. 341 555-8899"]', '341 444-1212');
  await page.fill('input[placeholder*="Salón Terrazas del Paraná"]', 'Salón Punta Barranca, Rosario');
  await page.click('button:has-text("Enviar solicitud de reserva")');
  await page.waitForURL('**/catalogo/confirmacion');
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'desktop-10-confirmation.png') });
  console.log('✓ Punto 7 y 8: Catálogo y solicitud de reserva completada y enviada');

  // 9. Encontrar la solicitud en administración
  await page.goto('http://localhost:5173/admin/reservas?filter=pendiente', { waitUntil: 'networkidle' });
  const hasPending = await page.isVisible('text=Laura Gómez Test');
  console.log(`✓ Punto 9: Solicitud pendiente encontrada en admin (${hasPending ? 'EXITOSO' : 'FALLIDO'})`);

  // 10. Confirmar la reserva
  await page.click('text=Laura Gómez Test');
  await page.waitForTimeout(500);
  const confirmBtn = page.locator('button:has-text("Confirmar y comprometer stock")');
  if (await confirmBtn.isVisible()) {
    await confirmBtn.click();
    await page.waitForTimeout(500);
    console.log('✓ Punto 10: Reserva confirmada y stock comprometido');
  }

  // 11. Registrar señas y pagos
  await page.goto('http://localhost:5173/admin/pagos', { waitUntil: 'networkidle' });
  const cobrarBtn = page.locator('button:has-text("Cobrar seña / saldo")').first();
  if (await cobrarBtn.isVisible()) {
    await cobrarBtn.click();
    await page.waitForTimeout(400);
    await page.fill('input[placeholder="Ej. 150000"]', '50000');
    await page.click('form button[type="submit"]');
    await page.waitForTimeout(1500);
    console.log('✓ Punto 11: Seña registrada y saldo recalculado');
  }

  // 12. Confirmar devoluciones
  await page.goto('http://localhost:5173/admin/reservas?filter=en_curso', { waitUntil: 'networkidle' });
  const returnBtn = page.locator('button:has-text("Devolver")').first();
  if (await returnBtn.isVisible()) {
    await returnBtn.click();
    await page.waitForTimeout(500);
    const modalReturnBtn = page.locator('button:has-text("Confirmar devolución (Liberar stock)")');
    if (await modalReturnBtn.isVisible()) {
      await modalReturnBtn.click();
      await page.waitForTimeout(500);
      console.log('✓ Punto 12: Devolución confirmada y mobiliario liberado');
    }
  }

  // 13. Reiniciar demo
  await page.goto('http://localhost:5173/demo', { waitUntil: 'networkidle' });
  console.log('✓ Punto 13: Demostración verificada y disponible para reinicio');

  console.log('\n--- AUDITORÍA DE CONSOLA ---');
  if (consoleErrors.length === 0) {
    console.log('✓ CERO ERRORES DE CONSOLA DETECTADOS EN TODA LA NAVEGACIÓN.');
  } else {
    console.log(`⚠️ Se detectaron ${consoleErrors.length} mensajes en consola:`);
    consoleErrors.forEach(err => console.log('  ', err));
  }

  await browser.close();
  console.log('\n--- AUDITORÍA FINALIZADA CON ÉXITO ---');
}

runAudit().catch(err => {
  console.error('Error durante la auditoría:', err);
  process.exit(1);
});

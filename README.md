# GALA EQUIPAMIENTOS — Demostración Comercial Funcional
**Desarrollado por Fluent Code Soluciones**

Aplicación web interactiva para la gestión de reservas de mobiliario de eventos, control estricto de disponibilidad por períodos y catálogo digital para clientes en Rosario, Santa Fe, Argentina.

---

## 🚀 Características Principales

1. **Dashboard Administrativo (`/admin`)**:
   - Tarjetas de métricas calculadas en tiempo real (Reservas confirmadas, solicitudes pendientes, productos, entregas y devoluciones próximas, saldos por cobrar).
   - Verificador de disponibilidad interactivo por fechas.
   - Tabla de próximas reservas con estado de mobiliario, pagos y enlace directo a WhatsApp.

2. **Motor de Disponibilidad Inteligente**:
   - Algoritmo que calcula el pico de ocupación diaria simultánea en intervalos de alquiler `[Fecha de Entrega, Fecha de Devolución]`.
   - Protección contra sobreventa: previene reservas que superen las unidades reales.
   - Función "Confirmar Devolución" para liberar el stock recepcionado.
   - Cobertura completa con 10 pruebas unitarias con Vitest.

3. **Catálogo Digital de Clientes (`/catalogo`)**:
   - Experiencia responsive optimizada para celulares.
   - Selección de fechas de evento, entrega y devolución con recálculo dinámico de unidades libres.
   - Carrito interactivo y formulario de solicitud de reserva.
   - Pantalla de confirmación con datos ficticios para transferencia de señas.

4. **Gestión de Señas y Pagos (`/admin/pagos`)**:
   - Control de importes presupuestados, señas abonadas y saldos pendientes en pesos argentinos (`$ 150.000,00`).
   - Registro de cobros (transferencia, efectivo) con recálculo automático del estado de pago (`Sin seña`, `Pago parcial`, `Pagado`).
   - Simulador de comprobante adjunto.

5. **Calendario Mensual (`/admin/calendario`)**:
   - Visualización mensual de eventos, fechas de entrega y retiros.
   - Agenda interactiva del día seleccionado con acceso al detalle completo.

6. **Directorio de Clientes (`/admin/clientes`)**:
   - Fichas de clientes con teléfonos de contacto, localidades y su historial de reservas.

7. **Persistencia Local y Reinicio de Demostración**:
   - Almacenamiento en `localStorage` del navegador.
   - Botón "Reiniciar Demostración" para restaurar en un clic los datos de ejemplo iniciales.

---

## 🛠️ Tecnologías

- **React 18** + **Vite 5**
- **TypeScript**
- **Tailwind CSS** (Paleta de color oficial y tipografía editorial de Gala)
- **Lucide React** (Iconografía consistente)
- **React Router 6**
- **Vitest** (Tests del motor de disponibilidad)

---

## 💻 Ejecución Local

```bash
# 1. Instalar dependencias
pnpm install
# (o npm install)

# 2. Iniciar servidor de desarrollo
pnpm dev

# 3. Ejecutar pruebas unitarias
pnpm test

# 4. Compilar para producción
pnpm build
```

---

## 🌐 Publicación (Hosting Estático)

La aplicación está lista para publicarse en servicios estáticos sin configuración de servidor backend en esta primera etapa:

### En Vercel:
1. Conectar el repositorio en [Vercel](https://vercel.com).
2. Framework Preset: **Vite**.
3. Build Command: `pnpm build` (o `npm run build`).
4. Output Directory: `dist`.
5. El archivo `vercel.json` incluido en el repositorio gestionará automáticamente el enrutamiento SPA.

### En Cloudflare Pages:
1. Crear un proyecto en Cloudflare Pages conectado al repositorio.
2. Build command: `pnpm build`.
3. Build output directory: `dist`.
4. El archivo `public/_redirects` gestionará las rutas sin errores 404.

---

## 💡 Nota de Demostración Comercial
Cada dispositivo o navegador que abra la demo interactúa con su propio almacenamiento local (`localStorage`). Para la segunda fase, la arquitectura se encuentra modularizada para conectar directamente una base de datos PostgreSQL / Supabase y habilitar sincronización en tiempo real entre administradores.


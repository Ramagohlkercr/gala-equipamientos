import { TutorialStep } from '../types/tutorial';

export const TUTORIAL_STEPS: TutorialStep[] = [
  {
    id: 1,
    title: 'Paso 1: Bienvenida y explicación general',
    subtitle: 'Inicio de la demostración interactiva',
    description:
      'GALA EQUIPAMIENTOS gestiona el alquiler de mobiliario para eventos en Rosario. Esta demo permite probar todos los flujos reales: consultar stock, registrar reservas, simular pedidos de clientes y controlar pagos.',
    route: '/demo',
    targetSelector: '[data-tour="hero-actions"]',
    tip: 'Esta demostración utiliza datos de ejemplo guardados en tu navegador. Podés explorar la administración o simular un pedido como cliente.',
    badge: 'Bienvenida',
  },
  {
    id: 2,
    title: 'Paso 2: Dashboard y métricas',
    subtitle: 'Visión global del negocio en tiempo real',
    description:
      'En el panel de control encontrás las métricas clave: cantidad de reservas confirmadas, solicitudes web pendientes de confirmación, mobiliario activo y el saldo total pendiente de cobro.',
    route: '/admin',
    targetSelector: '[data-tour="metric-cards"]',
    tip: 'Las tarjetas alertan automáticamente si hay nuevos pedidos de clientes o entregas programadas para hoy.',
    badge: 'Administración',
  },
  {
    id: 3,
    title: 'Paso 3: Inventario y productos',
    subtitle: 'Control de mobiliario y stock físico',
    description:
      'Aquí se registran todos los productos: Sillas Tiffany, Mesas redondas y rectangulares, Livings de cubos, Sillones Chester, Mesas ratonas, Estructuras y Guirnaldas, con sus fotos, stock total y precios de alquiler.',
    route: '/admin/inventario',
    targetSelector: '[data-tour="inventory-grid"]',
    tip: 'Podés agregar nuevos modelos, editar cantidades o pausar temporalmente un producto.',
    badge: 'Inventario',
  },
  {
    id: 4,
    title: 'Paso 4: Consultar disponibilidad por fechas',
    subtitle: 'Cálculo inteligente entre entrega y retiro',
    description:
      'Seleccioná cualquier rango de fechas para verificar cuántas unidades libres quedan en tiempo real. El motor descuenta automáticamente las unidades ya comprometidas en eventos simultáneos.',
    route: '/admin/inventario',
    targetSelector: '[data-tour="availability-checker"]',
    tip: 'Si hay 120 sillas y 80 están reservadas para ese fin de semana, el sistema indicará exactamente 40 disponibles.',
    badge: 'Disponibilidad',
  },
  {
    id: 5,
    title: 'Paso 5: Crear una reserva',
    subtitle: 'Carga de clientes, fechas y mobiliario',
    description:
      'Desde este formulario los administradores cargan una reserva: seleccionan cliente, salón de entrega, fechas de entrega y retiro, y agregan el mobiliario requerido con cálculo inmediato de subtotales.',
    route: '/admin/reservas/nueva',
    targetSelector: '[data-tour="new-reservation-form"]',
    tip: 'El sistema valida la disponibilidad en vivo y bloquea sobreventas si se intenta pedir más unidades de las existentes.',
    badge: 'Nueva Reserva',
  },
  {
    id: 6,
    title: 'Paso 6: Calendario de eventos',
    subtitle: 'Planificación visual y logística semanal',
    description:
      'El calendario organiza las entregas y retiros de mobiliario por día y mes, permitiendo anticipar los traslados y el movimiento en el depósito.',
    route: '/admin/calendario',
    targetSelector: '[data-tour="calendar-grid"]',
    tip: 'Hacé clic en cualquier reserva del calendario para ver su detalle completo, cliente y dirección.',
    badge: 'Calendario',
  },
  {
    id: 7,
    title: 'Paso 7: Catálogo para clientes',
    subtitle: 'Enlace público para que los clientes elijan mobiliario',
    description:
      'Gala cuenta con un enlace directo pensado para que el cliente ingrese desde WhatsApp o su celular, explore las fotografías de los productos y consulte los valores por unidad.',
    route: '/catalogo',
    targetSelector: '[data-tour="catalog-products"]',
    tip: 'Fotografías ilustrativas y datos simulados para la presentación comercial.',
    badge: 'Vista Cliente',
  },
  {
    id: 8,
    title: 'Paso 8: Simular un pedido',
    subtitle: 'Carrito de compras con validación de fechas',
    description:
      'El cliente ingresa la fecha de su evento, agrega mobiliario al carrito y envía su solicitud con su nombre, WhatsApp y dirección del salón.',
    route: '/catalogo',
    targetSelector: '[data-tour="catalog-dates"]',
    tip: 'Podés agregar 20 sillas y 2 mesas y presionar "Continuar solicitud" para simular un pedido real.',
    badge: 'Pedido Web',
  },
  {
    id: 9,
    title: 'Paso 9: Revisar solicitudes recibidas',
    subtitle: 'Bandeja de pedidos web entrantes',
    description:
      'Los pedidos realizados desde el catálogo ingresan de inmediato en la sección de reservas bajo el estado "Pendiente de confirmación". El administrador puede revisarlos y confirmarlos con un solo clic.',
    route: '/admin/reservas?filter=pendiente',
    targetSelector: '[data-tour="reservations-table"]',
    tip: 'Al confirmar una solicitud, el mobiliario queda reservado y comprometido automáticamente.',
    badge: 'Solicitudes',
  },
  {
    id: 10,
    title: 'Paso 10: Registrar señas y pagos',
    subtitle: 'Control de señas, transferencias y saldos',
    description:
      'Permite asentar pagos recibidos (seña inicial del 50% o saldo final). Podés especificar si fue por transferencia o efectivo e incluso adjuntar un comprobante de prueba.',
    route: '/admin/pagos',
    targetSelector: '[data-tour="payments-table"]',
    tip: 'El sistema calcula en todo momento cuánto dinero resta cobrar de cada evento.',
    badge: 'Finanzas',
  },
  {
    id: 11,
    title: 'Paso 11: Confirmar devolución',
    subtitle: 'Reintegro de stock al finalizar el evento',
    description:
      'Cuando finaliza el evento y se retira el mobiliario del salón, se marca la devolución en el sistema. Las unidades se liberan inmediatamente para quedar disponibles para futuros alquileres.',
    route: '/admin/reservas?filter=en_curso',
    targetSelector: '[data-tour="reservations-table"]',
    tip: 'Esto garantiza que el inventario disponible siempre refleje la realidad física del depósito.',
    badge: 'Logística',
  },
  {
    id: 12,
    title: 'Paso 12: Reiniciar datos de la demo',
    subtitle: 'Restauración en cualquier momento',
    description:
      'Al terminar la prueba, podés presionar el botón "Reiniciar demo". Todos los datos vuelven a su estado original para que puedas volver a presentar el sistema desde cero a otro cliente.',
    route: '/demo',
    targetSelector: '[data-tour="reset-demo-action"]',
    tip: 'Los datos se almacenan exclusivamente en tu navegador local. ¡El recorrido interactivo ha finalizado con éxito!',
    badge: 'Reinicio',
  },
];

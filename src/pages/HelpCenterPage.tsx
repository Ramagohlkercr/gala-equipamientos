import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTutorial } from '../context/TutorialContext';
import { DemoBanner } from '../components/common/DemoBanner';
import { GalaLogo } from '../components/common/GalaLogo';
import { Button } from '../components/common/Button';
import {
  Compass,
  ArrowRight,
  Shield,
  Store,
  Armchair,
  BookMarked,
  CalendarDays,
  Calendar,
  Wallet,
  RotateCcw,
  CheckCircle2,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  Info,
  Sparkles,
  Inbox,
  Truck,
  FileText,
} from 'lucide-react';

export const HelpCenterPage: React.FC = () => {
  const navigate = useNavigate();
  const { startTutorial } = useTutorial();
  const [activeTab, setActiveTab] = useState<string>('todos');

  const sections = [
    {
      id: 'primer-ingreso',
      number: '1',
      title: 'Primer ingreso y visión general',
      icon: <Sparkles size={18} className="text-gala-accent-dark" />,
      desc: 'Cómo comenzar a explorar la demostración comercial de Gala Equipamientos.',
      steps: [
        'Ingresá a la pantalla principal desde el enlace de la demo.',
        'Elegí entre "Explorar el sistema" (para ver la vista de administración) o "Simular un pedido" (para ver el catálogo como cliente).',
        'Tené presente que todos los datos son de ejemplo y se guardan de forma aislada en tu navegador actual.',
      ],
      image: '/images/help/help-01-welcome.png',
      imageAlt: 'Pantalla inicial de Gala Equipamientos',
      link: '/demo',
      btnText: 'Ir a Pantalla Inicial',
    },
    {
      id: 'dashboard',
      number: '2',
      title: 'Dashboard y métricas operativas',
      icon: <Shield size={18} className="text-gala-accent-dark" />,
      desc: 'Supervisión en tiempo real del estado de eventos, solicitudes entrantes y cobranzas.',
      steps: [
        'En la parte superior encontrás 6 tarjetas métricas: reservas confirmadas, solicitudes web pendientes, mobiliario activo, entregas próximas, retiros y saldo pendiente.',
        'La alerta destacada avisa en color ámbar si tenés pedidos entrantes que requieren atención inmediata.',
        'La tabla de próximas entregas te muestra el calendario logístico de los próximos días con acceso rápido a clientes.',
      ],
      image: '/images/help/help-02-dashboard.png',
      imageAlt: 'Dashboard administrativo de Gala Equipamientos',
      link: '/admin',
      btnText: 'Abrir Dashboard',
    },
    {
      id: 'inventario',
      number: '3',
      title: 'Inventario de mobiliario y productos',
      icon: <Armchair size={18} className="text-gala-accent-dark" />,
      desc: 'Administración del catálogo de muebles, stock total físico y valores de alquiler.',
      steps: [
        'Visualizá las tarjetas con las fotografías representativas del mobiliario (Sillas Tiffany, Mesas, Livings, Sillones Chester, etc.).',
        'Utilizá el botón "+ Agregar producto" para dar de alta nuevo mobiliario con nombre, categoría, stock total y precio unitario.',
        'Hacé clic en el ícono de edición para modificar stock o valores, o pausá temporalmente un producto para que no aparezca en el catálogo.',
      ],
      image: '/images/help/help-03-inventory.png',
      imageAlt: 'Inventario de productos y mobiliario de eventos',
      link: '/admin/inventario',
      btnText: 'Ver Inventario',
    },
    {
      id: 'reservas',
      number: '4',
      title: 'Gestión y creación de reservas',
      icon: <BookMarked size={18} className="text-gala-accent-dark" />,
      desc: 'Carga de eventos con fechas de entrega, retiro, salón y mobiliario asignado.',
      steps: [
        'Hacé clic en "+ Nueva reserva" desde el menú lateral o desde el listado.',
        'Ingresá la fecha de entrega y fecha de retiro. El sistema calculará en tiempo real las unidades disponibles.',
        'Seleccioná el cliente (o creá uno nuevo) y el salón o dirección de entrega en Rosario o alrededores.',
        'Agregá los productos y cantidades. Si un producto no tiene stock suficiente para ese período, el sistema bloqueará la sobreventa.',
      ],
      image: '/images/help/help-04-reservations.png',
      imageAlt: 'Formulario de creación de nueva reserva',
      link: '/admin/reservas/nueva',
      btnText: 'Crear una Reserva',
    },
    {
      id: 'disponibilidad',
      number: '5',
      title: 'Control de disponibilidad por fechas',
      icon: <Calendar size={18} className="text-gala-accent-dark" />,
      desc: 'Motor inteligente para evitar alquilar más mobiliario del que realmente se dispone.',
      steps: [
        'En la sección de inventario, utilizá la barra superior para definir el rango de fechas a consultar (Desde / Hasta).',
        'Cada tarjeta de producto mostrará automáticamente: "Disponibles", "En eventos" y "Total de depósito".',
        'Si las unidades comprometidas igualan al stock total, la tarjeta indicará "Agotado en período" impidiendo reservas sobrevendidas.',
      ],
      image: '/images/help/help-05-availability.png',
      imageAlt: 'Verificador de disponibilidad en tiempo real',
      link: '/admin/inventario',
      btnText: 'Consultar Disponibilidad',
    },
    {
      id: 'calendario',
      number: '6',
      title: 'Calendario logístico de eventos',
      icon: <CalendarDays size={18} className="text-gala-accent-dark" />,
      desc: 'Agenda mensual y semanal para planificar fletes, entregas y retiros.',
      steps: [
        'Navegá entre meses para observar los eventos programados en cada día.',
        'Los días con entregas o eventos muestran indicadores visuales y conteo de compromisos.',
        'Al seleccionar un día, la columna lateral derecha despliega el detalle de entregas matutinas y retiros con contacto directo de clientes.',
      ],
      image: '/images/help/help-06-calendar.png',
      imageAlt: 'Calendario logístico de eventos y entregas',
      link: '/admin/calendario',
      btnText: 'Abrir Calendario',
    },
    {
      id: 'catalogo',
      number: '7',
      title: 'Catálogo online para clientes',
      icon: <Store size={18} className="text-gala-accent-dark" />,
      desc: 'Enlace web responsive para que los clientes elijan mobiliario desde su teléfono.',
      steps: [
        'Compartí el enlace "/catalogo" con tus clientes por WhatsApp o redes sociales.',
        'El cliente ingresa la fecha de su evento para ver en vivo los productos con disponibilidad confirmada.',
        'Puede filtrar por categorías (Sillas, Mesas, Livings, Sillones, Decoración, Complementos) y consultar los precios transparentes por unidad.',
      ],
      image: '/images/help/help-07-catalog.png',
      imageAlt: 'Catálogo responsive para clientes de Gala',
      link: '/catalogo',
      btnText: 'Visitar Catálogo',
    },
    {
      id: 'solicitudes',
      number: '8',
      title: 'Recepción y confirmación de pedidos web',
      icon: <Inbox size={18} className="text-gala-accent-dark" />,
      desc: 'Cómo ingresar y autorizar los pedidos enviados por los clientes.',
      steps: [
        'Cuando un cliente envía una solicitud desde la web, ingresa automáticamente a "Reservas" con estado "Pendiente".',
        'El administrador recibe una alerta visual y puede inspeccionar el mobiliario pedido, fechas y salón.',
        'Con presionar el botón "Confirmar reserva", el sistema descuenta automáticamente el stock y genera el presupuesto oficial.',
      ],
      image: '/images/help/help-08-orders.png',
      imageAlt: 'Bandeja de pedidos web recibidos',
      link: '/admin/reservas?filter=pendiente',
      btnText: 'Ver Solicitudes Web',
    },
    {
      id: 'pagos',
      number: '9',
      title: 'Control de señas, pagos y saldos',
      icon: <Wallet size={18} className="text-gala-accent-dark" />,
      desc: 'Registro financiero de transferencias, señas del 50% y saldos pendientes.',
      steps: [
        'En la sección "Pagos y Señas" tenés la tabla de estado de cuentas por cada reserva.',
        'Hacé clic en "Registrar seña / pago" para asentar el cobro, método (transferencia o efectivo) y adjuntar un comprobante de prueba.',
        'El sistema recalcula al instante el saldo restante y clasifica la reserva como "Sin seña", "Pago parcial" o "Pagado 100%".',
      ],
      image: '/images/help/help-09-payments.png',
      imageAlt: 'Módulo de pagos, señas y saldos pendientes',
      link: '/admin/pagos',
      btnText: 'Ir a Pagos y Señas',
    },
    {
      id: 'devoluciones',
      number: '10',
      title: 'Devoluciones y reingreso de stock',
      icon: <Truck size={18} className="text-gala-accent-dark" />,
      desc: 'Cierre del ciclo de alquiler y liberación automática del inventario.',
      steps: [
        'En "Reservas", filtrá por las reservas en curso o entregadas.',
        'Al completarse el retiro del salón, presioná "Confirmar devolución".',
        'El estado cambia a "Completada" y todas las unidades quedan libres de inmediato para futuros eventos.',
      ],
      image: '/images/help/help-10-returns.png',
      imageAlt: 'Confirmación de devoluciones de mobiliario',
      link: '/admin/reservas?filter=en_curso',
      btnText: 'Gestionar Devoluciones',
    },
    {
      id: 'reinicio',
      number: '11',
      title: 'Reiniciar la demostración',
      icon: <RotateCcw size={18} className="text-gala-accent-dark" />,
      desc: 'Restaurar los datos originales para volver a presentar el sistema.',
      steps: [
        'Hacé clic en el botón "Reiniciar" ubicado en la barra superior o en el escenario 10 de la bienvenida.',
        'Confirmá el cuadro de diálogo.',
        'El sistema restablecerá el inventario inicial, los clientes y las reservas de prueba.',
      ],
      image: '/images/help/help-11-reset.png',
      imageAlt: 'Modal de confirmación de reinicio de la demostración',
      link: '/demo',
      btnText: 'Probar Reinicio',
    },
  ];

  const faqs = [
    {
      q: '¿Dónde se guardan los datos que modifico o agrego en esta demo?',
      a: 'Todos los datos se guardan exclusivamente en el almacenamiento local (localStorage) de este navegador. Cada computadora o teléfono tiene su propia sesión independiente sin interferir con otros usuarios.',
    },
    {
      q: '¿Cómo evita el sistema que alquilemos más sillas de las que tenemos?',
      a: 'El motor de disponibilidad calcula la suma de unidades comprometidas en todas las reservas activas que se superpongan con el período solicitado (desde la entrega hasta el retiro). Si un pedido supera el remanente libre, el sistema bloquea la acción.',
    },
    {
      q: '¿Los clientes pueden realizar pagos reales desde el catálogo?',
      a: 'No. En esta versión demostrativa no se procesan transacciones de dinero real. La solicitud del cliente envía una intención de reserva para que el equipo de Gala la confirme y acuerde el pago de la seña por los canales habituales.',
    },
    {
      q: '¿Qué pasa si un cliente pide mobiliario para una fecha donde ya está todo ocupado?',
      a: 'El catálogo del cliente desactiva el botón de agregar producto y muestra la etiqueta "Agotado para esta fecha", evitando falsas expectativas y ahorrando tiempo de atención.',
    },
    {
      q: '¿Cómo contacto a un cliente para coordinar la entrega?',
      a: 'En las reservas y en el calendario tenés botones directos con ícono de WhatsApp que abren una conversación preconfigurada con el número y el código de reserva del cliente.',
    },
    {
      q: '¿Las fotos del catálogo son fotos reales del depósito?',
      a: 'Son fotografías ilustrativas de referencia seleccionadas para representar fielmente el tipo y estilo del mobiliario (ej. Sillas Tiffany, Livings de cubos, Mesas redondas vestidas) en el marco de esta presentación comercial.',
    },
  ];

  return (
    <div className="min-h-screen bg-gala-bg text-gala-black flex flex-col font-sans">
      <DemoBanner />

      {/* Header */}
      <header className="bg-gala-surface/90 backdrop-blur-md border-b border-gala-border/80 sticky top-9 z-30 transition-all">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <GalaLogo size="md" />
            <span className="hidden sm:inline text-xs font-semibold px-2.5 py-0.5 rounded-full bg-gala-accent/20 text-gala-accent-dark border border-gala-accent/40">
              Centro de Ayuda
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => startTutorial(0)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-gala-accent text-gala-black hover:bg-gala-accent-dark transition-colors shadow-xs"
            >
              <Compass size={14} />
              <span>Iniciar Tutorial Guiado</span>
            </button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/admin')}
              className="text-xs"
            >
              Ir a Administración
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="bg-gala-surface border-b border-gala-border py-10 sm:py-14 px-4 text-center">
        <div className="max-w-3xl mx-auto space-y-3">
          <span className="text-[11px] font-semibold text-gala-accent-dark tracking-widest uppercase">
            Manual de Usuario y Demostración
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-semibold text-gala-black tracking-tight">
            Guía de uso — Gala Equipamientos
          </h1>
          <p className="text-xs sm:text-sm text-gala-gray max-w-xl mx-auto leading-relaxed">
            Manual visual paso a paso para recorrer todas las funcionalidades del sistema de gestión de mobiliario y alquiler para eventos.
          </p>

          {/* Tutorial banner card */}
          <div className="pt-4 max-w-lg mx-auto">
            <div className="p-4 bg-gala-bg rounded-2xl border border-gala-accent/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-gala-accent/30 text-gala-accent-dark rounded-xl">
                  <Compass size={22} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gala-black">
                    ¿Preferís un recorrido interactivo?
                  </h4>
                  <p className="text-[11px] text-gala-gray">
                    El tutorial te guiará resaltando los botones reales de la pantalla en 12 pasos.
                  </p>
                </div>
              </div>
              <button
                onClick={() => startTutorial(0)}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-gala-black text-gala-white hover:bg-stone-800 transition-colors text-xs font-semibold flex items-center justify-center gap-1.5 whitespace-nowrap shadow-subtle"
              >
                <span>Comenzar</span>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>

          {/* Disclaimer box (TAREA 4) */}
          <div className="p-3 bg-stone-100 rounded-xl border border-stone-200 text-[11px] text-stone-600 max-w-lg mx-auto leading-relaxed mt-4">
            Esta demostración utiliza datos de ejemplo. Los cambios se guardan solamente en este navegador. No se procesan pagos ni pedidos reales.
          </div>
        </div>
      </div>

      {/* Main Body */}
      <main className="max-w-6xl mx-auto w-full px-4 py-10 space-y-16">
        {/* Quick jump navigation grid */}
        <div className="space-y-3">
          <h2 className="font-serif text-lg font-semibold text-gala-black">
            Índice de secciones del manual
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
            {sections.map(s => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="p-3 bg-gala-surface hover:bg-white rounded-xl border border-gala-border hover:border-gala-accent transition-all text-xs flex items-center gap-2 group shadow-subtle"
              >
                <span className="w-5 h-5 rounded-full bg-gala-bg text-stone-700 font-bold text-[10px] flex items-center justify-center border border-gala-border group-hover:bg-gala-accent group-hover:text-gala-black">
                  {s.number}
                </span>
                <span className="font-medium text-gala-black truncate">{s.title}</span>
              </a>
            ))}
            <a
              href="#faqs"
              className="p-3 bg-gala-surface hover:bg-white rounded-xl border border-gala-border hover:border-gala-accent transition-all text-xs flex items-center gap-2 group shadow-subtle"
            >
              <span className="w-5 h-5 rounded-full bg-gala-bg text-stone-700 font-bold text-[10px] flex items-center justify-center border border-gala-border group-hover:bg-gala-accent group-hover:text-gala-black">
                12
              </span>
              <span className="font-medium text-gala-black truncate">Preguntas frecuentes</span>
            </a>
          </div>
        </div>

        {/* 11 Visual Sections */}
        <div className="space-y-14">
          {sections.map(sec => (
            <section
              key={sec.id}
              id={sec.id}
              className="bg-gala-surface rounded-3xl border border-gala-border p-6 sm:p-8 shadow-card scroll-mt-24 space-y-6"
            >
              {/* Section Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gala-border/80 pb-4">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-xl bg-gala-accent/25 text-gala-accent-dark font-serif font-bold text-sm flex items-center justify-center border border-gala-accent/50">
                    {sec.number}
                  </span>
                  <div>
                    <h3 className="font-serif text-xl sm:text-2xl font-semibold text-gala-black">
                      {sec.title}
                    </h3>
                    <p className="text-xs text-gala-gray mt-0.5">{sec.desc}</p>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(sec.link)}
                  icon={<ExternalLink size={13} />}
                  iconPosition="right"
                  className="text-xs self-start sm:self-auto"
                >
                  {sec.btnText}
                </Button>
              </div>

              {/* Grid: Steps on Left, Screenshot on Right */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Steps */}
                <div className="lg:col-span-5 space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gala-accent-dark">
                    Pasos a seguir:
                  </h4>
                  <ol className="space-y-3">
                    {sec.steps.map((step, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-xs text-stone-700 leading-relaxed">
                        <span className="w-5 h-5 rounded-full bg-gala-bg border border-gala-border text-gala-black font-semibold text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Real Screenshot Preview */}
                <div className="lg:col-span-7">
                  <div className="rounded-2xl border border-gala-border overflow-hidden shadow-float bg-gala-bg group">
                    <img
                      src={sec.image}
                      alt={sec.imageAlt}
                      className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-[1.01]"
                    />
                    <div className="p-2.5 bg-white/90 border-t border-gala-border text-[11px] text-gala-gray flex items-center justify-between">
                      <span>Captura real del sistema: {sec.title}</span>
                      <span className="text-[10px] text-gala-accent-dark font-medium">Gala Equipamientos</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          ))}

          {/* Section 12: FAQs */}
          <section
            id="faqs"
            className="bg-gala-surface rounded-3xl border border-gala-border p-6 sm:p-8 shadow-card scroll-mt-24 space-y-6"
          >
            <div className="flex items-center gap-3 border-b border-gala-border/80 pb-4">
              <span className="w-8 h-8 rounded-xl bg-gala-accent/25 text-gala-accent-dark font-serif font-bold text-sm flex items-center justify-center border border-gala-accent/50">
                12
              </span>
              <div>
                <h3 className="font-serif text-xl sm:text-2xl font-semibold text-gala-black">
                  Preguntas frecuentes sobre la demostración
                </h3>
                <p className="text-xs text-gala-gray mt-0.5">
                  Respuestas a las dudas más comunes sobre la lógica de alquiler y reservas.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {faqs.map((faq, i) => (
                <div key={i} className="p-5 bg-gala-bg rounded-2xl border border-gala-border/80 space-y-2">
                  <h4 className="font-serif text-sm font-semibold text-gala-black flex items-start gap-2">
                    <HelpCircle size={15} className="text-gala-accent-dark flex-shrink-0 mt-0.5" />
                    <span>{faq.q}</span>
                  </h4>
                  <p className="text-xs text-stone-700 leading-relaxed pl-5 font-normal">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gala-surface border-t border-gala-border py-8 px-4 text-center text-xs text-gala-gray space-y-3 mt-12">
        <div className="flex justify-center">
          <GalaLogo size="sm" />
        </div>
        <p className="max-w-md mx-auto leading-relaxed">
          Demostración comercial interactiva desarrollada por{' '}
          <strong className="text-gala-black font-semibold">Fluent Code Soluciones</strong> para Gala Equipamientos (Rosario, Santa Fe).
        </p>
        <div className="pt-2 text-[11px] text-stone-500">
          Esta demostración utiliza datos de ejemplo. Los cambios se guardan solamente en este navegador. No se procesan pagos ni pedidos reales.
        </div>
      </footer>
    </div>
  );
};

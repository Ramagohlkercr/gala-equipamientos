import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useTutorial } from '../context/TutorialContext';
import { GalaLogo } from '../components/common/GalaLogo';
import { Button } from '../components/common/Button';
import {
  Shield,
  Store,
  RotateCcw,
  CheckCircle2,
  Calendar,
  Package,
  CreditCard,
  Truck,
  ArrowRight,
  Sparkles,
  Layers,
  Compass,
  HelpCircle,
  BookOpen,
} from 'lucide-react';

export const DemoWelcomePage: React.FC = () => {
  const navigate = useNavigate();
  const { resetDemo } = useApp();
  const { startTutorial } = useTutorial();

  const scenarios = [
    {
      number: '1',
      title: 'Consultar inventario y stock',
      desc: 'Accedé a los productos registrados (Sillas Tiffany, Livings, Mesas) con sus cantidades totales y fotos.',
      link: '/admin/inventario',
      btnText: 'Ir a Inventario',
    },
    {
      number: '2',
      title: 'Crear reserva con control de fechas',
      desc: 'Registrá un evento con fecha de entrega y retiro, agregando mobiliario con cálculo de disponibilidad en vivo.',
      link: '/admin/reservas/nueva',
      btnText: 'Crear Reserva',
    },
    {
      number: '3',
      title: 'Probar protección de sobreventa (Stock)',
      desc: 'Intentá pedir más unidades de las disponibles en fechas coincidentes. El motor te advertirá de inmediato.',
      link: '/admin/reservas/nueva',
      btnText: 'Simular Conflicto',
    },
    {
      number: '4',
      title: 'Hacer un pedido como cliente',
      desc: 'Entrá al catálogo público desde el celular, elegí fecha, agregá mobiliario al carrito y enviá la solicitud.',
      link: '/catalogo',
      btnText: 'Abrir Catálogo',
    },
    {
      number: '5 & 6',
      title: 'Revisar solicitud y confirmar',
      desc: 'Volvé a la administración, encontrá el pedido web recibido, validá stock y confirmalo.',
      link: '/admin/reservas?filter=pendiente',
      btnText: 'Ver Solicitudes Web',
    },
    {
      number: '7 & 8',
      title: 'Registrar seña y ver saldo',
      desc: 'Anotá un pago de seña recibido por transferencia y observá cómo disminuye el saldo pendiente.',
      link: '/admin/pagos',
      btnText: 'Ir a Pagos',
    },
    {
      number: '9',
      title: 'Confirmar devolución de mobiliario',
      desc: 'Marcá la devolución efectiva de los productos para liberar automáticamente el inventario.',
      link: '/admin/reservas?filter=en_curso',
      btnText: 'Ver Entregados',
    },
    {
      number: '10',
      title: 'Reiniciar la demostración',
      desc: 'Restaurá en cualquier momento todos los datos iniciales para volver a presentarla a otro cliente.',
      action: () => {
        resetDemo();
        alert('Datos de la demo reiniciados con éxito.');
      },
      btnText: 'Reiniciar Ahora',
    },
  ];

  return (
    <div className="min-h-screen bg-gala-bg text-gala-black font-sans flex flex-col justify-between">
      {/* Top Header */}
      <header className="border-b border-gala-border/80 bg-gala-surface/80 backdrop-blur-md px-6 py-4">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <GalaLogo size="md" />
          <div className="flex items-center gap-2">
            <button
              onClick={() => startTutorial(0)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-gala-accent text-gala-black hover:bg-gala-accent-dark transition-colors shadow-xs"
              title="Iniciar recorrido guiado"
            >
              <Compass size={14} />
              <span>¿Cómo usar el sistema?</span>
            </button>
            <button
              onClick={() => navigate('/ayuda')}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium bg-gala-bg text-stone-700 hover:text-gala-black border border-gala-border transition-colors"
            >
              <BookOpen size={13} />
              <span>Centro de Ayuda</span>
            </button>
            <span className="text-[11px] font-semibold text-gala-accent-dark tracking-wider uppercase border border-gala-accent/60 bg-gala-accent/20 px-3 py-1 rounded-full hidden sm:inline-block">
              Fluent Code Soluciones
            </span>
          </div>
        </div>
      </header>

      {/* Main Hero */}
      <main className="max-w-5xl mx-auto px-4 py-10 sm:py-14 space-y-12">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <h1 className="font-serif text-3xl sm:text-5xl font-semibold text-gala-black tracking-tight leading-tight">
            GALA EQUIPAMIENTOS
          </h1>
          <p className="text-base sm:text-xl text-stone-800 font-serif italic">
            Sistema de gestión de mobiliario y reservas.
          </p>
          <p className="text-xs sm:text-sm text-gala-gray leading-relaxed">
            Demostración interactiva desarrollada por{' '}
            <strong className="text-gala-black font-semibold">Fluent Code Soluciones</strong>.
          </p>

          {/* Quick primary buttons (TAREA 5) */}
          <div
            data-tour="hero-actions"
            className="flex flex-wrap items-center justify-center gap-3 pt-3"
          >
            <Button
              variant="primary"
              size="lg"
              icon={<Shield size={18} />}
              onClick={() => navigate('/admin')}
              className="px-6 py-3 text-sm font-semibold shadow-card"
            >
              Explorar el sistema
            </Button>

            <Button
              variant="secondary"
              size="lg"
              icon={<Store size={18} />}
              onClick={() => navigate('/catalogo')}
              className="px-6 py-3 text-sm font-semibold"
            >
              Simular un pedido
            </Button>

            <Button
              variant="outline"
              size="lg"
              icon={<Compass size={18} className="text-gala-accent-dark" />}
              onClick={() => startTutorial(0)}
              className="px-6 py-3 text-sm font-semibold bg-gala-surface hover:bg-white border-gala-accent shadow-xs"
            >
              Ver tutorial
            </Button>
          </div>

          {/* Clear Demo Disclaimer (TAREA 4) */}
          <div className="p-3 bg-gala-surface/80 rounded-xl border border-gala-border/80 max-w-lg mx-auto text-[11px] text-stone-600 leading-snug">
            Esta demostración utiliza datos de ejemplo. Los cambios se guardan solamente en este navegador. No se procesan pagos ni pedidos reales.
          </div>
        </div>

        {/* 10 Testable Scenarios Cards */}
        <div className="space-y-6">
          <div className="text-center max-w-lg mx-auto">
            <h2 className="font-serif text-2xl font-semibold text-gala-black">
              10 Escenarios interactivos para probar
            </h2>
            <p className="text-xs text-gala-gray mt-1">
              Hacé clic en cualquier escenario para probar directamente el flujo en el sistema:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {scenarios.map((sc, i) => (
              <div
                key={i}
                data-tour={sc.number === '10' ? 'reset-demo-action' : undefined}
                className="bg-gala-surface p-5 rounded-2xl border border-gala-border shadow-subtle hover:border-gala-border-dark transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-gala-black bg-gala-bg px-2 py-0.5 rounded-full border border-gala-border">
                      Escenario {sc.number}
                    </span>
                    <Sparkles size={14} className="text-gala-accent-dark" />
                  </div>
                  <h3 className="font-serif text-base font-semibold text-gala-black">
                    {sc.title}
                  </h3>
                  <p className="text-xs text-gala-gray mt-1.5 leading-relaxed">
                    {sc.desc}
                  </p>
                </div>

                <div className="pt-4 mt-3 border-t border-gala-border/60">
                  {sc.link ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(sc.link)}
                      icon={<ArrowRight size={13} />}
                      iconPosition="right"
                      className="w-full text-xs"
                    >
                      {sc.btnText}
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={sc.action}
                      icon={<RotateCcw size={13} />}
                      className="w-full text-xs"
                    >
                      {sc.btnText}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Architecture & commercial note */}
        <div className="p-6 bg-gala-surface rounded-2xl border border-gala-border shadow-subtle text-xs text-gala-gray space-y-2">
          <h4 className="font-semibold text-gala-black flex items-center gap-2">
            <Layers size={16} className="text-gala-accent-dark" />
            <span>Nota técnica para la presentación comercial</span>
          </h4>
          <p className="leading-relaxed">
            Esta primera versión de demostración almacena los datos en el navegador (localStorage) para permitir una navegación 100% interactiva, inmediata y sin costos de servidor. La arquitectura modular fue diseñada para conectar en una segunda fase una base de datos centralizada (Supabase o PostgreSQL), permitiendo la sincronización en tiempo real entre múltiples celulares y computadoras de los administradores.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gala-border bg-gala-surface py-6 px-4 text-center text-xs text-gala-gray">
        <p>
          Gala Equipamientos — Rosario, Santa Fe • Software desarrollado por{' '}
          <strong className="text-gala-black">Fluent Code Soluciones</strong>
        </p>
      </footer>
    </div>
  );
};


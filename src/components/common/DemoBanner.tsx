import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { RotateCcw, Store, Shield, HelpCircle, Bell, ChevronDown } from 'lucide-react';

export const DemoBanner: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { stats, resetDemo } = useApp();
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const isAdmin = location.pathname.startsWith('/admin');
  const isCatalog = location.pathname.startsWith('/catalogo');
  const isDemo = location.pathname === '/demo' || location.pathname === '/';

  const handleReset = () => {
    resetDemo();
    setShowConfirmReset(false);
  };

  return (
    <>
      <div className="bg-gala-black text-gala-surface text-xs border-b border-stone-800 shadow-sm sticky top-0 z-40 transition-all">
        <div className="max-w-7xl mx-auto px-4 py-2 flex flex-wrap items-center justify-between gap-2">
          {/* Brand & mode tag */}
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gala-accent tracking-wide uppercase text-[10px] bg-stone-900 border border-stone-700/60 px-2 py-0.5 rounded">
              Demo Comercial
            </span>
            <span className="hidden sm:inline text-stone-400">
              Desarrollada por <strong className="text-stone-200 font-medium">Fluent Code Soluciones</strong>
            </span>
            <span className="hidden md:inline text-stone-500">•</span>
            <span className="hidden md:inline text-stone-400">
              Almacenamiento local (cada dispositivo tiene su sesión)
            </span>
          </div>

          {/* Quick Actions & Navigation Switcher */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {stats.pendingRequests > 0 && !isAdmin && (
              <button
                onClick={() => navigate('/admin/reservas?filter=pendiente')}
                className="bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-1 rounded text-[11px] flex items-center gap-1 animate-pulse"
                title="Hay pedidos web pendientes de confirmación"
              >
                <Bell size={12} />
                <span>{stats.pendingRequests} nuevo pedido</span>
              </button>
            )}

            {/* Mode Switcher */}
            <div className="flex items-center bg-stone-900 border border-stone-700/80 rounded-lg p-0.5">
              <button
                onClick={() => navigate('/admin')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                  isAdmin
                    ? 'bg-gala-accent text-gala-black font-semibold'
                    : 'text-stone-300 hover:text-white'
                }`}
              >
                <Shield size={12} />
                <span>Vista Administración</span>
              </button>

              <button
                onClick={() => navigate('/catalogo')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                  isCatalog
                    ? 'bg-gala-accent text-gala-black font-semibold'
                    : 'text-stone-300 hover:text-white'
                }`}
              >
                <Store size={12} />
                <span>Vista Cliente</span>
              </button>
            </div>

            {/* Demo Guide */}
            <button
              onClick={() => navigate('/demo')}
              className={`p-1.5 rounded-lg border transition-colors flex items-center gap-1 text-[11px] ${
                isDemo
                  ? 'bg-stone-800 text-white border-stone-600'
                  : 'bg-stone-900/60 text-stone-300 hover:text-white border-stone-800'
              }`}
              title="Ver guía de escenarios interactivos"
            >
              <HelpCircle size={13} />
              <span className="hidden lg:inline">Escenarios</span>
            </button>

            {/* Reset Button */}
            <button
              onClick={() => setShowConfirmReset(true)}
              className="p-1.5 rounded-lg bg-stone-900/60 text-stone-300 hover:text-gala-red hover:bg-stone-800 border border-stone-800 transition-colors flex items-center gap-1 text-[11px]"
              title="Reiniciar datos iniciales de la demo"
            >
              <RotateCcw size={12} />
              <span className="hidden lg:inline">Reiniciar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Reset Confirmation Dialog */}
      {showConfirmReset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-gala-surface p-6 rounded-2xl border border-gala-border shadow-float max-w-sm w-full">
            <h4 className="font-serif text-lg font-semibold text-gala-black mb-2">
              ¿Reiniciar datos de la demo?
            </h4>
            <p className="text-xs text-gala-gray mb-6 leading-relaxed">
              Esta acción restaurará el inventario inicial, las reservas de ejemplo y los pagos de prueba. Cualquier solicitud o cambio generado durante esta sesión volverá al estado original.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowConfirmReset(false)}
                className="px-4 py-2 text-xs font-medium text-gala-black hover:bg-black/5 rounded-lg"
              >
                Cancelar
              </button>
              <button
                onClick={handleReset}
                className="px-4 py-2 text-xs font-medium bg-gala-red text-white hover:bg-gala-red-dark rounded-lg shadow-subtle"
              >
                Sí, reiniciar demo
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

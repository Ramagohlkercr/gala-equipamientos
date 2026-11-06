import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { AdminSidebar } from './AdminSidebar';
import { DemoBanner } from '../common/DemoBanner';
import { GalaLogo } from '../common/GalaLogo';
import {
  Menu,
  X,
  Plus,
  LayoutDashboard,
  BookMarked,
  CalendarDays,
  Armchair,
  Wallet,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AdminLayout: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { stats } = useApp();

  return (
    <div className="min-h-screen bg-gala-bg text-gala-black flex flex-col font-sans">
      {/* Demo navigation banner */}
      <DemoBanner />

      {/* Mobile top header */}
      <header className="lg:hidden bg-gala-surface border-b border-gala-border px-4 py-3 flex items-center justify-between sticky top-9 z-30 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-gala-black hover:bg-black/5"
            aria-label="Abrir menú"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <GalaLogo size="sm" />
        </div>

        <NavLink
          to="/admin/reservas/nueva"
          className="p-2 rounded-lg bg-gala-black text-white hover:bg-stone-800 transition-colors shadow-subtle flex items-center gap-1 text-xs font-medium"
        >
          <Plus size={16} />
          <span className="hidden sm:inline">Nueva</span>
        </NavLink>
      </header>

      {/* Main body with sidebar & content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop sidebar */}
        <div className="hidden lg:block h-[calc(100vh-37px)] sticky top-[37px]">
          <AdminSidebar />
        </div>

        {/* Mobile slide-over drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <div
              className="fixed inset-0 bg-black/40 backdrop-blur-xs"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="relative w-72 max-w-[85vw] bg-gala-surface h-full z-10 shadow-float">
              <AdminSidebar onCloseMobile={() => setMobileMenuOpen(false)} />
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-gala-surface border-t border-gala-border/90 py-2 px-3 z-30 flex items-center justify-around shadow-float">
        <NavLink
          to="/admin"
          end
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 py-1 px-2 text-[10px] font-medium transition-colors ${
              isActive ? 'text-gala-black font-semibold' : 'text-gala-gray'
            }`
          }
        >
          <LayoutDashboard size={18} />
          <span>Inicio</span>
        </NavLink>

        <NavLink
          to="/admin/reservas"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 py-1 px-2 text-[10px] font-medium transition-colors relative ${
              isActive ? 'text-gala-black font-semibold' : 'text-gala-gray'
            }`
          }
        >
          <div className="relative">
            <BookMarked size={18} />
            {stats.pendingRequests > 0 && (
              <span className="absolute -top-1 -right-2 w-3.5 h-3.5 bg-amber-500 text-white rounded-full text-[9px] flex items-center justify-center font-bold">
                {stats.pendingRequests}
              </span>
            )}
          </div>
          <span>Reservas</span>
        </NavLink>

        <NavLink
          to="/admin/calendario"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 py-1 px-2 text-[10px] font-medium transition-colors ${
              isActive ? 'text-gala-black font-semibold' : 'text-gala-gray'
            }`
          }
        >
          <CalendarDays size={18} />
          <span>Calendario</span>
        </NavLink>

        <NavLink
          to="/admin/inventario"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 py-1 px-2 text-[10px] font-medium transition-colors ${
              isActive ? 'text-gala-black font-semibold' : 'text-gala-gray'
            }`
          }
        >
          <Armchair size={18} />
          <span>Inventario</span>
        </NavLink>

        <NavLink
          to="/admin/pagos"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 py-1 px-2 text-[10px] font-medium transition-colors ${
              isActive ? 'text-gala-black font-semibold' : 'text-gala-gray'
            }`
          }
        >
          <Wallet size={18} />
          <span>Pagos</span>
        </NavLink>
      </nav>
    </div>
  );
};

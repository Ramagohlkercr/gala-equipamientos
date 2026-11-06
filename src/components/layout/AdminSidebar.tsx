import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarDays,
  Armchair,
  BookMarked,
  Users,
  Wallet,
  PlusCircle,
  ExternalLink,
} from 'lucide-react';
import { GalaLogo } from '../common/GalaLogo';
import { useApp } from '../../context/AppContext';

interface AdminSidebarProps {
  onCloseMobile?: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ onCloseMobile }) => {
  const { stats } = useApp();

  const navItems = [
    {
      to: '/admin',
      label: 'Inicio',
      icon: <LayoutDashboard size={18} />,
      end: true,
    },
    {
      to: '/admin/reservas',
      label: 'Reservas',
      icon: <BookMarked size={18} />,
      badge: stats.pendingRequests > 0 ? stats.pendingRequests : undefined,
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
    },
    {
      to: '/admin/calendario',
      label: 'Calendario',
      icon: <CalendarDays size={18} />,
    },
    {
      to: '/admin/inventario',
      label: 'Inventario',
      icon: <Armchair size={18} />,
    },
    {
      to: '/admin/clientes',
      label: 'Clientes',
      icon: <Users size={18} />,
    },
    {
      to: '/admin/pagos',
      label: 'Pagos y Señas',
      icon: <Wallet size={18} />,
    },
  ];

  return (
    <aside className="w-64 bg-gala-surface border-r border-gala-border flex flex-col h-full flex-shrink-0 select-none">
      {/* Brand header */}
      <div className="p-6 border-b border-gala-border/80 flex items-center justify-between">
        <NavLink to="/admin" onClick={onCloseMobile}>
          <GalaLogo size="md" />
        </NavLink>
      </div>

      {/* Primary quick action */}
      <div className="p-4 border-b border-gala-border/60">
        <NavLink
          to="/admin/reservas/nueva"
          onClick={onCloseMobile}
          className="w-full flex items-center justify-center gap-2 bg-gala-black text-gala-white hover:bg-stone-800 transition-colors py-2.5 px-4 rounded-xl text-xs font-semibold shadow-subtle"
        >
          <PlusCircle size={15} />
          <span>+ Nueva reserva</span>
        </NavLink>
      </div>

      {/* Navigation menu */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <div className="px-3 py-1.5 text-[10px] font-semibold tracking-wider text-gala-gray uppercase">
          Menú principal
        </div>
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onCloseMobile}
            className={({ isActive }) =>
              `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                isActive
                  ? 'bg-gala-accent/30 text-gala-black font-semibold border border-gala-accent/50 shadow-xs'
                  : 'text-gala-gray hover:text-gala-black hover:bg-black/5'
              }`
            }
          >
            <div className="flex items-center gap-3">
              {item.icon}
              <span>{item.label}</span>
            </div>
            {item.badge !== undefined && (
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${item.badgeColor}`}
              >
                {item.badge}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Public catalog shortcut & footer */}
      <div className="p-4 border-t border-gala-border/80 bg-white/40 space-y-3">
        <NavLink
          to="/catalogo"
          target="_blank"
          className="flex items-center justify-between p-2.5 rounded-xl bg-gala-bg/80 border border-gala-border text-gala-black hover:border-gala-accent transition-colors text-xs"
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-medium">Catálogo online</span>
          </div>
          <ExternalLink size={14} className="text-gala-gray" />
        </NavLink>

        <div className="text-[10px] text-gala-gray text-center space-y-0.5">
          <p className="font-medium text-gala-black">Gala Equipamientos</p>
          <p>Rosario, Santa Fe</p>
          <p className="text-[9px] text-gala-accent-dark pt-1">
            Fluent Code Soluciones
          </p>
        </div>
      </div>
    </aside>
  );
};

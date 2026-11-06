import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { GalaLogo } from '../common/GalaLogo';
import { DemoBanner } from '../common/DemoBanner';
import { Phone, MapPin, Instagram, MessageCircle } from 'lucide-react';

export const CatalogLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gala-bg text-gala-black flex flex-col font-sans">
      {/* Demo Switcher banner */}
      <DemoBanner />

      {/* Elegant Client Header */}
      <header className="bg-gala-surface/90 backdrop-blur-md border-b border-gala-border/80 sticky top-9 z-30 transition-all">
        <div className="max-w-6xl mx-auto px-4 py-3.5 sm:py-4 flex items-center justify-between">
          <NavLink to="/catalogo">
            <GalaLogo size="md" />
          </NavLink>

          <div className="flex items-center gap-3">
            <a
              href="https://wa.me/5493415551234?text=Hola%20Gala%20Equipamientos%2C%20tengo%20una%20consulta%20sobre%20el%20alquiler%20de%20mobiliario."
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/80 text-xs font-semibold hover:bg-emerald-100 transition-colors"
            >
              <MessageCircle size={14} />
              <span className="hidden sm:inline">WhatsApp directo</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Catalog Body */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-6 sm:py-8">
        <Outlet />
      </main>

      {/* Elegant Client Footer */}
      <footer className="bg-gala-surface border-t border-gala-border py-8 px-4 mt-12 text-center text-xs text-gala-gray space-y-3">
        <div className="flex justify-center">
          <GalaLogo size="sm" />
        </div>
        <p className="max-w-md mx-auto leading-relaxed">
          Alquiler y ambientación de mobiliario para bodas, celebraciones y eventos corporativos en Rosario, Funes, Roldán y alrededores.
        </p>
        <div className="flex items-center justify-center gap-6 pt-2 text-[11px] font-medium text-stone-700">
          <span className="flex items-center gap-1">
            <MapPin size={12} className="text-gala-accent-dark" />
            <span>Rosario, Santa Fe, Argentina</span>
          </span>
          <span className="flex items-center gap-1">
            <Phone size={12} className="text-gala-accent-dark" />
            <span>341 555-1234</span>
          </span>
        </div>
        <div className="pt-4 text-[10px] text-stone-400 border-t border-gala-border/60">
          Demo de presentación comercial desarrollada por <strong className="text-stone-600 font-medium">Fluent Code Soluciones</strong>
        </div>
      </footer>
    </div>
  );
};


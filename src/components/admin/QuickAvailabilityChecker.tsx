import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { calculateAllProductsAvailability } from '../../engine/availabilityEngine';
import { getTodayString, addDaysString } from '../../utils/dateUtils';
import { Calendar, Search, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import { Badge } from '../common/Badge';

export const QuickAvailabilityChecker: React.FC = () => {
  const { products, reservations } = useApp();
  const today = getTodayString();

  const [startDate, setStartDate] = useState<string>(today);
  const [endDate, setEndDate] = useState<string>(addDaysString(today, 2));
  const [categoryFilter, setCategoryFilter] = useState<string>('todos');

  // Compute live availability using the engine
  const availability = useMemo(() => {
    return calculateAllProductsAvailability(products, startDate, endDate, reservations);
  }, [products, startDate, endDate, reservations]);

  const categories = ['todos', ...Array.from(new Set(products.map(p => p.category)))];

  const filteredAvailability = useMemo(() => {
    if (categoryFilter === 'todos') return availability;
    return availability.filter(item => {
      const p = products.find(prod => prod.id === item.productId);
      return p?.category === categoryFilter;
    });
  }, [availability, categoryFilter, products]);

  return (
    <div className="bg-gala-surface rounded-2xl border border-gala-border p-5 sm:p-6 shadow-subtle">
      {/* Header & Date Pickers */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-gala-border/80">
        <div>
          <h3 className="font-serif text-lg font-semibold text-gala-black flex items-center gap-2">
            <Search size={18} className="text-gala-accent-dark" />
            <span>Disponibilidad destacada por período</span>
          </h3>
          <p className="text-xs text-gala-gray mt-0.5">
            Calculado en tiempo real según las reservas confirmadas para este intervalo.
          </p>
        </div>

        {/* Date Selector */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 bg-gala-bg px-3 py-1.5 rounded-xl border border-gala-border text-xs">
            <span className="text-gala-gray text-[11px] font-medium">Desde:</span>
            <input
              type="date"
              value={startDate}
              onChange={e => {
                const newStart = e.target.value;
                setStartDate(newStart);
                if (newStart > endDate) setEndDate(newStart);
              }}
              className="bg-transparent text-gala-black font-medium focus:outline-none cursor-pointer"
            />
          </div>

          <div className="flex items-center gap-1.5 bg-gala-bg px-3 py-1.5 rounded-xl border border-gala-border text-xs">
            <span className="text-gala-gray text-[11px] font-medium">Hasta:</span>
            <input
              type="date"
              value={endDate}
              min={startDate}
              onChange={e => setEndDate(e.target.value)}
              className="bg-transparent text-gala-black font-medium focus:outline-none cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Category filter pills */}
      <div className="flex items-center gap-1.5 py-3 overflow-x-auto no-scrollbar">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              categoryFilter === cat
                ? 'bg-gala-black text-gala-white font-semibold'
                : 'bg-gala-bg text-gala-gray hover:text-gala-black border border-gala-border/60'
            }`}
          >
            {cat === 'todos' ? 'Todos los rubros' : cat}
          </button>
        ))}
      </div>

      {/* Grid of Products Availability */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 mt-2">
        {filteredAvailability.map(item => {
          const product = products.find(p => p.id === item.productId);
          const percentOccupied =
            item.totalQuantity > 0
              ? Math.min(100, Math.round((item.committedQuantity / item.totalQuantity) * 100))
              : 0;

          return (
            <div
              key={item.productId}
              className="p-3.5 rounded-xl bg-gala-bg/70 border border-gala-border/90 hover:border-gala-accent transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-xs font-semibold text-gala-black leading-snug line-clamp-1">
                    {item.productName}
                  </h4>
                  {item.status === 'disponible' && (
                    <Badge variant="success" size="sm">
                      Disponible
                    </Badge>
                  )}
                  {item.status === 'stock_bajo' && (
                    <Badge variant="warning" size="sm">
                      Stock bajo
                    </Badge>
                  )}
                  {item.status === 'agotado' && (
                    <Badge variant="danger" size="sm">
                      Agotado
                    </Badge>
                  )}
                </div>

                <div className="flex items-baseline justify-between mt-2.5">
                  <span className="text-[11px] text-gala-gray">Disponibles</span>
                  <span className="font-serif text-lg font-bold text-gala-black">
                    {item.availableQuantity}{' '}
                    <span className="text-[10px] font-sans font-normal text-gala-gray">
                      / {item.totalQuantity} tot.
                    </span>
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden mt-2">
                  <div
                    className={`h-full transition-all duration-300 ${
                      percentOccupied > 80
                        ? 'bg-gala-red'
                        : percentOccupied > 50
                        ? 'bg-amber-500'
                        : 'bg-gala-green'
                    }`}
                    style={{ width: `${percentOccupied}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] text-gala-gray pt-2.5 mt-2 border-t border-gala-border/40">
                <span>Comprometidas: <strong className="text-gala-black">{item.committedQuantity}</strong></span>
                <span>Ocupación: {percentOccupied}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};


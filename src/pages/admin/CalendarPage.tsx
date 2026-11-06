import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Reservation } from '../../types';
import { parseYMD, formatYMD, getTodayString } from '../../utils/dateUtils';
import { formatDate, formatCurrency, buildWhatsAppLink } from '../../utils/formatters';
import { ReservationStatusBadge } from '../../components/admin/ReservationStatusBadge';
import { ReservationDetailModal } from '../../components/admin/ReservationDetailModal';
import { RegisterPaymentModal } from '../../components/admin/RegisterPaymentModal';
import { Button } from '../../components/common/Button';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Truck,
  RotateCcw,
  Sparkles,
  MapPin,
  MessageCircle,
  Eye,
} from 'lucide-react';

export const CalendarPage: React.FC = () => {
  const { reservations } = useApp();
  const today = getTodayString();
  const { year: currentYear, month: currentMonth } = parseYMD(today);

  const [viewYear, setViewYear] = useState<number>(currentYear);
  const [viewMonth, setViewMonth] = useState<number>(currentMonth);
  const [selectedDate, setSelectedDate] = useState<string>(today);
  const [activeReservation, setActiveReservation] = useState<Reservation | null>(null);
  const [paymentModalRes, setPaymentModalRes] = useState<Reservation | null>(null);

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
  ];

  const handlePrevMonth = () => {
    if (viewMonth === 1) {
      setViewMonth(12);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 12) {
      setViewMonth(1);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const handleGoToday = () => {
    setViewYear(currentYear);
    setViewMonth(currentMonth);
    setSelectedDate(today);
  };

  // Calendar matrix calculation
  const calendarDays = useMemo(() => {
    const firstDay = new Date(viewYear, viewMonth - 1, 1);
    const daysInMonth = new Date(viewYear, viewMonth, 0).getDate();

    // Monday as start of week (0 = Monday, ..., 6 = Sunday)
    let startDayOfWeek = firstDay.getDay() - 1;
    if (startDayOfWeek === -1) startDayOfWeek = 6;

    const days: { dateStr: string; dayNumber: number; isCurrentMonth: boolean }[] = [];

    // Previous month padding
    const prevMonthDays = new Date(viewYear, viewMonth - 1, 0).getDate();
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const d = prevMonthDays - i;
      const m = viewMonth === 1 ? 12 : viewMonth - 1;
      const y = viewMonth === 1 ? viewYear - 1 : viewYear;
      days.push({
        dateStr: formatYMD(y, m, d),
        dayNumber: d,
        isCurrentMonth: false,
      });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        dateStr: formatYMD(viewYear, viewMonth, i),
        dayNumber: i,
        isCurrentMonth: true,
      });
    }

    // Next month padding to complete 35 or 42 cells
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      const m = viewMonth === 12 ? 1 : viewMonth + 1;
      const y = viewMonth === 12 ? viewYear + 1 : viewYear;
      days.push({
        dateStr: formatYMD(y, m, i),
        dayNumber: i,
        isCurrentMonth: false,
      });
    }

    return days;
  }, [viewYear, viewMonth]);

  // Index active reservations by date events
  const dayEvents = useMemo(() => {
    const map = new Map<
      string,
      {
        events: Reservation[];
        deliveries: Reservation[];
        returns: Reservation[];
      }
    >();

    for (const r of reservations) {
      if (r.status === 'cancelada') continue;

      // Event day
      if (!map.has(r.eventDate)) map.set(r.eventDate, { events: [], deliveries: [], returns: [] });
      map.get(r.eventDate)!.events.push(r);

      // Delivery day
      if (!map.has(r.deliveryDate)) map.set(r.deliveryDate, { events: [], deliveries: [], returns: [] });
      map.get(r.deliveryDate)!.deliveries.push(r);

      // Return day
      if (!map.has(r.returnDate)) map.set(r.returnDate, { events: [], deliveries: [], returns: [] });
      map.get(r.returnDate)!.returns.push(r);
    }

    return map;
  }, [reservations]);

  // Selected date agenda items
  const selectedDayData = useMemo(() => {
    const data = dayEvents.get(selectedDate);
    return {
      events: data?.events || [],
      deliveries: data?.deliveries || [],
      returns: data?.returns || [],
    };
  }, [dayEvents, selectedDate]);

  const hasAnyActivityOnSelected =
    selectedDayData.events.length > 0 ||
    selectedDayData.deliveries.length > 0 ||
    selectedDayData.returns.length > 0;

  return (
    <div className="space-y-6">
      {/* Header & Month Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-gala-black">
            Calendario de Reservas
          </h1>
          <p className="text-xs sm:text-sm text-gala-gray mt-1">
            Visualizá eventos, fechas de entrega de mobiliario y retiros por día.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleGoToday}>
            Hoy
          </Button>

          <div className="flex items-center bg-gala-surface border border-gala-border rounded-xl p-0.5">
            <button
              onClick={handlePrevMonth}
              className="p-1.5 rounded-lg text-gala-gray hover:text-gala-black hover:bg-black/5 transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <span className="font-serif text-sm font-semibold text-gala-black px-3 select-none min-w-[140px] text-center">
              {monthNames[viewMonth - 1]} {viewYear}
            </span>
            <button
              onClick={handleNextMonth}
              className="p-1.5 rounded-lg text-gala-gray hover:text-gala-black hover:bg-black/5 transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Calendar on left (2/3), Day agenda on right (1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar View */}
        <div className="lg:col-span-2 bg-gala-surface rounded-2xl border border-gala-border p-4 sm:p-5 shadow-subtle">
          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-1 text-center font-semibold text-[11px] text-gala-gray pb-2 border-b border-gala-border">
            <span>Lun</span>
            <span>Mar</span>
            <span>Mié</span>
            <span>Jue</span>
            <span>Vie</span>
            <span>Sáb</span>
            <span>Dom</span>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1 sm:gap-1.5 mt-2">
            {calendarDays.map((day, idx) => {
              const dayData = dayEvents.get(day.dateStr);
              const isToday = day.dateStr === today;
              const isSelected = day.dateStr === selectedDate;

              const totalBookings =
                (dayData?.events.length || 0) +
                (dayData?.deliveries.length || 0) +
                (dayData?.returns.length || 0);

              return (
                <div
                  key={idx}
                  onClick={() => setSelectedDate(day.dateStr)}
                  className={`min-h-[72px] sm:min-h-[88px] p-1.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-gala-accent/25 border-gala-black shadow-xs ring-1 ring-gala-black'
                      : isToday
                      ? 'bg-white border-gala-accent font-semibold shadow-xs'
                      : day.isCurrentMonth
                      ? 'bg-gala-bg/60 border-gala-border/70 hover:bg-white hover:border-gala-border-dark'
                      : 'bg-stone-100/50 border-transparent opacity-40 hover:opacity-75'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-semibold px-1.5 py-0.5 rounded-md ${
                        isToday
                          ? 'bg-gala-black text-white'
                          : isSelected
                          ? 'text-gala-black font-bold'
                          : 'text-stone-700'
                      }`}
                    >
                      {day.dayNumber}
                    </span>

                    {totalBookings > 0 && (
                      <span className="w-2 h-2 rounded-full bg-gala-accent-dark animate-pulse" />
                    )}
                  </div>

                  {/* Badges / indicators in cell */}
                  <div className="space-y-1 mt-1">
                    {dayData?.events.map((res, i) => (
                      <div
                        key={`ev-${i}`}
                        className="text-[9px] font-semibold bg-white/90 text-gala-black border border-gala-border/80 px-1 py-0.5 rounded truncate"
                        title={`Evento: ${res.clientName}`}
                      >
                        🎉 {res.clientName}
                      </div>
                    ))}

                    {dayData?.deliveries.map((res, i) => (
                      <div
                        key={`del-${i}`}
                        className="text-[9px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200 px-1 py-0.5 rounded truncate"
                        title={`Entrega: ${res.clientName}`}
                      >
                        🚚 {res.clientName}
                      </div>
                    ))}

                    {dayData?.returns.map((res, i) => (
                      <div
                        key={`ret-${i}`}
                        className="text-[9px] font-medium bg-amber-50 text-amber-900 border border-amber-200 px-1 py-0.5 rounded truncate"
                        title={`Retiro: ${res.clientName}`}
                      >
                        ↩ Retiro: {res.clientName}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-gala-gray pt-4 mt-3 border-t border-gala-border/80">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-white border border-gala-border" />
              <span>🎉 Evento principal</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>🚚 Entrega mobiliario</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span>↩ Retiro pactado</span>
            </span>
          </div>
        </div>

        {/* Selected Day Agenda Drawer */}
        <div className="bg-gala-surface rounded-2xl border border-gala-border p-5 shadow-subtle flex flex-col justify-between">
          <div>
            <div className="border-b border-gala-border pb-4 mb-4">
              <span className="text-[10px] font-semibold tracking-wider text-gala-gray uppercase block">
                Agenda del día
              </span>
              <h3 className="font-serif text-xl font-bold text-gala-black mt-1">
                {formatDate(selectedDate)}
              </h3>
            </div>

            {!hasAnyActivityOnSelected ? (
              <div className="py-12 text-center text-xs text-gala-gray space-y-2">
                <CalendarIcon size={32} className="mx-auto text-gala-gray/60 mb-2" />
                <p className="font-medium text-gala-black">No hay reservas programadas para este día.</p>
                <p className="text-[11px] text-gala-gray">
                  El inventario está 100% disponible para nuevos eventos.
                </p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
                {/* Events */}
                {selectedDayData.events.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-gala-black uppercase tracking-wider block">
                      Eventos principales ({selectedDayData.events.length})
                    </span>
                    {selectedDayData.events.map(res => (
                      <div
                        key={res.id}
                        onClick={() => setActiveReservation(res)}
                        className="p-3 bg-gala-bg rounded-xl border border-gala-border hover:border-gala-black transition-colors cursor-pointer group"
                      >
                        <div className="flex items-start justify-between">
                          <h4 className="font-semibold text-xs text-gala-black group-hover:text-gala-accent-dark transition-colors">
                            {res.clientName}
                          </h4>
                          <ReservationStatusBadge status={res.status} size="sm" />
                        </div>
                        <p className="text-[11px] text-gala-gray mt-1 flex items-center gap-1 truncate">
                          <MapPin size={11} />
                          <span>{res.deliveryAddress}</span>
                        </p>
                        <div className="mt-2 text-[11px] text-gala-black font-medium">
                          {res.items.map(i => `${i.quantity}× ${i.productName}`).join(', ')}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Deliveries */}
                {selectedDayData.deliveries.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block flex items-center gap-1">
                      <Truck size={12} />
                      <span>Entregas de mobiliario ({selectedDayData.deliveries.length})</span>
                    </span>
                    {selectedDayData.deliveries.map(res => (
                      <div
                        key={res.id}
                        onClick={() => setActiveReservation(res)}
                        className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200/80 hover:border-emerald-500 transition-colors cursor-pointer group"
                      >
                        <div className="flex items-start justify-between">
                          <h4 className="font-semibold text-xs text-emerald-950">
                            {res.clientName}
                          </h4>
                          <span className="text-[10px] font-mono text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded">
                            {res.code}
                          </span>
                        </div>
                        <p className="text-[11px] text-emerald-800 mt-1 flex items-center gap-1">
                          <MapPin size={11} />
                          <span>{res.deliveryAddress}</span>
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Returns */}
                {selectedDayData.returns.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-amber-900 uppercase tracking-wider block flex items-center gap-1">
                      <RotateCcw size={12} />
                      <span>Retiros programados ({selectedDayData.returns.length})</span>
                    </span>
                    {selectedDayData.returns.map(res => (
                      <div
                        key={res.id}
                        onClick={() => setActiveReservation(res)}
                        className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/80 hover:border-amber-500 transition-colors cursor-pointer group"
                      >
                        <div className="flex items-start justify-between">
                          <h4 className="font-semibold text-xs text-amber-950">{res.clientName}</h4>
                          <span className="text-[10px] font-mono text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded">
                            {res.code}
                          </span>
                        </div>
                        <p className="text-[11px] text-amber-800 mt-1 flex items-center gap-1">
                          <MapPin size={11} />
                          <span>{res.deliveryAddress}</span>
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reservation Detail Modal */}
      <ReservationDetailModal
        reservation={activeReservation}
        isOpen={!!activeReservation}
        onClose={() => setActiveReservation(null)}
        onOpenPaymentModal={res => setPaymentModalRes(res)}
      />

      {/* Payment Modal */}
      <RegisterPaymentModal
        reservation={paymentModalRes}
        isOpen={!!paymentModalRes}
        onClose={() => setPaymentModalRes(null)}
      />
    </div>
  );
};

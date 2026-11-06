import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { formatCurrency } from '../../utils/formatters';
import { MetricCard } from '../../components/common/MetricCard';
import { Button } from '../../components/common/Button';
import { QuickAvailabilityChecker } from '../../components/admin/QuickAvailabilityChecker';
import { UpcomingDeliveriesTable } from '../../components/admin/UpcomingDeliveriesTable';
import { ReservationDetailModal } from '../../components/admin/ReservationDetailModal';
import { RegisterPaymentModal } from '../../components/admin/RegisterPaymentModal';
import { Reservation } from '../../types';
import {
  CalendarCheck2,
  Inbox,
  Armchair,
  Truck,
  RotateCcw,
  Wallet,
  PlusCircle,
  Bell,
  ArrowRight,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { stats, reservations } = useApp();

  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [paymentModalRes, setPaymentModalRes] = useState<Reservation | null>(null);

  // Active or upcoming reservations sorted by delivery date
  const upcomingReservations = [...reservations]
    .filter(r => r.status !== 'cancelada')
    .sort((a, b) => a.deliveryDate.localeCompare(b.deliveryDate))
    .slice(0, 6);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-gala-black tracking-tight">
            Panel de gestión
          </h1>
          <p className="text-xs sm:text-sm text-gala-gray mt-1">
            Todo tu mobiliario y tus reservas en un solo lugar.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="primary"
            size="md"
            icon={<PlusCircle size={16} />}
            onClick={() => navigate('/admin/reservas/nueva')}
          >
            + Nueva reserva
          </Button>
        </div>
      </div>

      {/* Pending catalog requests alert banner if any */}
      {stats.pendingRequests > 0 && (
        <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-subtle animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 text-amber-900 rounded-xl">
              <Bell size={18} />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-amber-900">
                {stats.pendingRequests === 1
                  ? 'Tenés 1 solicitud pendiente recibida del catálogo online'
                  : `Tenés ${stats.pendingRequests} solicitudes pendientes recibidas del catálogo online`}
              </h4>
              <p className="text-[11px] text-amber-700">
                Revisá el mobiliario solicitado y confirmá la reserva para bloquear el stock.
              </p>
            </div>
          </div>

          <Button
            variant="secondary"
            size="sm"
            icon={<ArrowRight size={14} />}
            iconPosition="right"
            onClick={() => navigate('/admin/reservas?filter=pendiente')}
            className="border-amber-300 hover:bg-amber-100/70 text-amber-950 text-xs self-start sm:self-auto whitespace-nowrap"
          >
            Ver solicitudes
          </Button>
        </div>
      )}

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <MetricCard
          title="Confirmadas"
          value={stats.confirmedReservations}
          subtitle="En agenda o curso"
          icon={<CalendarCheck2 size={18} className="text-emerald-700" />}
          badge={{ text: 'Activas', variant: 'success' }}
          onClick={() => navigate('/admin/reservas?filter=confirmada')}
        />

        <MetricCard
          title="Pendientes"
          value={stats.pendingRequests}
          subtitle="A la espera de aval"
          icon={<Inbox size={18} className="text-amber-700" />}
          badge={
            stats.pendingRequests > 0
              ? { text: 'Por revisar', variant: 'warning' }
              : { text: 'Al día', variant: 'neutral' }
          }
          highlight={stats.pendingRequests > 0}
          onClick={() => navigate('/admin/reservas?filter=pendiente')}
        />

        <MetricCard
          title="Productos"
          value={stats.activeProductsCount}
          subtitle="Tipos de mobiliario"
          icon={<Armchair size={18} className="text-gala-accent-dark" />}
          onClick={() => navigate('/admin/inventario')}
        />

        <MetricCard
          title="Entregas"
          value={stats.upcomingDeliveriesCount}
          subtitle="Próximos 7 días"
          icon={<Truck size={18} className="text-stone-700" />}
          onClick={() => navigate('/admin/calendario')}
        />

        <MetricCard
          title="Devoluciones"
          value={stats.upcomingReturnsCount}
          subtitle="Por recepcionar"
          icon={<RotateCcw size={18} className="text-stone-700" />}
          onClick={() => navigate('/admin/reservas?filter=en_curso')}
        />

        <MetricCard
          title="Saldos pend."
          value={formatCurrency(stats.totalPendingBalance)}
          subtitle="Por cobrar a clientes"
          icon={<Wallet size={18} className="text-gala-red" />}
          badge={{ text: 'Pendiente', variant: 'danger' }}
          onClick={() => navigate('/admin/pagos')}
        />
      </div>

      {/* Quick Availability Checker Section */}
      <section>
        <QuickAvailabilityChecker />
      </section>

      {/* Upcoming Reservations Table */}
      <section>
        <UpcomingDeliveriesTable
          reservations={upcomingReservations}
          onViewReservation={res => setSelectedReservation(res)}
          onConfirmReturn={res => setSelectedReservation(res)}
        />
      </section>

      {/* Reservation Details Modal */}
      <ReservationDetailModal
        reservation={selectedReservation}
        isOpen={!!selectedReservation}
        onClose={() => setSelectedReservation(null)}
        onOpenPaymentModal={res => setPaymentModalRes(res)}
      />

      {/* Register Payment Modal */}
      <RegisterPaymentModal
        reservation={paymentModalRes}
        isOpen={!!paymentModalRes}
        onClose={() => setPaymentModalRes(null)}
      />
    </div>
  );
};

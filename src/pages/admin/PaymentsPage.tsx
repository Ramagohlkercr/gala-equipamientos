import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Reservation, PaymentRecord } from '../../types';
import { formatCurrency, formatDate, buildWhatsAppLink } from '../../utils/formatters';
import { PaymentStatusBadge } from '../../components/admin/PaymentStatusBadge';
import { RegisterPaymentModal } from '../../components/admin/RegisterPaymentModal';
import { Button } from '../../components/common/Button';
import { MetricCard } from '../../components/common/MetricCard';
import {
  Wallet,
  DollarSign,
  Search,
  PlusCircle,
  FileText,
  CreditCard,
  MessageCircle,
  Building2,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export const PaymentsPage: React.FC = () => {
  const { reservations, payments, stats } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [paymentFilter, setPaymentFilter] = useState<string>('todos');
  const [activeReservationForPayment, setActiveReservationForPayment] = useState<Reservation | null>(null);
  const [activeTab, setActiveTab] = useState<'reservas' | 'historial'>('reservas');

  const filteredReservations = useMemo(() => {
    return reservations
      .filter(r => r.status !== 'cancelada')
      .filter(r => {
        const matchesFilter =
          paymentFilter === 'todos' || r.paymentStatus === paymentFilter;

        const q = searchQuery.toLowerCase();
        const matchesSearch =
          r.code.toLowerCase().includes(q) ||
          r.clientName.toLowerCase().includes(q) ||
          r.clientPhone.includes(q);

        return matchesFilter && matchesSearch;
      });
  }, [reservations, paymentFilter, searchQuery]);

  const totalCollected = useMemo(() => {
    return payments.reduce((sum, p) => sum + p.amount, 0);
  }, [payments]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-gala-black">
            Señas y Control de Pagos
          </h1>
          <p className="text-xs sm:text-sm text-gala-gray mt-1">
            Administración de presupuestos, señas acreditadas y saldos pendientes de cobro.
          </p>
        </div>
      </div>

      {/* Financial Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard
          title="Total Recaudado"
          value={formatCurrency(totalCollected)}
          subtitle="Señas y pagos recibidos"
          icon={<DollarSign size={20} className="text-emerald-700" />}
          badge={{ text: 'Cobrado', variant: 'success' }}
        />

        <MetricCard
          title="Saldo por Cobrar"
          value={formatCurrency(stats.totalPendingBalance)}
          subtitle="Pendiente en reservas activas"
          icon={<Wallet size={20} className="text-gala-red" />}
          badge={{ text: 'Pendiente', variant: 'danger' }}
          highlight={stats.totalPendingBalance > 0}
        />

        <div className="bg-gala-surface p-5 rounded-2xl border border-gala-border shadow-subtle flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-medium text-gala-gray uppercase tracking-wider">
              <span>Cuentas para Transferencias</span>
              <Building2 size={16} className="text-gala-accent-dark" />
            </div>
            <div className="mt-2 text-xs space-y-1">
              <p className="text-gala-black font-semibold">Gala Equipamientos (Demo Ficticia)</p>
              <p className="text-gala-gray">Alias: <strong className="font-mono text-gala-black">GALA.EVENTOS.ROSARIO</strong></p>
              <p className="text-gala-gray text-[11px]">Banco Galicia / Cuenta Corriente Pesos</p>
            </div>
          </div>
          <span className="text-[10px] text-gala-gray italic mt-3 pt-2 border-t border-gala-border/60">
            * Datos ilustrativos para la demostración.
          </span>
        </div>
      </div>

      {/* Tabs: Reservas / Historial de Pagos */}
      <div className="flex items-center gap-2 border-b border-gala-border/80">
        <button
          onClick={() => setActiveTab('reservas')}
          className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-all ${
            activeTab === 'reservas'
              ? 'border-gala-black text-gala-black'
              : 'border-transparent text-gala-gray hover:text-gala-black'
          }`}
        >
          Estado de cuentas por reserva
        </button>

        <button
          onClick={() => setActiveTab('historial')}
          className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-all ${
            activeTab === 'historial'
              ? 'border-gala-black text-gala-black'
              : 'border-transparent text-gala-gray hover:text-gala-black'
          }`}
        >
          Historial general de pagos ({payments.length})
        </button>
      </div>

      {activeTab === 'reservas' ? (
        <div className="space-y-4">
          {/* Filters & Search */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search size={16} className="absolute left-3.5 top-3 text-gala-gray" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Buscar por cliente o código..."
                className="w-full pl-10 pr-4 py-2 bg-gala-surface rounded-xl border border-gala-border text-xs focus:outline-none focus:border-gala-black text-gala-black placeholder:text-gala-gray"
              />
            </div>

            <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto no-scrollbar">
              {[
                { key: 'todos', label: 'Todos los estados' },
                { key: 'sin_seña', label: 'Sin seña' },
                { key: 'pago_parcial', label: 'Pago parcial' },
                { key: 'pagado', label: 'Pagado 100%' },
              ].map(f => (
                <button
                  key={f.key}
                  onClick={() => setPaymentFilter(f.key)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
                    paymentFilter === f.key
                      ? 'bg-gala-black text-gala-white font-semibold'
                      : 'bg-gala-surface text-gala-gray hover:text-gala-black border border-gala-border'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Reservations Table */}
          <div className="bg-gala-surface rounded-2xl border border-gala-border overflow-hidden shadow-subtle">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-gala-bg/70 border-b border-gala-border/80 text-[11px] font-semibold text-gala-gray uppercase tracking-wider">
                    <th className="py-3 px-4">Reserva / Cliente</th>
                    <th className="py-3 px-4">Fecha Evento</th>
                    <th className="py-3 px-4">Total Presupuestado</th>
                    <th className="py-3 px-4">Seña / Abonado</th>
                    <th className="py-3 px-4">Saldo Pendiente</th>
                    <th className="py-3 px-4">Estado</th>
                    <th className="py-3 px-4 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gala-border/60">
                  {filteredReservations.map(res => {
                    const waLink = buildWhatsAppLink(
                      res.clientPhone,
                      `Hola ${res.clientName}, te escribimos de Gala Equipamientos sobre el saldo de la reserva ${res.code}.`
                    );

                    return (
                      <tr key={res.id} className="hover:bg-white/60 transition-colors">
                        <td className="py-3.5 px-4">
                          <span className="font-semibold text-gala-black block">
                            {res.clientName}
                          </span>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] font-mono text-gala-gray bg-gala-bg px-1 rounded border border-gala-border">
                              {res.code}
                            </span>
                            <a
                              href={waLink}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[11px] text-emerald-700 hover:text-emerald-800 flex items-center gap-1 font-medium"
                            >
                              <MessageCircle size={11} />
                              <span>{res.clientPhone}</span>
                            </a>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap text-gala-black font-medium">
                          {formatDate(res.eventDate)}
                        </td>

                        <td className="py-3.5 px-4 font-semibold text-gala-black whitespace-nowrap">
                          {formatCurrency(res.totalAmount)}
                        </td>

                        <td className="py-3.5 px-4 text-emerald-800 font-semibold whitespace-nowrap">
                          {formatCurrency(res.depositPaid)}
                        </td>

                        <td className="py-3.5 px-4 font-bold text-gala-red whitespace-nowrap">
                          {formatCurrency(res.pendingBalance)}
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <PaymentStatusBadge status={res.paymentStatus} size="sm" />
                        </td>

                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          {res.pendingBalance > 0 ? (
                            <Button
                              variant="primary"
                              size="sm"
                              icon={<CreditCard size={13} />}
                              onClick={() => setActiveReservationForPayment(res)}
                            >
                              Cobrar seña / saldo
                            </Button>
                          ) : (
                            <span className="text-xs text-emerald-800 font-semibold flex items-center justify-end gap-1">
                              <CheckCircle2 size={13} />
                              <span>Saldado</span>
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* Payment History Table */
        <div className="bg-gala-surface rounded-2xl border border-gala-border overflow-hidden shadow-subtle">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gala-bg/70 border-b border-gala-border/80 text-[11px] font-semibold text-gala-gray uppercase tracking-wider">
                  <th className="py-3 px-4">Fecha</th>
                  <th className="py-3 px-4">Reserva Asociada</th>
                  <th className="py-3 px-4">Importe Cobrado</th>
                  <th className="py-3 px-4">Método</th>
                  <th className="py-3 px-4">Observaciones / Comprobante</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gala-border/60">
                {payments.map(p => {
                  const associatedRes = reservations.find(r => r.id === p.reservationId);
                  return (
                    <tr key={p.id} className="hover:bg-white/60">
                      <td className="py-3 px-4 whitespace-nowrap font-medium text-gala-black">
                        {formatDate(p.date)}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-gala-black">
                          {associatedRes ? associatedRes.clientName : 'Cliente'}
                        </span>
                        <span className="text-[10px] font-mono text-gala-gray ml-2">
                          ({associatedRes?.code || p.reservationId})
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-emerald-800 whitespace-nowrap">
                        {formatCurrency(p.amount)}
                      </td>
                      <td className="py-3 px-4 capitalize text-gala-black">
                        {p.method}
                      </td>
                      <td className="py-3 px-4 text-gala-gray max-w-xs">
                        <p className="truncate">{p.notes || 'Sin observaciones'}</p>
                        {p.receiptName && (
                          <span className="text-[10px] text-gala-accent-dark font-medium flex items-center gap-1 mt-0.5">
                            <FileText size={11} />
                            <span>{p.receiptName}</span>
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Payment Registration Modal */}
      <RegisterPaymentModal
        reservation={activeReservationForPayment}
        isOpen={!!activeReservationForPayment}
        onClose={() => setActiveReservationForPayment(null)}
      />
    </div>
  );
};


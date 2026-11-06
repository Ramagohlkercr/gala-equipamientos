import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Reservation, ReservationStatus } from '../../types';
import { formatDate, formatCurrency, buildWhatsAppLink } from '../../utils/formatters';
import { ReservationStatusBadge } from '../../components/admin/ReservationStatusBadge';
import { PaymentStatusBadge } from '../../components/admin/PaymentStatusBadge';
import { ReservationDetailModal } from '../../components/admin/ReservationDetailModal';
import { RegisterPaymentModal } from '../../components/admin/RegisterPaymentModal';
import { Button } from '../../components/common/Button';
import {
  PlusCircle,
  Search,
  MessageCircle,
  Eye,
  CheckCircle2,
  Calendar,
  Filter,
  Inbox,
} from 'lucide-react';

export const ReservationsListPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { reservations, stats } = useApp();

  const filterParam = searchParams.get('filter') || 'todas';
  const [statusFilter, setStatusFilter] = useState<string>(filterParam);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [paymentModalRes, setPaymentModalRes] = useState<Reservation | null>(null);

  useEffect(() => {
    if (filterParam) {
      setStatusFilter(filterParam);
    }
  }, [filterParam]);

  const handleTabChange = (tab: string) => {
    setStatusFilter(tab);
    if (tab === 'todas') {
      searchParams.delete('filter');
    } else {
      searchParams.set('filter', tab);
    }
    setSearchParams(searchParams);
  };

  const filteredReservations = useMemo(() => {
    return reservations.filter(res => {
      const matchesStatus =
        statusFilter === 'todas' || res.status === statusFilter;

      const q = searchQuery.toLowerCase();
      const matchesSearch =
        res.code.toLowerCase().includes(q) ||
        res.clientName.toLowerCase().includes(q) ||
        res.clientPhone.includes(q) ||
        res.deliveryAddress.toLowerCase().includes(q);

      return matchesStatus && matchesSearch;
    });
  }, [reservations, statusFilter, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-gala-black">
            Reservas y Solicitudes
          </h1>
          <p className="text-xs sm:text-sm text-gala-gray mt-1">
            Control de eventos, fechas de entrega, compromisos de stock y pedidos recibidos.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          icon={<PlusCircle size={16} />}
          onClick={() => navigate('/admin/reservas/nueva')}
        >
          + Nueva reserva
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 border-b border-gala-border/80 overflow-x-auto no-scrollbar">
        {[
          { key: 'todas', label: 'Todas', count: reservations.length },
          {
            key: 'pendiente',
            label: 'Solicitudes pendientes',
            count: stats.pendingRequests,
            highlight: stats.pendingRequests > 0,
          },
          { key: 'confirmada', label: 'Confirmadas', count: reservations.filter(r => r.status === 'confirmada').length },
          { key: 'en_curso', label: 'En curso / Entregadas', count: reservations.filter(r => r.status === 'en_curso').length },
          { key: 'finalizada', label: 'Finalizadas', count: reservations.filter(r => r.status === 'finalizada').length },
          { key: 'cancelada', label: 'Canceladas', count: reservations.filter(r => r.status === 'cancelada').length },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => handleTabChange(tab.key)}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-medium border-b-2 whitespace-nowrap transition-all ${
              statusFilter === tab.key
                ? 'border-gala-black text-gala-black font-semibold'
                : 'border-transparent text-gala-gray hover:text-gala-black'
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
                tab.highlight
                  ? 'bg-amber-200 text-amber-900 animate-pulse'
                  : 'bg-stone-200 text-stone-700'
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Search Input */}
      <div className="relative w-full sm:w-96">
        <Search size={16} className="absolute left-3.5 top-3 text-gala-gray" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Buscar por cliente, código, teléfono o dirección..."
          className="w-full pl-10 pr-4 py-2.5 bg-gala-surface rounded-xl border border-gala-border text-xs focus:outline-none focus:border-gala-black text-gala-black placeholder:text-gala-gray"
        />
      </div>

      {/* Table */}
      <div data-tour="reservations-table" className="bg-gala-surface rounded-2xl border border-gala-border overflow-hidden shadow-subtle">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gala-bg/70 border-b border-gala-border/80 text-[11px] font-semibold text-gala-gray uppercase tracking-wider">
                <th className="py-3 px-4">Código / Cliente</th>
                <th className="py-3 px-4">Fechas</th>
                <th className="py-3 px-4">Entrega en</th>
                <th className="py-3 px-4">Mobiliario</th>
                <th className="py-3 px-4">Estado</th>
                <th className="py-3 px-4">Pago / Saldo</th>
                <th className="py-3 px-4 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gala-border/60 text-xs">
              {filteredReservations.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gala-gray">
                    No se encontraron reservas con los filtros aplicados.
                  </td>
                </tr>
              ) : (
                filteredReservations.map(res => {
                  const waLink = buildWhatsAppLink(
                    res.clientPhone,
                    `Hola ${res.clientName}, te escribimos de Gala Equipamientos respecto a tu reserva ${res.code}.`
                  );

                  return (
                    <tr
                      key={res.id}
                      className="hover:bg-white/60 transition-colors cursor-pointer group"
                      onClick={() => setSelectedReservation(res)}
                    >
                      {/* Code & Client */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-gala-black group-hover:text-gala-accent-dark transition-colors">
                          {res.clientName}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] font-mono text-gala-gray bg-gala-bg px-1.5 py-0.5 rounded border border-gala-border">
                            {res.code}
                          </span>
                          <a
                            href={waLink}
                            target="_blank"
                            rel="noreferrer"
                            onClick={e => e.stopPropagation()}
                            className="text-[11px] text-emerald-700 hover:text-emerald-800 flex items-center gap-1 font-medium"
                          >
                            <MessageCircle size={12} />
                            <span>{res.clientPhone}</span>
                          </a>
                        </div>
                      </td>

                      {/* Dates */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-medium text-gala-black">
                          Evento: {formatDate(res.eventDate)}
                        </div>
                        <div className="text-[11px] text-gala-gray mt-0.5">
                          {formatDate(res.deliveryDate)} al {formatDate(res.returnDate)}
                        </div>
                      </td>

                      {/* Location */}
                      <td className="py-3.5 px-4 max-w-[200px]">
                        <span className="line-clamp-2 text-[11px] text-stone-700">
                          {res.deliveryAddress}
                        </span>
                      </td>

                      {/* Products */}
                      <td className="py-3.5 px-4 max-w-[200px]">
                        <div className="space-y-0.5">
                          {res.items.slice(0, 2).map((item, idx) => (
                            <div key={idx} className="text-[11px] text-gala-black truncate">
                              <strong>{item.quantity}×</strong> {item.productName}
                            </div>
                          ))}
                          {res.items.length > 2 && (
                            <span className="text-[10px] text-gala-gray">
                              +{res.items.length - 2} más...
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <ReservationStatusBadge status={res.status} size="sm" />
                      </td>

                      {/* Payment */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-semibold text-gala-black">
                          {formatCurrency(res.totalAmount)}
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <PaymentStatusBadge status={res.paymentStatus} size="sm" />
                          {res.pendingBalance > 0 && (
                            <span className="text-[10px] text-gala-red font-medium">
                              Resta: {formatCurrency(res.pendingBalance)}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {res.status === 'pendiente' && (
                            <button
                              onClick={e => {
                                e.stopPropagation();
                                setSelectedReservation(res);
                              }}
                              className="px-2.5 py-1 rounded bg-amber-500 text-stone-900 hover:bg-amber-400 font-semibold text-[11px] flex items-center gap-1 shadow-xs"
                            >
                              <CheckCircle2 size={12} />
                              <span>Revisar</span>
                            </button>
                          )}

                          <button
                            onClick={e => {
                              e.stopPropagation();
                              setSelectedReservation(res);
                            }}
                            className="p-1.5 rounded-lg text-gala-gray hover:text-gala-black hover:bg-black/5"
                            title="Ver detalle"
                          >
                            <Eye size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

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


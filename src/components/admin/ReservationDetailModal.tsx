import React, { useState } from 'react';
import { Reservation } from '../../types';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { ReservationStatusBadge } from './ReservationStatusBadge';
import { PaymentStatusBadge } from './PaymentStatusBadge';
import { formatDate, formatCurrency, buildWhatsAppLink } from '../../utils/formatters';
import {
  Calendar,
  MapPin,
  Phone,
  MessageCircle,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  CreditCard,
  User,
  Package,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { validateReservationFeasibility } from '../../engine/availabilityEngine';

interface ReservationDetailModalProps {
  reservation: Reservation | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenPaymentModal?: (reservation: Reservation) => void;
}

export const ReservationDetailModal: React.FC<ReservationDetailModalProps> = ({
  reservation,
  isOpen,
  onClose,
  onOpenPaymentModal,
}) => {
  const {
    products,
    reservations,
    confirmPendingRequest,
    cancelOrRejectReservation,
    confirmReturn,
  } = useApp();

  const [actionError, setActionError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!reservation) return null;

  const waLink = buildWhatsAppLink(
    reservation.clientPhone,
    `Hola ${reservation.clientName}, te escribimos de Gala Equipamientos respecto a tu reserva ${reservation.code}.`
  );

  // Check live availability if this is a pending request
  const isPending = reservation.status === 'pendiente';
  const feasibilityCheck = isPending
    ? validateReservationFeasibility(
        reservation.items.map(i => ({ productId: i.productId, quantity: i.quantity })),
        reservation.deliveryDate,
        reservation.returnDate,
        products,
        reservations,
        reservation.id
      )
    : null;

  const handleConfirmRequest = () => {
    setActionError(null);
    setIsProcessing(true);
    const res = confirmPendingRequest(reservation.id);
    setIsProcessing(false);

    if (!res.success) {
      setActionError(res.error || 'No fue posible confirmar la solicitud por falta de stock.');
    } else {
      onClose();
    }
  };

  const handleRejectRequest = () => {
    cancelOrRejectReservation(reservation.id, 'Rechazada por administración');
    onClose();
  };

  const handleConfirmReturn = () => {
    confirmReturn(reservation.id);
    onClose();
  };

  const handleCancelReservation = () => {
    if (window.confirm('¿Confirmás que querés cancelar esta reserva? Se liberará el stock comprometido.')) {
      cancelOrRejectReservation(reservation.id, 'Cancelada por cliente o administración');
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Reserva ${reservation.code}`}
      subtitle={`Registrada el ${formatDate(reservation.createdAt)} • Origen: ${
        reservation.source === 'catalogo' ? 'Catálogo online' : 'Administración'
      }`}
      maxWidth="2xl"
    >
      <div className="space-y-6">
        {/* Status bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-gala-bg rounded-xl border border-gala-border">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gala-gray font-medium">Estado:</span>
            <ReservationStatusBadge status={reservation.status} />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gala-gray font-medium">Pago:</span>
            <PaymentStatusBadge status={reservation.paymentStatus} />
          </div>
        </div>

        {/* Warning if pending and feasibility issues detected */}
        {isPending && feasibilityCheck && !feasibilityCheck.feasible && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-xs text-red-900 space-y-1">
            <div className="flex items-center gap-2 font-semibold">
              <AlertTriangle size={16} className="text-gala-red" />
              <span>Atención: Conflicto de stock detectado</span>
            </div>
            <p>
              Actualmente no hay unidades suficientes para confirmar este pedido en esas fechas:
            </p>
            <ul className="list-disc list-inside mt-1 space-y-0.5 text-red-800">
              {feasibilityCheck.issues.map((iss, idx) => (
                <li key={idx}>
                  <strong>{iss.productName}</strong>: Solicitó {iss.requested}, disponibles únicamente {iss.available} (Faltan {iss.shortage})
                </li>
              ))}
            </ul>
          </div>
        )}

        {actionError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-800">
            {actionError}
          </div>
        )}

        {/* Client & Event Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Client Details */}
          <div className="p-4 bg-white/70 rounded-xl border border-gala-border/80 space-y-2">
            <h4 className="text-xs font-semibold text-gala-gray uppercase tracking-wider flex items-center gap-1.5">
              <User size={13} className="text-gala-accent-dark" />
              <span>Datos del Cliente</span>
            </h4>
            <div className="text-sm font-semibold text-gala-black">{reservation.clientName}</div>
            <div className="flex items-center gap-2">
              <a
                href={waLink}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-emerald-700 hover:text-emerald-800 font-medium flex items-center gap-1.5 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 transition-colors"
              >
                <MessageCircle size={13} />
                <span>{reservation.clientPhone}</span>
              </a>
            </div>
            {reservation.clientAddress && (
              <p className="text-xs text-gala-gray">Domicilio: {reservation.clientAddress}</p>
            )}
          </div>

          {/* Event & Logistics */}
          <div className="p-4 bg-white/70 rounded-xl border border-gala-border/80 space-y-2">
            <h4 className="text-xs font-semibold text-gala-gray uppercase tracking-wider flex items-center gap-1.5">
              <Calendar size={13} className="text-gala-accent-dark" />
              <span>Fechas del Evento</span>
            </h4>
            <div className="text-xs space-y-1">
              <div>
                <strong className="text-gala-black">Fecha del evento:</strong>{' '}
                <span className="font-semibold text-gala-black">{formatDate(reservation.eventDate)}</span>
              </div>
              <div className="text-gala-gray">
                Entrega: <strong className="text-stone-700">{formatDate(reservation.deliveryDate)}</strong>
              </div>
              <div className="text-gala-gray">
                Retiro pactado: <strong className="text-stone-700">{formatDate(reservation.returnDate)}</strong>
              </div>
              {reservation.actualReturnDate && (
                <div className="text-emerald-700 font-medium">
                  Devolución efectiva: {formatDate(reservation.actualReturnDate)}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Delivery Address */}
        <div className="p-3 bg-white/70 rounded-xl border border-gala-border/80 text-xs flex items-start gap-2">
          <MapPin size={15} className="text-gala-gray-light mt-0.5 flex-shrink-0" />
          <div>
            <strong className="text-gala-black">Dirección de entrega: </strong>
            <span className="text-stone-700">{reservation.deliveryAddress}</span>
          </div>
        </div>

        {/* Items List */}
        <div>
          <h4 className="text-xs font-semibold text-gala-gray uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <Package size={13} className="text-gala-accent-dark" />
            <span>Mobiliario solicitado</span>
          </h4>
          <div className="border border-gala-border rounded-xl overflow-hidden bg-white/50">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-gala-bg/80 border-b border-gala-border text-[11px] font-semibold text-gala-gray uppercase">
                  <th className="py-2.5 px-3">Producto</th>
                  <th className="py-2.5 px-3 text-center">Cant.</th>
                  <th className="py-2.5 px-3 text-right">Precio unit.</th>
                  <th className="py-2.5 px-3 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gala-border/60">
                {reservation.items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gala-surface">
                    <td className="py-2.5 px-3 font-medium text-gala-black">{item.productName}</td>
                    <td className="py-2.5 px-3 text-center font-semibold">{item.quantity}</td>
                    <td className="py-2.5 px-3 text-right text-gala-gray">
                      {formatCurrency(item.unitPrice)}
                    </td>
                    <td className="py-2.5 px-3 text-right font-medium text-gala-black">
                      {formatCurrency(item.subtotal)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Financial Summary */}
        <div className="p-4 bg-gala-surface rounded-xl border border-gala-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs space-y-1 w-full sm:w-auto">
            <div className="flex justify-between sm:justify-start sm:gap-4 text-gala-gray">
              <span>Total presupuestado:</span>
              <strong className="text-gala-black">{formatCurrency(reservation.totalAmount)}</strong>
            </div>
            <div className="flex justify-between sm:justify-start sm:gap-4 text-emerald-800">
              <span>Seña / Pagos registrados:</span>
              <strong>{formatCurrency(reservation.depositPaid)}</strong>
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-gala-border">
            <div className="text-right">
              <span className="text-[11px] text-gala-gray block">Saldo pendiente</span>
              <span className="font-serif text-xl font-bold text-gala-black">
                {formatCurrency(reservation.pendingBalance)}
              </span>
            </div>

            {reservation.status !== 'cancelada' && onOpenPaymentModal && (
              <Button
                variant="outline"
                size="sm"
                icon={<CreditCard size={14} />}
                onClick={() => {
                  onClose();
                  onOpenPaymentModal(reservation);
                }}
              >
                Registrar pago
              </Button>
            )}
          </div>
        </div>

        {/* Observations */}
        {reservation.observations && (
          <div className="p-3 bg-gala-bg rounded-xl border border-gala-border/60 text-xs">
            <strong className="text-gala-gray block mb-0.5">Observaciones:</strong>
            <p className="text-stone-700 italic">{reservation.observations}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-gala-border/80">
          <div className="flex items-center gap-2">
            {reservation.status !== 'cancelada' && reservation.status !== 'finalizada' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCancelReservation}
                className="text-gala-red hover:bg-red-50 hover:text-gala-red-dark"
              >
                Cancelar reserva
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* If pending request */}
            {isPending && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRejectRequest}
                  className="text-stone-700 hover:text-gala-red"
                >
                  Rechazar solicitud
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  icon={<CheckCircle2 size={15} />}
                  onClick={handleConfirmRequest}
                  isLoading={isProcessing}
                >
                  Confirmar y comprometer stock
                </Button>
              </>
            )}

            {/* If en_curso or confirmada, allow confirming return */}
            {(reservation.status === 'en_curso' || reservation.status === 'confirmada') && (
              <Button
                variant="secondary"
                size="sm"
                icon={<RotateCcw size={14} />}
                onClick={handleConfirmReturn}
              >
                Confirmar devolución (Liberar stock)
              </Button>
            )}

            <Button variant="outline" size="sm" onClick={onClose}>
              Cerrar
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};


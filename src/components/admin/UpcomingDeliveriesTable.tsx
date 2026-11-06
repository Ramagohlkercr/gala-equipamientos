import React from 'react';
import { Reservation } from '../../types';
import { formatDate, buildWhatsAppLink, formatCurrency } from '../../utils/formatters';
import { ReservationStatusBadge } from './ReservationStatusBadge';
import { PaymentStatusBadge } from './PaymentStatusBadge';
import { MessageCircle, MapPin, Calendar, Clock, Eye, CheckCircle2 } from 'lucide-react';
import { Button } from '../common/Button';

interface UpcomingDeliveriesTableProps {
  reservations: Reservation[];
  onViewReservation: (reservation: Reservation) => void;
  onConfirmReturn?: (reservation: Reservation) => void;
}

export const UpcomingDeliveriesTable: React.FC<UpcomingDeliveriesTableProps> = ({
  reservations,
  onViewReservation,
  onConfirmReturn,
}) => {
  if (reservations.length === 0) {
    return (
      <div className="p-8 text-center bg-gala-surface rounded-2xl border border-gala-border text-gala-gray text-xs">
        No hay reservas registradas en este momento.
      </div>
    );
  }

  return (
    <div className="bg-gala-surface rounded-2xl border border-gala-border overflow-hidden shadow-subtle">
      <div className="p-5 border-b border-gala-border/80 flex items-center justify-between">
        <div>
          <h3 className="font-serif text-lg font-semibold text-gala-black">Próximas reservas</h3>
          <p className="text-xs text-gala-gray mt-0.5">
            Entregas, retiros programados y estado de cada evento.
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gala-bg/60 border-b border-gala-border/80 text-[11px] font-semibold text-gala-gray uppercase tracking-wider">
              <th className="py-3 px-4">Código / Cliente</th>
              <th className="py-3 px-4">Fechas (Evento / Retiro)</th>
              <th className="py-3 px-4">Lugar de entrega</th>
              <th className="py-3 px-4">Mobiliario</th>
              <th className="py-3 px-4">Estado</th>
              <th className="py-3 px-4">Pago / Saldo</th>
              <th className="py-3 px-4 text-right">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gala-border/60 text-xs">
            {reservations.map(res => {
              const waLink = buildWhatsAppLink(
                res.clientPhone,
                `Hola ${res.clientName}, te escribimos de Gala Equipamientos por tu reserva ${res.code} para el evento del ${formatDate(res.eventDate)}.`
              );

              return (
                <tr
                  key={res.id}
                  className="hover:bg-white/60 transition-colors cursor-pointer group"
                  onClick={() => onViewReservation(res)}
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
                    <div className="flex items-center gap-1.5 font-medium text-gala-black">
                      <Calendar size={13} className="text-gala-accent-dark flex-shrink-0" />
                      <span>{formatDate(res.eventDate)}</span>
                    </div>
                    <div className="text-[11px] text-gala-gray mt-0.5 flex items-center gap-1">
                      <span>Entrega: {formatDate(res.deliveryDate)}</span>
                      <span>•</span>
                      <span>Retiro: {formatDate(res.returnDate)}</span>
                    </div>
                  </td>

                  {/* Address */}
                  <td className="py-3.5 px-4 max-w-[200px]">
                    <div className="flex items-start gap-1 text-gala-gray">
                      <MapPin size={13} className="text-gala-gray-light mt-0.5 flex-shrink-0" />
                      <span className="line-clamp-2 text-[11px] text-stone-700">
                        {res.deliveryAddress}
                      </span>
                    </div>
                  </td>

                  {/* Furniture summary */}
                  <td className="py-3.5 px-4 max-w-[220px]">
                    <div className="space-y-0.5">
                      {res.items.slice(0, 2).map((item, idx) => (
                        <div key={idx} className="text-[11px] text-gala-black truncate font-medium">
                          {item.quantity}× {item.productName}
                        </div>
                      ))}
                      {res.items.length > 2 && (
                        <span className="text-[10px] text-gala-gray">
                          +{res.items.length - 2} productos más...
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

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      {res.status === 'en_curso' && onConfirmReturn && (
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            onConfirmReturn(res);
                          }}
                          className="px-2 py-1 rounded bg-stone-100 hover:bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-medium flex items-center gap-1"
                          title="Confirmar devolución de mobiliario"
                        >
                          <CheckCircle2 size={12} />
                          <span>Devolver</span>
                        </button>
                      )}

                      <button
                        onClick={e => {
                          e.stopPropagation();
                          onViewReservation(res);
                        }}
                        className="p-1.5 rounded-lg text-gala-gray hover:text-gala-black hover:bg-black/5"
                        title="Ver detalle de la reserva"
                      >
                        <Eye size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};


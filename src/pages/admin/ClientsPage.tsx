import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Client, Reservation } from '../../types';
import { formatDate, buildWhatsAppLink } from '../../utils/formatters';
import { ReservationStatusBadge } from '../../components/admin/ReservationStatusBadge';
import { ReservationDetailModal } from '../../components/admin/ReservationDetailModal';
import { Button } from '../../components/common/Button';
import {
  Users,
  Search,
  MessageCircle,
  MapPin,
  Calendar,
  BookMarked,
  Plus,
} from 'lucide-react';

export const ClientsPage: React.FC = () => {
  const { clients, reservations } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [activeReservation, setActiveReservation] = useState<Reservation | null>(null);

  const filteredClients = useMemo(() => {
    return clients.filter(c => {
      const q = searchQuery.toLowerCase();
      return (
        c.fullName.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        c.address.toLowerCase().includes(q) ||
        c.city.toLowerCase().includes(q)
      );
    });
  }, [clients, searchQuery]);

  // Reservations for selected client
  const clientReservations = useMemo(() => {
    if (!selectedClient) return [];
    return reservations.filter(
      r =>
        r.clientId === selectedClient.id ||
        r.clientPhone.replace(/\D/g, '') === selectedClient.phone.replace(/\D/g, '')
    );
  }, [reservations, selectedClient]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-gala-black">
            Clientes Registrados
          </h1>
          <p className="text-xs sm:text-sm text-gala-gray mt-1">
            Historial de eventos, teléfonos de contacto y direcciones frecuentes en Rosario y alrededores.
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative w-full sm:w-96">
        <Search size={16} className="absolute left-3.5 top-3 text-gala-gray" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Buscar por nombre, teléfono o dirección..."
          className="w-full pl-10 pr-4 py-2.5 bg-gala-surface rounded-xl border border-gala-border text-xs focus:outline-none focus:border-gala-black text-gala-black placeholder:text-gala-gray"
        />
      </div>

      {/* Grid of Clients */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredClients.map(client => {
          const waLink = buildWhatsAppLink(
            client.phone,
            `Hola ${client.fullName}, te saludamos de Gala Equipamientos.`
          );

          const totalClientBookings = reservations.filter(
            r =>
              r.clientId === client.id ||
              r.clientPhone.replace(/\D/g, '') === client.phone.replace(/\D/g, '')
          ).length;

          return (
            <div
              key={client.id}
              className="bg-gala-surface rounded-2xl border border-gala-border p-5 shadow-subtle hover:border-gala-border-dark transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-serif text-base font-semibold text-gala-black">
                      {client.fullName}
                    </h3>
                    <span className="text-[11px] text-gala-gray">
                      Registrado desde: {formatDate(client.createdAt)}
                    </span>
                  </div>

                  <span className="text-xs font-semibold bg-gala-bg text-stone-700 border border-gala-border px-2.5 py-1 rounded-full">
                    {totalClientBookings} {totalClientBookings === 1 ? 'reserva' : 'reservas'}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center gap-2">
                    <a
                      href={waLink}
                      target="_blank"
                      rel="noreferrer"
                      className="text-emerald-700 hover:text-emerald-800 font-medium flex items-center gap-1.5 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200"
                    >
                      <MessageCircle size={13} />
                      <span>{client.phone}</span>
                    </a>
                  </div>

                  <div className="flex items-start gap-1.5 text-gala-gray pt-1">
                    <MapPin size={13} className="text-gala-gray-light mt-0.5 flex-shrink-0" />
                    <span>
                      {client.address}, {client.city}
                    </span>
                  </div>

                  {client.notes && (
                    <p className="text-[11px] text-stone-600 bg-gala-bg/70 p-2 rounded-lg border border-gala-border/60 italic">
                      "{client.notes}"
                    </p>
                  )}
                </div>
              </div>

              <div className="pt-4 mt-3 border-t border-gala-border/80 flex items-center justify-between">
                <button
                  onClick={() => setSelectedClient(client)}
                  className="text-xs font-semibold text-gala-black hover:text-gala-accent-dark transition-colors flex items-center gap-1"
                >
                  <BookMarked size={14} />
                  <span>Ver historial ({totalClientBookings})</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Client History Modal */}
      {selectedClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-gala-surface rounded-2xl border border-gala-border max-w-xl w-full p-6 shadow-float space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-gala-border pb-3">
              <div>
                <h3 className="font-serif text-xl font-bold text-gala-black">
                  Historial de {selectedClient.fullName}
                </h3>
                <p className="text-xs text-gala-gray mt-0.5">{selectedClient.phone} • {selectedClient.address}</p>
              </div>
              <button
                onClick={() => setSelectedClient(null)}
                className="text-xs text-gala-gray hover:text-gala-black"
              >
                Cerrar
              </button>
            </div>

            <div className="space-y-3">
              {clientReservations.length === 0 ? (
                <p className="text-xs text-gala-gray py-6 text-center">
                  No hay reservas registradas para este cliente todavía.
                </p>
              ) : (
                clientReservations.map(res => (
                  <div
                    key={res.id}
                    onClick={() => {
                      setSelectedClient(null);
                      setActiveReservation(res);
                    }}
                    className="p-3.5 bg-gala-bg rounded-xl border border-gala-border hover:border-gala-black transition-colors cursor-pointer text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-gala-black">Reserva {res.code}</span>
                      <ReservationStatusBadge status={res.status} size="sm" />
                    </div>
                    <div className="text-gala-gray text-[11px]">
                      Evento: {formatDate(res.eventDate)} • Entrega: {formatDate(res.deliveryDate)}
                    </div>
                    <div className="text-stone-800 font-medium">
                      {res.items.map(i => `${i.quantity}× ${i.productName}`).join(', ')}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Reservation Detail Modal */}
      <ReservationDetailModal
        reservation={activeReservation}
        isOpen={!!activeReservation}
        onClose={() => setActiveReservation(null)}
      />
    </div>
  );
};

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Product, ReservationItem } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Button } from '../../components/common/Button';
import {
  Calendar,
  User,
  Phone,
  MapPin,
  FileText,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Building2,
} from 'lucide-react';

export const ClientOrderPage: React.FC = () => {
  const navigate = useNavigate();
  const { products, createReservation } = useApp();

  // Read cart & dates from session
  const [eventDate, setEventDate] = useState<string>('');
  const [deliveryDate, setDeliveryDate] = useState<string>('');
  const [returnDate, setReturnDate] = useState<string>('');
  const [cartItems, setCartItems] = useState<{ [productId: string]: number }>({});

  // Client fields
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [observations, setObservations] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const savedItems = sessionStorage.getItem('gala_cart_items');
    const savedEvent = sessionStorage.getItem('gala_cart_event_date');
    const savedDelivery = sessionStorage.getItem('gala_cart_delivery_date');
    const savedReturn = sessionStorage.getItem('gala_cart_return_date');

    if (!savedItems || savedItems === '{}') {
      navigate('/catalogo');
      return;
    }

    setCartItems(JSON.parse(savedItems));
    if (savedEvent) setEventDate(savedEvent);
    if (savedDelivery) setDeliveryDate(savedDelivery);
    if (savedReturn) setReturnDate(savedReturn);
  }, [navigate]);

  // Items list with prices
  const itemsWithDetails: ReservationItem[] = useMemo(() => {
    const list: ReservationItem[] = [];
    for (const [prodId, qty] of Object.entries(cartItems)) {
      if (qty > 0) {
        const p = products.find(prod => prod.id === prodId);
        if (p) {
          list.push({
            productId: p.id,
            productName: p.name,
            quantity: qty,
            unitPrice: p.rentalPrice,
            subtotal: qty * p.rentalPrice,
          });
        }
      }
    }
    return list;
  }, [cartItems, products]);

  const totalAmount = useMemo(() => {
    return itemsWithDetails.reduce((sum, item) => sum + item.subtotal, 0);
  }, [itemsWithDetails]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!clientName.trim() || !clientPhone.trim() || !deliveryAddress.trim()) {
      setErrorMessage('Por favor completá todos los campos obligatorios.');
      return;
    }

    setIsSubmitting(true);

    const result = createReservation({
      clientName,
      clientPhone,
      clientAddress: deliveryAddress,
      deliveryAddress,
      eventDate,
      deliveryDate,
      returnDate,
      items: itemsWithDetails,
      totalAmount,
      initialDeposit: 0,
      observations,
      source: 'catalogo',
      status: 'pendiente',
    });

    setIsSubmitting(false);

    if (!result.success || !result.reservation) {
      setErrorMessage(result.error || 'No fue posible procesar la solicitud.');
      return;
    }

    // Save newly created reservation info for confirmation screen
    sessionStorage.setItem('gala_last_order', JSON.stringify(result.reservation));
    // Clear cart
    sessionStorage.removeItem('gala_cart_items');

    navigate('/catalogo/confirmacion');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Back button */}
      <button
        onClick={() => navigate('/catalogo')}
        className="inline-flex items-center gap-1.5 text-xs text-gala-gray hover:text-gala-black transition-colors"
      >
        <ArrowLeft size={14} />
        <span>Volver a seleccionar mobiliario</span>
      </button>

      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-gala-black">
          Completá tus datos para la solicitud
        </h1>
        <p className="text-xs sm:text-sm text-gala-gray mt-1">
          Revisaremos la disponibilidad para tu fecha y nos pondremos en contacto con vos para coordinar los detalles.
        </p>
      </div>

      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-xs text-red-900 flex items-center gap-2">
          <AlertCircle size={16} className="text-gala-red flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Order Summary Recap */}
        <div className="p-5 bg-gala-surface rounded-2xl border border-gala-border shadow-subtle space-y-4">
          <div className="flex items-center justify-between border-b border-gala-border/80 pb-3">
            <h3 className="font-serif text-base font-semibold text-gala-black">
              Resumen del pedido
            </h3>
            <span className="text-xs text-gala-gray">
              {formatDate(deliveryDate)} al {formatDate(returnDate)}
            </span>
          </div>

          <div className="divide-y divide-gala-border/60 text-xs">
            {itemsWithDetails.map(item => (
              <div key={item.productId} className="py-2.5 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-gala-black">{item.productName}</span>
                  <span className="text-gala-gray block text-[11px]">
                    {item.quantity} unidades × {formatCurrency(item.unitPrice)}
                  </span>
                </div>
                <span className="font-bold text-gala-black">
                  {formatCurrency(item.subtotal)}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-gala-border flex items-center justify-between">
            <span className="text-xs font-semibold text-gala-black">Presupuesto estimado:</span>
            <span className="font-serif text-2xl font-bold text-gala-black">
              {formatCurrency(totalAmount)}
            </span>
          </div>
        </div>

        {/* Client details form */}
        <div className="p-5 bg-gala-surface rounded-2xl border border-gala-border shadow-subtle space-y-4">
          <h3 className="font-serif text-base font-semibold text-gala-black border-b border-gala-border/80 pb-3">
            Datos de contacto y entrega
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-gala-black mb-1">
                Nombre y apellido completo *
              </label>
              <input
                type="text"
                required
                value={clientName}
                onChange={e => setClientName(e.target.value)}
                placeholder="Ej. Sofía Martínez"
                className="w-full px-3 py-2.5 bg-white rounded-xl border border-gala-border focus:outline-none focus:border-gala-black font-medium"
              />
            </div>

            <div>
              <label className="block font-semibold text-gala-black mb-1">
                Teléfono con WhatsApp *
              </label>
              <input
                type="text"
                required
                value={clientPhone}
                onChange={e => setClientPhone(e.target.value)}
                placeholder="Ej. 341 555-8899"
                className="w-full px-3 py-2.5 bg-white rounded-xl border border-gala-border focus:outline-none focus:border-gala-black font-medium"
              />
              <span className="text-[10px] text-gala-gray mt-1 block">
                Te contactaremos por este medio para confirmar la reserva.
              </span>
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-gala-black mb-1">
                Lugar / Salón de entrega en Rosario o alrededores *
              </label>
              <input
                type="text"
                required
                value={deliveryAddress}
                onChange={e => setDeliveryAddress(e.target.value)}
                placeholder="Ej. Salón Terrazas del Paraná / Funes Garita 9 / Bv. Rondeau 1200"
                className="w-full px-3 py-2.5 bg-white rounded-xl border border-gala-border focus:outline-none focus:border-gala-black font-medium"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-gala-black mb-1">
                Observaciones o aclaraciones (opcional)
              </label>
              <textarea
                rows={2}
                value={observations}
                onChange={e => setObservations(e.target.value)}
                placeholder="Horario estimado, si es planta baja o con ascensor, requerimientos particulares..."
                className="w-full px-3 py-2.5 bg-white rounded-xl border border-gala-border focus:outline-none focus:border-gala-black resize-none"
              />
            </div>
          </div>
        </div>

        {/* Disclaimer card */}
        <div className="p-4 bg-gala-bg rounded-xl border border-gala-border/80 text-xs text-gala-gray leading-relaxed flex items-start gap-2.5">
          <Building2 size={16} className="text-gala-accent-dark flex-shrink-0 mt-0.5" />
          <p>
            Al presionar "Enviar solicitud de reserva", el equipo de <strong>Gala Equipamientos</strong> recibirá tu pedido en el sistema para verificar la disponibilidad definitiva y comunicarse con vos a la brevedad.
          </p>
        </div>

        {/* Submit button */}
        <div className="flex items-center justify-between gap-4 pt-2">
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={() => navigate('/catalogo')}
          >
            Modificar productos
          </Button>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            icon={<CheckCircle2 size={18} />}
            isLoading={isSubmitting}
            className="w-full sm:w-auto"
          >
            Enviar solicitud de reserva
          </Button>
        </div>
      </form>
    </div>
  );
};


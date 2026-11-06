import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { ReservationItem } from '../../types';
import { calculateAllProductsAvailability } from '../../engine/availabilityEngine';
import { getTodayString, addDaysString } from '../../utils/dateUtils';
import { formatCurrency } from '../../utils/formatters';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import {
  Calendar,
  User,
  MapPin,
  Package,
  Plus,
  Trash2,
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  DollarSign,
} from 'lucide-react';

export const CreateReservationPage: React.FC = () => {
  const navigate = useNavigate();
  const { products, reservations, createReservation } = useApp();

  const today = getTodayString();

  // Form states
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientAddress, setClientAddress] = useState('');
  const [clientNotes, setClientNotes] = useState('');

  const [eventDate, setEventDate] = useState(addDaysString(today, 3));
  const [deliveryDate, setDeliveryDate] = useState(addDaysString(today, 2));
  const [returnDate, setReturnDate] = useState(addDaysString(today, 4));
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [observations, setObservations] = useState('');

  // Selected items: productId -> quantity
  const [selectedItems, setSelectedItems] = useState<{ productId: string; quantity: number }[]>([]);
  const [productToAdd, setProductToAdd] = useState<string>('');
  const [quantityToAdd, setQuantityToAdd] = useState<number>(10);

  // Financials
  const [initialDeposit, setInitialDeposit] = useState<string>('');

  // Errors / validation feedback
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Live availability for the selected dates
  const currentAvailability = useMemo(() => {
    return calculateAllProductsAvailability(products, deliveryDate, returnDate, reservations);
  }, [products, deliveryDate, returnDate, reservations]);

  // Calculate items summary and total
  const itemsWithDetails: ReservationItem[] = useMemo(() => {
    return selectedItems.map(item => {
      const prod = products.find(p => p.id === item.productId);
      const name = prod?.name || 'Producto';
      const unitPrice = prod?.rentalPrice || 0;
      return {
        productId: item.productId,
        productName: name,
        quantity: item.quantity,
        unitPrice,
        subtotal: item.quantity * unitPrice,
      };
    });
  }, [selectedItems, products]);

  const totalAmount = useMemo(() => {
    return itemsWithDetails.reduce((sum, item) => sum + item.subtotal, 0);
  }, [itemsWithDetails]);

  const depositNumber = parseFloat(initialDeposit) || 0;
  const pendingBalance = Math.max(0, totalAmount - depositNumber);

  // Add product to list
  const handleAddItem = () => {
    setErrorMessage(null);
    if (!productToAdd) return;

    const prod = products.find(p => p.id === productToAdd);
    if (!prod) return;

    const avail = currentAvailability.find(a => a.productId === productToAdd);
    const existing = selectedItems.find(i => i.productId === productToAdd);
    const currentQtyInList = existing ? existing.quantity : 0;
    const newTotalQty = currentQtyInList + quantityToAdd;

    if (avail && newTotalQty > avail.availableQuantity) {
      setErrorMessage(
        `No hay suficientes unidades de ${prod.name}. Disponibles para esas fechas: ${avail.availableQuantity}. Intentaste agregar ${newTotalQty}.`
      );
      return;
    }

    if (existing) {
      setSelectedItems(
        selectedItems.map(i =>
          i.productId === productToAdd ? { ...i, quantity: newTotalQty } : i
        )
      );
    } else {
      setSelectedItems([...selectedItems, { productId: productToAdd, quantity: quantityToAdd }]);
    }

    setProductToAdd('');
    setQuantityToAdd(10);
  };

  const handleRemoveItem = (productId: string) => {
    setSelectedItems(selectedItems.filter(i => i.productId !== productId));
  };

  const handleUpdateItemQuantity = (productId: string, qty: number) => {
    if (qty <= 0) {
      handleRemoveItem(productId);
      return;
    }
    const avail = currentAvailability.find(a => a.productId === productId);
    const prod = products.find(p => p.id === productId);

    if (avail && qty > avail.availableQuantity) {
      setErrorMessage(
        `Disponibilidad insuficiente para ${prod?.name}. Máximo disponible en esas fechas: ${avail.availableQuantity}.`
      );
      return;
    }

    setErrorMessage(null);
    setSelectedItems(
      selectedItems.map(i => (i.productId === productId ? { ...i, quantity: qty } : i))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (deliveryDate > returnDate) {
      setErrorMessage('La fecha de retiro no puede ser anterior a la fecha de entrega.');
      return;
    }

    if (selectedItems.length === 0) {
      setErrorMessage('Debés agregar al menos un producto al pedido.');
      return;
    }

    setIsSubmitting(true);

    const res = createReservation({
      clientName,
      clientPhone,
      clientAddress,
      clientNotes,
      eventDate,
      deliveryDate,
      returnDate,
      deliveryAddress: deliveryAddress || clientAddress,
      items: itemsWithDetails,
      totalAmount,
      initialDeposit: depositNumber,
      observations,
      source: 'admin',
      status: 'confirmada',
    });

    setIsSubmitting(false);

    if (!res.success) {
      setErrorMessage(res.error || 'No fue posible crear la reserva.');
    } else {
      navigate('/admin/reservas');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Back button & title */}
      <div>
        <button
          onClick={() => navigate('/admin/reservas')}
          className="inline-flex items-center gap-1.5 text-xs text-gala-gray hover:text-gala-black mb-2 transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Volver al listado de reservas</span>
        </button>
        <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-gala-black">
          Nueva Reserva de Mobiliario
        </h1>
        <p className="text-xs text-gala-gray mt-1">
          Comprobá la disponibilidad de stock para las fechas pactadas y registrá el compromiso de inventario.
        </p>
      </div>

      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-900 flex items-start gap-3 shadow-subtle animate-in fade-in">
          <AlertTriangle size={18} className="text-gala-red flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <strong className="block font-semibold">Atención con la disponibilidad:</strong>
            <p className="mt-0.5 leading-relaxed">{errorMessage}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Dates & Period (crucial for live stock calculations) */}
        <div className="p-5 bg-gala-surface rounded-2xl border border-gala-border shadow-subtle space-y-4">
          <h2 className="font-serif text-base font-semibold text-gala-black flex items-center gap-2 border-b border-gala-border/80 pb-3">
            <Calendar size={18} className="text-gala-accent-dark" />
            <span>1. Período de ocupación y evento</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-gala-black mb-1">
                Fecha de entrega pactada *
              </label>
              <input
                type="date"
                required
                value={deliveryDate}
                onChange={e => {
                  const val = e.target.value;
                  setDeliveryDate(val);
                  if (val > eventDate) setEventDate(val);
                  if (val > returnDate) setReturnDate(addDaysString(val, 2));
                }}
                className="w-full px-3 py-2 bg-white rounded-xl border border-gala-border focus:outline-none focus:border-gala-black font-medium"
              />
              <span className="text-[10px] text-gala-gray mt-1 block">
                Comienzo del compromiso de stock.
              </span>
            </div>

            <div>
              <label className="block font-semibold text-gala-black mb-1">
                Fecha del evento principal *
              </label>
              <input
                type="date"
                required
                value={eventDate}
                onChange={e => setEventDate(e.target.value)}
                className="w-full px-3 py-2 bg-white rounded-xl border border-gala-border focus:outline-none focus:border-gala-black font-medium"
              />
              <span className="text-[10px] text-gala-gray mt-1 block">
                Día central del festejo o evento.
              </span>
            </div>

            <div>
              <label className="block font-semibold text-gala-black mb-1">
                Fecha prevista de retiro *
              </label>
              <input
                type="date"
                required
                min={deliveryDate}
                value={returnDate}
                onChange={e => setReturnDate(e.target.value)}
                className="w-full px-3 py-2 bg-white rounded-xl border border-gala-border focus:outline-none focus:border-gala-black font-medium"
              />
              <span className="text-[10px] text-gala-gray mt-1 block">
                Fin del compromiso de stock.
              </span>
            </div>
          </div>
        </div>

        {/* Step 2: Client & Destination */}
        <div className="p-5 bg-gala-surface rounded-2xl border border-gala-border shadow-subtle space-y-4">
          <h2 className="font-serif text-base font-semibold text-gala-black flex items-center gap-2 border-b border-gala-border/80 pb-3">
            <User size={18} className="text-gala-accent-dark" />
            <span>2. Datos del cliente y entrega</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-gala-black mb-1">
                Nombre y apellido del cliente *
              </label>
              <input
                type="text"
                required
                value={clientName}
                onChange={e => setClientName(e.target.value)}
                placeholder="Ej. Valeria Domínguez"
                className="w-full px-3 py-2 bg-white rounded-xl border border-gala-border focus:outline-none focus:border-gala-black font-medium"
              />
            </div>

            <div>
              <label className="block font-semibold text-gala-black mb-1">
                Teléfono de contacto / WhatsApp *
              </label>
              <input
                type="text"
                required
                value={clientPhone}
                onChange={e => setClientPhone(e.target.value)}
                placeholder="Ej. 341 555-1234"
                className="w-full px-3 py-2 bg-white rounded-xl border border-gala-border focus:outline-none focus:border-gala-black font-medium"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-gala-black mb-1">
                Lugar / Salón de entrega *
              </label>
              <input
                type="text"
                required
                value={deliveryAddress}
                onChange={e => setDeliveryAddress(e.target.value)}
                placeholder="Ej. Salón Metropolitano, Alto Rosario / Quinta Funes Norte"
                className="w-full px-3 py-2 bg-white rounded-xl border border-gala-border focus:outline-none focus:border-gala-black font-medium"
              />
            </div>
          </div>
        </div>

        {/* Step 3: Product Selection with Real-time availability check */}
        <div className="p-5 bg-gala-surface rounded-2xl border border-gala-border shadow-subtle space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gala-border/80 pb-3">
            <h2 className="font-serif text-base font-semibold text-gala-black flex items-center gap-2">
              <Package size={18} className="text-gala-accent-dark" />
              <span>3. Selección de mobiliario</span>
            </h2>
            <span className="text-xs text-gala-gray">
              Disponibilidad calculada del {deliveryDate} al {returnDate}
            </span>
          </div>

          {/* Add product bar */}
          <div className="p-3 bg-gala-bg rounded-xl border border-gala-border flex flex-col sm:flex-row items-stretch sm:items-end gap-3 text-xs">
            <div className="flex-1">
              <label className="block font-semibold text-gala-black mb-1">Elegir mobiliario</label>
              <select
                value={productToAdd}
                onChange={e => setProductToAdd(e.target.value)}
                className="w-full px-3 py-2 bg-white rounded-xl border border-gala-border focus:outline-none focus:border-gala-black"
              >
                <option value="">Seleccionar producto...</option>
                {products
                  .filter(p => p.active)
                  .map(p => {
                    const avail = currentAvailability.find(a => a.productId === p.id);
                    const avCount = avail ? avail.availableQuantity : 0;
                    return (
                      <option key={p.id} value={p.id} disabled={avCount <= 0}>
                        {p.name} — ({avCount} disponibles de {p.totalQuantity}) — {formatCurrency(p.rentalPrice)}
                      </option>
                    );
                  })}
              </select>
            </div>

            <div className="w-full sm:w-28">
              <label className="block font-semibold text-gala-black mb-1">Cantidad</label>
              <input
                type="number"
                min="1"
                value={quantityToAdd}
                onChange={e => setQuantityToAdd(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 bg-white rounded-xl border border-gala-border focus:outline-none focus:border-gala-black font-semibold text-center"
              />
            </div>

            <Button
              type="button"
              variant="primary"
              size="sm"
              icon={<Plus size={14} />}
              onClick={handleAddItem}
              disabled={!productToAdd}
              className="py-2.5"
            >
              Agregar
            </Button>
          </div>

          {/* Selected Items Table */}
          {selectedItems.length > 0 ? (
            <div className="border border-gala-border rounded-xl overflow-hidden bg-white/60">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-gala-bg/80 border-b border-gala-border text-[11px] font-semibold text-gala-gray uppercase">
                    <th className="py-2.5 px-3">Producto</th>
                    <th className="py-2.5 px-3 text-center">Unidades</th>
                    <th className="py-2.5 px-3 text-right">Precio unit.</th>
                    <th className="py-2.5 px-3 text-right">Subtotal</th>
                    <th className="py-2.5 px-3 text-center">Quitar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gala-border/60">
                  {itemsWithDetails.map(item => {
                    const avail = currentAvailability.find(a => a.productId === item.productId);
                    const isExceeded = avail && item.quantity > avail.availableQuantity;

                    return (
                      <tr key={item.productId} className={isExceeded ? 'bg-red-50' : ''}>
                        <td className="py-2.5 px-3 font-medium text-gala-black">
                          {item.productName}
                          {isExceeded && (
                            <span className="block text-[10px] text-gala-red font-semibold">
                              Supera disponibilidad ({avail?.availableQuantity} libres)
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={e =>
                              handleUpdateItemQuantity(
                                item.productId,
                                parseInt(e.target.value) || 1
                              )
                            }
                            className="w-16 px-1.5 py-1 text-center font-semibold bg-gala-surface rounded-lg border border-gala-border"
                          />
                        </td>
                        <td className="py-2.5 px-3 text-right text-gala-gray">
                          {formatCurrency(item.unitPrice)}
                        </td>
                        <td className="py-2.5 px-3 text-right font-semibold text-gala-black">
                          {formatCurrency(item.subtotal)}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(item.productId)}
                            className="p-1 rounded text-gala-gray hover:text-gala-red"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center bg-gala-bg/40 rounded-xl border border-dashed border-gala-border text-gala-gray text-xs">
              Todavía no agregaste mobiliario. Seleccioná un producto arriba y hacé clic en "Agregar".
            </div>
          )}
        </div>

        {/* Step 4: Financials & Deposit */}
        <div className="p-5 bg-gala-surface rounded-2xl border border-gala-border shadow-subtle space-y-4">
          <h2 className="font-serif text-base font-semibold text-gala-black flex items-center gap-2 border-b border-gala-border/80 pb-3">
            <DollarSign size={18} className="text-gala-accent-dark" />
            <span>4. Presupuesto, seña y observaciones</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-3 bg-gala-bg rounded-xl border border-gala-border text-center">
              <span className="text-[10px] text-gala-gray uppercase font-medium block">Total presupuestado</span>
              <span className="font-serif text-2xl font-bold text-gala-black">
                {formatCurrency(totalAmount)}
              </span>
            </div>

            <div>
              <label className="block font-semibold text-gala-black mb-1">
                Seña abonada en el momento (ARS)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gala-gray font-serif font-bold text-sm">$</span>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={initialDeposit}
                  onChange={e => setInitialDeposit(e.target.value)}
                  placeholder="0"
                  className="w-full pl-8 pr-3 py-2 bg-white rounded-xl border border-gala-border focus:outline-none focus:border-gala-black font-semibold text-sm"
                />
              </div>
              <span className="text-[10px] text-gala-gray mt-1 block">
                Opcional. Si el cliente ya transfirió la seña.
              </span>
            </div>

            <div className="p-3 bg-gala-bg rounded-xl border border-gala-border text-center">
              <span className="text-[10px] text-gala-gray uppercase font-medium block">Saldo pendiente</span>
              <span className="font-serif text-2xl font-bold text-gala-red">
                {formatCurrency(pendingBalance)}
              </span>
            </div>
          </div>

          <div className="text-xs">
            <label className="block font-semibold text-gala-black mb-1">
              Observaciones de la reserva
            </label>
            <textarea
              rows={2}
              value={observations}
              onChange={e => setObservations(e.target.value)}
              placeholder="Horario específico de entrega, datos de guardia o portería, requerimientos especiales..."
              className="w-full px-3 py-2 bg-white rounded-xl border border-gala-border focus:outline-none focus:border-gala-black resize-none"
            />
          </div>
        </div>

        {/* Submit Bar */}
        <div className="flex items-center justify-between gap-4 pt-4 border-t border-gala-border">
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={() => navigate('/admin/reservas')}
          >
            Cancelar
          </Button>

          <Button
            type="submit"
            variant="primary"
            size="md"
            icon={<CheckCircle2 size={16} />}
            isLoading={isSubmitting}
            disabled={selectedItems.length === 0}
          >
            Confirmar y Guardar Reserva
          </Button>
        </div>
      </form>
    </div>
  );
};


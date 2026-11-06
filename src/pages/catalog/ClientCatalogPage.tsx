import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Product } from '../../types';
import { calculateAllProductsAvailability } from '../../engine/availabilityEngine';
import { getTodayString, addDaysString } from '../../utils/dateUtils';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { getProductImageUrl } from '../../utils/productImages';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import {
  Calendar,
  ShoppingBag,
  Plus,
  Minus,
  Check,
  Armchair,
  ArrowRight,
  Info,
  Clock,
} from 'lucide-react';

export const ClientCatalogPage: React.FC = () => {
  const navigate = useNavigate();
  const { products, reservations } = useApp();

  const today = getTodayString();
  const defaultEvent = addDaysString(today, 10);
  const defaultDelivery = addDaysString(defaultEvent, -1);
  const defaultReturn = addDaysString(defaultEvent, 1);

  // Rental dates
  const [eventDate, setEventDate] = useState<string>(() => {
    return sessionStorage.getItem('gala_cart_event_date') || defaultEvent;
  });
  const [deliveryDate, setDeliveryDate] = useState<string>(() => {
    return sessionStorage.getItem('gala_cart_delivery_date') || defaultDelivery;
  });
  const [returnDate, setReturnDate] = useState<string>(() => {
    return sessionStorage.getItem('gala_cart_return_date') || defaultReturn;
  });

  // Selected quantities: productId -> quantity in cart
  const [cartItems, setCartItems] = useState<{ [productId: string]: number }>(() => {
    const saved = sessionStorage.getItem('gala_cart_items');
    return saved ? JSON.parse(saved) : {};
  });

  const [selectedCategory, setSelectedCategory] = useState<string>('todos');

  // Persist cart & dates to sessionStorage
  useEffect(() => {
    sessionStorage.setItem('gala_cart_items', JSON.stringify(cartItems));
    sessionStorage.setItem('gala_cart_event_date', eventDate);
    sessionStorage.setItem('gala_cart_delivery_date', deliveryDate);
    sessionStorage.setItem('gala_cart_return_date', returnDate);
  }, [cartItems, eventDate, deliveryDate, returnDate]);

  // Live availability for these dates
  const availability = useMemo(() => {
    return calculateAllProductsAvailability(products, deliveryDate, returnDate, reservations);
  }, [products, deliveryDate, returnDate, reservations]);

  const categories = ['todos', ...Array.from(new Set(products.filter(p => p.active).map(p => p.category)))];

  const filteredProducts = useMemo(() => {
    return products
      .filter(p => p.active)
      .filter(p => selectedCategory === 'todos' || p.category === selectedCategory);
  }, [products, selectedCategory]);

  // Cart calculations
  const cartSummary = useMemo(() => {
    let totalItemsCount = 0;
    let totalAmount = 0;
    const itemsList: { product: Product; quantity: number; subtotal: number }[] = [];

    for (const [prodId, qty] of Object.entries(cartItems)) {
      if (qty > 0) {
        const product = products.find(p => p.id === prodId);
        if (product) {
          totalItemsCount += qty;
          const subtotal = qty * product.rentalPrice;
          totalAmount += subtotal;
          itemsList.push({ product, quantity: qty, subtotal });
        }
      }
    }

    return { totalItemsCount, totalAmount, itemsList };
  }, [cartItems, products]);

  const updateQuantity = (productId: string, delta: number, maxAvailable: number) => {
    const current = cartItems[productId] || 0;
    const next = Math.max(0, Math.min(maxAvailable, current + delta));

    setCartItems(prev => {
      const copy = { ...prev };
      if (next === 0) {
        delete copy[productId];
      } else {
        copy[productId] = next;
      }
      return copy;
    });
  };

  const handleContinueOrder = () => {
    if (cartSummary.totalItemsCount === 0) return;
    navigate('/catalogo/pedido');
  };

  return (
    <div className="space-y-8 pb-28">
      {/* Editorial Hero Section */}
      <div className="text-center max-w-2xl mx-auto space-y-3 pt-2">
        <span className="text-[11px] font-semibold tracking-[0.25em] text-gala-accent-dark uppercase">
          Catálogo Exclusivo
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-gala-black tracking-tight leading-tight">
          Equipá tu próximo evento
        </h1>
        <p className="text-xs sm:text-sm text-gala-gray max-w-lg mx-auto leading-relaxed">
          Elegí el mobiliario que necesitás y consultá disponibilidad en tiempo real para tu fecha.
        </p>
        <p className="text-[11px] text-stone-400 italic">
          * Fotografías ilustrativas y datos simulados para demostración comercial.
        </p>
      </div>

      {/* Date Selection Card (Step 1 & 2) */}
      <div data-tour="catalog-dates" className="bg-gala-surface rounded-2xl border border-gala-border p-5 sm:p-6 shadow-card max-w-3xl mx-auto">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gala-border/80">
          <Calendar size={18} className="text-gala-accent-dark" />
          <h2 className="font-serif text-base sm:text-lg font-semibold text-gala-black">
            Paso 1 y 2: Ingresá las fechas de tu evento
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-gala-black mb-1.5">
              Fecha del evento *
            </label>
            <input
              type="date"
              required
              min={today}
              value={eventDate}
              onChange={e => {
                const val = e.target.value;
                setEventDate(val);
                if (val < deliveryDate) setDeliveryDate(val);
                if (val > returnDate) setReturnDate(addDaysString(val, 1));
              }}
              className="w-full px-3 py-2.5 bg-white rounded-xl border border-gala-border focus:outline-none focus:border-gala-black font-medium"
            />
          </div>

          <div>
            <label className="block font-semibold text-gala-black mb-1.5">
              Entrega deseada *
            </label>
            <input
              type="date"
              required
              min={today}
              value={deliveryDate}
              onChange={e => {
                const val = e.target.value;
                setDeliveryDate(val);
                if (val > returnDate) setReturnDate(val);
              }}
              className="w-full px-3 py-2.5 bg-white rounded-xl border border-gala-border focus:outline-none focus:border-gala-black font-medium"
            />
          </div>

          <div>
            <label className="block font-semibold text-gala-black mb-1.5">
              Devolución pactada *
            </label>
            <input
              type="date"
              required
              min={deliveryDate}
              value={returnDate}
              onChange={e => setReturnDate(e.target.value)}
              className="w-full px-3 py-2.5 bg-white rounded-xl border border-gala-border focus:outline-none focus:border-gala-black font-medium"
            />
          </div>
        </div>

        <div className="mt-3.5 pt-3 border-t border-gala-border/60 flex items-center justify-between text-[11px] text-gala-gray">
          <span>
            Período de alquiler seleccionado: <strong>{formatDate(deliveryDate)} al {formatDate(returnDate)}</strong>
          </span>
          <span className="text-emerald-800 font-medium hidden sm:inline">
            ✓ Stock recalculado para estas fechas
          </span>
        </div>
      </div>

      {/* Category Pills (Step 3) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-xl font-semibold text-gala-black">
            Mobiliario Disponible
          </h3>
          <span className="text-xs text-gala-gray">
            Mostrando {filteredProducts.length} productos
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-gala-black text-gala-white font-semibold shadow-subtle'
                  : 'bg-gala-surface text-gala-gray hover:text-gala-black border border-gala-border'
              }`}
            >
              {cat === 'todos' ? 'Todo el mobiliario' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid (Step 4 & 5) */}
      <div data-tour="catalog-products" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map(product => {
          const avail = availability.find(a => a.productId === product.id);
          const availableUnits = avail ? avail.availableQuantity : 0;
          const currentInCart = cartItems[product.id] || 0;
          const isAgotado = availableUnits <= 0;

          return (
            <div
              key={product.id}
              className={`bg-gala-surface rounded-2xl border transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-card hover:shadow-float ${
                currentInCart > 0 ? 'border-gala-accent ring-1 ring-gala-accent' : 'border-gala-border'
              }`}
            >
              <div>
                {/* Photo */}
                <div className="relative h-52 bg-gala-bg overflow-hidden border-b border-gala-border/80">
                  <img
                    src={getProductImageUrl(product)}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    loading="lazy"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = '/images/products/sillas-tiffany.jpg';
                    }}
                  />

                  <div className="absolute top-3 left-3">
                    <span className="text-[10px] font-semibold bg-gala-black/80 backdrop-blur-xs text-white px-3 py-1 rounded-full uppercase tracking-wider">
                      {product.category}
                    </span>
                  </div>

                  <div className="absolute bottom-3 right-3">
                    <span className="text-xs font-bold bg-white/95 backdrop-blur-xs text-gala-black px-3 py-1.5 rounded-xl border border-gala-border shadow-subtle">
                      {formatCurrency(product.rentalPrice)} / u.
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="p-5 space-y-2.5">
                  <h4 className="font-serif text-lg font-semibold text-gala-black leading-snug">
                    {product.name}
                  </h4>

                  {product.description && (
                    <p className="text-xs text-gala-gray leading-relaxed line-clamp-3">
                      {product.description}
                    </p>
                  )}

                  {/* Availability Badge */}
                  <div className="pt-2 flex items-center justify-between text-xs">
                    <span className="text-gala-gray text-[11px]">Para tus fechas:</span>
                    {isAgotado ? (
                      <Badge variant="danger" size="sm">
                        Agotado en esa fecha
                      </Badge>
                    ) : availableUnits <= 10 ? (
                      <Badge variant="warning" size="sm">
                        Últimas {availableUnits} unidades
                      </Badge>
                    ) : (
                      <Badge variant="success" size="sm">
                        {availableUnits} unidades disponibles
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Selector de Cantidades (Step 4 & 5) */}
              <div className="p-4 border-t border-gala-border/80 bg-white/40">
                {isAgotado ? (
                  <button
                    disabled
                    className="w-full py-2.5 px-4 rounded-xl bg-stone-200 text-stone-500 text-xs font-medium cursor-not-allowed text-center"
                  >
                    No disponible para estas fechas
                  </button>
                ) : currentInCart === 0 ? (
                  <button
                    onClick={() => updateQuantity(product.id, 1, availableUnits)}
                    className="w-full py-2.5 px-4 rounded-xl bg-gala-black text-gala-white hover:bg-stone-800 transition-colors text-xs font-semibold flex items-center justify-center gap-2 shadow-subtle"
                  >
                    <Plus size={14} />
                    <span>Agregar al pedido</span>
                  </button>
                ) : (
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center bg-gala-surface border border-gala-border rounded-xl p-1">
                      <button
                        onClick={() => updateQuantity(product.id, -1, availableUnits)}
                        className="p-1.5 rounded-lg text-gala-black hover:bg-black/5"
                        aria-label="Restar una unidad"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="font-semibold text-sm w-12 text-center text-gala-black">
                        {currentInCart}
                      </span>
                      <button
                        onClick={() => updateQuantity(product.id, 1, availableUnits)}
                        disabled={currentInCart >= availableUnits}
                        className="p-1.5 rounded-lg text-gala-black hover:bg-black/5 disabled:opacity-30 disabled:pointer-events-none"
                        aria-label="Sumar una unidad"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <div className="text-right flex-1">
                      <span className="text-[10px] text-gala-gray block">Subtotal</span>
                      <span className="font-bold text-xs text-gala-black">
                        {formatCurrency(currentInCart * product.rentalPrice)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Bottom Cart Bar */}
      {cartSummary.totalItemsCount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-gala-black text-gala-surface p-4 sm:p-5 shadow-float border-t border-stone-800 animate-in slide-in-from-bottom">
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gala-accent text-gala-black flex items-center justify-center font-bold text-sm">
                <ShoppingBag size={18} />
              </div>
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="font-semibold text-white text-sm">
                    {cartSummary.totalItemsCount} {cartSummary.totalItemsCount === 1 ? 'producto' : 'productos'} en tu pedido
                  </span>
                  <span className="text-xs text-gala-accent font-semibold">
                    Total: {formatCurrency(cartSummary.totalAmount)}
                  </span>
                </div>
                <p className="text-[11px] text-stone-400">
                  Evento: {formatDate(eventDate)} • Entrega: {formatDate(deliveryDate)}
                </p>
              </div>
            </div>

            <button
              onClick={handleContinueOrder}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gala-accent text-gala-black font-semibold text-xs hover:bg-gala-accent-dark transition-colors flex items-center justify-center gap-2 shadow-subtle"
            >
              <span>Continuar con mi pedido</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};


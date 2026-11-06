import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Reservation } from '../../types';
import { formatDate, formatCurrency } from '../../utils/formatters';
import { Button } from '../../components/common/Button';
import {
  CheckCircle,
  Copy,
  Check,
  Shield,
  ArrowRight,
  Store,
  Building2,
  Calendar,
  Package,
} from 'lucide-react';

export const ClientConfirmationPage: React.FC = () => {
  const navigate = useNavigate();
  const [lastOrder, setLastOrder] = useState<Reservation | null>(null);
  const [copiedAlias, setCopiedAlias] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem('gala_last_order');
    if (raw) {
      try {
        setLastOrder(JSON.parse(raw));
      } catch {
        // fallback
      }
    }
  }, []);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAlias(true);
    setTimeout(() => setCopiedAlias(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 py-4">
      {/* Success banner */}
      <div className="text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-subtle animate-bounce">
          <CheckCircle size={36} />
        </div>

        <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
          Solicitud Enviada
        </span>

        <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-gala-black">
          ¡Recibimos tu solicitud!
        </h1>

        <p className="text-sm text-gala-gray max-w-md mx-auto leading-relaxed">
          Gala Equipamientos revisará la disponibilidad y se comunicará con vos para confirmar la reserva.
        </p>

        {lastOrder && (
          <div className="inline-block bg-gala-surface px-4 py-2 rounded-xl border border-gala-border text-xs font-mono text-gala-black shadow-xs">
            Código de solicitud: <strong>{lastOrder.code}</strong>
          </div>
        )}
      </div>

      {/* Details Recap if available */}
      {lastOrder && (
        <div className="p-6 bg-gala-surface rounded-2xl border border-gala-border shadow-card space-y-4 text-xs">
          <div className="flex items-center justify-between border-b border-gala-border/80 pb-3">
            <span className="font-serif text-base font-semibold text-gala-black">
              Detalle del pedido solicitado
            </span>
            <span className="text-gala-gray">
              {formatDate(lastOrder.deliveryDate)} al {formatDate(lastOrder.returnDate)}
            </span>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-gala-gray">
              <span>Cliente:</span>
              <strong className="text-gala-black">{lastOrder.clientName}</strong>
            </div>
            <div className="flex justify-between text-gala-gray">
              <span>Contacto:</span>
              <strong className="text-gala-black">{lastOrder.clientPhone}</strong>
            </div>
            <div className="flex justify-between text-gala-gray">
              <span>Lugar de entrega:</span>
              <strong className="text-gala-black text-right max-w-xs">{lastOrder.deliveryAddress}</strong>
            </div>
          </div>

          <div className="pt-3 border-t border-gala-border/60">
            <span className="text-[10px] font-semibold text-gala-gray uppercase tracking-wider block mb-2">
              Mobiliario incluido:
            </span>
            <div className="space-y-1 bg-gala-bg p-3 rounded-xl border border-gala-border/60">
              {lastOrder.items.map((item, idx) => (
                <div key={idx} className="flex justify-between text-xs">
                  <span>{item.quantity}× {item.productName}</span>
                  <span className="font-semibold text-gala-black">{formatCurrency(item.subtotal)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 flex justify-between items-baseline">
            <span className="font-semibold text-gala-black">Total estimado:</span>
            <span className="font-serif text-2xl font-bold text-gala-black">
              {formatCurrency(lastOrder.totalAmount)}
            </span>
          </div>
        </div>
      )}

      {/* Mock Bank Transfer Instructions */}
      <div className="p-6 bg-gala-surface rounded-2xl border border-gala-border shadow-card space-y-4 text-xs">
        <div className="flex items-center gap-2 border-b border-gala-border/80 pb-3">
          <Building2 size={18} className="text-gala-accent-dark" />
          <h3 className="font-serif text-base font-semibold text-gala-black">
            Instrucciones para señas y transferencias
          </h3>
        </div>

        <p className="text-gala-gray leading-relaxed">
          Una vez que nuestro equipo confirme la disponibilidad por WhatsApp, podrás reservar el mobiliario mediante transferencia de la seña acordada (habitualmente el 50%):
        </p>

        <div className="p-4 bg-gala-bg rounded-xl border border-gala-border space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-gala-gray">Alias de transferencia:</span>
            <div className="flex items-center gap-1.5">
              <strong className="font-mono text-gala-black text-xs">GALA.EVENTOS.ROSARIO</strong>
              <button
                onClick={() => handleCopy('GALA.EVENTOS.ROSARIO')}
                className="p-1 rounded text-gala-gray hover:text-gala-black"
                title="Copiar alias"
              >
                {copiedAlias ? <Check size={14} className="text-emerald-700" /> : <Copy size={14} />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gala-gray">CBU:</span>
            <strong className="font-mono text-gala-black text-xs">2850320040092100840123</strong>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gala-gray">Titular:</span>
            <strong className="text-gala-black text-xs">Gala Equipamientos (Demo Ficticia)</strong>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gala-gray">Entidad:</span>
            <strong className="text-gala-black text-xs">Banco Galicia — Cta. Cte. Especial</strong>
          </div>
        </div>

        <p className="text-[11px] text-stone-500 italic">
          * Demostración comercial: los datos bancarios son ficticios. El comprobante de transferencia se coordina directamente con el administrador.
        </p>
      </div>

      {/* Demo Quick Jump to Admin */}
      <div className="p-5 bg-gradient-to-r from-stone-900 to-stone-800 text-white rounded-2xl shadow-float flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-semibold text-gala-accent uppercase tracking-wider block">
            Paso clave de la Demostración
          </span>
          <h4 className="font-serif text-base font-semibold text-white mt-0.5">
            ¿Querés ver cómo llegó este pedido al administrador?
          </h4>
          <p className="text-xs text-stone-300 mt-1">
            Cambiá a la vista de administración para revisar el stock y aprobar la solicitud.
          </p>
        </div>

        <Button
          variant="secondary"
          size="md"
          icon={<Shield size={16} />}
          onClick={() => navigate('/admin/reservas?filter=pendiente')}
          className="bg-gala-accent text-gala-black font-semibold hover:bg-gala-accent-dark whitespace-nowrap self-stretch sm:self-auto"
        >
          Ver en Administración
        </Button>
      </div>

      {/* Back to Catalog button */}
      <div className="text-center pt-2">
        <button
          onClick={() => navigate('/catalogo')}
          className="text-xs text-gala-gray hover:text-gala-black underline"
        >
          Volver al catálogo principal
        </button>
      </div>
    </div>
  );
};

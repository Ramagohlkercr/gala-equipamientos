import React, { useState } from 'react';
import { Reservation, PaymentMethod } from '../../types';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { getTodayString } from '../../utils/dateUtils';
import { useApp } from '../../context/AppContext';
import { DollarSign, Upload, CheckCircle2, History } from 'lucide-react';

interface RegisterPaymentModalProps {
  reservation: Reservation | null;
  isOpen: boolean;
  onClose: () => void;
}

export const RegisterPaymentModal: React.FC<RegisterPaymentModalProps> = ({
  reservation,
  isOpen,
  onClose,
}) => {
  const { recordPayment, payments } = useApp();

  const [amount, setAmount] = useState<string>('');
  const [method, setMethod] = useState<PaymentMethod>('transferencia');
  const [date, setDate] = useState<string>(getTodayString());
  const [notes, setNotes] = useState<string>('');
  const [simulatedReceipt, setSimulatedReceipt] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  if (!reservation) return null;

  const resPayments = payments.filter(p => p.reservationId === reservation.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) return;

    recordPayment({
      reservationId: reservation.id,
      amount: numericAmount,
      method,
      date,
      notes: notes || undefined,
      receiptName: simulatedReceipt || undefined,
    });

    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setAmount('');
      setNotes('');
      setSimulatedReceipt(null);
      onClose();
    }, 1200);
  };

  const handleSimulateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSimulatedReceipt(e.target.files[0].name);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Registrar Seña o Pago"
      subtitle={`Reserva ${reservation.code} • Cliente: ${reservation.clientName}`}
      maxWidth="md"
    >
      {showSuccess ? (
        <div className="py-8 text-center space-y-3">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 size={24} />
          </div>
          <h4 className="font-serif text-lg font-semibold text-gala-black">
            ¡Pago registrado con éxito!
          </h4>
          <p className="text-xs text-gala-gray">
            El saldo de la reserva se actualizó automáticamente.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Financial context banner */}
          <div className="p-3 bg-gala-bg rounded-xl border border-gala-border grid grid-cols-3 gap-2 text-center">
            <div>
              <span className="text-[10px] text-gala-gray uppercase font-medium block">Total</span>
              <span className="font-semibold text-gala-black">{formatCurrency(reservation.totalAmount)}</span>
            </div>
            <div>
              <span className="text-[10px] text-emerald-700 uppercase font-medium block">Abonado</span>
              <span className="font-semibold text-emerald-800">{formatCurrency(reservation.depositPaid)}</span>
            </div>
            <div>
              <span className="text-[10px] text-gala-red uppercase font-medium block">Saldo Restante</span>
              <span className="font-bold text-gala-red">{formatCurrency(reservation.pendingBalance)}</span>
            </div>
          </div>

          {/* Quick full-balance or 50% buttons */}
          {reservation.pendingBalance > 0 && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setAmount(reservation.pendingBalance.toString())}
                className="px-2.5 py-1 rounded-lg bg-gala-surface hover:bg-gala-accent/20 border border-gala-border text-[11px] text-gala-black font-medium transition-colors"
              >
                Cobrar total: {formatCurrency(reservation.pendingBalance)}
              </button>
              {reservation.depositPaid === 0 && (
                <button
                  type="button"
                  onClick={() => setAmount(Math.round(reservation.totalAmount * 0.5).toString())}
                  className="px-2.5 py-1 rounded-lg bg-gala-surface hover:bg-gala-accent/20 border border-gala-border text-[11px] text-gala-black font-medium transition-colors"
                >
                  Seña 50%: {formatCurrency(Math.round(reservation.totalAmount * 0.5))}
                </button>
              )}
            </div>
          )}

          {/* Amount input */}
          <div>
            <label className="block font-semibold text-gala-black mb-1">
              Importe a registrar (ARS) *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-gala-gray font-serif font-bold text-sm">$</span>
              <input
                type="number"
                required
                min="1"
                step="any"
                max={reservation.pendingBalance > 0 ? reservation.pendingBalance : undefined}
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="Ej. 150000"
                className="w-full pl-8 pr-3 py-2 bg-white rounded-xl border border-gala-border focus:outline-none focus:border-gala-black font-medium text-sm text-gala-black"
              />
            </div>
          </div>

          {/* Date & Method */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-gala-black mb-1">Fecha de pago *</label>
              <input
                type="date"
                required
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full px-3 py-2 bg-white rounded-xl border border-gala-border focus:outline-none focus:border-gala-black"
              />
            </div>

            <div>
              <label className="block font-semibold text-gala-black mb-1">Método *</label>
              <select
                value={method}
                onChange={e => setMethod(e.target.value as PaymentMethod)}
                className="w-full px-3 py-2 bg-white rounded-xl border border-gala-border focus:outline-none focus:border-gala-black"
              >
                <option value="transferencia">Transferencia bancaria</option>
                <option value="efectivo">Efectivo en mano</option>
                <option value="otro">Otro medio de pago</option>
              </select>
            </div>
          </div>

          {/* Observations */}
          <div>
            <label className="block font-semibold text-gala-black mb-1">Observaciones / Referencia</label>
            <input
              type="text"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Ej. Transferencia Banco Santander, operac. 4912"
              className="w-full px-3 py-2 bg-white rounded-xl border border-gala-border focus:outline-none focus:border-gala-black"
            />
          </div>

          {/* Simulated receipt upload */}
          <div className="p-3 bg-white rounded-xl border border-dashed border-gala-border space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-gala-black flex items-center gap-1.5">
                <Upload size={13} className="text-gala-accent-dark" />
                <span>Adjuntar comprobante</span>
              </span>
              <span className="text-[10px] text-gala-gray italic">Demostración simulada</span>
            </div>
            <p className="text-[10px] text-gala-gray">
              Podés seleccionar una imagen o PDF de prueba para simular el archivo adjunto.
            </p>
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={handleSimulateUpload}
              className="block w-full text-[11px] text-gala-gray file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border file:border-gala-border file:text-xs file:bg-gala-surface file:text-gala-black hover:file:bg-gala-accent/20 cursor-pointer pt-1"
            />
            {simulatedReceipt && (
              <p className="text-[10px] text-emerald-800 font-medium">
                ✓ Comprobante cargado: {simulatedReceipt}
              </p>
            )}
          </div>

          {/* Payment History for this reservation */}
          {resPayments.length > 0 && (
            <div className="pt-2 border-t border-gala-border/60">
              <span className="font-semibold text-gala-gray text-[10px] uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                <History size={11} />
                <span>Historial de pagos previos ({resPayments.length})</span>
              </span>
              <div className="space-y-1 max-h-24 overflow-y-auto">
                {resPayments.map(p => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between p-1.5 bg-gala-bg rounded-lg text-[11px]"
                  >
                    <div>
                      <strong className="text-gala-black">{formatCurrency(p.amount)}</strong>
                      <span className="text-gala-gray ml-1.5 capitalize">({p.method})</span>
                    </div>
                    <span className="text-gala-gray">{formatDate(p.date)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer buttons */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-gala-border/80">
            <Button variant="outline" size="sm" type="button" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              variant="primary"
              size="sm"
              type="submit"
              icon={<DollarSign size={14} />}
              disabled={!amount || parseFloat(amount) <= 0}
            >
              Registrar pago
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};


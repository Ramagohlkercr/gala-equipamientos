export type PaymentMethod = 'transferencia' | 'efectivo' | 'otro';

export type PaymentStatus = 'sin_seña' | 'pago_parcial' | 'pagado';

export interface PaymentRecord {
  id: string;
  reservationId: string;
  amount: number;
  date: string; // YYYY-MM-DD
  method: PaymentMethod;
  notes?: string;
  receiptName?: string; // Simulation of voucher / comprobante
  createdAt: string;
}

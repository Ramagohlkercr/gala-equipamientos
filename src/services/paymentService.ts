import { PaymentRecord, PaymentMethod, PaymentStatus } from '../types';
import { storageService } from './storageService';
import { getTodayString } from '../utils/dateUtils';

export const paymentService = {
  getAll(): PaymentRecord[] {
    return storageService.getPayments();
  },

  getByReservationId(reservationId: string): PaymentRecord[] {
    return storageService.getPayments().filter(p => p.reservationId === reservationId);
  },

  recordPayment(params: {
    reservationId: string;
    amount: number;
    method: PaymentMethod;
    date?: string;
    notes?: string;
    receiptName?: string;
  }): { payment: PaymentRecord; updatedReservation: boolean } {
    const { reservationId, amount, method, date, notes, receiptName } = params;
    const payments = storageService.getPayments();

    const newPayment: PaymentRecord = {
      id: `pay-${Date.now()}`,
      reservationId,
      amount,
      date: date || getTodayString(),
      method,
      notes,
      receiptName,
      createdAt: getTodayString(),
    };

    payments.unshift(newPayment);
    storageService.savePayments(payments);

    // Synchronize reservation financial balances
    const reservations = storageService.getReservations();
    const resIndex = reservations.findIndex(r => r.id === reservationId);

    if (resIndex !== -1) {
      const res = reservations[resIndex];
      const allResPayments = payments.filter(p => p.reservationId === reservationId);
      const totalPaid = allResPayments.reduce((sum, p) => sum + p.amount, 0);
      const pendingBalance = Math.max(0, res.totalAmount - totalPaid);

      let paymentStatus: PaymentStatus = 'sin_seña';
      if (totalPaid >= res.totalAmount && res.totalAmount > 0) {
        paymentStatus = 'pagado';
      } else if (totalPaid > 0) {
        paymentStatus = 'pago_parcial';
      }

      reservations[resIndex] = {
        ...res,
        depositPaid: totalPaid,
        pendingBalance,
        paymentStatus,
        updatedAt: getTodayString(),
      };

      storageService.saveReservations(reservations);
      return { payment: newPayment, updatedReservation: true };
    }

    return { payment: newPayment, updatedReservation: false };
  },
};


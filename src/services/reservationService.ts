import { Reservation, ReservationItem, ReservationStatus } from '../types';
import { storageService } from './storageService';
import { validateReservationFeasibility } from '../engine/availabilityEngine';
import { getTodayString } from '../utils/dateUtils';
import { clientService } from './clientService';

export interface CreateReservationInput {
  clientName: string;
  clientPhone: string;
  clientAddress?: string;
  clientNotes?: string;
  eventDate: string;
  deliveryDate: string;
  returnDate: string;
  deliveryAddress: string;
  items: ReservationItem[];
  totalAmount: number;
  initialDeposit?: number;
  observations?: string;
  source?: 'admin' | 'catalogo';
  status?: ReservationStatus;
}

export const reservationService = {
  getAll(): Reservation[] {
    return storageService.getReservations();
  },

  getById(id: string): Reservation | undefined {
    return storageService.getReservations().find(r => r.id === id);
  },

  create(input: CreateReservationInput): {
    success: boolean;
    reservation?: Reservation;
    error?: string;
    issues?: any[];
  } {
    const products = storageService.getProducts();
    const existingReservations = storageService.getReservations();

    // If creating directly as confirmed, validate feasibility
    const targetStatus = input.status || (input.source === 'catalogo' ? 'pendiente' : 'confirmada');

    if (targetStatus === 'confirmada' || targetStatus === 'en_curso') {
      const check = validateReservationFeasibility(
        input.items.map(i => ({ productId: i.productId, quantity: i.quantity })),
        input.deliveryDate,
        input.returnDate,
        products,
        existingReservations
      );

      if (!check.feasible) {
        return {
          success: false,
          error: 'No hay suficiente disponibilidad para todos los productos en las fechas seleccionadas.',
          issues: check.issues,
        };
      }
    }

    // Auto find or create client
    const client = clientService.findOrCreateByPhone(
      input.clientName,
      input.clientPhone,
      input.clientAddress || input.deliveryAddress,
      'Rosario',
      input.clientNotes
    );

    const initialDeposit = input.initialDeposit || 0;
    const pendingBalance = Math.max(0, input.totalAmount - initialDeposit);

    let paymentStatus: 'sin_seña' | 'pago_parcial' | 'pagado' = 'sin_seña';
    if (initialDeposit >= input.totalAmount && input.totalAmount > 0) {
      paymentStatus = 'pagado';
    } else if (initialDeposit > 0) {
      paymentStatus = 'pago_parcial';
    }

    const nextNumber = existingReservations.length + 105;
    const prefix = targetStatus === 'pendiente' ? 'SOL' : 'RES';
    const code = `${prefix}-${nextNumber}`;

    const newReservation: Reservation = {
      id: `res-${Date.now()}`,
      code,
      clientId: client.id,
      clientName: input.clientName,
      clientPhone: input.clientPhone,
      clientAddress: input.clientAddress || input.deliveryAddress,
      clientNotes: input.clientNotes,
      eventDate: input.eventDate,
      deliveryDate: input.deliveryDate,
      returnDate: input.returnDate,
      deliveryAddress: input.deliveryAddress,
      items: input.items,
      totalAmount: input.totalAmount,
      depositPaid: initialDeposit,
      pendingBalance,
      paymentStatus,
      status: targetStatus,
      source: input.source || 'admin',
      observations: input.observations,
      createdAt: getTodayString(),
      updatedAt: getTodayString(),
    };

    existingReservations.unshift(newReservation);
    storageService.saveReservations(existingReservations);

    // If initial deposit was made, record payment
    if (initialDeposit > 0) {
      const payments = storageService.getPayments();
      payments.unshift({
        id: `pay-${Date.now()}`,
        reservationId: newReservation.id,
        amount: initialDeposit,
        date: getTodayString(),
        method: 'transferencia',
        notes: 'Seña inicial registrada al crear la reserva.',
        createdAt: getTodayString(),
      });
      storageService.savePayments(payments);
    }

    return {
      success: true,
      reservation: newReservation,
    };
  },

  update(
    id: string,
    updates: Partial<Reservation>
  ): { success: boolean; reservation?: Reservation; error?: string; issues?: any[] } {
    const reservations = storageService.getReservations();
    const index = reservations.findIndex(r => r.id === id);
    if (index === -1) return { success: false, error: 'Reserva no encontrada.' };

    const current = reservations[index];
    const merged: Reservation = {
      ...current,
      ...updates,
      updatedAt: getTodayString(),
    };

    // If status is confirmed or en_curso, validate feasibility excluding current booking
    if (merged.status === 'confirmada' || merged.status === 'en_curso') {
      const products = storageService.getProducts();
      const check = validateReservationFeasibility(
        merged.items.map(i => ({ productId: i.productId, quantity: i.quantity })),
        merged.deliveryDate,
        merged.returnDate,
        products,
        reservations,
        id // exclude own reservation
      );

      if (!check.feasible) {
        return {
          success: false,
          error: 'No es posible actualizar: las nuevas cantidades o fechas superan la disponibilidad.',
          issues: check.issues,
        };
      }
    }

    reservations[index] = merged;
    storageService.saveReservations(reservations);

    return { success: true, reservation: merged };
  },

  /**
   * Approves and confirms a pending request.
   * Recalculates stock before confirming.
   */
  confirmPendingRequest(id: string): { success: boolean; error?: string; issues?: any[] } {
    const reservations = storageService.getReservations();
    const target = reservations.find(r => r.id === id);
    if (!target) return { success: false, error: 'Solicitud no encontrada.' };

    const products = storageService.getProducts();
    const check = validateReservationFeasibility(
      target.items.map(i => ({ productId: i.productId, quantity: i.quantity })),
      target.deliveryDate,
      target.returnDate,
      products,
      reservations,
      id
    );

    if (!check.feasible) {
      return {
        success: false,
        error: 'No hay stock suficiente para confirmar esta solicitud. Por favor verifique el inventario o ajuste los productos.',
        issues: check.issues,
      };
    }

    target.status = 'confirmada';
    if (target.code.startsWith('SOL-')) {
      target.code = target.code.replace('SOL-', 'RES-');
    }
    target.updatedAt = getTodayString();
    storageService.saveReservations(reservations);

    return { success: true };
  },

  /**
   * Rejects a pending request or cancels a reservation.
   */
  cancelOrReject(id: string, reason?: string): { success: boolean } {
    const reservations = storageService.getReservations();
    const target = reservations.find(r => r.id === id);
    if (!target) return { success: false };

    target.status = 'cancelada';
    if (reason) {
      target.observations = target.observations
        ? `${target.observations} | Motivo cancelación: ${reason}`
        : `Motivo cancelación: ${reason}`;
    }
    target.updatedAt = getTodayString();
    storageService.saveReservations(reservations);
    return { success: true };
  },

  /**
   * Confirms effective return of rented furniture.
   * Immediately releases inventory.
   */
  confirmReturn(id: string, actualReturnDate: string = getTodayString()): { success: boolean } {
    const reservations = storageService.getReservations();
    const target = reservations.find(r => r.id === id);
    if (!target) return { success: false };

    target.status = 'finalizada';
    target.actualReturnDate = actualReturnDate;
    target.updatedAt = getTodayString();
    storageService.saveReservations(reservations);
    return { success: true };
  },
};

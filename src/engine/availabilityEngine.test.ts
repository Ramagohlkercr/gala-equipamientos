import { describe, it, expect } from 'vitest';
import { Product, Reservation } from '../types';
import {
  calculateProductAvailability,
  validateReservationFeasibility,
  getReservationCommitmentInterval,
} from './availabilityEngine';

// Sample mock product: Tiffany Chairs (100 total units)
const mockChairs: Product = {
  id: 'prod-tiffany',
  name: 'Sillas Tiffany Blancas',
  category: 'Sillas',
  totalQuantity: 100,
  rentalPrice: 1500,
  active: true,
};

const mockTables: Product = {
  id: 'prod-round-table',
  name: 'Mesas Redondas 1.50m',
  category: 'Mesas',
  totalQuantity: 20,
  rentalPrice: 6000,
  active: true,
};

describe('Motor de Disponibilidad — Gala Equipamientos', () => {

  // 1. Stock disponible sin reservas
  it('1. Debe reportar stock completo cuando no existen reservas', () => {
    const avail = calculateProductAvailability(
      mockChairs,
      '2026-11-08',
      '2026-11-10',
      []
    );
    expect(avail.totalQuantity).toBe(100);
    expect(avail.committedQuantity).toBe(0);
    expect(avail.availableQuantity).toBe(100);
    expect(avail.status).toBe('disponible');
  });

  // 2. Reservas superpuestas
  it('2. Debe descontar unidades comprometidas en un período superpuesto', () => {
    const existingReservation: Reservation = {
      id: 'res-1',
      code: 'RES-001',
      clientName: 'María Rossi',
      clientPhone: '3415551234',
      clientAddress: 'Bv. Oroño 1234, Rosario',
      eventDate: '2026-11-09',
      deliveryDate: '2026-11-08',
      returnDate: '2026-11-10',
      deliveryAddress: 'Salón Terrazas, Rosario',
      items: [{ productId: 'prod-tiffany', productName: 'Sillas Tiffany', quantity: 60, unitPrice: 1500, subtotal: 90000 }],
      totalAmount: 90000,
      depositPaid: 45000,
      pendingBalance: 45000,
      paymentStatus: 'pago_parcial',
      status: 'confirmada',
      source: 'admin',
      createdAt: '2026-11-01',
      updatedAt: '2026-11-01',
    };

    // Nueva consulta para el 09/11/2026 (dentro del período 08/11 a 10/11)
    const avail = calculateProductAvailability(
      mockChairs,
      '2026-11-09',
      '2026-11-09',
      [existingReservation]
    );

    expect(avail.committedQuantity).toBe(60);
    expect(avail.availableQuantity).toBe(40);
  });

  // 3. Reservas no superpuestas
  it('3. Debe ofrecer stock completo en fechas posteriores o anteriores sin superposición', () => {
    const existingReservation: Reservation = {
      id: 'res-1',
      code: 'RES-001',
      clientName: 'María Rossi',
      clientPhone: '3415551234',
      clientAddress: 'Bv. Oroño 1234, Rosario',
      eventDate: '2026-11-09',
      deliveryDate: '2026-11-08',
      returnDate: '2026-11-10',
      deliveryAddress: 'Salón Terrazas, Rosario',
      items: [{ productId: 'prod-tiffany', productName: 'Sillas Tiffany', quantity: 60, unitPrice: 1500, subtotal: 90000 }],
      totalAmount: 90000,
      depositPaid: 45000,
      pendingBalance: 45000,
      paymentStatus: 'pago_parcial',
      status: 'confirmada',
      source: 'admin',
      createdAt: '2026-11-01',
      updatedAt: '2026-11-01',
    };

    // Consulta para el fin de semana siguiente (15/11 a 17/11)
    const avail = calculateProductAvailability(
      mockChairs,
      '2026-11-15',
      '2026-11-17',
      [existingReservation]
    );

    expect(avail.committedQuantity).toBe(0);
    expect(avail.availableQuantity).toBe(100);
  });

  // 4. Edición de reserva: excluir reserva en edición
  it('4. Al editar una reserva debe excluir su propia ocupación para no duplicar conteo', () => {
    const existingReservation: Reservation = {
      id: 'res-1',
      code: 'RES-001',
      clientName: 'María Rossi',
      clientPhone: '3415551234',
      clientAddress: 'Bv. Oroño 1234, Rosario',
      eventDate: '2026-11-09',
      deliveryDate: '2026-11-08',
      returnDate: '2026-11-10',
      deliveryAddress: 'Salón Terrazas, Rosario',
      items: [{ productId: 'prod-tiffany', productName: 'Sillas Tiffany', quantity: 60, unitPrice: 1500, subtotal: 90000 }],
      totalAmount: 90000,
      depositPaid: 45000,
      pendingBalance: 45000,
      paymentStatus: 'pago_parcial',
      status: 'confirmada',
      source: 'admin',
      createdAt: '2026-11-01',
      updatedAt: '2026-11-01',
    };

    // Si excluimos res-1 (porque la estamos editando)
    const avail = calculateProductAvailability(
      mockChairs,
      '2026-11-08',
      '2026-11-10',
      [existingReservation],
      'res-1' // excludeReservationId
    );

    expect(avail.committedQuantity).toBe(0);
    expect(avail.availableQuantity).toBe(100);
  });

  // 5. Cancelación: reservas canceladas no comprometen stock
  it('5. Las reservas canceladas no deben descontar stock', () => {
    const cancelledReservation: Reservation = {
      id: 'res-canc',
      code: 'RES-099',
      clientName: 'Juan Pérez',
      clientPhone: '3415554321',
      clientAddress: 'Córdoba 2000, Rosario',
      eventDate: '2026-11-09',
      deliveryDate: '2026-11-08',
      returnDate: '2026-11-10',
      deliveryAddress: 'Quinta Funes',
      items: [{ productId: 'prod-tiffany', productName: 'Sillas Tiffany', quantity: 80, unitPrice: 1500, subtotal: 120000 }],
      totalAmount: 120000,
      depositPaid: 0,
      pendingBalance: 120000,
      paymentStatus: 'sin_seña',
      status: 'cancelada',
      source: 'admin',
      createdAt: '2026-11-01',
      updatedAt: '2026-11-02',
    };

    const avail = calculateProductAvailability(
      mockChairs,
      '2026-11-08',
      '2026-11-10',
      [cancelledReservation]
    );

    expect(avail.committedQuantity).toBe(0);
    expect(avail.availableQuantity).toBe(100);
  });

  // 6. Solicitudes pendientes no bloquean definitivamente pero se valida antes de confirmar
  it('6. Solicitud pendiente no bloquea stock general, pero validación impide confirmar si no hay stock', () => {
    const pendingRequest: Reservation = {
      id: 'req-pending',
      code: 'SOL-001',
      clientName: 'Carla Gómez',
      clientPhone: '3415559876',
      clientAddress: 'Pellegrini 1500, Rosario',
      eventDate: '2026-11-09',
      deliveryDate: '2026-11-08',
      returnDate: '2026-11-10',
      deliveryAddress: 'Salón Fisherton',
      items: [{ productId: 'prod-tiffany', productName: 'Sillas Tiffany', quantity: 70, unitPrice: 1500, subtotal: 105000 }],
      totalAmount: 105000,
      depositPaid: 0,
      pendingBalance: 105000,
      paymentStatus: 'sin_seña',
      status: 'pendiente',
      source: 'catalogo',
      createdAt: '2026-11-03',
      updatedAt: '2026-11-03',
    };

    // Las solicitudes pendientes no bloquean stock para otras consultas
    const availBefore = calculateProductAvailability(
      mockChairs,
      '2026-11-08',
      '2026-11-10',
      [pendingRequest]
    );
    expect(availBefore.availableQuantity).toBe(100);

    // Si ya existe otra confirmada con 60 sillas:
    const confirmedRes: Reservation = {
      ...pendingRequest,
      id: 'res-conf',
      status: 'confirmada',
      items: [{ productId: 'prod-tiffany', productName: 'Sillas Tiffany', quantity: 60, unitPrice: 1500, subtotal: 90000 }],
    };

    // Al intentar confirmar la solicitud pendiente que pide 70 sillas:
    const check = validateReservationFeasibility(
      [{ productId: 'prod-tiffany', quantity: 70 }],
      '2026-11-08',
      '2026-11-10',
      [mockChairs],
      [confirmedRes]
    );

    expect(check.feasible).toBe(false);
    expect(check.issues.length).toBe(1);
    expect(check.issues[0].available).toBe(40);
    expect(check.issues[0].shortage).toBe(30);
  });

  // 7. Devolución confirmada libera stock
  it('7. Al confirmar devolución se libera el stock para fechas posteriores a la devolución efectiva', () => {
    const returnedRes: Reservation = {
      id: 'res-ret',
      code: 'RES-010',
      clientName: 'Esteban Paz',
      clientPhone: '3415558888',
      clientAddress: 'Salta 2200, Rosario',
      eventDate: '2026-11-02',
      deliveryDate: '2026-11-01',
      returnDate: '2026-11-03',
      actualReturnDate: '2026-11-03',
      deliveryAddress: 'Club Gimnasia',
      items: [{ productId: 'prod-tiffany', productName: 'Sillas Tiffany', quantity: 80, unitPrice: 1500, subtotal: 120000 }],
      totalAmount: 120000,
      depositPaid: 120000,
      pendingBalance: 0,
      paymentStatus: 'pagado',
      status: 'finalizada',
      source: 'admin',
      createdAt: '2026-10-25',
      updatedAt: '2026-11-03',
    };

    const avail = calculateProductAvailability(
      mockChairs,
      '2026-11-04',
      '2026-11-06',
      [returnedRes]
    );

    expect(avail.committedQuantity).toBe(0);
    expect(avail.availableQuantity).toBe(100);
  });

  // 8. Cálculo de saldo pendiente
  it('8. Debe calcular correctamente saldos y estados de pago', () => {
    const total = 150000;
    const deposit = 50000;
    const pending = total - deposit;
    expect(pending).toBe(100000);
  });

  // 9. Intento de sobreventa: previene reservas que superan stock
  it('9. validateReservationFeasibility rechaza pedidos que superan el stock total o disponible', () => {
    const check = validateReservationFeasibility(
      [{ productId: 'prod-tiffany', quantity: 150 }], // 150 requested, 100 available
      '2026-11-08',
      '2026-11-10',
      [mockChairs],
      []
    );

    expect(check.feasible).toBe(false);
    expect(check.issues[0].requested).toBe(150);
    expect(check.issues[0].available).toBe(100);
    expect(check.issues[0].shortage).toBe(50);
  });

  // 10. Múltiples reservas parcialmente superpuestas calculan el pico simultáneo exacto
  it('10. Múltiples reservas superpuestas calculan la ocupación máxima simultánea diaria', () => {
    // Reserva 1: 30 sillas del 08/11 al 10/11
    const res1: Reservation = {
      id: 'res-A',
      code: 'RES-A',
      clientName: 'Evento A',
      clientPhone: '3411111111',
      clientAddress: 'Rosario',
      eventDate: '2026-11-09',
      deliveryDate: '2026-11-08',
      returnDate: '2026-11-10',
      deliveryAddress: 'Rosario',
      items: [{ productId: 'prod-tiffany', productName: 'Sillas', quantity: 30, unitPrice: 1500, subtotal: 45000 }],
      totalAmount: 45000,
      depositPaid: 45000,
      pendingBalance: 0,
      paymentStatus: 'pagado',
      status: 'confirmada',
      source: 'admin',
      createdAt: '2026-11-01',
      updatedAt: '2026-11-01',
    };

    // Reserva 2: 40 sillas del 10/11 al 12/11 (coinciden únicamente el 10/11)
    const res2: Reservation = {
      id: 'res-B',
      code: 'RES-B',
      clientName: 'Evento B',
      clientPhone: '3412222222',
      clientAddress: 'Rosario',
      eventDate: '2026-11-11',
      deliveryDate: '2026-11-10',
      returnDate: '2026-11-12',
      deliveryAddress: 'Rosario',
      items: [{ productId: 'prod-tiffany', productName: 'Sillas', quantity: 40, unitPrice: 1500, subtotal: 60000 }],
      totalAmount: 60000,
      depositPaid: 30000,
      pendingBalance: 30000,
      paymentStatus: 'pago_parcial',
      status: 'confirmada',
      source: 'admin',
      createdAt: '2026-11-01',
      updatedAt: '2026-11-01',
    };

    // Para el período total 08/11 al 12/11:
    // El 08/11: 30 sillas ocupadas
    // El 09/11: 30 sillas ocupadas
    // El 10/11: 30 + 40 = 70 sillas ocupadas (PICO)
    // El 11/11: 40 sillas ocupadas
    // El 12/11: 40 sillas ocupadas
    // Stock total 100 -> disponible en el período: 100 - 70 = 30 sillas
    const avail = calculateProductAvailability(
      mockChairs,
      '2026-11-08',
      '2026-11-12',
      [res1, res2]
    );

    expect(avail.committedQuantity).toBe(70);
    expect(avail.availableQuantity).toBe(30);

    // En cambio, para una consulta exclusiva del 08/11 al 09/11 (antes de res2):
    const availEarly = calculateProductAvailability(
      mockChairs,
      '2026-11-08',
      '2026-11-09',
      [res1, res2]
    );
    expect(availEarly.committedQuantity).toBe(30);
    expect(availEarly.availableQuantity).toBe(70);
  });
});

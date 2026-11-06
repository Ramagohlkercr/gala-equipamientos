import { Product, Reservation, ProductAvailability, DayOccupancy } from '../types';
import { getDatesBetween, getTodayString } from '../utils/dateUtils';

export interface OverdueReservationInfo {
  reservationId: string;
  code: string;
  clientName: string;
  expectedReturnDate: string;
  daysOverdue: number;
}

/**
 * Determines the effective start and end date of stock commitment for a reservation.
 * Applies a conservative rental policy for overdue items that have not been returned yet.
 */
export function getReservationCommitmentInterval(
  reservation: Reservation,
  currentDate: string = getTodayString()
): { startDate: string; endDate: string; isOverduePendingReturn: boolean } | null {
  // Cancelled reservations never commit stock
  if (reservation.status === 'cancelada') {
    return null;
  }

  // Pending requests do not permanently block inventory
  if (reservation.status === 'pendiente') {
    return null;
  }

  // If already finalized, look at actual return date if available, else scheduled return date
  if (reservation.status === 'finalizada') {
    const effectiveReturn = reservation.actualReturnDate || reservation.returnDate;
    return {
      startDate: reservation.deliveryDate,
      endDate: effectiveReturn,
      isOverduePendingReturn: false,
    };
  }

  // For active reservations (confirmada, en_curso):
  // If actual return date was registered already:
  if (reservation.actualReturnDate) {
    return {
      startDate: reservation.deliveryDate,
      endDate: reservation.actualReturnDate,
      isOverduePendingReturn: false,
    };
  }

  // If return hasn't happened yet and today is past scheduled return date:
  // Conservative policy: items remain committed until confirmed return
  const isOverdue = currentDate > reservation.returnDate;
  const effectiveEndDate = isOverdue ? currentDate : reservation.returnDate;

  return {
    startDate: reservation.deliveryDate,
    endDate: effectiveEndDate,
    isOverduePendingReturn: isOverdue,
  };
}

/**
 * Calculates day-by-day occupancy of a specific product over a date range [startDate, endDate].
 */
export function getProductDailyOccupancy(
  productId: string,
  startDate: string,
  endDate: string,
  reservations: Reservation[],
  excludeReservationId?: string,
  currentDate: string = getTodayString()
): DayOccupancy[] {
  const dates = getDatesBetween(startDate, endDate);
  if (dates.length === 0) return [];

  // Filter relevant reservations that contain the product and commit stock
  const relevantBookings = reservations.filter(r => {
    if (excludeReservationId && r.id === excludeReservationId) return false;
    const interval = getReservationCommitmentInterval(r, currentDate);
    if (!interval) return false;
    // Check if the reservation includes this product
    return r.items.some(item => item.productId === productId);
  });

  return dates.map(date => {
    let occupied = 0;
    for (const r of relevantBookings) {
      const interval = getReservationCommitmentInterval(r, currentDate);
      if (interval && interval.startDate <= date && date <= interval.endDate) {
        const item = r.items.find(i => i.productId === productId);
        if (item) {
          occupied += item.quantity;
        }
      }
    }
    return {
      date,
      occupied,
      available: 0, // will be populated when total stock is known
    };
  });
}

/**
 * Calculates availability of a single product for a given date range.
 * Finds the peak simultaneous occupancy across all days in [startDate, endDate].
 */
export function calculateProductAvailability(
  product: Product,
  startDate: string,
  endDate: string,
  reservations: Reservation[],
  excludeReservationId?: string,
  currentDate: string = getTodayString()
): ProductAvailability {
  if (!product.active) {
    return {
      productId: product.id,
      productName: product.name,
      totalQuantity: product.totalQuantity,
      committedQuantity: 0,
      availableQuantity: 0,
      status: 'agotado',
    };
  }

  const daily = getProductDailyOccupancy(
    product.id,
    startDate,
    endDate,
    reservations,
    excludeReservationId,
    currentDate
  );

  // Peak simultaneous occupancy during the requested period
  const peakOccupancy = daily.reduce((max, d) => Math.max(max, d.occupied), 0);
  const available = Math.max(0, product.totalQuantity - peakOccupancy);

  let status: 'disponible' | 'stock_bajo' | 'agotado' = 'disponible';
  if (available <= 0) {
    status = 'agotado';
  } else if (available <= Math.ceil(product.totalQuantity * 0.2) || available <= 5) {
    status = 'stock_bajo';
  }

  return {
    productId: product.id,
    productName: product.name,
    totalQuantity: product.totalQuantity,
    committedQuantity: peakOccupancy,
    availableQuantity: available,
    status,
  };
}

/**
 * Calculates availability for all products for a given interval.
 */
export function calculateAllProductsAvailability(
  products: Product[],
  startDate: string,
  endDate: string,
  reservations: Reservation[],
  excludeReservationId?: string,
  currentDate: string = getTodayString()
): ProductAvailability[] {
  return products.map(product =>
    calculateProductAvailability(
      product,
      startDate,
      endDate,
      reservations,
      excludeReservationId,
      currentDate
    )
  );
}

export interface FeasibilityIssue {
  productId: string;
  productName: string;
  requested: number;
  available: number;
  shortage: number;
}

export interface FeasibilityResult {
  feasible: boolean;
  issues: FeasibilityIssue[];
}

/**
 * Verifies whether a set of requested items can be fulfilled in [startDate, endDate].
 * Crucial rule: Never allows overselling / negative stock.
 */
export function validateReservationFeasibility(
  requestedItems: { productId: string; quantity: number }[],
  startDate: string,
  endDate: string,
  products: Product[],
  reservations: Reservation[],
  excludeReservationId?: string,
  currentDate: string = getTodayString()
): FeasibilityResult {
  const issues: FeasibilityIssue[] = [];

  for (const item of requestedItems) {
    if (item.quantity <= 0) continue;
    const product = products.find(p => p.id === item.productId);
    if (!product) {
      issues.push({
        productId: item.productId,
        productName: 'Producto desconocido',
        requested: item.quantity,
        available: 0,
        shortage: item.quantity,
      });
      continue;
    }

    const avail = calculateProductAvailability(
      product,
      startDate,
      endDate,
      reservations,
      excludeReservationId,
      currentDate
    );

    if (item.quantity > avail.availableQuantity) {
      issues.push({
        productId: product.id,
        productName: product.name,
        requested: item.quantity,
        available: avail.availableQuantity,
        shortage: item.quantity - avail.availableQuantity,
      });
    }
  }

  return {
    feasible: issues.length === 0,
    issues,
  };
}

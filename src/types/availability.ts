export interface ProductAvailability {
  productId: string;
  productName: string;
  totalQuantity: number;
  committedQuantity: number;
  availableQuantity: number;
  status: 'disponible' | 'stock_bajo' | 'agotado';
}

export interface AvailabilityCheckRequest {
  startDate: string; // YYYY-MM-DD (typically deliveryDate)
  endDate: string;   // YYYY-MM-DD (typically returnDate)
  excludeReservationId?: string; // used when editing an existing reservation
}

export interface DayOccupancy {
  date: string;
  occupied: number;
  available: number;
}

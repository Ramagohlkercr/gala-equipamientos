import { PaymentStatus } from './payment';

export type ReservationStatus = 
  | 'pendiente'    // Solicitud pendiente de confirmación (recibida de catálogo o creada borrador)
  | 'confirmada'   // Confirmada por el administrador (compromete stock)
  | 'en_curso'     // Entregada / en uso (compromete stock)
  | 'finalizada'   // Devolución confirmada (libera stock)
  | 'cancelada';   // Cancelada (no compromete stock)

export interface ReservationItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Reservation {
  id: string;
  code: string; // e.g., "RES-104"
  // Client details
  clientId?: string;
  clientName: string;
  clientPhone: string;
  clientAddress: string;
  clientNotes?: string;
  // Event & rental period
  eventDate: string;      // YYYY-MM-DD
  deliveryDate: string;   // YYYY-MM-DD
  returnDate: string;     // YYYY-MM-DD (fecha prevista de retiro)
  actualReturnDate?: string; // YYYY-MM-DD (fecha efectiva confirmada de devolución)
  deliveryAddress: string;
  // Items
  items: ReservationItem[];
  // Financials
  totalAmount: number;
  depositPaid: number;    // Seña abonada
  pendingBalance: number; // Saldo pendiente
  paymentStatus: PaymentStatus;
  // Status & origin
  status: ReservationStatus;
  source: 'admin' | 'catalogo';
  observations?: string;
  createdAt: string;
  updatedAt: string;
}


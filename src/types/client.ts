export interface Client {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  address: string;
  city: string; // e.g. "Rosario", "Funes", "Roldán"
  notes?: string;
  totalReservations?: number;
  createdAt: string;
}


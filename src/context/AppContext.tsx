import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Product, Reservation, Client, PaymentRecord } from '../types';
import { storageService } from '../services/storageService';
import { productService } from '../services/productService';
import { reservationService, CreateReservationInput } from '../services/reservationService';
import { paymentService } from '../services/paymentService';
import { clientService } from '../services/clientService';
import { getTodayString } from '../utils/dateUtils';

interface AppContextType {
  products: Product[];
  reservations: Reservation[];
  clients: Client[];
  payments: PaymentRecord[];
  
  // Dashboard & global metrics
  stats: {
    confirmedReservations: number;
    pendingRequests: number;
    activeProductsCount: number;
    upcomingDeliveriesCount: number;
    upcomingReturnsCount: number;
    totalPendingBalance: number;
  };

  // Actions
  refreshData: () => void;
  resetDemo: () => void;

  // Products
  createProduct: (data: Omit<Product, 'id'>) => Product;
  updateProduct: (id: string, updates: Partial<Omit<Product, 'id'>>) => Product | null;
  deleteProduct: (id: string) => { success: boolean; error?: string };
  toggleProductActive: (id: string) => void;

  // Reservations
  createReservation: (input: CreateReservationInput) => {
    success: boolean;
    reservation?: Reservation;
    error?: string;
    issues?: any[];
  };
  updateReservation: (id: string, updates: Partial<Reservation>) => {
    success: boolean;
    reservation?: Reservation;
    error?: string;
    issues?: any[];
  };
  confirmPendingRequest: (id: string) => { success: boolean; error?: string; issues?: any[] };
  cancelOrRejectReservation: (id: string, reason?: string) => { success: boolean };
  confirmReturn: (id: string, returnDate?: string) => { success: boolean };

  // Payments
  recordPayment: (params: {
    reservationId: string;
    amount: number;
    method: 'transferencia' | 'efectivo' | 'otro';
    date?: string;
    notes?: string;
    receiptName?: string;
  }) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);

  const refreshData = useCallback(() => {
    storageService.initializeDemoData();
    setProducts(productService.getAll());
    setReservations(reservationService.getAll());
    setClients(clientService.getAll());
    setPayments(paymentService.getAll());
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const resetDemo = useCallback(() => {
    storageService.resetDemoData();
    refreshData();
  }, [refreshData]);

  // Product actions
  const createProduct = (data: Omit<Product, 'id'>) => {
    const res = productService.create(data);
    refreshData();
    return res;
  };

  const updateProduct = (id: string, updates: Partial<Omit<Product, 'id'>>) => {
    const res = productService.update(id, updates);
    refreshData();
    return res;
  };

  const deleteProduct = (id: string) => {
    const res = productService.delete(id);
    if (res.success) refreshData();
    return res;
  };

  const toggleProductActive = (id: string) => {
    productService.toggleActive(id);
    refreshData();
  };

  // Reservation actions
  const createReservation = (input: CreateReservationInput) => {
    const res = reservationService.create(input);
    if (res.success) refreshData();
    return res;
  };

  const updateReservation = (id: string, updates: Partial<Reservation>) => {
    const res = reservationService.update(id, updates);
    if (res.success) refreshData();
    return res;
  };

  const confirmPendingRequest = (id: string) => {
    const res = reservationService.confirmPendingRequest(id);
    if (res.success) refreshData();
    return res;
  };

  const cancelOrRejectReservation = (id: string, reason?: string) => {
    const res = reservationService.cancelOrReject(id, reason);
    if (res.success) refreshData();
    return res;
  };

  const confirmReturn = (id: string, returnDate?: string) => {
    const res = reservationService.confirmReturn(id, returnDate);
    if (res.success) refreshData();
    return res;
  };

  // Payment actions
  const recordPayment = (params: {
    reservationId: string;
    amount: number;
    method: 'transferencia' | 'efectivo' | 'otro';
    date?: string;
    notes?: string;
    receiptName?: string;
  }) => {
    paymentService.recordPayment(params);
    refreshData();
  };

  // Calculate live stats
  const today = getTodayString();
  const confirmedReservations = reservations.filter(
    r => r.status === 'confirmada' || r.status === 'en_curso'
  ).length;

  const pendingRequests = reservations.filter(r => r.status === 'pendiente').length;

  const activeProductsCount = products.filter(p => p.active).length;

  // Upcoming deliveries: within next 7 days or today
  const upcomingDeliveriesCount = reservations.filter(r => {
    if (r.status !== 'confirmada') return false;
    return r.deliveryDate >= today;
  }).length;

  // Upcoming returns or pending returns
  const upcomingReturnsCount = reservations.filter(r => {
    if (r.status !== 'en_curso' && r.status !== 'confirmada') return false;
    return r.returnDate >= today;
  }).length;

  // Total pending balance across all active reservations
  const totalPendingBalance = reservations
    .filter(r => r.status !== 'cancelada')
    .reduce((sum, r) => sum + (r.pendingBalance || 0), 0);

  return (
    <AppContext.Provider
      value={{
        products,
        reservations,
        clients,
        payments,
        stats: {
          confirmedReservations,
          pendingRequests,
          activeProductsCount,
          upcomingDeliveriesCount,
          upcomingReturnsCount,
          totalPendingBalance,
        },
        refreshData,
        resetDemo,
        createProduct,
        updateProduct,
        deleteProduct,
        toggleProductActive,
        createReservation,
        updateReservation,
        confirmPendingRequest,
        cancelOrRejectReservation,
        confirmReturn,
        recordPayment,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};


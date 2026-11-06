import { Product, Client, Reservation, PaymentRecord } from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_CLIENTS,
  INITIAL_RESERVATIONS,
  INITIAL_PAYMENTS,
} from '../data/mockData';

const STORAGE_KEYS = {
  PRODUCTS: 'gala_demo_products_v1',
  CLIENTS: 'gala_demo_clients_v1',
  RESERVATIONS: 'gala_demo_reservations_v1',
  PAYMENTS: 'gala_demo_payments_v1',
  DEMO_INITIALIZED: 'gala_demo_initialized_v1',
};

class StorageService {
  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  }

  public initializeDemoData(force: boolean = false): void {
    if (!this.isBrowser()) return;

    const isInitialized = localStorage.getItem(STORAGE_KEYS.DEMO_INITIALIZED);
    if (!isInitialized || force) {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
      localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(INITIAL_CLIENTS));
      localStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(INITIAL_RESERVATIONS));
      localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(INITIAL_PAYMENTS));
      localStorage.setItem(STORAGE_KEYS.DEMO_INITIALIZED, 'true');
    }
  }

  public resetDemoData(): void {
    this.initializeDemoData(true);
  }

  // --- Products ---
  public getProducts(): Product[] {
    if (!this.isBrowser()) return INITIAL_PRODUCTS;
    const raw = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    if (!raw) {
      this.initializeDemoData();
      return INITIAL_PRODUCTS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_PRODUCTS;
    }
  }

  public saveProducts(products: Product[]): void {
    if (!this.isBrowser()) return;
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  }

  // --- Clients ---
  public getClients(): Client[] {
    if (!this.isBrowser()) return INITIAL_CLIENTS;
    const raw = localStorage.getItem(STORAGE_KEYS.CLIENTS);
    if (!raw) {
      this.initializeDemoData();
      return INITIAL_CLIENTS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_CLIENTS;
    }
  }

  public saveClients(clients: Client[]): void {
    if (!this.isBrowser()) return;
    localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(clients));
  }

  // --- Reservations ---
  public getReservations(): Reservation[] {
    if (!this.isBrowser()) return INITIAL_RESERVATIONS;
    const raw = localStorage.getItem(STORAGE_KEYS.RESERVATIONS);
    if (!raw) {
      this.initializeDemoData();
      return INITIAL_RESERVATIONS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_RESERVATIONS;
    }
  }

  public saveReservations(reservations: Reservation[]): void {
    if (!this.isBrowser()) return;
    localStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(reservations));
  }

  // --- Payments ---
  public getPayments(): PaymentRecord[] {
    if (!this.isBrowser()) return INITIAL_PAYMENTS;
    const raw = localStorage.getItem(STORAGE_KEYS.PAYMENTS);
    if (!raw) {
      this.initializeDemoData();
      return INITIAL_PAYMENTS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_PAYMENTS;
    }
  }

  public savePayments(payments: PaymentRecord[]): void {
    if (!this.isBrowser()) return;
    localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(payments));
  }
}

export const storageService = new StorageService();

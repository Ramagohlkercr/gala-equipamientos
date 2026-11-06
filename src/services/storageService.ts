import { Product, Client, Reservation, PaymentRecord } from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_CLIENTS,
  INITIAL_RESERVATIONS,
  INITIAL_PAYMENTS,
} from '../data/mockData';
import { PRODUCT_IMAGE_MAP, getProductImageUrl } from '../utils/productImages';

const STORAGE_KEYS = {
  PRODUCTS: 'gala_demo_products_v2', // v2 to ensure clean update of product photos
  LEGACY_PRODUCTS: 'gala_demo_products_v1',
  CLIENTS: 'gala_demo_clients_v1',
  RESERVATIONS: 'gala_demo_reservations_v1',
  PAYMENTS: 'gala_demo_payments_v1',
  DEMO_INITIALIZED: 'gala_demo_initialized_v2',
};

class StorageService {
  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  }

  /**
   * Migrate product images safely:
   * Replaces legacy/mismatched Unsplash links with verified local assets
   * without wiping user modifications, reservations, clients, or payments.
   */
  public sanitizeAndMigrateProductImages(products: Product[]): { products: Product[]; migrated: boolean } {
    let migrated = false;

    const updated = products.map(product => {
      // 1. If it matches a standard demo product ID, ensure the verified image path
      if (product.id && PRODUCT_IMAGE_MAP[product.id]) {
        const correctImg = PRODUCT_IMAGE_MAP[product.id];
        if (product.imageUrl !== correctImg) {
          migrated = true;
          return { ...product, imageUrl: correctImg };
        }
        return product;
      }

      // 2. If it has an external/broken/unsplash image, migrate to resolved local image
      if (product.imageUrl && (product.imageUrl.includes('unsplash.com') || !product.imageUrl.startsWith('/images/products/'))) {
        const resolved = getProductImageUrl(product);
        if (resolved !== product.imageUrl) {
          migrated = true;
          return { ...product, imageUrl: resolved };
        }
      }

      return product;
    });

    return { products: updated, migrated };
  }

  public initializeDemoData(force: boolean = false): void {
    if (!this.isBrowser()) return;

    if (force) {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
      localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(INITIAL_CLIENTS));
      localStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(INITIAL_RESERVATIONS));
      localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(INITIAL_PAYMENTS));
      localStorage.setItem(STORAGE_KEYS.DEMO_INITIALIZED, 'true');
      return;
    }

    // Non-destructive initialization:
    // Only set default tables if they don't already exist in localStorage
    const existingClients = localStorage.getItem(STORAGE_KEYS.CLIENTS);
    if (!existingClients) {
      localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(INITIAL_CLIENTS));
    }

    const existingReservations = localStorage.getItem(STORAGE_KEYS.RESERVATIONS);
    if (!existingReservations) {
      localStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(INITIAL_RESERVATIONS));
    }

    const existingPayments = localStorage.getItem(STORAGE_KEYS.PAYMENTS);
    if (!existingPayments) {
      localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(INITIAL_PAYMENTS));
    }

    // Safe product migration without losing user-added products:
    let productsToStore = INITIAL_PRODUCTS;
    const v2Products = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    const v1Products = localStorage.getItem(STORAGE_KEYS.LEGACY_PRODUCTS);

    if (v2Products) {
      try {
        const parsed = JSON.parse(v2Products);
        const { products } = this.sanitizeAndMigrateProductImages(parsed);
        productsToStore = products;
      } catch {
        productsToStore = INITIAL_PRODUCTS;
      }
    } else if (v1Products) {
      try {
        const parsed = JSON.parse(v1Products);
        const { products } = this.sanitizeAndMigrateProductImages(parsed);
        productsToStore = products;
      } catch {
        productsToStore = INITIAL_PRODUCTS;
      }
    }

    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(productsToStore));
    localStorage.setItem(STORAGE_KEYS.DEMO_INITIALIZED, 'true');
  }

  public resetDemoData(): void {
    this.initializeDemoData(true);
  }

  // --- Products ---
  public getProducts(): Product[] {
    if (!this.isBrowser()) return INITIAL_PRODUCTS;

    let raw = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    if (!raw) {
      raw = localStorage.getItem(STORAGE_KEYS.LEGACY_PRODUCTS);
    }

    if (!raw) {
      this.initializeDemoData();
      return INITIAL_PRODUCTS;
    }

    try {
      const parsed: Product[] = JSON.parse(raw);
      const { products, migrated } = this.sanitizeAndMigrateProductImages(parsed);
      if (migrated || !localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
        this.saveProducts(products);
      }
      return products;
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



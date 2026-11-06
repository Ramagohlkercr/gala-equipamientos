import { Product } from '../types';
import { storageService } from './storageService';

export const productService = {
  getAll(): Product[] {
    return storageService.getProducts();
  },

  getById(id: string): Product | undefined {
    return storageService.getProducts().find(p => p.id === id);
  },

  create(data: Omit<Product, 'id'>): Product {
    const products = storageService.getProducts();
    const newProduct: Product = {
      ...data,
      id: `prod-${Date.now()}`,
    };
    products.unshift(newProduct);
    storageService.saveProducts(products);
    return newProduct;
  },

  update(id: string, updates: Partial<Omit<Product, 'id'>>): Product | null {
    const products = storageService.getProducts();
    const index = products.findIndex(p => p.id === id);
    if (index === -1) return null;

    const updated: Product = {
      ...products[index],
      ...updates,
    };
    products[index] = updated;
    storageService.saveProducts(products);
    return updated;
  },

  delete(id: string): { success: boolean; error?: string } {
    const reservations = storageService.getReservations();
    // Check if committed in any active or pending reservation
    const hasActiveBooking = reservations.some(
      r => r.status !== 'cancelada' && r.status !== 'finalizada' && r.items.some(i => i.productId === id)
    );

    if (hasActiveBooking) {
      return {
        success: false,
        error: 'No se puede eliminar este producto porque está comprometido en reservas activas o pendientes.',
      };
    }

    const products = storageService.getProducts().filter(p => p.id !== id);
    storageService.saveProducts(products);
    return { success: true };
  },

  toggleActive(id: string): Product | null {
    const product = this.getById(id);
    if (!product) return null;
    return this.update(id, { active: !product.active });
  },
};

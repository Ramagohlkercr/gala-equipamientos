import { Client } from '../types';
import { storageService } from './storageService';
import { getTodayString } from '../utils/dateUtils';

export const clientService = {
  getAll(): Client[] {
    return storageService.getClients();
  },

  getById(id: string): Client | undefined {
    return storageService.getClients().find(c => c.id === id);
  },

  findOrCreateByPhone(
    fullName: string,
    phone: string,
    address: string = '',
    city: string = 'Rosario',
    notes?: string
  ): Client {
    const clients = storageService.getClients();
    const cleanPhone = phone.replace(/\D/g, '');
    const existing = clients.find(c => c.phone.replace(/\D/g, '') === cleanPhone);

    if (existing) {
      // Update name/address if changed
      let changed = false;
      if (fullName && fullName !== existing.fullName) {
        existing.fullName = fullName;
        changed = true;
      }
      if (address && !existing.address) {
        existing.address = address;
        changed = true;
      }
      if (changed) {
        storageService.saveClients(clients);
      }
      return existing;
    }

    const newClient: Client = {
      id: `cli-${Date.now()}`,
      fullName,
      phone,
      address,
      city,
      notes,
      totalReservations: 1,
      createdAt: getTodayString(),
    };

    clients.unshift(newClient);
    storageService.saveClients(clients);
    return newClient;
  },

  update(id: string, updates: Partial<Client>): Client | null {
    const clients = storageService.getClients();
    const index = clients.findIndex(c => c.id === id);
    if (index === -1) return null;

    const updated: Client = {
      ...clients[index],
      ...updates,
    };
    clients[index] = updated;
    storageService.saveClients(clients);
    return updated;
  },
};


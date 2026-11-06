import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AdminLayout } from './components/layout/AdminLayout';
import { CatalogLayout } from './components/layout/CatalogLayout';

// Admin Pages
import { DashboardPage } from './pages/admin/DashboardPage';
import { InventoryPage } from './pages/admin/InventoryPage';
import { ReservationsListPage } from './pages/admin/ReservationsListPage';
import { CreateReservationPage } from './pages/admin/CreateReservationPage';
import { CalendarPage } from './pages/admin/CalendarPage';
import { ClientsPage } from './pages/admin/ClientsPage';
import { PaymentsPage } from './pages/admin/PaymentsPage';

// Catalog Pages
import { ClientCatalogPage } from './pages/catalog/ClientCatalogPage';
import { ClientOrderPage } from './pages/catalog/ClientOrderPage';
import { ClientConfirmationPage } from './pages/catalog/ClientConfirmationPage';

// Welcome & Demo Guide Page
import { DemoWelcomePage } from './pages/DemoWelcomePage';

export const App: React.FC = () => {
  return (
    <Routes>
      {/* Welcome / Demo Overview */}
      <Route path="/" element={<Navigate to="/demo" replace />} />
      <Route path="/demo" element={<DemoWelcomePage />} />

      {/* Admin Panel */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="inventario" element={<InventoryPage />} />
        <Route path="reservas" element={<ReservationsListPage />} />
        <Route path="reservas/nueva" element={<CreateReservationPage />} />
        <Route path="calendario" element={<CalendarPage />} />
        <Route path="clientes" element={<ClientsPage />} />
        <Route path="pagos" element={<PaymentsPage />} />
      </Route>

      {/* Client Catalog */}
      <Route path="/catalogo" element={<CatalogLayout />}>
        <Route index element={<ClientCatalogPage />} />
        <Route path="pedido" element={<ClientOrderPage />} />
        <Route path="confirmacion" element={<ClientConfirmationPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/demo" replace />} />
    </Routes>
  );
};

import React from 'react';
import { ReservationStatus } from '../../types';
import { Badge, BadgeVariant } from '../common/Badge';

interface ReservationStatusBadgeProps {
  status: ReservationStatus;
  size?: 'sm' | 'md';
}

export const ReservationStatusBadge: React.FC<ReservationStatusBadgeProps> = ({
  status,
  size = 'md',
}) => {
  const config: Record<ReservationStatus, { label: string; variant: BadgeVariant }> = {
    pendiente: { label: 'Solicitud pendiente', variant: 'warning' },
    confirmada: { label: 'Confirmada', variant: 'success' },
    en_curso: { label: 'En curso / Entregado', variant: 'accent' },
    finalizada: { label: 'Finalizada / Devuelto', variant: 'neutral' },
    cancelada: { label: 'Cancelada', variant: 'danger' },
  };

  const item = config[status] || { label: status, variant: 'default' };

  return (
    <Badge variant={item.variant} size={size} dot>
      {item.label}
    </Badge>
  );
};

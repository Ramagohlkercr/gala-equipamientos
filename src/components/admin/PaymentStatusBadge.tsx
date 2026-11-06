import React from 'react';
import { PaymentStatus } from '../../types';
import { Badge, BadgeVariant } from '../common/Badge';

interface PaymentStatusBadgeProps {
  status: PaymentStatus;
  size?: 'sm' | 'md';
}

export const PaymentStatusBadge: React.FC<PaymentStatusBadgeProps> = ({
  status,
  size = 'md',
}) => {
  const config: Record<PaymentStatus, { label: string; variant: BadgeVariant }> = {
    sin_seña: { label: 'Sin seña', variant: 'danger' },
    pago_parcial: { label: 'Pago parcial / Seña', variant: 'warning' },
    pagado: { label: 'Pagado 100%', variant: 'success' },
  };

  const item = config[status] || { label: status, variant: 'default' };

  return (
    <Badge variant={item.variant} size={size}>
      {item.label}
    </Badge>
  );
};


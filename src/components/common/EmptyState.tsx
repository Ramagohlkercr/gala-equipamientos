import React from 'react';
import { Button } from './Button';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  actionIcon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionText,
  onAction,
  actionIcon,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-gala-border bg-gala-surface/60">
      <div className="w-14 h-14 rounded-2xl bg-gala-bg border border-gala-border flex items-center justify-center text-gala-gray mb-4 shadow-subtle">
        {icon}
      </div>
      <h4 className="font-serif text-lg font-semibold text-gala-black mb-1">{title}</h4>
      <p className="text-xs text-gala-gray max-w-sm mb-6 leading-relaxed">{description}</p>
      {actionText && onAction && (
        <Button variant="primary" size="sm" onClick={onAction} icon={actionIcon}>
          {actionText}
        </Button>
      )}
    </div>
  );
};

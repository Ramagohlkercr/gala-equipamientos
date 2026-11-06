import React from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  badge?: {
    text: string;
    variant?: 'success' | 'warning' | 'danger' | 'neutral' | 'accent';
  };
  onClick?: () => void;
  highlight?: boolean;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  badge,
  onClick,
  highlight = false,
}) => {
  return (
    <div
      onClick={onClick}
      className={`relative p-5 rounded-xl border transition-all duration-200 ${
        highlight
          ? 'bg-gradient-to-br from-[#FBF8F3] to-[#F5ECE2] border-gala-accent/70 shadow-subtle'
          : 'bg-gala-surface border-gala-border hover:border-gala-border-dark shadow-subtle'
      } ${onClick ? 'cursor-pointer hover:-translate-y-0.5' : ''}`}
    >
      <div className="flex items-start justify-between">
        <p className="text-xs font-medium text-gala-gray uppercase tracking-wider">{title}</p>
        <div className="p-2.5 rounded-lg bg-gala-bg text-gala-black border border-gala-border/60">
          {icon}
        </div>
      </div>

      <div className="mt-3">
        <div className="flex items-baseline gap-2">
          <span className="font-serif text-3xl font-semibold text-gala-black tracking-tight">
            {value}
          </span>
          {badge && (
            <span
              className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                badge.variant === 'warning'
                  ? 'bg-amber-100 text-amber-800'
                  : badge.variant === 'danger'
                  ? 'bg-red-100 text-red-800'
                  : badge.variant === 'success'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-stone-200 text-stone-700'
              }`}
            >
              {badge.text}
            </span>
          )}
        </div>
        {subtitle && <p className="text-xs text-gala-gray mt-1.5">{subtitle}</p>}
      </div>
    </div>
  );
};


import React from 'react';

export type BadgeVariant = 
  | 'default'
  | 'success'
  | 'warning'
  | 'danger'
  | 'neutral'
  | 'accent';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  className?: string;
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  dot = false,
}) => {
  const variantStyles: Record<BadgeVariant, { bg: string; text: string; border: string; dotColor: string }> = {
    default: {
      bg: 'bg-gala-surface',
      text: 'text-gala-black',
      border: 'border-gala-border',
      dotColor: 'bg-gala-gray',
    },
    success: {
      bg: 'bg-[#EBF2EC]',
      text: 'text-[#3E5C43]',
      border: 'border-[#CADCCF]',
      dotColor: 'bg-[#648A6B]',
    },
    warning: {
      bg: 'bg-[#FAF3EA]',
      text: 'text-[#8C6430]',
      border: 'border-[#ECDCC6]',
      dotColor: 'bg-[#D29B4D]',
    },
    danger: {
      bg: 'bg-[#F9ECEB]',
      text: 'text-[#8E433C]',
      border: 'border-[#E9C7C4]',
      dotColor: 'bg-[#B65D54]',
    },
    neutral: {
      bg: 'bg-stone-100',
      text: 'text-gala-gray',
      border: 'border-stone-200',
      dotColor: 'bg-gala-gray',
    },
    accent: {
      bg: 'bg-[#F5ECE2]',
      text: 'text-[#7D5B38]',
      border: 'border-[#DFC8B0]',
      dotColor: 'bg-[#B89C7A]',
    },
  };

  const current = variantStyles[variant];
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${current.bg} ${current.text} ${current.border} ${sizeClasses} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${current.dotColor}`} />}
      {children}
    </span>
  );
};

import React from 'react';

interface GalaLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'dark' | 'light';
  showSubtitle?: boolean;
}

export const GalaLogo: React.FC<GalaLogoProps> = ({
  className = '',
  size = 'md',
  variant = 'dark',
  showSubtitle = true,
}) => {
  const isDark = variant === 'dark';

  const sizeClasses = {
    sm: {
      emblem: 'w-7 h-7 text-xs',
      title: 'text-lg tracking-[0.2em]',
      sub: 'text-[7.5px] tracking-[0.35em]',
    },
    md: {
      emblem: 'w-9 h-9 text-sm',
      title: 'text-2xl tracking-[0.22em]',
      sub: 'text-[9px] tracking-[0.4em]',
    },
    lg: {
      emblem: 'w-12 h-12 text-base',
      title: 'text-3xl tracking-[0.25em]',
      sub: 'text-[10px] tracking-[0.45em]',
    },
  }[size];

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Subtle decorative emblem */}
      <div
        className={`${sizeClasses.emblem} rounded-full flex items-center justify-center border border-gala-border/80 shadow-subtle flex-shrink-0 transition-transform duration-300 hover:rotate-45 ${
          isDark ? 'bg-gala-surface text-gala-black' : 'bg-gala-black/10 text-gala-white'
        }`}
      >
        <span className="font-serif font-bold text-gala-accent-dark">✦</span>
      </div>

      <div className="flex flex-col">
        <span
          className={`font-serif font-semibold leading-none ${sizeClasses.title} ${
            isDark ? 'text-gala-black' : 'text-gala-white'
          }`}
        >
          GALA
        </span>
        {showSubtitle && (
          <span
            className={`font-sans font-medium uppercase mt-1 leading-none ${sizeClasses.sub} ${
              isDark ? 'text-gala-gray' : 'text-gala-surface/80'
            }`}
          >
            EQUIPAMIENTOS
          </span>
        )}
      </div>
    </div>
  );
};


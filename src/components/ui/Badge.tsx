import React from 'react';
import { cn } from '@/lib/utils';

export type BadgeVariant = 'blue' | 'cyan' | 'green' | 'amber' | 'red' | 'gray';
export type BadgeSize = 'sm' | 'md';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  children: React.ReactNode;
}

const variantClasses: Record<BadgeVariant, string> = {
  blue: 'bg-[#E8E8FF] text-[#0000EE] border border-[#C7C7FF]',
  cyan: 'bg-[#E0F6FF] text-[#0077AA] border border-[#B3E9FF]',
  green: 'bg-[#D1FAE5] text-[#065F46] border border-[#A7F3D0]',
  amber: 'bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]',
  red: 'bg-[#FEE2E2] text-[#991B1B] border border-[#FECACA]',
  gray: 'bg-[#F3F4F6] text-[#374151] border border-[#E5E7EB]',
};

const dotColors: Record<BadgeVariant, string> = {
  blue: 'bg-[#0000EE]',
  cyan: 'bg-[#00B3FF]',
  green: 'bg-[#10B981]',
  amber: 'bg-[#F59E0B]',
  red: 'bg-[#EF4444]',
  gray: 'bg-[#6B7280]',
};

const sizeClasses: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-xs rounded-full gap-1',
  md: 'px-2.5 py-1 text-xs rounded-full gap-1.5',
};

export function Badge({
  variant = 'gray',
  size = 'md',
  dot = false,
  children,
  className,
  ...props
}: BadgeProps) {
  return (
    <span
      {...props}
      className={cn(
        'inline-flex items-center font-semibold leading-none whitespace-nowrap',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      {dot && (
        <span
          className={cn('w-1.5 h-1.5 rounded-full shrink-0', dotColors[variant])}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
}

export default Badge;

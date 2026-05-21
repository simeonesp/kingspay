'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'warm';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: [
    'bg-[#0000EE] text-white border-transparent',
    'hover:bg-[#0000CC] active:bg-[#0000AA]',
    'focus-visible:ring-[#0000EE]/40',
    'disabled:bg-[#9999FF] disabled:cursor-not-allowed',
    'shadow-sm hover:shadow-md',
  ].join(' '),
  secondary: [
    'bg-white text-[#0000EE] border border-[#0000EE]',
    'hover:bg-[#E8E8FF] active:bg-[#D0D0FF]',
    'focus-visible:ring-[#0000EE]/40',
    'disabled:text-[#9999FF] disabled:border-[#9999FF] disabled:cursor-not-allowed',
  ].join(' '),
  ghost: [
    'bg-transparent text-[#374151] border-transparent',
    'hover:bg-[#F3F4F6] active:bg-[#E5E7EB]',
    'focus-visible:ring-gray-300',
    'disabled:text-[#9CA3AF] disabled:cursor-not-allowed',
  ].join(' '),
  danger: [
    'bg-[#EF4444] text-white border-transparent',
    'hover:bg-[#DC2626] active:bg-[#B91C1C]',
    'focus-visible:ring-[#EF4444]/40',
    'disabled:bg-[#FCA5A5] disabled:cursor-not-allowed',
    'shadow-sm',
  ].join(' '),
  warm: [
    'bg-[#FF6B35] text-white border-transparent',
    'hover:bg-[#E55A22] active:bg-[#CC4A12]',
    'focus-visible:ring-[#FF6B35]/40',
    'disabled:bg-[#FFAB8A] disabled:cursor-not-allowed',
    'shadow-sm hover:shadow-md',
  ].join(' '),
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm rounded-[8px] gap-1.5',
  md: 'px-5 py-2.5 text-sm rounded-[12px] gap-2',
  lg: 'px-7 py-3.5 text-base rounded-[14px] gap-2.5',
};

function Spinner({ size }: { size: ButtonSize }) {
  const spinnerSize = size === 'sm' ? 'w-3.5 h-3.5' : size === 'md' ? 'w-4 h-4' : 'w-5 h-5';
  return (
    <svg
      className={cn('animate-spin', spinnerSize)}
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      {...props}
      disabled={isDisabled}
      className={cn(
        'inline-flex items-center justify-center font-semibold',
        'transition-all duration-150 ease-out',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1',
        'select-none',
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && 'w-full',
        isDisabled && 'pointer-events-none',
        className
      )}
      aria-busy={loading}
    >
      {loading ? (
        <Spinner size={size} />
      ) : (
        leftIcon && <span className="shrink-0">{leftIcon}</span>
      )}
      <span className={cn(loading && 'opacity-70')}>{children}</span>
      {!loading && rightIcon && (
        <span className="shrink-0">{rightIcon}</span>
      )}
    </button>
  );
}

export default Button;

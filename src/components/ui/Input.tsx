'use client';

import React, { useState, useId } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'id'> {
  label?: string;
  error?: string;
  helperText?: string;
  iconLeft?: React.ReactNode;
  showPasswordToggle?: boolean;
  inputId?: string;
}

export function Input({
  label,
  error,
  helperText,
  iconLeft,
  showPasswordToggle = false,
  inputId,
  className,
  type,
  ...props
}: InputProps) {
  const autoId = useId();
  const id = inputId ?? autoId;
  const helpId = `${id}-help`;
  const errorId = `${id}-error`;

  const [showPassword, setShowPassword] = useState(false);

  const inputType =
    showPasswordToggle && type === 'password'
      ? showPassword
        ? 'text'
        : 'password'
      : type;

  const hasError = Boolean(error);
  const hasHelper = Boolean(helperText) && !hasError;
  const describedBy = hasError ? errorId : hasHelper ? helpId : undefined;

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label
          htmlFor={id}
          className="text-sm font-semibold text-[#111827] leading-none"
        >
          {label}
        </label>
      )}

      <div className="relative">
        {iconLeft && (
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B7280] pointer-events-none">
            {iconLeft}
          </span>
        )}

        <input
          {...props}
          id={id}
          type={inputType}
          aria-describedby={describedBy}
          aria-invalid={hasError}
          className={cn(
            'w-full rounded-[12px] border bg-white text-[#111827] placeholder:text-[#9CA3AF]',
            'text-sm leading-none py-3 pr-4 transition-all duration-150',
            'focus:outline-none focus:ring-2 focus:ring-offset-0',
            iconLeft ? 'pl-10' : 'pl-4',
            showPasswordToggle ? 'pr-11' : '',
            hasError
              ? 'border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]/20'
              : 'border-[#E5E7EB] focus:border-[#0000EE] focus:ring-[#0000EE]/15',
            'disabled:bg-[#F9FAFB] disabled:text-[#9CA3AF] disabled:cursor-not-allowed',
            className
          )}
        />

        {showPasswordToggle && type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#374151] transition-colors focus:outline-none"
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff size={16} aria-hidden="true" />
            ) : (
              <Eye size={16} aria-hidden="true" />
            )}
          </button>
        )}
      </div>

      {hasError && (
        <p id={errorId} role="alert" className="text-xs text-[#EF4444] leading-tight">
          {error}
        </p>
      )}

      {hasHelper && (
        <p id={helpId} className="text-xs text-[#6B7280] leading-tight">
          {helperText}
        </p>
      )}
    </div>
  );
}

export default Input;

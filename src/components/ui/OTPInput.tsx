'use client';

import React, { useRef, useCallback, useEffect } from 'react';
import { cn } from '@/lib/utils';

export interface OTPInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  onComplete?: (value: string) => void;
  disabled?: boolean;
  autoFocus?: boolean;
  error?: boolean;
  className?: string;
}

export function OTPInput({
  length = 6,
  value,
  onChange,
  onComplete,
  disabled = false,
  autoFocus = false,
  error = false,
  className,
}: OTPInputProps) {
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const digits = Array.from({ length }, (_, i) => value[i] ?? '');

  const focusIndex = (index: number) => {
    const clamped = Math.max(0, Math.min(index, length - 1));
    inputRefs.current[clamped]?.focus();
  };

  const handleChange = useCallback(
    (index: number, raw: string) => {
      const digit = raw.replace(/\D/g, '').slice(-1);
      const newDigits = [...digits];
      newDigits[index] = digit;
      const newValue = newDigits.join('');
      onChange(newValue);
      if (digit && index < length - 1) {
        focusIndex(index + 1);
      }
      if (newValue.length === length && !newValue.includes('')) {
        onComplete?.(newValue);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [digits, length, onChange, onComplete]
  );

  const handleKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Backspace') {
        e.preventDefault();
        if (digits[index]) {
          const newDigits = [...digits];
          newDigits[index] = '';
          onChange(newDigits.join(''));
        } else if (index > 0) {
          const newDigits = [...digits];
          newDigits[index - 1] = '';
          onChange(newDigits.join(''));
          focusIndex(index - 1);
        }
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        focusIndex(index - 1);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        focusIndex(index + 1);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [digits, onChange]
  );

  const handlePaste = useCallback(
    (e: React.ClipboardEvent) => {
      e.preventDefault();
      const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
      if (!pasted) return;
      onChange(pasted.padEnd(length, '').slice(0, length));
      const nextFocus = Math.min(pasted.length, length - 1);
      focusIndex(nextFocus);
      if (pasted.length === length) {
        onComplete?.(pasted);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [length, onChange, onComplete]
  );

  useEffect(() => {
    if (autoFocus) {
      inputRefs.current[0]?.focus();
    }
  }, [autoFocus]);

  return (
    <div
      className={cn('flex items-center gap-2 sm:gap-3', className)}
      role="group"
      aria-label={`${length}-digit verification code`}
    >
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(el) => { inputRefs.current[index] = el; }}
          type="text"
          inputMode="numeric"
          autoComplete={index === 0 ? 'one-time-code' : 'off'}
          maxLength={1}
          value={digit}
          disabled={disabled}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          onFocus={(e) => e.target.select()}
          aria-label={`Digit ${index + 1} of ${length}`}
          className={cn(
            'w-11 h-14 sm:w-12 sm:h-14 rounded-[12px] border-2 bg-white',
            'text-center text-xl font-bold text-[#111827]',
            'transition-all duration-150',
            'focus:outline-none focus:ring-2 focus:ring-offset-0',
            error
              ? 'border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]/20'
              : digit
              ? 'border-[#0000EE] focus:border-[#0000EE] focus:ring-[#0000EE]/15'
              : 'border-[#E5E7EB] focus:border-[#0000EE] focus:ring-[#0000EE]/15',
            disabled && 'opacity-50 cursor-not-allowed bg-[#F9FAFB]',
            'caret-transparent'
          )}
        />
      ))}
    </div>
  );
}

export default OTPInput;

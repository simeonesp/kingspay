import React from 'react';
import { cn } from '@/lib/utils';

type CardPadding = 'none' | 'sm' | 'md' | 'lg' | 'xl';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: CardPadding;
  hover?: boolean;
  bordered?: boolean;
  elevated?: boolean;
  children: React.ReactNode;
}

const paddingClasses: Record<CardPadding, string> = {
  none: '',
  sm: 'p-4',
  md: 'p-5 sm:p-6',
  lg: 'p-6 sm:p-8',
  xl: 'p-8 sm:p-10',
};

export function Card({
  padding = 'md',
  hover = false,
  bordered = true,
  elevated = false,
  children,
  className,
  ...props
}: CardProps) {
  return (
    <div
      {...props}
      className={cn(
        'bg-white rounded-2xl',
        bordered && 'border border-[#E5E7EB]',
        elevated
          ? 'shadow-[0_8px_32px_rgba(0,0,238,0.1),0_4px_16px_rgba(0,0,0,0.06)]'
          : 'shadow-[0_2px_12px_rgba(0,0,0,0.06)]',
        hover && [
          'transition-transform duration-200 ease-out',
          'hover:-translate-y-0.5',
          'hover:shadow-[0_8px_32px_rgba(0,0,238,0.1),0_4px_16px_rgba(0,0,0,0.06)]',
        ],
        paddingClasses[padding],
        className
      )}
    >
      {children}
    </div>
  );
}

// Card sub-components for structured layouts
interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function CardHeader({ children, className, ...props }: CardHeaderProps) {
  return (
    <div
      {...props}
      className={cn('flex items-start justify-between gap-4 mb-4', className)}
    >
      {children}
    </div>
  );
}

export function CardTitle({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement> & { children: React.ReactNode }) {
  return (
    <h3
      {...props}
      className={cn('text-lg font-bold text-[#111827] leading-tight', className)}
    >
      {children}
    </h3>
  );
}

export function CardDescription({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement> & { children: React.ReactNode }) {
  return (
    <p
      {...props}
      className={cn('text-sm text-[#6B7280] leading-relaxed', className)}
    >
      {children}
    </p>
  );
}

export function CardContent({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { children: React.ReactNode }) {
  return (
    <div {...props} className={cn('', className)}>
      {children}
    </div>
  );
}

export function CardFooter({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { children: React.ReactNode }) {
  return (
    <div
      {...props}
      className={cn('flex items-center gap-3 mt-4 pt-4 border-t border-[#E5E7EB]', className)}
    >
      {children}
    </div>
  );
}

export default Card;

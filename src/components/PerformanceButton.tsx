import React, { forwardRef, useCallback, useMemo } from 'react';
import { cn } from '../utils/cn';

interface PerformanceButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  'aria-label'?: string;
  'aria-describedby'?: string;
}

const PerformanceButton = forwardRef<HTMLButtonElement, PerformanceButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      children,
      className,
      disabled,
      type = 'button',
      'aria-label': ariaLabel,
      'aria-describedby': ariaDescribedBy,
      onClick,
      ...props
    },
    ref
  ) => {
    // Memoize styles to prevent unnecessary recalculations
    const buttonStyles = useMemo(() => {
      const baseStyles = [
        'inline-flex items-center justify-center',
        'font-medium transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'relative overflow-hidden',
      ];

      const variantStyles = {
        primary: [
          'bg-[#dc143c] text-white',
          'hover:bg-[#b81234] hover:shadow-lg',
          'focus:ring-[#dc143c]',
          'active:bg-[#a00f2a]',
        ],
        secondary: [
          'bg-[#f2f2f7] text-[#1d1d1f]',
          'hover:bg-[#e5e5ea] hover:shadow-md',
          'focus:ring-[#dc143c]',
          'active:bg-[#d1d1d6]',
        ],
        outline: [
          'border border-[#dc143c] text-[#dc143c] bg-transparent',
          'hover:bg-[#dc143c] hover:text-white',
          'focus:ring-[#dc143c]',
          'active:bg-[#b81234] active:text-white',
        ],
        ghost: [
          'text-[#dc143c] bg-transparent',
          'hover:bg-[#dc143c]/10',
          'focus:ring-[#dc143c]',
          'active:bg-[#dc143c]/20',
        ],
        destructive: [
          'bg-red-600 text-white',
          'hover:bg-red-700 hover:shadow-lg',
          'focus:ring-red-600',
          'active:bg-red-800',
        ],
      };

      const sizeStyles = {
        sm: 'px-3 py-1.5 text-sm rounded-md',
        md: 'px-4 py-2 text-base rounded-lg',
        lg: 'px-6 py-3 text-lg rounded-xl',
      };

      return cn(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        className
      );
    }, [variant, size, className]);

    // Memoize loading styles
    const loadingStyles = useMemo(() => {
      return loading ? 'cursor-wait' : '';
    }, [loading]);

    // Optimize click handler with useCallback
    const handleClick = useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        if (loading || disabled) {
          event.preventDefault();
          return;
        }
        onClick?.(event);
      },
      [loading, disabled, onClick]
    );

    // Generate accessible name
    const accessibleName = useMemo(() => {
      if (ariaLabel) return ariaLabel;
      if (typeof children === 'string') return children;
      return 'Button';
    }, [ariaLabel, children]);

    return (
      <button
        ref={ref}
        type={type}
        className={cn(buttonStyles, loadingStyles)}
        disabled={disabled || loading}
        onClick={handleClick}
        aria-label={accessibleName}
        aria-describedby={ariaDescribedBy}
        aria-disabled={disabled || loading}
        {...props}
      >
        {/* Loading spinner */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Button content */}
        <span className={cn('flex items-center gap-2', loading && 'opacity-0')}>
          {children}
        </span>

        {/* High contrast focus indicator for accessibility */}
        <div className="absolute inset-0 ring-2 ring-transparent focus-within:ring-[#dc143c] focus-within:ring-offset-2 rounded-inherit pointer-events-none" />
      </button>
    );
  }
);

PerformanceButton.displayName = 'PerformanceButton';

export default PerformanceButton;

import { cn } from '@/utils/helpers';

export function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className,
  disabled,
  ...props 
}) {
  const baseStyles = 'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary-400 focus:ring-primary',
    secondary: 'bg-neutral-200 text-neutral-900 hover:bg-neutral-300 focus:ring-neutral-400',
    success: 'bg-success text-white hover:bg-green-600 focus:ring-success',
    error: 'bg-error text-white hover:bg-red-600 focus:ring-error',
    outline: 'border-2 border-primary text-primary hover:bg-primary-50 focus:ring-primary',
    ghost: 'text-neutral-700 hover:bg-neutral-100 focus:ring-neutral-400',
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}

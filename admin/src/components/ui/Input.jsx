import { cn } from '@/utils/helpers';

export function Input({ 
  label, 
  error, 
  className,
  id,
  ...props 
}) {
  return (
    <div className="w-full">
      {label && (
        <label 
          htmlFor={id}
          className="block text-sm font-medium text-neutral-700 mb-1"
        >
          {label}
        </label>
      )}
      <input
        id={id}
        className={cn(
          'w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors',
          error 
            ? 'border-error focus:ring-error focus:border-error' 
            : 'border-neutral-300 focus:ring-primary focus:border-primary',
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-error">{error}</p>
      )}
    </div>
  );
}

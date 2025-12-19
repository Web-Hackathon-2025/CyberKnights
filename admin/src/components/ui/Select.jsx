import { cn } from '@/utils/helpers';

export function Select({ label, error, options, className, id, ...props }) {
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
      <select
        id={id}
        className={cn(
          'w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors bg-white',
          error 
            ? 'border-error focus:ring-error focus:border-error' 
            : 'border-neutral-300 focus:ring-primary focus:border-primary',
          className
        )}
        {...props}
      >
        {options?.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-sm text-error">{error}</p>
      )}
    </div>
  );
}

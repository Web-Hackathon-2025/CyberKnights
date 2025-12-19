import { cn } from '@/utils/helpers';

export function Table({ children, className, ...props }) {
  return (
    <div className="w-full overflow-x-auto">
      <table className={cn('w-full', className)} {...props}>
        {children}
      </table>
    </div>
  );
}

export function TableHeader({ children, className, ...props }) {
  return (
    <thead className={cn('bg-neutral-100 border-b border-neutral-200', className)} {...props}>
      {children}
    </thead>
  );
}

export function TableBody({ children, className, ...props }) {
  return (
    <tbody className={cn('divide-y divide-neutral-200', className)} {...props}>
      {children}
    </tbody>
  );
}

export function TableRow({ children, className, ...props }) {
  return (
    <tr className={cn('hover:bg-neutral-50 transition-colors', className)} {...props}>
      {children}
    </tr>
  );
}

export function TableHead({ children, className, ...props }) {
  return (
    <th
      className={cn(
        'px-6 py-3 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider',
        className
      )}
      {...props}
    >
      {children}
    </th>
  );
}

export function TableCell({ children, className, ...props }) {
  return (
    <td className={cn('px-6 py-4 text-sm text-neutral-900', className)} {...props}>
      {children}
    </td>
  );
}

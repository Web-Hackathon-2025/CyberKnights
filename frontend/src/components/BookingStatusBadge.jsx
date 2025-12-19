const BookingStatusBadge = ({ status, size = 'md' }) => {
  const sizes = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5',
  };

  const statusConfig = {
    pending: {
      bg: 'bg-warning/10',
      text: 'text-warning',
      border: 'border-warning/20',
      label: 'Pending',
    },
    confirmed: {
      bg: 'bg-info/10',
      text: 'text-info',
      border: 'border-info/20',
      label: 'Confirmed',
    },
    'in-progress': {
      bg: 'bg-purple-100',
      text: 'text-purple-700',
      border: 'border-purple-200',
      label: 'In Progress',
    },
    completed: {
      bg: 'bg-success/10',
      text: 'text-success',
      border: 'border-success/20',
      label: 'Completed',
    },
    cancelled: {
      bg: 'bg-error/10',
      text: 'text-error',
      border: 'border-error/20',
      label: 'Cancelled',
    },
  };

  const config = statusConfig[status] || statusConfig.pending;
  const sizeClass = sizes[size] || sizes.md;

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border ${config.bg} ${config.text} ${config.border} ${sizeClass}`}
    >
      {config.label}
    </span>
  );
};

export default BookingStatusBadge;


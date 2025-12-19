import { Check, Clock, PlayCircle, XCircle, CheckCircle } from 'lucide-react';
import { formatDate, formatTime, getRelativeTime } from '../utils/dateUtils';

const BookingTimeline = ({ booking }) => {
  const steps = [
    {
      id: 'pending',
      label: 'Booking Requested',
      icon: Clock,
      timestamp: booking.createdAt,
      active: true,
    },
    {
      id: 'confirmed',
      label: 'Confirmed by Provider',
      icon: CheckCircle,
      timestamp: booking.confirmedAt,
      active: booking.status === 'confirmed' || booking.status === 'in-progress' || booking.status === 'completed',
    },
    {
      id: 'in-progress',
      label: 'Service Started',
      icon: PlayCircle,
      timestamp: null, // Backend doesn't track this separately
      active: booking.status === 'in-progress' || booking.status === 'completed',
    },
    {
      id: 'completed',
      label: 'Service Completed',
      icon: Check,
      timestamp: booking.completedAt,
      active: booking.status === 'completed',
    },
  ];

  // Handle cancelled status
  if (booking.status === 'cancelled') {
    return (
      <div className="flex items-center gap-4 p-4 bg-error/10 rounded-xl">
        <div className="w-12 h-12 bg-error/20 rounded-full flex items-center justify-center flex-shrink-0">
          <XCircle className="w-6 h-6 text-error" />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-error mb-1">Booking Cancelled</p>
          <p className="text-sm text-neutral-600">
            Cancelled {getRelativeTime(booking.cancelledAt)} by {booking.cancelledBy}
          </p>
          {booking.cancellationReason && (
            <p className="text-sm text-neutral-600 mt-2">
              <span className="font-medium">Reason:</span> {booking.cancellationReason}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Timeline Steps */}
      <div className="space-y-6">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = step.active;
          const isCurrent = booking.status === step.id;

          return (
            <div key={step.id} className="relative flex items-start gap-4">
              {/* Connection Line */}
              {index < steps.length - 1 && (
                <div
                  className={`absolute left-6 top-12 w-0.5 h-12 ${
                    isActive ? 'bg-primary' : 'bg-neutral-200'
                  }`}
                />
              )}

              {/* Step Icon */}
              <div
                className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                  isActive
                    ? isCurrent
                      ? 'bg-primary text-white ring-4 ring-primary/20'
                      : 'bg-primary text-white'
                    : 'bg-neutral-100 text-neutral-400'
                }`}
              >
                <Icon className="w-6 h-6" />
              </div>

              {/* Step Content */}
              <div className="flex-1 pt-2">
                <p
                  className={`font-semibold mb-1 ${
                    isActive ? 'text-neutral-900' : 'text-neutral-400'
                  }`}
                >
                  {step.label}
                </p>
                {step.timestamp && (
                  <p className="text-sm text-neutral-500">
                    {getRelativeTime(step.timestamp)}
                  </p>
                )}
                {isCurrent && !step.timestamp && (
                  <p className="text-sm text-primary font-medium">In Progress</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BookingTimeline;


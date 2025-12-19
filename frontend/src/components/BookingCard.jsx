import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, User, Briefcase } from 'lucide-react';
import BookingStatusBadge from './BookingStatusBadge';
import { formatDate, formatTime } from '../utils/dateUtils';
import PriceTag from './PriceTag';

const BookingCard = ({ booking, viewType = 'customer', onAction }) => {
  const isCustomerView = viewType === 'customer';
  const detailsPath = isCustomerView 
    ? `/bookings/${booking._id}` 
    : `/provider/bookings/${booking._id}`;

  // Extract display information
  const providerInfo = booking.providerId?.userId || booking.providerId;
  const customerInfo = booking.customerId;
  const serviceInfo = booking.serviceId;
  const displayName = isCustomerView 
    ? (booking.providerId?.businessName || providerInfo?.name)
    : customerInfo?.name;

  return (
    <Link
      to={detailsPath}
      className="block bg-white rounded-xl border border-neutral-200 p-6 hover:shadow-lg hover:border-primary-200 transition-all"
    >
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-neutral-900">
              {booking.serviceName || serviceInfo?.name || 'Service'}
            </h3>
            <BookingStatusBadge status={booking.status} size="sm" />
          </div>
          
          <p className="text-sm text-neutral-500 mb-3">
            Booking #{booking.bookingNumber}
          </p>

          <div className="space-y-2">
            {/* Service Provider / Customer */}
            <div className="flex items-center gap-2 text-sm text-neutral-600">
              <User className="w-4 h-4 text-neutral-400" />
              <span className="font-medium">{displayName || 'N/A'}</span>
              {isCustomerView && booking.providerId?.category && (
                <span className="text-neutral-400">• {booking.providerId.category.name}</span>
              )}
            </div>

            {/* Date & Time */}
            <div className="flex items-center gap-2 text-sm text-neutral-600">
              <Calendar className="w-4 h-4 text-neutral-400" />
              <span>{formatDate(booking.scheduledDate)}</span>
              <Clock className="w-4 h-4 text-neutral-400 ml-2" />
              <span>{formatTime(booking.scheduledTime)}</span>
            </div>

            {/* Address (for provider view) */}
            {!isCustomerView && booking.customerAddress && (
              <div className="flex items-center gap-2 text-sm text-neutral-600">
                <MapPin className="w-4 h-4 text-neutral-400" />
                <span className="truncate">{booking.customerAddress}</span>
              </div>
            )}
          </div>
        </div>

        {/* Price */}
        <div className="sm:text-right">
          <PriceTag 
            price={booking.servicePrice || serviceInfo?.price} 
            priceType={serviceInfo?.priceType}
            size="lg"
          />
        </div>
      </div>

      {/* Quick Actions */}
      {onAction && (
        <div className="flex gap-2 pt-4 border-t border-neutral-200" onClick={(e) => e.preventDefault()}>
          {booking.status === 'pending' && !isCustomerView && (
            <>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  onAction('confirm', booking._id);
                }}
                className="flex-1 px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-600 transition-colors"
              >
                Accept
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  onAction('cancel', booking._id);
                }}
                className="flex-1 px-4 py-2 bg-neutral-100 text-neutral-700 rounded-lg font-medium hover:bg-neutral-200 transition-colors"
              >
                Decline
              </button>
            </>
          )}
          
          {booking.status === 'confirmed' && !isCustomerView && (
            <>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  onAction('start', booking._id);
                }}
                className="flex-1 px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-600 transition-colors"
              >
                Start Service
              </button>
            </>
          )}
          
          {booking.status === 'in-progress' && !isCustomerView && (
            <button
              onClick={(e) => {
                e.preventDefault();
                onAction('complete', booking._id);
              }}
              className="flex-1 px-4 py-2 bg-success text-white rounded-lg font-medium hover:bg-success/90 transition-colors"
            >
              Mark Complete
            </button>
          )}

          {(booking.status === 'pending' || booking.status === 'confirmed') && isCustomerView && (
            <button
              onClick={(e) => {
                e.preventDefault();
                onAction('cancel', booking._id);
              }}
              className="flex-1 px-4 py-2 bg-error/10 text-error rounded-lg font-medium hover:bg-error/20 transition-colors"
            >
              Cancel Booking
            </button>
          )}
        </div>
      )}
    </Link>
  );
};

export default BookingCard;


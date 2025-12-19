import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { bookingService } from '../../services/bookingService';
import BookingStatusBadge from '../../components/BookingStatusBadge';
import BookingTimeline from '../../components/BookingTimeline';
import CancelBookingModal from '../../components/CancelBookingModal';
import RatingDisplay from '../../components/RatingDisplay';
import PriceTag from '../../components/PriceTag';
import { formatDate, formatTime } from '../../utils/dateUtils';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Phone,
  Briefcase,
  MessageCircle,
  Star
} from 'lucide-react';

const BookingDetailsPage = () => {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelModal, setCancelModal] = useState(false);

  useEffect(() => {
    if (id) {
      loadBooking();
    }
  }, [id]);

  const loadBooking = async () => {
    try {
      setLoading(true);
      const response = await bookingService.getBookingById(id);
      setBooking(response.data.booking);
    } catch (error) {
      console.error('Failed to load booking:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelConfirm = async () => {
    setCancelModal(false);
    await loadBooking(); // Refresh booking
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-neutral-900 mb-2">Booking Not Found</h2>
          <Link to="/bookings" className="text-primary hover:text-primary-600">
            Return to My Bookings
          </Link>
        </div>
      </div>
    );
  }

  const providerInfo = booking.providerId?.userId || booking.providerId;
  const serviceInfo = booking.serviceId;
  const canCancel = booking.status === 'pending' || booking.status === 'confirmed';

  return (
    <div className="min-h-screen bg-neutral-50 pt-20 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <Link
          to="/bookings"
          className="inline-flex items-center gap-2 text-neutral-600 hover:text-neutral-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to My Bookings
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">Booking Details</h1>
            <p className="text-neutral-600">Booking #{booking.bookingNumber}</p>
          </div>
          <BookingStatusBadge status={booking.status} size="lg" />
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">Status Timeline</h2>
          <BookingTimeline booking={booking} />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Booking Information */}
          <div className="bg-white rounded-xl border border-neutral-200 p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Booking Information</h2>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-neutral-400" />
                <div>
                  <p className="text-sm text-neutral-500">Date</p>
                  <p className="font-medium text-neutral-900">{formatDate(booking.scheduledDate)}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-neutral-400" />
                <div>
                  <p className="text-sm text-neutral-500">Time</p>
                  <p className="font-medium text-neutral-900">{formatTime(booking.scheduledTime)}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-neutral-400" />
                <div>
                  <p className="text-sm text-neutral-500">Address</p>
                  <p className="font-medium text-neutral-900">{booking.customerAddress}</p>
                </div>
              </div>
            </div>

            {booking.notes && (
              <div className="mt-4 pt-4 border-t border-neutral-200">
                <p className="text-sm text-neutral-500 mb-1">Your Notes</p>
                <p className="text-neutral-700">{booking.notes}</p>
              </div>
            )}

            {booking.providerNotes && (
              <div className="mt-4 pt-4 border-t border-neutral-200">
                <p className="text-sm text-neutral-500 mb-1">Provider's Notes</p>
                <p className="text-neutral-700">{booking.providerNotes}</p>
              </div>
            )}
          </div>

          {/* Service & Provider Details */}
          <div className="space-y-6">
            {/* Service Card */}
            <div className="bg-white rounded-xl border border-neutral-200 p-6">
              <h2 className="text-lg font-semibold text-neutral-900 mb-4">Service Details</h2>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Briefcase className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-neutral-900 mb-1">
                    {booking.serviceName || serviceInfo?.name}
                  </h3>
                  {serviceInfo?.description && (
                    <p className="text-sm text-neutral-600 mb-3">{serviceInfo.description}</p>
                  )}
                  <PriceTag 
                    price={booking.servicePrice || serviceInfo?.price} 
                    priceType={serviceInfo?.priceType}
                    size="lg"
                  />
                </div>
              </div>
            </div>

            {/* Provider Card */}
            <div className="bg-white rounded-xl border border-neutral-200 p-6">
              <h2 className="text-lg font-semibold text-neutral-900 mb-4">Provider Details</h2>
              
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-bold text-xl">
                    {booking.providerId?.businessName?.charAt(0) || providerInfo?.name?.charAt(0) || 'P'}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-neutral-900 mb-1">
                    {booking.providerId?.businessName || providerInfo?.name}
                  </h3>
                  {booking.providerId?.rating > 0 && (
                    <RatingDisplay 
                      rating={booking.providerId.rating} 
                      reviews={booking.providerId.totalReviews}
                      size="sm"
                    />
                  )}
                </div>
              </div>

              {booking.providerId?.phone && (
                <div className="flex items-center gap-2 text-sm text-neutral-600 mb-3">
                  <Phone className="w-4 h-4 text-neutral-400" />
                  <span>{booking.providerId.phone}</span>
                </div>
              )}

              <Link
                to={`/providers/${booking.providerId?._id}`}
                className="inline-flex items-center gap-2 text-primary hover:text-primary-600 font-medium text-sm"
              >
                View Full Profile →
              </Link>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mt-6">
          {canCancel && (
            <button
              onClick={() => setCancelModal(true)}
              className="px-6 py-3 bg-error text-white rounded-xl font-semibold hover:bg-error/90 transition-colors"
            >
              Cancel Booking
            </button>
          )}
          
          {booking.status === 'completed' && (
            <button
              className="px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-600 transition-colors flex items-center gap-2"
            >
              <Star className="w-5 h-5" />
              Leave a Review
            </button>
          )}

          <button
            className="px-6 py-3 bg-neutral-100 text-neutral-700 rounded-xl font-semibold hover:bg-neutral-200 transition-colors flex items-center gap-2"
          >
            <MessageCircle className="w-5 h-5" />
            Contact Provider
          </button>
        </div>
      </div>

      {/* Cancel Modal */}
      <CancelBookingModal
        isOpen={cancelModal}
        bookingId={booking._id}
        onClose={() => setCancelModal(false)}
        onConfirm={handleCancelConfirm}
      />
    </div>
  );
};

export default BookingDetailsPage;


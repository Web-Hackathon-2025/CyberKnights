import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { bookingService } from '../../services/bookingService';
import BookingStatusBadge from '../../components/BookingStatusBadge';
import BookingTimeline from '../../components/BookingTimeline';
import AcceptBookingModal from '../../components/AcceptBookingModal';
import CancelBookingModal from '../../components/CancelBookingModal';
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
  CheckCircle,
  PlayCircle,
  XCircle
} from 'lucide-react';

const ProviderBookingDetailsPage = () => {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [acceptModal, setAcceptModal] = useState(false);
  const [cancelModal, setCancelModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

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

  const handleStart = async () => {
    try {
      setActionLoading(true);
      await bookingService.startBooking(id);
      await loadBooking();
    } catch (error) {
      console.error('Failed to start booking:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleComplete = async () => {
    try {
      setActionLoading(true);
      await bookingService.completeBooking(id);
      await loadBooking();
    } catch (error) {
      console.error('Failed to complete booking:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleModalConfirm = async () => {
    setAcceptModal(false);
    setCancelModal(false);
    await loadBooking();
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
          <Link to="/provider/bookings" className="text-primary hover:text-primary-600">
            Return to Bookings
          </Link>
        </div>
      </div>
    );
  }

  const customerInfo = booking.customerId;
  const serviceInfo = booking.serviceId;

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link
            to="/provider/bookings"
            className="inline-flex items-center gap-2 text-neutral-600 hover:text-neutral-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Bookings
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-neutral-900 mb-2">Booking Details</h1>
              <p className="text-neutral-600">Booking #{booking.bookingNumber}</p>
            </div>
            <BookingStatusBadge status={booking.status} size="lg" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Timeline */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">Status Timeline</h2>
          <BookingTimeline booking={booking} />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Customer Information */}
          <div className="bg-white rounded-xl border border-neutral-200 p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Customer Information</h2>
            
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-6 h-6 text-neutral-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-neutral-900 mb-1">{booking.customerName}</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-neutral-600">
                    <Phone className="w-4 h-4 text-neutral-400" />
                    <span>{booking.customerPhone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-neutral-600">
                    <MapPin className="w-4 h-4 text-neutral-400" />
                    <span>{booking.customerAddress}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-neutral-200">
              <div className="flex items-center gap-3 mb-3">
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
            </div>

            {booking.notes && (
              <div className="mt-4 pt-4 border-t border-neutral-200">
                <p className="text-sm text-neutral-500 mb-1">Customer's Notes</p>
                <p className="text-neutral-700">{booking.notes}</p>
              </div>
            )}
          </div>

          {/* Service Details */}
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

            {/* Provider Notes */}
            {(booking.providerNotes || booking.status === 'pending') && (
              <div className="bg-white rounded-xl border border-neutral-200 p-6">
                <h2 className="text-lg font-semibold text-neutral-900 mb-3">Your Notes</h2>
                {booking.providerNotes ? (
                  <p className="text-neutral-700">{booking.providerNotes}</p>
                ) : (
                  <p className="text-sm text-neutral-500 italic">
                    You can add notes when accepting this booking
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mt-6">
          {booking.status === 'pending' && (
            <>
              <button
                onClick={() => setAcceptModal(true)}
                className="px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-600 transition-colors flex items-center gap-2"
              >
                <CheckCircle className="w-5 h-5" />
                Accept Booking
              </button>
              <button
                onClick={() => setCancelModal(true)}
                className="px-6 py-3 bg-neutral-100 text-neutral-700 rounded-xl font-semibold hover:bg-neutral-200 transition-colors flex items-center gap-2"
              >
                <XCircle className="w-5 h-5" />
                Decline
              </button>
            </>
          )}

          {booking.status === 'confirmed' && (
            <>
              <button
                onClick={handleStart}
                disabled={actionLoading}
                className="px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-600 transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                <PlayCircle className="w-5 h-5" />
                {actionLoading ? 'Starting...' : 'Start Service'}
              </button>
              <button
                onClick={() => setCancelModal(true)}
                className="px-6 py-3 bg-neutral-100 text-neutral-700 rounded-xl font-semibold hover:bg-neutral-200 transition-colors"
              >
                Cancel
              </button>
            </>
          )}

          {booking.status === 'in-progress' && (
            <>
              <button
                onClick={handleComplete}
                disabled={actionLoading}
                className="px-6 py-3 bg-success text-white rounded-xl font-semibold hover:bg-success/90 transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                <CheckCircle className="w-5 h-5" />
                {actionLoading ? 'Completing...' : 'Mark as Complete'}
              </button>
              <button
                onClick={() => setCancelModal(true)}
                className="px-6 py-3 bg-neutral-100 text-neutral-700 rounded-xl font-semibold hover:bg-neutral-200 transition-colors"
              >
                Cancel
              </button>
            </>
          )}

          <button
            className="px-6 py-3 bg-neutral-100 text-neutral-700 rounded-xl font-semibold hover:bg-neutral-200 transition-colors flex items-center gap-2"
          >
            <MessageCircle className="w-5 h-5" />
            Contact Customer
          </button>
        </div>
      </div>

      {/* Accept Modal */}
      <AcceptBookingModal
        isOpen={acceptModal}
        bookingId={booking._id}
        onClose={() => setAcceptModal(false)}
        onConfirm={handleModalConfirm}
      />

      {/* Cancel Modal */}
      <CancelBookingModal
        isOpen={cancelModal}
        bookingId={booking._id}
        onClose={() => setCancelModal(false)}
        onConfirm={handleModalConfirm}
      />
    </div>
  );
};

export default ProviderBookingDetailsPage;


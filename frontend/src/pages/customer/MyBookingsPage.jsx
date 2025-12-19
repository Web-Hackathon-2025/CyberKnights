import { useState, useEffect } from 'react';
import { bookingService } from '../../services/bookingService';
import BookingCard from '../../components/BookingCard';
import CancelBookingModal from '../../components/CancelBookingModal';
import { Calendar } from 'lucide-react';

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [cancelModal, setCancelModal] = useState({ isOpen: false, bookingId: null });

  useEffect(() => {
    loadBookings();
  }, [activeTab]);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const statusFilter = activeTab === 'all' ? null : activeTab;
      const response = await bookingService.getMyBookings(statusFilter);
      setBookings(response.data.bookings || []);
    } catch (error) {
      console.error('Failed to load bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = (action, bookingId) => {
    if (action === 'cancel') {
      setCancelModal({ isOpen: true, bookingId });
    }
  };

  const handleCancelConfirm = async () => {
    setCancelModal({ isOpen: false, bookingId: null });
    await loadBookings(); // Refresh bookings
  };

  const tabs = [
    { id: 'all', label: 'All Bookings' },
    { id: 'pending', label: 'Pending' },
    { id: 'confirmed', label: 'Confirmed' },
    { id: 'completed', label: 'Completed' },
    { id: 'cancelled', label: 'Cancelled' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">My Bookings</h1>
          <p className="text-neutral-600">Manage and track your service bookings</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl border border-neutral-200 mb-6">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 min-w-[120px] px-6 py-4 font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-neutral-600 hover:text-neutral-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Bookings Grid */}
        {bookings.length === 0 ? (
          <div className="bg-white rounded-xl border border-neutral-200 p-12">
            <div className="text-center">
              <Calendar className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                {activeTab === 'all' ? 'No Bookings Yet' : `No ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Bookings`}
              </h3>
              <p className="text-neutral-600 mb-6">
                {activeTab === 'all' 
                  ? 'Start booking services from our verified providers'
                  : 'You don\'t have any bookings with this status'}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {bookings.map((booking) => (
              <BookingCard
                key={booking._id}
                booking={booking}
                viewType="customer"
                onAction={handleAction}
              />
            ))}
          </div>
        )}
      </div>

      {/* Cancel Modal */}
      <CancelBookingModal
        isOpen={cancelModal.isOpen}
        bookingId={cancelModal.bookingId}
        onClose={() => setCancelModal({ isOpen: false, bookingId: null })}
        onConfirm={handleCancelConfirm}
      />
    </div>
  );
};

export default MyBookingsPage;


import { useState, useEffect } from 'react';
import { bookingService } from '../../services/bookingService';
import BookingCard from '../../components/BookingCard';
import AcceptBookingModal from '../../components/AcceptBookingModal';
import CancelBookingModal from '../../components/CancelBookingModal';
import { Calendar, Clock, CheckCircle, AlertCircle } from 'lucide-react';

const BookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');
  const [acceptModal, setAcceptModal] = useState({ isOpen: false, bookingId: null });
  const [cancelModal, setCancelModal] = useState({ isOpen: false, bookingId: null });
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    thisWeek: 0,
    completed: 0,
  });

  useEffect(() => {
    loadBookings();
    loadStats();
  }, [activeTab]);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const statusFilter = activeTab === 'all' ? null : activeTab;
      const response = await bookingService.getProviderBookings(statusFilter);
      setBookings(response.data.bookings || []);
    } catch (error) {
      console.error('Failed to load bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await bookingService.getProviderBookings();
      const allBookings = response.data.bookings || [];
      
      const now = new Date();
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      
      setStats({
        total: allBookings.length,
        pending: allBookings.filter(b => b.status === 'pending').length,
        thisWeek: allBookings.filter(b => new Date(b.createdAt) >= oneWeekAgo).length,
        completed: allBookings.filter(b => b.status === 'completed').length,
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const handleAction = async (action, bookingId) => {
    if (action === 'confirm') {
      setAcceptModal({ isOpen: true, bookingId });
    } else if (action === 'cancel') {
      setCancelModal({ isOpen: true, bookingId });
    } else if (action === 'start') {
      try {
        await bookingService.startBooking(bookingId);
        await loadBookings();
      } catch (error) {
        console.error('Failed to start booking:', error);
      }
    } else if (action === 'complete') {
      try {
        await bookingService.completeBooking(bookingId);
        await loadBookings();
        await loadStats();
      } catch (error) {
        console.error('Failed to complete booking:', error);
      }
    }
  };

  const handleModalConfirm = async () => {
    setAcceptModal({ isOpen: false, bookingId: null });
    setCancelModal({ isOpen: false, bookingId: null });
    await loadBookings();
    await loadStats();
  };

  const tabs = [
    { id: 'pending', label: 'Pending', count: stats.pending },
    { id: 'confirmed', label: 'Confirmed' },
    { id: 'in-progress', label: 'In Progress' },
    { id: 'completed', label: 'Completed' },
    { id: 'cancelled', label: 'Cancelled' },
  ];

  if (loading && bookings.length === 0) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-bold text-neutral-900 mb-6">Manage Bookings</h1>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-neutral-50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-neutral-500">Total Bookings</p>
                <Calendar className="w-5 h-5 text-neutral-400" />
              </div>
              <p className="text-2xl font-bold text-neutral-900">{stats.total}</p>
            </div>

            <div className="bg-warning/10 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-warning">Pending Requests</p>
                <AlertCircle className="w-5 h-5 text-warning" />
              </div>
              <p className="text-2xl font-bold text-warning">{stats.pending}</p>
            </div>

            <div className="bg-info/10 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-info">This Week</p>
                <Clock className="w-5 h-5 text-info" />
              </div>
              <p className="text-2xl font-bold text-info">{stats.thisWeek}</p>
            </div>

            <div className="bg-success/10 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-success">Completed</p>
                <CheckCircle className="w-5 h-5 text-success" />
              </div>
              <p className="text-2xl font-bold text-success">{stats.completed}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="bg-white rounded-xl border border-neutral-200 mb-6">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 min-w-[140px] px-6 py-4 font-medium border-b-2 transition-colors relative ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-neutral-600 hover:text-neutral-900'
                }`}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span className="ml-2 px-2 py-0.5 bg-warning text-white text-xs rounded-full">
                    {tab.count}
                  </span>
                )}
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
                No {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Bookings
              </h3>
              <p className="text-neutral-600">
                You don't have any bookings with this status
              </p>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {bookings.map((booking) => (
              <BookingCard
                key={booking._id}
                booking={booking}
                viewType="provider"
                onAction={handleAction}
              />
            ))}
          </div>
        )}
      </div>

      {/* Accept Modal */}
      <AcceptBookingModal
        isOpen={acceptModal.isOpen}
        bookingId={acceptModal.bookingId}
        onClose={() => setAcceptModal({ isOpen: false, bookingId: null })}
        onConfirm={handleModalConfirm}
      />

      {/* Cancel Modal */}
      <CancelBookingModal
        isOpen={cancelModal.isOpen}
        bookingId={cancelModal.bookingId}
        onClose={() => setCancelModal({ isOpen: false, bookingId: null })}
        onConfirm={handleModalConfirm}
      />
    </div>
  );
};

export default BookingsPage;


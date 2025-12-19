import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import providerService from '../services/providerService';
import { bookingService } from '../services/bookingService';
import { Calendar, Clock, MapPin, User } from 'lucide-react';
import BookingStatusBadge from '../components/BookingStatusBadge';

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [providerStatus, setProviderStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [customerBookings, setCustomerBookings] = useState([]);
  const [bookingStats, setBookingStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    completed: 0
  });

  useEffect(() => {
    if (user?.role === 'provider') {
      // Redirect provider to provider dashboard
      navigate('/provider/dashboard', { replace: true });
    } else if (user?.role === 'user') {
      loadCustomerData();
    } else {
      setLoading(false);
    }
  }, [user, navigate]);

  const loadCustomerData = async () => {
    try {
      const response = await bookingService.getMyBookings();
      const bookings = response.data.bookings || [];
      setCustomerBookings(bookings.slice(0, 3)); // Show only recent 3
      
      // Calculate stats
      setBookingStats({
        total: bookings.length,
        pending: bookings.filter(b => b.status === 'pending').length,
        confirmed: bookings.filter(b => b.status === 'confirmed' || b.status === 'in-progress').length,
        completed: bookings.filter(b => b.status === 'completed').length
      });
    } catch (error) {
      console.error('Error loading customer data:', error);
    } finally {
      setLoading(false);
    }
  };


  const handleRegisterAsProvider = async () => {
    try {
      await providerService.registerAsProvider();
      navigate('/provider/pending-approval', { replace: true });
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to register as provider');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }


  // Customer Dashboard
  if (user?.role === 'user') {
    return (
      <div className="min-h-screen bg-neutral-50 pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">
              Welcome back, {user?.name}! 👋
            </h1>
            <p className="text-neutral-600">Here's an overview of your bookings and activity</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 border border-neutral-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-500 mb-1">Total Bookings</p>
                  <p className="text-3xl font-bold text-neutral-900">{bookingStats.total}</p>
                </div>
                <div className="p-3 bg-primary-50 rounded-xl">
                  <Calendar className="w-6 h-6 text-primary" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-neutral-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-500 mb-1">Pending</p>
                  <p className="text-3xl font-bold text-neutral-900">{bookingStats.pending}</p>
                </div>
                <div className="p-3 bg-warning/10 rounded-xl">
                  <Clock className="w-6 h-6 text-warning" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-neutral-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-500 mb-1">Active</p>
                  <p className="text-3xl font-bold text-neutral-900">{bookingStats.confirmed}</p>
                </div>
                <div className="p-3 bg-info/10 rounded-xl">
                  <User className="w-6 h-6 text-info" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-neutral-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-500 mb-1">Completed</p>
                  <p className="text-3xl font-bold text-neutral-900">{bookingStats.completed}</p>
                </div>
                <div className="p-3 bg-success/10 rounded-xl">
                  <svg className="w-6 h-6 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions & Recent Bookings */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl border border-neutral-200 p-6">
              <h2 className="text-lg font-semibold text-neutral-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Link
                  to="/services"
                  className="flex items-center gap-3 p-3 bg-primary text-white rounded-xl hover:bg-primary-600 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="font-medium">Browse Services</span>
                </Link>
                <Link
                  to="/bookings"
                  className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl hover:bg-neutral-100 transition-colors"
                >
                  <Calendar className="w-5 h-5 text-neutral-700" />
                  <span className="font-medium text-neutral-700">View All Bookings</span>
                </Link>
                <Link
                  to="/inbox"
                  className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl hover:bg-neutral-100 transition-colors"
                >
                  <svg className="w-5 h-5 text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                  <span className="font-medium text-neutral-700">Messages</span>
                </Link>
              </div>

              {/* Become Provider CTA */}
              <div className="mt-6 pt-6 border-t border-neutral-200">
                <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl p-4">
                  <h3 className="font-semibold text-neutral-900 mb-2">Become a Provider</h3>
                  <p className="text-sm text-neutral-600 mb-3">
                    Start offering your services and earn on Karigar
                  </p>
                  <button
                    onClick={handleRegisterAsProvider}
                    className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors text-sm font-medium"
                  >
                    Get Started
                  </button>
                </div>
              </div>
            </div>

            {/* Recent Bookings */}
            <div className="lg:col-span-2 bg-white rounded-xl border border-neutral-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-neutral-900">Recent Bookings</h2>
                <Link
                  to="/bookings"
                  className="text-sm text-primary hover:text-primary-600 font-medium"
                >
                  View All →
                </Link>
              </div>

              {customerBookings.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                  <p className="text-neutral-600 mb-4">No bookings yet</p>
                  <Link
                    to="/services"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl font-medium hover:bg-primary-600 transition-colors"
                  >
                    Browse Services
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {customerBookings.map((booking) => (
                    <Link
                      key={booking._id}
                      to={`/bookings/${booking._id}`}
                      className="block p-4 bg-neutral-50 rounded-xl hover:bg-neutral-100 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="font-semibold text-neutral-900 mb-1">
                            {booking.serviceName}
                          </h3>
                          <p className="text-sm text-neutral-600">
                            {booking.providerId?.businessName || booking.providerId?.userId?.name}
                          </p>
                        </div>
                        <BookingStatusBadge status={booking.status} />
                      </div>
                      <div className="flex items-center gap-4 text-sm text-neutral-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(booking.scheduledDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{booking.scheduledTime}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Fallback for other cases (admins, etc.)
  return (
    <div className="min-h-screen bg-neutral-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Welcome Header */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-8 text-center">
          <h1 className="text-4xl font-bold text-neutral-900 mb-3">
            Welcome to Karigar! 👋
          </h1>
          <p className="text-lg text-neutral-600 mb-6">
            Hi <span className="font-semibold text-primary">{user?.name}</span>, your account is ready
          </p>
          
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 rounded-lg">
            <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium text-primary">Email Verified</span>
          </div>
        </div>

        {/* Account Info */}
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <h2 className="text-xl font-bold text-neutral-900 mb-6">Account Information</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-neutral-100">
              <span className="text-neutral-600">Email</span>
              <span className="font-medium text-neutral-900">{user?.email}</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-neutral-100">
              <span className="text-neutral-600">Role</span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary capitalize">
                {user?.role}
              </span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-neutral-100">
              <span className="text-neutral-600">Member Since</span>
              <span className="font-medium text-neutral-900">
                {new Date(user?.createdAt).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </span>
            </div>
            
            <div className="pt-4">
              <Link 
                to="/profile" 
                className="w-full inline-flex items-center justify-center px-6 py-3 border-2 border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-all font-medium"
              >
                Edit Profile
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

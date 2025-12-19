import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getProviderProfile, getMyServices } from '../../services/providerService';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Briefcase, 
  Calendar, 
  Star, 
  TrendingUp,
  Plus,
  Settings,
  MapPin,
  Clock
} from 'lucide-react';

const ProviderDashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalServices: 0,
    activeServices: 0,
    totalBookings: 0,
    rating: 0,
    reviews: 0,
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [profileResponse, servicesResponse] = await Promise.all([
        getProviderProfile(),
        getMyServices().catch(() => ({ data: { services: [] } })),
      ]);

      const providerData = profileResponse.data.provider;
      const servicesData = servicesResponse.data?.services || [];

      setProfile(providerData);
      setServices(servicesData);

      setStats({
        totalServices: servicesData.length,
        activeServices: servicesData.filter(s => s.isActive).length,
        totalBookings: providerData.totalBookings || 0,
        rating: providerData.rating || 0,
        reviews: providerData.totalReviews || 0,
      });
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-neutral-900">
                Provider Dashboard
              </h1>
              <p className="text-neutral-600 mt-1">
                Welcome back, {profile?.businessName || user?.name}!
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                to="/provider/services/create"
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl font-medium hover:bg-primary-600 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Add Service
              </Link>
              <Link
                to="/profile"
                className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-100 text-neutral-700 rounded-xl font-medium hover:bg-neutral-200 transition-colors"
              >
                <Settings className="w-5 h-5" />
                Settings
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 border border-neutral-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-500 mb-1">Total Services</p>
                <p className="text-3xl font-bold text-neutral-900">{stats.totalServices}</p>
                <p className="text-xs text-neutral-500 mt-1">
                  {stats.activeServices} active
                </p>
              </div>
              <div className="p-3 bg-primary-50 rounded-xl">
                <Briefcase className="w-6 h-6 text-primary" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-neutral-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-500 mb-1">Total Bookings</p>
                <p className="text-3xl font-bold text-neutral-900">{stats.totalBookings}</p>
                <p className="text-xs text-success mt-1">
                  {profile?.completedBookings || 0} completed
                </p>
              </div>
              <div className="p-3 bg-success/10 rounded-xl">
                <Calendar className="w-6 h-6 text-success" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-neutral-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-500 mb-1">Rating</p>
                <p className="text-3xl font-bold text-neutral-900">
                  {stats.rating > 0 ? stats.rating.toFixed(1) : 'N/A'}
                </p>
                <p className="text-xs text-neutral-500 mt-1">
                  {stats.reviews} reviews
                </p>
              </div>
              <div className="p-3 bg-warning/10 rounded-xl">
                <Star className="w-6 h-6 text-warning" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-neutral-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-500 mb-1">Profile Views</p>
                <p className="text-3xl font-bold text-neutral-900">0</p>
                <p className="text-xs text-primary mt-1">Coming soon</p>
              </div>
              <div className="p-3 bg-info/10 rounded-xl">
                <TrendingUp className="w-6 h-6 text-info" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions & Profile Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Profile Summary */}
          <div className="lg:col-span-1 bg-white rounded-xl border border-neutral-200 p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">
              Profile Summary
            </h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary">
                    {profile?.businessName?.charAt(0) || user?.name?.charAt(0) || 'P'}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-neutral-900">
                    {profile?.businessName || 'Business Name'}
                  </p>
                  <p className="text-sm text-neutral-500">{user?.email}</p>
                </div>
              </div>

              {profile?.location?.city && (
                <div className="flex items-center gap-2 text-sm text-neutral-600">
                  <MapPin className="w-4 h-4 text-neutral-400" />
                  <span>
                    {profile.location.area && `${profile.location.area}, `}
                    {profile.location.city}
                  </span>
                </div>
              )}

              {profile?.phone && (
                <div className="flex items-center gap-2 text-sm text-neutral-600">
                  <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>{profile.phone}</span>
                </div>
              )}

              <div className="pt-4 border-t border-neutral-200">
                <Link
                  to="/profile"
                  className="text-sm text-primary hover:text-primary-600 font-medium"
                >
                  Edit Profile →
                </Link>
              </div>
            </div>
          </div>

          {/* My Services */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-neutral-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-neutral-900">
                My Services
              </h2>
              <Link
                to="/provider/services"
                className="text-sm text-primary hover:text-primary-600 font-medium"
              >
                View All →
              </Link>
            </div>

            {services.length === 0 ? (
              <div className="text-center py-12">
                <Briefcase className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                <p className="text-neutral-600 mb-4">
                  You haven't added any services yet
                </p>
                <Link
                  to="/provider/services/create"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl font-medium hover:bg-primary-600 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  Add Your First Service
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {services.slice(0, 3).map((service) => (
                  <div
                    key={service._id}
                    className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl hover:bg-neutral-100 transition-colors"
                  >
                    <div className="flex-1">
                      <h3 className="font-medium text-neutral-900">{service.name}</h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-sm text-neutral-600">
                          PKR {service.price.toLocaleString()}
                          {service.priceType === 'hourly' ? '/hr' : ''}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          service.isActive
                            ? 'bg-success/10 text-success'
                            : 'bg-neutral-200 text-neutral-600'
                        }`}>
                          {service.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                    <Link
                      to={`/provider/services/${service._id}/edit`}
                      className="text-sm text-primary hover:text-primary-600 font-medium"
                    >
                      Edit
                    </Link>
                  </div>
                ))}

                {services.length > 3 && (
                  <Link
                    to="/provider/services"
                    className="block text-center py-3 text-sm text-primary hover:text-primary-600 font-medium"
                  >
                    View {services.length - 3} more services →
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Availability Section */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-neutral-900">
              Availability
            </h2>
            <Link
              to="/profile"
              className="text-sm text-primary hover:text-primary-600 font-medium"
            >
              Update
            </Link>
          </div>

          {profile?.availability && (
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
              {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(
                (day) => (
                  <div
                    key={day}
                    className={`p-3 rounded-lg text-center ${
                      profile.availability[day]
                        ? 'bg-success/10 text-success border border-success/20'
                        : 'bg-neutral-100 text-neutral-400'
                    }`}
                  >
                    <p className="text-xs font-medium capitalize">
                      {day.slice(0, 3)}
                    </p>
                  </div>
                )
              )}
            </div>
          )}

          {profile?.workingHours && (
            <div className="flex items-center gap-2 text-sm text-neutral-600 mt-4 pt-4 border-t border-neutral-200">
              <Clock className="w-4 h-4 text-neutral-400" />
              <span>
                Working Hours: {profile.workingHours.start} - {profile.workingHours.end}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProviderDashboardPage;


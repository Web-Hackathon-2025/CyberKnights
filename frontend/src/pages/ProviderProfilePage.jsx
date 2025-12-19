import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { publicProviderService } from '../services/publicProviderService';
import RatingDisplay from '../components/RatingDisplay';
import LocationBadge from '../components/LocationBadge';
import ServiceCard from '../components/ServiceCard';
import BookServiceModal from '../components/BookServiceModal';
import { useAuth } from '../contexts/AuthContext';
import { 
  MapPin, 
  Phone, 
  Clock, 
  Calendar,
  Star,
  Briefcase,
  Award,
  MessageCircle
} from 'lucide-react';

const ProviderProfilePage = () => {
  const { providerId } = useParams();
  const { isAuthenticated, user } = useAuth();
  const [provider, setProvider] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('services');
  const [bookingModal, setBookingModal] = useState({ isOpen: false, service: null });

  useEffect(() => {
    if (providerId) {
      loadProviderData();
    }
  }, [providerId]);

  const loadProviderData = async () => {
    try {
      setLoading(true);
      const [profileResponse, servicesResponse] = await Promise.all([
        publicProviderService.getProviderProfile(providerId),
        publicProviderService.getProviderServices(providerId).catch(() => ({ data: { services: [] } })),
      ]);

      setProvider(profileResponse.data.provider);
      setServices(servicesResponse.data.services || []);
    } catch (error) {
      console.error('Failed to load provider:', error);
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

  if (!provider) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-neutral-900 mb-2">Provider Not Found</h2>
          <p className="text-neutral-600 mb-6">The provider you're looking for doesn't exist.</p>
          <Link to="/services" className="text-primary hover:text-primary-600 font-medium">
            Browse All Services →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="w-32 h-32 bg-primary-100 rounded-full flex items-center justify-center text-primary font-bold text-4xl">
                {provider.businessName?.charAt(0) || provider.userId?.name?.charAt(0) || 'P'}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-neutral-900 mb-2">
                    {provider.businessName || provider.userId?.name}
                  </h1>
                  {provider.category && (
                    <div className="flex items-center gap-2 text-neutral-600 mb-3">
                      <span className="text-2xl">{provider.category.icon}</span>
                      <span className="text-lg">{provider.category.name}</span>
                    </div>
                  )}
                </div>
                
                {/* CTA Button */}
                <button className="px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-600 transition-colors flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  Contact Provider
                </button>
              </div>

              {/* Rating */}
              {provider.rating > 0 && (
                <div className="mb-4">
                  <RatingDisplay 
                    rating={provider.rating} 
                    reviews={provider.totalReviews} 
                    size="lg" 
                  />
                </div>
              )}

              {/* Key Info */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                {provider.location?.city && (
                  <div className="flex items-center gap-2 text-neutral-600">
                    <MapPin className="w-5 h-5 text-neutral-400" />
                    <div>
                      <p className="text-sm text-neutral-500">Location</p>
                      <p className="font-medium text-neutral-900">
                        {provider.location.area && `${provider.location.area}, `}
                        {provider.location.city}
                      </p>
                    </div>
                  </div>
                )}

                {provider.experience > 0 && (
                  <div className="flex items-center gap-2 text-neutral-600">
                    <Award className="w-5 h-5 text-neutral-400" />
                    <div>
                      <p className="text-sm text-neutral-500">Experience</p>
                      <p className="font-medium text-neutral-900">{provider.experience}+ years</p>
                    </div>
                  </div>
                )}

                {provider.completedBookings > 0 && (
                  <div className="flex items-center gap-2 text-neutral-600">
                    <Briefcase className="w-5 h-5 text-neutral-400" />
                    <div>
                      <p className="text-sm text-neutral-500">Completed Jobs</p>
                      <p className="font-medium text-neutral-900">{provider.completedBookings}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Contact Info */}
              <div className="flex flex-wrap gap-4">
                {provider.phone && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-neutral-50 rounded-lg">
                    <Phone className="w-4 h-4 text-neutral-500" />
                    <span className="text-sm font-medium text-neutral-900">{provider.phone}</span>
                  </div>
                )}
                {provider.workingHours && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-neutral-50 rounded-lg">
                    <Clock className="w-4 h-4 text-neutral-500" />
                    <span className="text-sm font-medium text-neutral-900">
                      {provider.workingHours.start} - {provider.workingHours.end}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bio */}
          {provider.bio && (
            <div className="mt-6 pt-6 border-t border-neutral-200">
              <h3 className="font-semibold text-neutral-900 mb-2">About</h3>
              <p className="text-neutral-600 leading-relaxed">{provider.bio}</p>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-t-2xl border border-b-0 border-neutral-200 px-8 pt-6">
          <div className="flex gap-6 border-b border-neutral-200">
            <button
              onClick={() => setActiveTab('services')}
              className={`pb-4 px-2 font-medium transition-colors relative ${
                activeTab === 'services'
                  ? 'text-primary'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Services ({services.length})
              {activeTab === 'services' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('availability')}
              className={`pb-4 px-2 font-medium transition-colors relative ${
                activeTab === 'availability'
                  ? 'text-primary'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Availability
              {activeTab === 'availability' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-4 px-2 font-medium transition-colors relative ${
                activeTab === 'reviews'
                  ? 'text-primary'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Reviews ({provider.totalReviews || 0})
              {activeTab === 'reviews' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
              )}
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-b-2xl border border-t-0 border-neutral-200 p-8">
          {/* Services Tab */}
          {activeTab === 'services' && (
            <div>
              {services.length === 0 ? (
                <div className="text-center py-12">
                  <Briefcase className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                  <p className="text-neutral-600">No services listed yet</p>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {services.map((service) => (
                    <div key={service._id} className="relative">
                      <ServiceCard service={service} />
                      {isAuthenticated && user?.role !== 'provider' && (
                        <button
                          onClick={() => setBookingModal({ isOpen: true, service })}
                          className="w-full mt-3 px-4 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary-600 transition-colors"
                        >
                          Book This Service
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Availability Tab */}
          {activeTab === 'availability' && (
            <div>
              <h3 className="font-semibold text-neutral-900 mb-4">Working Days</h3>
              {provider.availability && (
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mb-6">
                  {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(
                    (day) => (
                      <div
                        key={day}
                        className={`p-4 rounded-xl text-center ${
                          provider.availability[day]
                            ? 'bg-success/10 text-success border border-success/20'
                            : 'bg-neutral-100 text-neutral-400'
                        }`}
                      >
                        <p className="text-sm font-medium capitalize">{day}</p>
                        <p className="text-xs mt-1">
                          {provider.availability[day] ? 'Available' : 'Closed'}
                        </p>
                      </div>
                    )
                  )}
                </div>
              )}

              {provider.workingHours && (
                <div className="flex items-center gap-2 text-neutral-700">
                  <Clock className="w-5 h-5 text-neutral-500" />
                  <span>
                    Working Hours: {provider.workingHours.start} - {provider.workingHours.end}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Reviews Tab */}
          {activeTab === 'reviews' && (
            <div className="text-center py-12">
              <Star className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
              <p className="text-neutral-600">Reviews feature coming soon</p>
            </div>
          )}
        </div>
      </div>

      {/* Booking Modal */}
      <BookServiceModal
        isOpen={bookingModal.isOpen}
        onClose={() => setBookingModal({ isOpen: false, service: null })}
        service={bookingModal.service}
        provider={provider}
      />
    </div>
  );
};

export default ProviderProfilePage;


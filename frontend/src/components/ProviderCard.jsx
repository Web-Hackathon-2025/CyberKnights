import { Link } from 'react-router-dom';
import { Briefcase, Star } from 'lucide-react';
import RatingDisplay from './RatingDisplay';
import LocationBadge from './LocationBadge';

const ProviderCard = ({ provider }) => {
  return (
    <Link
      to={`/providers/${provider._id}`}
      className="group block bg-white rounded-xl border border-neutral-200 p-6 hover:shadow-xl hover:border-primary-200 transition-all"
    >
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 text-primary font-bold text-xl group-hover:bg-primary-200 transition-colors">
          {provider.businessName?.charAt(0) || provider.userId?.name?.charAt(0) || 'P'}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg text-neutral-900 group-hover:text-primary transition-colors mb-1">
            {provider.businessName || provider.userId?.name || 'Provider'}
          </h3>

          {/* Category */}
          {provider.category && (
            <div className="inline-flex items-center gap-1 text-sm text-neutral-600 mb-3">
              <span>{provider.category.icon}</span>
              <span>{provider.category.name}</span>
            </div>
          )}

          {/* Rating */}
          {provider.rating > 0 && (
            <div className="mb-3">
              <RatingDisplay 
                rating={provider.rating} 
                reviews={provider.totalReviews || 0} 
                size="sm" 
              />
            </div>
          )}

          {/* Location */}
          {provider.location?.city && (
            <LocationBadge 
              city={provider.location.city} 
              area={provider.location.area} 
              size="sm" 
              className="mb-3"
            />
          )}

          {/* Stats */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-500">
            {provider.experience > 0 && (
              <span>{provider.experience}+ years exp.</span>
            )}
            {provider.completedBookings > 0 && (
              <span>{provider.completedBookings} jobs completed</span>
            )}
          </div>

          {/* Bio (if space allows) */}
          {provider.bio && (
            <p className="mt-3 text-sm text-neutral-600 line-clamp-2">
              {provider.bio}
            </p>
          )}
        </div>
      </div>

      {/* Services count badge */}
      {provider.servicesCount > 0 && (
        <div className="mt-4 pt-4 border-t border-neutral-100 flex items-center gap-2 text-sm text-neutral-600">
          <Briefcase className="w-4 h-4 text-neutral-400" />
          <span>{provider.servicesCount} {provider.servicesCount === 1 ? 'service' : 'services'} offered</span>
        </div>
      )}
    </Link>
  );
};

export default ProviderCard;


import { MapPin } from 'lucide-react';

const LocationBadge = ({ city, area, distance, size = 'md', className = '' }) => {
  const sizes = {
    sm: {
      text: 'text-xs',
      icon: 'w-3 h-3',
    },
    md: {
      text: 'text-sm',
      icon: 'w-4 h-4',
    },
    lg: {
      text: 'text-base',
      icon: 'w-5 h-5',
    },
  };

  const sizeConfig = sizes[size] || sizes.md;

  const locationText = () => {
    if (distance) {
      return `${distance} km away`;
    }
    if (area && city) {
      return `${area}, ${city}`;
    }
    if (city) {
      return city;
    }
    return 'Location not specified';
  };

  return (
    <div className={`inline-flex items-center gap-1.5 text-neutral-600 ${className}`}>
      <MapPin className={`${sizeConfig.icon} text-neutral-400`} />
      <span className={`${sizeConfig.text}`}>{locationText()}</span>
    </div>
  );
};

export default LocationBadge;


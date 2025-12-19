import { Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';
import PriceTag from './PriceTag';

const ServiceCard = ({ service, provider, onClick }) => {
  const CardWrapper = onClick || !provider ? 'div' : Link;
  const wrapperProps = provider && !onClick ? { to: `/providers/${provider._id}` } : {};

  return (
    <CardWrapper
      {...wrapperProps}
      onClick={onClick}
      className="group bg-white rounded-xl border border-neutral-200 p-6 hover:shadow-lg hover:border-primary-200 transition-all cursor-pointer"
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-primary-100 transition-colors">
          {service.category?.icon ? (
            <span className="text-2xl">{service.category.icon}</span>
          ) : (
            <Briefcase className="w-6 h-6 text-primary" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-neutral-900 mb-1 group-hover:text-primary transition-colors">
            {service.name}
          </h3>
          
          {service.description && (
            <p className="text-sm text-neutral-600 mb-3 line-clamp-2">
              {service.description}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-3">
            <PriceTag 
              price={service.price} 
              priceType={service.priceType} 
              size="md" 
            />
            
            {service.duration && (
              <span className="text-xs text-neutral-500">
                ~{service.duration} mins
              </span>
            )}
          </div>

          {provider && (
            <div className="mt-3 pt-3 border-t border-neutral-100">
              <p className="text-sm text-neutral-600">
                by <span className="font-medium text-neutral-900">{provider.businessName || provider.userId?.name}</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </CardWrapper>
  );
};

export default ServiceCard;


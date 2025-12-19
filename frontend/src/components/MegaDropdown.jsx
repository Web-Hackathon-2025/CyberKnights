import { Link } from 'react-router-dom';

const MegaDropdown = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  // Placeholder categories - these should come from your API
  const categories = [
    { id: 1, name: 'Plumbing', icon: '🔧', slug: 'plumbing' },
    { id: 2, name: 'Electrical', icon: '⚡', slug: 'electrical' },
    { id: 3, name: 'Carpentry', icon: '🪚', slug: 'carpentry' },
    { id: 4, name: 'Painting', icon: '🎨', slug: 'painting' },
    { id: 5, name: 'Cleaning', icon: '🧹', slug: 'cleaning' },
    { id: 6, name: 'AC Repair', icon: '❄️', slug: 'ac-repair' },
  ];

  return (
    <div 
      className="absolute top-full left-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-neutral-200 py-4 z-50"
      onMouseEnter={() => {}}
      onMouseLeave={onClose}
    >
      <div className="px-4 pb-3 border-b border-neutral-200">
        <h3 className="text-sm font-semibold text-neutral-900">Browse by Category</h3>
      </div>
      
      <div className="py-2">
        {categories.map((category) => (
          <Link
            key={category.id}
            to={`/services/${category.slug}`}
            className="flex items-center gap-3 px-4 py-2 hover:bg-neutral-50 transition-colors"
            onClick={onClose}
          >
            <span className="text-xl">{category.icon}</span>
            <span className="text-neutral-700 font-medium">{category.name}</span>
          </Link>
        ))}
      </div>
      
      <div className="px-4 pt-3 border-t border-neutral-200">
        <Link
          to="/services"
          className="text-primary text-sm font-medium hover:text-primary-600 flex items-center gap-1"
          onClick={onClose}
        >
          View All Services
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default MegaDropdown;


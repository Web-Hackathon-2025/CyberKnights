import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { publicProviderService } from '../services/publicProviderService';
import { categoryService } from '../services/categoryService';
import ProviderCard from '../components/ProviderCard';
import { Search, SlidersHorizontal, X } from 'lucide-react';

const ServiceProvidersPage = () => {
  const { categorySlug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [providers, setProviders] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    city: searchParams.get('city') || '',
    minRating: searchParams.get('minRating') || '',
    sort: searchParams.get('sort') || 'rating',
  });

  const pakistaniCities = [
    'Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad',
    'Multan', 'Peshawar', 'Quetta', 'Sialkot', 'Gujranwala'
  ];

  useEffect(() => {
    if (categorySlug) {
      loadCategoryAndProviders();
    }
  }, [categorySlug, filters]);

  const loadCategoryAndProviders = async () => {
    try {
      setLoading(true);
      const [categoryResponse] = await Promise.all([
        categoryService.getCategoryBySlug(categorySlug),
      ]);

      setCategory(categoryResponse.data.category);

      // Load providers for this category
      const providerParams = {
        category: categoryResponse.data.category._id,
        ...filters,
      };

      const providersResponse = await publicProviderService.searchProviders(providerParams);
      setProviders(providersResponse.data.providers || []);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    // Update URL params
    const params = {};
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v) params[k] = v;
    });
    setSearchParams(params);
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      city: '',
      minRating: '',
      sort: 'rating',
    });
    setSearchParams({});
  };

  const hasActiveFilters = filters.search || filters.city || filters.minRating;

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
          <div className="flex items-center gap-3 mb-3">
            {category?.icon && <span className="text-4xl">{category.icon}</span>}
            <h1 className="text-3xl font-bold text-neutral-900">
              {category?.name || 'Providers'}
            </h1>
          </div>
          {category?.description && (
            <p className="text-lg text-neutral-600">{category.description}</p>
          )}
          <p className="text-sm text-neutral-500 mt-2">
            {providers.length} provider{providers.length !== 1 && 's'} found
          </p>
        </div>

        {/* Filters Bar */}
        <div className="bg-white rounded-xl border border-neutral-200 p-4 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type="text"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                placeholder="Search by name..."
                className="w-full pl-10 pr-4 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* City Filter */}
            <select
              value={filters.city}
              onChange={(e) => handleFilterChange('city', e.target.value)}
              className="px-4 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">All Cities</option>
              {pakistaniCities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>

            {/* Rating Filter */}
            <select
              value={filters.minRating}
              onChange={(e) => handleFilterChange('minRating', e.target.value)}
              className="px-4 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Any Rating</option>
              <option value="4">4+ Stars</option>
              <option value="4.5">4.5+ Stars</option>
            </select>

            {/* Sort */}
            <select
              value={filters.sort}
              onChange={(e) => handleFilterChange('sort', e.target.value)}
              className="px-4 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="rating">Highest Rated</option>
              <option value="reviews">Most Reviews</option>
              <option value="experience">Most Experience</option>
            </select>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-neutral-600 hover:text-neutral-900 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors"
              >
                <X className="w-4 h-4" />
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Providers Grid */}
        {providers.length === 0 ? (
          <div className="bg-white rounded-xl border border-neutral-200 p-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-neutral-400" />
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                No Providers Found
              </h3>
              <p className="text-neutral-600 mb-6">
                {hasActiveFilters 
                  ? 'Try adjusting your filters to find more results.'
                  : 'No providers are currently available in this category.'}
              </p>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-600 transition-colors"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {providers.map((provider) => (
              <ProviderCard key={provider._id} provider={provider} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceProvidersPage;


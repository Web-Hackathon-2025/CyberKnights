import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { categoryService } from '../services/categoryService';
import { Search, Grid3X3 } from 'lucide-react';

const ServicesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const response = await categoryService.getAllCategories();
      setCategories(response.data.categories || []);
    } catch (error) {
      console.error('Failed to load categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCategories = categories.filter(cat => 
    cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cat.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query) {
      setSearchParams({ search: query });
    } else {
      setSearchParams({});
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
    <div className="min-h-screen bg-neutral-50 pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-neutral-900 mb-4">
            Browse Services
          </h1>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Find the perfect service professional for your needs
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search for a service..."
              className="w-full pl-12 pr-4 py-4 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm"
            />
          </div>
        </div>

        {/* Categories Grid */}
        {filteredCategories.length === 0 ? (
          <div className="bg-white rounded-xl border border-neutral-200 p-12">
            <div className="text-center">
              <Grid3X3 className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-neutral-900 mb-2">
                No Services Found
              </h2>
              <p className="text-neutral-600">
                {searchQuery 
                  ? `No services match "${searchQuery}". Try a different search term.`
                  : 'No services are currently available.'}
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredCategories.map((category) => (
                <Link
                  key={category._id}
                  to={`/services/${category.slug}`}
                  className="group bg-white rounded-2xl border border-neutral-200 p-6 hover:shadow-xl hover:border-primary-200 transition-all"
                >
                  <div className="text-center">
                    <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">
                      {category.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-neutral-900 group-hover:text-primary transition-colors mb-2">
                      {category.name}
                    </h3>
                    {category.description && (
                      <p className="text-sm text-neutral-600 line-clamp-2">
                        {category.description}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center mt-12">
              <p className="text-neutral-600">
                Can't find what you're looking for?{' '}
                <Link to="/contact" className="text-primary hover:text-primary-600 font-medium">
                  Contact us
                </Link>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ServicesPage;


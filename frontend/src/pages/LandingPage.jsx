import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const LandingPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/services?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const serviceCategories = [
    { id: 1, name: 'Plumbing', icon: '🔧', slug: 'plumbing', description: 'Repairs & installations' },
    { id: 2, name: 'Electrical', icon: '⚡', slug: 'electrical', description: 'Wiring & installations' },
    { id: 3, name: 'Carpentry', icon: '🪚', slug: 'carpentry', description: 'Furniture & woodwork' },
    { id: 4, name: 'Painting', icon: '🎨', slug: 'painting', description: 'Interior & exterior' },
    { id: 5, name: 'Cleaning', icon: '🧹', slug: 'cleaning', description: 'Home & office cleaning' },
    { id: 6, name: 'AC Repair', icon: '❄️', slug: 'ac-repair', description: 'Service & maintenance' },
    { id: 7, name: 'Tutoring', icon: '📚', slug: 'tutoring', description: 'Academic & skill training' },
    { id: 8, name: 'Technician', icon: '🔨', slug: 'technician', description: 'General repairs' },
  ];

  const howItWorks = [
    {
      step: 1,
      title: 'Search Service',
      description: 'Browse through our wide range of services or search for what you need',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
    },
    {
      step: 2,
      title: 'Book Provider',
      description: 'Choose from verified local professionals and book at your convenience',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      step: 3,
      title: 'Get It Done',
      description: 'Sit back and relax while our experts handle the job professionally',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  const features = [
    {
      title: 'Verified Professionals',
      description: 'All service providers are background verified and skilled',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
    {
      title: 'Transparent Pricing',
      description: 'No hidden charges. Know the cost before you book',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: 'Quick Response',
      description: 'Get connected with providers within minutes',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
    {
      title: 'Secure Payments',
      description: 'Multiple payment options with secure transactions',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      ),
    },
  ];

  const stats = [
    { value: '10,000+', label: 'Happy Customers' },
    { value: '500+', label: 'Verified Providers' },
    { value: '50+', label: 'Service Categories' },
    { value: '4.8★', label: 'Average Rating' },
  ];

  const testimonials = [
    {
      name: 'Ahmed Khan',
      role: 'Homeowner',
      content: 'Found an excellent electrician within 30 minutes. The work was done professionally and at a fair price. Highly recommend Karigar!',
      avatar: 'AK',
    },
    {
      name: 'Fatima Noor',
      role: 'Business Owner',
      content: 'We use Karigar for all our office maintenance needs. The providers are always punctual and professional. Great service!',
      avatar: 'FN',
    },
    {
      name: 'Rahul Sharma',
      role: 'Apartment Resident',
      content: 'The AC repair service was fantastic. The technician was knowledgeable and fixed the issue quickly. Will definitely use again.',
      avatar: 'RS',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 via-white to-primary-50 pt-12 sm:pt-16 md:pt-20 pb-16 sm:pb-20 md:pb-24 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-96 h-96 bg-primary-100 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 rounded-full mb-6">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
              <span className="text-sm font-medium text-primary-700">Trusted by 10,000+ customers</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-neutral-900 leading-tight mb-6">
              Find Reliable <span className="text-primary">Karigar</span>
              <span className="block mt-2">Near You</span>
            </h1>

            <p className="text-lg sm:text-xl text-neutral-600 mb-10 max-w-3xl mx-auto leading-relaxed">
              A hyperlocal services marketplace connecting you with trusted plumbers, electricians, carpenters, 
              and skilled professionals in your area. Quality work, transparent pricing, and peace of mind.
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-6 sm:mb-8">
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 p-1.5 sm:p-2 bg-white rounded-xl sm:rounded-2xl shadow-xl shadow-primary-100/50 border border-neutral-200">
                <div className="flex-1 relative">
                  <svg className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 sm:w-5 h-4 sm:h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="What service do you need?"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 text-sm sm:text-base md:text-lg text-neutral-900 placeholder-neutral-400 bg-transparent border-0 focus:outline-none focus:ring-0"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-primary text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl hover:bg-primary-600 transition-all font-semibold shadow-lg hover:shadow-xl sm:transform sm:hover:-translate-y-0.5 flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  <span>Search</span>
                  <svg className="w-4 sm:w-5 h-4 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            </form>

            {/* Popular Searches */}
            <div className="flex flex-wrap gap-2 justify-center items-center">
              <span className="text-xs sm:text-sm text-neutral-500 font-medium">Popular:</span>
              {['Plumber', 'Electrician', 'Tutor', 'Cleaner'].map((term) => (
                <button
                  key={term}
                  onClick={() => setSearchQuery(term)}
                  className="text-xs sm:text-sm px-2.5 sm:px-3 py-1 bg-white border border-neutral-200 rounded-full text-neutral-600 hover:border-primary hover:text-primary hover:bg-primary-50 transition-all"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Service Categories */}
      <section className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 md:mb-14">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-neutral-900 mb-3 sm:mb-4">
              Popular Services
            </h2>
            <p className="text-base sm:text-lg text-neutral-600 max-w-2xl mx-auto px-4">
              Browse through our most requested services and find the right professional for your needs
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {serviceCategories.map((category) => (
              <Link
                key={category.id}
                to={`/services/${category.slug}`}
                className="group p-4 sm:p-6 bg-neutral-50 rounded-xl sm:rounded-2xl hover:bg-primary hover:shadow-xl transition-all duration-300 border border-transparent hover:border-primary-200 text-center"
              >
                <div className="text-3xl sm:text-4xl mb-2 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                  {category.icon}
                </div>
                <h3 className="text-sm sm:text-base md:text-lg font-semibold text-neutral-900 group-hover:text-white mb-1 transition-colors">
                  {category.name}
                </h3>
                <p className="text-xs sm:text-sm text-neutral-500 group-hover:text-primary-100 transition-colors line-clamp-2">
                  {category.description}
                </p>
              </Link>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              to="/services"
              className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all"
            >
              View All Services
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-neutral-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-14 md:mb-16">
            <span className="inline-block px-4 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-4">
              Simple Process
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-4">
              How Karigar Works
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Get your work done in three simple steps
            </p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-16 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-primary-200 via-primary to-primary-200"></div>

            {howItWorks.map((item, index) => (
              <div key={item.step} className="relative text-center px-4">
                <div className="inline-flex items-center justify-center w-14 sm:w-16 h-14 sm:h-16 bg-primary text-white rounded-xl sm:rounded-2xl mb-4 sm:mb-6 shadow-lg shadow-primary/30 relative z-10">
                  {item.icon}
                </div>
                <div className="absolute -top-2 -right-2 w-7 sm:w-8 h-7 sm:h-8 bg-primary-100 text-primary font-bold rounded-full flex items-center justify-center text-xs sm:text-sm z-20">
                  {item.step}
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-neutral-900 mb-2 sm:mb-3">
                  {item.title}
                </h3>
                <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-14 md:py-16 bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1 sm:mb-2">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm md:text-base text-primary-100 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
            <div>
              <span className="inline-block px-4 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-4">
                Why Karigar
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-6">
                Your Trusted Partner for Home Services
              </h2>
              <p className="text-lg text-neutral-600 mb-8 leading-relaxed">
                We connect you with skilled professionals who are vetted, trained, and committed to delivering quality service every time.
              </p>

              <div className="grid sm:grid-cols-2 gap-6">
                {features.map((feature, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary-50 text-primary rounded-xl flex items-center justify-center">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-neutral-900 mb-1">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-neutral-600">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Image/Illustration Placeholder */}
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-primary-100 to-primary-50 rounded-3xl flex items-center justify-center overflow-hidden">
                <div className="text-center p-8">
                  <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-16 h-16 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-neutral-900 mb-2">Quality Service</h3>
                  <p className="text-neutral-600">Professional work guaranteed</p>
                </div>
              </div>
              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-success/10 rounded-2xl flex items-center justify-center animate-bounce" style={{ animationDuration: '3s' }}>
                <span className="text-4xl">✓</span>
              </div>
              <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-primary-100 rounded-2xl flex items-center justify-center animate-bounce" style={{ animationDuration: '2.5s' }}>
                <span className="text-3xl">⭐</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 sm:py-16 md:py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 md:mb-14">
            <span className="inline-block px-4 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-4">
              Testimonials
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-4">
              What Our Customers Say
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Don't just take our word for it - hear from our satisfied customers
            </p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white p-6 sm:p-8 rounded-xl sm:rounded-2xl shadow-sm hover:shadow-lg transition-shadow border border-neutral-100"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-neutral-600 mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-primary font-semibold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-neutral-900">{testimonial.name}</div>
                    <div className="text-sm text-neutral-500">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Become a Provider CTA */}
      <section className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-primary-600 to-primary rounded-2xl sm:rounded-3xl p-6 sm:p-10 lg:p-16 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -translate-y-1/2 translate-x-1/2"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full translate-y-1/2 -translate-x-1/2"></div>
            </div>

            <div className="relative grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                  Are You a Service Professional?
                </h2>
                <p className="text-primary-100 text-lg mb-8 leading-relaxed">
                  Join our network of trusted providers and grow your business. Get access to thousands of customers looking for your services.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link
                    to="/signup?role=provider"
                    className="inline-flex items-center gap-2 bg-white text-primary px-8 py-4 rounded-xl font-semibold hover:bg-primary-50 transition-colors shadow-lg"
                  >
                    Register as Provider
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                  <Link
                    to="/for-providers"
                    className="inline-flex items-center gap-2 border-2 border-white/30 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-colors"
                  >
                    Learn More
                  </Link>
                </div>
              </div>
              <div className="hidden lg:flex justify-center">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div className="bg-white/10 backdrop-blur rounded-2xl p-6 text-white">
                      <div className="text-3xl font-bold">₹50K+</div>
                      <div className="text-primary-100">Avg. Monthly Earnings</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur rounded-2xl p-6 text-white">
                      <div className="text-3xl font-bold">Free</div>
                      <div className="text-primary-100">Registration</div>
                    </div>
                  </div>
                  <div className="space-y-4 mt-8">
                    <div className="bg-white/10 backdrop-blur rounded-2xl p-6 text-white">
                      <div className="text-3xl font-bold">24/7</div>
                      <div className="text-primary-100">Support Available</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur rounded-2xl p-6 text-white">
                      <div className="text-3xl font-bold">1000+</div>
                      <div className="text-primary-100">Active Providers</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-12 sm:py-16 md:py-20 bg-neutral-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-neutral-400 mb-8 sm:mb-10 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust Karigar for their home service needs
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="bg-primary text-white px-10 py-4 rounded-xl hover:bg-primary-500 transition-all font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-lg"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/signup"
                  className="bg-primary text-white px-10 py-4 rounded-xl hover:bg-primary-500 transition-all font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-lg"
                >
                  Create Free Account
                </Link>
                <Link
                  to="/login"
                  className="bg-neutral-800 text-white px-10 py-4 rounded-xl hover:bg-neutral-700 transition-all font-semibold border border-neutral-700 text-lg"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;

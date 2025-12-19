import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import MegaDropdown from '../MegaDropdown';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false);
  const profileRef = useRef(null);
  const servicesDropdownRef = useRef(null);
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (servicesDropdownRef.current && !servicesDropdownRef.current.contains(event.target)) {
        setIsServicesDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    setIsProfileOpen(false);
    navigate('/');
  };

  return (
    <nav className="bg-white/95 backdrop-blur-md shadow-sm fixed w-full top-0 z-50 border-b border-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 relative">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">K</span>
            </div>
            <span className="text-2xl font-bold text-neutral-900">Karigar</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1 relative">
            <Link to="/" className="text-neutral-700 hover:text-primary hover:bg-primary-50 px-4 py-2 rounded-lg transition-all font-medium">
              Home
            </Link>
            
            {/* Services Dropdown */}
            <div 
              className="relative" 
              ref={servicesDropdownRef}
              onMouseEnter={() => setIsServicesDropdownOpen(true)}
              onMouseLeave={() => setIsServicesDropdownOpen(false)}
            >
              <button
                onClick={() => setIsServicesDropdownOpen(!isServicesDropdownOpen)}
                className="text-neutral-700 hover:text-primary hover:bg-primary-50 px-4 py-2 rounded-lg transition-all font-medium flex items-center gap-1"
              >
                Services
                <svg 
                  className={`w-4 h-4 transition-transform ${isServicesDropdownOpen ? 'rotate-180' : ''}`} 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              <MegaDropdown 
                isOpen={isServicesDropdownOpen} 
                onClose={() => setIsServicesDropdownOpen(false)} 
              />
            </div>
            
            <Link to="/how-it-works" className="text-neutral-700 hover:text-primary hover:bg-primary-50 px-4 py-2 rounded-lg transition-all font-medium">
              How It Works
            </Link>
            <Link to="/for-providers" className="text-neutral-700 hover:text-primary hover:bg-primary-50 px-4 py-2 rounded-lg transition-all font-medium">
              For Providers
            </Link>

            {isAuthenticated && (
              <>
                <Link 
                  to="/dashboard" 
                  className="text-neutral-700 hover:text-primary hover:bg-primary-50 px-4 py-2 rounded-lg transition-all font-medium"
                >
                  Dashboard
                </Link>
                {user?.role === 'user' && (
                  <Link 
                    to="/bookings" 
                    className="text-neutral-700 hover:text-primary hover:bg-primary-50 px-4 py-2 rounded-lg transition-all font-medium"
                  >
                    My Bookings
                  </Link>
                )}
              </>
            )}
          </div>

          {/* CTA Buttons / User Profile */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-3 hover:bg-neutral-50 rounded-xl px-3 py-2 transition-colors border border-transparent hover:border-neutral-200"
                >
                  <div className="w-9 h-9 bg-primary rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-neutral-900 max-w-[120px] truncate">
                      {user?.name}
                    </p>
                    <p className="text-xs text-neutral-500 capitalize">{user?.role}</p>
                  </div>
                  <svg
                    className={`w-4 h-4 text-neutral-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-neutral-200 py-2 z-50">
                    <div className="px-4 py-3 border-b border-neutral-100">
                      <p className="text-sm font-medium text-neutral-900">
                        {user?.name}
                      </p>
                      <p className="text-sm text-neutral-500 truncate">{user?.email}</p>
                    </div>
                    <Link
                      to="/dashboard"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <svg className="w-4 h-4 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                      Dashboard
                    </Link>
                    <Link
                      to="/profile"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <svg className="w-4 h-4 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      View Profile
                    </Link>
                    {user?.role === 'user' && (
                      <Link
                        to="/bookings"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <svg className="w-4 h-4 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        My Bookings
                      </Link>
                    )}
                    <div className="border-t border-neutral-100 my-2"></div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full text-left px-4 py-2.5 text-sm text-error hover:bg-error-50 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="text-neutral-700 hover:text-primary font-medium transition-colors px-4 py-2"
                >
                  Sign In
                </Link>
                <Link 
                  to="/signup" 
                  className="bg-primary text-white px-6 py-2.5 rounded-xl hover:bg-primary-600 transition-all font-medium shadow-sm hover:shadow-md"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-neutral-700 p-2 hover:bg-neutral-100 rounded-lg transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-neutral-100 bg-white">
            <div className="flex flex-col space-y-1">
              <Link
                to="/"
                className="text-neutral-700 hover:text-primary hover:bg-primary-50 px-4 py-3 rounded-lg transition-all font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/services"
                className="text-neutral-700 hover:text-primary hover:bg-primary-50 px-4 py-3 rounded-lg transition-all font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Services
              </Link>
              <Link
                to="/how-it-works"
                className="text-neutral-700 hover:text-primary hover:bg-primary-50 px-4 py-3 rounded-lg transition-all font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                How It Works
              </Link>
              <Link
                to="/for-providers"
                className="text-neutral-700 hover:text-primary hover:bg-primary-50 px-4 py-3 rounded-lg transition-all font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                For Providers
              </Link>

              {isAuthenticated && (
                <>
                  <Link
                    to="/dashboard"
                    className="text-neutral-700 hover:text-primary hover:bg-primary-50 px-4 py-3 rounded-lg transition-all font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  {user?.role === 'user' && (
                    <Link
                      to="/bookings"
                      className="text-neutral-700 hover:text-primary hover:bg-primary-50 px-4 py-3 rounded-lg transition-all font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      My Bookings
                    </Link>
                  )}
                </>
              )}

              <div className="border-t border-neutral-100 my-3 mx-4"></div>
              
              {isAuthenticated ? (
                <>
                  <div className="flex items-center space-x-3 px-4 py-3">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-neutral-900">
                        {user?.name}
                      </p>
                      <p className="text-xs text-neutral-500 capitalize">{user?.role}</p>
                    </div>
                  </div>
                  <Link
                    to="/profile"
                    className="text-neutral-700 hover:text-primary hover:bg-primary-50 px-4 py-3 rounded-lg transition-all font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    View Profile
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="text-error hover:bg-error-50 px-4 py-3 rounded-lg transition-all font-medium text-left"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-3 px-4 pt-2">
                  <Link
                    to="/login"
                    className="text-center text-primary border-2 border-primary px-6 py-3 rounded-xl font-medium hover:bg-primary-50 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="text-center bg-primary text-white px-6 py-3 rounded-xl font-medium hover:bg-primary-600 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

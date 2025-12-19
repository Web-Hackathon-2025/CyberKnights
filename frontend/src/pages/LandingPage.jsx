import { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthModal from '../components/ui/AuthModal';

const LandingPage = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-linear-to-br from-primary-50 via-white to-neutral-50">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Logo */}
            <div className="inline-flex items-center justify-center mb-8">
              <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-3xl">K</span>
              </div>
            </div>

            {/* Heading */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-neutral-900 leading-tight mb-6">
              Karigar
            </h1>
            <p className="text-2xl text-neutral-600 mb-4 font-medium">
              Hyperlocal Services Marketplace
            </p>
            <p className="text-lg text-neutral-500 mb-12 max-w-2xl mx-auto">
              Connecting customers with local service providers in their area
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="bg-primary text-white px-10 py-4 rounded-xl hover:bg-primary-600 transition-all font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-lg"
              >
                Get Started
              </button>
              <Link
                to="/login"
                className="bg-white text-primary px-10 py-4 rounded-xl hover:bg-neutral-50 transition-all font-semibold border-2 border-primary text-center inline-block text-lg"
              >
                Sign In
              </Link>
            </div>

            {/* Feature Pills */}
            <div className="flex flex-wrap gap-3 justify-center max-w-2xl mx-auto">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-neutral-200">
                <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium text-neutral-700">Email & Google OAuth</span>
              </span>
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-neutral-200">
                <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium text-neutral-700">Role-Based Access Control</span>
              </span>
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-neutral-200">
                <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium text-neutral-700">Email Verification</span>
              </span>
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-neutral-200">
                <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium text-neutral-700">Admin Panel</span>
              </span>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-primary-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </section>

      {/* Simple Footer Note */}
      <section className="py-12 bg-neutral-50 border-t border-neutral-200">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <p className="text-neutral-500 text-sm">
            MVP Authentication System • Customers & Service Providers • Admin Management
          </p>
              <p className="text-neutral-500 text-sm">
                Verification, reset, & notifications
              </p>
            </div>

            {/* Feature 4 */}
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">Security First</h3>
              <p className="text-neutral-500 text-sm">
                JWT tokens, rate limiting, validation
              </p>
            </div>
    
      </section>

      {/* Tech Stack Section */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-4">
              Built with Modern Technologies
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-2xl font-bold text-neutral-900 mb-2">React</div>
              <div className="text-neutral-500 text-sm">Frontend</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-neutral-900 mb-2">Node.js</div>
              <div className="text-neutral-500 text-sm">Backend</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-neutral-900 mb-2">MongoDB</div>
              <div className="text-neutral-500 text-sm">Database</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-neutral-900 mb-2">Express</div>
              <div className="text-neutral-500 text-sm">API</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Ready to Start Building?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Sign up now and start developing your application
          </p>
        </div>
      </section>

      {/* Auth Modal */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
};

export default LandingPage;

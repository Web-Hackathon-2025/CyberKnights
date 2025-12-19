import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const PendingApprovalPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    // Auto-refresh every 10 seconds to check approval status
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          window.location.reload();
          return 10;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          {/* Icon */}
          <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>

          {/* Content */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-neutral-900 mb-4">
              Application Under Review
            </h1>
            <p className="text-lg text-neutral-600 mb-8">
              Thank you for applying to become a service provider on Karigar! 
              Your application is currently being reviewed by our admin team.
            </p>

            {/* Status Card */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
              <div className="flex items-start space-x-4">
                <div className="shrink-0">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="text-left flex-1">
                  <h3 className="font-semibold text-yellow-800 mb-2">What's Next?</h3>
                  <ul className="space-y-2 text-sm text-yellow-700">
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Our team will review your application within 24-48 hours</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>You'll receive an email notification once your application is processed</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>If approved, you'll be able to complete your profile and start receiving service requests</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* User Info */}
            <div className="bg-neutral-50 rounded-lg p-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="text-left">
                  <span className="text-neutral-500">Name:</span>
                  <span className="ml-2 font-semibold text-neutral-900">{user?.name}</span>
                </div>
                <div className="text-left">
                  <span className="text-neutral-500">Email:</span>
                  <span className="ml-2 font-semibold text-neutral-900">{user?.email}</span>
                </div>
                <div className="text-left">
                  <span className="text-neutral-500">Status:</span>
                  <span className="ml-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Pending Approval
                    </span>
                  </span>
                </div>
                <div className="text-left">
                  <span className="text-neutral-500">Role:</span>
                  <span className="ml-2 font-semibold text-neutral-900 capitalize">{user?.role}</span>
                </div>
              </div>
            </div>

            {/* Auto-refresh indicator */}
            <p className="text-sm text-neutral-500 mb-6">
              This page will automatically refresh in <span className="font-semibold text-primary">{countdown}s</span> to check your approval status
            </p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center justify-center px-6 py-3 border border-primary text-primary rounded-lg hover:bg-primary-50 transition-colors font-medium"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Check Status Now
              </button>
              <button
                onClick={handleLogout}
                className="inline-flex items-center justify-center px-6 py-3 bg-neutral-200 text-neutral-700 rounded-lg hover:bg-neutral-300 transition-colors font-medium"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Support */}
          <div className="mt-8 pt-6 border-t border-neutral-200 text-center">
            <p className="text-sm text-neutral-500">
              Have questions about your application?{' '}
              <a href={`mailto:${import.meta.env.VITE_SUPPORT_EMAIL || 'support@karigar.com'}`} className="text-primary hover:text-primary-400 font-medium">
                Contact Support
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PendingApprovalPage;

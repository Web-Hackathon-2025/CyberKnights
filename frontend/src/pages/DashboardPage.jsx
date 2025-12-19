import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import providerService from '../services/providerService';

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [providerStatus, setProviderStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role === 'provider') {
      checkProviderStatus();
    } else {
      setLoading(false);
    }
  }, [user]);

  const checkProviderStatus = async () => {
    try {
      const response = await providerService.getProviderProfile();
      if (response.success) {
        setProviderStatus(response.data);
        
        console.log('Dashboard: Provider status check:', {
          isProfileComplete: response.data.isProfileComplete,
          isApproved: response.data.isApproved,
          rejectedAt: response.data.rejectedAt
        });
        
        // Provider flow: Complete Profile → Submit for Approval → Admin Approves → Access Dashboard
        if (!response.data.isProfileComplete) {
          // Step 1: Profile not complete - redirect to complete profile
          console.log('Dashboard: Redirecting to complete-profile (not complete)');
          navigate('/provider/complete-profile', { replace: true });
        } else if (!response.data.isApproved && !response.data.rejectedAt) {
          // Step 2: Profile complete but waiting for admin approval
          console.log('Dashboard: Redirecting to pending-approval (waiting for approval)');
          navigate('/provider/pending-approval', { replace: true });
        } else if (response.data.rejectedAt) {
          // Rejected - stay on dashboard with rejection info
          console.log('Dashboard: Staying on dashboard (rejected)');
        } else if (response.data.isApproved && response.data.isProfileComplete) {
          // Step 3: Approved and complete - can use dashboard
          console.log('Dashboard: Staying on dashboard (approved and complete)');
          // Stay on dashboard
        }
      }
    } catch (error) {
      // If provider profile doesn't exist yet, they haven't registered as provider
      console.log('No provider profile found', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterAsProvider = async () => {
    try {
      await providerService.registerAsProvider();
      navigate('/provider/pending-approval', { replace: true });
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to register as provider');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Email not verified warning
  if (!user?.isEmailVerified) {
    return (
      <div className="min-h-screen bg-neutral-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-yellow-50 border-2 border-yellow-300 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-neutral-900 mb-2">Email Verification Required</h2>
            <p className="text-neutral-600 mb-4">Please verify your email address to access all features.</p>
            <Link to="/check-email" state={{ email: user.email }} className="inline-block bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-400 transition-colors font-medium">
              Verify Email
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Provider rejected
  if (user?.role === 'provider' && providerStatus?.rejectedAt) {
    return (
      <div className="min-h-screen bg-neutral-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-red-50 border-2 border-red-300 rounded-2xl p-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-neutral-900 mb-2 text-center">Application Not Approved</h2>
            <p className="text-neutral-600 mb-4 text-center">Unfortunately, your provider application was not approved.</p>
            {providerStatus.rejectionReason && (
              <div className="bg-white rounded-lg p-4 mb-4">
                <p className="text-sm font-semibold text-neutral-700 mb-1">Reason:</p>
                <p className="text-neutral-600">{providerStatus.rejectionReason}</p>
              </div>
            )}
            <div className="text-center">
              <p className="text-sm text-neutral-500 mb-4">You can browse services as a customer or contact support for more information.</p>
              <Link to="/browse" className="inline-block bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-400 transition-colors font-medium">
                Browse Services
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Welcome Header */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-8 text-center">
          <h1 className="text-4xl font-bold text-neutral-900 mb-3">
            Welcome to Karigar! 👋
          </h1>
          <p className="text-lg text-neutral-600 mb-6">
            Hi <span className="font-semibold text-primary">{user?.name}</span>, your account is ready
          </p>
          
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 rounded-lg">
            <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium text-primary">Email Verified</span>
          </div>
        </div>

        {/* Become Provider CTA (for regular users) */}
        {user?.role === 'user' && (
          <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl shadow-sm p-8 mb-8 text-white">
            <h2 className="text-2xl font-bold mb-3">Want to Offer Services?</h2>
            <p className="mb-6 opacity-90">
              Become a service provider on Karigar and connect with customers in your area. 
              Grow your business and manage bookings easily.
            </p>
            <button
              onClick={handleRegisterAsProvider}
              className="bg-white text-primary px-6 py-3 rounded-lg hover:bg-neutral-100 transition-colors font-semibold"
            >
              Register as Service Provider
            </button>
          </div>
        )}

        {/* Account Info */}
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <h2 className="text-xl font-bold text-neutral-900 mb-6">Account Information</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-neutral-100">
              <span className="text-neutral-600">Email</span>
              <span className="font-medium text-neutral-900">{user?.email}</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-neutral-100">
              <span className="text-neutral-600">Role</span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary capitalize">
                {user?.role}
              </span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-neutral-100">
              <span className="text-neutral-600">Member Since</span>
              <span className="font-medium text-neutral-900">
                {new Date(user?.createdAt).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </span>
            </div>
            
            <div className="pt-4">
              <Link 
                to="/profile" 
                className="w-full inline-flex items-center justify-center px-6 py-3 border-2 border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-all font-medium"
              >
                Edit Profile
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

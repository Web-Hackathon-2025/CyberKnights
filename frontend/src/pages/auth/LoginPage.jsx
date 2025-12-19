import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import GoogleOAuthButton from '../../components/ui/GoogleOAuthButton';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState(location.state?.message || '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const response = await login(credentials.email, credentials.password);

      if (response.success) {
        const { user, providerStatus } = response.data;
        
        // Redirect based on role and status
        if (user.role === 'admin') {
          window.location.href = '/admin';
        } else if (user.role === 'provider' && providerStatus) {
          // Provider flow: redirect based on completion status
          if (!providerStatus.isProfileComplete) {
            navigate('/provider/complete-profile', { replace: true });
          } else if (!providerStatus.isApproved && !providerStatus.rejectedAt) {
            navigate('/provider/pending-approval', { replace: true });
          } else {
            navigate('/dashboard');
          }
        } else {
          navigate('/dashboard');
        }
      }
    } catch (err) {
      if (err.response?.data?.message?.includes('verify your email') || err.response?.data?.message?.includes('Email not verified')) {
        navigate('/check-email', { state: { email: credentials.email, fromLogin: true } });
      } else {
        setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = (response) => {
    const { user, providerStatus } = response.data;
    
    // Redirect based on role and status
    if (user.role === 'admin') {
      window.location.href = '/admin';
    } else if (user.role === 'provider' && providerStatus) {
      // Provider flow: redirect based on completion status
      if (!providerStatus.isProfileComplete) {
        navigate('/provider/complete-profile', { replace: true });
      } else if (!providerStatus.isApproved && !providerStatus.rejectedAt) {
        navigate('/provider/pending-approval', { replace: true });
      } else {
        navigate('/dashboard');
      }
    } else {
      navigate('/dashboard');
    }
  };

  const handleGoogleError = (error) => {
    setError(error.response?.data?.message || 'Google sign-in failed. Please try again.');
  };

  return (
    <div className="min-h-screen bg-neutral-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center justify-center space-x-2 mb-6">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-2xl">K</span>
              </div>
              <span className="text-2xl font-bold text-primary">Karigar</span>
            </Link>
            <h2 className="text-3xl font-bold text-neutral-900">Welcome Back</h2>
            <p className="text-neutral-500 mt-2">Sign in to your account</p>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="mb-6 bg-success border border-success px-4 py-3 rounded-lg">
              <p className="text-sm text-white">{successMessage}</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-error border border-error px-4 py-3 rounded-lg">
              <p className="text-sm text-white">{error}</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={credentials.email}
                onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="••••••••"
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <span className="text-sm text-neutral-700">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-sm text-primary hover:text-primary-400">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary-400 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-neutral-500">Or continue with</span>
            </div>
          </div>

          {/* Google Login */}
          <GoogleOAuthButton 
            mode="signin" 
            role="user" 
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
          />

          {/* Sign Up Link */}
          <p className="mt-6 text-center text-sm text-neutral-600">
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary hover:text-primary-400 font-semibold">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

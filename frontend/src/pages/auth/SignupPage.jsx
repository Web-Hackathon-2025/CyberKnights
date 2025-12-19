import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import GoogleOAuthButton from '../../components/ui/GoogleOAuthButton';

const SignupPage = () => {
  const navigate = useNavigate();
  const { signup, googleLogin } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    role: 'user',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      setLoading(false);
      return;
    }

    try {
      const { confirmPassword, ...signupData } = formData;
      const response = await signup(signupData);

      if (response.success) {
        setSuccess(true);
        // Redirect to check email page after 3 seconds
        setTimeout(() => {
          navigate('/check-email', { state: { email: formData.email } });
        }, 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleGoogleSuccess = async (token) => {
    try {
      // Use the selected role when signing up with Google
      const response = await googleLogin(token, formData.role);
      if (response.success) {
        const { user } = response.data;
        
        // Redirect based on role
        if (user.role === 'admin') {
          window.location.href = '/admin';
        } else {
          // Dashboard will handle provider approval status check
          navigate('/dashboard');
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Google sign-up failed. Please try again.');
    }
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
            <h2 className="text-3xl font-bold text-neutral-900">Create Account</h2>
            <p className="text-neutral-500 mt-2">Get started today</p>
          </div>

          {/* Success Message */}
          {success && (
            <div className="mb-6 bg-success border border-success px-4 py-3 rounded-lg">
              <p className="text-sm font-semibold text-white">Success!</p>
              <p className="text-sm text-white">Please check your email to verify your account.</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-error border border-error px-4 py-3 rounded-lg">
              <p className="text-sm text-white">{error}</p>
            </div>
          )}

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                I want to join as
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'user' })}
                  className={`px-4 py-3 rounded-lg border-2 transition-all ${
                    formData.role === 'user'
                      ? 'border-primary bg-primary-50 text-primary font-semibold'
                      : 'border-neutral-300 text-neutral-700 hover:border-neutral-400'
                  }`}
                >
                  Customer
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'provider' })}
                  className={`px-4 py-3 rounded-lg border-2 transition-all ${
                    formData.role === 'provider'
                      ? 'border-primary bg-primary-50 text-primary font-semibold'
                      : 'border-neutral-300 text-neutral-700 hover:border-neutral-400'
                  }`}
                >
                  Service Provider
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-2">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="John Doe"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
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
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="••••••••"
                required
                minLength={8}
              />
              <p className="mt-1 text-xs text-neutral-500">At least 8 characters</p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-700 mb-2">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading || success}
              className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary-400 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
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

          {/* Google Signup */}
          <GoogleOAuthButton 
            mode="signup" 
            role={formData.role}
            onSuccess={handleGoogleSuccess}
          />

          {/* Login Link */}
          <p className="mt-6 text-center text-sm text-neutral-600">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:text-primary-400 font-semibold">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;

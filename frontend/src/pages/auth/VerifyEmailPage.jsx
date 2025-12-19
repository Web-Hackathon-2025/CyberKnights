import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/authService';

const VerifyEmailPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Invalid verification link. Please check your email for the correct link.');
      return;
    }

    verifyEmail(token);
  }, [token]);

  const verifyEmail = async (token) => {
    try {
      const response = await authService.verifyEmail(token);

      if (response.success) {
        setStatus('success');
        setMessage('Email verified successfully! Redirecting...');
        
        // Redirect to login for all users - they need to login after verification
        setTimeout(() => {
          navigate('/login', { 
            state: { message: 'Email verified successfully! Please login to continue.' } 
          });
        }, 2000);
      }
    } catch (error) {
      setStatus('error');
      setMessage(error.response?.data?.message || 'Verification failed. The link may be invalid or expired.');
    }
  };

  return (
    <div className="min-h-screen bg-neutral-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          {/* Logo */}
          <Link to="/" className="inline-flex items-center justify-center space-x-2 mb-8">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-2xl">K</span>
            </div>
            <span className="text-2xl font-bold text-primary">Karigar</span>
          </Link>

          {status === 'verifying' && (
            <div>
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-2">Verifying your email...</h2>
              <p className="text-neutral-500">Please wait while we verify your account.</p>
            </div>
          )}

          {status === 'success' && (
            <div>
              <div className="w-16 h-16 bg-success bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-2">Success!</h2>
              <p className="text-neutral-600 mb-6">{message}</p>
              <Link
                to="/login"
                className="inline-block bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-400 transition-colors font-semibold"
              >
                Go to Login
              </Link>
            </div>
          )}

          {status === 'error' && (
            <div>
              <div className="w-16 h-16 bg-error bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-2">Verification Failed</h2>
              <p className="text-neutral-600 mb-6">{message}</p>
              <div className="flex flex-col gap-3">
                <Link
                  to="/login"
                  className="inline-block bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-400 transition-colors font-semibold"
                >
                  Go to Login
                </Link>
                <Link
                  to="/signup"
                  className="inline-block border-2 border-primary text-primary px-6 py-3 rounded-lg hover:bg-primary-50 transition-colors font-semibold"
                >
                  Sign Up Again
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;

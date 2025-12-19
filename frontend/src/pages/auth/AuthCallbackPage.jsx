import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const AuthCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { updateUser } = useAuth();
  const [status, setStatus] = useState('processing'); // processing, error

  useEffect(() => {
    const accessToken = searchParams.get('accessToken');
    const refreshToken = searchParams.get('refreshToken');
    const error = searchParams.get('error');

    if (error) {
      setStatus('error');
      setTimeout(() => navigate('/login'), 2000);
      return;
    }

    if (accessToken && refreshToken) {
      // Store tokens
      localStorage.setItem('access_token', accessToken);
      localStorage.setItem('refresh_token', refreshToken);

      // Fetch user data
      fetchUserData(accessToken);
    } else {
      setStatus('error');
      setTimeout(() => navigate('/login'), 2000);
    }
  }, [searchParams, navigate]);

  const fetchUserData = async (token) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const user = data.data;
        
        localStorage.setItem('user', JSON.stringify(user));
        updateUser(user);

        // Redirect based on role
        if (user.role === 'admin') {
          window.location.href = '/admin';
        } else {
          navigate('/dashboard');
        }
      } else {
        setStatus('error');
        setTimeout(() => navigate('/login'), 2000);
      }
    } catch (error) {
      console.error('Failed to fetch user:', error);
      setStatus('error');
      setTimeout(() => navigate('/login'), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-100 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        {status === 'processing' && (
          <>
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-neutral-900 mb-2">Completing Sign In...</h2>
            <p className="text-neutral-600">Please wait while we log you in</p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-16 h-16 bg-error bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-neutral-900 mb-2">Authentication Failed</h2>
            <p className="text-neutral-600 mb-4">Redirecting to login...</p>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthCallbackPage;

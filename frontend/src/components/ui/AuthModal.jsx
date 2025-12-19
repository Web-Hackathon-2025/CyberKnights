import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import GoogleOAuthButton from './GoogleOAuthButton';
import Modal from './Modal';

const AuthModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { googleLogin } = useAuth();

  const handleSignIn = () => {
    onClose();
    navigate('/login');
  };

  const handleSignUp = () => {
    onClose();
    navigate('/signup');
  };

  const handleGoogleSuccess = async (token) => {
    try {
      // Default to 'user' role for quick Google sign-in from landing page
      const response = await googleLogin(token, 'user');
      if (response.success) {
        onClose();
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Google login failed:', error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Welcome">
      <div className="space-y-4">
        <p className="text-neutral-600 mb-6">
          Sign in to your account or create a new one to access all features.
        </p>

        <button
          onClick={handleSignIn}
          className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary-400 transition-colors font-medium"
        >
          Sign In
        </button>

        <button
          onClick={handleSignUp}
          className="w-full border-2 border-primary text-primary py-3 rounded-lg hover:bg-primary-50 transition-colors font-medium"
        >
          Create Account
        </button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-neutral-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-neutral-500">Or continue with</span>
          </div>
        </div>

        <GoogleOAuthButton onSuccess={handleGoogleSuccess} />
      </div>
    </Modal>
  );
};

export default AuthModal;

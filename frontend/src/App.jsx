import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './contexts/AuthContext';
import MainLayout from './components/layout/MainLayout';
import AuthLayout from './components/layout/AuthLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Public pages
import LandingPage from './pages/LandingPage';

// Auth pages
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import VerifyEmailPage from './pages/auth/VerifyEmailPage';
import CheckEmailPage from './pages/auth/CheckEmailPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';

// Protected pages
import ProfilePage from './pages/ProfilePage';
import DashboardPage from './pages/DashboardPage';
import UnauthorizedPage from './pages/UnauthorizedPage';

// Provider pages
import PendingApprovalPage from './pages/provider/PendingApprovalPage';
import CompleteProfilePage from './pages/provider/CompleteProfilePage';
import ProviderDashboardPage from './pages/provider/ProviderDashboardPage';
import ProviderServicesPage from './pages/provider/ServicesPage';
import CreateServicePage from './pages/provider/CreateServicePage';
import EditServicePage from './pages/provider/EditServicePage';

// Customer pages
import ServicesPage from './pages/ServicesPage';
import ServiceProvidersPage from './pages/ServiceProvidersPage';
import ProviderProfilePage from './pages/ProviderProfilePage';
import MyBookingsPage from './pages/customer/MyBookingsPage';
import BookingDetailsPage from './pages/customer/BookingDetailsPage';

// Provider Bookings pages
import ProviderBookingsPage from './pages/provider/BookingsPage';
import ProviderBookingDetailsPage from './pages/provider/ProviderBookingDetailsPage';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Router>
        <AuthProvider>
          <Routes>
            {/* Routes with Main Layout (Navbar + Footer) */}
            <Route element={<MainLayout />}>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/unauthorized" element={<UnauthorizedPage />} />
              
              {/* Customer Service Discovery Routes */}
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/services/:categorySlug" element={<ServiceProvidersPage />} />
              <Route path="/providers/:providerId" element={<ProviderProfilePage />} />
              
              {/* Customer Booking Routes */}
              <Route
                path="/bookings"
                element={
                  <ProtectedRoute allowedRoles={['user']}>
                    <MyBookingsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/bookings/:id"
                element={
                  <ProtectedRoute allowedRoles={['user']}>
                    <BookingDetailsPage />
                  </ProtectedRoute>
                }
              />

              {/* Protected Routes */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />

              {/* Provider Routes */}
              <Route
                path="/provider/pending-approval"
                element={
                  <ProtectedRoute allowedRoles={['provider']}>
                    <PendingApprovalPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/provider/complete-profile"
                element={
                  <ProtectedRoute allowedRoles={['provider']}>
                    <CompleteProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/provider/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['provider']}>
                    <ProviderDashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/provider/services"
                element={
                  <ProtectedRoute allowedRoles={['provider']}>
                    <ProviderServicesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/provider/services/create"
                element={
                  <ProtectedRoute allowedRoles={['provider']}>
                    <CreateServicePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/provider/services/:id/edit"
                element={
                  <ProtectedRoute allowedRoles={['provider']}>
                    <EditServicePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/provider/bookings"
                element={
                  <ProtectedRoute allowedRoles={['provider']}>
                    <ProviderBookingsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/provider/bookings/:id"
                element={
                  <ProtectedRoute allowedRoles={['provider']}>
                    <ProviderBookingDetailsPage />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* Routes with Auth Layout (No Navbar/Footer) */}
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/verify-email/:token" element={<VerifyEmailPage />} />
              <Route path="/check-email" element={<CheckEmailPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
            </Route>
          </Routes>
        </AuthProvider>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;


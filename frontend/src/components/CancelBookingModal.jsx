import { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { bookingService } from '../services/bookingService';

const CancelBookingModal = ({ isOpen, bookingId, onClose, onConfirm }) => {
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!reason.trim()) {
      setError('Please provide a reason for cancellation');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await bookingService.cancelBooking(bookingId, reason);
      setReason('');
      onConfirm();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cancel booking');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setReason('');
      setError('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-error/10 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-error" />
            </div>
            <h2 className="text-xl font-bold text-neutral-900">Cancel Booking</h2>
          </div>
          <button
            onClick={handleClose}
            disabled={loading}
            className="p-2 hover:bg-neutral-100 rounded-lg transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-neutral-600 mb-6">
          Are you sure you want to cancel this booking? This action cannot be undone.
        </p>

        {error && (
          <div className="mb-4 p-4 bg-error-50 border border-error-200 rounded-xl">
            <p className="text-sm text-error">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Reason for Cancellation <span className="text-error">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                setError('');
              }}
              placeholder="Please provide a reason..."
              rows={4}
              maxLength={500}
              className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              required
            />
            <p className="text-xs text-neutral-500 mt-1">
              {reason.length}/500 characters
            </p>
          </div>

          <div className="bg-neutral-50 rounded-xl p-4 mb-6">
            <p className="text-sm text-neutral-600">
              <strong>Cancellation Policy:</strong> Please cancel at least 24 hours in advance. 
              Frequent cancellations may affect your account standing.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="flex-1 px-6 py-3 border-2 border-neutral-300 text-neutral-700 rounded-xl font-semibold hover:bg-neutral-50 transition-colors disabled:opacity-50"
            >
              Keep Booking
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-error text-white rounded-xl font-semibold hover:bg-error/90 transition-colors disabled:opacity-50"
            >
              {loading ? 'Cancelling...' : 'Cancel Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CancelBookingModal;


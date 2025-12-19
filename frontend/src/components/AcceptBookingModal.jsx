import { useState } from 'react';
import { X, CheckCircle } from 'lucide-react';
import { bookingService } from '../services/bookingService';

const AcceptBookingModal = ({ isOpen, bookingId, onClose, onConfirm }) => {
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError('');
      await bookingService.confirmBooking(bookingId, notes);
      setNotes('');
      onConfirm();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to confirm booking');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setNotes('');
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
            <div className="w-10 h-10 bg-success/10 rounded-full flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-success" />
            </div>
            <h2 className="text-xl font-bold text-neutral-900">Accept Booking</h2>
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
          Confirm that you can provide the service at the scheduled date and time.
        </p>

        {error && (
          <div className="mb-4 p-4 bg-error-50 border border-error-200 rounded-xl">
            <p className="text-sm text-error">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Notes to Customer (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => {
                setNotes(e.target.value);
                setError('');
              }}
              placeholder="Add any special instructions or notes..."
              rows={4}
              maxLength={500}
              className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            />
            <p className="text-xs text-neutral-500 mt-1">
              {notes.length}/500 characters
            </p>
          </div>

          <div className="bg-primary-50 rounded-xl p-4 mb-6">
            <p className="text-sm text-primary-700">
              <strong>Please Note:</strong> The customer will be notified of your confirmation. 
              Make sure you can deliver the service as scheduled.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="flex-1 px-6 py-3 border-2 border-neutral-300 text-neutral-700 rounded-xl font-semibold hover:bg-neutral-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-600 transition-colors disabled:opacity-50"
            >
              {loading ? 'Confirming...' : 'Accept Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AcceptBookingModal;


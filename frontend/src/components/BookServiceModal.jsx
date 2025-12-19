import { useState } from 'react';
import { X } from 'lucide-react';
import { bookingService } from '../services/bookingService';
import { getMinimumDate, getTimeSlots, formatDate } from '../utils/dateUtils';
import { useAuth } from '../contexts/AuthContext';
import PriceTag from './PriceTag';

const BookServiceModal = ({ isOpen, onClose, service, provider }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    scheduledDate: getMinimumDate(),
    scheduledTime: '',
    customerName: user?.name || '',
    customerPhone: '',
    customerAddress: '',
    notes: '',
  });

  if (!isOpen) return null;

  const timeSlots = provider?.workingHours 
    ? getTimeSlots(provider.workingHours.start, provider.workingHours.end)
    : getTimeSlots();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const bookingData = {
        serviceId: service._id,
        ...formData,
      };

      await bookingService.createBooking(bookingData);
      setSuccess(true);
      
      setTimeout(() => {
        onClose();
        setSuccess(false);
        // Reset form
        setFormData({
          scheduledDate: getMinimumDate(),
          scheduledTime: '',
          customerName: user?.name || '',
          customerPhone: '',
          customerAddress: '',
          notes: '',
        });
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-neutral-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-neutral-900">Book Service</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {success ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">Booking Successful!</h3>
              <p className="text-neutral-600">Your booking request has been sent to the provider.</p>
            </div>
          ) : (
            <>
              {/* Service Details */}
              <div className="bg-neutral-50 rounded-xl p-4 mb-6">
                <h3 className="font-semibold text-neutral-900 mb-2">{service.name}</h3>
                {service.description && (
                  <p className="text-sm text-neutral-600 mb-3">{service.description}</p>
                )}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-neutral-500">Provider</p>
                    <p className="font-medium text-neutral-900">
                      {provider?.businessName || provider?.userId?.name}
                    </p>
                  </div>
                  <PriceTag price={service.price} priceType={service.priceType} size="lg" />
                </div>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-error-50 border border-error-200 rounded-xl">
                  <p className="text-sm text-error">{error}</p>
                </div>
              )}

              {/* Booking Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Date & Time */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Date <span className="text-error">*</span>
                    </label>
                    <input
                      type="date"
                      name="scheduledDate"
                      value={formData.scheduledDate}
                      onChange={handleChange}
                      min={getMinimumDate()}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Time <span className="text-error">*</span>
                    </label>
                    <select
                      name="scheduledTime"
                      value={formData.scheduledTime}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    >
                      <option value="">Select time</option>
                      {timeSlots.map((slot) => (
                        <option key={slot} value={slot}>
                          {slot}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Contact Information */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Your Name <span className="text-error">*</span>
                  </label>
                  <input
                    type="text"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleChange}
                    placeholder="Full name"
                    className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Phone Number <span className="text-error">*</span>
                  </label>
                  <input
                    type="tel"
                    name="customerPhone"
                    value={formData.customerPhone}
                    onChange={handleChange}
                    placeholder="03XX-XXXXXXX"
                    className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Service Address <span className="text-error">*</span>
                  </label>
                  <textarea
                    name="customerAddress"
                    value={formData.customerAddress}
                    onChange={handleChange}
                    placeholder="Enter your complete address"
                    rows={3}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Special Requirements (Optional)
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Any specific requirements or notes for the provider..."
                    rows={3}
                    maxLength={500}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  />
                  <p className="text-xs text-neutral-500 mt-1">
                    {formData.notes.length}/500 characters
                  </p>
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
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
                    {loading ? 'Booking...' : 'Confirm Booking'}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookServiceModal;


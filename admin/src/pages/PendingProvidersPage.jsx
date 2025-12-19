import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Spinner } from '@/components/ui/Spinner';
import { adminService } from '@/services/adminService';
import { formatDate } from '@/utils/helpers';
import { CheckCircle, XCircle, User, Mail, Phone, MapPin, Calendar } from 'lucide-react';

export default function PendingProvidersPage() {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  useEffect(() => {
    loadPendingProviders();
  }, []);

  const loadPendingProviders = async () => {
    try {
      setLoading(true);
      const response = await adminService.getPendingProviders();
      setProviders(response.data?.providers || []);
    } catch (error) {
      console.error('Failed to load pending providers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!selectedProvider) return;
    
    try {
      setActionLoading('approve');
      await adminService.approveProvider(selectedProvider._id);
      setProviders(providers.filter(p => p._id !== selectedProvider._id));
      setShowApproveModal(false);
      setSelectedProvider(null);
    } catch (error) {
      console.error('Failed to approve provider:', error);
      alert('Failed to approve provider. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async () => {
    if (!selectedProvider || !rejectReason.trim()) return;
    
    try {
      setActionLoading('reject');
      await adminService.rejectProvider(selectedProvider._id, rejectReason);
      setProviders(providers.filter(p => p._id !== selectedProvider._id));
      setShowRejectModal(false);
      setSelectedProvider(null);
      setRejectReason('');
    } catch (error) {
      console.error('Failed to reject provider:', error);
      alert('Failed to reject provider. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const openApproveModal = (provider) => {
    setSelectedProvider(provider);
    setShowApproveModal(true);
  };

  const openRejectModal = (provider) => {
    setSelectedProvider(provider);
    setShowRejectModal(true);
  };

  if (loading) {
    return (
      <AdminLayout title="Pending Providers">
        <div className="flex items-center justify-center h-96">
          <Spinner size="lg" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Pending Providers">
      {/* Header */}
      <div className="mb-6">
        <p className="text-neutral-600">
          Review and approve service providers who want to join the platform.
        </p>
      </div>

      {providers.length === 0 ? (
        <Card>
          <CardContent className="py-16">
            <div className="text-center">
              <CheckCircle className="w-16 h-16 text-success mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">All Caught Up!</h3>
              <p className="text-neutral-500">There are no pending provider applications to review.</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {providers.map((provider) => (
            <Card key={provider._id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                    {/* Provider Info */}
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                          <span className="text-primary font-bold text-xl">
                            {provider.businessName?.charAt(0) || provider.userId?.name?.charAt(0) || 'P'}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-neutral-900">
                            {provider.businessName || provider.userId?.name || 'Unknown Provider'}
                          </h3>
                          <Badge variant="warning" className="mt-1">Pending Approval</Badge>
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="flex items-center gap-2 text-sm text-neutral-600">
                          <User className="w-4 h-4 text-neutral-400" />
                          <span>{provider.userId?.name || 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-neutral-600">
                          <Mail className="w-4 h-4 text-neutral-400" />
                          <span className="truncate">{provider.userId?.email || 'N/A'}</span>
                        </div>
                        {provider.phone && (
                          <div className="flex items-center gap-2 text-sm text-neutral-600">
                            <Phone className="w-4 h-4 text-neutral-400" />
                            <span>{provider.phone}</span>
                          </div>
                        )}
                        {provider.location?.city && (
                          <div className="flex items-center gap-2 text-sm text-neutral-600">
                            <MapPin className="w-4 h-4 text-neutral-400" />
                            <span>{provider.location.city}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-sm text-neutral-600">
                          <Calendar className="w-4 h-4 text-neutral-400" />
                          <span>Applied: {formatDate(provider.createdAt)}</span>
                        </div>
                      </div>

                      {provider.category && (
                        <div className="mt-3">
                          <span className="text-xs text-neutral-500">Category: </span>
                          <span className="text-sm font-medium text-neutral-700">
                            {provider.category?.name || provider.category}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-row lg:flex-col gap-3 lg:w-40">
                      <Button
                        onClick={() => openApproveModal(provider)}
                        className="flex-1 lg:flex-none bg-success hover:bg-success/90 text-white"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Approve
                      </Button>
                      <Button
                        onClick={() => openRejectModal(provider)}
                        variant="outline"
                        className="flex-1 lg:flex-none border-error text-error hover:bg-error hover:text-white"
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Approve Modal */}
      <Modal
        isOpen={showApproveModal}
        onClose={() => {
          setShowApproveModal(false);
          setSelectedProvider(null);
        }}
        title="Approve Provider"
      >
        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-success" />
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900">
                {selectedProvider?.businessName || selectedProvider?.userId?.name}
              </h3>
              <p className="text-sm text-neutral-500">{selectedProvider?.userId?.email}</p>
            </div>
          </div>
          
          <p className="text-neutral-600 mb-6">
            Are you sure you want to approve this provider? They will be able to list services and receive bookings on the platform.
          </p>
          
          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={() => {
                setShowApproveModal(false);
                setSelectedProvider(null);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleApprove}
              disabled={actionLoading === 'approve'}
              className="bg-success hover:bg-success/90 text-white"
            >
              {actionLoading === 'approve' ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  Approving...
                </>
              ) : (
                'Approve Provider'
              )}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Reject Modal */}
      <Modal
        isOpen={showRejectModal}
        onClose={() => {
          setShowRejectModal(false);
          setSelectedProvider(null);
          setRejectReason('');
        }}
        title="Reject Provider"
      >
        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-error/10 rounded-full flex items-center justify-center">
              <XCircle className="w-6 h-6 text-error" />
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900">
                {selectedProvider?.businessName || selectedProvider?.userId?.name}
              </h3>
              <p className="text-sm text-neutral-500">{selectedProvider?.userId?.email}</p>
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Rejection Reason <span className="text-error">*</span>
            </label>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Please provide a reason for rejection..."
              className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              rows={4}
            />
          </div>
          
          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={() => {
                setShowRejectModal(false);
                setSelectedProvider(null);
                setRejectReason('');
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleReject}
              disabled={actionLoading === 'reject' || !rejectReason.trim()}
              className="bg-error hover:bg-error/90 text-white"
            >
              {actionLoading === 'reject' ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  Rejecting...
                </>
              ) : (
                'Reject Provider'
              )}
            </Button>
          </div>
        </div>
      </Modal>
    </AdminLayout>
  );
}


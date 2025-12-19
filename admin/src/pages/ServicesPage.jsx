import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Spinner } from '@/components/ui/Spinner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { adminService } from '@/services/adminService';
import { Briefcase, Trash2, Power, Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { formatDate } from '@/utils/helpers';

export default function ServicesPage() {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 20,
    search: '',
    isActive: '',
    category: '',
  });
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    pages: 1,
  });
  const [deleteModal, setDeleteModal] = useState({ open: false, service: null });
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadServices();
  }, [filters]);

  const loadServices = async () => {
    try {
      setLoading(true);
      const response = await adminService.getServices(filters);
      setServices(response.data?.services || []);
      setPagination(response.data?.pagination || {});
    } catch (error) {
      console.error('Failed to load services:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteService = async () => {
    if (!deleteModal.service) return;

    try {
      setDeleting(true);
      await adminService.deleteService(deleteModal.service._id);
      setServices(services.filter(s => s._id !== deleteModal.service._id));
      setDeleteModal({ open: false, service: null });
    } catch (error) {
      console.error('Failed to delete service:', error);
      alert('Failed to delete service. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  const handleToggleStatus = async (service) => {
    try {
      await adminService.toggleServiceStatus(service._id);
      setServices(services.map(s => 
        s._id === service._id 
          ? { ...s, isActive: !s.isActive }
          : s
      ));
    } catch (error) {
      console.error('Failed to toggle service status:', error);
      alert('Failed to update service status.');
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: key !== 'page' ? 1 : value }));
  };

  const formatPrice = (price, priceType) => {
    const formatted = `₹${price.toLocaleString('en-IN')}`;
    if (priceType === 'hourly') return `${formatted}/hr`;
    if (priceType === 'negotiable') return `${formatted} (Negotiable)`;
    return formatted;
  };

  if (loading && services.length === 0) {
    return (
      <AdminLayout title="Services">
        <div className="flex items-center justify-center h-96">
          <Spinner size="lg" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Services">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <p className="text-neutral-600">
          Manage all services across providers on the platform.
        </p>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <Input
                type="text"
                placeholder="Search services..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="pl-10"
              />
            </div>
            
            <select
              value={filters.isActive}
              onChange={(e) => handleFilterChange('isActive', e.target.value)}
              className="px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
            >
              <option value="">All Status</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>

            <Button
              variant="ghost"
              onClick={() => setFilters({ page: 1, limit: 20, search: '', isActive: '', category: '' })}
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Services Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Spinner size="md" />
            </div>
          ) : services.length === 0 ? (
            <div className="text-center py-16">
              <Briefcase className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">No Services Found</h3>
              <p className="text-neutral-500">No services match your current filters.</p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Service Name</TableHead>
                    <TableHead>Provider</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {services.map((service) => (
                    <TableRow key={service._id}>
                      <TableCell>
                        <div className="font-medium">{service.name}</div>
                        {service.description && (
                          <div className="text-sm text-neutral-500 truncate max-w-xs">
                            {service.description}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {service.providerId?.userId?.name || 'Unknown'}
                        </div>
                        <div className="text-xs text-neutral-500">
                          {service.providerId?.userId?.email}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{service.category?.icon}</span>
                          <span className="text-sm">{service.category?.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm font-medium">
                          {formatPrice(service.price, service.priceType)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-neutral-600">
                          {service.duration ? `${service.duration} min` : 'N/A'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={service.isActive ? 'success' : 'error'}>
                          {service.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-neutral-500">
                        {formatDate(service.createdAt)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleStatus(service)}
                            className={service.isActive ? 'text-warning hover:bg-orange-50' : 'text-success hover:bg-green-50'}
                            title={service.isActive ? 'Deactivate' : 'Activate'}
                          >
                            <Power className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteModal({ open: true, service })}
                            className="text-error hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-6 pt-6 px-6 border-t border-neutral-200">
                <p className="text-sm text-neutral-500">
                  Showing {services.length} of {pagination.total} services
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleFilterChange('page', filters.page - 1)}
                    disabled={filters.page === 1}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <span className="text-sm text-neutral-700">
                    Page {pagination.page} of {pagination.pages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleFilterChange('page', filters.page + 1)}
                    disabled={filters.page >= pagination.pages}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, service: null })}
        title="Delete Service"
        maxWidth="md"
      >
        <div className="space-y-4">
          <p className="text-neutral-700">
            Are you sure you want to delete this service? This action cannot be undone and will affect all bookings associated with it.
          </p>
          <div className="bg-neutral-50 p-4 rounded-lg">
            <p className="text-sm text-neutral-600">Service: <span className="font-medium">{deleteModal.service?.name}</span></p>
            <p className="text-sm text-neutral-600">Provider: <span className="font-medium">{deleteModal.service?.providerId?.userId?.name}</span></p>
            <p className="text-sm text-neutral-600">Price: <span className="font-medium">{deleteModal.service && formatPrice(deleteModal.service.price, deleteModal.service.priceType)}</span></p>
          </div>
          <div className="flex gap-3 justify-end">
            <Button
              variant="ghost"
              onClick={() => setDeleteModal({ open: false, service: null })}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              variant="error"
              onClick={handleDeleteService}
              disabled={deleting}
            >
              {deleting ? (
                <span className="flex items-center gap-2">
                  <Spinner size="sm" className="text-white" />
                  Deleting...
                </span>
              ) : (
                'Delete Service'
              )}
            </Button>
          </div>
        </div>
      </Modal>
    </AdminLayout>
  );
}

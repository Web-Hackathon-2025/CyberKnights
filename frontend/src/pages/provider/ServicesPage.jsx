import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyServices, deleteService } from '../../services/providerService';
import { Plus, Pencil, Trash2, Briefcase, ToggleLeft, ToggleRight } from 'lucide-react';

const ServicesPage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      setLoading(true);
      const response = await getMyServices();
      setServices(response.data.services || []);
    } catch (error) {
      console.error('Failed to load services:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal) return;

    try {
      setDeleting(true);
      await deleteService(deleteModal._id);
      setServices(services.filter(s => s._id !== deleteModal._id));
      setDeleteModal(null);
    } catch (error) {
      console.error('Failed to delete service:', error);
      alert('Failed to delete service');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-neutral-900">
                My Services
              </h1>
              <p className="text-neutral-600 mt-1">
                Manage your service offerings
              </p>
            </div>
            <Link
              to="/provider/services/create"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-600 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Service
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {services.length === 0 ? (
          <div className="bg-white rounded-xl border border-neutral-200 p-12">
            <div className="text-center">
              <Briefcase className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-neutral-900 mb-2">
                No Services Yet
              </h2>
              <p className="text-neutral-600 mb-6 max-w-md mx-auto">
                Start adding your services to let customers know what you offer and how much you charge.
              </p>
              <Link
                to="/provider/services/create"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-600 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Add Your First Service
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-6">
            {services.map((service) => (
              <div
                key={service._id}
                className="bg-white rounded-xl border border-neutral-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Briefcase className="w-8 h-8 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-neutral-900">
                            {service.name}
                          </h3>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              service.isActive
                                ? 'bg-success/10 text-success'
                                : 'bg-neutral-200 text-neutral-600'
                            }`}
                          >
                            {service.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>

                        {service.description && (
                          <p className="text-neutral-600 mb-3 line-clamp-2">
                            {service.description}
                          </p>
                        )}

                        <div className="flex flex-wrap items-center gap-4">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-neutral-500">Price:</span>
                            <span className="text-lg font-semibold text-primary">
                              PKR {service.price.toLocaleString()}
                              {service.priceType === 'hourly' && '/hr'}
                              {service.priceType === 'negotiable' && ' (Negotiable)'}
                            </span>
                          </div>

                          {service.category && (
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-neutral-500">Category:</span>
                              <span className="text-sm font-medium text-neutral-700">
                                {service.category.name || service.category}
                              </span>
                            </div>
                          )}

                          {service.duration && (
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-neutral-500">Duration:</span>
                              <span className="text-sm font-medium text-neutral-700">
                                ~{service.duration} mins
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex sm:flex-col gap-2">
                    <Link
                      to={`/provider/services/${service._id}/edit`}
                      className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2 bg-neutral-100 text-neutral-700 rounded-lg font-medium hover:bg-neutral-200 transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                      <span className="sm:hidden">Edit</span>
                    </Link>
                    <button
                      onClick={() => setDeleteModal(service)}
                      className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2 bg-error/10 text-error rounded-lg font-medium hover:bg-error/20 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="sm:hidden">Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-semibold text-neutral-900 mb-3">
              Delete Service
            </h3>
            <p className="text-neutral-600 mb-6">
              Are you sure you want to delete "<strong>{deleteModal.name}</strong>"? 
              This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteModal(null)}
                disabled={deleting}
                className="px-4 py-2 border-2 border-neutral-300 text-neutral-700 rounded-xl font-medium hover:bg-neutral-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 bg-error text-white rounded-xl font-medium hover:bg-error/90 transition-colors disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Delete Service'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesPage;


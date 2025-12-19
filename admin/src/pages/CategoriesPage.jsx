import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Spinner } from '@/components/ui/Spinner';
import { adminService } from '@/services/adminService';
import { Plus, Pencil, Trash2, Grid3X3 } from 'lucide-react';

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: '', icon: '', description: '' });
  const [saving, setSaving] = useState(false);
  const [deleteModal, setDeleteModal] = useState(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const response = await adminService.getCategories();
      setCategories(response.data?.categories || []);
    } catch (error) {
      console.error('Failed to load categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    try {
      setSaving(true);
      if (editingCategory) {
        await adminService.updateCategory(editingCategory._id, formData);
      } else {
        await adminService.createCategory(formData);
      }
      await loadCategories();
      closeModal();
    } catch (error) {
      console.error('Failed to save category:', error);
      alert('Failed to save category. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal) return;

    try {
      setSaving(true);
      await adminService.deleteCategory(deleteModal._id);
      setCategories(categories.filter(c => c._id !== deleteModal._id));
      setDeleteModal(null);
    } catch (error) {
      console.error('Failed to delete category:', error);
      alert('Failed to delete category. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleSeedCategories = async () => {
    if (!confirm('This will add default categories. Continue?')) return;

    try {
      setLoading(true);
      await adminService.seedCategories();
      await loadCategories();
    } catch (error) {
      console.error('Failed to seed categories:', error);
      alert('Failed to seed categories.');
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingCategory(null);
    setFormData({ name: '', icon: '🔧', description: '' });
    setShowModal(true);
  };

  const openEditModal = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      icon: category.icon || '🔧',
      description: category.description || '',
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingCategory(null);
    setFormData({ name: '', icon: '', description: '' });
  };

  if (loading) {
    return (
      <AdminLayout title="Categories">
        <div className="flex items-center justify-center h-96">
          <Spinner size="lg" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Categories">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <p className="text-neutral-600">
          Manage service categories available on the platform.
        </p>
        <div className="flex gap-3">
          {categories.length === 0 && (
            <Button variant="outline" onClick={handleSeedCategories}>
              Seed Default Categories
            </Button>
          )}
          <Button onClick={openCreateModal}>
            <Plus className="w-4 h-4 mr-2" />
            Add Category
          </Button>
        </div>
      </div>

      {/* Categories Grid */}
      {categories.length === 0 ? (
        <Card>
          <CardContent className="py-16">
            <div className="text-center">
              <Grid3X3 className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">No Categories</h3>
              <p className="text-neutral-500 mb-4">Start by adding service categories or seed default ones.</p>
              <div className="flex gap-3 justify-center">
                <Button variant="outline" onClick={handleSeedCategories}>
                  Seed Defaults
                </Button>
                <Button onClick={openCreateModal}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Category
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {categories.map((category) => (
            <Card key={category._id} className="group hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="text-4xl">{category.icon || '🔧'}</div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => openEditModal(category)}
                      className="p-2 text-neutral-500 hover:text-primary hover:bg-primary-50 rounded-lg transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteModal(category)}
                      className="p-2 text-neutral-500 hover:text-error hover:bg-error-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <h3 className="font-semibold text-neutral-900 mb-1">{category.name}</h3>
                {category.description && (
                  <p className="text-sm text-neutral-500 line-clamp-2">{category.description}</p>
                )}
                <div className="mt-3 flex items-center justify-between">
                  <span className={`text-xs px-2 py-1 rounded-full ${category.isActive ? 'bg-success/10 text-success' : 'bg-neutral-100 text-neutral-500'}`}>
                    {category.isActive ? 'Active' : 'Inactive'}
                  </span>
                  <span className="text-xs text-neutral-400">Order: {category.order}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={closeModal}
        title={editingCategory ? 'Edit Category' : 'Create Category'}
      >
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Icon (Emoji)
              </label>
              <Input
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                placeholder="🔧"
                className="text-2xl"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Name <span className="text-error">*</span>
              </label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Plumbing"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of this category..."
                className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                rows={3}
              />
            </div>
          </div>

          <div className="flex gap-3 justify-end mt-6">
            <Button type="button" variant="outline" onClick={closeModal}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving || !formData.name.trim()}>
              {saving ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  Saving...
                </>
              ) : editingCategory ? (
                'Update Category'
              ) : (
                'Create Category'
              )}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteModal}
        onClose={() => setDeleteModal(null)}
        title="Delete Category"
      >
        <div className="p-6">
          <p className="text-neutral-600 mb-6">
            Are you sure you want to delete <strong>{deleteModal?.name}</strong>? This action cannot be undone.
          </p>
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setDeleteModal(null)}>
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              disabled={saving}
              className="bg-error hover:bg-error/90 text-white"
            >
              {saving ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  Deleting...
                </>
              ) : (
                'Delete Category'
              )}
            </Button>
          </div>
        </div>
      </Modal>
    </AdminLayout>
  );
}


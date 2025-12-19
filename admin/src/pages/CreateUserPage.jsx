import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { ArrowLeft, Save } from 'lucide-react';
import { adminService } from '@/services/adminService';
import { handleApiError } from '@/utils/helpers';

export default function CreateUserPage() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
    isEmailVerified: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      await adminService.createUser(formData);
      navigate('/users');
    } catch (error) {
      alert(handleApiError(error));
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout title="Create New User">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Header Actions */}
        <div className="flex items-center justify-between">
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate('/users')}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Users
          </Button>
          <Button
            type="submit"
            disabled={saving || !formData.name || !formData.email || !formData.password}
            className="gap-2"
          >
            {saving ? (
              <>
                <Spinner size="sm" className="text-white" />
                Creating...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Create User
              </>
            )}
          </Button>
        </div>

        {/* Basic Account Information */}
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter user's full name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="user@example.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                  minLength="8"
                  placeholder="Min 8 characters"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Role <span className="text-red-500">*</span>
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="user">Customer</option>
                  <option value="provider">Service Provider</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="isEmailVerified"
                    checked={formData.isEmailVerified}
                    onChange={handleChange}
                    className="rounded border-neutral-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm font-medium text-neutral-700">
                    Email Verified (Admin-created users are auto-verified)
                  </span>
                </label>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
          <p className="text-sm text-neutral-600">
            <strong>Note:</strong> Admin-created users will receive an email notification with their credentials. 
            If creating a provider account, they will need to complete their profile before listing services.
          </p>
        </div>
      </form>
    </AdminLayout>
  );
}

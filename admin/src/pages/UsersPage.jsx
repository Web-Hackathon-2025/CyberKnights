import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Spinner } from '@/components/ui/Spinner';
import { Modal } from '@/components/ui/Modal';
import { Trash2, ChevronLeft, ChevronRight, Eye, Edit, Plus } from 'lucide-react';
import { adminService } from '@/services/adminService';
import { formatDate, handleApiError } from '@/utils/helpers';

export default function UsersPage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
  const [filters, setFilters] = useState({
    role: '',
    isApproved: '',
    isEmailVerified: '',
    page: 1,
    limit: 20,
  });
  const [deleteModal, setDeleteModal] = useState({ open: false, user: null });
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadUsers();
  }, [filters]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.role) params.role = filters.role;
      if (filters.isApproved !== '') params.isApproved = filters.isApproved;
      if (filters.isEmailVerified !== '') params.isEmailVerified = filters.isEmailVerified;
      params.page = filters.page;
      params.limit = filters.limit;

      const response = await adminService.getUsers(params);
      setUsers(response.data.users);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value, page: 1 });
  };



  const handleDeleteUser = async () => {
    if (!deleteModal.user) return;

    try {
      setDeleting(true);
      await adminService.deleteUser(deleteModal.user._id);
      setDeleteModal({ open: false, user: null });
      loadUsers();
    } catch (error) {
      alert(handleApiError(error));
    } finally {
      setDeleting(false);
    }
  };

  const getRoleBadgeVariant = (role) => {
    switch (role) {
      case 'admin': return 'error';
      case 'doctor': return 'info';
      case 'patient': return 'default';
      default: return 'default';
    }
  };

  return (
    <AdminLayout title="Users Management">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Users</CardTitle>
            <div className="flex items-center gap-4">
              <Button 
                onClick={() => navigate('/users/create')}
                className="whitespace-nowrap"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create User
              </Button>
              {/* Filters */}
              <Select
                value={filters.role}
                onChange={(e) => handleFilterChange('role', e.target.value)}
                options={[
                  { value: '', label: 'All Roles' },
                  { value: 'patient', label: 'Patients' },
                  { value: 'doctor', label: 'Doctors' },
                  { value: 'admin', label: 'Admins' },
                ]}
                className="w-40"
              />
              <Select
                value={filters.isApproved}
                onChange={(e) => handleFilterChange('isApproved', e.target.value)}
                options={[
                  { value: '', label: 'All Status' },
                  { value: 'true', label: 'Approved' },
                  { value: 'false', label: 'Pending' },
                ]}
                className="w-40"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Spinner size="lg" />
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-12 text-neutral-500">
              No users found
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Verified</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user._id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                            <span className="text-primary text-sm font-semibold">
                              {user.name?.charAt(0) || 'U'}
                            </span>
                          </div>
                          <span className="font-medium">{user.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant={getRoleBadgeVariant(user.role)}>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.isApproved ? 'success' : 'warning'}>
                          {user.isApproved ? 'Approved' : 'Pending'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.isEmailVerified ? 'success' : 'error'}>
                          {user.isEmailVerified ? 'Yes' : 'No'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-neutral-500">
                        {formatDate(user.createdAt)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(`/users/${user._id}`)}
                            className="text-primary-600 hover:bg-primary-50"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(`/users/${user._id}/edit`)}
                            className="text-neutral-600 hover:bg-neutral-100"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          {user.role !== 'admin' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setDeleteModal({ open: true, user })}
                              className="text-error hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-6 pt-6 border-t border-neutral-200">
                <p className="text-sm text-neutral-500">
                  Showing {users.length} of {pagination.total} users
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
        onClose={() => setDeleteModal({ open: false, user: null })}
        title="Delete User"
        maxWidth="md"
      >
        <div className="space-y-4">
          <p className="text-neutral-700">
            Are you sure you want to delete this user? This action cannot be undone.
          </p>
          <div className="bg-neutral-50 p-4 rounded-lg">
            <p className="text-sm text-neutral-600">User: <span className="font-medium">{deleteModal.user?.name}</span></p>
            <p className="text-sm text-neutral-600">Email: <span className="font-medium">{deleteModal.user?.email}</span></p>
            <p className="text-sm text-neutral-600">Role: <span className="font-medium">{deleteModal.user?.role}</span></p>
          </div>
          <div className="flex gap-3 justify-end">
            <Button
              variant="ghost"
              onClick={() => setDeleteModal({ open: false, user: null })}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              variant="error"
              onClick={handleDeleteUser}
              disabled={deleting}
            >
              {deleting ? (
                <span className="flex items-center gap-2">
                  <Spinner size="sm" className="text-white" />
                  Deleting...
                </span>
              ) : (
                'Delete User'
              )}
            </Button>
          </div>
        </div>
      </Modal>
    </AdminLayout>
  );
}

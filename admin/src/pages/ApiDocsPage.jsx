import { AdminLayout } from '@/components/layout/AdminLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export default function ApiDocsPage() {
  const endpoints = [
    {
      method: 'POST',
      path: '/auth/login',
      description: 'Admin login with email and password',
      auth: false,
    },
    {
      method: 'POST',
      path: '/auth/logout',
      description: 'Logout and invalidate refresh token',
      auth: true,
    },
    {
      method: 'GET',
      path: '/admin/users',
      description: 'Get all users with filtering and pagination',
      auth: true,
    },
    {
      method: 'GET',
      path: '/admin/doctors/pending',
      description: 'Get list of pending doctor approvals',
      auth: true,
    },
    {
      method: 'PATCH',
      path: '/admin/doctors/:id/approve',
      description: 'Approve a pending doctor',
      auth: true,
    },
    {
      method: 'PATCH',
      path: '/admin/doctors/:id/reject',
      description: 'Reject and delete a pending doctor',
      auth: true,
    },
    {
      method: 'DELETE',
      path: '/admin/users/:id',
      description: 'Delete a user (cannot delete admins)',
      auth: true,
    },
  ];

  const getMethodColor = (method) => {
    switch (method) {
      case 'GET': return 'info';
      case 'POST': return 'success';
      case 'PATCH': return 'warning';
      case 'DELETE': return 'error';
      default: return 'default';
    }
  };

  return (
    <AdminLayout title="API Documentation">
      <div className="space-y-6">
        {/* Overview */}
        <Card>
          <CardHeader>
            <CardTitle>API Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-neutral-700 mb-1">Base URL</p>
                <code className="block bg-neutral-100 px-4 py-2 rounded-lg text-sm">
                  http://localhost:5000/api
                </code>
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-700 mb-1">Required Headers</p>
                <code className="block bg-neutral-100 px-4 py-2 rounded-lg text-sm">
                  x-platform: web
                </code>
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-700 mb-1">Authentication</p>
                <code className="block bg-neutral-100 px-4 py-2 rounded-lg text-sm">
                  Authorization: Bearer {'<access_token>'}
                </code>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Endpoints */}
        <Card>
          <CardHeader>
            <CardTitle>Available Endpoints</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {endpoints.map((endpoint, index) => (
                <div
                  key={index}
                  className="p-4 bg-neutral-50 rounded-lg border border-neutral-200 hover:border-primary-200 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <Badge variant={getMethodColor(endpoint.method)}>
                      {endpoint.method}
                    </Badge>
                    <div className="flex-1">
                      <code className="text-sm font-mono text-neutral-900">
                        {endpoint.path}
                      </code>
                      <p className="text-sm text-neutral-600 mt-1">
                        {endpoint.description}
                      </p>
                      <div className="mt-2">
                        <Badge variant={endpoint.auth ? 'warning' : 'default'} className="text-xs">
                          {endpoint.auth ? '🔒 Auth Required' : '🔓 Public'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Default Credentials */}
        <Card>
          <CardHeader>
            <CardTitle>Default Admin Credentials</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800 font-medium mb-2">⚠️ Development Only</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-yellow-700 w-20">Email:</span>
                  <code className="text-sm bg-white px-3 py-1 rounded border border-yellow-300">
                    admin@tabeebaai.com
                  </code>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-yellow-700 w-20">Password:</span>
                  <code className="text-sm bg-white px-3 py-1 rounded border border-yellow-300">
                    Admin@123456
                  </code>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Full Documentation Link */}
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-neutral-600">
              For complete API documentation, see{' '}
              <code className="bg-neutral-100 px-2 py-1 rounded text-xs">
                docs/API.admin.md
              </code>
              {' '}in the backend repository.
            </p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}

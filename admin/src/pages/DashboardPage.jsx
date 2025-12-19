import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { StatCard } from '@/components/StatCard';
import { UserStatsChart } from '@/components/charts/UserStatsChart';
import { ActivityChart } from '@/components/charts/ActivityChart';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Users, Briefcase, Clock, CheckCircle } from 'lucide-react';
import { adminService } from '@/services/adminService';
import { Spinner } from '@/components/ui/Spinner';
import { formatDate } from '@/utils/helpers';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [recentUsers, setRecentUsers] = useState([]);
  const [pendingProviders, setPendingProviders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const statsResponse = await adminService.getDashboardStats();
      const statsData = statsResponse.data || statsResponse;

      setStats({
        totalUsers: statsData.totalUsers || 0,
        totalCustomers: statsData.totalCustomers || 0,
        totalProviders: statsData.totalProviders || 0,
        pendingProviders: statsData.pendingProviders || 0,
        approvedProviders: statsData.approvedProviders || 0,
        totalServices: statsData.totalServices || 0,
        activeServices: statsData.activeServices || 0,
        totalBookings: statsData.totalBookings || 0,
        completedBookings: statsData.completedBookings || 0,
        totalRevenue: statsData.totalRevenue || 0,
      });

      // Get pending providers separately for the list
      const pendingResponse = await adminService.getPendingProviders().catch(() => ({ data: { providers: [] } }));
      const pending = pendingResponse.data?.providers || [];
      setPendingProviders(pending.slice(0, 3));
      
      setRecentUsers(statsData.recentUsers?.slice(0, 5) || []);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadgeVariant = (role) => {
    switch (role) {
      case 'admin': return 'error';
      case 'provider': return 'info';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Dashboard">
        <div className="flex items-center justify-center h-96">
          <Spinner size="lg" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Dashboard">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Users"
          value={stats?.totalUsers || 0}
          icon={Users}
          color="primary"
        />
        <StatCard
          title="Total Providers"
          value={stats?.totalProviders || 0}
          icon={Briefcase}
          color="info"
        />
        <StatCard
          title="Pending Approval"
          value={stats?.pendingProviders || 0}
          icon={Clock}
          color="warning"
          onClick={() => navigate('/providers/pending')}
        />
        <StatCard
          title="Total Services"
          value={stats?.totalServices || 0}
          icon={Briefcase}
          color="success"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 mb-1">Total Bookings</p>
                <p className="text-2xl font-bold text-neutral-900">{stats?.totalBookings || 0}</p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 mb-1">Completed Bookings</p>
                <p className="text-2xl font-bold text-neutral-900">{stats?.completedBookings || 0}</p>
              </div>
              <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 mb-1">Platform Revenue</p>
                <p className="text-2xl font-bold text-neutral-900">₹{(stats?.totalRevenue || 0).toLocaleString('en-IN')}</p>
              </div>
              <div className="w-12 h-12 bg-warning/10 rounded-xl flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <UserStatsChart />
        <ActivityChart />
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Providers */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-warning" />
              Pending Providers
            </CardTitle>
            {pendingProviders.length > 0 && (
              <button 
                onClick={() => navigate('/providers/pending')}
                className="text-sm text-primary hover:text-primary-600 font-medium"
              >
                View All →
              </button>
            )}
          </CardHeader>
          <CardContent>
            {pendingProviders.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 text-success mx-auto mb-3 opacity-50" />
                <p className="text-neutral-500">No pending approvals</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingProviders.map((provider) => (
                  <div
                    key={provider._id}
                    onClick={() => navigate(`/providers/${provider._id}`)}
                    className="flex items-center justify-between p-4 bg-warning/5 border border-warning/20 rounded-xl hover:bg-warning/10 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-warning/20 rounded-full flex items-center justify-center">
                        <span className="text-warning font-semibold">
                          {provider.userId?.name?.charAt(0) || 'P'}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-neutral-900">
                          {provider.businessName || provider.userId?.name || 'Unknown'}
                        </p>
                        <p className="text-sm text-neutral-500">
                          {provider.userId?.email}
                        </p>
                      </div>
                    </div>
                    <Badge variant="warning">Pending</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Users */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Users</CardTitle>
            <button 
              onClick={() => navigate('/users')}
              className="text-sm text-primary hover:text-primary-600 font-medium"
            >
              View All →
            </button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentUsers.map((user) => (
                <div
                  key={user._id}
                  onClick={() => navigate(`/users/${user._id}`)}
                  className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl hover:bg-neutral-100 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-primary font-semibold">
                        {user.name?.charAt(0) || 'U'}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-neutral-900">{user.name}</p>
                      <p className="text-sm text-neutral-500">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={getRoleBadgeVariant(user.role)}>
                      {user.role}
                    </Badge>
                    <span className="text-xs text-neutral-400">
                      {formatDate(user.createdAt)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}

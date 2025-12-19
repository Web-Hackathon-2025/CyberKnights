import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { StatCard } from '@/components/StatCard';
import { UserStatsChart } from '@/components/charts/UserStatsChart';
import { ActivityChart } from '@/components/charts/ActivityChart';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Users, UserCheck, UserX } from 'lucide-react';
import { adminService } from '@/services/adminService';
import { Spinner } from '@/components/ui/Spinner';
import { formatDate } from '@/utils/helpers';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      // Load users to calculate stats
      const [allUsers, pendingDoctors] = await Promise.all([
        adminService.getUsers({ limit: 100 }),
        adminService.getPendingDoctors(),
      ]);

      const users = allUsers.data.users;
      const totalUsers = users.length;
      const totalPatients = users.filter(u => u.role === 'patient').length;
      const totalDoctors = users.filter(u => u.role === 'doctor').length;
      const pendingCount = pendingDoctors.data.doctors.length;

      setStats({
        totalUsers,
        totalPatients,
        totalDoctors,
        pendingDoctors: pendingCount,
      });

      // Get recent 5 users
      setRecentUsers(users.slice(0, 5));
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
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
          trend="up"
          trendValue="12%"
        />
        <StatCard
          title="Total Patients"
          value={stats?.totalPatients || 0}
          icon={Users}
          color="success"
          trend="up"
          trendValue="8%"
        />
        <StatCard
          title="Total Doctors"
          value={stats?.totalDoctors || 0}
          icon={UserCheck}
          color="info"
          trend="up"
          trendValue="5%"
        />
        <StatCard
          title="Pending Approval"
          value={stats?.pendingDoctors || 0}
          icon={UserX}
          color="warning"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <UserStatsChart />
        <ActivityChart />
      </div>

      {/* Recent Users */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentUsers.map((user) => (
              <div
                key={user._id}
                className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors"
              >
                <div className="flex items-center gap-4">
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
                <div className="flex items-center gap-4">
                  <Badge variant={user.role === 'doctor' ? 'info' : 'default'}>
                    {user.role}
                  </Badge>
                  <p className="text-sm text-neutral-500">
                    {formatDate(user.createdAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}

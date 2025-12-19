import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { adminService } from '@/services/adminService';
import { formatDate } from '@/utils/helpers';
import { Search, Briefcase, MapPin, Star } from 'lucide-react';

export default function ProvidersPage() {
  const navigate = useNavigate();
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadProviders();
  }, []);

  const loadProviders = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAllProviders();
      setProviders(response.data?.providers || []);
    } catch (error) {
      console.error('Failed to load providers:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return <Badge variant="success">Approved</Badge>;
      case 'pending':
        return <Badge variant="warning">Pending</Badge>;
      case 'rejected':
        return <Badge variant="error">Rejected</Badge>;
      case 'suspended':
        return <Badge variant="error">Suspended</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const filteredProviders = providers.filter(provider => {
    const matchesSearch = 
      provider.businessName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      provider.userId?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      provider.userId?.email?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || provider.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <AdminLayout title="All Providers">
        <div className="flex items-center justify-center h-96">
          <Spinner size="lg" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="All Providers">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
          <Input
            placeholder="Search providers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full sm:w-48"
        >
          <option value="all">All Status</option>
          <option value="approved">Approved</option>
          <option value="pending">Pending</option>
          <option value="rejected">Rejected</option>
          <option value="suspended">Suspended</option>
        </Select>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-neutral-200">
          <div className="text-2xl font-bold text-neutral-900">{providers.length}</div>
          <div className="text-sm text-neutral-500">Total Providers</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-neutral-200">
          <div className="text-2xl font-bold text-success">{providers.filter(p => p.status === 'approved').length}</div>
          <div className="text-sm text-neutral-500">Approved</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-neutral-200">
          <div className="text-2xl font-bold text-warning">{providers.filter(p => p.status === 'pending').length}</div>
          <div className="text-sm text-neutral-500">Pending</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-neutral-200">
          <div className="text-2xl font-bold text-error">{providers.filter(p => p.status === 'rejected' || p.status === 'suspended').length}</div>
          <div className="text-sm text-neutral-500">Rejected/Suspended</div>
        </div>
      </div>

      {/* Providers List */}
      {filteredProviders.length === 0 ? (
        <Card>
          <CardContent className="py-16">
            <div className="text-center">
              <Briefcase className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">No Providers Found</h3>
              <p className="text-neutral-500">
                {searchQuery || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filters'
                  : 'No service providers have registered yet'}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredProviders.map((provider) => (
            <Card 
              key={provider._id} 
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => navigate(`/providers/${provider._id}`)}
            >
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <span className="text-primary font-bold text-xl">
                        {provider.businessName?.charAt(0) || provider.userId?.name?.charAt(0) || 'P'}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-neutral-900">
                        {provider.businessName || provider.userId?.name || 'Unknown'}
                      </h3>
                      <p className="text-sm text-neutral-500">{provider.userId?.email}</p>
                      <div className="flex items-center gap-4 mt-1">
                        {provider.location?.city && (
                          <span className="flex items-center gap-1 text-xs text-neutral-400">
                            <MapPin className="w-3 h-3" />
                            {provider.location.city}
                          </span>
                        )}
                        {provider.rating > 0 && (
                          <span className="flex items-center gap-1 text-xs text-neutral-400">
                            <Star className="w-3 h-3 text-yellow-500" />
                            {provider.rating.toFixed(1)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    {provider.category && (
                      <span className="text-sm text-neutral-600 bg-neutral-100 px-3 py-1 rounded-lg">
                        {provider.category?.name || provider.category}
                      </span>
                    )}
                    {getStatusBadge(provider.status)}
                    <span className="text-xs text-neutral-400">
                      {formatDate(provider.createdAt)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}


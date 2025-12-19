import { Card, CardContent } from '@/components/ui/Card';
import { cn } from '@/utils/helpers';

export function StatCard({ title, value, icon: Icon, trend, trendValue, color = 'primary' }) {
  const colors = {
    primary: 'bg-primary-50 text-primary',
    success: 'bg-green-50 text-green-600',
    error: 'bg-red-50 text-red-600',
    warning: 'bg-yellow-50 text-yellow-600',
    info: 'bg-blue-50 text-blue-600',
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-neutral-500 mb-1">{title}</p>
            <p className="text-3xl font-bold text-neutral-900">{value}</p>
            {trend && (
              <p className={cn(
                'text-sm mt-2',
                trend === 'up' ? 'text-success' : 'text-error'
              )}>
                <span>{trend === 'up' ? '↑' : '↓'} {trendValue}</span>
                <span className="text-neutral-500 ml-1">vs last month</span>
              </p>
            )}
          </div>
          <div className={cn('p-3 rounded-lg', colors[color])}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

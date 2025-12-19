import { Card, CardContent } from '@/components/ui/Card';
import { cn } from '@/utils/helpers';

export function StatCard({ title, value, icon: Icon, trend, trendValue, color = 'primary', onClick }) {
  const colors = {
    primary: 'bg-primary-50 text-primary',
    success: 'bg-success/10 text-success',
    error: 'bg-error/10 text-error',
    warning: 'bg-warning/10 text-warning',
    info: 'bg-info/10 text-info',
  };

  const Component = onClick ? 'button' : 'div';

  return (
    <Card className={cn(onClick && 'cursor-pointer hover:shadow-lg transition-shadow')}>
      <Component 
        onClick={onClick} 
        className={cn('w-full text-left', onClick && 'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-xl')}
      >
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
            <div className={cn('p-4 rounded-xl', colors[color])}>
              <Icon className="w-6 h-6" />
            </div>
          </div>
        </CardContent>
      </Component>
    </Card>
  );
}

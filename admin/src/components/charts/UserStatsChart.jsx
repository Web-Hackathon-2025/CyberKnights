import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

export function UserStatsChart({ data }) {
  const chartData = data || [
    { name: 'Jan', users: 40 },
    { name: 'Feb', users: 52 },
    { name: 'Mar', users: 61 },
    { name: 'Apr', users: 73 },
    { name: 'May', users: 89 },
    { name: 'Jun', users: 105 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Growth</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#EEEEEE" />
            <XAxis dataKey="name" stroke="#6B7280" />
            <YAxis stroke="#6B7280" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: '1px solid #D1D5DB',
                borderRadius: '8px'
              }}
            />
            <Bar dataKey="users" fill="#0284C7" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

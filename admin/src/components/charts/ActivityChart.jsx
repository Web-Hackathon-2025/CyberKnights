import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

export function ActivityChart({ data }) {
  const chartData = data || [
    { name: 'Mon', visits: 120 },
    { name: 'Tue', visits: 150 },
    { name: 'Wed', visits: 180 },
    { name: 'Thu', visits: 160 },
    { name: 'Fri', visits: 200 },
    { name: 'Sat', visits: 140 },
    { name: 'Sun', visits: 100 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
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
            <Line 
              type="monotone" 
              dataKey="visits" 
              stroke="#008080" 
              strokeWidth={2}
              dot={{ fill: '#008080', r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

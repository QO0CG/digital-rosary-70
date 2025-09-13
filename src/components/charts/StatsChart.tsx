import React from 'react';
import { Card } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface StatsData {
  date: string;
  count: number;
  label: string;
}

interface StatsChartProps {
  data: StatsData[];
  title: string;
  color?: string;
}

export const StatsChart: React.FC<StatsChartProps> = ({ 
  data, 
  title, 
  color = 'hsl(var(--primary))' 
}) => {
  return (
    <Card className="card-islamic">
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-4 text-center">{title}</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="label" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  color: 'hsl(var(--foreground))'
                }}
                labelFormatter={(label) => `${label}`}
                formatter={(value: number) => [value.toLocaleString('ar-EG'), 'عدد التسبيحات']}
              />
              <Bar 
                dataKey="count" 
                fill={color}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
};
import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

type Metric = 'views' | 'clicks';

type DataPoint = {
  date: string;
  views?: number;
  clicks?: number;
};

interface PerformanceAreaChartProps {
  data: DataPoint[];
  metric: Metric;
}

const PerformanceAreaChart: React.FC<PerformanceAreaChartProps> = ({
  data: prepaddedData,
  metric,
}) => {
  const padDataWithZeros = (data: DataPoint[]): DataPoint[] => {
    if (data.length === 1) {
      const currentDateStr = data[0]?.date ?? '';
      const currentDate = new Date(currentDateStr);
      const prevDate = new Date(currentDate);
      prevDate.setDate(prevDate.getDate() - 1);
      const nextDate = new Date(currentDate);
      nextDate.setDate(nextDate.getDate() + 1);

      return [
        {
          date: prevDate.toISOString().split('T')[0] || '',
          views: 0,
          clicks: 0,
        },
        {
          date: currentDateStr,
          views: data[0]?.views ?? 0,
          clicks: data[0]?.clicks ?? 0,
        },
        {
          date: nextDate.toISOString().split('T')[0] || '',
          views: 10,
          clicks: 0,
        },
        {
          date: nextDate.toISOString().split('T')[0] || '',
          views: 5,
          clicks: 0,
        },
      ];
    }
    return data;
  };

  const data = padDataWithZeros(prepaddedData);
  const dataKey = metric === 'views' ? 'views' : 'clicks';
  const color = metric === 'views' ? '#8b5cf6' : '#10b981';

  return (
    <ResponsiveContainer width='100%' height={300}>
      <AreaChart
        data={data}
        margin={{ top: 10, right: 24, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id='perfGrad' x1='0' y1='0' x2='0' y2='1'>
            <stop offset='0%' stopColor={color} stopOpacity={0.18} />
            <stop offset='100%' stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>

        <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
        <XAxis dataKey='date' tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip
          formatter={(value: number) => `${value.toLocaleString()} ${metric}`}
        />

        <Area
          type='monotone'
          dataKey={dataKey}
          stroke={color}
          strokeWidth={2}
          fill='url(#perfGrad)'
          dot={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default PerformanceAreaChart;

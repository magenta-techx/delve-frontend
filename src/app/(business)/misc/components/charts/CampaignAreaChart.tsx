import { format } from 'date-fns';
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
import { useIsMobile } from '@/hooks';

type Metric = 'views' | 'clicks';

type DataPoint = {
  date: string;
  views?: number;
  clicks?: number;
};

interface CampaignAreaChartProps {
  data: DataPoint[];
  metric: Metric;
}

const CampaignAreaChart: React.FC<CampaignAreaChartProps> = ({
  data: prepaddedData,
  metric,
}) => {
  const padDataWithZeros = (data: DataPoint[]): DataPoint[] => {
    if (data.length === 1) {
      const currentDateStr = data[0]?.date ?? '';
      const currentDate = new Date(currentDateStr);
      const prevDate = new Date(currentDate);
      const twoDaysBefore = new Date(currentDate);
      twoDaysBefore.setDate(twoDaysBefore.getDate() - 2);
      prevDate.setDate(prevDate.getDate() - 1);
      const nextDate = new Date(currentDate);
      nextDate.setDate(nextDate.getDate() + 1);

      return [
        {
          date: format(twoDaysBefore, 'dd/MM/yy') || '',
          views: 0,
          clicks: 0,
        },
        {
          date: format(prevDate, 'dd/MM/yy') || '',
          views: 0,
          clicks: 0,
        },
        {
          date: format(currentDate, 'dd/MM/yy') || '',
          views: data[0]?.views ?? 0,
          clicks: data[0]?.clicks ?? 0,
        },
        {
          date: format(nextDate, 'dd/MM/yy') || '',
          views: 0,
          clicks: 0,
        },
      ];
    }
    return data.map(datapoint => ({
      date: format(new Date(datapoint.date), 'dd/MM/yy') || '',
      views: datapoint.views ?? 0,
      clicks: datapoint.clicks ?? 0,
    }));
  };

  const data = padDataWithZeros(prepaddedData);
  const dataKey = metric === 'views' ? 'views' : 'clicks';
  const color = metric === 'views' ? '#8b5cf6' : '#10b981';
  const { isMobile } = useIsMobile();
  const tickFs = isMobile ? 8 : 12;
  const tooltipFs = isMobile ? '10px' : '12px';

  return (
    <div style={{ background: '#FDFDFF', borderRadius: 12 }}>
      <ResponsiveContainer width='100%' height={isMobile ? 200 : 300}>
        <AreaChart
          data={data}
          margin={isMobile ? { top: 6, right: 8, left: -10, bottom: 0 } : { top: 10, right: 24, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id='perfGrad' x1='0' y1='0' x2='0' y2='1'>
              <stop offset='0%' stopColor={color} stopOpacity={0.18} />
              <stop offset='100%' stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
          <XAxis dataKey='date' tick={{ fontSize: tickFs }} />
          <YAxis
            tick={{ fontSize: tickFs }}
            axisLine={false}
            tickLine={false}
            width={isMobile ? 28 : 40}
            type='number'
            domain={[0, 'auto']}
          />
          <Tooltip
            formatter={(value: number) => `${value.toLocaleString()} ${metric}`}
            contentStyle={{
              fontSize: tooltipFs,
              padding: '4px 8px',
              borderRadius: '10px',
            }}
            itemStyle={{ fontSize: tooltipFs }}
            labelStyle={{ fontSize: tooltipFs }}
          />

          <Area
            type='monotone'
            // type='basis'
            dataKey={dataKey}
            stroke={color}
            strokeWidth={2}
            fill='url(#perfGrad)'
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CampaignAreaChart;

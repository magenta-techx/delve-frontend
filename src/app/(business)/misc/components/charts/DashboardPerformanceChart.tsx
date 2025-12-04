import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

type Performance = {
  id: number;
  created_at: string;
  formatted_date: string;
  performance_score: number;
};

interface DashboardPerformanceChartProps {
  performances: Performance[];
}

const dayShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function getDayLabel(dateStr: string) {
  const d = new Date(dateStr);
  return dayShort[d.getDay()];
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          background: '#fff',
          borderRadius: 8,
          padding: '4px 10px',
          fontSize: 12,
          boxShadow: '0 2px 8px #0001',
        }}
      >
        <span>{payload[0].payload.formatted_date}</span>
        <br />
        <b>{payload[0].value}</b>
      </div>
    );
  }
  return null;
};

const DashboardPerformanceChart: React.FC<DashboardPerformanceChartProps> = ({
  performances,
}) => {
  // Sort by date ascending (Mon-Sun)
  const sorted = [...performances].sort(
    (a, b) =>
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );
  // Map to chart data
  const data = sorted.map(p => ({
    ...p,
    day: getDayLabel(p.created_at),
    score: p.performance_score,
  }));

  return (
    <div
      className='mt-12 w-full'
      style={{ background: '#fff', borderRadius: 16, padding: 0, height: 180 }}
    >
      <div className='flex items-center justify-center mb-2 gap-2'>
        <svg
          width='18'
          height='20'
          viewBox='0 0 18 20'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            fillRule='evenodd'
            clipRule='evenodd'
            d='M15 0H13C11.3431 0 10 1.34315 10 3V17C10 18.6569 11.3431 20 13 20H15C16.6569 20 18 18.6569 18 17V3C18 1.34315 16.6569 0 15 0ZM13 1.5H15C15.8284 1.5 16.5 2.17157 16.5 3V17C16.5 17.8284 15.8284 18.5 15 18.5H13C12.1716 18.5 11.5 17.8284 11.5 17V3C11.5 2.17157 12.1716 1.5 13 1.5Z'
            fill='#551FB9'
          />
          <path
            fillRule='evenodd'
            clipRule='evenodd'
            d='M5 6H3C1.34315 6 0 7.34315 0 9V17C0 18.6569 1.34315 20 3 20H5C6.65685 20 8 18.6569 8 17V9C8 7.34315 6.65685 6 5 6ZM3 7.5H5C5.82843 7.5 6.5 8.17157 6.5 9V17C6.5 17.8284 5.82843 18.5 5 18.5H3C2.17157 18.5 1.5 17.8284 1.5 17V9C1.5 8.17157 2.17157 7.5 3 7.5Z'
            fill='#551FB9'
          />
        </svg>

        <span className='text-sm lg:text-base text-[#8b5cf6] font-semibold'>
          Weekly Performance
        </span>
      </div>
      <ResponsiveContainer width='100%' className={'h-48 xl:h-64 2xl:h-72 bg-[#FBFAFF] rounded-xl'}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 8, left: 8, bottom: 0 }}
          barCategoryGap={4}
        >
          <XAxis
            dataKey='day'
            tick={{ fontSize: 13, fill: '#888' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            hide
            domain={[
              0,
              (dataMax: number) => Math.max(10, Math.ceil(dataMax * 1.1)),
            ]}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f3f0ff' }} />
          <Bar
            dataKey='score'
            radius={7}
            fill='#A48AFB'
            maxBarSize={33}
            width={30}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DashboardPerformanceChart;

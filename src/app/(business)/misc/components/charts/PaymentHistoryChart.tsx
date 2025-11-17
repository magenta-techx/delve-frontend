import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import React, { useMemo, useState } from 'react';

export interface PaymentHistoryChartProps {
  paymentHistory: Array<{
    timestamp: string;
    amount_paid: number;
  }>;
  totalSpending: number;
  selectedPeriod: 'all_time' | 'this_month' | 'last_6_months' | 'last_12_months';
}

function formatChartData(paymentHistory: PaymentHistoryChartProps['paymentHistory'], selectedPeriod: PaymentHistoryChartProps['selectedPeriod']) {
  if (selectedPeriod === 'this_month') {
    // Group by day
    const dayMap: Record<string, number> = {};
    paymentHistory.forEach(p => {
      const date = new Date(p.timestamp);
      const key = date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
      dayMap[key] = (dayMap[key] || 0) + p.amount_paid;
    });
    return Object.entries(dayMap).map(([date, amount]) => ({ date, amount }));
  } else {
    // Group by month (and year for all_time)
    const monthMap: Record<string, number> = {};
    paymentHistory.forEach(p => {
      const date = new Date(p.timestamp);
      let key = date.toLocaleDateString('en-GB', { month: 'short', year: '2-digit' });
      if (selectedPeriod === 'all_time') {
        key = date.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
      }
      monthMap[key] = (monthMap[key] || 0) + p.amount_paid;
    });
    return Object.entries(monthMap).map(([date, amount]) => ({ date, amount }));
  }
}

export const PaymentHistoryChart: React.FC<PaymentHistoryChartProps> = ({ paymentHistory, totalSpending, selectedPeriod }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const chartData = useMemo(() => formatChartData(paymentHistory, selectedPeriod), [paymentHistory, selectedPeriod]);

  // Fill missing days/months with zeroes
  let filledData = chartData;
  if (selectedPeriod === 'this_month') {
    // Get all days in this month
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const allDays: string[] = Array.from({ length: daysInMonth }, (_, i) => {
      return new Date(year, month, i + 1).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    });
    const dataMap = Object.fromEntries(chartData.map(d => [d.date, d.amount]));
    filledData = allDays.map(date => ({ date, amount: dataMap[date] || 0 }));
  } else {
    // For months, get last 10 months
    const now = new Date();
    let months: string[] = [];
    for (let i = 9; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      let key = d.toLocaleDateString('en-GB', { month: 'short', year: selectedPeriod === 'all_time' ? 'numeric' : '2-digit' });
      months.push(key);
    }
    const dataMap = Object.fromEntries(chartData.map(d => [d.date, d.amount]));
    filledData = months.map(date => ({ date, amount: dataMap[date] || 0 }));
  }

  // Only show up to 10, enable horizontal scroll
  return (
    <div className="w-full relative overflow-x-auto" style={{ WebkitOverflowScrolling: 'touch' }}>
      {/* Vanishing effect overlays */}
      <div className="pointer-events-none absolute left-0 top-0 h-full w-8 bg-gradient-to-r from-white/80 to-transparent z-10" />
      <div className="pointer-events-none absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-white/80 to-transparent z-10" />
      <div className="mb-6">
        <p className="text-4xl font-bold text-gray-900">₦{totalSpending.toLocaleString()}</p>
        <p className="mt-1 text-sm text-gray-500">Total Spendings</p>
      </div>
      <div style={{ minWidth: 520, width: Math.max(520, filledData.length * 52) }} className="pr-2">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={filledData} barCategoryGap={"40%"}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" tick={{ fontSize: 13, fill: '#697586', fontWeight: 500 }} tickLine={false} axisLine={false} interval={0} />
            <YAxis tick={{ fontSize: 12, fill: '#697586' }} axisLine={false} tickLine={false} tickFormatter={value => {
              if (value >= 1000000) return `${(value/1000000).toFixed(1)}M`;
              if (value >= 1000) return `${(value/1000).toFixed(0)}k`;
              return value;
            }} />
            <Tooltip formatter={(value: number) => `₦${value.toLocaleString()}`} cursor={{ fill: '#F5F3FF' }} />
            <Bar dataKey="amount"
              fill="#A78BFA"
              radius={[12, 12, 12, 12]}
              minPointSize={6}
              maxBarSize={32}
              onMouseOver={(_, idx) => setActiveIndex(idx)}
              onMouseOut={() => setActiveIndex(null)}
              {
                ...{
                  shape: (props) => {
                    const { x, y, width, height, index } = props;
                    const isActive = index === activeIndex;
                    return (
                      <rect
                        x={x}
                        y={y}
                        width={width}
                        height={height}
                        rx={12}
                        fill={isActive ? '#5F2EEA' : '#A78BFA'}
                        style={{ transition: 'fill 0.2s' }}
                      />
                    );
                  }
                }
              }
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

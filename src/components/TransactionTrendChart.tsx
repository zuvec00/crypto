import { useMemo } from 'react';
import { TrendingUp } from 'lucide-react';

interface TransactionTrendChartProps {
  data: Array<{ date: string; count: number }>;
  loading?: boolean;
}

export function TransactionTrendChart({ data, loading }: TransactionTrendChartProps) {
  if (loading) {
    return (
      <div className="bg-dark-gray p-6 rounded-xl border border-medium-gray">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-soft-white">Transaction Trend</h3>
          <TrendingUp className="h-5 w-5 text-electric-blue" />
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="animate-pulse text-gray-400">Loading chart...</div>
        </div>
      </div>
    );
  }

  const maxValue = useMemo(() => Math.max(...data.map(d => d.count), 1), [data]);
  const chartHeight = 200;
  
  const chartPoints = useMemo(() => {
    return data.map((point, index) => {
      const x = (index / (data.length - 1)) * 100;
      const y = chartHeight - (point.count / maxValue) * chartHeight;
      return { x, y, point, index };
    });
  }, [data, maxValue, chartHeight]);

  return (
    <div className="bg-dark-gray p-6 rounded-xl border border-medium-gray">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-soft-white">Transaction Trend</h3>
        <TrendingUp className="h-5 w-5 text-electric-blue" />
      </div>
      
      <div className="relative pl-12" style={{ height: chartHeight + 40 }}>
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-400" style={{ height: chartHeight }}>
          <span>{maxValue}</span>
          <span>{Math.round(maxValue * 0.75)}</span>
          <span>{Math.round(maxValue * 0.5)}</span>
          <span>{Math.round(maxValue * 0.25)}</span>
          <span>0</span>
        </div>
        
        <svg width="100%" height={chartHeight + 40} viewBox="0 0 100 240" preserveAspectRatio="xMidYMid meet" className="overflow-visible">
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
            <line
              key={i}
              x1="0"
              y1={chartHeight * ratio}
              x2="100%"
              y2={chartHeight * ratio}
              stroke="#374151"
              strokeWidth="1"
              strokeDasharray="2,2"
            />
          ))}
          
          {/* Chart line */}
          <polyline
            fill="none"
            stroke="#3B82F6"
            strokeWidth="2"
            points={chartPoints.map(({ x, y }) => `${x},${y}`).join(' ')}
          />
          
          {/* Data points */}
          {chartPoints.map(({ x, y, point, index }) => (
            <circle
              key={index}
              cx={x}
              cy={y}
              r="4"
              fill="#3B82F6"
              className="hover:r-6 transition-all cursor-pointer"
            >
              <title>{`${point.date}: ${point.count} transactions`}</title>
            </circle>
          ))}
          
          {/* X-axis labels */}
          {chartPoints.map(({ x, point, index }) => {
            if (index % Math.ceil(data.length / 5) === 0) {
              return (
                <text
                  key={index}
                  x={x}
                  y={chartHeight + 20}
                  textAnchor="middle"
                  className="fill-gray-400 text-xs"
                >
                  {new Date(point.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </text>
              );
            }
            return null;
          })}
        </svg>
      </div>
    </div>
  );
}
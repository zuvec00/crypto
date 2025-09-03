import { useMemo } from 'react';
import { PieChart, Bitcoin, Coins, DollarSign } from 'lucide-react';

interface CryptoDistributionChartProps {
  volumeData: {
    btc?: { total: number; volume: number };
    eth?: { total: number; volume: number };
    usdt?: { total: number; volume: number };
  } | null;
  loading?: boolean;
}

export function CryptoDistributionChart({ volumeData, loading }: CryptoDistributionChartProps) {
  if (loading) {
    return (
      <div className="bg-dark-gray p-6 rounded-xl border border-medium-gray">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-soft-white">Crypto Distribution</h3>
          <PieChart className="h-5 w-5 text-electric-blue" />
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="animate-pulse text-gray-400">Loading chart...</div>
        </div>
      </div>
    );
  }

  const { btcTotal, ethTotal, usdtTotal, total, btcPercent, ethPercent, usdtPercent } = useMemo(() => {
    const btc = volumeData?.btc?.total || 0;
    const eth = volumeData?.eth?.total || 0;
    const usdt = volumeData?.usdt?.total || 0;
    const totalVol = btc + eth + usdt;
    
    return {
      btcTotal: btc,
      ethTotal: eth,
      usdtTotal: usdt,
      total: totalVol,
      btcPercent: totalVol > 0 ? (btc / totalVol) * 100 : 0,
      ethPercent: totalVol > 0 ? (eth / totalVol) * 100 : 0,
      usdtPercent: totalVol > 0 ? (usdt / totalVol) * 100 : 0
    };
  }, [volumeData]);

  const radius = 80;
  const centerX = 120;
  const centerY = 120;

  let cumulativePercent = 0;

  const createArc = (percent: number, color: string) => {
    const startAngle = (cumulativePercent / 100) * 2 * Math.PI - Math.PI / 2;
    const endAngle = ((cumulativePercent + percent) / 100) * 2 * Math.PI - Math.PI / 2;
    
    const x1 = centerX + radius * Math.cos(startAngle);
    const y1 = centerY + radius * Math.sin(startAngle);
    const x2 = centerX + radius * Math.cos(endAngle);
    const y2 = centerY + radius * Math.sin(endAngle);
    
    const largeArc = percent > 50 ? 1 : 0;
    
    cumulativePercent += percent;
    
    return `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
  };

  return (
    <div className="bg-dark-gray p-6 rounded-xl border border-medium-gray">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-soft-white">Crypto Distribution</h3>
        <PieChart className="h-5 w-5 text-electric-blue" />
      </div>
      
      <div className="flex items-center justify-between">
        <svg width="240" height="240" className="flex-shrink-0">
          {btcPercent > 0 && (
            <path d={createArc(btcPercent, '#F59E0B')} fill="#F59E0B" opacity="0.8" />
          )}
          {ethPercent > 0 && (
            <path d={createArc(ethPercent, '#3B82F6')} fill="#3B82F6" opacity="0.8" />
          )}
          {usdtPercent > 0 && (
            <path d={createArc(usdtPercent, '#10B981')} fill="#10B981" opacity="0.8" />
          )}
        </svg>
        
        <div className="space-y-4 ml-6">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-metallic-gold rounded-full"></div>
              <Bitcoin className="h-4 w-4 text-metallic-gold" />
            </div>
            <div>
              <p className="text-sm font-medium text-soft-white">Bitcoin</p>
              <p className="text-xs text-gray-400">{btcPercent.toFixed(1)}% • ₦{(btcTotal / 1000000).toFixed(1)}M</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-electric-blue rounded-full"></div>
              <Coins className="h-4 w-4 text-electric-blue" />
            </div>
            <div>
              <p className="text-sm font-medium text-soft-white">Ethereum</p>
              <p className="text-xs text-gray-400">{ethPercent.toFixed(1)}% • ₦{(ethTotal / 1000000).toFixed(1)}M</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              <DollarSign className="h-4 w-4 text-green-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-soft-white">USDT</p>
              <p className="text-xs text-gray-400">{usdtPercent.toFixed(1)}% • ₦{(usdtTotal / 1000000).toFixed(1)}M</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
import React, { useState, useMemo } from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ReferenceLine 
} from 'recharts';
import { 
  TrendingUp, 
  Coins, 
  PieChart as PieIcon, 
  ArrowUpRight, 
  Wallet, 
  ShieldCheck, 
  Clock, 
  Plus, 
  Download, 
  Sparkles,
  Layers,
  CheckCircle2,
  Filter
} from 'lucide-react';
import { PresaleParameters, BuyerInvestment, PaymentMethod } from '../types';

interface DashboardTabProps {
  parameters: PresaleParameters;
  investments: BuyerInvestment[];
  onAddSimulatedInvestment: (method: PaymentMethod, amount: number) => void;
  onOpenChromeModal: () => void;
  onNavigateToLaunchpad: () => void;
}

// Payment method palette
const PAYMENT_COLORS: Record<PaymentMethod, string> = {
  ETH: '#f59e0b',  // Amber Gold
  USDT: '#10b981', // Emerald Green
  USDC: '#06b6d4'  // Cyan Blue
};

interface TimeSeriesPoint {
  timestamp: string;
  date: string;
  dailyInfluxEth: number;
  cumulativeEth: number;
  cumulativeUsd: number;
}

export const DashboardTab: React.FC<DashboardTabProps> = ({
  parameters,
  investments,
  onAddSimulatedInvestment,
  onOpenChromeModal,
  onNavigateToLaunchpad
}) => {
  const [timeRange, setTimeRange] = useState<'All' | '7D' | '24H'>('All');
  const [activeMetric, setActiveMetric] = useState<'cumulative' | 'daily'>('cumulative');

  // 1. Calculate Payment Method Distribution for Pie Chart
  const pieData = useMemo(() => {
    const totals: Record<PaymentMethod, { amount: number; count: number; ethEquivalent: number }> = {
      ETH: { amount: 0, count: 0, ethEquivalent: 0 },
      USDT: { amount: 0, count: 0, ethEquivalent: 0 },
      USDC: { amount: 0, count: 0, ethEquivalent: 0 }
    };

    investments.forEach(inv => {
      if (inv.distributionStatus === 'Refunded') return;
      totals[inv.paymentMethod].amount += inv.amountPaid;
      totals[inv.paymentMethod].count += 1;
      const ethEq = inv.paymentMethod === 'ETH' ? inv.amountPaid : (inv.amountPaid / 3000);
      totals[inv.paymentMethod].ethEquivalent += ethEq;
    });

    const totalEthAll = Object.values(totals).reduce((sum, item) => sum + item.ethEquivalent, 0) || 1;

    return (['ETH', 'USDT', 'USDC'] as PaymentMethod[]).map(method => {
      const ethEq = totals[method].ethEquivalent;
      const percentage = (ethEq / totalEthAll) * 100;
      return {
        name: method,
        value: Number(ethEq.toFixed(2)),
        rawAmount: totals[method].amount,
        count: totals[method].count,
        percentage: Number(percentage.toFixed(1)),
        color: PAYMENT_COLORS[method]
      };
    });
  }, [investments]);

  // 2. Build Time Series Data for Line/Area Chart (Investment Influx Over Time)
  const timeSeriesData = useMemo<TimeSeriesPoint[]>(() => {
    // Generate base trend curve combined with actual investments
    const points: TimeSeriesPoint[] = [
      { timestamp: 'Day 1', date: 'Oct 28', dailyInfluxEth: 1.2, cumulativeEth: 1.2, cumulativeUsd: 3600 },
      { timestamp: 'Day 2', date: 'Oct 29', dailyInfluxEth: 2.8, cumulativeEth: 4.0, cumulativeUsd: 12000 },
      { timestamp: 'Day 3', date: 'Oct 30', dailyInfluxEth: 3.5, cumulativeEth: 7.5, cumulativeUsd: 22500 },
      { timestamp: 'Day 4', date: 'Oct 31', dailyInfluxEth: 4.0, cumulativeEth: 11.5, cumulativeUsd: 34500 },
      { timestamp: 'Day 5', date: 'Nov 01', dailyInfluxEth: 3.8, cumulativeEth: 15.3, cumulativeUsd: 45900 }, // Passed Soft Cap
      { timestamp: 'Day 6', date: 'Nov 02', dailyInfluxEth: 2.4, cumulativeEth: 17.7, cumulativeUsd: 53100 },
      { timestamp: 'Day 7', date: 'Nov 03', dailyInfluxEth: 4.2, cumulativeEth: 21.9, cumulativeUsd: 65700 }
    ];

    // Compute extra live additions from recent investments
    let extraEth = 0;
    investments.forEach((inv, idx) => {
      if (idx > 2) {
        const val = inv.paymentMethod === 'ETH' ? inv.amountPaid : (inv.amountPaid / 3000);
        extraEth += val;
      }
    });

    if (extraEth > 0) {
      const lastPoint = points[points.length - 1];
      const newTotal = Number((lastPoint.cumulativeEth + extraEth).toFixed(2));
      points.push({
        timestamp: 'Live Now',
        date: 'Today',
        dailyInfluxEth: Number(extraEth.toFixed(2)),
        cumulativeEth: newTotal,
        cumulativeUsd: Number((newTotal * 3000).toFixed(0))
      });
    }

    if (timeRange === '24H') {
      return points.slice(-3);
    }
    if (timeRange === '7D') {
      return points.slice(-7);
    }
    return points;
  }, [investments, timeRange]);

  // Overall Metrics
  const currentTotalEth = timeSeriesData[timeSeriesData.length - 1]?.cumulativeEth || 21.9;
  const softCapReached = currentTotalEth >= parameters.softCap;
  const hardCapProgressPct = Math.min(100, (currentTotalEth / parameters.hardCap) * 100);
  const softCapProgressPct = (currentTotalEth / parameters.softCap) * 100;
  const averageTicketEth = (currentTotalEth / Math.max(1, investments.length + 8)).toFixed(2);

  // Custom Tooltip for Line Chart
  const CustomLineTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as TimeSeriesPoint;
      return (
        <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl shadow-2xl text-xs font-mono space-y-1 z-50">
          <div className="text-amber-400 font-bold border-b border-slate-800 pb-1 flex justify-between gap-4">
            <span>{data.timestamp} ({data.date})</span>
            <span className="text-slate-400">Presale Influx</span>
          </div>
          <div className="text-white flex justify-between gap-4">
            <span className="text-slate-400">Cumulative Raised:</span>
            <span className="font-bold text-amber-300">{data.cumulativeEth.toFixed(2)} ETH</span>
          </div>
          <div className="text-slate-300 flex justify-between gap-4">
            <span className="text-slate-400">USD Valuation:</span>
            <span>${data.cumulativeUsd.toLocaleString()}</span>
          </div>
          <div className="text-emerald-400 flex justify-between gap-4">
            <span className="text-slate-400">Interval Influx:</span>
            <span>+{data.dailyInfluxEth.toFixed(2)} ETH</span>
          </div>
        </div>
      );
    }
    return null;
  };

  // Custom Tooltip for Pie Chart
  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl shadow-2xl text-xs font-mono space-y-1">
          <div className="font-bold flex items-center gap-1.5" style={{ color: data.color }}>
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: data.color }} />
            <span>{data.name} Payment Method</span>
          </div>
          <div className="text-white flex justify-between gap-4">
            <span className="text-slate-400">ETH Equivalent:</span>
            <span className="font-bold">{data.value} ETH</span>
          </div>
          <div className="text-slate-300 flex justify-between gap-4">
            <span className="text-slate-400">Volume Share:</span>
            <span>{data.percentage}%</span>
          </div>
          <div className="text-slate-400 flex justify-between gap-4">
            <span>Transactions:</span>
            <span>{data.count} txs</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner: Dashboard & Chrome Web Store Extension Shortcut */}
      <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-amber-400 font-mono">
            <span>RECHARTS ANALYTICS ENGINE</span>
            <span className="text-slate-600">·</span>
            <span>ETHEREUM CROWDSALE TELEMETRY</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1 flex items-center gap-2.5">
            <TrendingUp className="w-6 h-6 text-amber-400" />
            <span>Presale Performance Dashboard</span>
          </h1>
          <p className="text-sm text-slate-400 max-w-2xl mt-1 leading-relaxed">
            Real-time visual analytics of investment influx over time, multi-currency distribution (ETH / USDT / USDC), and soft/hard cap execution benchmarks.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={onOpenChromeModal}
            className="px-3.5 py-2 text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-xl shadow-md shadow-amber-400/20 transition-all flex items-center gap-1.5 active:scale-[0.98]"
            title="Download or preview Chrome Web Store extension"
          >
            <Sparkles className="w-3.5 h-3.5 text-slate-950" />
            <span>Chrome Web Store Extension</span>
          </button>

          <button
            onClick={() => onAddSimulatedInvestment('ETH', 2.5)}
            className="px-3 py-2 text-xs font-semibold text-slate-200 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl transition-colors flex items-center gap-1.5"
            title="Inject simulated 2.5 ETH investment influx"
          >
            <Plus className="w-3.5 h-3.5 text-amber-400" />
            <span>+2.5 ETH Influx</span>
          </button>

          <button
            onClick={() => onAddSimulatedInvestment('USDT', 3000)}
            className="px-3 py-2 text-xs font-semibold text-slate-200 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl transition-colors flex items-center gap-1.5"
            title="Inject simulated 3,000 USDT investment influx"
          >
            <Plus className="w-3.5 h-3.5 text-emerald-400" />
            <span>+3K USDT Influx</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Raised */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 space-y-1">
          <div className="flex justify-between items-center text-xs text-slate-400">
            <span>Total Capital Raised</span>
            <span className="text-emerald-400 font-mono text-[11px]">+18.4% 24h</span>
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {currentTotalEth.toFixed(2)} ETH
          </div>
          <div className="text-[11px] font-mono text-slate-400">
            ≈ ${(currentTotalEth * 3000).toLocaleString()} USD
          </div>
        </div>

        {/* Soft Cap Status */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 space-y-1">
          <div className="flex justify-between items-center text-xs text-slate-400">
            <span>Soft Cap Execution</span>
            <span className={`text-[11px] font-mono ${softCapReached ? 'text-emerald-400 font-bold' : 'text-amber-400'}`}>
              {softCapReached ? '✓ Met & Unlocked' : 'In Progress'}
            </span>
          </div>
          <div className="text-2xl font-bold font-mono text-amber-300">
            {parameters.softCap} ETH
          </div>
          <div className="text-[11px] text-slate-400">
            {softCapProgressPct.toFixed(0)}% of minimum threshold
          </div>
        </div>

        {/* Hard Cap Status */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 space-y-1">
          <div className="flex justify-between items-center text-xs text-slate-400">
            <span>Hard Cap Progress</span>
            <span className="text-[11px] font-mono text-cyan-400">
              {hardCapProgressPct.toFixed(0)}%
            </span>
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400">
            {parameters.hardCap} ETH
          </div>
          <div className="text-[11px] text-slate-400">
            {(parameters.hardCap - currentTotalEth).toFixed(2)} ETH remaining to cap
          </div>
        </div>

        {/* Avg Ticket & Backers */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 space-y-1">
          <div className="flex justify-between items-center text-xs text-slate-400">
            <span>Average Ticket Size</span>
            <span className="text-[11px] font-mono text-slate-400">{investments.length + 8} Backers</span>
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {averageTicketEth} ETH
          </div>
          <div className="text-[11px] text-slate-400">
            Min: {parameters.minContribution} ETH · Max: {parameters.maxContribution} ETH
          </div>
        </div>

      </div>

      {/* Main Charts Grid: Left = Investment Influx Line Chart (7 cols), Right = Payment Methods Pie Chart (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Line Chart for Investment Influx Over Time (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-4">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-amber-400" />
                <h2 className="text-base font-bold text-white tracking-tight">
                  Investment Influx Over Time
                </h2>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Cumulative ETH raised plotted against the Soft Cap and Hard Cap benchmarks.
              </p>
            </div>

            {/* Timeframe Filter Buttons */}
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
              {(['All', '7D', '24H'] as const).map(range => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                    timeRange === range
                      ? 'bg-amber-400 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>

          {/* Recharts Area / Line Chart Container */}
          <div className="w-full h-72 pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timeSeriesData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <defs>
                  <linearGradient id="influxGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis 
                  dataKey="timestamp" 
                  stroke="#64748b" 
                  fontSize={11}
                  tickLine={false}
                />
                <YAxis 
                  stroke="#64748b" 
                  fontSize={11}
                  tickLine={false}
                  domain={[0, 60]}
                  unit="Ξ"
                />
                <Tooltip content={<CustomLineTooltip />} />
                
                {/* Soft Cap Reference Line */}
                <ReferenceLine 
                  y={parameters.softCap} 
                  stroke="#f59e0b" 
                  strokeDasharray="4 4"
                  label={{ value: `Soft Cap (${parameters.softCap} ETH)`, fill: '#f59e0b', fontSize: 10, position: 'right' }} 
                />

                {/* Hard Cap Reference Line */}
                <ReferenceLine 
                  y={parameters.hardCap} 
                  stroke="#10b981" 
                  strokeDasharray="4 4"
                  label={{ value: `Hard Cap (${parameters.hardCap} ETH)`, fill: '#10b981', fontSize: 10, position: 'right' }} 
                />

                {/* Shaded Area & Line */}
                <Area 
                  type="monotone" 
                  dataKey="cumulativeEth" 
                  stroke="#f59e0b" 
                  strokeWidth={2.5}
                  fillOpacity={1} 
                  fill="url(#influxGradient)" 
                  activeDot={{ r: 6, fill: '#f59e0b', stroke: '#ffffff', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Chart Sub-metrics */}
          <div className="grid grid-cols-3 gap-3 pt-3 border-t border-slate-800 text-xs font-mono">
            <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
              <span className="text-slate-500 block text-[10px]">CURRENT RATE</span>
              <span className="text-amber-300 font-bold">1 ETH = {parameters.tokenRate.toLocaleString()} {parameters.tokenSymbol}</span>
            </div>
            <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
              <span className="text-slate-500 block text-[10px]">SOFT CAP STATUS</span>
              <span className="text-emerald-400 font-bold">{softCapReached ? 'PASSED (Unlocked)' : 'PENDING'}</span>
            </div>
            <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
              <span className="text-slate-500 block text-[10px]">PRE-SALE RUNWAY</span>
              <span className="text-white font-bold">7 Days Remaining</span>
            </div>
          </div>

        </div>

        {/* Right Column: Pie Chart for Payment Method Distribution (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-4 flex flex-col justify-between">
          
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PieIcon className="w-4 h-4 text-emerald-400" />
                <h2 className="text-base font-bold text-white tracking-tight">
                  Payment Method Distribution
                </h2>
              </div>
              <span className="text-xs font-mono text-slate-400">ETH · USDT · USDC</span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Breakdown of investor payments received across designated accepted currencies.
            </p>
          </div>

          {/* Recharts Pie / Donut Chart Container */}
          <div className="w-full h-56 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip content={<CustomPieTooltip />} />
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#0f172a" strokeWidth={2} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            {/* Central Donut Callout */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
              <span className="text-[10px] font-mono text-slate-500 uppercase">Total Volume</span>
              <span className="text-base font-bold font-mono text-white">{currentTotalEth.toFixed(1)} ETH</span>
              <span className="text-[10px] font-mono text-emerald-400">3 Currencies</span>
            </div>
          </div>

          {/* Distribution Legend List */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            {pieData.map(item => (
              <div 
                key={item.name} 
                className="flex items-center justify-between text-xs font-mono p-2 rounded-lg bg-slate-950 border border-slate-800/80"
              >
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-white font-bold">{item.name}</span>
                  <span className="text-slate-500 text-[11px]">({item.count} txs)</span>
                </div>

                <div className="text-right">
                  <span className="text-white font-bold">{item.value} ETH</span>
                  <span className="text-slate-400 ml-2 text-[11px] font-normal">({item.percentage}%)</span>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>

      {/* Secondary Row: Influx Simulation & Contract Bridge */}
      <div className="p-5 bg-slate-900/40 border border-slate-800 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
            <Coins className="w-4 h-4 text-amber-400" />
            <span>Designated Receiver Wallet Settlement</span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Incoming investments flow straight into <span className="font-mono text-amber-300">{parameters.receivingWallet}</span> as configured during presale creation.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onNavigateToLaunchpad}
            className="px-3.5 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
          >
            Launchpad Parameters
          </button>
          
          <button
            onClick={onOpenChromeModal}
            className="px-3.5 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors"
          >
            Chrome Web Store Kit
          </button>
        </div>
      </div>

    </div>
  );
};

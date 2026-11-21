import React, { useState, useMemo, useEffect } from 'react';
import {
  TrendingUp,
  Calculator,
  ArrowUpRight,
  RefreshCw,
  SlidersHorizontal,
  DollarSign,
  Coins
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell
} from 'recharts';
import { PresaleParameters, PaymentMethod } from '../types';

interface ROICalculatorWidgetProps {
  parameters: PresaleParameters;
  portalAmount: string;
  portalCurrency: PaymentMethod;
  onApplyToPortal: (amount: string, currency: PaymentMethod) => void;
}

type ScenarioId = 'listing' | '2x' | '5x' | '10x' | '25x' | 'custom';

interface ScenarioOption {
  id: ScenarioId;
  label: string;
  sublabel: string;
  multiplier: number;
}

const ETH_PRICE_USD = 3000;

export const ROICalculatorWidget: React.FC<ROICalculatorWidgetProps> = ({
  parameters,
  portalAmount,
  portalCurrency,
  onApplyToPortal
}) => {
  const [calcCurrency, setCalcCurrency] = useState<PaymentMethod>(portalCurrency);
  const [calcAmount, setCalcAmount] = useState<string>(portalAmount || '1.0');
  const [selectedScenario, setSelectedScenario] = useState<ScenarioId>('5x');
  const [customMultiplier, setCustomMultiplier] = useState<number>(8);
  const [displayUnit, setDisplayUnit] = useState<'USD' | 'ETH'>('USD');
  const [isSyncedWithForm, setIsSyncedWithForm] = useState<boolean>(true);

  // Sync automatically when the user edits the main investment form if synced mode is active
  useEffect(() => {
    if (isSyncedWithForm) {
      setCalcCurrency(portalCurrency);
      if (portalAmount !== '') {
        setCalcAmount(portalAmount);
      }
    }
  }, [portalAmount, portalCurrency, isSyncedWithForm]);

  const presaleRate = Math.max(1, parameters.tokenRate);
  const listingRate = Math.max(1, parameters.listingRate);

  const presalePriceEth = 1 / presaleRate;
  const presalePriceUsd = ETH_PRICE_USD / presaleRate;
  const listingPriceUsd = ETH_PRICE_USD / listingRate;
  const listingMultiplier = presaleRate / listingRate;

  const scenarios: ScenarioOption[] = useMemo(
    () => [
      {
        id: 'listing',
        label: 'DEX Listing',
        sublabel: `${listingMultiplier.toFixed(2)}x Launch`,
        multiplier: listingMultiplier
      },
      {
        id: '2x',
        label: 'Conservative',
        sublabel: '2.00x Growth',
        multiplier: 2
      },
      {
        id: '5x',
        label: 'Target Scale',
        sublabel: '5.00x Growth',
        multiplier: 5
      },
      {
        id: '10x',
        label: 'Bull Case',
        sublabel: '10.00x Growth',
        multiplier: 10
      },
      {
        id: '25x',
        label: 'Studioverse Peak',
        sublabel: '25.00x Growth',
        multiplier: 25
      },
      {
        id: 'custom',
        label: 'Custom Target',
        sublabel: `${customMultiplier.toFixed(1)}x Manual`,
        multiplier: customMultiplier
      }
    ],
    [listingMultiplier, customMultiplier]
  );

  const activeMultiplier = useMemo(() => {
    const found = scenarios.find((s) => s.id === selectedScenario);
    return found ? found.multiplier : 5;
  }, [scenarios, selectedScenario]);

  const numericInput = Math.max(0, parseFloat(calcAmount) || 0);
  const investmentEth = calcCurrency === 'ETH' ? numericInput : numericInput / ETH_PRICE_USD;
  const investmentUsd = investmentEth * ETH_PRICE_USD;

  const tokensAllocated = investmentEth * presaleRate;
  const targetTokenPriceUsd = presalePriceUsd * activeMultiplier;
  const targetTokenPriceEth = presalePriceEth * activeMultiplier;

  const projectedValueUsd = tokensAllocated * targetTokenPriceUsd;
  const projectedValueEth = tokensAllocated * targetTokenPriceEth;

  const netProfitUsd = projectedValueUsd - investmentUsd;
  const netProfitEth = projectedValueEth - investmentEth;
  const roiPercent = investmentUsd > 0 ? ((projectedValueUsd - investmentUsd) / investmentUsd) * 100 : 0;

  // Chart comparison data across growth tiers
  const chartData = useMemo(() => {
    const tiers = [
      { name: 'Entry', multiplier: 1, key: 'entry' },
      { name: 'DEX Launch', multiplier: listingMultiplier, key: 'listing' },
      { name: '2x', multiplier: 2, key: '2x' },
      { name: '5x', multiplier: 5, key: '5x' },
      { name: '10x', multiplier: 10, key: '10x' },
      { name: `${customMultiplier.toFixed(1)}x`, multiplier: customMultiplier, key: 'custom' }
    ];

    return tiers.map((tier) => {
      const value =
        displayUnit === 'USD'
          ? investmentUsd * tier.multiplier
          : investmentEth * tier.multiplier;
      const profit =
        displayUnit === 'USD'
          ? investmentUsd * (tier.multiplier - 1)
          : investmentEth * (tier.multiplier - 1);

      return {
        name: tier.name,
        key: tier.key,
        value: Number(value.toFixed(displayUnit === 'USD' ? 2 : 4)),
        profit: Number(profit.toFixed(displayUnit === 'USD' ? 2 : 4)),
        tokenPriceUsd: Number((presalePriceUsd * tier.multiplier).toFixed(4)),
        isActive: tier.key === selectedScenario
      };
    });
  }, [
    investmentUsd,
    investmentEth,
    listingMultiplier,
    customMultiplier,
    displayUnit,
    presalePriceUsd,
    selectedScenario
  ]);

  const handleAmountChange = (val: string) => {
    setIsSyncedWithForm(false);
    setCalcAmount(val);
  };

  const handleCurrencyChange = (curr: PaymentMethod) => {
    setIsSyncedWithForm(false);
    // Convert current numeric value proportionally when switching between ETH and stablecoins
    const current = parseFloat(calcAmount) || 0;
    if (curr === 'ETH' && calcCurrency !== 'ETH') {
      setCalcAmount((current / ETH_PRICE_USD).toFixed(2));
    } else if (curr !== 'ETH' && calcCurrency === 'ETH') {
      setCalcAmount(Math.round(current * ETH_PRICE_USD).toString());
    }
    setCalcCurrency(curr);
  };

  const handlePresetClick = (ethAmount: number) => {
    setIsSyncedWithForm(false);
    if (calcCurrency === 'ETH') {
      setCalcAmount(ethAmount.toString());
    } else {
      setCalcAmount(Math.round(ethAmount * ETH_PRICE_USD).toString());
    }
  };

  const handleSyncFromPortal = () => {
    setIsSyncedWithForm(true);
    setCalcCurrency(portalCurrency);
    setCalcAmount(portalAmount || '1.0');
  };

  const handleCustomPriceInput = (usdPriceStr: string) => {
    const parsedPrice = parseFloat(usdPriceStr);
    if (!isNaN(parsedPrice) && parsedPrice > 0 && presalePriceUsd > 0) {
      const nextMult = Math.min(100, Math.max(0.1, parsedPrice / presalePriceUsd));
      setSelectedScenario('custom');
      setCustomMultiplier(Number(nextMult.toFixed(2)));
    }
  };

  const formatMoney = (usdVal: number, ethVal: number) => {
    if (displayUnit === 'USD') {
      return `$${usdVal.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })}`;
    }
    return `${ethVal.toLocaleString(undefined, {
      minimumFractionDigits: 3,
      maximumFractionDigits: 4
    })} ETH`;
  };

  const sliderMaxEth = Math.max(parameters.maxContribution, 10);

  return (
    <section
      aria-label="Investor ROI Projection Calculator"
      className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-6"
    >
      {/* Header Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
            <Calculator className="w-3.5 h-3.5" />
            <span>RETURN ON INVESTMENT SIMULATOR</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            {parameters.tokenSymbol} Token Growth &amp; ROI Estimator
          </h2>
          <p className="text-xs text-slate-400">
            Model projected portfolio value, net profit, and DEX listing upside based on presale entry at{' '}
            <span className="font-mono text-slate-200 tabular-nums">
              ${presalePriceUsd.toFixed(4)} / {parameters.tokenSymbol}
            </span>{' '}
            ({presaleRate.toLocaleString()} {parameters.tokenSymbol} per ETH).
          </p>
        </div>

        {/* Display Unit & Form Sync Controls */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <div className="flex items-center p-1 bg-slate-950 border border-slate-800 rounded-lg">
            <button
              type="button"
              onClick={() => setDisplayUnit('USD')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                displayUnit === 'USD'
                  ? 'bg-amber-400 text-slate-950'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              USD ($)
            </button>
            <button
              type="button"
              onClick={() => setDisplayUnit('ETH')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                displayUnit === 'ETH'
                  ? 'bg-amber-400 text-slate-950'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              ETH (Ξ)
            </button>
          </div>

          <button
            type="button"
            onClick={handleSyncFromPortal}
            className={`px-3 py-2 text-xs font-semibold rounded-lg border transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              isSyncedWithForm
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
            title="Sync input amount with your Step 1 Investment Terminal"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{isSyncedWithForm ? 'Synced with Form' : 'Sync Form Amount'}</span>
          </button>
        </div>
      </div>

      {/* Main 12-Col Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Controls Panel (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Contribution Input */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <label htmlFor="roi-amount-input" className="font-semibold text-slate-200">
                Simulated Investment Amount
              </label>
              <span className="font-mono text-slate-400 tabular-nums">
                ≈ {tokensAllocated.toLocaleString(undefined, { maximumFractionDigits: 0 })} {parameters.tokenSymbol}
              </span>
            </div>

            {/* Currency Switcher */}
            <div className="grid grid-cols-3 gap-2">
              {parameters.acceptedPayments.map((curr) => (
                <button
                  key={curr}
                  type="button"
                  onClick={() => handleCurrencyChange(curr)}
                  className={`py-2 px-3 rounded-lg text-xs font-bold border transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap ${
                    calcCurrency === curr
                      ? 'bg-amber-400 text-slate-950 border-amber-400'
                      : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <Coins className="w-3.5 h-3.5" />
                  <span>{curr}</span>
                </button>
              ))}
            </div>

            {/* Numeric Input */}
            <div className="relative">
              <input
                id="roi-amount-input"
                type="number"
                min="0"
                step={calcCurrency === 'ETH' ? '0.1' : '100'}
                value={calcAmount}
                onChange={(e) => handleAmountChange(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-3.5 pr-20 py-2.5 text-base font-bold font-mono text-white tabular-nums focus:outline-none focus:border-amber-500"
                placeholder="1.0"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-amber-400">
                {calcCurrency}
              </span>
            </div>

            {/* Range Slider */}
            <div className="space-y-1.5">
              <input
                type="range"
                aria-label="Investment amount slider"
                min={parameters.minContribution}
                max={sliderMaxEth}
                step="0.1"
                value={Math.min(sliderMaxEth, Math.max(parameters.minContribution, investmentEth))}
                onChange={(e) => {
                  const ethVal = parseFloat(e.target.value);
                  setIsSyncedWithForm(false);
                  setCalcAmount(
                    calcCurrency === 'ETH'
                      ? ethVal.toFixed(1)
                      : Math.round(ethVal * ETH_PRICE_USD).toString()
                  );
                }}
                className="w-full accent-amber-400 cursor-pointer"
              />
              <div className="flex items-center justify-between gap-2">
                {[0.5, 1, 2.5, 5].map((presetEth) => (
                  <button
                    key={presetEth}
                    type="button"
                    onClick={() => handlePresetClick(presetEth)}
                    className={`flex-1 py-1.5 text-[11px] font-mono font-semibold rounded-md border transition-colors whitespace-nowrap ${
                      Math.abs(investmentEth - presetEth) < 0.01
                        ? 'bg-slate-800 border-amber-400/60 text-amber-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {calcCurrency === 'ETH'
                      ? `${presetEth} ETH`
                      : `$${(presetEth * ETH_PRICE_USD).toLocaleString()}`}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Growth Scenario Selector */}
          <div className="space-y-3 pt-4 border-t border-slate-800">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-200">Token Price Growth Scenario</span>
              <span className="font-mono text-amber-400 tabular-nums">
                {activeMultiplier.toFixed(2)}x Entry
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {scenarios.map((scenario) => {
                const isSelected = selectedScenario === scenario.id;
                return (
                  <button
                    key={scenario.id}
                    type="button"
                    onClick={() => setSelectedScenario(scenario.id)}
                    className={`p-2.5 rounded-xl border text-left transition-colors ${
                      isSelected
                        ? 'bg-amber-400/10 border-amber-400 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="text-xs font-bold truncate">{scenario.label}</div>
                    <div
                      className={`text-[11px] font-mono tabular-nums mt-0.5 ${
                        isSelected ? 'text-amber-300' : 'text-slate-400'
                      }`}
                    >
                      {scenario.sublabel}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Custom Multiplier & Target Price Sliders */}
            <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-slate-300 font-medium">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
                  <span>Custom Price &amp; Multiplier</span>
                </span>
                <span className="font-mono text-xs text-emerald-400 tabular-nums">
                  ${targetTokenPriceUsd.toFixed(4)} / {parameters.tokenSymbol}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                <div>
                  <label htmlFor="roi-multiplier-slider" className="block text-[11px] text-slate-400 mb-1">
                    Multiplier ({activeMultiplier.toFixed(1)}x)
                  </label>
                  <input
                    id="roi-multiplier-slider"
                    type="range"
                    min="1"
                    max="50"
                    step="0.5"
                    value={selectedScenario === 'custom' ? customMultiplier : activeMultiplier}
                    onChange={(e) => {
                      setSelectedScenario('custom');
                      setCustomMultiplier(parseFloat(e.target.value));
                    }}
                    className="w-full accent-amber-400 cursor-pointer"
                  />
                </div>

                <div>
                  <label htmlFor="roi-target-price" className="block text-[11px] text-slate-400 mb-1">
                    Target Token Price (USD)
                  </label>
                  <div className="relative">
                    <DollarSign className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="roi-target-price"
                      type="number"
                      min="0.0001"
                      step="0.05"
                      value={Number(targetTokenPriceUsd.toFixed(4))}
                      onChange={(e) => handleCustomPriceInput(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-7 pr-2.5 py-1.5 text-xs font-mono font-bold text-white tabular-nums focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Apply CTA */}
          <button
            type="button"
            onClick={() => onApplyToPortal(calcAmount || '0', calcCurrency)}
            disabled={numericInput <= 0}
            className="w-full py-2.5 px-4 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 disabled:opacity-40 rounded-xl transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <span>Apply {calcAmount || '0'} {calcCurrency} to Investment Form</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Right Projections & Comparison Chart (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Primary Projection Readout Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
              <span className="text-xs text-slate-400">Projected Portfolio Value</span>
              <div className="text-xl font-bold font-mono text-white tabular-nums">
                {formatMoney(projectedValueUsd, projectedValueEth)}
              </div>
              <div className="text-[11px] font-mono text-slate-400 tabular-nums">
                Initial: {formatMoney(investmentUsd, investmentEth)}
              </div>
            </div>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
              <span className="text-xs text-slate-400">Estimated Net Profit</span>
              <div
                className={`text-xl font-bold font-mono tabular-nums ${
                  netProfitUsd >= 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {netProfitUsd >= 0 ? '+' : ''}
                {formatMoney(netProfitUsd, netProfitEth)}
              </div>
              <div className="text-[11px] font-mono text-slate-400 tabular-nums">
                Tokens: {tokensAllocated.toLocaleString(undefined, { maximumFractionDigits: 0 })} {parameters.tokenSymbol}
              </div>
            </div>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
              <span className="text-xs text-slate-400">Estimated ROI</span>
              <div className="flex items-baseline gap-2">
                <span
                  className={`text-xl font-bold font-mono tabular-nums ${
                    roiPercent >= 0 ? 'text-amber-300' : 'text-rose-400'
                  }`}
                >
                  {roiPercent >= 0 ? '+' : ''}
                  {roiPercent.toLocaleString(undefined, { maximumFractionDigits: 1 })}%
                </span>
                <span className="text-xs font-mono text-emerald-400 tabular-nums">
                  ({activeMultiplier.toFixed(2)}x)
                </span>
              </div>
              <div className="text-[11px] font-mono text-slate-400 tabular-nums">
                DEX Launch: +{((listingMultiplier - 1) * 100).toFixed(1)}% ({listingMultiplier.toFixed(2)}x)
              </div>
            </div>
          </div>

          {/* Scenario Comparison Bar Chart */}
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                <TrendingUp className="w-4 h-4 text-amber-400" />
                <span>Scenario Value Trajectory ({displayUnit})</span>
              </div>
              <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400 tabular-nums">
                <span>Presale: ${presalePriceUsd.toFixed(4)}</span>
                <span aria-hidden="true">·</span>
                <span>Listing: ${listingPriceUsd.toFixed(4)}</span>
                <span aria-hidden="true">·</span>
                <span className="text-amber-300">Selected: ${targetTokenPriceUsd.toFixed(4)}</span>
              </div>
            </div>

            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 12, left: 0, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis
                    dataKey="name"
                    stroke="#94a3b8"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: '#1e293b' }}
                  />
                  <YAxis
                    stroke="#94a3b8"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(val: number) =>
                      displayUnit === 'USD'
                        ? val >= 1000
                          ? `$${(val / 1000).toFixed(1)}k`
                          : `$${val}`
                        : `${val}Ξ`
                    }
                  />
                  <Tooltip
                    cursor={{ fill: 'rgba(148, 163, 184, 0.08)' }}
                    contentStyle={{
                      backgroundColor: '#020617',
                      borderColor: '#1e293b',
                      borderRadius: '0.75rem',
                      fontSize: '12px',
                      color: '#f1f5f9'
                    }}
                    formatter={(value: unknown) => {
                      const num = Number(value) || 0;
                      const formatted =
                        displayUnit === 'USD'
                          ? `$${num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                          : `${num.toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 4 })} ETH`;
                      return [formatted, 'Projected Value'];
                    }}
                  />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={48}>
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          entry.isActive
                            ? '#f59e0b'
                            : entry.key === 'entry'
                            ? '#334155'
                            : '#10b981'
                        }
                        fillOpacity={entry.isActive ? 1 : 0.78}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Compact Token Price Breakdown Table */}
          <div className="overflow-x-auto border border-slate-800 rounded-xl bg-slate-950">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="py-2.5 px-3.5 font-medium">Scenario</th>
                  <th className="py-2.5 px-3.5 font-medium text-right">Token Price</th>
                  <th className="py-2.5 px-3.5 font-medium text-right">Multiple</th>
                  <th className="py-2.5 px-3.5 font-medium text-right">Net Gain</th>
                  <th className="py-2.5 px-3.5 font-medium text-right">Total Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900 font-mono tabular-nums">
                {scenarios.map((scenario) => {
                  const sPriceUsd = presalePriceUsd * scenario.multiplier;
                  const sValUsd = investmentUsd * scenario.multiplier;
                  const sValEth = investmentEth * scenario.multiplier;
                  const sGainUsd = sValUsd - investmentUsd;
                  const sGainEth = sValEth - investmentEth;
                  const isActive = selectedScenario === scenario.id;

                  return (
                    <tr
                      key={scenario.id}
                      onClick={() => setSelectedScenario(scenario.id)}
                      className={`cursor-pointer transition-colors ${
                        isActive
                          ? 'bg-amber-400/10 text-white'
                          : 'text-slate-300 hover:bg-slate-900/70'
                      }`}
                    >
                      <td className="py-2.5 px-3.5 font-sans font-semibold">
                        <span className={isActive ? 'text-amber-300' : 'text-slate-200'}>
                          {scenario.label}
                        </span>
                      </td>
                      <td className="py-2.5 px-3.5 text-right text-slate-300">
                        ${sPriceUsd.toFixed(4)}
                      </td>
                      <td className="py-2.5 px-3.5 text-right text-amber-400">
                        {scenario.multiplier.toFixed(2)}x
                      </td>
                      <td className="py-2.5 px-3.5 text-right text-emerald-400">
                        +{formatMoney(sGainUsd, sGainEth)}
                      </td>
                      <td className="py-2.5 px-3.5 text-right font-bold text-white">
                        {formatMoney(sValUsd, sValEth)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <p className="text-[11px] text-slate-500">
            Estimates assume 1 ETH = $3,000 USD and presale rate of {presaleRate.toLocaleString()} {parameters.tokenSymbol}/ETH. Projections are illustrative models and do not guarantee future token market performance.
          </p>
        </div>
      </div>
    </section>
  );
};

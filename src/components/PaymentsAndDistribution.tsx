import React, { useState } from 'react';
import { 
  Coins, 
  Wallet, 
  Send, 
  CheckCircle2, 
  ArrowUpRight, 
  Clock, 
  Users, 
  AlertTriangle, 
  Layers, 
  Download,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';
import { PresaleParameters, PaymentMethod, BuyerInvestment } from '../types';

interface PaymentsAndDistributionProps {
  parameters: PresaleParameters;
  investments: BuyerInvestment[];
  onAddInvestment: (inv: BuyerInvestment) => void;
  onBatchDistribute: () => void;
  onSingleDistribute: (id: string) => void;
  onTriggerEmergencyRefund: () => void;
  network: string;
}

export const PaymentsAndDistribution: React.FC<PaymentsAndDistributionProps> = ({
  parameters,
  investments,
  onAddInvestment,
  onBatchDistribute,
  onSingleDistribute,
  onTriggerEmergencyRefund,
  network
}) => {
  const [selectedCurrency, setSelectedCurrency] = useState<PaymentMethod>(
    parameters.acceptedPayments[0] || 'ETH'
  );
  const [investmentAmount, setInvestmentAmount] = useState<string>('1.5');
  const [buyerWallet, setBuyerWallet] = useState<string>('0x4F92...B39c');
  const [processing, setProcessing] = useState(false);
  const [lastTxSuccess, setLastTxSuccess] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<'All' | 'Distributed' | 'Pending Claim'>('All');

  // Compute live fundraise metrics
  const totalEthRaised = investments.reduce((acc, curr) => {
    if (curr.distributionStatus === 'Refunded') return acc;
    if (curr.paymentMethod === 'ETH') return acc + curr.amountPaid;
    // Assume 1 ETH ≈ 3000 USD for USDT/USDC simulation
    return acc + (curr.amountPaid / 3000);
  }, 0);

  const softCapProgress = Math.min(100, (totalEthRaised / parameters.softCap) * 100);
  const hardCapProgress = Math.min(100, (totalEthRaised / parameters.hardCap) * 100);
  const isSoftCapMet = totalEthRaised >= parameters.softCap;
  const isHardCapReached = totalEthRaised >= parameters.hardCap;

  const numAmount = parseFloat(investmentAmount) || 0;
  // Calculate tokens buyer will receive
  const calculatedTokens = selectedCurrency === 'ETH' 
    ? numAmount * parameters.tokenRate 
    : (numAmount / 3000) * parameters.tokenRate;

  const handleMakeInvestment = (e: React.FormEvent) => {
    e.preventDefault();
    if (numAmount <= 0) return;

    setProcessing(true);
    setLastTxSuccess(null);

    setTimeout(() => {
      const generatedTx = `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
      const newInv: BuyerInvestment = {
        id: `inv-${Date.now()}`,
        buyerAddress: buyerWallet,
        paymentMethod: selectedCurrency,
        amountPaid: numAmount,
        tokensAllocated: Math.floor(calculatedTokens),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        txHash: generatedTx,
        distributionStatus: parameters.distributionMode === 'Immediate' ? 'Distributed' : 'Pending Claim'
      };

      onAddInvestment(newInv);
      setProcessing(false);
      setLastTxSuccess(generatedTx);
      setInvestmentAmount('');
    }, 1000);
  };

  const filteredInvestments = investments.filter(inv => {
    if (filterStatus === 'All') return true;
    return inv.distributionStatus === filterStatus;
  });

  const pendingDistributionCount = investments.filter(i => i.distributionStatus === 'Pending Claim').length;

  return (
    <div className="space-y-6">
      
      {/* Module Banner */}
      <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-amber-400 font-mono">
            <span>BITBOND TOKEN TOOLS EXECUTION</span>
            <span className="text-slate-600">·</span>
            <span>STRAIGHTFORWARD PAYMENT & BUYER DISTRIBUTION</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
            Payment Processing & Investor Distribution Engine
          </h1>
          <p className="text-sm text-slate-400 max-w-3xl mt-1 leading-relaxed">
            Accept investments across designated payment currencies (ETH, USDT, USDC), route incoming funds directly to the selected receiver wallet, and manage straightforward token distribution to buyer accounts.
          </p>
        </div>

        {/* Receiver Treasury Summary */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs shrink-0 max-w-sm">
          <div className="flex items-center gap-1.5 text-slate-400 mb-1">
            <Wallet className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-semibold text-slate-200">Designated Receiver Wallet</span>
          </div>
          <div className="font-mono text-amber-300 truncate bg-slate-900 p-1.5 rounded border border-slate-800">
            {parameters.receivingWallet}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Configured during presale creation
          </span>
        </div>
      </div>

      {/* Progress & Crowdsale Metrics Strip */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
          <span className="text-xs text-slate-400 font-medium">Total Raised</span>
          <div className="text-xl font-bold text-white font-mono mt-1">
            {totalEthRaised.toFixed(2)} ETH
          </div>
          <span className="text-[11px] text-slate-500 font-mono">
            ≈ ${(totalEthRaised * 3000).toLocaleString()} USD
          </span>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Soft Cap Threshold</span>
            <span className={`text-[11px] font-mono ${isSoftCapMet ? 'text-emerald-400' : 'text-amber-400'}`}>
              {isSoftCapMet ? 'Reached' : `${softCapProgress.toFixed(0)}%`}
            </span>
          </div>
          <div className="text-xl font-bold text-amber-300 font-mono mt-1">
            {parameters.softCap} ETH
          </div>
          <span className="text-[11px] text-slate-500">
            {isSoftCapMet ? 'Min fundraise verified' : 'Refund active if unreached'}
          </span>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Hard Cap Ceiling</span>
            <span className="text-[11px] font-mono text-slate-400">{hardCapProgress.toFixed(0)}%</span>
          </div>
          <div className="text-xl font-bold text-emerald-400 font-mono mt-1">
            {parameters.hardCap} ETH
          </div>
          <span className="text-[11px] text-slate-500">
            {(parameters.hardCap - totalEthRaised).toFixed(2)} ETH remaining
          </span>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
          <span className="text-xs text-slate-400 font-medium">Distribution Mode</span>
          <div className="text-base font-bold text-white mt-1">
            {parameters.distributionMode === 'Immediate' ? 'Instant Direct Send' : 'Post-Sale Claim'}
          </div>
          <span className="text-[11px] text-slate-500 font-mono">
            {pendingDistributionCount} pending claims
          </span>
        </div>
      </div>

      {/* Main Grid: Left = Investment Terminal (Make Payment), Right = Distribution & Ledger */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Investor Payment Terminal (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-5">
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span className="text-amber-400">01.</span>
              <span>Investor Payment Portal</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Buyers purchase {parameters.tokenSymbol} using accepted tokens. Funds route straight to the designated treasury receiver.
            </p>
          </div>

          <form onSubmit={handleMakeInvestment} className="space-y-4">
            
            {/* Currency Selector (only shows accepted currencies selected during creation!) */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                Select Investment Payment Method
              </label>
              <div className="flex gap-2">
                {parameters.acceptedPayments.map(curr => (
                  <button
                    key={curr}
                    type="button"
                    onClick={() => setSelectedCurrency(curr)}
                    className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold border transition-colors flex items-center justify-center gap-1.5 ${
                      selectedCurrency === curr
                        ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-sm'
                        : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <Coins className="w-3.5 h-3.5" />
                    <span>{curr}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Simulated Buyer Wallet */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                Buyer Wallet Address
              </label>
              <input
                type="text"
                value={buyerWallet}
                onChange={(e) => setBuyerWallet(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Investment Amount */}
            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                <span>Investment Amount ({selectedCurrency})</span>
                <span className="font-mono">
                  Min: {parameters.minContribution} · Max: {parameters.maxContribution}
                </span>
              </div>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  min="0.01"
                  required
                  value={investmentAmount}
                  onChange={(e) => setInvestmentAmount(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-3 pr-16 py-2.5 text-base font-bold font-mono text-white focus:outline-none focus:border-amber-500"
                  placeholder="0.0"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-amber-400">
                  {selectedCurrency}
                </span>
              </div>
            </div>

            {/* Token Calculation Result */}
            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-1.5">
              <div className="flex justify-between text-slate-400">
                <span>Token Rate</span>
                <span className="font-mono text-slate-300">
                  1 ETH = {parameters.tokenRate.toLocaleString()} {parameters.tokenSymbol}
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Buyer Allocation</span>
                <span className="font-mono font-bold text-emerald-400 text-sm">
                  {calculatedTokens.toLocaleString(undefined, { maximumFractionDigits: 0 })} {parameters.tokenSymbol}
                </span>
              </div>
              <div className="flex justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-900">
                <span>Destination Receiver</span>
                <span className="font-mono truncate max-w-[170px]">{parameters.receivingWallet}</span>
              </div>
            </div>

            {/* Submit Payment Button */}
            <button
              type="submit"
              disabled={processing || numAmount <= 0}
              className="w-full py-3 px-4 text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{processing ? 'Processing On-Chain Payment...' : `Confirm Payment of ${numAmount || 0} ${selectedCurrency}`}</span>
            </button>

          </form>

          {lastTxSuccess && (
            <div className="p-3 bg-emerald-950/40 border border-emerald-800/80 rounded-xl text-xs text-emerald-300 space-y-1 animate-in fade-in">
              <div className="flex items-center gap-1.5 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Investment Successfully Completed!</span>
              </div>
              <div className="font-mono text-[11px] text-emerald-400/80 break-all">
                TX: {lastTxSuccess}
              </div>
            </div>
          )}

          {/* Guarantee Note */}
          <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800/80 text-[11px] text-slate-400 space-y-1">
            <span className="font-semibold text-slate-300 block">Straightforward Flow:</span>
            <span>1. Investor submits ETH/USDT/USDC.</span><br />
            <span>2. Smart contract forwards funds immediately to designated receiver wallet.</span><br />
            <span>3. Token allocation recorded and distributed seamlessly.</span>
          </div>
        </div>

        {/* Right Column: Investor Ledger & Distribution Management (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-5">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <span className="text-amber-400">02.</span>
                <span>Buyer Allocation Ledger & Distribution</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Track buyer investments and dispatch tokens straight to investor addresses.
              </p>
            </div>

            {/* Batch Distribution Action */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                disabled={pendingDistributionCount === 0}
                onClick={onBatchDistribute}
                className="px-3 py-1.5 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg disabled:opacity-40 transition-colors flex items-center gap-1.5 whitespace-nowrap"
                title="Send tokens to all pending buyers at once"
              >
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>Batch Distribute ({pendingDistributionCount})</span>
              </button>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div className="flex gap-1.5">
              {(['All', 'Distributed', 'Pending Claim'] as const).map(status => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-2.5 py-1 text-xs rounded-md transition-colors ${
                    filterStatus === status
                      ? 'bg-slate-800 text-white font-medium'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>

            <div className="text-xs text-slate-500 font-mono">
              {filteredInvestments.length} records
            </div>
          </div>

          {/* Table of Buyer Investments */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-mono">
                  <th className="pb-2.5 font-medium">Buyer Address</th>
                  <th className="pb-2.5 font-medium">Payment Paid</th>
                  <th className="pb-2.5 font-medium">Tokens Allocated</th>
                  <th className="pb-2.5 font-medium">Status</th>
                  <th className="pb-2.5 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {filteredInvestments.map(inv => (
                  <tr key={inv.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-3 text-slate-300">
                      <div>{inv.buyerAddress}</div>
                      <span className="text-[10px] text-slate-500 font-mono truncate max-w-[120px] block">
                        TX: {inv.txHash.slice(0, 10)}...
                      </span>
                    </td>
                    <td className="py-3 text-slate-200 font-bold">
                      {inv.amountPaid} {inv.paymentMethod}
                    </td>
                    <td className="py-3 text-amber-300 font-bold">
                      {inv.tokensAllocated.toLocaleString()} {parameters.tokenSymbol}
                    </td>
                    <td className="py-3">
                      {inv.distributionStatus === 'Distributed' ? (
                        <span className="text-emerald-400 flex items-center gap-1 text-[11px]">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Distributed</span>
                        </span>
                      ) : inv.distributionStatus === 'Refunded' ? (
                        <span className="text-slate-500 text-[11px]">Refunded</span>
                      ) : (
                        <span className="text-amber-400 text-[11px]">Pending Claim</span>
                      )}
                    </td>
                    <td className="py-3 text-right">
                      {inv.distributionStatus === 'Pending Claim' ? (
                        <button
                          onClick={() => onSingleDistribute(inv.id)}
                          className="px-2 py-1 text-[11px] font-semibold text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded transition-colors"
                        >
                          Send Tokens
                        </button>
                      ) : (
                        <span className="text-slate-600 text-[11px]">Settled</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredInvestments.length === 0 && (
              <div className="py-8 text-center text-xs text-slate-500">
                No investment transactions found for this filter.
              </div>
            )}
          </div>

          {/* Emergency Refund Simulation */}
          <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800/60">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                <span>Soft Cap Protection Mechanism</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                If the Soft Cap ({parameters.softCap} ETH) is unfulfilled at sale conclusion, buyers have an immutable right to 100% refunds.
              </p>
            </div>

            <button
              onClick={onTriggerEmergencyRefund}
              className="px-3 py-1.5 text-xs text-rose-300 bg-rose-950/40 hover:bg-rose-950/80 border border-rose-800 rounded-lg transition-colors whitespace-nowrap"
            >
              Simulate Soft Cap Refund
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};

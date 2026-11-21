import React, { useState } from 'react';
import { 
  Wallet, 
  Send, 
  CheckCircle2, 
  Sparkles, 
  Share2, 
  Code, 
  GitBranch, 
  Coins, 
  Clock, 
  Compass, 
  Download, 
  ExternalLink,
  Layers,
  ArrowRight,
  ShieldCheck,
  Check
} from 'lucide-react';
import { PresaleParameters, PaymentMethod, InvestorSession } from '../types';
import { ROICalculatorWidget } from './ROICalculatorWidget';

interface InvestorPresalePortalProps {
  parameters: PresaleParameters;
  onOpenARCockpit: () => void;
  onOpenEmbedModal: () => void;
  onOpenShareModal: () => void;
  onOpenGitHubModal: () => void;
  onOpenManageSale: () => void;
  totalEthRaised: number;
  onNewInvestment: (amountEth: number, tokens: number, method: PaymentMethod) => void;
}

export const InvestorPresalePortal: React.FC<InvestorPresalePortalProps> = ({
  parameters,
  onOpenARCockpit,
  onOpenEmbedModal,
  onOpenShareModal,
  onOpenGitHubModal,
  onOpenManageSale,
  totalEthRaised,
  onNewInvestment
}) => {
  // Investor session state
  const [session, setSession] = useState<InvestorSession>({
    isWalletConnected: true,
    walletAddress: '0x3F28...98B1',
    walletBalanceEth: 8.45,
    investedAmountEth: 2.5,
    tokensPurchased: 25000,
    tokensRedeemed: 0
  });

  const [investmentCurrency, setInvestmentCurrency] = useState<PaymentMethod>('ETH');
  const [inputAmount, setInputAmount] = useState<string>('1.0');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [redeemSuccess, setRedeemSuccess] = useState(false);
  const [txSuccessMessage, setTxSuccessMessage] = useState<string | null>(null);

  const numAmount = parseFloat(inputAmount) || 0;
  const calculatedTokens = investmentCurrency === 'ETH'
    ? numAmount * parameters.tokenRate
    : (numAmount / 3000) * parameters.tokenRate;

  const softCapMet = totalEthRaised >= parameters.softCap;
  const hardCapProgress = Math.min(100, (totalEthRaised / parameters.hardCap) * 100);

  const handleConnectToggle = () => {
    setSession(prev => ({
      ...prev,
      isWalletConnected: !prev.isWalletConnected
    }));
  };

  const handleConfirmInvestment = (e: React.FormEvent) => {
    e.preventDefault();
    if (numAmount <= 0) return;

    setIsSubmitting(true);
    setTxSuccessMessage(null);

    setTimeout(() => {
      const tokens = Math.floor(calculatedTokens);
      const ethEquivalent = investmentCurrency === 'ETH' ? numAmount : (numAmount / 3000);

      setSession(prev => ({
        ...prev,
        walletBalanceEth: Math.max(0, prev.walletBalanceEth - ethEquivalent),
        investedAmountEth: prev.investedAmountEth + ethEquivalent,
        tokensPurchased: prev.tokensPurchased + tokens
      }));

      onNewInvestment(ethEquivalent, tokens, investmentCurrency);
      setIsSubmitting(false);
      setTxSuccessMessage(`Successfully invested ${numAmount} ${investmentCurrency}! You have been allocated ${tokens.toLocaleString()} ${parameters.tokenSymbol}. Return to this page to redeem your tokens.`);
      setInputAmount('');
    }, 1100);
  };

  const handleRedeemTokens = () => {
    const unredeemed = session.tokensPurchased - session.tokensRedeemed;
    if (unredeemed <= 0) return;

    setIsRedeeming(true);
    setRedeemSuccess(false);

    setTimeout(() => {
      setSession(prev => ({
        ...prev,
        tokensRedeemed: prev.tokensPurchased
      }));
      setIsRedeeming(false);
      setRedeemSuccess(true);
    }, 1200);
  };

  const unredeemedTokens = session.tokensPurchased - session.tokensRedeemed;

  const handleApplyFromROICalculator = (amount: string, currency: PaymentMethod) => {
    setInvestmentCurrency(currency);
    setInputAmount(amount);
    const formEl = document.getElementById('investor-presale-form');
    if (formEl) {
      formEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Action Bar with AR Cockpit Button & Embed Tools */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
        
        {/* AR Cockpit Button */}
        <button
          onClick={onOpenARCockpit}
          className="px-4 py-2.5 text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-xl shadow-lg shadow-amber-400/20 transition-all flex items-center gap-2 shrink-0 self-start md:self-auto active:scale-[0.98]"
        >
          <Sparkles className="w-4 h-4 text-slate-950" />
          <span>Carlyluminatti AR Marketplace AI Cockpit</span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-950" />
        </button>

        {/* Integration Buttons: Embed in HTML frame, Share with Investors, Update GitHub, Manage Sale */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onOpenEmbedModal}
            className="px-3 py-2 text-xs font-semibold text-slate-200 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors flex items-center gap-1.5"
            title="Get embed code for your enterprise website"
          >
            <Code className="w-3.5 h-3.5 text-cyan-400" />
            <span>Embed HTML Frame</span>
          </button>

          <button
            onClick={onOpenShareModal}
            className="px-3 py-2 text-xs font-semibold text-slate-200 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors flex items-center gap-1.5"
            title="Share directly with investors"
          >
            <Share2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Share Directly</span>
          </button>

          <button
            onClick={onOpenGitHubModal}
            className="px-3 py-2 text-xs font-semibold text-slate-200 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors flex items-center gap-1.5"
            title="Update GitHub repository"
          >
            <GitBranch className="w-3.5 h-3.5 text-purple-400" />
            <span>Update GitHub</span>
          </button>

          <button
            onClick={onOpenManageSale}
            className="px-3 py-2 text-xs font-semibold text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-lg transition-colors flex items-center gap-1.5"
            title="Deposit tokens or withdraw raised funds"
          >
            <Coins className="w-3.5 h-3.5" />
            <span>Manage Token Sale</span>
          </button>
        </div>

      </div>

      {/* Main Investor Viewport (2 columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Investment Terminal (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-6">
          
          {/* Presale Status & Caps Banner */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-mono text-amber-400">CARLYLUMINATTI TOKEN SALE</span>
                <h1 className="text-2xl font-bold text-white tracking-tight">
                  {parameters.tokenName} ({parameters.tokenSymbol})
                </h1>
              </div>

              {/* Wallet Connect Badge */}
              <button
                onClick={handleConnectToggle}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium border flex items-center gap-1.5 transition-colors ${
                  session.isWalletConnected
                    ? 'bg-slate-950 border-emerald-500/40 text-emerald-300'
                    : 'bg-amber-400 text-slate-950 border-amber-400 font-bold'
                }`}
              >
                <Wallet className="w-3.5 h-3.5" />
                <span>{session.isWalletConnected ? `${session.walletAddress}` : 'Connect Wallet'}</span>
              </button>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Participate in the decentralized Ethereum crowdsale for {parameters.tokenName}. Enter your investment amount, confirm on-chain, and return to this same page to redeem your tokens.
            </p>

            {/* Soft Cap & Hard Cap Visual Gauge */}
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-slate-400">Total Raised: <strong className="text-white">{totalEthRaised.toFixed(2)} ETH</strong></span>
                <span className="text-slate-400">Goal: <strong className="text-emerald-400">{parameters.hardCap} ETH</strong></span>
              </div>

              {/* Multi-tier Cap Progress Bar */}
              <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden flex relative">
                <div 
                  className="bg-amber-400 h-full transition-all duration-500" 
                  style={{ width: `${Math.min(100, (totalEthRaised / parameters.hardCap) * 100)}%` }}
                />
                {/* Soft Cap marker line */}
                <div 
                  className="absolute top-0 bottom-0 w-0.5 bg-rose-400 z-10" 
                  style={{ left: `${(parameters.softCap / parameters.hardCap) * 100}%` }}
                  title={`Soft Cap: ${parameters.softCap} ETH`}
                />
              </div>

              <div className="flex justify-between text-[11px] font-mono text-slate-400">
                <span className="text-amber-400">
                  ▲ Soft Cap: {parameters.softCap} ETH {softCapMet ? '(Reached)' : '(Minimum)'}
                </span>
                <span className="text-emerald-400">
                  ▲ Hard Cap: {parameters.hardCap} ETH (Maximum Ceiling)
                </span>
              </div>
            </div>
          </div>

          {/* Investment Submission Form */}
          <form id="investor-presale-form" onSubmit={handleConfirmInvestment} className="space-y-4 pt-2 border-t border-slate-800">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Step 1: Enter Investment Amount
            </h3>

            {/* Accepted Currency Picker */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                Select Payment Token
              </label>
              <div className="flex gap-2">
                {parameters.acceptedPayments.map(curr => (
                  <button
                    key={curr}
                    type="button"
                    onClick={() => setInvestmentCurrency(curr)}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-colors flex items-center justify-center gap-1.5 ${
                      investmentCurrency === curr
                        ? 'bg-amber-400 text-slate-950 border-amber-400'
                        : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <Coins className="w-3.5 h-3.5" />
                    <span>{curr}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Amount Input */}
            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                <span>Amount to Invest</span>
                <span className="font-mono">
                  Wallet Balance: {session.walletBalanceEth.toFixed(2)} ETH
                </span>
              </div>
              <div className="relative">
                <input
                  type="number"
                  step={investmentCurrency === 'ETH' ? '0.1' : '1'}
                  min={investmentCurrency === 'ETH' ? parameters.minContribution : parameters.minContribution * 3000}
                  max={investmentCurrency === 'ETH' ? parameters.maxContribution : parameters.maxContribution * 3000}
                  required
                  value={inputAmount}
                  onChange={(e) => setInputAmount(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-3 pr-20 py-2.5 text-base font-bold font-mono text-white focus:outline-none focus:border-amber-500"
                  placeholder="0.0"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-amber-400">
                  {investmentCurrency}
                </span>
              </div>
            </div>

            {/* Allocation Conversion Callout */}
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs flex items-center justify-between">
              <span className="text-slate-400">Tokens You Will Receive:</span>
              <span className="font-mono font-bold text-amber-300 text-sm">
                {calculatedTokens.toLocaleString(undefined, { maximumFractionDigits: 0 })} {parameters.tokenSymbol}
              </span>
            </div>

            {/* Confirm Transaction Button */}
            <button
              type="submit"
              disabled={isSubmitting || numAmount <= 0}
              className="w-full py-3 px-4 text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-xl transition-all shadow-md shadow-amber-400/20 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>
                {isSubmitting ? 'Confirming On-Chain Transaction...' : `Confirm Transaction & Invest ${numAmount || 0} ${investmentCurrency}`}
              </span>
            </button>
          </form>

          {txSuccessMessage && (
            <div className="p-3 bg-emerald-950/40 border border-emerald-800 rounded-xl text-xs text-emerald-300 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{txSuccessMessage}</span>
            </div>
          )}

        </div>

        {/* Right Column: Return to Same Page to Redeem Tokens (5 cols) */}
        <div className="lg:col-span-5 bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-6 space-y-5 flex flex-col justify-between">
          
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>INVESTOR REDEMPTION PORTAL</span>
              </div>
              <h2 className="text-lg font-bold text-white tracking-tight mt-1">
                Return to Same Page to Redeem Tokens
              </h2>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                As an investor, you can return to this same URL at any time with your connected wallet to claim and redeem your purchased tokens directly into your Ethereum wallet.
              </p>
            </div>

            {/* Investor Allocation Ledger Card */}
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3 font-mono text-xs">
              <div className="flex justify-between text-slate-400 pb-2 border-b border-slate-900">
                <span>Connected Wallet:</span>
                <span className="text-white font-bold">{session.walletAddress}</span>
              </div>
              <div className="flex justify-between text-slate-400 pb-2 border-b border-slate-900">
                <span>Total Invested:</span>
                <span className="text-amber-300 font-bold">{session.investedAmountEth.toFixed(2)} ETH</span>
              </div>
              <div className="flex justify-between text-slate-400 pb-2 border-b border-slate-900">
                <span>Total Tokens Purchased:</span>
                <span className="text-white">{session.tokensPurchased.toLocaleString()} {parameters.tokenSymbol}</span>
              </div>
              <div className="flex justify-between text-slate-400 pb-2 border-b border-slate-900">
                <span>Already Redeemed:</span>
                <span className="text-slate-500">{session.tokensRedeemed.toLocaleString()} {parameters.tokenSymbol}</span>
              </div>
              <div className="flex justify-between text-slate-200 pt-1">
                <span className="font-bold">Available to Redeem Now:</span>
                <span className="text-emerald-400 font-bold text-sm">
                  {unredeemedTokens.toLocaleString()} {parameters.tokenSymbol}
                </span>
              </div>
            </div>

            {/* Redeem Tokens Action */}
            <div className="space-y-2">
              <button
                onClick={handleRedeemTokens}
                disabled={isRedeeming || unredeemedTokens <= 0}
                className="w-full py-3 px-4 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 disabled:opacity-40 rounded-xl transition-all shadow-md shadow-emerald-400/20 flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>
                  {isRedeeming 
                    ? 'Executing Token Claim...' 
                    : unredeemedTokens > 0 
                    ? `Redeem & Claim ${unredeemedTokens.toLocaleString()} ${parameters.tokenSymbol}` 
                    : 'All Tokens Successfully Redeemed'}
                </span>
              </button>

              <span className="text-[11px] text-slate-500 block text-center">
                Calls `claimTokens()` smart contract function directly.
              </span>
            </div>

            {redeemSuccess && (
              <div className="p-3 bg-emerald-950/40 border border-emerald-800 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Tokens successfully transferred to your wallet address ({session.walletAddress})!</span>
              </div>
            )}
          </div>

          {/* AR Cockpit Teaser */}
          <div className="pt-4 border-t border-slate-800/80 bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-mono text-amber-400 block">STUDIOVERSE SHOWROOM</span>
                <span className="text-xs font-bold text-white">Carlyluminatti AR Marketplace</span>
              </div>
              <button
                onClick={onOpenARCockpit}
                className="text-xs font-semibold text-amber-400 hover:underline flex items-center gap-1"
              >
                <span>Launch Cockpit</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* Interactive ROI Projection & Growth Scenario Calculator */}
      <ROICalculatorWidget
        parameters={parameters}
        portalAmount={inputAmount}
        portalCurrency={investmentCurrency}
        onApplyToPortal={handleApplyFromROICalculator}
      />

    </div>
  );
};

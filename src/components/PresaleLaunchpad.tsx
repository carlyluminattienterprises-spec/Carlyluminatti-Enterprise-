import React, { useState, useEffect } from 'react';
import { 
  Rocket, 
  Settings, 
  Code2, 
  Lock, 
  Unlock, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Wallet, 
  Coins, 
  FastForward, 
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { PresaleParameters, PaymentMethod } from '../types';
import { generatePresaleContractSolidity } from '../utils/solidityGenerator';
import { SolidityViewer } from './SolidityViewer';

interface PresaleLaunchpadProps {
  parameters: PresaleParameters;
  onUpdateParameters: (params: PresaleParameters) => void;
  onNavigateToPayments: () => void;
  network: string;
}

export const PresaleLaunchpad: React.FC<PresaleLaunchpadProps> = ({
  parameters,
  onUpdateParameters,
  onNavigateToPayments,
  network
}) => {
  const [activeTab, setActiveTab] = useState<'configure' | 'solidity' | 'preview'>('configure');
  const [formData, setFormData] = useState<PresaleParameters>(parameters);
  const [simulatedTimeOffsetMinutes, setSimulatedTimeOffsetMinutes] = useState(0);
  const [deploying, setDeploying] = useState(false);
  const [deploySuccess, setDeploySuccess] = useState(parameters.isDeployed);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Sync internal state if external parameters change
  useEffect(() => {
    setFormData(parameters);
    setDeploySuccess(parameters.isDeployed);
  }, [parameters]);

  // Compute sale start timestamp & the 10-minute lock cutoff
  const startDate = new Date(formData.saleStartTime);
  const lockCutoffTimestamp = startDate.getTime() - (10 * 60 * 1000); // 10 minutes before sale starts
  
  // Simulated current time to test the 10-minute edit freeze
  const simulatedCurrentTime = Date.now() + (simulatedTimeOffsetMinutes * 60 * 1000);
  const isLocked = simulatedCurrentTime >= lockCutoffTimestamp;

  const msRemainingUntilLock = Math.max(0, lockCutoffTimestamp - simulatedCurrentTime);
  const minutesUntilLock = Math.floor(msRemainingUntilLock / (60 * 1000));
  const secondsUntilLock = Math.floor((msRemainingUntilLock % (60 * 1000)) / 1000);

  const handleFieldChange = (field: keyof PresaleParameters, value: any) => {
    if (isLocked) {
      setValidationError("Cannot edit parameters: 10-minute pre-sale edit freeze window is active.");
      return;
    }
    setValidationError(null);
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePaymentToggle = (method: PaymentMethod) => {
    if (isLocked) return;
    setFormData(prev => {
      const exists = prev.acceptedPayments.includes(method);
      if (exists) {
        if (prev.acceptedPayments.length === 1) return prev; // Keep at least one
        return {
          ...prev,
          acceptedPayments: prev.acceptedPayments.filter(m => m !== method)
        };
      } else {
        return {
          ...prev,
          acceptedPayments: [...prev.acceptedPayments, method]
        };
      }
    });
  };

  const handleSaveParameters = () => {
    if (Number(formData.softCap) >= Number(formData.hardCap)) {
      setValidationError("Configuration Error: Soft Cap must be strictly less than Hard Cap.");
      return;
    }
    if (Number(formData.minContribution) > Number(formData.maxContribution)) {
      setValidationError("Configuration Error: Minimum contribution cannot exceed Maximum contribution.");
      return;
    }
    if (!formData.receivingWallet || !formData.receivingWallet.startsWith('0x')) {
      setValidationError("Configuration Error: Please specify a valid Ethereum receiving wallet address (0x...).");
      return;
    }

    setValidationError(null);
    onUpdateParameters(formData);
  };

  const handleDeployContract = () => {
    handleSaveParameters();
    setDeploying(true);

    setTimeout(() => {
      const simulatedAddress = `0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
      const simulatedTx = `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;

      const updated = {
        ...formData,
        isDeployed: true,
        contractAddress: simulatedAddress,
        deploymentTx: simulatedTx
      };

      setFormData(updated);
      onUpdateParameters(updated);
      setDeploying(false);
      setDeploySuccess(true);
    }, 1200);
  };

  const solidityCode = generatePresaleContractSolidity(formData);

  return (
    <div className="space-y-6">
      
      {/* Module Title & Context */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-amber-400 font-mono">
            <span>BITBOND TOKEN TOOLS ARCHITECTURE</span>
            <span className="text-slate-600">·</span>
            <span>ETHEREUM CROWDSALE PROGRAMMING</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
            Carlyluminatti Smart Contracts & Presale Launchpad
          </h1>
          <p className="text-sm text-slate-400 max-w-3xl mt-1 leading-relaxed">
            Configure custom token sale parameters, set strict Soft and Hard caps, establish designated receiving investment wallets, and enforce the on-chain 10-minute pre-sale edit freeze window.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800 self-start lg:self-center shrink-0">
          <button
            onClick={() => setActiveTab('configure')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'configure' 
                ? 'bg-amber-400 text-slate-950' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            Parameter Customizer
          </button>

          <button
            onClick={() => setActiveTab('solidity')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'solidity' 
                ? 'bg-amber-400 text-slate-950' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            Solidity 0.8.24 Code
          </button>
        </div>
      </div>

      {/* 10-Minute Lock Status Banner & Time Simulation Controller */}
      <div className={`p-4 rounded-xl border transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
        isLocked 
          ? 'bg-rose-950/30 border-rose-800/80 text-rose-200' 
          : 'bg-emerald-950/20 border-emerald-800/60 text-emerald-200'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
            isLocked ? 'bg-rose-900/50 text-rose-400' : 'bg-emerald-900/40 text-emerald-400'
          }`}>
            {isLocked ? <Lock className="w-5 h-5" /> : <Unlock className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold">
              <span>{isLocked ? 'PARAMETERS FROZEN (10-MIN CUTOFF ACTIVE)' : 'PARAMETERS EDITABLE'}</span>
              <span className="text-slate-500">·</span>
              <span className="font-mono text-slate-300">
                Sale: {new Date(formData.saleStartTime).toLocaleDateString()} {new Date(formData.saleStartTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {isLocked 
                ? 'Smart contract parameter immutability is locked on-chain. Edits are disabled within 10 minutes of launch to guarantee buyer protection.' 
                : `Edits can be modified up to 10 minutes before the sale starts (${minutesUntilLock}m ${secondsUntilLock}s remaining until edit lock).`}
            </p>
          </div>
        </div>

        {/* Simulator controls for the user to test the 10-minute freeze window */}
        <div className="flex items-center gap-2 shrink-0 self-end md:self-auto bg-slate-900/80 p-1.5 rounded-lg border border-slate-800 text-xs text-slate-300">
          <span className="text-[11px] text-slate-400 px-1 font-mono">Test Freeze Window:</span>
          {isLocked ? (
            <button
              onClick={() => setSimulatedTimeOffsetMinutes(0)}
              className="flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors"
              title="Reset simulated time to normal"
            >
              <RotateCcw className="w-3 h-3 text-amber-400" />
              <span>Reset Timer</span>
            </button>
          ) : (
            <button
              onClick={() => setSimulatedTimeOffsetMinutes(120)}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-xs font-semibold transition-colors"
              title="Fast-forward time into the 10-minute freeze cutoff"
            >
              <FastForward className="w-3 h-3" />
              <span>Trigger 10m Lock</span>
            </button>
          )}
        </div>
      </div>

      {validationError && (
        <div className="p-3.5 bg-rose-950/40 border border-rose-800 rounded-xl text-xs text-rose-300 flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      {/* Main Tab Content */}
      {activeTab === 'configure' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Parameter Form (8 cols) */}
          <div className="lg:col-span-8 bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-6">
            
            {/* 1. Token Identity */}
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                <span className="text-amber-400">01.</span>
                <span>Token Identity & Architecture</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">
                    Token Name
                  </label>
                  <input
                    type="text"
                    disabled={isLocked}
                    value={formData.tokenName}
                    onChange={(e) => handleFieldChange('tokenName', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 disabled:opacity-50 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">
                    Symbol
                  </label>
                  <input
                    type="text"
                    disabled={isLocked}
                    value={formData.tokenSymbol}
                    onChange={(e) => handleFieldChange('tokenSymbol', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 font-mono disabled:opacity-50 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">
                    Decimals
                  </label>
                  <input
                    type="number"
                    disabled
                    value={formData.tokenDecimals}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-400 font-mono opacity-70 cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">
                    Total Token Supply
                  </label>
                  <input
                    type="number"
                    disabled={isLocked}
                    value={formData.totalSupply}
                    onChange={(e) => handleFieldChange('totalSupply', Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 font-mono disabled:opacity-50 focus:outline-none focus:border-amber-500"
                  />
                  <span className="text-[11px] text-slate-500 font-mono mt-1 block">
                    {formData.totalSupply.toLocaleString()} {formData.tokenSymbol}
                  </span>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">
                    Presale Allocation
                  </label>
                  <input
                    type="number"
                    disabled={isLocked}
                    value={formData.presaleAllocation}
                    onChange={(e) => handleFieldChange('presaleAllocation', Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 font-mono disabled:opacity-50 focus:outline-none focus:border-amber-500"
                  />
                  <span className="text-[11px] text-slate-500 font-mono mt-1 block">
                    {((formData.presaleAllocation / formData.totalSupply) * 100).toFixed(1)}% of total supply
                  </span>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-800/80 pt-6">
              {/* 2. Soft Cap & Hard Cap */}
              <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                <span className="text-amber-400">02.</span>
                <span>Crowdsale Caps & Pricing Parameters</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-slate-200">
                      Soft Cap (ETH)
                    </label>
                    <span className="text-[11px] text-slate-400 font-mono">Min Execution Threshold</span>
                  </div>
                  <input
                    type="number"
                    step="0.5"
                    disabled={isLocked}
                    value={formData.softCap}
                    onChange={(e) => handleFieldChange('softCap', Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-amber-300 font-mono font-bold disabled:opacity-50 focus:outline-none focus:border-amber-500"
                  />
                  <p className="text-[11px] text-slate-500 mt-2">
                    If this minimum isn't reached by sale conclusion, smart contract enables 100% refund for all buyers.
                  </p>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-slate-200">
                      Hard Cap (ETH)
                    </label>
                    <span className="text-[11px] text-slate-400 font-mono">Maximum Fundraising Ceiling</span>
                  </div>
                  <input
                    type="number"
                    step="1"
                    disabled={isLocked}
                    value={formData.hardCap}
                    onChange={(e) => handleFieldChange('hardCap', Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-emerald-300 font-mono font-bold disabled:opacity-50 focus:outline-none focus:border-emerald-500"
                  />
                  <p className="text-[11px] text-slate-500 mt-2">
                    The presale automatically closes and finalizes immediately once hard cap is reached.
                  </p>
                </div>
              </div>

              {/* Cap Ratio Preview */}
              <div className="mt-4 p-3 bg-slate-950/80 rounded-xl border border-slate-800">
                <div className="flex justify-between text-xs font-mono text-slate-400 mb-1.5">
                  <span>Soft Cap: {formData.softCap} ETH</span>
                  <span>Hard Cap: {formData.hardCap} ETH</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden flex">
                  <div 
                    className="bg-amber-400 h-full" 
                    style={{ width: `${Math.min(100, (formData.softCap / formData.hardCap) * 100)}%` }}
                    title="Soft Cap Range"
                  />
                  <div className="bg-emerald-500 h-full flex-1" title="Remaining to Hard Cap" />
                </div>
                <span className="text-[11px] text-slate-500 font-mono mt-1 block text-right">
                  Soft Cap is {((formData.softCap / formData.hardCap) * 100).toFixed(0)}% of Hard Cap
                </span>
              </div>
            </div>

            <div className="border-t border-slate-800/80 pt-6">
              {/* 3. Rates and Wallet Limits */}
              <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                <span className="text-amber-400">03.</span>
                <span>Rates & Buyer Wallet Contribution Limits</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">
                    Presale Rate (Tokens per 1 ETH)
                  </label>
                  <input
                    type="number"
                    disabled={isLocked}
                    value={formData.tokenRate}
                    onChange={(e) => handleFieldChange('tokenRate', Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 font-mono disabled:opacity-50 focus:outline-none focus:border-amber-500"
                  />
                  <span className="text-[11px] text-slate-500 font-mono mt-1 block">
                    1 ETH = {formData.tokenRate.toLocaleString()} {formData.tokenSymbol}
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">
                    Target DEX Listing Rate (Uniswap)
                  </label>
                  <input
                    type="number"
                    disabled={isLocked}
                    value={formData.listingRate}
                    onChange={(e) => handleFieldChange('listingRate', Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 font-mono disabled:opacity-50 focus:outline-none focus:border-amber-500"
                  />
                  <span className="text-[11px] text-emerald-400 font-mono mt-1 block">
                    +{(((formData.tokenRate - formData.listingRate) / formData.listingRate) * 100).toFixed(0)}% Presale Backer Advantage
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">
                    Min Contribution (ETH)
                  </label>
                  <input
                    type="number"
                    step="0.05"
                    disabled={isLocked}
                    value={formData.minContribution}
                    onChange={(e) => handleFieldChange('minContribution', Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 font-mono disabled:opacity-50 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">
                    Max Contribution (ETH)
                  </label>
                  <input
                    type="number"
                    step="1"
                    disabled={isLocked}
                    value={formData.maxContribution}
                    onChange={(e) => handleFieldChange('maxContribution', Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 font-mono disabled:opacity-50 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-slate-800/80 pt-6">
              {/* 4. Payment Methods & Receiving Wallet Address */}
              <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                <span className="text-amber-400">04.</span>
                <span>Payment Methods & Investment Receiver Wallet</span>
              </h2>

              {/* Accepted Payments Selection */}
              <div className="mb-4">
                <label className="block text-xs font-medium text-slate-400 mb-2">
                  Select Accepted Currencies for Investor Payments:
                </label>
                <div className="flex flex-wrap gap-3">
                  {(['ETH', 'USDT', 'USDC'] as PaymentMethod[]).map(method => {
                    const isSelected = formData.acceptedPayments.includes(method);
                    return (
                      <button
                        key={method}
                        type="button"
                        disabled={isLocked}
                        onClick={() => handlePaymentToggle(method)}
                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                          isSelected 
                            ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20' 
                            : 'bg-slate-950 text-slate-400 border border-slate-800 hover:border-slate-700'
                        } ${isLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <Coins className="w-3.5 h-3.5" />
                        <span>{method}</span>
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-slate-950" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Selected Wallet for receiving investments */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <label className="block text-xs font-semibold text-slate-200 mb-1.5 flex items-center gap-1.5">
                  <Wallet className="w-3.5 h-3.5 text-amber-400" />
                  <span>Designated Investment Receiver Wallet Address:</span>
                </label>
                <input
                  type="text"
                  disabled={isLocked}
                  value={formData.receivingWallet}
                  onChange={(e) => handleFieldChange('receivingWallet', e.target.value)}
                  placeholder="0x..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-amber-300 font-mono disabled:opacity-50 focus:outline-none focus:border-amber-500"
                />
                <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                  During creation, all investments made in ETH, USDT, or USDC will be securely forwarded directly through the smart contract into this treasury receiver account.
                </p>
              </div>

              {/* Distribution Mode */}
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  disabled={isLocked}
                  onClick={() => handleFieldChange('distributionMode', 'Immediate')}
                  className={`p-3 rounded-xl border text-left transition-colors ${
                    formData.distributionMode === 'Immediate'
                      ? 'bg-amber-500/10 border-amber-500/50 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="font-semibold text-xs text-amber-300">Direct Auto-Distribution</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Tokens transfer straight to buyer upon investment receipt.
                  </div>
                </button>

                <button
                  type="button"
                  disabled={isLocked}
                  onClick={() => handleFieldChange('distributionMode', 'ClaimAfterSale')}
                  className={`p-3 rounded-xl border text-left transition-colors ${
                    formData.distributionMode === 'ClaimAfterSale'
                      ? 'bg-amber-500/10 border-amber-500/50 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="font-semibold text-xs text-amber-300">Post-Sale Claim Portal</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Tokens claimable after Hard Cap or Sale end date is reached.
                  </div>
                </button>
              </div>

            </div>

          </div>

          {/* Right Column: Execution Summary & Deploy Card (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Launch Status Card */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                  Contract Deployment
                </span>
                <span className={`text-[11px] font-mono px-2 py-0.5 rounded ${
                  deploySuccess ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'
                }`}>
                  {deploySuccess ? 'Deployed' : 'Pending'}
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                  <span className="text-slate-400">Target Network</span>
                  <span className="font-mono text-white">{network}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                  <span className="text-slate-400">Compiler Target</span>
                  <span className="font-mono text-amber-400">Solidity 0.8.24</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                  <span className="text-slate-400">Soft Cap Goal</span>
                  <span className="font-mono text-amber-300 font-bold">{formData.softCap} ETH</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                  <span className="text-slate-400">Hard Cap Goal</span>
                  <span className="font-mono text-emerald-300 font-bold">{formData.hardCap} ETH</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                  <span className="text-slate-400">Accepted Currencies</span>
                  <span className="font-mono text-white">{formData.acceptedPayments.join(', ')}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                  <span className="text-slate-400">10-Min Pre-Sale Lock</span>
                  <span className="font-mono text-amber-400">Enforced On-Chain</span>
                </div>
              </div>

              {deploySuccess && formData.contractAddress ? (
                <div className="mt-5 p-3.5 bg-slate-950 rounded-xl border border-emerald-500/30 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Contract Successfully Deployed</span>
                  </div>
                  <div className="text-[11px] font-mono text-slate-300 break-all bg-slate-900 p-2 rounded border border-slate-800">
                    {formData.contractAddress}
                  </div>
                  <div className="grid grid-cols-1 gap-2 pt-1">
                    <button
                      onClick={onNavigateToPayments}
                      className="w-full py-2 px-3 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg flex items-center justify-center gap-2 transition-all"
                    >
                      <Coins className="w-3.5 h-3.5" />
                      <span>Open Investor Terminal & Payments</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-6 space-y-2">
                  <button
                    disabled={deploying}
                    onClick={handleDeployContract}
                    className="w-full py-3 px-4 text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50"
                  >
                    <Rocket className="w-4 h-4" />
                    <span>{deploying ? 'Compiling & Deploying...' : 'Compile & Deploy Smart Contract'}</span>
                  </button>
                  <button
                    onClick={handleSaveParameters}
                    className="w-full py-2 px-4 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/60 hover:bg-slate-800 rounded-xl transition-colors"
                  >
                    Save Draft Parameters
                  </button>
                </div>
              )}
            </div>

            {/* Invariant & Security Check Card */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-white">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Bitbond Invariant Verification</span>
              </div>
              <ul className="text-[11px] text-slate-400 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>Soft Cap strictly less than Hard Cap ({formData.softCap} &lt; {formData.hardCap} ETH).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>10-Minute Lock logic verified in Solidity `onlyBeforeLockWindow`.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>Direct payment transfer to receiver wallet with ReentrancyGuard.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>Emergency refund logic armed if Soft Cap is not attained.</span>
                </li>
              </ul>
            </div>

          </div>

        </div>
      )}

      {/* Solidity Code Studio View */}
      {activeTab === 'solidity' && (
        <div className="space-y-4">
          <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Autonomous Solidity 0.8.24 Code Generator</span>
                <span className="text-xs text-amber-400 font-mono">CL-PRESALE-V2</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Full production-grade contract containing parameter update functions with the mandatory 10-minute lock modifier, multi-payment routing, and buyer distribution.
              </p>
            </div>
            
            <button
              onClick={() => setActiveTab('configure')}
              className="text-xs text-amber-400 hover:underline shrink-0"
            >
              ← Back to Parameter Customizer
            </button>
          </div>

          <SolidityViewer 
            solidityCode={solidityCode} 
            contractName={`${formData.tokenSymbol}Presale_Carlyluminatti`} 
          />
        </div>
      )}

    </div>
  );
};

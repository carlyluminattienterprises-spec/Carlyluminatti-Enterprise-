import React, { useState } from 'react';
import { 
  X, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Coins, 
  CheckCircle2, 
  Copy, 
  Check, 
  ExternalLink, 
  Code, 
  Share2, 
  GitBranch, 
  Lock, 
  Wallet,
  AlertCircle
} from 'lucide-react';
import { PresaleParameters } from '../types';

interface ManageTokenSaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  parameters: PresaleParameters;
  onUpdateParameters: (params: PresaleParameters) => void;
  onOpenInvestorPortal: () => void;
  onOpenEmbedModal: () => void;
  onOpenShareModal: () => void;
  onOpenGitHubModal: () => void;
  totalEthRaised: number;
}

export const ManageTokenSaleModal: React.FC<ManageTokenSaleModalProps> = ({
  isOpen,
  onClose,
  parameters,
  onUpdateParameters,
  onOpenInvestorPortal,
  onOpenEmbedModal,
  onOpenShareModal,
  onOpenGitHubModal,
  totalEthRaised
}) => {
  const [tokensToDeposit, setTokensToDeposit] = useState<string>(
    parameters.isFundedWithTokens ? '0' : parameters.presaleAllocation.toString()
  );
  const [isDepositing, setIsDepositing] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const isSoftCapMet = totalEthRaised >= parameters.softCap;
  const contractAddress = parameters.contractAddress || '0x892af41ed38B291cB8791094cF928e71c991a0D4';
  const presalePublicUrl = `https://carlyluminatti.network/presale/${contractAddress}`;

  const handleDepositTokens = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(tokensToDeposit);
    if (amount <= 0) return;

    setIsDepositing(true);
    setActionSuccessMessage(null);

    setTimeout(() => {
      const newTotal = parameters.tokensDepositedToContract + amount;
      onUpdateParameters({
        ...parameters,
        tokensDepositedToContract: newTotal,
        isFundedWithTokens: newTotal >= parameters.presaleAllocation
      });
      setIsDepositing(false);
      setActionSuccessMessage(`Successfully sent ${amount.toLocaleString()} ${parameters.tokenSymbol} to presale contract address! Contract is funded.`);
    }, 1000);
  };

  const handleWithdrawFunds = () => {
    if (!isSoftCapMet) {
      alert(`Cannot withdraw funds: Soft Cap of ${parameters.softCap} ETH has not been met yet.`);
      return;
    }

    setIsWithdrawing(true);
    setActionSuccessMessage(null);

    setTimeout(() => {
      onUpdateParameters({
        ...parameters,
        fundsWithdrawn: true,
        withdrawnAmount: totalEthRaised
      });
      setIsWithdrawing(false);
      setActionSuccessMessage(`Successfully withdrew ${totalEthRaised.toFixed(2)} ETH from token sale contract to receiving wallet (${parameters.receivingWallet})!`);
    }, 1200);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(presalePublicUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in">
      <div className="relative bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
              <span>ADMINISTRATIVE OPERATIONS</span>
              <span className="text-slate-600">·</span>
              <span>SOLIDITY SMART CONTRACT MANAGEMENT</span>
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight mt-0.5">
              Manage Token Sale Functions
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Public Shareable Link Display */}
        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-200">
            <span>Public Token Sale Link for Investors</span>
            <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Sale Live & Ready</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-amber-300 truncate select-all">
              {presalePublicUrl}
            </div>
            <button
              onClick={handleCopyLink}
              className="px-3 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors flex items-center gap-1.5 shrink-0"
              title="Copy link"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          {/* Quick Actions Row */}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-900">
            <button
              onClick={() => {
                onClose();
                onOpenInvestorPortal();
              }}
              className="px-2.5 py-1.5 text-xs font-semibold text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 rounded-md border border-amber-500/30 transition-colors flex items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open Investor Interface</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onOpenEmbedModal();
              }}
              className="px-2.5 py-1.5 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-md transition-colors flex items-center gap-1.5"
            >
              <Code className="w-3.5 h-3.5 text-cyan-400" />
              <span>Embed in HTML Frame</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onOpenShareModal();
              }}
              className="px-2.5 py-1.5 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-md transition-colors flex items-center gap-1.5"
            >
              <Share2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Share Directly</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onOpenGitHubModal();
              }}
              className="px-2.5 py-1.5 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-md transition-colors flex items-center gap-1.5"
            >
              <GitBranch className="w-3.5 h-3.5 text-purple-400" />
              <span>Update GitHub</span>
            </button>
          </div>
        </div>

        {actionSuccessMessage && (
          <div className="p-3 bg-emerald-950/40 border border-emerald-800 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{actionSuccessMessage}</span>
          </div>
        )}

        {/* Function 1: Send Tokens to Pre-sale Contract Address */}
        <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ArrowDownLeft className="w-4 h-4 text-amber-400" />
                <span>Send Tokens to Pre-sale Contract Address</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Execute `depositTokens()` to fund the presale contract with {parameters.tokenSymbol} so buyers can redeem their allocations.
              </p>
            </div>
            <span className={`text-[11px] font-mono px-2 py-0.5 rounded ${
              parameters.isFundedWithTokens ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
            }`}>
              {parameters.isFundedWithTokens ? 'Fully Funded' : 'Awaiting Funding'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs font-mono p-3 bg-slate-900 rounded-lg border border-slate-800">
            <div>
              <span className="text-slate-500 block">Required Allocation:</span>
              <span className="text-white font-bold">{parameters.presaleAllocation.toLocaleString()} {parameters.tokenSymbol}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Currently Deposited:</span>
              <span className="text-emerald-400 font-bold">{parameters.tokensDepositedToContract.toLocaleString()} {parameters.tokenSymbol}</span>
            </div>
          </div>

          <form onSubmit={handleDepositTokens} className="flex gap-2">
            <input
              type="number"
              min="1"
              value={tokensToDeposit}
              onChange={(e) => setTokensToDeposit(e.target.value)}
              placeholder="Amount of ERC-20 tokens"
              className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-amber-500"
            />
            <button
              type="submit"
              disabled={isDepositing || Number(tokensToDeposit) <= 0}
              className="px-4 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-1.5 shrink-0"
            >
              <Coins className="w-3.5 h-3.5" />
              <span>{isDepositing ? 'Sending...' : 'Deposit Tokens to Contract'}</span>
            </button>
          </form>
        </div>

        {/* Function 2: Withdraw Funds from Token Sale Contract */}
        <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ArrowUpRight className="w-4 h-4 text-emerald-400" />
                <span>Withdraw Funds from Token Sale Contract</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Execute `withdrawRaisedFunds()` to transfer raised funds from the contract to the selected receiver wallet ({parameters.receivingWallet}).
              </p>
            </div>
            <span className={`text-[11px] font-mono px-2 py-0.5 rounded ${
              isSoftCapMet ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'
            }`}>
              {isSoftCapMet ? 'Soft Cap Reached (Unlocked)' : 'Locked until Soft Cap'}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-xs font-mono p-3 bg-slate-900 rounded-lg border border-slate-800">
            <div>
              <span className="text-slate-500 block">Soft Cap Minimum:</span>
              <span className="text-amber-300">{parameters.softCap} ETH</span>
            </div>
            <div>
              <span className="text-slate-500 block">Total Raised:</span>
              <span className="text-white font-bold">{totalEthRaised.toFixed(2)} ETH</span>
            </div>
            <div>
              <span className="text-slate-500 block">Withdrawn to Date:</span>
              <span className="text-emerald-400 font-bold">{parameters.withdrawnAmount.toFixed(2)} ETH</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-slate-400">
              {isSoftCapMet 
                ? 'Soft Cap criteria satisfied. Creator can safely withdraw funds.'
                : `Need ${(parameters.softCap - totalEthRaised).toFixed(2)} more ETH to reach Soft Cap.`}
            </span>

            <button
              onClick={handleWithdrawFunds}
              disabled={!isSoftCapMet || isWithdrawing || parameters.fundsWithdrawn}
              className="px-4 py-2 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 disabled:opacity-40 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Wallet className="w-3.5 h-3.5" />
              <span>
                {parameters.fundsWithdrawn 
                  ? 'Funds Already Withdrawn' 
                  : isWithdrawing 
                  ? 'Withdrawing...' 
                  : `Withdraw ${totalEthRaised.toFixed(2)} ETH`}
              </span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

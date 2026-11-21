import React, { useState } from 'react';
import { X, Share2, Copy, Check, QrCode, Send, MessageSquare, Twitter } from 'lucide-react';
import { PresaleParameters } from '../types';

interface ShareInvestorModalProps {
  isOpen: boolean;
  onClose: () => void;
  parameters: PresaleParameters;
}

export const ShareInvestorModal: React.FC<ShareInvestorModalProps> = ({
  isOpen,
  onClose,
  parameters
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedPitch, setCopiedPitch] = useState(false);

  if (!isOpen) return null;

  const publicUrl = `https://carlyluminatti.network/presale/${parameters.contractAddress || '0x892af41ed38B291cB8791094cF928e71c991a0D4'}`;
  const investorPitch = `🚀 Carlyluminatti Network Enterprise - Token Pre-sale is LIVE!
Token: ${parameters.tokenName} (${parameters.tokenSymbol})
Soft Cap: ${parameters.softCap} ETH | Hard Cap: ${parameters.hardCap} ETH
Rate: 1 ETH = ${parameters.tokenRate.toLocaleString()} ${parameters.tokenSymbol}
Accepted Currencies: ${parameters.acceptedPayments.join(', ')}

👉 Invest directly and redeem tokens at:
${publicUrl}

100% AI-Operated Crypto Empire & Media Social Club Studioverse`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyPitch = () => {
    navigator.clipboard.writeText(investorPitch);
    setCopiedPitch(true);
    setTimeout(() => setCopiedPitch(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in">
      <div className="relative bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5">
        
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white tracking-tight">
              Share Directly with Investors
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Link Box */}
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-slate-400">Direct Investor Presale URL</label>
          <div className="flex gap-2">
            <input
              type="text"
              readOnly
              value={publicUrl}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-amber-300 truncate select-all"
            />
            <button
              onClick={handleCopyLink}
              className="px-3 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors flex items-center gap-1 shrink-0"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Copied' : 'Copy Link'}</span>
            </button>
          </div>
        </div>

        {/* Investor Announcement Template */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs text-slate-400">
            <span>Investor Dispatch Copy</span>
            <button onClick={handleCopyPitch} className="text-amber-400 hover:underline flex items-center gap-1">
              {copiedPitch ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedPitch ? 'Copied' : 'Copy Text'}</span>
            </button>
          </div>
          <pre className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] font-mono text-slate-300 leading-relaxed max-h-36 overflow-y-auto whitespace-pre-wrap select-all">
            {investorPitch}
          </pre>
        </div>

        {/* Quick Social Dispatch Shortcuts */}
        <div className="pt-2 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-xs">
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(investorPitch)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-200 transition-colors flex items-center justify-center gap-2 font-medium"
          >
            <Twitter className="w-3.5 h-3.5 text-sky-400" />
            <span>Broadcast on X</span>
          </a>

          <a
            href={`https://t.me/share/url?url=${encodeURIComponent(publicUrl)}&text=${encodeURIComponent(`${parameters.tokenName} Presale is LIVE!`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-200 transition-colors flex items-center justify-center gap-2 font-medium"
          >
            <Send className="w-3.5 h-3.5 text-cyan-400" />
            <span>Telegram Channel</span>
          </a>
        </div>

      </div>
    </div>
  );
};

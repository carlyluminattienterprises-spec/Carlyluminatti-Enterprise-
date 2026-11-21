import React, { useState } from 'react';
import { X, Copy, Check, Code, Eye, Monitor, Smartphone } from 'lucide-react';

interface EmbedCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  contractAddress: string;
}

export const EmbedCodeModal: React.FC<EmbedCodeModalProps> = ({
  isOpen,
  onClose,
  contractAddress
}) => {
  const [copied, setCopied] = useState(false);
  const [frameHeight, setFrameHeight] = useState('720');
  const [theme, setTheme] = useState<'dark' | 'obsidian'>('dark');

  if (!isOpen) return null;

  const embedUrl = `https://carlyluminatti.network/embed/presale/${contractAddress}?theme=${theme}`;
  const iframeSnippet = `<!-- Carlyluminatti Network Enterprise - Presale Investor Terminal Embed -->
<iframe
  src="${embedUrl}"
  width="100%"
  height="${frameHeight}"
  frameborder="0"
  allow="clipboard-write; ethereum"
  style="border-radius: 16px; border: 1px solid rgba(245, 158, 11, 0.3); box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);"
  title="Carlyluminatti Token Sale Investor Interface"
></iframe>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(iframeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in">
      <div className="relative bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-5">
        
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Code className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-white tracking-tight">
              Embed on Carlyluminatti Enterprise Website
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          Copy and paste this HTML frame directly into your Carlyluminatti Network website, CMS, or external portal. Investors can connect their Web3 wallets and invest directly inside the embedded frame.
        </p>

        {/* Configuration Options */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <label className="block text-slate-400 mb-1">Frame Height (px)</label>
            <input
              type="number"
              value={frameHeight}
              onChange={(e) => setFrameHeight(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white font-mono"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Theme Palette</label>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value as any)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white"
            >
              <option value="dark">Enterprise Dark Slate</option>
              <option value="obsidian">Obsidian & Gold Luxury</option>
            </select>
          </div>
        </div>

        {/* Code Snippet Box */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs text-slate-400">
            <span>HTML &lt;iframe&gt; Code</span>
            <span className="font-mono text-[11px] text-amber-400">Responsive Ready</span>
          </div>
          <pre className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 text-[11px] font-mono text-slate-300 overflow-x-auto select-all leading-relaxed max-h-48">
            {iframeSnippet}
          </pre>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-[11px] text-slate-500 font-mono">
            Origin: carlyluminatti.network
          </span>

          <button
            onClick={handleCopy}
            className="px-4 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors flex items-center gap-1.5"
          >
            {copied ? <Check className="w-4 h-4 text-slate-950" /> : <Copy className="w-4 h-4 text-slate-950" />}
            <span>{copied ? 'Code Copied to Clipboard!' : 'Copy Embed HTML Code'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};

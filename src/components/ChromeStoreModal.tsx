import React, { useState } from 'react';
import { 
  X, 
  Chrome, 
  Download, 
  Copy, 
  Check, 
  Sparkles, 
  Layers, 
  ExternalLink, 
  ShieldCheck, 
  FileCode, 
  CheckCircle2, 
  Eye, 
  Smartphone,
  Wallet,
  TrendingUp,
  Coins
} from 'lucide-react';
import { PresaleParameters } from '../types';

interface ChromeStoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  parameters: PresaleParameters;
  totalEthRaised: number;
}

export const ChromeStoreModal: React.FC<ChromeStoreModalProps> = ({
  isOpen,
  onClose,
  parameters,
  totalEthRaised
}) => {
  const [activeView, setActiveView] = useState<'manifest' | 'popup-preview' | 'store-listing'>('popup-preview');
  const [copiedManifest, setCopiedManifest] = useState(false);

  if (!isOpen) return null;

  const manifestJsonString = JSON.stringify({
    manifest_version: 3,
    name: "Carlyluminatti Network Enterprise Studioverse",
    version: "1.0.0",
    description: "The 1st 100% AI-Operated Crypto Empire, Pre-sale Launchpad, Crowdsale Terminal, and Media Studioverse Extension.",
    author: "Carlyluminatti Network Enterprise",
    homepage_url: "https://carlyluminatti.network",
    action: {
      default_popup: "index.html",
      default_title: "Carlyluminatti Enterprise Presale & Studioverse Cockpit"
    },
    permissions: [
      "storage",
      "activeTab"
    ],
    "host_permissions": [
      "https://*/*",
      "http://*/*"
    ],
    icons: {
      "16": "icon16.svg",
      "48": "icon48.svg",
      "128": "icon128.svg"
    }
  }, null, 2);

  const handleCopyManifest = () => {
    navigator.clipboard.writeText(manifestJsonString);
    setCopiedManifest(true);
    setTimeout(() => setCopiedManifest(false), 2000);
  };

  const handleDownloadManifest = () => {
    const blob = new Blob([manifestJsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'manifest.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in">
      <div className="relative bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-amber-500/20">
              <Chrome className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
                <span>CHROME WEB STORE COMPLIANT</span>
                <span className="text-slate-600">·</span>
                <span>MANIFEST V3 SPECIFICATION</span>
              </div>
              <h2 className="text-lg font-bold text-white tracking-tight mt-0.5">
                Chrome Web Store Extension Suite
              </h2>
            </div>
          </div>

          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setActiveView('popup-preview')}
            className={`px-3 py-1.5 rounded-lg transition-colors font-medium flex items-center gap-1.5 ${
              activeView === 'popup-preview'
                ? 'bg-amber-400 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Extension Popup Preview</span>
          </button>

          <button
            onClick={() => setActiveView('manifest')}
            className={`px-3 py-1.5 rounded-lg transition-colors font-medium flex items-center gap-1.5 ${
              activeView === 'manifest'
                ? 'bg-amber-400 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>manifest.json (V3)</span>
          </button>

          <button
            onClick={() => setActiveView('store-listing')}
            className={`px-3 py-1.5 rounded-lg transition-colors font-medium flex items-center gap-1.5 ${
              activeView === 'store-listing'
                ? 'bg-amber-400 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Store Listing Metadata</span>
          </button>
        </div>

        {/* 1. Popup Preview Mode: Simulates Chrome Extension Toolbar Panel */}
        {activeView === 'popup-preview' && (
          <div className="space-y-4">
            <p className="text-xs text-slate-400">
              Interactive preview of how investors run the Carlyluminatti extension directly from Chrome's extension popup toolbar.
            </p>

            <div className="flex justify-center py-2">
              {/* Chrome Extension Browser Mockup */}
              <div className="w-[380px] bg-slate-950 border-2 border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col font-sans">
                
                {/* Simulated Chrome Extension Window Header */}
                <div className="bg-slate-900 px-3.5 py-2.5 border-b border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3.5 h-3.5 rounded-full bg-amber-400" />
                    <span className="font-bold text-white text-[11px] truncate max-w-[190px]">
                      Carlyluminatti Network
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/60">
                    Live Ext v1.0
                  </span>
                </div>

                {/* Popup Content */}
                <div className="p-4 space-y-3.5 text-xs">
                  
                  {/* Presale Status Widget */}
                  <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 space-y-1.5">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-slate-400">Presale Status</span>
                      <span className="text-amber-400 font-mono font-bold">10m Freeze Armed</span>
                    </div>
                    <div className="text-base font-bold text-white font-mono flex justify-between items-center">
                      <span>{totalEthRaised.toFixed(2)} ETH Raised</span>
                      <span className="text-xs text-slate-400 font-normal">/ {parameters.hardCap} ETH</span>
                    </div>
                    {/* Mini Progress */}
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="bg-amber-400 h-full" 
                        style={{ width: `${Math.min(100, (totalEthRaised / parameters.hardCap) * 100)}%` }} 
                      />
                    </div>
                  </div>

                  {/* Connected Wallet Mini Strip */}
                  <div className="flex items-center justify-between p-2.5 bg-slate-900/60 rounded-lg border border-slate-800 text-[11px] font-mono">
                    <div className="flex items-center gap-1.5 text-slate-300">
                      <Wallet className="w-3.5 h-3.5 text-amber-400" />
                      <span>0x71C...49A</span>
                    </div>
                    <span className="text-emerald-400 font-bold">8.45 ETH</span>
                  </div>

                  {/* Accepted Currencies Quick Badges */}
                  <div className="flex justify-between items-center text-[11px] text-slate-400">
                    <span>Accepted Currencies:</span>
                    <span className="font-mono text-white font-bold">{parameters.acceptedPayments.join(' · ')}</span>
                  </div>

                  {/* Action Shortcuts */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={onClose}
                      className="py-2 px-3 text-[11px] font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors flex items-center justify-center gap-1"
                    >
                      <Coins className="w-3 h-3" />
                      <span>Invest Now</span>
                    </button>
                    <button
                      onClick={onClose}
                      className="py-2 px-3 text-[11px] font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors flex items-center justify-center gap-1"
                    >
                      <TrendingUp className="w-3 h-3 text-emerald-400" />
                      <span>View Charts</span>
                    </button>
                  </div>

                </div>

                {/* Popup Footer */}
                <div className="bg-slate-950 px-3 py-2 border-t border-slate-900 text-[10px] font-mono text-slate-500 text-center">
                  Manifest V3 · Chrome Web Store Certified
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. manifest.json View */}
        {activeView === 'manifest' && (
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs text-slate-400">
              <span>File: <code className="text-amber-400 font-mono">/public/manifest.json</code></span>
              <div className="flex gap-2">
                <button
                  onClick={handleCopyManifest}
                  className="px-2.5 py-1 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded transition-colors flex items-center gap-1"
                >
                  {copiedManifest ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedManifest ? 'Copied' : 'Copy'}</span>
                </button>
                <button
                  onClick={handleDownloadManifest}
                  className="px-2.5 py-1 text-xs text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded transition-colors flex items-center gap-1"
                >
                  <Download className="w-3 h-3" />
                  <span>Download</span>
                </button>
              </div>
            </div>

            <pre className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono text-slate-300 overflow-x-auto leading-relaxed max-h-72 select-all">
              {manifestJsonString}
            </pre>
          </div>
        )}

        {/* 3. Store Listing Metadata View */}
        {activeView === 'store-listing' && (
          <div className="space-y-4 text-xs">
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
              <div>
                <span className="text-slate-400 block mb-1">Extension Title:</span>
                <span className="text-sm font-bold text-white">Carlyluminatti Network Enterprise Studioverse</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-1">Primary Category:</span>
                <span className="text-white font-mono">Developer Tools &gt; Blockchain & Crypto Utilities</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-1">Detailed Description:</span>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  The official Chrome extension for the Carlyluminatti Network Enterprise — the 1st 100% AI-operated crypto empire, Bitbond Token Tools presale launchpad, Ethereum crowdsale terminal, and Media Studioverse. Monitor live investment influx over time, inspect soft/hard cap execution, manage tokens via deposit/withdraw functions, and claim token allocations directly from your Chrome browser.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-900 font-mono text-[11px]">
                <div>
                  <span className="text-slate-500 block">Permissions:</span>
                  <span className="text-slate-300">storage, activeTab</span>
                </div>
                <div>
                  <span className="text-slate-500 block">CSP Standard:</span>
                  <span className="text-emerald-400">Manifest V3 Strict</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span className="font-mono text-[11px]">Ready for Chrome Developer Dashboard upload</span>
          <button
            onClick={handleDownloadManifest}
            className="px-4 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Chrome Web Store Package</span>
          </button>
        </div>

      </div>
    </div>
  );
};

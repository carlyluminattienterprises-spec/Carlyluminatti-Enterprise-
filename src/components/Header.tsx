import React from 'react';
import { 
  Compass, 
  Layers, 
  Coins, 
  ShieldCheck, 
  FileCheck, 
  Film, 
  Wallet,
  TrendingUp,
  Chrome
} from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  openOmniDrawer: () => void;
  openChromeModal: () => void;
  presaleDeployed: boolean;
  network: 'Ethereum Mainnet' | 'Sepolia Testnet';
  setNetwork: (net: 'Ethereum Mainnet' | 'Sepolia Testnet') => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  openOmniDrawer,
  openChromeModal,
  presaleDeployed,
  network,
  setNetwork
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Zone 1: Single text element wordmark with emblem */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-500/20 to-amber-700/30 border border-amber-500/30 flex items-center justify-center overflow-hidden shrink-0">
            <img 
              src="/src/assets/images/carlyluminatti_emblem_1794075274631.jpg" 
              alt="Carlyluminatti Emblem" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
          <button 
            onClick={() => setActiveTab('studioverse-hub')}
            className="text-left group"
          >
            <span className="text-base font-bold tracking-tight text-white group-hover:text-amber-400 transition-colors whitespace-nowrap">
              Carlyluminatti Network
            </span>
            <span className="block text-[11px] font-medium text-slate-400 tracking-wider uppercase">
              100% AI-Operated Enterprise Studioverse
            </span>
          </button>
        </div>

        {/* Zone 2: Concise single-line navigation links */}
        <nav className="hidden xl:flex items-center gap-1 bg-slate-900/60 p-1 rounded-xl border border-slate-800/80 text-xs font-medium text-slate-300">
          <button
            onClick={() => setActiveTab('studioverse-hub')}
            className={`px-2.5 py-1.5 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'studioverse-hub' 
                ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30 font-semibold' 
                : 'hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Film className="w-3.5 h-3.5 text-amber-400" />
            Studioverse
          </button>

          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-2.5 py-1.5 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'dashboard' 
                ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30 font-semibold' 
                : 'hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
            Dashboard
          </button>

          <button
            onClick={() => setActiveTab('presale-launchpad')}
            className={`px-2.5 py-1.5 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'presale-launchpad' 
                ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30 font-semibold' 
                : 'hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            Launchpad
          </button>

          <button
            onClick={() => setActiveTab('fi-generators')}
            className={`px-2.5 py-1.5 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'fi-generators' 
                ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30 font-semibold' 
                : 'hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Coins className="w-3.5 h-3.5 text-amber-400" />
            Fi Generators
          </button>

          <button
            onClick={() => setActiveTab('investor-portal')}
            className={`px-2.5 py-1.5 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'investor-portal' 
                ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30 font-semibold' 
                : 'hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Wallet className="w-3.5 h-3.5 text-amber-400" />
            Investor Portal
          </button>

          <button
            onClick={() => setActiveTab('ar-cockpit')}
            className={`px-2.5 py-1.5 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'ar-cockpit' 
                ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30 font-semibold' 
                : 'hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            AR AI Cockpit
          </button>

          <button
            onClick={() => setActiveTab('ai-notary')}
            className={`px-2.5 py-1.5 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'ai-notary' 
                ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30 font-semibold' 
                : 'hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            AI Notary
          </button>

          <button
            onClick={() => setActiveTab('copyright-licensing')}
            className={`px-2.5 py-1.5 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'copyright-licensing' 
                ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30 font-semibold' 
                : 'hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <FileCheck className="w-3.5 h-3.5 text-amber-400" />
            Copyright
          </button>
        </nav>

        {/* Zone 3: Primary Action, Chrome Web Store trigger, & Omni Drawer */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Chrome Web Store Extension Launcher Button */}
          <button
            onClick={openChromeModal}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-amber-500/30 text-[11px] font-medium text-amber-300 hover:bg-slate-800 transition-colors whitespace-nowrap"
            title="Open Chrome Web Store extension manager and popup view"
          >
            <Chrome className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Chrome Store</span>
          </button>

          {/* Network Switcher */}
          <button 
            onClick={() => setNetwork(network === 'Ethereum Mainnet' ? 'Sepolia Testnet' : 'Ethereum Mainnet')}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300 hover:border-slate-700 transition-colors"
            title="Click to toggle Ethereum Network"
          >
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>{network}</span>
          </button>

          {/* Connected Enterprise Address */}
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300">
            <Wallet className="w-3.5 h-3.5 text-amber-400" />
            <span>0x71C...49A</span>
          </div>

          {/* Carlyluminatti Omni Smart Drawer Trigger */}
          <button
            onClick={openOmniDrawer}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-950 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-lg shadow-sm shadow-amber-500/20 transition-all active:scale-[0.98] whitespace-nowrap shrink-0"
          >
            <Compass className="w-4 h-4 text-slate-950" />
            <span>AI Omni Smart Drawer</span>
          </button>
        </div>

      </div>
    </header>
  );
};

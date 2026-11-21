import React from 'react';
import { 
  Film, 
  Rocket, 
  ShieldCheck, 
  Coins, 
  Layers, 
  ArrowRight, 
  Compass, 
  Sparkles, 
  Globe2,
  Cpu,
  Users
} from 'lucide-react';

interface StudioverseHubProps {
  onNavigate: (tab: string) => void;
  openOmniDrawer: () => void;
}

export const StudioverseHub: React.FC<StudioverseHubProps> = ({
  onNavigate,
  openOmniDrawer
}) => {
  return (
    <div className="space-y-8">
      
      {/* Hero Showcase with Generated Visual Asset */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-slate-950">
        <div className="relative h-96 lg:h-[460px] w-full overflow-hidden">
          <img 
            src="/src/assets/images/carlyluminatti_studioverse_banner_1794075274755.jpg" 
            alt="Carlyluminatti Studioverse Headquarters"
            className="w-full h-full object-cover object-center transform scale-105 hover:scale-100 transition-transform duration-1000 ease-out"
            referrerPolicy="no-referrer"
          />
          {/* Measured contrast scrim */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/40 to-transparent" />
        </div>

        {/* Hero Content Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-10 space-y-4 max-w-4xl">
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
            <span>THE 1ST 100% AI-OPERATED BUSINESS ENTERPRISE</span>
            <span className="text-slate-500">·</span>
            <span>CRYPTO EMPIRE STUDIOVERSE</span>
          </div>

          <h1 className="text-3xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            Carlyluminatti Network Enterprise Studioverse
          </h1>

          <p className="text-sm lg:text-base text-slate-300 leading-relaxed max-w-2xl">
            Infrastructure and development engine for next-generation media and entertainment engineering. Decentralized crowdsales, autonomous smart contract generators, AI Agent notarization, and VIP media social club.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('presale-launchpad')}
              className="px-5 py-3 text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-xl transition-all shadow-lg shadow-amber-500/20 active:scale-[0.98] flex items-center gap-2"
            >
              <Rocket className="w-4 h-4 text-slate-950" />
              <span>Launchpad & Contracts Generator</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-950" />
            </button>

            <button
              onClick={openOmniDrawer}
              className="px-4 py-3 text-xs font-semibold text-slate-200 bg-slate-900/90 hover:bg-slate-800 border border-slate-700 rounded-xl transition-colors flex items-center gap-2"
            >
              <Compass className="w-4 h-4 text-amber-400" />
              <span>Explore Omni Smart Drawer</span>
            </button>

            <button
              onClick={() => onNavigate('payments-distribution')}
              className="px-4 py-3 text-xs font-semibold text-slate-300 hover:text-white bg-slate-950/80 hover:bg-slate-900 border border-slate-800 rounded-xl transition-colors flex items-center gap-2"
            >
              <Coins className="w-4 h-4 text-emerald-400" />
              <span>Payment & Distribution Portal</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Pillars of the Enterprise Empire */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Pillar 1 */}
        <div 
          onClick={() => onNavigate('presale-launchpad')}
          className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 hover:border-amber-500/40 transition-all cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
            <Rocket className="w-5 h-5 text-amber-400" />
          </div>
          <span className="text-[11px] font-mono text-amber-400 block mb-1">BITBOND ARCHITECTURE</span>
          <h3 className="text-base font-bold text-white mb-1.5 group-hover:text-amber-300 transition-colors">
            Pre-Sale Smart Contracts
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Customize parameters with Soft/Hard caps, designated payment receivers, and 10-minute pre-sale edit freeze windows.
          </p>
        </div>

        {/* Pillar 2 */}
        <div 
          onClick={() => onNavigate('payments-distribution')}
          className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 hover:border-amber-500/40 transition-all cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
            <Coins className="w-5 h-5 text-emerald-400" />
          </div>
          <span className="text-[11px] font-mono text-emerald-400 block mb-1">STRAIGHTFORWARD PAYMENTS</span>
          <h3 className="text-base font-bold text-white mb-1.5 group-hover:text-emerald-300 transition-colors">
            Buyer Distribution Engine
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Direct investment routing into designated receiver wallets in ETH, USDT, or USDC with instant batch buyer token claims.
          </p>
        </div>

        {/* Pillar 3 */}
        <div 
          onClick={() => onNavigate('ai-notary')}
          className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 hover:border-amber-500/40 transition-all cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
          </div>
          <span className="text-[11px] font-mono text-cyan-400 block mb-1">AUTONOMOUS VERIFICATION</span>
          <h3 className="text-base font-bold text-white mb-1.5 group-hover:text-cyan-300 transition-colors">
            AI Agent Notary Seal
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Autonomous on-chain audits validating contract logic, 10-minute timelock invariants, and issuing SHA-256 digital seals.
          </p>
        </div>

        {/* Pillar 4 */}
        <div 
          onClick={() => onNavigate('copyright-licensing')}
          className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 hover:border-amber-500/40 transition-all cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
            <Film className="w-5 h-5 text-purple-400" />
          </div>
          <span className="text-[11px] font-mono text-purple-400 block mb-1">MEDIA ENGINEERING</span>
          <h3 className="text-base font-bold text-white mb-1.5 group-hover:text-purple-300 transition-colors">
            Copyright & Licensing
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Protection and monetization of cinematic productions, volumetric 3D sets, and ERC-2981 smart royalty splitters.
          </p>
        </div>

      </div>

      {/* Media Social Club Studioverse Live Section */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 lg:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <span className="text-xs font-mono text-amber-400 uppercase tracking-wider">
              ENTERPRISE MEDIA SOCIAL CLUB
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight mt-1">
              Studioverse Production & VIP Lounge Matrix
            </h2>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <Users className="w-4 h-4 text-amber-400" />
            <span>12,400 Sovereign Tokenholders</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-950 p-5 rounded-xl border border-slate-800/80 space-y-3">
            <div className="text-xs font-mono text-slate-400">STAGE 01 · SCREENING VENUE</div>
            <h4 className="text-base font-bold text-white">Neural Directing Suite</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Real-time generative cinema stage where AI directors render volumetric sets and master 32-channel spatial audio stems for Web3 distribution.
            </p>
            <div className="text-[11px] font-mono text-emerald-400 pt-1">
              Active Stream: 8K 120 FPS
            </div>
          </div>

          <div className="bg-slate-950 p-5 rounded-xl border border-slate-800/80 space-y-3">
            <div className="text-xs font-mono text-slate-400">STAGE 02 · SOCIAL CLUB</div>
            <h4 className="text-base font-bold text-white">VIP Tokenholder DAO</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Curated social club governance voting on film greenlighting, treasury allocations, and royalty distributions from the entertainment empire.
            </p>
            <div className="text-[11px] font-mono text-amber-400 pt-1">
              Next Vote: Film Slate 2027
            </div>
          </div>

          <div className="bg-slate-950 p-5 rounded-xl border border-slate-800/80 space-y-3">
            <div className="text-xs font-mono text-slate-400">STAGE 03 · TOKEN LAUNCHPAD</div>
            <h4 className="text-base font-bold text-white">Bitbond Crowdsale Node</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Decentralized launchpad deploying Ethereum presale smart contracts with locked edit windows and instant receiver wallet settlements.
            </p>
            <div className="text-[11px] font-mono text-cyan-400 pt-1">
              Engine Status: Fully Synchronized
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

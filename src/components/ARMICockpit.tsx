import React, { useState } from 'react';
import { 
  Sparkles, 
  Eye, 
  Maximize2, 
  RotateCw, 
  Layers, 
  Cpu, 
  Coins, 
  ShieldCheck, 
  ArrowLeft, 
  Radio, 
  Compass,
  CheckCircle2,
  Box
} from 'lucide-react';
import { ARMarketplaceAsset } from '../types';

interface ARMICockpitProps {
  onBackToPresale: () => void;
  onOpenInvestorPortal: () => void;
  tokenSymbol: string;
}

const AR_ASSETS: ARMarketplaceAsset[] = [
  {
    id: 'ar-01',
    title: 'Obsidian Studioverse Volumetric Set #09',
    category: 'Volumetric Set',
    tokenValue: '35,000 CLUM',
    arStatus: 'Ready in AR Cockpit',
    hologramColor: 'from-amber-400 to-amber-600',
    description: '8K volumetric photogrammetry environment for AI director spatial cinema production. Tokenized royalty yield: 4.8% APY.'
  },
  {
    id: 'ar-02',
    title: 'Spatial 32-Channel Symphonic Stem Array',
    category: 'Spatial Audio Stem',
    tokenValue: '18,500 CLUM',
    arStatus: 'Live Spatial Stream',
    hologramColor: 'from-cyan-400 to-blue-600',
    description: 'Decentralized spatial acoustic stems streamable across VR/AR headsets with embedded micro-license sync on Ethereum.'
  },
  {
    id: 'ar-03',
    title: 'Autonomous AI Director Agent Avatar "Luminatti-9"',
    category: 'AI Director Hologram',
    tokenValue: '50,000 CLUM',
    arStatus: 'Ready in AR Cockpit',
    hologramColor: 'from-purple-400 to-pink-600',
    description: 'Neural agent director trained on 14,000 award-winning screenplays. Directs synthetic actors in real-time holographic passes.'
  },
  {
    id: 'ar-04',
    title: 'Decentralized Box Office Syndicate Stream',
    category: 'Cinematic Box Office Stream',
    tokenValue: '75,000 CLUM',
    arStatus: 'Live Spatial Stream',
    hologramColor: 'from-emerald-400 to-teal-600',
    description: 'Automated ERC-2981 royalty pipeline streaming global ticket, streaming, and merchandise revenues straight to token stakers.'
  }
];

export const ARMICockpit: React.FC<ARMICockpitProps> = ({
  onBackToPresale,
  onOpenInvestorPortal,
  tokenSymbol
}) => {
  const [selectedAsset, setSelectedAsset] = useState<ARMarketplaceAsset>(AR_ASSETS[0]);
  const [cockpitMode, setCockpitMode] = useState<'Volumetric' | 'Wireframe' | 'Neural Stream'>('Volumetric');
  const [rotationAngle, setRotationAngle] = useState(45);
  const [bidPlaced, setBidPlaced] = useState(false);

  const handleRotate = () => {
    setRotationAngle(prev => (prev + 45) % 360);
  };

  const handlePlaceBid = () => {
    setBidPlaced(true);
    setTimeout(() => setBidPlaced(false), 2500);
  };

  return (
    <div className="space-y-6">
      
      {/* Cockpit Header */}
      <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
            <span>SPATIAL MEDIA & ENTERTAINMENT ENGINEERING</span>
            <span className="text-slate-600">·</span>
            <span>AI COCKPIT INTERACTION</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1 flex items-center gap-2.5">
            <Sparkles className="w-6 h-6 text-amber-400" />
            <span>Carlyluminatti AR Marketplace AI Cockpit</span>
          </h1>
          <p className="text-sm text-slate-400 max-w-2xl mt-1 leading-relaxed">
            Inspect, simulate, and bid on tokenized Studioverse volumetric stages, spatial audio stems, and AI director holograms in an interactive 3D spatial cockpit.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onBackToPresale}
            className="px-3.5 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Presale Launchpad</span>
          </button>

          <button
            onClick={onOpenInvestorPortal}
            className="px-3.5 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-all shadow-sm shadow-amber-400/20 flex items-center gap-1.5"
          >
            <Coins className="w-4 h-4" />
            <span>Invest Tokens in Portal</span>
          </button>
        </div>
      </div>

      {/* Main Cockpit Display Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Interactive Spatial 3D / AR Viewport (8 cols) */}
        <div className="lg:col-span-8 bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden flex flex-col relative min-h-[480px]">
          
          {/* Viewport Top HUD Controls */}
          <div className="p-4 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between z-10">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-mono text-slate-300 font-bold uppercase">
                {selectedAsset.title}
              </span>
              <span className="text-slate-600">·</span>
              <span className="text-[11px] font-mono text-amber-400">{selectedAsset.category}</span>
            </div>

            {/* Mode Selector */}
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
              {(['Volumetric', 'Wireframe', 'Neural Stream'] as const).map(mode => (
                <button
                  key={mode}
                  onClick={() => setCockpitMode(mode)}
                  className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                    cockpitMode === mode
                      ? 'bg-amber-400 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Spatial 3D Simulation Canvas */}
          <div className="flex-1 flex items-center justify-center p-8 relative overflow-hidden bg-radial from-slate-900/60 to-slate-950">
            
            {/* Holographic Projection Background Grid */}
            <div 
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(circle, #f59e0b 1px, transparent 1px)',
                backgroundSize: '24px 24px'
              }}
            />

            {/* Hologram Representation */}
            <div 
              className="relative w-64 h-64 flex items-center justify-center transition-transform duration-700 ease-out cursor-grab active:cursor-grabbing"
              style={{ transform: `rotateY(${rotationAngle}deg) rotateX(${rotationAngle / 3}deg)` }}
              onClick={handleRotate}
              title="Click to rotate in 3D"
            >
              {/* Outer Gyro Rings */}
              <div className="absolute inset-0 rounded-full border border-amber-500/30 animate-spin" style={{ animationDuration: '24s' }} />
              <div className="absolute inset-4 rounded-full border border-cyan-500/30 animate-spin" style={{ animationDuration: '16s', animationDirection: 'reverse' }} />

              {/* Central Geometric Hologram Node */}
              <div className={`w-32 h-32 rounded-2xl bg-gradient-to-tr ${selectedAsset.hologramColor} p-1 shadow-2xl shadow-amber-500/20 transform rotate-12 flex items-center justify-center relative overflow-hidden ${
                cockpitMode === 'Wireframe' ? 'opacity-40 border-2 border-white bg-transparent' : 'opacity-85'
              }`}>
                <div className="w-full h-full rounded-xl bg-slate-950/40 backdrop-blur-md flex flex-col items-center justify-center p-3 text-center">
                  <Box className="w-10 h-10 text-white mb-1 animate-bounce" />
                  <span className="text-[10px] font-mono font-bold text-white tracking-widest uppercase">
                    AR-XR READY
                  </span>
                </div>
              </div>

              {/* Spatial Coordinates Floating HUD */}
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-slate-900/90 border border-slate-700 px-3 py-1 rounded-full text-[10px] font-mono text-amber-300 whitespace-nowrap shadow-md">
                ROT: {rotationAngle}° · SCALE: 1.0X · FOV: 90°
              </div>
            </div>

            {/* Interactive Quick Rotate Action */}
            <button
              onClick={handleRotate}
              className="absolute bottom-4 right-4 p-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-xl text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-mono"
            >
              <RotateCw className="w-4 h-4 text-amber-400" />
              <span>Rotate 3D (+45°)</span>
            </button>
          </div>

          {/* Viewport Bottom Telemetry Strip */}
          <div className="p-4 bg-slate-900/60 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-slate-400">
            <div className="flex items-center gap-3">
              <span>ENGINE: <strong className="text-white">WebXR Holographic Core</strong></span>
              <span>FPS: <strong className="text-emerald-400">120 FPS</strong></span>
              <span>LATENCY: <strong className="text-cyan-400">1.2ms</strong></span>
            </div>

            <div className="text-amber-400 font-bold">
              EST. VALUATION: {selectedAsset.tokenValue}
            </div>
          </div>

        </div>

        {/* Right Column: Asset Selector & Tokenized Bidding Terminal (4 cols) */}
        <div className="lg:col-span-4 bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-5 flex flex-col justify-between">
          
          <div className="space-y-4">
            <div>
              <span className="text-xs font-mono text-amber-400 uppercase tracking-wider">
                COCKPIT SHOWROOM ASSETS
              </span>
              <h2 className="text-lg font-bold text-white tracking-tight mt-0.5">
                Select Tokenized Asset
              </h2>
            </div>

            {/* Asset List */}
            <div className="space-y-2.5">
              {AR_ASSETS.map(asset => (
                <button
                  key={asset.id}
                  onClick={() => setSelectedAsset(asset)}
                  className={`w-full p-3 rounded-xl border text-left transition-all ${
                    selectedAsset.id === asset.id
                      ? 'bg-amber-500/10 border-amber-500/60 text-white shadow-sm'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-bold mb-1">
                    <span className={selectedAsset.id === asset.id ? 'text-amber-300' : 'text-slate-200'}>
                      {asset.title}
                    </span>
                    <span className="font-mono text-emerald-400">{asset.tokenValue}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                    <span>{asset.category}</span>
                    <span>·</span>
                    <span className="text-slate-400">{asset.arStatus}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Selected Asset Details */}
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-xs">
              <div className="font-semibold text-slate-200">Asset Specifications:</div>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                {selectedAsset.description}
              </p>
              <div className="pt-2 border-t border-slate-900 flex justify-between text-[11px] font-mono text-slate-400">
                <span>Standard:</span>
                <span className="text-amber-400">ERC-721 / ERC-2981 Web3</span>
              </div>
            </div>
          </div>

          {/* Place Tokenized Bid Action */}
          <div className="space-y-2 pt-2">
            <button
              onClick={handlePlaceBid}
              className="w-full py-3 px-4 text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-xl transition-all shadow-md shadow-amber-400/20 active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <Coins className="w-4 h-4" />
              <span>Bid {selectedAsset.tokenValue} ({tokenSymbol})</span>
            </button>

            {bidPlaced && (
              <div className="p-2.5 bg-emerald-950/40 border border-emerald-800 rounded-lg text-xs text-emerald-300 flex items-center gap-1.5 justify-center animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Spatial AR Bid Registered on Ethereum!</span>
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};

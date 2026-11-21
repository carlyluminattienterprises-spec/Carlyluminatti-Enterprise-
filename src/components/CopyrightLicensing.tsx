import React, { useState } from 'react';
import { 
  FileCheck, 
  Film, 
  Music, 
  Layers, 
  Sparkles, 
  ShieldCheck, 
  Share2, 
  CheckCircle2, 
  Plus, 
  Download,
  Percent
} from 'lucide-react';
import { CopyrightAsset } from '../types';

export const CopyrightLicensing: React.FC = () => {
  const [assets, setAssets] = useState<CopyrightAsset[]>([
    {
      id: 'cr-01',
      title: 'Studioverse Genesis: The Autonomous Director',
      mediaType: 'Cinema & Feature Film',
      creatorAgent: 'Carlyluminatti Cine-Director-9',
      registrationDate: '2026-10-14',
      licenseType: 'Commercial Enterprise Syndicate',
      royaltySplit: {
        treasuryPercent: 65,
        creatorPercent: 25,
        communityPoolPercent: 10
      },
      hashDigest: '0x88f2a1b94d7620a84c9b0e334a1ef909281a8e99b0c',
      notarized: true
    },
    {
      id: 'cr-02',
      title: 'Neon Horizon Symphony - Spatial 32-Channel Stems',
      mediaType: 'Studio Stems & Master Track',
      creatorAgent: 'Luminatti Sonic Engine',
      registrationDate: '2026-10-28',
      licenseType: 'Exclusive Web3 Sync',
      royaltySplit: {
        treasuryPercent: 50,
        creatorPercent: 40,
        communityPoolPercent: 10
      },
      hashDigest: '0x33e8b091c78491d902ac7811ef45a892b10298cd44a',
      notarized: true
    },
    {
      id: 'cr-03',
      title: 'Obsidian Studioverse VR Stage #04',
      mediaType: '3D Studioverse Asset',
      creatorAgent: 'Spatial Spatial-Architect-X',
      registrationDate: '2026-11-02',
      licenseType: 'Universal Studioverse License',
      royaltySplit: {
        treasuryPercent: 70,
        creatorPercent: 20,
        communityPoolPercent: 10
      },
      hashDigest: '0x55d781a94bca092189acbe1238914aa789912bcde01',
      notarized: true
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newMediaType, setNewMediaType] = useState<CopyrightAsset['mediaType']>('Cinema & Feature Film');
  const [newLicenseType, setNewLicenseType] = useState<CopyrightAsset['licenseType']>('Commercial Enterprise Syndicate');
  const [treasuryPct, setTreasuryPct] = useState(60);
  const [creatorPct, setCreatorPct] = useState(30);
  const [communityPct, setCommunityPct] = useState(10);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newAsset: CopyrightAsset = {
      id: `cr-${Date.now()}`,
      title: newTitle,
      mediaType: newMediaType,
      creatorAgent: 'Carlyluminatti Creative Engine',
      registrationDate: new Date().toISOString().split('T')[0],
      licenseType: newLicenseType,
      royaltySplit: {
        treasuryPercent: treasuryPct,
        creatorPercent: creatorPct,
        communityPoolPercent: communityPct
      },
      hashDigest: `0x${Array.from({ length: 44 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
      notarized: true
    };

    setAssets([newAsset, ...assets]);
    setNewTitle('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Banner */}
      <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-amber-400 font-mono">
            <span>MEDIA & ENTERTAINMENT ENGINEERING</span>
            <span className="text-slate-600">·</span>
            <span>ENTERPRISE COPYRIGHT & SMART LICENSING</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
            Copyright Registration & Royalty Licensing Engine
          </h1>
          <p className="text-sm text-slate-400 max-w-3xl mt-1 leading-relaxed">
            Protect and monetize Studioverse feature films, master audio tracks, volumetric sets, and AI scripts with programmatic ERC-2981 royalty splitters and notarized certificates.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-xl transition-all shadow-md shadow-amber-400/20 active:scale-[0.98] flex items-center gap-2 shrink-0 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Register Media Asset</span>
        </button>
      </div>

      {/* Media Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
          <span className="text-xs text-slate-400">Total Registered Media IP</span>
          <div className="text-2xl font-bold text-white font-mono mt-1">
            {assets.length + 837} Assets
          </div>
          <span className="text-[11px] text-emerald-400 font-mono">
            100% Notarized On-Chain
          </span>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
          <span className="text-xs text-slate-400">Smart Royalty Standard</span>
          <div className="text-2xl font-bold text-amber-300 font-mono mt-1">
            ERC-2981 / EIP-5528
          </div>
          <span className="text-[11px] text-slate-500">
            Automated secondary market splits
          </span>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
          <span className="text-xs text-slate-400">Active Syndicate Licensing</span>
          <div className="text-2xl font-bold text-cyan-400 font-mono mt-1">
            Worldwide Web3 Sync
          </div>
          <span className="text-[11px] text-slate-500">
            Broadcast & Streaming Ready
          </span>
        </div>
      </div>

      {/* Asset Registry List */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <span className="text-amber-400">01.</span>
            <span>Registered Media Entertainment IP & Licensing Contracts</span>
          </h2>
          <span className="text-xs font-mono text-slate-500">{assets.length} titles</span>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {assets.map(asset => (
            <div 
              key={asset.id}
              className="bg-slate-950 p-5 rounded-xl border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-amber-400">{asset.mediaType}</span>
                  <span className="text-slate-600">·</span>
                  <span className="text-xs text-slate-400">{asset.registrationDate}</span>
                  <span className="text-slate-600">·</span>
                  <span className="text-xs text-emerald-400 flex items-center gap-1 font-semibold">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Notarized</span>
                  </span>
                </div>

                <h3 className="text-base font-bold text-white tracking-tight">
                  {asset.title}
                </h3>

                <p className="text-xs text-slate-400 font-mono">
                  Author / AI Agent: <span className="text-slate-300">{asset.creatorAgent}</span>
                </p>

                {/* Royalty Split Breakdown */}
                <div className="flex items-center gap-4 text-xs font-mono pt-1 text-slate-400">
                  <span>License: <strong className="text-amber-300">{asset.licenseType}</strong></span>
                  <span>Treasury: <strong className="text-white">{asset.royaltySplit.treasuryPercent}%</strong></span>
                  <span>Creator: <strong className="text-white">{asset.royaltySplit.creatorPercent}%</strong></span>
                  <span>Community: <strong className="text-white">{asset.royaltySplit.communityPoolPercent}%</strong></span>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2 shrink-0">
                <div className="text-[10px] font-mono text-slate-500 max-w-[200px] truncate bg-slate-900 px-2 py-1 rounded border border-slate-800">
                  Proof: {asset.hashDigest}
                </div>
                <button
                  onClick={() => alert(`Official Carlyluminatti Copyright Certificate generated for: ${asset.title}\nProof Hash: ${asset.hashDigest}`)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5 text-amber-400" />
                  <span>Download Certificate</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal: Register New Asset */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Register Entertainment Media Asset</h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white text-xs"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Asset Title / Work Name
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g., Studioverse Volumetric Set #09"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    Media Category
                  </label>
                  <select
                    value={newMediaType}
                    onChange={(e) => setNewMediaType(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="Cinema & Feature Film">Cinema & Feature Film</option>
                    <option value="Studio Stems & Master Track">Studio Stems & Master Track</option>
                    <option value="3D Studioverse Asset">3D Studioverse Asset</option>
                    <option value="AI Script & Lore Engine">AI Script & Lore Engine</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    License Type
                  </label>
                  <select
                    value={newLicenseType}
                    onChange={(e) => setNewLicenseType(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="Commercial Enterprise Syndicate">Commercial Enterprise Syndicate</option>
                    <option value="Exclusive Web3 Sync">Exclusive Web3 Sync</option>
                    <option value="Universal Studioverse License">Universal Studioverse License</option>
                    <option value="Royalty Splitter Standard">Royalty Splitter Standard</option>
                  </select>
                </div>
              </div>

              {/* Royalty Split Controls */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <span className="text-xs font-semibold text-slate-300 block">
                  ERC-2981 Royalty Split Configuration (%):
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Treasury</label>
                    <input
                      type="number"
                      value={treasuryPct}
                      onChange={(e) => setTreasuryPct(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-xs text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Creator</label>
                    <input
                      type="number"
                      value={creatorPct}
                      onChange={(e) => setCreatorPct(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-xs text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Community</label>
                    <input
                      type="number"
                      value={communityPct}
                      onChange={(e) => setCommunityPct(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-xs text-white font-mono"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors"
              >
                Notarize & Mint Copyright on Ethereum
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

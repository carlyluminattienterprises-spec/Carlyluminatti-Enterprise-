import React, { useState, useMemo } from 'react';
import { 
  X, 
  Search, 
  Rocket, 
  Code2, 
  Coins, 
  ShieldCheck, 
  FileCheck, 
  Film, 
  Layers, 
  Landmark, 
  Clapperboard, 
  TrendingUp, 
  ExternalLink,
  SlidersHorizontal
} from 'lucide-react';
import { ENTERPRISE_APPS } from '../data/appsData';
import { AppCategory, AppGenre, AppStyle, EnterpriseApp } from '../types';

interface OmniSmartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectApp: (tab: string) => void;
}

const CATEGORIES: AppCategory[] = [
  'All',
  'Smart Contracts & Launchpad',
  'Media & Entertainment',
  'Legal & AI Notary',
  'FinTech & Treasury',
  'Crypto & Tokenomics',
  'Studioverse Social Club',
];

const GENRES: AppGenre[] = [
  'All',
  'Decentralized Crowdsales',
  'Cyberpunk Cinema',
  'Autonomous AI Enterprise',
  'Spatial Audio & Royalties',
  'Cryptographic Security',
  'Metaverse Virtual Production',
];

const STYLES: AppStyle[] = [
  'All',
  'High-Frequency Institutional',
  'Cryptographic Sovereign',
  'Hollywood Production Matrix',
  'Obsidian Cyberpunk',
  'Studioverse Luxury',
];

export const OmniSmartDrawer: React.FC<OmniSmartDrawerProps> = ({
  isOpen,
  onClose,
  onSelectApp
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<AppCategory>('All');
  const [selectedGenre, setSelectedGenre] = useState<AppGenre>('All');
  const [selectedStyle, setSelectedStyle] = useState<AppStyle>('All');

  const filteredApps = useMemo(() => {
    return ENTERPRISE_APPS.filter(app => {
      const matchesSearch = 
        app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.codename.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === 'All' || app.category === selectedCategory;
      const matchesGenre = selectedGenre === 'All' || app.genre === selectedGenre;
      const matchesStyle = selectedStyle === 'All' || app.style === selectedStyle;

      return matchesSearch && matchesCategory && matchesGenre && matchesStyle;
    });
  }, [searchQuery, selectedCategory, selectedGenre, selectedStyle]);

  if (!isOpen) return null;

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'Rocket': return <Rocket className="w-5 h-5 text-amber-400" />;
      case 'Code2': return <Code2 className="w-5 h-5 text-cyan-400" />;
      case 'Coins': return <Coins className="w-5 h-5 text-emerald-400" />;
      case 'ShieldCheck': return <ShieldCheck className="w-5 h-5 text-amber-400" />;
      case 'FileCheck': return <FileCheck className="w-5 h-5 text-indigo-400" />;
      case 'Film': return <Film className="w-5 h-5 text-rose-400" />;
      case 'Layers': return <Layers className="w-5 h-5 text-sky-400" />;
      case 'Landmark': return <Landmark className="w-5 h-5 text-amber-400" />;
      case 'Clapperboard': return <Clapperboard className="w-5 h-5 text-purple-400" />;
      case 'TrendingUp': return <TrendingUp className="w-5 h-5 text-emerald-400" />;
      default: return <Rocket className="w-5 h-5 text-amber-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Background click overlay */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Main Drawer Panel */}
      <div className="relative w-full max-w-3xl h-full bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col z-10 overflow-hidden">
        
        {/* Drawer Header */}
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-amber-400">CARLYLUMINATTI OMNI DRAWER</span>
              <span className="text-slate-600">/</span>
              <span className="text-xs text-slate-400">Enterprise App Library</span>
            </div>
            <h2 className="text-xl font-bold text-white mt-0.5 tracking-tight">
              AI Omni Smart Drawer
            </h2>
          </div>

          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            title="Close Drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="p-6 border-b border-slate-800 space-y-4 bg-slate-900/40">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search apps by name, module codename, or capability..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-500/50 transition-colors"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          {/* Filter Matrix: Categories, Genre, Style */}
          <div className="space-y-2.5 text-xs">
            {/* Categories */}
            <div>
              <div className="text-[11px] font-semibold text-slate-400 mb-1.5 flex items-center gap-1.5">
                <SlidersHorizontal className="w-3 h-3 text-amber-400" />
                <span>Categories</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-2.5 py-1 rounded text-xs transition-colors whitespace-nowrap ${
                      selectedCategory === cat 
                        ? 'bg-amber-400 text-slate-950 font-semibold' 
                        : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Genre */}
            <div className="pt-1">
              <div className="text-[11px] font-semibold text-slate-400 mb-1.5">
                <span>Genre</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {GENRES.map(genre => (
                  <button
                    key={genre}
                    onClick={() => setSelectedGenre(genre)}
                    className={`px-2.5 py-1 rounded text-xs transition-colors whitespace-nowrap ${
                      selectedGenre === genre 
                        ? 'bg-amber-400 text-slate-950 font-semibold' 
                        : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            </div>

            {/* Style */}
            <div className="pt-1">
              <div className="text-[11px] font-semibold text-slate-400 mb-1.5">
                <span>Style</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {STYLES.map(style => (
                  <button
                    key={style}
                    onClick={() => setSelectedStyle(style)}
                    className={`px-2.5 py-1 rounded text-xs transition-colors whitespace-nowrap ${
                      selectedStyle === style 
                        ? 'bg-amber-400 text-slate-950 font-semibold' 
                        : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Apps Grid */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Showing {filteredApps.length} of {ENTERPRISE_APPS.length} apps</span>
            {(selectedCategory !== 'All' || selectedGenre !== 'All' || selectedStyle !== 'All' || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSelectedGenre('All');
                  setSelectedStyle('All');
                  setSearchQuery('');
                }}
                className="text-amber-400 hover:underline"
              >
                Reset filters
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredApps.map(app => (
              <div 
                key={app.id}
                className="bg-slate-950/80 border border-slate-800/90 rounded-xl p-4 hover:border-amber-500/40 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2.5">
                    <div className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0">
                      {renderIcon(app.iconName)}
                    </div>
                    <span className="text-[11px] font-mono text-slate-500">
                      {app.codename}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                    {app.name}
                  </h3>

                  {/* Clean unboxed metadata with typographic dot separators */}
                  <div className="flex items-center flex-wrap gap-1.5 text-[11px] text-slate-400 mt-1 mb-2">
                    <span>{app.category}</span>
                    <span aria-hidden="true" className="text-slate-600">·</span>
                    <span>{app.genre}</span>
                    <span aria-hidden="true" className="text-slate-600">·</span>
                    <span className="text-amber-400/90">{app.style}</span>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed mb-3 line-clamp-3">
                    {app.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-900 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-slate-400">
                    {app.stats}
                  </span>

                  <button
                    onClick={() => {
                      onSelectApp(app.launchTab);
                      onClose();
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 rounded-md border border-amber-500/30 transition-colors whitespace-nowrap"
                  >
                    <span>Launch</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredApps.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-sm text-slate-400">No apps match the selected category, genre, or style filter.</p>
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSelectedGenre('All');
                  setSelectedStyle('All');
                  setSearchQuery('');
                }}
                className="mt-3 px-3 py-1.5 text-xs text-amber-400 hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs text-slate-400">
          <span>Carlyluminatti AI Omni Core v2.4</span>
          <span className="font-mono text-slate-500">Autonomous Enterprise Protocol</span>
        </div>

      </div>
    </div>
  );
};

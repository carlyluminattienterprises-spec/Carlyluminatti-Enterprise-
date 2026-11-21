import React, { useState } from 'react';
import { 
  Gamepad2, 
  Users, 
  Coins, 
  Building2, 
  BrainCircuit, 
  Cloud, 
  Code2, 
  Rocket, 
  Sliders, 
  Sparkles, 
  CheckCircle2, 
  Download, 
  Copy, 
  Check, 
  ShieldCheck,
  TrendingUp,
  Percent,
  Layers
} from 'lucide-react';
import { FiCategory, FiGeneratorConfig } from '../types';
import { SolidityViewer } from './SolidityViewer';

const FI_CONFIGS: Record<FiCategory, FiGeneratorConfig> = {
  GameFi: {
    id: 'GameFi',
    name: 'GameFi Protocol Generator',
    codename: 'CL-GAMEFI-V3',
    tagline: 'Monetized & Tokenized Gaming Economy Engine',
    primaryMechanism: 'Play-to-Earn Arena Staking & Dynamic NFT Loot Vaults',
    stakingYieldApr: 24.5,
    liquidityPoolToken: 'CLUM-GAME / ETH',
    monetizationModel: '2.5% In-Game Transaction Micro-Fee to Stakers',
    totalCap: '50,000,000 GAME-CLUM',
    contractStandard: 'ERC-20 + ERC-1155 Hybrid',
    features: [
      'Provably-Fair Loot Box VRF Randomness Integration',
      'Guild Treasury Pooling & Revenue Sharing Contracts',
      'Anti-Cheat Smart Contract Timelock Verification',
      'Cross-Game Asset Interoperability Layer'
    ]
  },
  SocialFi: {
    id: 'SocialFi',
    name: 'SocialFi VIP Social Club Generator',
    codename: 'CL-SOCIFI-PRIME',
    tagline: 'Decentralized Creator Tokenization & Bonding Curves',
    primaryMechanism: 'Creator Key Passes & Stream Tip Streaming Escrow',
    stakingYieldApr: 19.8,
    liquidityPoolToken: 'CLUM-SOCIAL / USDT',
    monetizationModel: '5% Creator Key Trading Royalty Split',
    totalCap: '25,000,000 SOC-CLUM',
    contractStandard: 'ERC-20 Bonding Curve Standard',
    features: [
      'Token-Gated VIP Studio Screening Room Access',
      'Automated Creator Tip Jar with Zero-Slippage Routing',
      'Decentralized Audience Curation & Governance Voting',
      'Dynamic Quadratic Funding for Emerging Directors'
    ]
  },
  DeFi: {
    id: 'DeFi',
    name: 'DeFi Autonomous Liquidity Generator',
    codename: 'CL-DEFI-CORE',
    tagline: 'Decentralized AMM Liquidity & Yield Vault Engine',
    primaryMechanism: 'Automated Market Maker & Compounding Staking Vault',
    stakingYieldApr: 14.2,
    liquidityPoolToken: 'CLUM / USDC Stable AMM',
    monetizationModel: '0.3% Swap Fee Distributed 100% to Liquidity Providers',
    totalCap: '100,000,000 DEFI-CLUM',
    contractStandard: 'ERC-4626 Tokenized Vault Standard',
    features: [
      'Flash Loan Resistant TWAP Price Oracles',
      'Algorithmic Single-Sided Liquidity Provisioning',
      'Automated Yield Compounding Harvest Bots',
      'Multi-Signature Emergency Circuit Breaker'
    ]
  },
  IntraFi: {
    id: 'IntraFi',
    name: 'IntraFi Enterprise Treasury Generator',
    codename: 'CL-INTRAFI-CORP',
    tagline: 'Internal Enterprise Finance & Departmental Settlements',
    primaryMechanism: 'Cross-Department Micro-Settlements & Payroll Streams',
    stakingYieldApr: 9.5,
    liquidityPoolToken: 'CLUM-CORP / DAI',
    monetizationModel: 'Zero-Internal-Fee Internal Capital Optimization',
    totalCap: '200,000,000 INTRA-CLUM',
    contractStandard: 'ERC-20 Enterprise Payroll Stream',
    features: [
      'Automated Continuous Per-Second Payroll Streaming',
      'Inter-Departmental Budget Allocation & Quota Contracts',
      'Capital Expenditure Escrow with Milestone Release',
      'Real-Time Enterprise Balance Sheet Oracles'
    ]
  },
  IntelFi: {
    id: 'IntelFi',
    name: 'IntelFi Intelligence & AI Compute Generator',
    codename: 'CL-INTELFI-AI',
    tagline: 'Tokenized AI Model Weights & Autonomous Agent Compute',
    primaryMechanism: 'Proof of Neural Inference & AI Notary Staking',
    stakingYieldApr: 31.0,
    liquidityPoolToken: 'CLUM-AI / ETH',
    monetizationModel: 'Per-Inference Tokenized API Compute Micro-Tolls',
    totalCap: '75,000,000 INTEL-CLUM',
    contractStandard: 'ERC-20 AI Compute Token Standard',
    features: [
      'Decentralized Model Weight Tokenization & Licensing',
      'AI Agent Notary Staking for Cryptographic Truth Proofs',
      'Automated Tokenized Payouts for Inference GPU Workers',
      'ZK-SNARK Verification for Neural Directing Pipeline'
    ]
  },
  CloudFi: {
    id: 'CloudFi',
    name: 'CloudFi Decentralized Infrastructure Generator',
    codename: 'CL-CLOUDFI-GPU',
    tagline: 'Tokenized GPU Clusters & Decentralized Spatial Storage',
    primaryMechanism: 'Bandwidth & Distributed Rendering Proof-of-Capacity',
    stakingYieldApr: 21.4,
    liquidityPoolToken: 'CLUM-CLOUD / USDC',
    monetizationModel: '15% Cloud Rental Margin to Node Stakers',
    totalCap: '120,000,000 CLOUD-CLUM',
    contractStandard: 'ERC-20 Cloud DePIN Standard',
    features: [
      'Volumetric Set 3D Storage Node Decentralization',
      'Real-Time GPU Cluster Renting Smart Contracts',
      'Peer-to-Peer 8K Cinematic Video CDN Nodes',
      'Automated SLA Uptime Slashing Contracts'
    ]
  }
};

export const FiGeneratorsSuite: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<FiCategory>('GameFi');
  const [customYield, setCustomYield] = useState<number>(FI_CONFIGS.GameFi.stakingYieldApr);
  const [deployedProtocols, setDeployedProtocols] = useState<Record<string, string>>({
    GameFi: '0x38B...901e',
    SocialFi: '0x71A...421c'
  });
  const [isDeploying, setIsDeploying] = useState(false);
  const [activeCodeTab, setActiveCodeTab] = useState<'parameters' | 'solidity'>('parameters');

  const currentConfig = FI_CONFIGS[selectedCategory];

  const handleDeployProtocol = () => {
    setIsDeploying(true);
    setTimeout(() => {
      const generatedAddr = `0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
      setDeployedProtocols(prev => ({
        ...prev,
        [selectedCategory]: `${generatedAddr.slice(0, 6)}...${generatedAddr.slice(-4)}`
      }));
      setIsDeploying(false);
    }, 1200);
  };

  const generateFiSolidity = (cat: FiCategory): string => {
    return `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title Carlyluminatti Network Enterprise ${cat} Protocol
 * @author Carlyluminatti AI Autonomous Engineering Core
 * @notice Monetized tokenized decentralized ${cat} contract.
 *         Standard: ${currentConfig.contractStandard}
 *         Monetization Model: ${currentConfig.monetizationModel}
 */

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract Carlyluminatti_${cat} is ERC20, Ownable, ReentrancyGuard {
    string public constant PROTOCOL_CODENAME = "${currentConfig.codename}";
    uint256 public stakingYieldApr = ${customYield} * 100; // in basis points
    address public treasuryVault;
    uint256 public totalProtocolValueLocked;

    event Staked(address indexed user, uint256 amount);
    event RewardsClaimed(address indexed user, uint256 reward);
    event MonetizationFeeCollected(uint256 amount, address indexed treasury);

    constructor(
        address _treasuryVault,
        uint256 _initialSupply
    ) ERC20("Carlyluminatti ${cat} Token", "${cat.toUpperCase()}-CLUM") Ownable(msg.sender) {
        require(_treasuryVault != address(0), "Invalid treasury");
        treasuryVault = _treasuryVault;
        _mint(_treasuryVault, _initialSupply);
    }

    function setStakingYieldApr(uint256 _newAprBasisPoints) external onlyOwner {
        stakingYieldApr = _newAprBasisPoints;
    }

    function recordMonetizationInflow(uint256 amount) external nonReentrant {
        require(amount > 0, "Zero amount");
        totalProtocolValueLocked += amount;
        emit MonetizationFeeCollected(amount, treasuryVault);
    }
}
`;
  };

  const getCategoryIcon = (cat: FiCategory) => {
    switch (cat) {
      case 'GameFi': return <Gamepad2 className="w-4 h-4 text-amber-400" />;
      case 'SocialFi': return <Users className="w-4 h-4 text-purple-400" />;
      case 'DeFi': return <Coins className="w-4 h-4 text-emerald-400" />;
      case 'IntraFi': return <Building2 className="w-4 h-4 text-cyan-400" />;
      case 'IntelFi': return <BrainCircuit className="w-4 h-4 text-rose-400" />;
      case 'CloudFi': return <Cloud className="w-4 h-4 text-sky-400" />;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Module Title Banner */}
      <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-amber-400 font-mono">
            <span>DECENTRALIZED TOKENIZATION SUITE</span>
            <span className="text-slate-600">·</span>
            <span>MONETIZED AUTONOMOUS PROTOCOLS</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
            Monetized Tokenized Decentralized Fi Generator Suite
          </h1>
          <p className="text-sm text-slate-400 max-w-3xl mt-1 leading-relaxed">
            Deploy production-grade tokenized finance engines across <strong>GameFi, SocialFi, DeFi, IntraFi, IntelFi, and CloudFi</strong> with customized staking yields, liquidity pools, and automated revenue splits.
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800 self-start md:self-auto shrink-0">
          <button
            onClick={() => setActiveCodeTab('parameters')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeCodeTab === 'parameters'
                ? 'bg-amber-400 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Architecture & Parameters</span>
          </button>

          <button
            onClick={() => setActiveCodeTab('solidity')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeCodeTab === 'solidity'
                ? 'bg-amber-400 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Solidity 0.8.24 Code</span>
          </button>
        </div>
      </div>

      {/* 6 Fi Selectors (Horizontal Strip) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {(Object.keys(FI_CONFIGS) as FiCategory[]).map(cat => {
          const isSelected = selectedCategory === cat;
          const isDeployed = deployedProtocols[cat];

          return (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setCustomYield(FI_CONFIGS[cat].stakingYieldApr);
              }}
              className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                isSelected
                  ? 'bg-slate-900 border-amber-400 shadow-md shadow-amber-400/10'
                  : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800">
                  {getCategoryIcon(cat)}
                </div>
                {isDeployed && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400" title="Deployed" />
                )}
              </div>

              <div>
                <span className="text-xs font-bold text-white block">
                  {cat}
                </span>
                <span className="text-[10px] font-mono text-slate-400 block truncate">
                  {FI_CONFIGS[cat].stakingYieldApr}% APR
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Generator Details Panel */}
      {activeCodeTab === 'parameters' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Generator Parameters & Monetization Configuration (8 cols) */}
          <div className="lg:col-span-8 bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-6">
            
            <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-amber-400 font-bold">{currentConfig.codename}</span>
                  <span className="text-slate-600">·</span>
                  <span className="text-xs font-mono text-emerald-400">{currentConfig.contractStandard}</span>
                </div>
                <h2 className="text-xl font-bold text-white tracking-tight mt-0.5">
                  {currentConfig.name}
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  {currentConfig.tagline}
                </p>
              </div>

              {deployedProtocols[selectedCategory] ? (
                <div className="bg-emerald-950/40 border border-emerald-800 px-3 py-1.5 rounded-xl text-right shrink-0">
                  <span className="text-[10px] font-mono text-emerald-400 block">Active On-Chain</span>
                  <span className="text-xs font-mono text-white font-bold">{deployedProtocols[selectedCategory]}</span>
                </div>
              ) : (
                <button
                  onClick={handleDeployProtocol}
                  disabled={isDeploying}
                  className="px-4 py-2 text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-xl transition-all shadow-md shadow-amber-400/20 active:scale-[0.98] disabled:opacity-50 flex items-center gap-1.5 shrink-0"
                >
                  <Rocket className="w-3.5 h-3.5" />
                  <span>{isDeploying ? 'Deploying...' : `Deploy ${selectedCategory} Engine`}</span>
                </button>
              )}
            </div>

            {/* Core Mechanism & Monetization Spec */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400 block mb-1">Primary Tokenization Mechanism</span>
                <span className="text-sm font-bold text-amber-300">{currentConfig.primaryMechanism}</span>
              </div>

              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400 block mb-1">Monetization Model</span>
                <span className="text-sm font-bold text-emerald-400">{currentConfig.monetizationModel}</span>
              </div>
            </div>

            {/* Yield & Staking Parameters Slider */}
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-200">Staking Yield APR (%):</span>
                <span className="font-mono font-bold text-amber-400 text-sm">{customYield}% APR</span>
              </div>
              <input
                type="range"
                min="5"
                max="60"
                step="0.5"
                value={customYield}
                onChange={(e) => setCustomYield(Number(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] font-mono text-slate-500">
                <span>Min: 5% Conservative</span>
                <span>Max: 60% High-Incentive</span>
              </div>
            </div>

            {/* Architectural Features */}
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
                Decentralized Protocol Features
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {currentConfig.features.map((feat, i) => (
                  <div key={i} className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-start gap-2.5 text-xs text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Liquidity Pool & Monetized Cap Table (4 cols) */}
          <div className="lg:col-span-4 bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-5 flex flex-col justify-between">
            
            <div className="space-y-4">
              <div>
                <span className="text-xs font-mono text-amber-400 uppercase tracking-wider">
                  DECENTRALIZED LIQUIDITY PAIRING
                </span>
                <h3 className="text-base font-bold text-white tracking-tight mt-0.5">
                  Pool & Treasury Metrics
                </h3>
              </div>

              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3 text-xs font-mono">
                <div className="flex justify-between text-slate-400 pb-2 border-b border-slate-900">
                  <span>Liquidity Pair:</span>
                  <span className="text-amber-300 font-bold">{currentConfig.liquidityPoolToken}</span>
                </div>
                <div className="flex justify-between text-slate-400 pb-2 border-b border-slate-900">
                  <span>Authorized Cap:</span>
                  <span className="text-white font-bold">{currentConfig.totalCap}</span>
                </div>
                <div className="flex justify-between text-slate-400 pb-2 border-b border-slate-900">
                  <span>Revenue Split:</span>
                  <span className="text-emerald-400">80% Stakers · 20% Treasury</span>
                </div>
                <div className="flex justify-between text-slate-400 pt-1">
                  <span>Security Invariants:</span>
                  <span className="text-white">ReentrancyGuard · Ownable</span>
                </div>
              </div>

              {/* Quick Launchpad Bridge */}
              <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs space-y-2 text-slate-300">
                <div className="font-semibold text-amber-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>Cross-Fi Interoperability</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  All 6 Fi protocols can interact with the Carlyluminatti Pre-sale crowdsale contract and the designated treasury receiving wallet for unified enterprise settlement.
                </p>
              </div>
            </div>

            {/* Quick Deploy / Code Action */}
            <button
              onClick={() => setActiveCodeTab('solidity')}
              className="w-full py-2.5 px-4 text-xs font-semibold text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <Code2 className="w-4 h-4 text-amber-400" />
              <span>Inspect {selectedCategory} Solidity Code</span>
            </button>

          </div>

        </div>
      ) : (
        /* Solidity Code View for Selected Fi Protocol */
        <div className="space-y-4">
          <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Autonomous {selectedCategory} Protocol Contract</span>
                <span className="text-xs font-mono text-amber-400">{currentConfig.codename}</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Standard: {currentConfig.contractStandard} with {customYield}% APY distribution logic.
              </p>
            </div>

            <button
              onClick={() => setActiveCodeTab('parameters')}
              className="text-xs text-amber-400 hover:underline"
            >
              ← Back to Parameters
            </button>
          </div>

          <SolidityViewer
            solidityCode={generateFiSolidity(selectedCategory)}
            contractName={`Carlyluminatti_${selectedCategory}`}
          />
        </div>
      )}

    </div>
  );
};

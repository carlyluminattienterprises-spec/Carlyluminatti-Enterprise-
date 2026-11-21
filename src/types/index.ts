export type AppCategory = 
  | 'All'
  | 'Media & Entertainment'
  | 'Crypto & Tokenomics'
  | 'Legal & AI Notary'
  | 'Studioverse Social Club'
  | 'Smart Contracts & Launchpad'
  | 'FinTech & Treasury';

export type AppGenre = 
  | 'All'
  | 'Cyberpunk Cinema'
  | 'Spatial Audio & Royalties'
  | 'Decentralized Crowdsales'
  | 'Autonomous AI Enterprise'
  | 'Metaverse Virtual Production'
  | 'Cryptographic Security';

export type AppStyle = 
  | 'All'
  | 'Obsidian Cyberpunk'
  | 'High-Frequency Institutional'
  | 'Hollywood Production Matrix'
  | 'Cryptographic Sovereign'
  | 'Studioverse Luxury';

export interface EnterpriseApp {
  id: string;
  name: string;
  codename: string;
  category: Exclude<AppCategory, 'All'>;
  genre: Exclude<AppGenre, 'All'>;
  style: Exclude<AppStyle, 'All'>;
  description: string;
  iconName: string;
  status: 'Production' | 'Live Alpha' | 'Autonomous' | 'Audited';
  stats: string;
  launchTab: string;
}

export type PaymentMethod = 'ETH' | 'USDT' | 'USDC';

export interface PresaleParameters {
  tokenName: string;
  tokenSymbol: string;
  tokenDecimals: number;
  totalSupply: number;
  presaleAllocation: number;
  softCap: number; // in ETH (minimum threshold)
  hardCap: number; // in ETH (maximum fundraising ceiling)
  tokenRate: number; // tokens per 1 ETH
  listingRate: number; // tokens per 1 ETH on Uniswap / DEX
  minContribution: number; // in ETH
  maxContribution: number; // in ETH
  acceptedPayments: PaymentMethod[];
  receivingWallet: string; // The selected wallet to receive investments
  distributionMode: 'Immediate' | 'ClaimAfterSale';
  saleStartTime: string; // ISO string
  saleEndTime: string; // ISO string
  cliffDays: number;
  vestingMonths: number;
  initialUnlockPercent: number;
  isDeployed: boolean;
  contractAddress?: string;
  deploymentTx?: string;
  // Manage Token Sale Functions State
  tokensDepositedToContract: number; // Amount of ERC-20 tokens deposited into presale contract
  isFundedWithTokens: boolean;
  fundsWithdrawn: boolean;
  withdrawnAmount: number;
  shareUrl: string;
}

export interface InvestorSession {
  isWalletConnected: boolean;
  walletAddress: string;
  walletBalanceEth: number;
  investedAmountEth: number;
  tokensPurchased: number;
  tokensRedeemed: number;
}

export interface ARMarketplaceAsset {
  id: string;
  title: string;
  category: 'Volumetric Set' | 'Spatial Audio Stem' | 'AI Director Hologram' | 'Cinematic Box Office Stream';
  tokenValue: string;
  arStatus: 'Ready in AR Cockpit' | 'Rendering Volumetric' | 'Live Spatial Stream';
  hologramColor: string;
  description: string;
}

export type FiCategory = 'GameFi' | 'SocialFi' | 'DeFi' | 'IntraFi' | 'IntelFi' | 'CloudFi';

export interface FiGeneratorConfig {
  id: FiCategory;
  name: string;
  codename: string;
  tagline: string;
  primaryMechanism: string;
  stakingYieldApr: number; // e.g. 18.5%
  liquidityPoolToken: string;
  monetizationModel: string;
  totalCap: string;
  contractStandard: string;
  features: string[];
}

export interface BuyerInvestment {
  id: string;
  buyerAddress: string;
  paymentMethod: PaymentMethod;
  amountPaid: number;
  tokensAllocated: number;
  timestamp: string;
  txHash: string;
  distributionStatus: 'Distributed' | 'Pending Claim' | 'Refunded';
}

export interface CopyrightAsset {
  id: string;
  title: string;
  mediaType: 'Cinema & Feature Film' | 'Studio Stems & Master Track' | '3D Studioverse Asset' | 'AI Script & Lore Engine';
  creatorAgent: string;
  registrationDate: string;
  licenseType: 'Commercial Enterprise Syndicate' | 'Exclusive Web3 Sync' | 'Royalty Splitter Standard' | 'Universal Studioverse License';
  royaltySplit: {
    treasuryPercent: number;
    creatorPercent: number;
    communityPoolPercent: number;
  };
  hashDigest: string;
  notarized: boolean;
}

export interface NotaryAuditReport {
  id: string;
  targetName: string;
  targetType: 'Smart Contract' | 'Presale Parameters' | 'Copyright License';
  timestamp: string;
  status: 'PASSED' | 'WARNING' | 'FAILED';
  sha256Proof: string;
  notaryAgentName: string;
  invariantsChecked: {
    name: string;
    description: string;
    passed: boolean;
  }[];
  verdict: string;
}

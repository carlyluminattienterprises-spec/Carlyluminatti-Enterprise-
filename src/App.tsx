import React, { useState } from 'react';
import { Header } from './components/Header';
import { OmniSmartDrawer } from './components/OmniSmartDrawer';
import { StudioverseHub } from './components/StudioverseHub';
import { PresaleLaunchpad } from './components/PresaleLaunchpad';
import { PaymentsAndDistribution } from './components/PaymentsAndDistribution';
import { InvestorPresalePortal } from './components/InvestorPresalePortal';
import { ARMICockpit } from './components/ARMICockpit';
import { FiGeneratorsSuite } from './components/FiGeneratorsSuite';
import { AIAgentNotary } from './components/AIAgentNotary';
import { CopyrightLicensing } from './components/CopyrightLicensing';
import { ManageTokenSaleModal } from './components/ManageTokenSaleModal';
import { EmbedCodeModal } from './components/EmbedCodeModal';
import { ShareInvestorModal } from './components/ShareInvestorModal';
import { GitHubUpdateModal } from './components/GitHubUpdateModal';
import { DashboardTab } from './components/DashboardTab';
import { ChromeStoreModal } from './components/ChromeStoreModal';
import { PresaleParameters, BuyerInvestment, PaymentMethod } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('studioverse-hub');
  const [isOmniDrawerOpen, setIsOmniDrawerOpen] = useState<boolean>(false);
  const [network, setNetwork] = useState<'Ethereum Mainnet' | 'Sepolia Testnet'>('Ethereum Mainnet');

  // Modals state
  const [isManageSaleOpen, setIsManageSaleOpen] = useState<boolean>(false);
  const [isEmbedModalOpen, setIsEmbedModalOpen] = useState<boolean>(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [isGitHubModalOpen, setIsGitHubModalOpen] = useState<boolean>(false);
  const [isChromeModalOpen, setIsChromeModalOpen] = useState<boolean>(false);

  // Initial Presale Parameters
  const [parameters, setParameters] = useState<PresaleParameters>(() => {
    const now = Date.now();
    const startTime = new Date(now + 25 * 60 * 1000).toISOString();
    const endTime = new Date(now + 7 * 24 * 60 * 60 * 1000).toISOString();

    return {
      tokenName: 'Carlyluminatti Studio Token',
      tokenSymbol: 'CLUM',
      tokenDecimals: 18,
      totalSupply: 100000000,
      presaleAllocation: 25000000,
      softCap: 15.0, // in ETH
      hardCap: 50.0, // in ETH
      tokenRate: 10000, // 10,000 CLUM per 1 ETH
      listingRate: 7500, // 7,500 CLUM per 1 ETH
      minContribution: 0.1,
      maxContribution: 5.0,
      acceptedPayments: ['ETH', 'USDT', 'USDC'],
      receivingWallet: '0x71C948A71295D20C4F67aEb5f8C96120E2C6849A',
      distributionMode: 'Immediate',
      saleStartTime: startTime,
      saleEndTime: endTime,
      cliffDays: 0,
      vestingMonths: 0,
      initialUnlockPercent: 100,
      isDeployed: true,
      contractAddress: '0x892af41ed38B291cB8791094cF928e71c991a0D4',
      deploymentTx: '0x4a91fbc8291048bcde2918401824719037418290381029841029831902839102',
      tokensDepositedToContract: 25000000,
      isFundedWithTokens: true,
      fundsWithdrawn: false,
      withdrawnAmount: 0,
      shareUrl: 'https://carlyluminatti.network/presale/0x892af41ed38B291cB8791094cF928e71c991a0D4'
    };
  });

  // Buyer Investments Ledger
  const [investments, setInvestments] = useState<BuyerInvestment[]>([
    {
      id: 'inv-101',
      buyerAddress: '0x3F28...98B1',
      paymentMethod: 'ETH',
      amountPaid: 2.5,
      tokensAllocated: 25000,
      timestamp: '09:42 AM',
      txHash: '0x7b1c4091a0823901bca90f4e81c9a0f4e81c9a0f4e81c9a0f4e81c9a0f4e81c9',
      distributionStatus: 'Distributed'
    },
    {
      id: 'inv-102',
      buyerAddress: '0x88D1...440C',
      paymentMethod: 'USDT',
      amountPaid: 6000,
      tokensAllocated: 20000,
      timestamp: '10:04 AM',
      txHash: '0x12ac98301beaf891029381029841029831902839102839018239018293018293',
      distributionStatus: 'Distributed'
    },
    {
      id: 'inv-103',
      buyerAddress: '0x99A4...31E9',
      paymentMethod: 'ETH',
      amountPaid: 1.0,
      tokensAllocated: 10000,
      timestamp: '10:11 AM',
      txHash: '0x98102938102984102983190283910283901823901829301829312ac98301beaf',
      distributionStatus: 'Pending Claim'
    }
  ]);

  // Compute total raised ETH
  const totalEthRaised = investments.reduce((acc, curr) => {
    if (curr.distributionStatus === 'Refunded') return acc;
    if (curr.paymentMethod === 'ETH') return acc + curr.amountPaid;
    return acc + (curr.amountPaid / 3000);
  }, 0);

  const handleAddInvestment = (newInvestment: BuyerInvestment) => {
    setInvestments(prev => [newInvestment, ...prev]);
  };

  const handleNewInvestorPortalInvestment = (amountEth: number, tokens: number, method: PaymentMethod) => {
    const tx = `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
    const newInv: BuyerInvestment = {
      id: `inv-${Date.now()}`,
      buyerAddress: '0x3F28...98B1',
      paymentMethod: method,
      amountPaid: amountEth,
      tokensAllocated: tokens,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      txHash: tx,
      distributionStatus: 'Distributed'
    };
    handleAddInvestment(newInv);
  };

  const handleBatchDistribute = () => {
    setInvestments(prev =>
      prev.map(item => ({
        ...item,
        distributionStatus: 'Distributed'
      }))
    );
  };

  const handleSingleDistribute = (id: string) => {
    setInvestments(prev =>
      prev.map(item =>
        item.id === id ? { ...item, distributionStatus: 'Distributed' } : item
      )
    );
  };

  const handleTriggerEmergencyRefund = () => {
    setInvestments(prev =>
      prev.map(item => ({
        ...item,
        distributionStatus: 'Refunded'
      }))
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-400 selection:text-slate-950">
      
      {/* Enterprise Top Navigation Bar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        openOmniDrawer={() => setIsOmniDrawerOpen(true)}
        openChromeModal={() => setIsChromeModalOpen(true)}
        presaleDeployed={parameters.isDeployed}
        network={network}
        setNetwork={setNetwork}
      />

      {/* Carlyluminatti AI Omni Smart Drawer */}
      <OmniSmartDrawer
        isOpen={isOmniDrawerOpen}
        onClose={() => setIsOmniDrawerOpen(false)}
        onSelectApp={(targetTab) => {
          setActiveTab(targetTab);
          setIsOmniDrawerOpen(false);
        }}
      />

      {/* Modals Suite */}
      <ManageTokenSaleModal
        isOpen={isManageSaleOpen}
        onClose={() => setIsManageSaleOpen(false)}
        parameters={parameters}
        onUpdateParameters={(updated) => setParameters(updated)}
        onOpenInvestorPortal={() => setActiveTab('investor-portal')}
        onOpenEmbedModal={() => setIsEmbedModalOpen(true)}
        onOpenShareModal={() => setIsShareModalOpen(true)}
        onOpenGitHubModal={() => setIsGitHubModalOpen(true)}
        totalEthRaised={totalEthRaised}
      />

      <EmbedCodeModal
        isOpen={isEmbedModalOpen}
        onClose={() => setIsEmbedModalOpen(false)}
        contractAddress={parameters.contractAddress || '0x892af41ed38B291cB8791094cF928e71c991a0D4'}
      />

      <ShareInvestorModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        parameters={parameters}
      />

      <GitHubUpdateModal
        isOpen={isGitHubModalOpen}
        onClose={() => setIsGitHubModalOpen(false)}
        parameters={parameters}
      />

      <ChromeStoreModal
        isOpen={isChromeModalOpen}
        onClose={() => setIsChromeModalOpen(false)}
        parameters={parameters}
        totalEthRaised={totalEthRaised}
      />

      {/* Main Viewport Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6">
        {activeTab === 'studioverse-hub' && (
          <StudioverseHub
            onNavigate={(tab) => setActiveTab(tab)}
            openOmniDrawer={() => setIsOmniDrawerOpen(true)}
          />
        )}

        {activeTab === 'dashboard' && (
          <DashboardTab
            parameters={parameters}
            investments={investments}
            onAddSimulatedInvestment={(method, amount) => {
              const ethEquivalent = method === 'ETH' ? amount : (amount / 3000);
              const tokens = Math.floor(ethEquivalent * parameters.tokenRate);
              const tx = `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
              const newInv: BuyerInvestment = {
                id: `inv-${Date.now()}`,
                buyerAddress: `0x${Array.from({ length: 4 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}...${Array.from({ length: 4 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
                paymentMethod: method,
                amountPaid: amount,
                tokensAllocated: tokens,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                txHash: tx,
                distributionStatus: 'Distributed'
              };
              handleAddInvestment(newInv);
            }}
            onOpenChromeModal={() => setIsChromeModalOpen(true)}
            onNavigateToLaunchpad={() => setActiveTab('presale-launchpad')}
          />
        )}

        {activeTab === 'presale-launchpad' && (
          <PresaleLaunchpad
            parameters={parameters}
            onUpdateParameters={(updated) => setParameters(updated)}
            onNavigateToPayments={() => setActiveTab('payments-distribution')}
            network={network}
          />
        )}

        {activeTab === 'fi-generators' && (
          <FiGeneratorsSuite />
        )}

        {activeTab === 'investor-portal' && (
          <InvestorPresalePortal
            parameters={parameters}
            onOpenARCockpit={() => setActiveTab('ar-cockpit')}
            onOpenEmbedModal={() => setIsEmbedModalOpen(true)}
            onOpenShareModal={() => setIsShareModalOpen(true)}
            onOpenGitHubModal={() => setIsGitHubModalOpen(true)}
            onOpenManageSale={() => setIsManageSaleOpen(true)}
            totalEthRaised={totalEthRaised}
            onNewInvestment={handleNewInvestorPortalInvestment}
          />
        )}

        {activeTab === 'ar-cockpit' && (
          <ARMICockpit
            onBackToPresale={() => setActiveTab('presale-launchpad')}
            onOpenInvestorPortal={() => setActiveTab('investor-portal')}
            tokenSymbol={parameters.tokenSymbol}
          />
        )}

        {activeTab === 'payments-distribution' && (
          <PaymentsAndDistribution
            parameters={parameters}
            investments={investments}
            onAddInvestment={handleAddInvestment}
            onBatchDistribute={handleBatchDistribute}
            onSingleDistribute={handleSingleDistribute}
            onTriggerEmergencyRefund={handleTriggerEmergencyRefund}
            network={network}
          />
        )}

        {activeTab === 'ai-notary' && (
          <AIAgentNotary parameters={parameters} />
        )}

        {activeTab === 'copyright-licensing' && (
          <CopyrightLicensing />
        )}
      </main>

      {/* Enterprise Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 px-4 lg:px-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-300">Carlyluminatti Network Enterprise</span>
            <span>·</span>
            <span>1st 100% AI-Operated Crypto Empire Studioverse</span>
          </div>

          <div className="flex items-center gap-4 font-mono text-[11px] text-slate-500">
            <span>Bitbond Token Tools Protocol</span>
            <span>·</span>
            <span>GameFi / SocialFi / DeFi / IntraFi / IntelFi / CloudFi</span>
            <span>·</span>
            <span>© 2026 Carlyluminatti All Rights Reserved</span>
          </div>
        </div>
      </footer>

    </div>
  );
}

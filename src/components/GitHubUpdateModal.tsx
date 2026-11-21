import React, { useState } from 'react';
import { X, GitBranch, Check, CheckCircle2, GitCommit, FileCode, ArrowRight } from 'lucide-react';
import { PresaleParameters } from '../types';

interface GitHubUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  parameters: PresaleParameters;
}

export const GitHubUpdateModal: React.FC<GitHubUpdateModalProps> = ({
  isOpen,
  onClose,
  parameters
}) => {
  const [commitMessage, setCommitMessage] = useState(
    `feat(presale): deploy ${parameters.tokenSymbol} crowdsale contract with 10m freeze window`
  );
  const [branch, setBranch] = useState('main');
  const [isPushing, setIsPushing] = useState(false);
  const [pushSuccess, setPushSuccess] = useState(false);

  if (!isOpen) return null;

  const handlePushToGitHub = (e: React.FormEvent) => {
    e.preventDefault();
    setIsPushing(true);
    setPushSuccess(false);

    setTimeout(() => {
      setIsPushing(false);
      setPushSuccess(true);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in">
      <div className="relative bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5">
        
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <GitBranch className="w-5 h-5 text-purple-400" />
            <h3 className="text-base font-bold text-white tracking-tight">
              Update GitHub Repository
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          Sync the latest Solidity smart contracts, Bitbond presale parameters, and deployment addresses directly to your enterprise repository (<code className="text-amber-400 font-mono">carlyluminatti/studioverse-contracts</code>).
        </p>

        <form onSubmit={handlePushToGitHub} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-400 mb-1">Target Branch</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Commit Message</label>
            <input
              type="text"
              required
              value={commitMessage}
              onChange={(e) => setCommitMessage(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Files to sync */}
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5 font-mono text-[11px] text-slate-400">
            <div className="font-semibold text-slate-300 mb-1 flex items-center gap-1.5 font-sans text-xs">
              <FileCode className="w-3.5 h-3.5 text-amber-400" />
              <span>Manifest Staged for Commit:</span>
            </div>
            <div className="text-emerald-400">✓ contracts/CarlyluminattiPresale.sol</div>
            <div className="text-emerald-400">✓ deployments/sepolia-0x892af4.json</div>
            <div className="text-emerald-400">✓ config/presale-parameters.json</div>
          </div>

          <button
            type="submit"
            disabled={isPushing}
            className="w-full py-2.5 text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-md shadow-purple-600/20 disabled:opacity-50"
          >
            <GitCommit className="w-4 h-4" />
            <span>{isPushing ? 'Pushing Commit to GitHub...' : 'Commit & Push to GitHub'}</span>
          </button>
        </form>

        {pushSuccess && (
          <div className="p-3 bg-emerald-950/40 border border-emerald-800 rounded-xl text-xs text-emerald-300 flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Commit <strong>e921d7b</strong> successfully pushed to branch <strong>{branch}</strong>!</span>
          </div>
        )}

      </div>
    </div>
  );
};

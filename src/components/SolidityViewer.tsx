import React, { useState } from 'react';
import { Copy, Check, Download, FileCode, Cpu } from 'lucide-react';

interface SolidityViewerProps {
  solidityCode: string;
  contractName: string;
}

export const SolidityViewer: React.FC<SolidityViewerProps> = ({
  solidityCode,
  contractName
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(solidityCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([solidityCode], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${contractName}.sol`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const lines = solidityCode.split('\n');

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden flex flex-col">
      {/* Code Header Bar */}
      <div className="px-4 py-3 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <FileCode className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-mono font-semibold text-slate-200">
            {contractName}.sol
          </span>
          <span className="text-slate-600">·</span>
          <span className="text-[11px] font-mono text-emerald-400">Solidity 0.8.24</span>
          <span className="text-slate-600">·</span>
          <span className="text-[11px] text-slate-400">Bitbond Launchpad Compatible</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-400">
            <Cpu className="w-3 h-3 text-cyan-400" />
            <span>Est. Gas: ~1,842,500</span>
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded transition-colors"
            title="Copy Solidity Code"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded transition-colors"
            title="Download .sol File"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Code Viewer Body */}
      <div className="p-4 font-mono text-xs overflow-x-auto max-h-[520px] select-text">
        <table className="w-full border-collapse">
          <tbody>
            {lines.map((line, idx) => (
              <tr key={idx} className="hover:bg-slate-900/50 leading-relaxed">
                <td className="pr-4 py-0.5 text-right text-slate-600 select-none w-10 text-[11px] font-mono">
                  {idx + 1}
                </td>
                <td className="py-0.5 whitespace-pre font-mono text-slate-300">
                  {line.startsWith('//') || line.startsWith(' *') || line.startsWith('/**') || line.startsWith(' */') ? (
                    <span className="text-slate-500 italic">{line}</span>
                  ) : line.includes('contract ') || line.includes('pragma ') || line.includes('import ') ? (
                    <span className="text-amber-400 font-semibold">{line}</span>
                  ) : line.includes('function ') || line.includes('modifier ') || line.includes('event ') ? (
                    <span className="text-cyan-400">{line}</span>
                  ) : line.includes('require(') ? (
                    <span className="text-rose-300/90">{line}</span>
                  ) : line.includes('onlyBeforeLockWindow') || line.includes('EDIT_LOCK_WINDOW') ? (
                    <span className="text-amber-300 font-semibold">{line}</span>
                  ) : (
                    line
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

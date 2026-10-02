import React, { useState } from 'react';
import { Copy, Check, FileCode, ExternalLink, Download } from 'lucide-react';
import { AndroidProjectFile } from '../../types/task';
import { downloadAndroidProjectZip } from '../../utils/exportZip';

interface Props {
  file: AndroidProjectFile;
}

export const CodeViewer: React.FC<Props> = ({ file }) => {
  const [copied, setCopied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(file.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleExportZip = async () => {
    setIsExporting(true);
    try {
      await downloadAndroidProjectZip();
    } finally {
      setIsExporting(false);
    }
  };

  const lines = file.content.split('\n');

  return (
    <div className="flex flex-col h-full bg-[#0e1219] text-slate-200 overflow-hidden">
      {/* Top File Bar */}
      <div className="px-4 py-3 bg-[#141923] border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20 shrink-0">
            <FileCode className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-white truncate">
                {file.name}
              </span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                {file.language}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 truncate mt-0.5">
              {file.path}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1e2533] hover:bg-[#273042] text-slate-200 hover:text-white border border-slate-700/80 rounded-lg text-xs font-medium transition-colors shadow-xs"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>Copy File</span>
              </>
            )}
          </button>

          <button
            onClick={handleExportZip}
            disabled={isExporting}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors shadow-sm disabled:opacity-50"
            title="Download full project as ready-to-open Android Studio .zip"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isExporting ? 'Generating...' : 'Export .ZIP'}</span>
          </button>
        </div>
      </div>

      {/* Description banner if present */}
      {file.description && (
        <div className="px-4 py-2 bg-blue-950/20 border-b border-blue-900/30 text-[11px] text-blue-300 flex items-center justify-between">
          <span>{file.description}</span>
          <span className="text-slate-500 font-mono text-[10px]">
            {lines.length} lines
          </span>
        </div>
      )}

      {/* Code Text with Line Numbers */}
      <div className="flex-1 overflow-auto font-mono text-xs leading-relaxed p-4 bg-[#0d1117] selection:bg-blue-500/30">
        <table className="w-full border-collapse">
          <tbody>
            {lines.map((line, idx) => (
              <tr key={idx} className="hover:bg-slate-800/40">
                <td className="w-10 pr-4 text-right text-slate-600 select-none align-top text-[11px]">
                  {idx + 1}
                </td>
                <td className="text-slate-200 whitespace-pre align-top break-all font-mono">
                  {line}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

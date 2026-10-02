import React, { useState } from 'react';
import {
  FileCode,
  FileText,
  Search,
  FolderOpen,
  Folder,
  Layers,
  Database,
  Bell,
  Palette,
  FileCheck
} from 'lucide-react';
import { AndroidProjectFile } from '../../types/task';

interface Props {
  files: AndroidProjectFile[];
  activeFile: AndroidProjectFile;
  onSelectFile: (file: AndroidProjectFile) => void;
}

export const ProjectFileTree: React.FC<Props> = ({
  files,
  activeFile,
  onSelectFile
}) => {
  const [search, setSearch] = useState('');

  const categories = [
    { key: 'build', label: 'Build & Gradle', icon: Layers },
    { key: 'manifest', label: 'Manifest & App', icon: FileCheck },
    { key: 'data', label: 'Room Database & Model', icon: Database },
    { key: 'notification', label: 'Alarm & Notification', icon: Bell },
    { key: 'ui', label: 'Jetpack Compose UI', icon: Palette },
    { key: 'docs', label: 'Documentation', icon: FileText }
  ] as const;

  const filtered = files.filter(
    (f) =>
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.path.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-[#11141c] border-r border-slate-800 text-slate-300">
      {/* Search Header */}
      <div className="p-3 border-b border-slate-800">
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter files..."
            className="w-full bg-[#181d28] text-xs text-slate-200 placeholder:text-slate-500 rounded-lg pl-8 pr-3 py-1.5 border border-slate-700/80 focus:outline-none focus:border-blue-500"
          />
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
        </div>
      </div>

      {/* Categorized File List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-4 text-xs">
        {search ? (
          <div className="space-y-1">
            {filtered.map((file) => {
              const isActive = activeFile.path === file.path;
              return (
                <button
                  key={file.path}
                  onClick={() => onSelectFile(file)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center gap-2 transition-colors ${
                    isActive
                      ? 'bg-blue-600/20 text-blue-400 font-semibold border border-blue-500/30'
                      : 'text-slate-300 hover:bg-slate-800/60'
                  }`}
                >
                  <FileCode className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span className="truncate">{file.name}</span>
                </button>
              );
            })}
          </div>
        ) : (
          categories.map((cat) => {
            const catFiles = files.filter((f) => f.category === cat.key);
            if (catFiles.length === 0) return null;
            const CatIcon = cat.icon;

            return (
              <div key={cat.key}>
                <div className="flex items-center gap-1.5 px-2 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <CatIcon className="w-3.5 h-3.5 text-slate-400" />
                  <span>{cat.label}</span>
                  <span className="ml-auto text-[10px] text-slate-400 font-normal">
                    {catFiles.length}
                  </span>
                </div>

                <div className="mt-1 space-y-0.5">
                  {catFiles.map((file) => {
                    const isActive = activeFile.path === file.path;
                    return (
                      <button
                        key={file.path}
                        onClick={() => onSelectFile(file)}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center gap-2 transition-all ${
                          isActive
                            ? 'bg-blue-600 text-white font-semibold shadow-sm'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                        }`}
                      >
                        <FileCode
                          className={`w-3.5 h-3.5 shrink-0 ${
                            isActive ? 'text-white' : 'text-slate-500'
                          }`}
                        />
                        <span className="truncate">{file.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

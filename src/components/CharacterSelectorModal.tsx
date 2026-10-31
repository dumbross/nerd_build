/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, Plus, Copy, Trash2, Download, Check, Shield } from 'lucide-react';
import { Character } from '../types/character';

interface CharacterSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  characters: Character[];
  activeCharacterId: string;
  onSelectCharacter: (id: string) => void;
  onCreateNew: () => void;
  onCloneCharacter: (char: Character) => void;
  onDeleteCharacter: (id: string) => void;
}

export const CharacterSelectorModal: React.FC<CharacterSelectorModalProps> = ({
  isOpen,
  onClose,
  characters,
  activeCharacterId,
  onSelectCharacter,
  onCreateNew,
  onCloneCharacter,
  onDeleteCharacter,
}) => {
  if (!isOpen) return null;

  const handleExportJson = (char: Character) => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(char, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${char.name.toLowerCase().replace(/\s+/g, '_')}_5e_export.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-slate-100">
                Manage Characters
              </h3>
              <p className="text-xs text-slate-400">
                Switch heroes, create new adventurers, or export 5e JSON backup
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="p-6 overflow-y-auto space-y-3 flex-1">
          {characters.map((char) => {
            const isActive = char.id === activeCharacterId;
            return (
              <div
                key={char.id}
                className={`p-4 rounded-xl border transition-all flex items-center justify-between gap-4 ${
                  isActive
                    ? 'bg-amber-500/10 border-amber-500/50 shadow-sm shadow-amber-500/10'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                }`}
              >
                <div
                  onClick={() => {
                    onSelectCharacter(char.id);
                    onClose();
                  }}
                  className="cursor-pointer flex-1"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-serif font-bold text-base text-slate-100 hover:text-amber-300 transition-colors">
                      {char.name}
                    </span>
                    {isActive && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                        <Check className="w-2.5 h-2.5" /> Active
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-400 mt-1 flex items-center gap-2 flex-wrap">
                    <span>
                      Level {char.level} {char.className} {char.subclass ? `(${char.subclass})` : ''}
                    </span>
                    <span>·</span>
                    <span>{char.race}</span>
                    <span>·</span>
                    <span>{char.background}</span>
                    <span>·</span>
                    <span className="text-emerald-400 font-mono">HP: {char.hpCurrent}/{char.hpMax}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => handleExportJson(char)}
                    aria-label="Export Character to JSON"
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                    title="Export Character JSON"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onCloneCharacter(char)}
                    aria-label="Clone Character"
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                    title="Duplicate Hero"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  {characters.length > 1 && (
                    <button
                      onClick={() => onDeleteCharacter(char.id)}
                      aria-label="Delete Character"
                      className="p-2 rounded-lg bg-slate-800 hover:bg-rose-900/60 text-slate-400 hover:text-rose-300 transition-colors"
                      title="Delete Hero"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            {characters.length} character{characters.length > 1 ? 's' : ''} stored locally
          </div>
          <button
            onClick={() => {
              onCreateNew();
              onClose();
            }}
            className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-450 text-slate-950 font-semibold text-xs flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Hero</span>
          </button>
        </div>
      </div>
    </div>
  );
};

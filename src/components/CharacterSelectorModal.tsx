/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Plus, Copy, Trash2, Download, Check, Shield, Search } from 'lucide-react';
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
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filteredCharacters = characters.filter((c) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      c.name.toLowerCase().includes(q) ||
      c.race.toLowerCase().includes(q) ||
      (c.subrace && c.subrace.toLowerCase().includes(q)) ||
      c.className.toLowerCase().includes(q) ||
      (c.subclass && c.subclass.toLowerCase().includes(q))
    );
  });

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white border border-[#E5DFD5] rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8E3DA] bg-[#FBF9F5]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white border border-[#DDD5C7] flex items-center justify-center text-[#B85D36] shadow-sm">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-semibold text-stone-900">
                Manage Characters
              </h3>
              <p className="text-xs text-stone-600">
                19 ready-to-play sample heroes across every 5e race, plus custom dossiers
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search bar */}
        <div className="px-6 py-3 border-b border-[#E8E3DA] bg-white">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by race (Dwarf, Tabaxi, Kobold, Genasi...), class, or name..."
              className="w-full pl-9 pr-4 py-2 bg-[#FAF8F5] border border-[#E5DFD5] rounded-xl text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-stone-400"
            />
          </div>
        </div>

        {/* Content list */}
        <div className="p-6 overflow-y-auto space-y-3 flex-1">
          {filteredCharacters.length === 0 ? (
            <div className="text-center py-8 text-xs text-stone-500 italic">
              No characters found matching "{searchQuery}"
            </div>
          ) : (
            filteredCharacters.map((char) => {
            const isActive = char.id === activeCharacterId;
            return (
              <div
                key={char.id}
                className={`p-4 rounded-xl border transition-all flex items-center justify-between gap-4 ${
                  isActive
                    ? 'bg-white border-stone-900 ring-1 ring-stone-900/10 shadow-sm'
                    : 'bg-[#FAF8F5] border-[#E8E3DA] hover:border-stone-400 hover:bg-[#F5F1EB]'
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
                    <span className="font-serif font-semibold text-base text-stone-900 hover:text-[#B85D36] transition-colors">
                      {char.name}
                    </span>
                    {isActive && (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-stone-900 text-white flex items-center gap-1 shadow-sm">
                        <Check className="w-2.5 h-2.5" /> Active
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-stone-600 mt-1 flex items-center gap-2 flex-wrap">
                    <span>
                      Level {char.level} {char.className} {char.subclass ? `(${char.subclass})` : ''}
                    </span>
                    <span className="text-stone-300">·</span>
                    <span>{char.race}</span>
                    <span className="text-stone-300">·</span>
                    <span>{char.background}</span>
                    <span className="text-stone-300">·</span>
                    <span className="text-[#2E4A3E] font-mono font-medium">HP {char.hpCurrent}/{char.hpMax}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => handleExportJson(char)}
                    aria-label="Export Character to JSON"
                    className="p-2 rounded-lg bg-white hover:bg-stone-100 text-stone-700 border border-[#DDD5C7] shadow-sm transition-colors"
                    title="Export Character JSON"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onCloneCharacter(char)}
                    aria-label="Clone Character"
                    className="p-2 rounded-lg bg-white hover:bg-stone-100 text-stone-700 border border-[#DDD5C7] shadow-sm transition-colors"
                    title="Duplicate Hero"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  {characters.length > 1 && (
                    <button
                      onClick={() => onDeleteCharacter(char.id)}
                      aria-label="Delete Character"
                      className="p-2 rounded-lg bg-white hover:bg-stone-100 text-stone-500 hover:text-stone-900 border border-[#DDD5C7] shadow-sm transition-colors"
                      title="Delete Hero"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          }))}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#E8E3DA] bg-[#FBF9F5] flex items-center justify-between">
          <div className="text-xs text-stone-600">
            {characters.length} character{characters.length > 1 ? 's' : ''} stored locally
          </div>
          <button
            onClick={() => {
              onCreateNew();
              onClose();
            }}
            className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-medium text-xs flex items-center gap-2 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Hero</span>
          </button>
        </div>
      </div>
    </div>
  );
};

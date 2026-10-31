/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  FileDown,
  Dices,
  BookOpen,
  UserCheck,
  Wand2,
  Upload,
  PlusCircle,
  Users,
} from 'lucide-react';
import { Character } from '../types/character';

interface HeaderProps {
  activeTab: 'sheet' | 'builder' | 'compendium';
  setActiveTab: (tab: 'sheet' | 'builder' | 'compendium') => void;
  activeCharacter: Character;
  onOpenCharacterModal: () => void;
  onOpenDiceRoller: () => void;
  onOpenCompendium: () => void;
  onOpenImportModal: () => void;
  onExportPdf: () => void;
  isExportingPdf: boolean;
  onNewCharacter: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  activeCharacter,
  onOpenCharacterModal,
  onOpenDiceRoller,
  onOpenCompendium,
  onOpenImportModal,
  onExportPdf,
  isExportingPdf,
  onNewCharacter,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 md:gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <span className="font-serif font-black text-xl">⚔</span>
          </div>
          <div>
            <div className="font-serif text-lg font-bold tracking-wider text-amber-100 whitespace-nowrap">
              FORGE & GRIMOIRE
            </div>
            <div className="text-[10px] text-slate-400 tracking-wider">
              5E.TOOLS DATA COMPENDIUM
            </div>
          </div>
        </div>

        {/* Zone 2: Navigation Links / Modes */}
        <nav className="hidden md:flex items-center gap-2 lg:gap-4 text-sm font-medium">
          <button
            onClick={() => setActiveTab('sheet')}
            className={`px-3.5 py-1.5 rounded-md transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 ${
              activeTab === 'sheet'
                ? 'bg-amber-500/15 text-amber-300 font-semibold border border-amber-500/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <UserCheck className="w-4 h-4 text-amber-400" />
            <span>Character Sheet</span>
          </button>

          <button
            onClick={() => setActiveTab('builder')}
            className={`px-3.5 py-1.5 rounded-md transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 ${
              activeTab === 'builder'
                ? 'bg-amber-500/15 text-amber-300 font-semibold border border-amber-500/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Wand2 className="w-4 h-4 text-amber-400" />
            <span>Builder</span>
          </button>

          <button
            onClick={onOpenCompendium}
            className="px-3.5 py-1.5 rounded-md text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors flex items-center gap-2 whitespace-nowrap shrink-0"
          >
            <BookOpen className="w-4 h-4 text-slate-400" />
            <span>5e Compendium</span>
          </button>

          <button
            onClick={onOpenImportModal}
            className="px-3 py-1.5 rounded-md text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors flex items-center gap-2 whitespace-nowrap shrink-0"
            title="Import 5e.tools JSON data"
          >
            <Upload className="w-4 h-4 text-slate-400" />
            <span>Data Integration</span>
          </button>
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Quick Dice Roller */}
          <button
            onClick={onOpenDiceRoller}
            aria-label="Open Dice Roller"
            className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-750 text-slate-300 hover:text-amber-300 border border-slate-700/60 transition-colors flex items-center justify-center"
            title="Interactive Dice Roller"
          >
            <Dices className="w-4 h-4" />
          </button>

          {/* Active Character Selector */}
          <button
            onClick={onOpenCharacterModal}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700/80 hover:border-amber-500/40 text-slate-200 transition-colors text-xs"
          >
            <Users className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-medium max-w-[110px] truncate">{activeCharacter.name}</span>
            <span className="text-[11px] text-slate-400 tabular-nums">Lvl {activeCharacter.level}</span>
          </button>

          {/* New Character quick button */}
          <button
            onClick={onNewCharacter}
            aria-label="Create New Character"
            className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-700/60 transition-colors hidden sm:flex items-center justify-center"
            title="Create New Character"
          >
            <PlusCircle className="w-4 h-4" />
          </button>

          {/* Primary CTA: Fillable PDF Export */}
          <button
            onClick={onExportPdf}
            disabled={isExportingPdf}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-amber-500 hover:bg-amber-450 active:bg-amber-600 text-slate-950 transition-all flex items-center gap-2 shadow-sm hover:shadow-amber-500/20 whitespace-nowrap shrink-0 disabled:opacity-60"
          >
            <FileDown className="w-4 h-4" />
            <span>{isExportingPdf ? 'Exporting...' : 'Export Fillable PDF'}</span>
          </button>
        </div>
      </div>

      {/* Mobile nav tabs */}
      <div className="flex md:hidden items-center justify-between gap-1 pt-2 border-t border-slate-800/60 mt-2">
        <button
          onClick={() => setActiveTab('sheet')}
          className={`flex-1 py-1.5 text-xs text-center rounded ${activeTab === 'sheet' ? 'bg-amber-500/20 text-amber-300 font-semibold' : 'text-slate-400'}`}
        >
          Sheet
        </button>
        <button
          onClick={() => setActiveTab('builder')}
          className={`flex-1 py-1.5 text-xs text-center rounded ${activeTab === 'builder' ? 'bg-amber-500/20 text-amber-300 font-semibold' : 'text-slate-400'}`}
        >
          Builder
        </button>
        <button
          onClick={onOpenCompendium}
          className="flex-1 py-1.5 text-xs text-center rounded text-slate-400 hover:text-slate-200"
        >
          Compendium
        </button>
        <button
          onClick={onOpenCharacterModal}
          className="flex-1 py-1.5 text-xs text-center rounded text-slate-400 hover:text-slate-200"
        >
          Heroes
        </button>
      </div>
    </header>
  );
};

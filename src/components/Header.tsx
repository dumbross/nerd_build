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
  Compass,
  Upload,
  Plus,
  Users,
  Feather,
  Skull,
} from 'lucide-react';
import { Character } from '../types/character';

interface HeaderProps {
  activeTab: 'sheet' | 'builder' | 'compendium';
  setActiveTab: (tab: 'sheet' | 'builder' | 'compendium') => void;
  focusMode: 'character' | 'monster';
  setFocusMode: (mode: 'character' | 'monster') => void;
  activeCharacter: Character;
  onOpenCharacterModal: () => void;
  onOpenDiceRoller: () => void;
  onOpenCompendium: () => void;
  onOpenImportModal: () => void;
  onExportPdf: () => void;
  isExportingPdf: boolean;
  onNewCharacter: () => void;
  onNewMonster?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  focusMode,
  setFocusMode,
  activeCharacter,
  onOpenCharacterModal,
  onOpenDiceRoller,
  onOpenCompendium,
  onOpenImportModal,
  onExportPdf,
  isExportingPdf,
  onNewCharacter,
  onNewMonster,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/92 backdrop-blur-md border-b border-[#E8E3DA] px-4 sm:px-6 lg:px-8 py-2.5 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 md:gap-6">
        {/* Brand identity */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-[#F0EBE1] border border-[#DDD5C7] flex items-center justify-center text-[#B85D36] shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
            <Feather className="w-4 h-4" />
          </div>
          <div className="hidden sm:block">
            <div className="font-serif text-base font-semibold tracking-tight text-stone-900 leading-tight">
              Forge & Grimoire
            </div>
            <div className="text-[10px] tracking-wider text-stone-600 uppercase font-medium">
              5e Atelier & Folio
            </div>
          </div>
        </div>

        {/* Master Focus Mode Toggle: Character Focus vs Monster Focus */}
        <div className="flex items-center bg-[#EAE4D9] p-0.5 rounded-xl border border-[#DDD5C7] shadow-inner">
          <button
            onClick={() => setFocusMode('character')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              focusMode === 'character'
                ? 'bg-white text-stone-900 shadow-xs font-semibold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
            title="Switch UI to Character Focus (Character Sheet, Builder, Spellbook)"
          >
            <UserCheck
              className={`w-3.5 h-3.5 ${
                focusMode === 'character' ? 'text-[#B85D36]' : 'text-stone-500'
              }`}
            />
            <span className="hidden md:inline">Character Focus</span>
            <span className="md:hidden">Heroes</span>
          </button>

          <button
            onClick={() => setFocusMode('monster')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              focusMode === 'monster'
                ? 'bg-white text-stone-900 shadow-xs font-semibold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
            title="Switch UI to Monster Focus (Bestiary, Homebrewery Stat Blocks)"
          >
            <Skull
              className={`w-3.5 h-3.5 ${
                focusMode === 'monster' ? 'text-[#7A200D]' : 'text-stone-500'
              }`}
            />
            <span className="hidden md:inline">Monster Focus</span>
            <span className="md:hidden">Bestiary</span>
          </button>
        </div>

        {/* Sub-Navigation: Adapts based on Focus Mode */}
        <nav className="hidden lg:flex items-center bg-[#EFEAE2] p-1 rounded-xl border border-[#E3DDD1]">
          {focusMode === 'character' ? (
            <>
              <button
                onClick={() => setActiveTab('sheet')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                  activeTab === 'sheet'
                    ? 'bg-white text-stone-900 shadow-sm font-semibold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5 text-[#B85D36]" />
                <span>Sheet</span>
              </button>

              <button
                onClick={() => setActiveTab('builder')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                  activeTab === 'builder'
                    ? 'bg-white text-stone-900 shadow-sm font-semibold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Compass className="w-3.5 h-3.5 text-[#B85D36]" />
                <span>Builder</span>
              </button>
            </>
          ) : (
            <div className="px-3 py-1.5 rounded-lg text-xs font-semibold text-stone-900 bg-white shadow-sm flex items-center gap-1.5">
              <Skull className="w-3.5 h-3.5 text-[#7A200D]" />
              <span>Bestiary Index</span>
            </div>
          )}

          <button
            onClick={onOpenCompendium}
            className="px-3 py-1.5 rounded-lg text-xs font-medium text-stone-600 hover:text-stone-900 transition-colors flex items-center gap-1.5"
          >
            <BookOpen className="w-3.5 h-3.5 text-stone-600" />
            <span>Compendium</span>
          </button>

          <button
            onClick={onOpenImportModal}
            className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-stone-600 hover:text-stone-900 transition-colors flex items-center gap-1.5"
            title="Import 5e.tools JSON"
          >
            <Upload className="w-3.5 h-3.5 text-stone-600" />
            <span>Import</span>
          </button>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {focusMode === 'character' ? (
            <>
              {/* Active Character Quick Picker */}
              <button
                onClick={onOpenCharacterModal}
                className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-[#E5DFD5] hover:border-stone-400 text-stone-800 text-xs shadow-sm"
                title="Switch or manage characters"
              >
                <Users className="w-3.5 h-3.5 text-stone-600" />
                <span className="font-medium max-w-[110px] truncate">{activeCharacter.name}</span>
                <span className="text-[11px] text-stone-600 tabular-nums">· Lvl {activeCharacter.level}</span>
              </button>

              {/* New Character Button */}
              <button
                onClick={onNewCharacter}
                aria-label="Create New Character"
                className="p-1.5 rounded-lg bg-white hover:bg-stone-100 text-stone-700 border border-[#E5DFD5] shadow-sm flex items-center justify-center transition-colors"
                title="Create New Character"
              >
                <Plus className="w-4 h-4" />
              </button>

              {/* Primary Action: Export Fillable PDF */}
              <button
                onClick={onExportPdf}
                disabled={isExportingPdf}
                className="px-3 py-1.5 text-xs font-medium rounded-lg bg-[#B85D36] hover:bg-[#A34A25] active:bg-[#8F3E1D] text-white transition-all flex items-center gap-1.5 shadow-sm whitespace-nowrap shrink-0 disabled:opacity-60"
              >
                <FileDown className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">
                  {isExportingPdf ? 'Exporting...' : 'Export Fillable PDF'}
                </span>
                <span className="sm:hidden">PDF</span>
              </button>
            </>
          ) : (
            onNewMonster && (
              <button
                onClick={onNewMonster}
                className="px-3 py-1.5 text-xs font-medium rounded-lg bg-stone-900 hover:bg-stone-800 text-white transition-all flex items-center gap-1.5 shadow-sm"
                title="Create New Homebrew Monster"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Monster</span>
              </button>
            )
          )}

          {/* Quick Dice Roller Button */}
          <button
            onClick={onOpenDiceRoller}
            aria-label="Open Dice Roller"
            className="p-1.5 rounded-lg bg-white hover:bg-stone-100 text-stone-700 hover:text-stone-900 border border-[#E5DFD5] shadow-sm flex items-center justify-center transition-colors"
            title="Interactive Dice Roller"
          >
            <Dices className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile nav bar */}
      <div className="flex lg:hidden items-center justify-between gap-1 pt-2 border-t border-[#E8E3DA] mt-2">
        {focusMode === 'character' ? (
          <>
            <button
              onClick={() => setActiveTab('sheet')}
              className={`flex-1 py-1.5 text-xs text-center rounded-md font-medium transition-colors ${
                activeTab === 'sheet' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600'
              }`}
            >
              Sheet
            </button>
            <button
              onClick={() => setActiveTab('builder')}
              className={`flex-1 py-1.5 text-xs text-center rounded-md font-medium transition-colors ${
                activeTab === 'builder' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600'
              }`}
            >
              Builder
            </button>
            <button
              onClick={onOpenCharacterModal}
              className="flex-1 py-1.5 text-xs text-center rounded-md text-stone-600 hover:text-stone-900 font-medium"
            >
              Heroes
            </button>
          </>
        ) : (
          <div className="flex-1 text-center py-1 text-xs font-semibold text-[#7A200D] flex items-center justify-center gap-1">
            <Skull className="w-3.5 h-3.5" />
            <span>Bestiary View Active</span>
          </div>
        )}

        <button
          onClick={onOpenCompendium}
          className="flex-1 py-1.5 text-xs text-center rounded-md text-stone-600 hover:text-stone-900 font-medium"
        >
          Compendium
        </button>
      </div>
    </header>
  );
};


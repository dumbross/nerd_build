/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Swords, Sparkles, Award, Backpack, User, BookOpen } from 'lucide-react';
import { Character } from '../../types/character';
import { CoreStatsBar } from './CoreStatsBar';
import { AbilitiesSkillsColumn } from './AbilitiesSkillsColumn';
import { CombatTab } from './CombatTab';
import { SpellsTab } from './SpellsTab';
import { FeaturesTab } from './FeaturesTab';
import { InventoryTab } from './InventoryTab';
import { BioTab } from './BioTab';

interface SheetViewProps {
  character: Character;
  onUpdateCharacter: (char: Character) => void;
  onQuickRoll: (sides: number, count?: number, modifier?: number, label?: string) => void;
  onOpenCompendium: (category?: any) => void;
}

type TabType = 'combat' | 'spells' | 'features' | 'inventory' | 'bio';

export const SheetView: React.FC<SheetViewProps> = ({
  character,
  onUpdateCharacter,
  onQuickRoll,
  onOpenCompendium,
}) => {
  const [activeSheetTab, setActiveSheetTab] = useState<TabType>('combat');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* Top Core Vitals & Resting Bar */}
      <CoreStatsBar
        character={character}
        onUpdateCharacter={onUpdateCharacter}
        onQuickRoll={onQuickRoll}
      />

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Ability Scores & Skills (4 cols on lg screens) */}
        <div className="lg:col-span-4 space-y-4">
          <AbilitiesSkillsColumn
            character={character}
            onUpdateCharacter={onUpdateCharacter}
            onQuickRoll={onQuickRoll}
          />
        </div>

        {/* Center & Right Column: Tabbed Workspace (8 cols on lg screens) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Sheet Navigation Tabs */}
          <div className="flex items-center gap-1 p-1 bg-white border border-[#E5DFD5] rounded-2xl shadow-sm overflow-x-auto">
            {[
              { id: 'combat', label: 'Combat & Actions', icon: Swords },
              { id: 'spells', label: 'Grimoire & Spells', icon: Sparkles },
              { id: 'features', label: 'Features & Traits', icon: Award },
              { id: 'inventory', label: 'Armory & Wealth', icon: Backpack },
              { id: 'bio', label: 'Bio & Chronicle', icon: User },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeSheetTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveSheetTab(tab.id as TabType)}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-medium flex items-center justify-center gap-2 transition-all whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'bg-stone-900 text-white font-semibold shadow-sm'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-[#FAF8F5]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Active Tab Panel */}
          <div className="min-h-[500px]">
            {activeSheetTab === 'combat' && (
              <CombatTab
                character={character}
                onUpdateCharacter={onUpdateCharacter}
                onQuickRoll={onQuickRoll}
              />
            )}

            {activeSheetTab === 'spells' && (
              <SpellsTab
                character={character}
                onUpdateCharacter={onUpdateCharacter}
                onQuickRoll={onQuickRoll}
                onOpenCompendium={() => onOpenCompendium('spells')}
              />
            )}

            {activeSheetTab === 'features' && (
              <FeaturesTab
                character={character}
                onUpdateCharacter={onUpdateCharacter}
              />
            )}

            {activeSheetTab === 'inventory' && (
              <InventoryTab
                character={character}
                onUpdateCharacter={onUpdateCharacter}
                onOpenCompendium={onOpenCompendium}
              />
            )}

            {activeSheetTab === 'bio' && (
              <BioTab
                character={character}
                onUpdateCharacter={onUpdateCharacter}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

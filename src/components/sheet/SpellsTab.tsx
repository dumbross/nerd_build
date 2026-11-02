/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sparkles, Plus, Zap, BookOpen, Trash2 } from 'lucide-react';
import { Character, Spell } from '../../types/character';
import { clean5eToolsText } from '../../utils/5eParser';
import {
  calculateSpellAttackModifier,
  calculateSpellSaveDC,
  formatModifier,
  getAbilityScoresTotal,
  getProficiencyBonus,
  getStartingSpellsForClass,
  isSpellcastingClass,
} from '../../utils/calculations';

interface SpellsTabProps {
  character: Character;
  onUpdateCharacter: (char: Character) => void;
  onQuickRoll: (sides: number, count?: number, modifier?: number, label?: string) => void;
  onOpenCompendium: () => void;
}

export const SpellsTab: React.FC<SpellsTabProps> = ({
  character,
  onUpdateCharacter,
  onQuickRoll,
  onOpenCompendium,
}) => {
  const [selectedLevelFilter, setSelectedLevelFilter] = useState<string>('all');
  const [expandedSpellId, setExpandedSpellId] = useState<string | null>(null);

  const abilities = getAbilityScoresTotal(character);
  const profBonus = getProficiencyBonus(character.level);
  const spellAbility = character.spellcastingAbility || 'int';
  const spellScore = abilities[spellAbility];
  const spellSaveDC = calculateSpellSaveDC(spellScore, profBonus);
  const spellAttackBonus = calculateSpellAttackModifier(spellScore, profBonus);

  const handleToggleSlot = (lvlIndex: number, slotIndex: number) => {
    const total = character.spellSlotsTotal?.[lvlIndex] || 0;
    const spent = character.spellSlotsExpended?.[lvlIndex] || 0;

    let nextSpent = spent;
    if (slotIndex < spent) {
      nextSpent = slotIndex;
    } else {
      nextSpent = slotIndex + 1;
    }

    const updatedExpended = [...(character.spellSlotsExpended || [0, 0, 0, 0, 0, 0, 0, 0, 0])];
    updatedExpended[lvlIndex] = Math.max(0, Math.min(total, nextSpent));

    onUpdateCharacter({
      ...character,
      spellSlotsExpended: updatedExpended,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleCastSpell = (spell: Spell) => {
    if (spell.level > 0) {
      const lvlIdx = spell.level - 1;
      const total = character.spellSlotsTotal?.[lvlIdx] || 0;
      const spent = character.spellSlotsExpended?.[lvlIdx] || 0;

      if (spent < total) {
        const updatedExpended = [...(character.spellSlotsExpended || [0, 0, 0, 0, 0, 0, 0, 0, 0])];
        updatedExpended[lvlIdx] = spent + 1;
        onUpdateCharacter({
          ...character,
          spellSlotsExpended: updatedExpended,
          updatedAt: new Date().toISOString(),
        });
      }
    }

    if (spell.attackType) {
      onQuickRoll(20, 1, spellAttackBonus, `${spell.name} Spell Attack`);
    } else if (spell.damage) {
      const match = spell.damage.match(/(\d+)d(\d+)/);
      if (match) {
        onQuickRoll(parseInt(match[2]), parseInt(match[1]), 0, `${spell.name} Damage (${spell.damageType || ''})`);
      }
    } else {
      onQuickRoll(20, 1, 0, `Cast ${spell.name}`);
    }
  };

  const handleDeleteSpell = (spellId: string) => {
    onUpdateCharacter({
      ...character,
      spells: (character.spells || []).filter((s) => s.id !== spellId),
      updatedAt: new Date().toISOString(),
    });
  };

  const spells = character.spells || [];
  const filteredSpells = spells.filter((s) => {
    if (selectedLevelFilter === 'all') return true;
    return s.level.toString() === selectedLevelFilter;
  });

  return (
    <div className="space-y-6">
      {/* Spellcasting Header Banner */}
      <div className="p-5 rounded-2xl bg-white border border-[#E5DFD5] flex items-center justify-between flex-wrap gap-4 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#B85D36]" />
            <h4 className="font-serif text-base font-semibold text-stone-900">
              Grimoire & Spellcasting
            </h4>
          </div>
          <p className="text-xs text-stone-600 mt-1 flex items-center gap-2 flex-wrap">
            <span>Ability: <strong className="text-stone-900 uppercase">{spellAbility}</strong></span>
            <span className="text-stone-300">·</span>
            <span>Save DC: <strong className="font-mono text-stone-900">{spellSaveDC}</strong></span>
            <span className="text-stone-300">·</span>
            <span>Attack Bonus: <strong className="font-mono text-stone-900">{formatModifier(spellAttackBonus)}</strong></span>
          </p>
        </div>

        <button
          onClick={onOpenCompendium}
          className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-stone-50 border border-[#DDD5C7] text-stone-800 text-xs font-medium flex items-center gap-1.5 transition-all shadow-sm"
        >
          <Plus className="w-3.5 h-3.5 text-[#B85D36]" />
          <span>Add Spells from Compendium</span>
        </button>
      </div>

      {/* Spell Slots Grid */}
      <div className="p-5 rounded-2xl bg-white border border-[#E5DFD5] space-y-3 shadow-sm">
        <div className="text-xs font-semibold uppercase tracking-wider text-stone-600 flex items-center justify-between">
          <span>Spell Slots Tracker</span>
          <span className="text-[10px] text-stone-600 font-normal">Click circles to expend or recover</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {[1, 2, 3, 4, 5].map((lvl) => {
            const lvlIdx = lvl - 1;
            const total = character.spellSlotsTotal?.[lvlIdx] || 0;
            const spent = character.spellSlotsExpended?.[lvlIdx] || 0;

            return (
              <div
                key={lvl}
                className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E8E3DA] flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-stone-800">{lvl}st Level</span>
                  <span className="font-mono text-xs font-semibold text-stone-900 tabular-nums">
                    {total - spent} / {total}
                  </span>
                </div>

                {total === 0 ? (
                  <div className="text-[11px] text-stone-600 italic">No slots</div>
                ) : (
                  <div className="flex items-center gap-1.5">
                    {Array.from({ length: total }).map((_, i) => {
                      const isSpent = i < spent;
                      return (
                        <button
                          key={i}
                          onClick={() => handleToggleSlot(lvlIdx, i)}
                          className={`w-4 h-4 rounded-full border transition-all flex items-center justify-center ${
                            isSpent
                              ? 'bg-stone-200 border-stone-300'
                              : 'bg-[#B85D36] border-[#B85D36]'
                          }`}
                          title={`Toggle Slot ${i + 1}`}
                        />
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Spell Level Filter Bar */}
      <div className="flex items-center justify-between flex-wrap gap-2 pt-1">
        <div className="flex items-center gap-1 overflow-x-auto text-xs bg-white p-1 rounded-xl border border-[#E5DFD5] shadow-sm">
          {['all', '0', '1', '2', '3'].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setSelectedLevelFilter(lvl)}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                selectedLevelFilter === lvl
                  ? 'bg-stone-900 text-white font-semibold shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {lvl === 'all' ? 'All Spells' : lvl === '0' ? 'Cantrips' : `Level ${lvl}`}
            </button>
          ))}
        </div>

        <span className="text-xs text-stone-600">
          Showing {filteredSpells.length} of {spells.length} spells
        </span>
      </div>

      {/* Spells List */}
      <div className="space-y-3">
        {filteredSpells.length === 0 ? (
          <div className="p-8 rounded-2xl bg-white border border-[#E5DFD5] text-center space-y-3 shadow-sm">
            <BookOpen className="w-6 h-6 text-stone-400 mx-auto" />
            <div className="text-xs text-stone-600">No spells found in this category.</div>
            <div className="flex items-center justify-center gap-3 pt-1 flex-wrap">
              <button
                onClick={onOpenCompendium}
                className="text-xs text-[#B85D36] font-semibold hover:underline"
              >
                Browse 5e Compendium
              </button>
              {isSpellcastingClass(character.className) && (
                <button
                  onClick={() => {
                    const starters = getStartingSpellsForClass(character.className);
                    onUpdateCharacter({
                      ...character,
                      spells: starters,
                      updatedAt: new Date().toISOString(),
                    });
                  }}
                  className="px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-medium text-xs shadow-sm transition-all"
                >
                  Auto-Fill 5e Starter Spells
                </button>
              )}
            </div>
          </div>
        ) : (
          filteredSpells.map((spell) => {
            const isExpanded = expandedSpellId === spell.id;

            return (
              <div
                key={spell.id}
                className="p-4 rounded-2xl bg-white border border-[#E5DFD5] hover:border-stone-400 transition-all space-y-2 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div
                    onClick={() => setExpandedSpellId(isExpanded ? null : spell.id)}
                    className="cursor-pointer flex-1"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-serif font-semibold text-base text-stone-900">
                        {spell.name}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#FAF8F5] text-stone-700 border border-[#E0D9CE]">
                        {spell.level === 0 ? 'Cantrip' : `Level ${spell.level}`}
                      </span>
                      <span className="text-[11px] text-stone-600">({spell.school})</span>
                    </div>

                    <div className="text-[11px] text-stone-600 mt-1 flex items-center gap-2 flex-wrap">
                      <span>{spell.castingTime}</span>
                      <span className="text-stone-300">·</span>
                      <span>{spell.range}</span>
                      <span className="text-stone-300">·</span>
                      <span>{spell.components}</span>
                      <span className="text-stone-300">·</span>
                      <span>{spell.duration}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleCastSpell(spell)}
                      className="px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs flex items-center gap-1.5 transition-all shadow-sm"
                    >
                      <Zap className="w-3.5 h-3.5 text-[#EBD6CA]" />
                      <span>Cast</span>
                    </button>

                    <button
                      onClick={() => handleDeleteSpell(spell.id)}
                      className="p-1.5 rounded-lg text-stone-600 hover:text-stone-900 transition-colors"
                      title="Remove Spell"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Spell Description */}
                <div className={`text-xs text-stone-700 leading-relaxed pt-2 border-t border-[#F0EBE1] ${isExpanded ? '' : 'line-clamp-2'}`}>
                  {clean5eToolsText(spell.description)}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

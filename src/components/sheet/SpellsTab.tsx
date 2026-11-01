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

  // Toggle spell slot spent
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

  // Cast spell: if level > 0, expend a slot and roll attack or damage if defined
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
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h4 className="font-serif text-base font-bold text-slate-100">
              Grimoire & Spellcasting
            </h4>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Ability: <span className="text-amber-300 font-bold uppercase">{spellAbility}</span> · Save DC: <span className="font-mono font-bold text-slate-200">{spellSaveDC}</span> · Attack: <span className="font-mono font-bold text-slate-200">{formatModifier(spellAttackBonus)}</span>
          </p>
        </div>

        <button
          onClick={onOpenCompendium}
          className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-semibold flex items-center gap-1.5 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Spells from Compendium</span>
        </button>
      </div>

      {/* Spell Slots Grid */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
          <span>Spell Slots Tracker</span>
          <span className="text-[10px] text-slate-500 font-normal">Click circles to expend/recover</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {[1, 2, 3, 4, 5].map((lvl) => {
            const lvlIdx = lvl - 1;
            const total = character.spellSlotsTotal?.[lvlIdx] || 0;
            const spent = character.spellSlotsExpended?.[lvlIdx] || 0;

            return (
              <div
                key={lvl}
                className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-300">{lvl}st Level</span>
                  <span className="font-mono text-xs font-bold text-amber-400 tabular-nums">
                    {total - spent} / {total}
                  </span>
                </div>

                {total === 0 ? (
                  <div className="text-[11px] text-slate-600 italic">No slots</div>
                ) : (
                  <div className="flex items-center gap-1.5">
                    {Array.from({ length: total }).map((_, i) => {
                      const isSpent = i < spent;
                      return (
                        <button
                          key={i}
                          onClick={() => handleToggleSlot(lvlIdx, i)}
                          className={`w-5 h-5 rounded-full border transition-all flex items-center justify-center ${
                            isSpent
                              ? 'bg-slate-900 border-slate-700'
                              : 'bg-indigo-500 border-indigo-400 shadow-sm shadow-indigo-500/40'
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
      <div className="flex items-center justify-between flex-wrap gap-2 pt-1 border-t border-slate-800">
        <div className="flex items-center gap-1 overflow-x-auto text-xs">
          {['all', '0', '1', '2', '3'].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setSelectedLevelFilter(lvl)}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                selectedLevelFilter === lvl
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {lvl === 'all' ? 'All Spells' : lvl === '0' ? 'Cantrips' : `Level ${lvl}`}
            </button>
          ))}
        </div>

        <span className="text-xs text-slate-400">
          Showing {filteredSpells.length} of {spells.length} spells
        </span>
      </div>

      {/* Spells List */}
      <div className="space-y-3">
        {filteredSpells.length === 0 ? (
          <div className="p-8 rounded-xl bg-slate-900/60 border border-slate-800 text-center space-y-3">
            <BookOpen className="w-6 h-6 text-slate-500 mx-auto" />
            <div className="text-xs text-slate-400">No spells found in this grimoire category.</div>
            <div className="flex items-center justify-center gap-3 pt-1 flex-wrap">
              <button
                onClick={onOpenCompendium}
                className="text-xs text-amber-400 font-semibold hover:underline cursor-pointer"
              >
                Browse 5e.tools Compendium
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
                  className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs cursor-pointer transition-colors"
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
                className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors space-y-2"
              >
                <div className="flex items-start justify-between gap-4">
                  <div
                    onClick={() => setExpandedSpellId(isExpanded ? null : spell.id)}
                    className="cursor-pointer flex-1"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-serif font-bold text-sm text-slate-100 hover:text-amber-300">
                        {spell.name}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-amber-300 border border-slate-700">
                        {spell.level === 0 ? 'Cantrip' : `Level ${spell.level}`}
                      </span>
                      <span className="text-[11px] text-slate-400">({spell.school})</span>
                    </div>

                    <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-3 flex-wrap">
                      <span>{spell.castingTime}</span>
                      <span>·</span>
                      <span>{spell.range}</span>
                      <span>·</span>
                      <span>{spell.components}</span>
                      <span>·</span>
                      <span>{spell.duration}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleCastSpell(spell)}
                      className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-450 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>Cast</span>
                    </button>

                    <button
                      onClick={() => handleDeleteSpell(spell.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                      title="Remove Spell"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Spell Description */}
                <div className={`text-xs text-slate-300 leading-relaxed pt-2 border-t border-slate-800/60 ${isExpanded ? '' : 'line-clamp-2'}`}>
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

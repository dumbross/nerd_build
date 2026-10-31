/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Swords, Flame, Sparkles, Shield, Zap } from 'lucide-react';
import { Character, WeaponItem } from '../../types/character';
import {
  calculateSpellAttackModifier,
  calculateSpellSaveDC,
  formatModifier,
  getAbilityModifier,
  getAbilityScoresTotal,
  getProficiencyBonus,
} from '../../utils/calculations';
import { rollDice } from '../../utils/diceRoller';

interface CombatTabProps {
  character: Character;
  onUpdateCharacter: (char: Character) => void;
  onQuickRoll: (sides: number, count?: number, modifier?: number, label?: string) => void;
}

export const CombatTab: React.FC<CombatTabProps> = ({
  character,
  onUpdateCharacter,
  onQuickRoll,
}) => {
  const abilities = getAbilityScoresTotal(character);
  const profBonus = getProficiencyBonus(character.level);

  const spellAbility = character.spellcastingAbility || 'int';
  const spellScore = abilities[spellAbility];
  const spellSaveDC = calculateSpellSaveDC(spellScore, profBonus);
  const spellAttackBonus = calculateSpellAttackModifier(spellScore, profBonus);

  // Helper to roll weapon attack
  const handleWeaponAttack = (weapon: WeaponItem) => {
    const isFinesse = weapon.properties?.some((p) => p.toLowerCase().includes('finesse'));
    const isRanged = weapon.category?.includes('Ranged');
    const ability = isRanged || (isFinesse && abilities.dex > abilities.str) ? 'dex' : 'str';
    const mod = getAbilityModifier(abilities[ability]);
    const atkBonus = mod + profBonus;

    onQuickRoll(20, 1, atkBonus, `${weapon.name} Attack Roll`);
  };

  // Helper to roll weapon damage
  const handleWeaponDamage = (weapon: WeaponItem) => {
    const isFinesse = weapon.properties?.some((p) => p.toLowerCase().includes('finesse'));
    const isRanged = weapon.category?.includes('Ranged');
    const ability = isRanged || (isFinesse && abilities.dex > abilities.str) ? 'dex' : 'str';
    const mod = getAbilityModifier(abilities[ability]);

    // Parse damage dice string like "1d8" or "2d6"
    const match = weapon.damage.match(/(\d+)d(\d+)/);
    if (match) {
      const count = parseInt(match[1]);
      const sides = parseInt(match[2]);
      onQuickRoll(sides, count, mod, `${weapon.name} Damage (${weapon.damageType})`);
    } else {
      onQuickRoll(6, 1, mod, `${weapon.name} Damage`);
    }
  };

  const handleToggleFeatureUse = (featureId: string, currentRemaining?: number, max?: number) => {
    if (max === undefined) return;
    const remaining = currentRemaining !== undefined ? currentRemaining : max;
    const nextVal = remaining > 0 ? remaining - 1 : max;

    const updated = (character.features || []).map((f) => {
      if (f.id === featureId) {
        return { ...f, usesRemaining: nextVal };
      }
      return f;
    });

    onUpdateCharacter({
      ...character,
      features: updated,
      updatedAt: new Date().toISOString(),
    });
  };

  const equippedWeapons = (character.weapons || []).filter((w) => w.equipped);
  const resourceFeatures = (character.features || []).filter(
    (f) =>
      f.usesMax ||
      f.name.includes('Rage') ||
      f.name.includes('Second Wind') ||
      f.name.includes('Action Surge') ||
      f.name.includes('Ki') ||
      f.name.includes('Channel Divinity')
  );

  return (
    <div className="space-y-6">
      {/* Spellcasting Quick Header if applicable */}
      {character.spellcastingAbility && (
        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold text-slate-200">
              Spellcasting ({character.spellcastingAbility.toUpperCase()})
            </span>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-xs">
              <span className="text-slate-400 mr-2">Spell Save DC:</span>
              <span className="font-mono font-bold text-amber-300 text-sm tabular-nums">
                {spellSaveDC}
              </span>
            </div>
            <div className="text-xs">
              <span className="text-slate-400 mr-2">Spell Attack Bonus:</span>
              <button
                onClick={() => onQuickRoll(20, 1, spellAttackBonus, 'Spell Attack Roll')}
                className="font-mono font-bold text-amber-300 hover:text-white text-sm tabular-nums underline"
              >
                {formatModifier(spellAttackBonus)}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Equipped Weapon Attacks Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Swords className="w-4 h-4 text-amber-400" />
            <span>Equipped Attacks ({equippedWeapons.length})</span>
          </h4>
          <span className="text-[11px] text-slate-500">
            Click 'Atk' to roll hit, click 'Dmg' to roll damage
          </span>
        </div>

        {equippedWeapons.length === 0 ? (
          <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 text-center text-xs text-slate-400">
            No weapons currently equipped. Go to the Equipment tab or 5e Compendium to equip weapons!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {equippedWeapons.map((weapon) => {
              const isFinesse = weapon.properties?.some((p) => p.toLowerCase().includes('finesse'));
              const isRanged = weapon.category?.includes('Ranged');
              const ability = isRanged || (isFinesse && abilities.dex > abilities.str) ? 'dex' : 'str';
              const mod = getAbilityModifier(abilities[ability]);
              const atkBonus = mod + profBonus;

              return (
                <div
                  key={weapon.id}
                  className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors flex flex-col justify-between"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-serif font-bold text-sm text-slate-100">
                        {weapon.name}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {weapon.category}
                        {weapon.range && ` · Range ${weapon.range}`}
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                      Equipped
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-400 mt-2">
                    {weapon.properties?.join(', ') || 'No special properties'}
                  </div>

                  <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-800">
                    <button
                      onClick={() => handleWeaponAttack(weapon)}
                      className="flex-1 py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-100 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors border border-slate-700/60"
                      title="Roll d20 + Attack Bonus"
                    >
                      <Zap className="w-3.5 h-3.5 text-amber-400" />
                      <span>Atk {formatModifier(atkBonus)}</span>
                    </button>

                    <button
                      onClick={() => handleWeaponDamage(weapon)}
                      className="flex-1 py-1.5 px-3 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors border border-amber-500/40"
                      title={`Roll ${weapon.damage} + ${mod}`}
                    >
                      <Flame className="w-3.5 h-3.5 text-amber-400" />
                      <span>
                        Dmg {weapon.damage}{formatModifier(mod)}
                      </span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Class Action Resources & Trackers */}
      {resourceFeatures.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Combat Features & Resource Trackers</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {resourceFeatures.map((feat) => {
              const maxUses = feat.usesMax || 1;
              const remaining = feat.usesRemaining !== undefined ? feat.usesRemaining : maxUses;

              return (
                <div
                  key={feat.id}
                  className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-200">{feat.name}</span>
                    <span className="text-[10px] font-mono font-bold text-amber-300 tabular-nums">
                      {remaining} / {maxUses}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                    {feat.description}
                  </p>

                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: maxUses }).map((_, i) => (
                        <div
                          key={i}
                          className={`w-3.5 h-3.5 rounded-full border ${
                            i < remaining
                              ? 'bg-amber-400 border-amber-300'
                              : 'bg-slate-950 border-slate-700'
                          }`}
                        />
                      ))}
                    </div>

                    <button
                      onClick={() => handleToggleFeatureUse(feat.id, feat.usesRemaining, feat.usesMax)}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-medium"
                    >
                      {remaining > 0 ? 'Use 1' : 'Reset'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

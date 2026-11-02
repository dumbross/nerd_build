/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Eye, Shield, Award } from 'lucide-react';
import { AbilityName, Character, SKILLS_LIST, SkillName } from '../../types/character';
import {
  calculatePassivePerception,
  formatModifier,
  getAbilityModifier,
  getAbilityScoresTotal,
  getProficiencyBonus,
  getSavingThrowModifier,
  getSkillModifier,
} from '../../utils/calculations';

interface AbilitiesSkillsColumnProps {
  character: Character;
  onUpdateCharacter: (char: Character) => void;
  onQuickRoll: (sides: number, count?: number, modifier?: number, label?: string) => void;
}

const ABILITIES_CONFIG: { key: AbilityName; label: string; full: string }[] = [
  { key: 'str', label: 'STR', full: 'Strength' },
  { key: 'dex', label: 'DEX', full: 'Dexterity' },
  { key: 'con', label: 'CON', full: 'Constitution' },
  { key: 'int', label: 'INT', full: 'Intelligence' },
  { key: 'wis', label: 'WIS', full: 'Wisdom' },
  { key: 'cha', label: 'CHA', full: 'Charisma' },
];

export const AbilitiesSkillsColumn: React.FC<AbilitiesSkillsColumnProps> = ({
  character,
  onUpdateCharacter,
  onQuickRoll,
}) => {
  const abilities = getAbilityScoresTotal(character);
  const profBonus = getProficiencyBonus(character.level);

  const passivePerception = calculatePassivePerception(
    abilities,
    character.skillProficiencies,
    character.skillExpertise,
    profBonus
  );

  const passiveInsight =
    10 + getSkillModifier('insight', abilities, character.skillProficiencies, character.skillExpertise, profBonus);
  const passiveInvestigation =
    10 + getSkillModifier('investigation', abilities, character.skillProficiencies, character.skillExpertise, profBonus);

  const handleToggleSavingThrow = (ab: AbilityName) => {
    const isProf = character.savingThrowProficiencies.includes(ab);
    const updated = isProf
      ? character.savingThrowProficiencies.filter((s) => s !== ab)
      : [...character.savingThrowProficiencies, ab];
    onUpdateCharacter({
      ...character,
      savingThrowProficiencies: updated,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleCycleSkillProficiency = (skillName: SkillName) => {
    const isProf = character.skillProficiencies.includes(skillName);
    const isExpert = character.skillExpertise.includes(skillName);

    let nextProf = [...character.skillProficiencies];
    let nextExpert = [...character.skillExpertise];

    if (!isProf && !isExpert) {
      nextProf.push(skillName);
    } else if (isProf && !isExpert) {
      nextExpert.push(skillName);
    } else {
      nextProf = nextProf.filter((s) => s !== skillName);
      nextExpert = nextExpert.filter((s) => s !== skillName);
    }

    onUpdateCharacter({
      ...character,
      skillProficiencies: nextProf,
      skillExpertise: nextExpert,
      updatedAt: new Date().toISOString(),
    });
  };

  return (
    <div className="space-y-4">
      {/* 6 Ability Score Cards */}
      <div className="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-3 gap-2">
        {ABILITIES_CONFIG.map((ab) => {
          const score = abilities[ab.key];
          const mod = getAbilityModifier(score);

          return (
            <div
              key={ab.key}
              onClick={() => onQuickRoll(20, 1, mod, `${ab.full} Check`)}
              className="p-3 rounded-xl bg-white border border-[#E5DFD5] hover:border-stone-400 hover:shadow-sm transition-all flex flex-col items-center justify-center text-center cursor-pointer group"
              title={`Click to roll ${ab.full} check (d20${formatModifier(mod)})`}
            >
              <span className="text-[10px] font-semibold tracking-wider text-stone-600 group-hover:text-stone-900">
                {ab.label}
              </span>
              <span className="text-2xl font-mono font-bold text-stone-900 my-0.5 tabular-nums">
                {formatModifier(mod)}
              </span>
              <span className="text-[11px] font-mono text-stone-600 tabular-nums">
                {score}
              </span>
            </div>
          );
        })}
      </div>

      {/* Saving Throws List */}
      <div className="p-4 rounded-2xl bg-white border border-[#E5DFD5] space-y-2.5 shadow-sm">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-stone-600 flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-stone-800">
            <Shield className="w-3.5 h-3.5 text-stone-600" />
            <span>Saving Throws</span>
          </span>
          <span className="text-[10px] text-stone-600 font-normal">Click to roll</span>
        </div>

        <div className="space-y-1">
          {ABILITIES_CONFIG.map((ab) => {
            const isProf = character.savingThrowProficiencies.includes(ab.key);
            const mod = getSavingThrowModifier(ab.key, abilities[ab.key], isProf, profBonus);

            return (
              <div
                key={ab.key}
                className="flex items-center justify-between p-1.5 rounded-lg hover:bg-[#FAF8F5] transition-colors text-xs group"
              >
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleSavingThrow(ab.key);
                    }}
                    className={`w-3.5 h-3.5 rounded-full border transition-all flex items-center justify-center ${
                      isProf
                        ? 'bg-[#B85D36] border-[#B85D36] text-white text-[8px]'
                        : 'border-stone-300 bg-white hover:border-stone-400'
                    }`}
                    title="Toggle Save Proficiency"
                  >
                    {isProf && '✓'}
                  </button>
                  <span
                    onClick={() => onQuickRoll(20, 1, mod, `${ab.full} Save`)}
                    className="cursor-pointer text-stone-800 group-hover:text-stone-950 font-medium"
                  >
                    {ab.full}
                  </span>
                </div>

                <button
                  onClick={() => onQuickRoll(20, 1, mod, `${ab.full} Save`)}
                  className="font-mono font-semibold text-stone-900 tabular-nums px-2 py-0.5 rounded-md bg-[#FAF8F5] border border-[#E8E3DA] hover:bg-stone-900 hover:text-white transition-colors"
                >
                  {formatModifier(mod)}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Skills List */}
      <div className="p-4 rounded-2xl bg-white border border-[#E5DFD5] space-y-2.5 shadow-sm">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-stone-600 flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-stone-800">
            <Award className="w-3.5 h-3.5 text-stone-600" />
            <span>Skills</span>
          </span>
          <span className="text-[10px] text-stone-600 font-normal">Click to roll</span>
        </div>

        <div className="space-y-0.5 max-h-[360px] overflow-y-auto pr-1">
          {SKILLS_LIST.map((s) => {
            const isProf = character.skillProficiencies.includes(s.name);
            const isExpert = character.skillExpertise.includes(s.name);
            const mod = getSkillModifier(s.name, abilities, character.skillProficiencies, character.skillExpertise, profBonus);

            return (
              <div
                key={s.name}
                className="flex items-center justify-between p-1.5 rounded-lg hover:bg-[#FAF8F5] transition-colors text-xs group"
              >
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCycleSkillProficiency(s.name)}
                    className={`w-3.5 h-3.5 rounded-full border transition-all flex items-center justify-center ${
                      isExpert
                        ? 'bg-stone-900 border-stone-900 text-white font-bold text-[8px]'
                        : isProf
                        ? 'bg-[#B85D36] border-[#B85D36] text-white font-bold text-[8px]'
                        : 'border-stone-300 bg-white hover:border-stone-400'
                    }`}
                    title="Cycle: Normal -> Proficient -> Expertise"
                  >
                    {isExpert ? '★' : isProf ? '✓' : ''}
                  </button>

                  <span
                    onClick={() => onQuickRoll(20, 1, mod, `${s.label} (${s.ability.toUpperCase()}) Check`)}
                    className="cursor-pointer text-stone-800 group-hover:text-stone-950 truncate max-w-[130px]"
                  >
                    {s.label}
                  </span>
                  <span className="text-[9px] text-stone-600 uppercase font-mono">
                    {s.ability}
                  </span>
                </div>

                <button
                  onClick={() => onQuickRoll(20, 1, mod, `${s.label} Check`)}
                  className="font-mono font-semibold text-stone-900 tabular-nums px-2 py-0.5 rounded-md bg-[#FAF8F5] border border-[#E8E3DA] hover:bg-stone-900 hover:text-white transition-colors"
                >
                  {formatModifier(mod)}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Passive Senses & Proficiencies Card */}
      <div className="p-4 rounded-2xl bg-white border border-[#E5DFD5] space-y-2.5 text-xs shadow-sm">
        <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-stone-600">
          <Eye className="w-3.5 h-3.5 text-stone-600" />
          <span>Passive Senses</span>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-stone-700">
            <span>Passive Perception</span>
            <span className="font-mono font-semibold text-stone-900 tabular-nums">{passivePerception}</span>
          </div>
          <div className="flex items-center justify-between text-stone-700">
            <span>Passive Insight</span>
            <span className="font-mono font-semibold text-stone-900 tabular-nums">{passiveInsight}</span>
          </div>
          <div className="flex items-center justify-between text-stone-700">
            <span>Passive Investigation</span>
            <span className="font-mono font-semibold text-stone-900 tabular-nums">{passiveInvestigation}</span>
          </div>
        </div>

        <div className="pt-2 border-t border-[#F0EBE1] text-[11px] text-stone-600 space-y-1">
          <div>
            <span className="text-stone-700 font-medium">Languages: </span>
            <span>{character.languages?.join(', ') || 'Common'}</span>
          </div>
          <div>
            <span className="text-stone-700 font-medium">Armor: </span>
            <span>{character.armorProficiencies?.join(', ') || 'None'}</span>
          </div>
          <div>
            <span className="text-stone-700 font-medium">Weapons: </span>
            <span>{character.weaponProficiencies?.join(', ') || 'None'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

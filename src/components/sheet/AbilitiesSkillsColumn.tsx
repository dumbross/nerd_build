/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Eye, Shield, Award, Sparkles } from 'lucide-react';
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

  // Toggle Saving Throw Proficiency
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

  // Toggle Skill Proficiency (Click cycle: None -> Proficient -> Expertise -> None)
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
      {/* 6 Ability Score Cards in 2x3 or 3x2 grid */}
      <div className="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-3 gap-2">
        {ABILITIES_CONFIG.map((ab) => {
          const score = abilities[ab.key];
          const mod = getAbilityModifier(score);

          return (
            <div
              key={ab.key}
              onClick={() => onQuickRoll(20, 1, mod, `${ab.full} Check`)}
              className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 hover:bg-slate-850 transition-all flex flex-col items-center justify-center text-center cursor-pointer group shadow-sm"
              title={`Click to roll ${ab.full} check (d20${formatModifier(mod)})`}
            >
              <span className="text-[10px] font-bold tracking-wider text-slate-400 group-hover:text-amber-300">
                {ab.label}
              </span>
              <span className="text-2xl font-mono font-black text-amber-300 my-0.5 tabular-nums">
                {formatModifier(mod)}
              </span>
              <span className="text-[11px] font-mono text-slate-400 tabular-nums">
                {score}
              </span>
            </div>
          );
        })}
      </div>

      {/* Saving Throws List */}
      <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-amber-400" />
            <span>Saving Throws</span>
          </span>
          <span className="text-[9px] text-slate-500 font-normal">Click to roll</span>
        </div>

        <div className="space-y-1">
          {ABILITIES_CONFIG.map((ab) => {
            const isProf = character.savingThrowProficiencies.includes(ab.key);
            const mod = getSavingThrowModifier(ab.key, abilities[ab.key], isProf, profBonus);

            return (
              <div
                key={ab.key}
                className="flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-800/60 transition-colors text-xs group"
              >
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleSavingThrow(ab.key);
                    }}
                    className={`w-3.5 h-3.5 rounded-full border transition-colors flex items-center justify-center ${
                      isProf
                        ? 'bg-amber-400 border-amber-300 text-slate-950 font-bold text-[8px]'
                        : 'border-slate-700 bg-slate-950 hover:border-slate-500'
                    }`}
                    title="Toggle Save Proficiency"
                  >
                    {isProf && '✓'}
                  </button>
                  <span
                    onClick={() => onQuickRoll(20, 1, mod, `${ab.full} Save`)}
                    className="cursor-pointer text-slate-300 group-hover:text-amber-200 font-medium"
                  >
                    {ab.full}
                  </span>
                </div>

                <button
                  onClick={() => onQuickRoll(20, 1, mod, `${ab.full} Save`)}
                  className="font-mono font-bold text-amber-300 hover:text-white tabular-nums px-1.5 py-0.5 rounded bg-slate-950/60 border border-slate-800"
                >
                  {formatModifier(mod)}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Skills List */}
      <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>Skills</span>
          </span>
          <span className="text-[9px] text-slate-500 font-normal">Click name to roll</span>
        </div>

        <div className="space-y-0.5 max-h-[380px] overflow-y-auto pr-1">
          {SKILLS_LIST.map((s) => {
            const isProf = character.skillProficiencies.includes(s.name);
            const isExpert = character.skillExpertise.includes(s.name);
            const mod = getSkillModifier(s.name, abilities, character.skillProficiencies, character.skillExpertise, profBonus);

            return (
              <div
                key={s.name}
                className="flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-800/60 transition-colors text-xs group"
              >
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCycleSkillProficiency(s.name)}
                    className={`w-3.5 h-3.5 rounded-full border transition-colors flex items-center justify-center ${
                      isExpert
                        ? 'bg-amber-400 border-amber-300 text-slate-950 font-bold text-[9px]'
                        : isProf
                        ? 'bg-slate-300 border-white text-slate-950 font-bold text-[8px]'
                        : 'border-slate-700 bg-slate-950 hover:border-slate-500'
                    }`}
                    title="Cycle: Normal -> Proficient -> Expertise"
                  >
                    {isExpert ? '★' : isProf ? '✓' : ''}
                  </button>

                  <span
                    onClick={() => onQuickRoll(20, 1, mod, `${s.label} (${s.ability.toUpperCase()}) Check`)}
                    className="cursor-pointer text-slate-300 group-hover:text-amber-200 truncate max-w-[130px]"
                  >
                    {s.label}
                  </span>
                  <span className="text-[9px] text-slate-500 uppercase font-mono">
                    {s.ability}
                  </span>
                </div>

                <button
                  onClick={() => onQuickRoll(20, 1, mod, `${s.label} Check`)}
                  className="font-mono font-bold text-amber-300 hover:text-white tabular-nums px-1.5 py-0.5 rounded bg-slate-950/60 border border-slate-800"
                >
                  {formatModifier(mod)}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Passive Senses & Proficiencies Card */}
      <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
        <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          <Eye className="w-3.5 h-3.5 text-amber-400" />
          <span>Passive Senses</span>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-slate-300">
            <span>Passive Perception</span>
            <span className="font-mono font-bold text-amber-300 tabular-nums">{passivePerception}</span>
          </div>
          <div className="flex items-center justify-between text-slate-300">
            <span>Passive Insight</span>
            <span className="font-mono font-bold text-amber-300 tabular-nums">{passiveInsight}</span>
          </div>
          <div className="flex items-center justify-between text-slate-300">
            <span>Passive Investigation</span>
            <span className="font-mono font-bold text-amber-300 tabular-nums">{passiveInvestigation}</span>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 space-y-1">
          <div>
            <span className="text-slate-500 font-semibold">Languages: </span>
            <span>{character.languages?.join(', ') || 'Common'}</span>
          </div>
          <div>
            <span className="text-slate-500 font-semibold">Armor: </span>
            <span>{character.armorProficiencies?.join(', ') || 'None'}</span>
          </div>
          <div>
            <span className="text-slate-500 font-semibold">Weapons: </span>
            <span>{character.weaponProficiencies?.join(', ') || 'None'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

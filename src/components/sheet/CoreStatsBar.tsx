/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Shield,
  Zap,
  Footprints,
  Heart,
  Plus,
  Minus,
  Sparkles,
  Bed,
  Moon,
  Skull,
  Crosshair,
} from 'lucide-react';
import { Character } from '../../types/character';
import { FIVE_TOOLS_CLASSES } from '../../data/classes';
import {
  calculateArmorClass,
  formatModifier,
  getAbilityModifier,
  getAbilityScoresTotal,
  getProficiencyBonus,
} from '../../utils/calculations';
import { rollDice } from '../../utils/diceRoller';

interface CoreStatsBarProps {
  character: Character;
  onUpdateCharacter: (char: Character) => void;
  onQuickRoll: (sides: number, count?: number, modifier?: number, label?: string) => void;
}

export const CoreStatsBar: React.FC<CoreStatsBarProps> = ({
  character,
  onUpdateCharacter,
  onQuickRoll,
}) => {
  const [hpInput, setHpInput] = useState<string>('5');

  const abilities = getAbilityScoresTotal(character);
  const profBonus = getProficiencyBonus(character.level);
  const dexMod = getAbilityModifier(abilities.dex);
  const initiative = dexMod + (character.initiativeBonus || 0);
  const ac = calculateArmorClass(character.armor, abilities.dex);

  const hpPercent = Math.min(100, Math.max(0, (character.hpCurrent / character.hpMax) * 100));

  const handleAdjustHp = (delta: number) => {
    const newHp = Math.min(character.hpMax, Math.max(0, character.hpCurrent + delta));
    onUpdateCharacter({
      ...character,
      hpCurrent: newHp,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleApplyHpInput = (isDamage: boolean) => {
    const val = parseInt(hpInput) || 0;
    if (val <= 0) return;
    if (isDamage) {
      handleAdjustHp(-val);
    } else {
      handleAdjustHp(val);
    }
  };

  const handleShortRest = () => {
    // Regain short rest features (Second Wind, Action Surge, etc.)
    const updatedFeatures = (character.features || []).map((f) => {
      if (f.usesMax && (f.name.includes('Second Wind') || f.name.includes('Action Surge') || f.name.includes('Ki') || f.name.includes('Channel Divinity'))) {
        return { ...f, usesRemaining: f.usesMax };
      }
      return f;
    });

    // Roll 1 hit die to heal if available
    let healedHp = character.hpCurrent;
    let spent = character.hitDiceSpent || 0;
    if (spent < character.hitDiceTotal) {
      spent += 1;
      const classObj = FIVE_TOOLS_CLASSES.find((c) => c.name.toLowerCase() === character.className.toLowerCase());
      const dieSides = classObj?.hd.faces || 8;
      const conMod = getAbilityModifier(abilities.con);
      const roll = rollDice(dieSides, 1, conMod, 'Hit Die Recovery');
      healedHp = Math.min(character.hpMax, character.hpCurrent + Math.max(1, roll.total));
      onQuickRoll(dieSides, 1, conMod, `Short Rest Hit Die (d${dieSides}+${conMod})`);
    }

    onUpdateCharacter({
      ...character,
      hpCurrent: healedHp,
      hitDiceSpent: spent,
      features: updatedFeatures,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleLongRest = () => {
    // Reset HP, hit dice, spell slots, and feature uses
    const resetFeatures = (character.features || []).map((f) => ({
      ...f,
      usesRemaining: f.usesMax,
    }));

    onUpdateCharacter({
      ...character,
      hpCurrent: character.hpMax,
      tempHp: 0,
      hitDiceSpent: 0,
      spellSlotsExpended: [0, 0, 0, 0, 0, 0, 0, 0, 0],
      deathSaves: { successes: 0, failures: 0 },
      features: resetFeatures,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleToggleDeathSave = (type: 'successes' | 'failures', index: number) => {
    const current = character.deathSaves?.[type] || 0;
    const nextVal = current === index ? index - 1 : index;
    onUpdateCharacter({
      ...character,
      deathSaves: {
        ...character.deathSaves,
        [type]: Math.max(0, Math.min(3, nextVal)),
      },
      updatedAt: new Date().toISOString(),
    });
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
      {/* Top Meta Line & Rests */}
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="font-serif text-2xl font-black text-amber-100 tracking-wide">
              {character.name}
            </h2>
            <button
              onClick={() =>
                onUpdateCharacter({
                  ...character,
                  inspiration: !character.inspiration,
                  updatedAt: new Date().toISOString(),
                })
              }
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border ${
                character.inspiration
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/30'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-amber-300'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Inspiration</span>
            </button>
          </div>
          <div className="text-xs text-slate-400 mt-1 flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-amber-300">
              Level {character.level} {character.className}
            </span>
            {character.subclass && <span>({character.subclass})</span>}
            <span>·</span>
            <span>{character.race} {character.subrace ? `(${character.subrace})` : ''}</span>
            <span>·</span>
            <span>{character.background}</span>
            <span>·</span>
            <span>{character.alignment}</span>
          </div>
        </div>

        {/* Rest Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleShortRest}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700/60"
            title="Short Rest (Heal via Hit Die & recharge short-rest abilities)"
          >
            <Bed className="w-4 h-4 text-amber-400" />
            <span>Short Rest</span>
          </button>
          <button
            onClick={handleLongRest}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700/60"
            title="Long Rest (Full heal, restore hit dice, recover spell slots)"
          >
            <Moon className="w-4 h-4 text-indigo-400" />
            <span>Long Rest</span>
          </button>
        </div>
      </div>

      {/* Main Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
        {/* Armor Class */}
        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col items-center justify-center text-center">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            <Shield className="w-3.5 h-3.5 text-amber-400" />
            <span>Armor Class</span>
          </div>
          <div className="text-3xl font-mono font-black text-slate-100 tabular-nums">
            {ac}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            {character.armor?.find((a) => a.equipped)?.name || 'Natural / Unarmored'}
          </div>
        </div>

        {/* Initiative */}
        <div
          onClick={() => onQuickRoll(20, 1, initiative, 'Initiative Check')}
          className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col items-center justify-center text-center cursor-pointer hover:border-amber-500/50 hover:bg-slate-900 transition-all group"
          title="Click to roll Initiative!"
        >
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 group-hover:text-amber-400">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Initiative</span>
          </div>
          <div className="text-3xl font-mono font-black text-slate-100 group-hover:text-amber-300 tabular-nums">
            {formatModifier(initiative)}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5 group-hover:text-amber-400/80">
            Click to Roll d20
          </div>
        </div>

        {/* Speed */}
        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col items-center justify-center text-center">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            <Footprints className="w-3.5 h-3.5 text-amber-400" />
            <span>Speed</span>
          </div>
          <div className="text-3xl font-mono font-black text-slate-100 tabular-nums">
            {character.speed}
            <span className="text-xs font-normal text-slate-400 ml-1">ft</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Walking Base</div>
        </div>

        {/* Proficiency Bonus */}
        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col items-center justify-center text-center">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Proficiency
          </div>
          <div className="text-3xl font-mono font-black text-amber-400 tabular-nums">
            {formatModifier(profBonus)}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Tier {Math.ceil(character.level / 4)}</div>
        </div>

        {/* Hit Points Bar & Quick Controls */}
        <div className="col-span-2 p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500/20" />
              <span>Hit Points</span>
            </span>
            <span className="font-mono font-bold text-sm text-slate-200 tabular-nums">
              {character.hpCurrent} / {character.hpMax}
              {character.tempHp > 0 && (
                <span className="text-blue-400 font-semibold ml-1.5">(+{character.tempHp} temp)</span>
              )}
            </span>
          </div>

          {/* Health Bar */}
          <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden my-2">
            <div
              className={`h-full transition-all duration-300 rounded-full ${
                hpPercent > 50 ? 'bg-emerald-500' : hpPercent > 25 ? 'bg-amber-500' : 'bg-rose-500'
              }`}
              style={{ width: `${hpPercent}%` }}
            />
          </div>

          {/* Quick HP Heal / Damage Controls */}
          <div className="flex items-center justify-between gap-2 pt-1">
            <div className="flex items-center gap-1">
              <button
                onClick={() => handleAdjustHp(-1)}
                className="w-6 h-6 rounded bg-slate-800 hover:bg-rose-900/60 text-slate-200 text-xs font-bold"
                title="Damage 1 HP"
              >
                -1
              </button>
              <button
                onClick={() => handleAdjustHp(-5)}
                className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-rose-900/60 text-slate-200 text-xs font-bold"
                title="Damage 5 HP"
              >
                -5
              </button>
            </div>

            <div className="flex items-center gap-1">
              <input
                type="number"
                value={hpInput}
                onChange={(e) => setHpInput(e.target.value)}
                className="w-12 px-1.5 py-0.5 bg-slate-900 border border-slate-700 rounded text-center text-xs font-mono font-bold text-slate-200 focus:outline-none"
                min="1"
              />
              <button
                onClick={() => handleApplyHpInput(true)}
                className="px-2 py-0.5 rounded bg-rose-600/30 hover:bg-rose-600/50 text-rose-300 border border-rose-500/40 text-[11px] font-bold"
              >
                Dmg
              </button>
              <button
                onClick={() => handleApplyHpInput(false)}
                className="px-2 py-0.5 rounded bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold"
              >
                Heal
              </button>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => handleAdjustHp(5)}
                className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-emerald-900/60 text-slate-200 text-xs font-bold"
                title="Heal 5 HP"
              >
                +5
              </button>
              <button
                onClick={() => handleAdjustHp(1)}
                className="w-6 h-6 rounded bg-slate-800 hover:bg-emerald-900/60 text-slate-200 text-xs font-bold"
                title="Heal 1 HP"
              >
                +1
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Hit Dice & Death Saves Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        {/* Hit Dice */}
        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Hit Dice
            </span>
            <div className="font-mono font-bold text-slate-200 text-sm mt-0.5">
              {character.level - (character.hitDiceSpent || 0)} / {character.level} (d
              {FIVE_TOOLS_CLASSES.find((c) => c.name.toLowerCase() === character.className.toLowerCase())?.hd.faces || 8})
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                if ((character.hitDiceSpent || 0) < character.level) {
                  onUpdateCharacter({
                    ...character,
                    hitDiceSpent: (character.hitDiceSpent || 0) + 1,
                    updatedAt: new Date().toISOString(),
                  });
                }
              }}
              disabled={(character.hitDiceSpent || 0) >= character.level}
              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium disabled:opacity-40"
            >
              Spend Die
            </button>
          </div>
        </div>

        {/* Death Saves */}
        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-slate-400 text-[10px]">
            <Skull className="w-3.5 h-3.5 text-slate-400" />
            <span>Death Saves</span>
          </div>

          <div className="flex items-center gap-4">
            {/* Successes */}
            <div className="flex items-center gap-1">
              <span className="text-[10px] text-emerald-400 font-bold mr-1">SUCC</span>
              {[1, 2, 3].map((idx) => (
                <button
                  key={idx}
                  onClick={() => handleToggleDeathSave('successes', idx)}
                  className={`w-4 h-4 rounded-full border transition-colors ${
                    (character.deathSaves?.successes || 0) >= idx
                      ? 'bg-emerald-500 border-emerald-400 shadow-sm shadow-emerald-500/50'
                      : 'border-slate-700 bg-slate-900 hover:border-slate-500'
                  }`}
                />
              ))}
            </div>

            {/* Failures */}
            <div className="flex items-center gap-1">
              <span className="text-[10px] text-rose-400 font-bold mr-1">FAIL</span>
              {[1, 2, 3].map((idx) => (
                <button
                  key={idx}
                  onClick={() => handleToggleDeathSave('failures', idx)}
                  className={`w-4 h-4 rounded-full border transition-colors ${
                    (character.deathSaves?.failures || 0) >= idx
                      ? 'bg-rose-500 border-rose-400 shadow-sm shadow-rose-500/50'
                      : 'border-slate-700 bg-slate-900 hover:border-slate-500'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

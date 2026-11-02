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
    const updatedFeatures = (character.features || []).map((f) => {
      if (
        f.usesMax &&
        (f.name.includes('Second Wind') ||
          f.name.includes('Action Surge') ||
          f.name.includes('Ki') ||
          f.name.includes('Channel Divinity'))
      ) {
        return { ...f, usesRemaining: f.usesMax };
      }
      return f;
    });

    let healedHp = character.hpCurrent;
    let spent = character.hitDiceSpent || 0;
    if (spent < character.hitDiceTotal) {
      spent += 1;
      const classObj = FIVE_TOOLS_CLASSES.find((c) => c.name.toLowerCase() === character.className.toLowerCase());
      const dieSides = classObj?.hd.faces || 8;
      const conMod = getAbilityModifier(abilities.con);
      const roll = rollDice(dieSides, 1, conMod, 'Hit Die Recovery');
      healedHp = Math.min(character.hpMax, character.hpCurrent + Math.max(1, roll.total));
      onQuickRoll(dieSides, 1, conMod, `Short Rest Hit Die (d${dieSides}${formatModifier(conMod)})`);
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
    <div className="bg-white border border-[#E5DFD5] rounded-2xl p-5 sm:p-6 shadow-sm space-y-5">
      {/* Top Meta Line & Rests */}
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-[#E8E3DA] pb-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-stone-900 tracking-tight">
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
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 border ${
                character.inspiration
                  ? 'bg-stone-900 text-white border-stone-900 shadow-sm'
                  : 'bg-[#FAF8F5] border-[#E0D9CE] text-stone-600 hover:text-stone-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#B85D36]" />
              <span>Inspiration</span>
            </button>
          </div>
          <div className="text-xs text-stone-600 mt-1 flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-stone-900">
              Level {character.level} {character.className}
            </span>
            {character.subclass && <span>({character.subclass})</span>}
            <span className="text-stone-300">·</span>
            <span>{character.race}{character.subrace ? ` (${character.subrace})` : ''}</span>
            <span className="text-stone-300">·</span>
            <span>{character.background}</span>
            <span className="text-stone-300">·</span>
            <span>{character.alignment}</span>
          </div>
        </div>

        {/* Rest Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleShortRest}
            className="px-3 py-1.5 rounded-xl bg-white hover:bg-stone-50 text-stone-800 text-xs font-medium flex items-center gap-1.5 transition-all border border-[#DDD5C7] shadow-sm"
            title="Short Rest (Heal via Hit Die & recharge abilities)"
          >
            <Bed className="w-3.5 h-3.5 text-stone-600" />
            <span>Short Rest</span>
          </button>
          <button
            onClick={handleLongRest}
            className="px-3 py-1.5 rounded-xl bg-white hover:bg-stone-50 text-stone-800 text-xs font-medium flex items-center gap-1.5 transition-all border border-[#DDD5C7] shadow-sm"
            title="Long Rest (Full heal, restore hit dice, recover spell slots)"
          >
            <Moon className="w-3.5 h-3.5 text-[#B85D36]" />
            <span>Long Rest</span>
          </button>
        </div>
      </div>

      {/* Main Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
        {/* Armor Class */}
        <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E5DFD5] flex flex-col items-center justify-center text-center shadow-sm">
          <div className="flex items-center gap-1 text-[10px] font-semibold text-stone-600 uppercase tracking-wider mb-1">
            <Shield className="w-3.5 h-3.5 text-stone-600" />
            <span>Armor Class</span>
          </div>
          <div className="text-3xl font-mono font-bold text-stone-900 tabular-nums">
            {ac}
          </div>
          <div className="text-[10px] text-stone-600 mt-0.5 truncate max-w-full">
            {character.armor?.find((a) => a.equipped)?.name || 'Natural / Unarmored'}
          </div>
        </div>

        {/* Initiative */}
        <div
          onClick={() => onQuickRoll(20, 1, initiative, 'Initiative Check')}
          className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E5DFD5] flex flex-col items-center justify-center text-center cursor-pointer hover:border-stone-400 hover:bg-white transition-all group shadow-sm"
          title="Click to roll Initiative!"
        >
          <div className="flex items-center gap-1 text-[10px] font-semibold text-stone-600 uppercase tracking-wider mb-1 group-hover:text-stone-900">
            <Zap className="w-3.5 h-3.5 text-[#B85D36]" />
            <span>Initiative</span>
          </div>
          <div className="text-3xl font-mono font-bold text-stone-900 tabular-nums">
            {formatModifier(initiative)}
          </div>
          <div className="text-[10px] text-stone-600 mt-0.5 group-hover:text-stone-900">
            Roll d20
          </div>
        </div>

        {/* Speed */}
        <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E5DFD5] flex flex-col items-center justify-center text-center shadow-sm">
          <div className="flex items-center gap-1 text-[10px] font-semibold text-stone-600 uppercase tracking-wider mb-1">
            <Footprints className="w-3.5 h-3.5 text-stone-600" />
            <span>Speed</span>
          </div>
          <div className="text-3xl font-mono font-bold text-stone-900 tabular-nums">
            {character.speed}
            <span className="text-xs font-normal text-stone-600 ml-1">ft</span>
          </div>
          <div className="text-[10px] text-stone-600 mt-0.5">Walking Base</div>
        </div>

        {/* Proficiency Bonus */}
        <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E5DFD5] flex flex-col items-center justify-center text-center shadow-sm">
          <div className="text-[10px] font-semibold text-stone-600 uppercase tracking-wider mb-1">
            Proficiency
          </div>
          <div className="text-3xl font-mono font-bold text-[#B85D36] tabular-nums">
            {formatModifier(profBonus)}
          </div>
          <div className="text-[10px] text-stone-600 mt-0.5">Tier {Math.ceil(character.level / 4)}</div>
        </div>

        {/* Hit Points Bar & Quick Controls */}
        <div className="col-span-2 p-4 rounded-xl bg-[#FAF8F5] border border-[#E5DFD5] flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-[#2E4A3E]" />
              <span>Hit Points</span>
            </span>
            <span className="font-mono font-bold text-sm text-stone-900 tabular-nums">
              {character.hpCurrent} / {character.hpMax}
              {character.tempHp > 0 && (
                <span className="text-[#B85D36] font-semibold ml-1.5">(+{character.tempHp} temp)</span>
              )}
            </span>
          </div>

          {/* Health Bar */}
          <div className="w-full bg-[#E5DFD5] h-2 rounded-full overflow-hidden my-2">
            <div
              className={`h-full transition-all duration-300 rounded-full ${
                hpPercent > 50 ? 'bg-[#2E4A3E]' : hpPercent > 25 ? 'bg-[#B85D36]' : 'bg-rose-700'
              }`}
              style={{ width: `${hpPercent}%` }}
            />
          </div>

          {/* Quick HP Controls */}
          <div className="flex items-center justify-between gap-1.5 pt-1">
            <div className="flex items-center gap-1">
              <button
                onClick={() => handleAdjustHp(-1)}
                className="w-6 h-6 rounded-lg bg-white hover:bg-stone-100 text-stone-800 border border-[#DDD5C7] text-xs font-semibold shadow-sm"
                title="Damage 1 HP"
              >
                -1
              </button>
              <button
                onClick={() => handleAdjustHp(-5)}
                className="px-1.5 py-0.5 rounded-lg bg-white hover:bg-stone-100 text-stone-800 border border-[#DDD5C7] text-xs font-semibold shadow-sm"
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
                className="w-11 px-1.5 py-0.5 bg-white border border-[#DDD5C7] rounded-lg text-center text-xs font-mono font-bold text-stone-900 focus:outline-none"
                min="1"
              />
              <button
                onClick={() => handleApplyHpInput(true)}
                className="px-2 py-0.5 rounded-lg bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 text-[11px] font-semibold shadow-sm"
              >
                Dmg
              </button>
              <button
                onClick={() => handleApplyHpInput(false)}
                className="px-2 py-0.5 rounded-lg bg-white hover:bg-emerald-50 text-[#2E4A3E] border border-emerald-200 text-[11px] font-semibold shadow-sm"
              >
                Heal
              </button>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => handleAdjustHp(5)}
                className="px-1.5 py-0.5 rounded-lg bg-white hover:bg-stone-100 text-stone-800 border border-[#DDD5C7] text-xs font-semibold shadow-sm"
                title="Heal 5 HP"
              >
                +5
              </button>
              <button
                onClick={() => handleAdjustHp(1)}
                className="w-6 h-6 rounded-lg bg-white hover:bg-stone-100 text-stone-800 border border-[#DDD5C7] text-xs font-semibold shadow-sm"
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
        <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E5DFD5] flex items-center justify-between text-xs shadow-sm">
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-600 block">
              Hit Dice
            </span>
            <div className="font-mono font-bold text-stone-900 text-sm mt-0.5">
              {character.level - (character.hitDiceSpent || 0)} / {character.level} (d
              {FIVE_TOOLS_CLASSES.find((c) => c.name.toLowerCase() === character.className.toLowerCase())?.hd.faces || 8})
            </div>
          </div>
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
            className="px-3 py-1 rounded-lg bg-white hover:bg-stone-50 border border-[#DDD5C7] text-stone-800 text-xs font-medium disabled:opacity-40 shadow-sm"
          >
            Spend Die
          </button>
        </div>

        {/* Death Saves */}
        <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E5DFD5] flex items-center justify-between text-xs shadow-sm">
          <div className="flex items-center gap-1.5 font-semibold uppercase tracking-wider text-stone-600 text-[10px]">
            <Skull className="w-3.5 h-3.5 text-stone-600" />
            <span>Death Saves</span>
          </div>

          <div className="flex items-center gap-4">
            {/* Successes */}
            <div className="flex items-center gap-1">
              <span className="text-[10px] text-[#2E4A3E] font-semibold mr-1">SUCC</span>
              {[1, 2, 3].map((idx) => (
                <button
                  key={idx}
                  onClick={() => handleToggleDeathSave('successes', idx)}
                  className={`w-4 h-4 rounded-full border transition-all ${
                    (character.deathSaves?.successes || 0) >= idx
                      ? 'bg-[#2E4A3E] border-[#2E4A3E]'
                      : 'border-stone-300 bg-white hover:border-stone-500'
                  }`}
                />
              ))}
            </div>

            {/* Failures */}
            <div className="flex items-center gap-1">
              <span className="text-[10px] text-rose-600 font-semibold mr-1">FAIL</span>
              {[1, 2, 3].map((idx) => (
                <button
                  key={idx}
                  onClick={() => handleToggleDeathSave('failures', idx)}
                  className={`w-4 h-4 rounded-full border transition-all ${
                    (character.deathSaves?.failures || 0) >= idx
                      ? 'bg-rose-700 border-rose-700'
                      : 'border-stone-300 bg-white hover:border-stone-500'
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

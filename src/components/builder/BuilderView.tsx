/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Shield,
  Swords,
  Sparkles,
  User,
  Backpack,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  FileDown,
  Dices,
  Search,
  Plus,
  Trash2,
  Lock,
  Unlock,
  AlertTriangle,
  Info,
  Check,
} from 'lucide-react';
import { Character, AbilityScores, WeaponItem, ArmorItem, GearItem, Spell } from '../../types/character';
import { FIVE_TOOLS_RACES } from '../../data/races';
import { FIVE_TOOLS_CLASSES } from '../../data/classes';
import { FIVE_TOOLS_BACKGROUNDS } from '../../data/backgrounds';
import { FIVE_TOOLS_WEAPONS, FIVE_TOOLS_ARMOR, FIVE_TOOLS_STANDARD_GEAR } from '../../data/equipment';
import { FIVE_TOOLS_SPELLS } from '../../data/spells';
import { EquipmentArmoryModal } from '../EquipmentArmoryModal';
import {
  calculateArmorClass,
  calculatePassivePerception,
  calculatePointBuyUsed,
  formatModifier,
  getAbilityModifier,
  getAbilityScoresTotal,
  getClassSpellSlots,
  getMaxSpellLevel,
  isSpellcastingClass,
  isSpellEligible,
  getProficiencyBonus,
  POINT_BUY_COST,
} from '../../utils/calculations';
import { clean5eToolsText, render5eToolsEntries } from '../../utils/5eParser';
import { roll4d6DropLowest } from '../../utils/diceRoller';

interface BuilderViewProps {
  character: Character;
  onUpdateCharacter: (char: Character) => void;
  onSwitchToSheet: () => void;
  onExportPdf: () => void;
  isExportingPdf: boolean;
}

const STEPS = [
  { id: 'race', label: '1. Race / Species', icon: Shield },
  { id: 'class', label: '2. Class & Subclass', icon: Swords },
  { id: 'abilities', label: '3. Ability Scores', icon: Dices },
  { id: 'background', label: '4. Background & Identity', icon: User },
  { id: 'equipment', label: '5. Equipment & Gear', icon: Backpack },
  { id: 'spells', label: '6. Spells & Grimoire', icon: Sparkles },
  { id: 'review', label: '7. Review & Export', icon: CheckCircle2 },
];

export const BuilderView: React.FC<BuilderViewProps> = ({
  character,
  onUpdateCharacter,
  onSwitchToSheet,
  onExportPdf,
  isExportingPdf,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isArmoryModalOpen, setIsArmoryModalOpen] = useState(false);
  const [builderGearSearch, setBuilderGearSearch] = useState('');
  const [builderGearTab, setBuilderGearTab] = useState<'weapons' | 'armor' | 'gear'>('weapons');
  const [spellSearch, setSpellSearch] = useState('');
  const [spellLevelFilter, setSpellLevelFilter] = useState<string>('eligible');
  const [filterClassOnly, setFilterClassOnly] = useState<boolean>(true);
  const [spellNotice, setSpellNotice] = useState<string | null>(null);

  const selectedRaceObj = FIVE_TOOLS_RACES.find((r) => r.name.toLowerCase() === character.race.toLowerCase()) || FIVE_TOOLS_RACES[0];
  const selectedClassObj = FIVE_TOOLS_CLASSES.find((c) => c.name.toLowerCase() === character.className.toLowerCase()) || FIVE_TOOLS_CLASSES[4];
  const selectedBgObj = FIVE_TOOLS_BACKGROUNDS.find((b) => b.name.toLowerCase() === character.background.toLowerCase()) || FIVE_TOOLS_BACKGROUNDS[0];

  // Helper update
  const update = (patch: Partial<Character>) => {
    onUpdateCharacter({
      ...character,
      ...patch,
      updatedAt: new Date().toISOString(),
    });
  };

  // Step 1: Select Race
  const handleSelectRace = (raceName: string) => {
    const race = FIVE_TOOLS_RACES.find((r) => r.name === raceName);
    if (!race) return;

    const defaultSubrace = race.subraces?.[0]?.name;
    const racialBonuses: Partial<AbilityScores> = {};

    // Apply race ability bonus
    if (race.ability?.[0]) {
      const b = race.ability[0];
      if (b.str) racialBonuses.str = b.str;
      if (b.dex) racialBonuses.dex = b.dex;
      if (b.con) racialBonuses.con = b.con;
      if (b.int) racialBonuses.int = b.int;
      if (b.wis) racialBonuses.wis = b.wis;
      if (b.cha) racialBonuses.cha = b.cha;
    }

    // Apply subrace bonus if any
    if (defaultSubrace && race.subraces?.[0]?.ability?.[0]) {
      const sb = race.subraces[0].ability[0];
      if (sb.str) racialBonuses.str = (racialBonuses.str || 0) + sb.str;
      if (sb.dex) racialBonuses.dex = (racialBonuses.dex || 0) + sb.dex;
      if (sb.con) racialBonuses.con = (racialBonuses.con || 0) + sb.con;
      if (sb.int) racialBonuses.int = (racialBonuses.int || 0) + sb.int;
      if (sb.wis) racialBonuses.wis = (racialBonuses.wis || 0) + sb.wis;
      if (sb.cha) racialBonuses.cha = (racialBonuses.cha || 0) + sb.cha;
    }

    const traits = (race.traits || []).map((t, i) => {
      const entry = race.entries?.[i + 1];
      const descStr = typeof entry === 'string' ? entry : entry ? render5eToolsEntries([entry]) : `${t} racial trait`;
      return {
        id: `r_trait_${i}`,
        name: t,
        source: 'Race' as const,
        description: clean5eToolsText(descStr),
      };
    });

    update({
      race: race.name,
      subrace: defaultSubrace,
      speed: typeof race.speed === 'number' ? race.speed : 30,
      customAbilityBonuses: racialBonuses,
      languages: race.languages || ['Common'],
      features: [
        ...character.features.filter((f) => f.source !== 'Race'),
        ...traits,
      ],
    });
  };

  const handleSelectSubrace = (subraceName: string) => {
    const subrace = selectedRaceObj.subraces?.find((s) => s.name === subraceName);
    if (!subrace) return;

    const racialBonuses: Partial<AbilityScores> = {};
    if (selectedRaceObj.ability?.[0]) {
      const b = selectedRaceObj.ability[0];
      if (b.str) racialBonuses.str = b.str;
      if (b.dex) racialBonuses.dex = b.dex;
      if (b.con) racialBonuses.con = b.con;
      if (b.int) racialBonuses.int = b.int;
      if (b.wis) racialBonuses.wis = b.wis;
      if (b.cha) racialBonuses.cha = b.cha;
    }
    if (subrace.ability?.[0]) {
      const sb = subrace.ability[0];
      if (sb.str) racialBonuses.str = (racialBonuses.str || 0) + sb.str;
      if (sb.dex) racialBonuses.dex = (racialBonuses.dex || 0) + sb.dex;
      if (sb.con) racialBonuses.con = (racialBonuses.con || 0) + sb.con;
      if (sb.int) racialBonuses.int = (racialBonuses.int || 0) + sb.int;
      if (sb.wis) racialBonuses.wis = (racialBonuses.wis || 0) + sb.wis;
      if (sb.cha) racialBonuses.cha = (racialBonuses.cha || 0) + sb.cha;
    }

    update({
      subrace: subrace.name,
      speed: subrace.speed || (typeof selectedRaceObj.speed === 'number' ? selectedRaceObj.speed : 30),
      customAbilityBonuses: racialBonuses,
    });
  };

  // Step 2: Select Class
  const handleSelectClass = (className: string) => {
    const c = FIVE_TOOLS_CLASSES.find((cl) => cl.name === className);
    if (!c) return;

    const defaultSub = c.subclasses?.[0]?.name;
    const conMod = getAbilityModifier(character.baseAbilities.con + (character.customAbilityBonuses?.con || 0));
    const baseHp = c.hd.faces + conMod + (character.level - 1) * (Math.floor(c.hd.faces / 2) + 1 + conMod);

    const classFeatures = (c.features || [])
      .filter((f) => f.level <= character.level)
      .map((f) => ({
        id: `f_cls_${f.name.toLowerCase().replace(/\s+/g, '_')}`,
        name: f.name,
        source: 'Class' as const,
        level: f.level,
        description: render5eToolsEntries(f.entries),
      }));

    const spellSlots = getClassSpellSlots(c.name, character.level);
    const maxSlot = getMaxSpellLevel(c.name, character.level);
    const filteredSpells = (character.spells || []).filter((s) => s.level <= maxSlot);

    update({
      className: c.name,
      subclass: defaultSub,
      savingThrowProficiencies: c.proficiency,
      armorProficiencies: c.armorProficiencies || [],
      weaponProficiencies: c.weaponProficiencies || [],
      spellcastingAbility: c.spellcastingAbility,
      spellSlotsTotal: spellSlots,
      spells: filteredSpells,
      hpMax: Math.max(1, baseHp),
      hpCurrent: Math.max(1, baseHp),
      features: [
        ...character.features.filter((f) => f.source !== 'Class' && f.source !== 'Subclass'),
        ...classFeatures,
      ],
    });

  };

  // Step 4: Background
  const handleSelectBackground = (bgName: string) => {
    const bg = FIVE_TOOLS_BACKGROUNDS.find((b) => b.name === bgName);
    if (!bg) return;

    const bgSkills = (bg.skillProficiencies || []).map((s) => s.toLowerCase().replace(/\s+/g, '_') as any);
    const existingSkills = character.skillProficiencies.filter((s) => !selectedBgObj.skillProficiencies?.map((bs) => bs.toLowerCase().replace(/\s+/g, '_')).includes(s));

    const bgFeature = bg.feature
      ? [
          {
            id: `f_bg_${bg.feature.name.toLowerCase().replace(/\s+/g, '_')}`,
            name: bg.feature.name,
            source: 'Background' as const,
            description: render5eToolsEntries(bg.feature.entries),
          },
        ]
      : [];

    update({
      background: bg.name,
      skillProficiencies: Array.from(new Set([...existingSkills, ...bgSkills])),
      features: [
        ...character.features.filter((f) => f.source !== 'Background'),
        ...bgFeature,
      ],
    });
  };

  // Ability calculations
  const totalAbilities = getAbilityScoresTotal(character);
  const pointBuyUsed = calculatePointBuyUsed(character.baseAbilities);
  const pointBuyRemaining = 27 - pointBuyUsed;

  const currentStep = STEPS[currentStepIndex];

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Builder Breadcrumb Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-2.5 flex items-center justify-between gap-2 overflow-x-auto">
        {STEPS.map((step, idx) => {
          const Icon = step.icon;
          const isActive = idx === currentStepIndex;
          const isDone = idx < currentStepIndex;

          return (
            <button
              key={step.id}
              onClick={() => setCurrentStepIndex(idx)}
              className={`px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-2 whitespace-nowrap transition-colors shrink-0 ${
                isActive
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : isDone
                  ? 'text-amber-400 hover:bg-slate-800/80'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{step.label}</span>
            </button>
          );
        })}
      </div>

      {/* Step Content */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 shadow-xl min-h-[500px]">
        {/* STEP 1: RACE */}
        {currentStep.id === 'race' && (
          <div className="space-y-6">
            <div>
              <h3 className="font-serif text-xl font-bold text-amber-100">
                Choose Character Race / Species
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Your character’s heritage gives them innate physical traits, languages, and ability score increases.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {FIVE_TOOLS_RACES.map((race) => {
                const isSelected = character.race.toLowerCase() === race.name.toLowerCase();
                return (
                  <button
                    key={race.name}
                    onClick={() => handleSelectRace(race.name)}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-500 text-amber-200 shadow-md shadow-amber-500/10'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300 hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="font-bold text-sm">{race.name}</div>
                    <div className="text-[11px] text-slate-400 mt-1">
                      Speed: {typeof race.speed === 'number' ? race.speed : 30} ft
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Subrace if applicable */}
            {selectedRaceObj.subraces && selectedRaceObj.subraces.length > 0 && (
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
                <div className="text-xs font-semibold text-amber-300 uppercase tracking-wider">
                  Select {selectedRaceObj.name} Subrace
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  {selectedRaceObj.subraces.map((sub) => {
                    const isSelected = character.subrace === sub.name;
                    return (
                      <button
                        key={sub.name}
                        onClick={() => handleSelectSubrace(sub.name)}
                        className={`px-4 py-2 rounded-lg text-xs font-semibold border transition-all ${
                          isSelected
                            ? 'bg-amber-500 text-slate-950 border-amber-500'
                            : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        {sub.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Selected Race Details preview */}
            <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/80 space-y-3">
              <h4 className="font-serif text-sm font-bold text-slate-200">
                {selectedRaceObj.name} Traits & 5e.tools Data
              </h4>
              <div className="text-xs text-slate-300 leading-relaxed space-y-2">
                {render5eToolsEntries(selectedRaceObj.entries)}
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: CLASS */}
        {currentStep.id === 'class' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h3 className="font-serif text-xl font-bold text-amber-100">
                  Choose Class & Subclass
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Your class defines your primary vocation, hit die, combat capabilities, and magical abilities.
                </p>
              </div>

              {/* Level Selector */}
              <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
                <span className="text-xs text-slate-400 font-medium">Starting Level:</span>
                <select
                  value={character.level}
                  onChange={(e) => {
                    const newLvl = parseInt(e.target.value) || 1;
                    const c = FIVE_TOOLS_CLASSES.find((cl) => cl.name === character.className) || selectedClassObj;
                    const conMod = getAbilityModifier(character.baseAbilities.con + (character.customAbilityBonuses?.con || 0));
                    const baseHp = c.hd.faces + conMod + (newLvl - 1) * (Math.floor(c.hd.faces / 2) + 1 + conMod);
                    const classFeatures = (c.features || [])
                      .filter((f) => f.level <= newLvl)
                      .map((f) => ({
                        id: `f_cls_${f.name.toLowerCase().replace(/\s+/g, '_')}`,
                        name: f.name,
                        source: 'Class' as const,
                        level: f.level,
                        description: render5eToolsEntries(f.entries),
                      }));
                    const newMaxSlot = getMaxSpellLevel(character.className, newLvl);
                    const filteredSpells = (character.spells || []).filter((s) => s.level <= newMaxSlot);

                    update({
                      level: newLvl,
                      hitDiceTotal: newLvl,
                      spellSlotsTotal: getClassSpellSlots(character.className, newLvl),
                      spells: filteredSpells,
                      hpMax: Math.max(1, baseHp),
                      hpCurrent: Math.max(1, baseHp),
                      features: [
                        ...character.features.filter((f) => f.source !== 'Class'),
                        ...classFeatures,
                      ],
                    });

                  }}
                  className="bg-transparent text-amber-300 font-mono font-bold text-sm focus:outline-none"
                >
                  {Array.from({ length: 20 }, (_, i) => i + 1).map((lvl) => (
                    <option key={lvl} value={lvl} className="bg-slate-900 text-slate-100">
                      Level {lvl}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {FIVE_TOOLS_CLASSES.map((cls) => {
                const isSelected = character.className.toLowerCase() === cls.name.toLowerCase();
                return (
                  <button
                    key={cls.name}
                    onClick={() => handleSelectClass(cls.name)}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-500 text-amber-200 shadow-md shadow-amber-500/10'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300 hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="font-bold text-sm">{cls.name}</div>
                    <div className="text-[11px] text-slate-400 mt-1">
                      Hit Die: <span className="font-mono text-amber-300">d{cls.hd.faces}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Subclasses */}
            {selectedClassObj.subclasses && selectedClassObj.subclasses.length > 0 && (
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
                <div className="text-xs font-semibold text-amber-300 uppercase tracking-wider">
                  Select {selectedClassObj.name} Subclass
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  {selectedClassObj.subclasses.map((sub) => {
                    const isSelected = character.subclass === sub.name;
                    return (
                      <button
                        key={sub.name}
                        onClick={() => update({ subclass: sub.name })}
                        className={`px-4 py-2 rounded-lg text-xs font-semibold border transition-all ${
                          isSelected
                            ? 'bg-amber-500 text-slate-950 border-amber-500'
                            : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        {sub.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Class Features */}
            <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/80 space-y-3">
              <h4 className="font-serif text-sm font-bold text-slate-200">
                {selectedClassObj.name} Features (Level {character.level})
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {(selectedClassObj.features || [])
                  .filter((f) => f.level <= character.level)
                  .map((feat) => (
                    <div key={feat.name} className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                      <div className="font-bold text-amber-300 flex items-center justify-between">
                        <span>{feat.name}</span>
                        <span className="text-[10px] text-slate-500 font-normal">Level {feat.level}</span>
                      </div>
                      <div className="text-slate-400 mt-1 leading-relaxed text-[11px]">
                        {render5eToolsEntries(feat.entries)}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: ABILITY SCORES */}
        {currentStep.id === 'abilities' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h3 className="font-serif text-xl font-bold text-amber-100">
                  Generate Ability Scores
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Choose between 27-Point Buy, Standard Array [15, 14, 13, 12, 10, 8], or 4d6-Drop-Lowest dice rolls.
                </p>
              </div>

              {/* Mode Switcher */}
              <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-lg border border-slate-800 text-xs">
                {(['pointbuy', 'standard', 'rolled'] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => update({ abilityMode: m })}
                    className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                      character.abilityMode === m
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {m === 'pointbuy' ? 'Point Buy (27 pts)' : m === 'standard' ? 'Standard Array' : '4d6 Drop Lowest'}
                  </button>
                ))}
              </div>
            </div>

            {/* Point Buy Status banner */}
            {character.abilityMode === 'pointbuy' && (
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400">Point Buy Budget:</span>
                  <div className="text-lg font-mono font-bold text-amber-400 tabular-nums">
                    {pointBuyRemaining} Points Remaining (Used {pointBuyUsed} / 27)
                  </div>
                </div>
                <div className="text-[11px] text-slate-400 text-right">
                  Scores range 8 to 15 before racial bonuses
                </div>
              </div>
            )}

            {/* 4d6 Roll All Quick Action */}
            {character.abilityMode === 'rolled' && (
              <div className="p-3.5 rounded-xl bg-amber-500/5 border border-amber-500/20 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-amber-200">Interactive 4d6 Roller</div>
                  <div className="text-[11px] text-slate-400">Roll 4d6 for all 6 stats and drop the lowest die automatically</div>
                </div>
                <button
                  onClick={() => {
                    const newScores = {
                      str: roll4d6DropLowest().total,
                      dex: roll4d6DropLowest().total,
                      con: roll4d6DropLowest().total,
                      int: roll4d6DropLowest().total,
                      wis: roll4d6DropLowest().total,
                      cha: roll4d6DropLowest().total,
                    };
                    update({ baseAbilities: newScores });
                  }}
                  className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-450 text-slate-950 font-semibold text-xs transition-colors flex items-center gap-1.5"
                >
                  <Dices className="w-4 h-4" />
                  <span>Roll All 6 Scores</span>
                </button>
              </div>
            )}

            {/* Ability Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {(['str', 'dex', 'con', 'int', 'wis', 'cha'] as const).map((stat) => {
                const baseVal = character.baseAbilities[stat];
                const racialBonus = character.customAbilityBonuses?.[stat] || 0;
                const total = totalAbilities[stat];
                const mod = getAbilityModifier(total);

                const handleIncrement = () => {
                  if (character.abilityMode === 'pointbuy') {
                    if (baseVal >= 15) return;
                    const nextCost = (POINT_BUY_COST[baseVal + 1] ?? 0) - (POINT_BUY_COST[baseVal] ?? 0);
                    if (pointBuyRemaining < nextCost) return;
                  }
                  update({
                    baseAbilities: { ...character.baseAbilities, [stat]: baseVal + 1 },
                  });
                };

                const handleDecrement = () => {
                  if (baseVal <= 3) return;
                  if (character.abilityMode === 'pointbuy' && baseVal <= 8) return;
                  update({
                    baseAbilities: { ...character.baseAbilities, [stat]: baseVal - 1 },
                  });
                };

                return (
                  <div
                    key={stat}
                    className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-center flex flex-col items-center justify-between"
                  >
                    <div className="text-xs uppercase font-bold tracking-wider text-slate-400">
                      {stat}
                    </div>

                    <div className="my-2">
                      <div className="text-3xl font-mono font-black text-amber-300 tabular-nums">
                        {formatModifier(mod)}
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        Total: <span className="font-bold text-slate-200 tabular-nums">{total}</span>
                      </div>
                    </div>

                    <div className="w-full flex items-center justify-between gap-1 pt-2 border-t border-slate-800/80">
                      <button
                        onClick={handleDecrement}
                        disabled={character.abilityMode === 'pointbuy' && baseVal <= 8}
                        className="w-7 h-7 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold disabled:opacity-40"
                      >
                        -
                      </button>
                      <span className="font-mono text-sm font-bold text-slate-300 tabular-nums">
                        {baseVal}
                      </span>
                      <button
                        onClick={handleIncrement}
                        disabled={character.abilityMode === 'pointbuy' && baseVal >= 15}
                        className="w-7 h-7 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold disabled:opacity-40"
                      >
                        +
                      </button>
                    </div>

                    {racialBonus > 0 && (
                      <div className="text-[10px] text-emerald-400 font-medium mt-1.5">
                        +{racialBonus} racial
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 4: BACKGROUND & IDENTITY */}
        {currentStep.id === 'background' && (
          <div className="space-y-6">
            <div>
              <h3 className="font-serif text-xl font-bold text-amber-100">
                Background, Alignment & Persona
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Your origin story, training in skills, moral compass, and personal characteristics.
              </p>
            </div>

            {/* Background Selector */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {FIVE_TOOLS_BACKGROUNDS.map((bg) => {
                const isSelected = character.background.toLowerCase() === bg.name.toLowerCase();
                return (
                  <button
                    key={bg.name}
                    onClick={() => handleSelectBackground(bg.name)}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-500 text-amber-200 shadow-md shadow-amber-500/10'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300 hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="font-bold text-sm">{bg.name}</div>
                    <div className="text-[11px] text-slate-400 mt-1 truncate">
                      {bg.skillProficiencies?.join(', ')}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Alignment row */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
              <label className="text-xs font-semibold text-slate-300 block">Alignment</label>
              <div className="grid grid-cols-3 sm:grid-cols-9 gap-1.5 text-xs">
                {[
                  'Lawful Good', 'Neutral Good', 'Chaotic Good',
                  'Lawful Neutral', 'True Neutral', 'Chaotic Neutral',
                  'Lawful Evil', 'Neutral Evil', 'Chaotic Evil',
                ].map((align) => (
                  <button
                    key={align}
                    onClick={() => update({ alignment: align })}
                    className={`py-1.5 px-2 rounded border text-center transition-colors truncate ${
                      character.alignment === align
                        ? 'bg-amber-500 text-slate-950 font-bold border-amber-500'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {align}
                  </button>
                ))}
              </div>
            </div>

            {/* Personality Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">
                  Personality Traits
                </label>
                <textarea
                  value={character.personalityTraits}
                  onChange={(e) => update({ personalityTraits: e.target.value })}
                  placeholder="Quirks, habits, demeanor..."
                  className="w-full h-20 p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-amber-500/60 resize-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Ideals</label>
                <textarea
                  value={character.ideals}
                  onChange={(e) => update({ ideals: e.target.value })}
                  placeholder="Guiding principles, morals, beliefs..."
                  className="w-full h-20 p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-amber-500/60 resize-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Bonds</label>
                <textarea
                  value={character.bonds}
                  onChange={(e) => update({ bonds: e.target.value })}
                  placeholder="People, places, heirlooms you would die for..."
                  className="w-full h-20 p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-amber-500/60 resize-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Flaws</label>
                <textarea
                  value={character.flaws}
                  onChange={(e) => update({ flaws: e.target.value })}
                  placeholder="Weaknesses, vices, blind spots..."
                  className="w-full h-20 p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-amber-500/60 resize-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: EQUIPMENT */}
        {currentStep.id === 'equipment' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-serif text-xl font-bold text-amber-100 flex items-center gap-2">
                  <span>Equipment & Armory</span>
                  <span className="text-xs font-sans px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    5e.tools Compendium
                  </span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Select starting weapons, armor, and gear. Equipped items instantly update your Armor Class, attacks, and speed.
                </p>
              </div>

              <button
                onClick={() => setIsArmoryModalOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-450 text-slate-950 text-xs font-bold flex items-center gap-2 self-start sm:self-auto transition-all shadow-md cursor-pointer"
              >
                <Swords className="w-4 h-4" />
                <span>Open 5e.tools Armory Modal</span>
              </button>
            </div>

            {/* Quick Presets based on Class */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
              <div className="text-xs font-semibold text-amber-300 uppercase tracking-wider flex items-center justify-between">
                <span>Recommended Quick Packages for {character.className}</span>
                <span className="text-[10px] text-slate-500 font-normal">Or browse the catalog below</span>
              </div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <button
                  onClick={() => {
                    const w1 = FIVE_TOOLS_WEAPONS.find((w) => w.id === 'w_longsword') || FIVE_TOOLS_WEAPONS[0];
                    const w2 = FIVE_TOOLS_WEAPONS.find((w) => w.id === 'w_heavy_crossbow') || FIVE_TOOLS_WEAPONS[1];
                    const a1 = FIVE_TOOLS_ARMOR.find((a) => a.id === 'a_chain_mail') || FIVE_TOOLS_ARMOR[0];
                    const a2 = FIVE_TOOLS_ARMOR.find((a) => a.id === 'a_shield') || FIVE_TOOLS_ARMOR[1];
                    update({
                      weapons: [
                        { ...w1, equipped: true },
                        { ...w2, equipped: false },
                      ],
                      armor: [
                        { ...a1, equipped: true },
                        { ...a2, equipped: true },
                      ],
                      inventory: FIVE_TOOLS_STANDARD_GEAR.slice(0, 8),
                      currency: { cp: 0, sp: 20, ep: 0, gp: 35, pp: 0 },
                    });
                  }}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-medium cursor-pointer"
                >
                  Martial Warrior Loadout
                </button>

                <button
                  onClick={() => {
                    const w1 = FIVE_TOOLS_WEAPONS.find((w) => w.id === 'w_rapier') || FIVE_TOOLS_WEAPONS[0];
                    const w2 = FIVE_TOOLS_WEAPONS.find((w) => w.id === 'w_shortbow') || FIVE_TOOLS_WEAPONS[1];
                    const a1 = FIVE_TOOLS_ARMOR.find((a) => a.id === 'a_leather') || FIVE_TOOLS_ARMOR[0];
                    update({
                      weapons: [
                        { ...w1, equipped: true },
                        { ...w2, equipped: true },
                      ],
                      armor: [{ ...a1, equipped: true }],
                      inventory: FIVE_TOOLS_STANDARD_GEAR.slice(0, 8),
                      currency: { cp: 0, sp: 40, ep: 0, gp: 60, pp: 0 },
                    });
                  }}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-medium cursor-pointer"
                >
                  Finesse & Scout Loadout
                </button>

                <button
                  onClick={() => {
                    const w1 = FIVE_TOOLS_WEAPONS.find((w) => w.id === 'w_quarterstaff') || FIVE_TOOLS_WEAPONS[0];
                    const w2 = FIVE_TOOLS_WEAPONS.find((w) => w.id === 'w_dagger') || FIVE_TOOLS_WEAPONS[1];
                    update({
                      weapons: [
                        { ...w1, equipped: true },
                        { ...w2, equipped: true },
                      ],
                      armor: [],
                      inventory: FIVE_TOOLS_STANDARD_GEAR.slice(0, 8),
                      currency: { cp: 10, sp: 15, ep: 0, gp: 75, pp: 0 },
                    });
                  }}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-medium cursor-pointer"
                >
                  Scholar & Mage Loadout
                </button>

                <button
                  onClick={() => {
                    const w1 = FIVE_TOOLS_WEAPONS.find((w) => w.id === 'w_light_crossbow') || FIVE_TOOLS_WEAPONS[0];
                    const w2 = FIVE_TOOLS_WEAPONS.find((w) => w.id === 'w_dagger') || FIVE_TOOLS_WEAPONS[1];
                    const a1 = FIVE_TOOLS_ARMOR.find((a) => a.id === 'a_scale_mail') || FIVE_TOOLS_ARMOR[0];
                    const a2 = FIVE_TOOLS_ARMOR.find((a) => a.id === 'a_shield') || FIVE_TOOLS_ARMOR[1];
                    const thievesTools = FIVE_TOOLS_STANDARD_GEAR.find((g) => g.id === 'g_thieves_tools') || FIVE_TOOLS_STANDARD_GEAR[0];
                    update({
                      weapons: [
                        { ...w1, equipped: true },
                        { ...w2, equipped: true },
                      ],
                      armor: [
                        { ...a1, equipped: true },
                        { ...a2, equipped: true },
                      ],
                      inventory: [
                        thievesTools,
                        { id: 'g_tinker_tools', name: "Tinker's Tools", category: 'Tools', quantity: 1, weight: 10, cost: '50 gp' },
                        ...FIVE_TOOLS_STANDARD_GEAR.slice(0, 6),
                      ],
                      currency: { cp: 0, sp: 20, ep: 0, gp: 50, pp: 0 },
                    });
                  }}
                  className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-semibold cursor-pointer"
                >
                  Artificer Inventor Loadout
                </button>
              </div>
            </div>

            {/* Currently Equipped Weapons & Armor */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
                <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                  <span>Selected Weapons ({character.weapons?.length || 0})</span>
                  <span className="text-[10px] text-slate-500">Toggle equipped or remove</span>
                </div>
                {(!character.weapons || character.weapons.length === 0) ? (
                  <div className="text-xs text-slate-500 italic py-2">No weapons added yet. Pick from the catalog below.</div>
                ) : (
                  character.weapons.map((w, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-800 text-xs">
                      <div>
                        <span className="font-bold text-slate-100">{w.name}</span>
                        <span className="text-slate-400 ml-2 font-mono">{w.damage} {w.damageType}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            const updated = [...character.weapons];
                            updated[idx].equipped = !updated[idx].equipped;
                            update({ weapons: updated });
                          }}
                          className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                            w.equipped ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {w.equipped ? 'Equipped' : 'Stowed'}
                        </button>
                        <button
                          onClick={() => {
                            const updated = character.weapons.filter((_, i) => i !== idx);
                            update({ weapons: updated });
                          }}
                          className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                          title="Remove weapon"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
                <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                  <span>Selected Armor & Shields ({character.armor?.length || 0})</span>
                  <span className="text-[10px] text-slate-500">Toggle equipped or remove</span>
                </div>
                {(!character.armor || character.armor.length === 0) ? (
                  <div className="text-xs text-slate-500 italic py-2">No armor added yet. Pick from the catalog below.</div>
                ) : (
                  character.armor.map((a, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-800 text-xs">
                      <div>
                        <span className="font-bold text-slate-100">{a.name}</span>
                        <span className="text-slate-400 ml-2">AC {a.ac}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            const updated = [...character.armor];
                            updated[idx].equipped = !updated[idx].equipped;
                            update({ armor: updated });
                          }}
                          className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                            a.equipped ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {a.equipped ? 'Equipped' : 'Packed'}
                        </button>
                        <button
                          onClick={() => {
                            const updated = character.armor.filter((_, i) => i !== idx);
                            update({ armor: updated });
                          }}
                          className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                          title="Remove armor"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Direct 5e.tools Equipment Browser */}
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                    5e.tools Catalog
                  </span>
                  <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800">
                    <button
                      onClick={() => setBuilderGearTab('weapons')}
                      className={`px-2.5 py-1 rounded text-xs font-semibold cursor-pointer ${
                        builderGearTab === 'weapons' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Weapons ({FIVE_TOOLS_WEAPONS.length})
                    </button>
                    <button
                      onClick={() => setBuilderGearTab('armor')}
                      className={`px-2.5 py-1 rounded text-xs font-semibold cursor-pointer ${
                        builderGearTab === 'armor' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Armor & Shields ({FIVE_TOOLS_ARMOR.length})
                    </button>
                    <button
                      onClick={() => setBuilderGearTab('gear')}
                      className={`px-2.5 py-1 rounded text-xs font-semibold cursor-pointer ${
                        builderGearTab === 'gear' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Gear & Magic Items ({FIVE_TOOLS_STANDARD_GEAR.length})
                    </button>
                  </div>
                </div>

                <div className="relative w-full sm:w-64">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search equipment..."
                    value={builderGearSearch}
                    onChange={(e) => setBuilderGearSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-1 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/60"
                  />
                  {builderGearSearch && (
                    <button
                      onClick={() => setBuilderGearSearch('')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white text-xs"
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>

              {/* Weapons Tab */}
              {builderGearTab === 'weapons' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-72 overflow-y-auto pr-1">
                  {FIVE_TOOLS_WEAPONS.filter((w) =>
                    w.name.toLowerCase().includes(builderGearSearch.toLowerCase()) ||
                    w.category.toLowerCase().includes(builderGearSearch.toLowerCase())
                  ).map((w) => {
                    const isAlreadyEquipped = character.weapons?.some((cw) => cw.name === w.name && cw.equipped);
                    const isAdded = character.weapons?.some((cw) => cw.name === w.name);

                    return (
                      <div
                        key={w.id}
                        className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex flex-col justify-between gap-2"
                      >
                        <div>
                          <div className="flex items-start justify-between gap-1">
                            <span className="font-bold text-slate-100 text-xs">{w.name}</span>
                            <span className="font-mono text-amber-400 text-[11px] font-bold whitespace-nowrap">
                              {w.damage} {w.damageType}
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-2">
                            <span>{w.category}</span>
                            <span>· {w.weight} lbs</span>
                            <span className="text-amber-500/90">· {w.cost}</span>
                          </div>
                          {w.properties && w.properties.length > 0 && (
                            <div className="text-[10px] text-slate-500 mt-1 italic">
                              {w.properties.join(', ')}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5 pt-1.5 border-t border-slate-800/80">
                          <button
                            onClick={() => {
                              const newW: WeaponItem = { ...w, id: `${w.id}_${Date.now()}`, equipped: true };
                              update({ weapons: [...(character.weapons || []), newW] });
                            }}
                            className={`flex-1 py-1 px-2 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                              isAlreadyEquipped
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                : 'bg-amber-500 text-slate-950 hover:bg-amber-450'
                            }`}
                          >
                            {isAlreadyEquipped ? 'Equipped ✓' : '+ Equip'}
                          </button>
                          <button
                            onClick={() => {
                              const newW: WeaponItem = { ...w, id: `${w.id}_${Date.now()}`, equipped: false };
                              update({ weapons: [...(character.weapons || []), newW] });
                            }}
                            className="py-1 px-2 rounded bg-slate-800 hover:bg-slate-750 text-slate-300 text-[11px] font-medium cursor-pointer"
                          >
                            + Stowed
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Armor Tab */}
              {builderGearTab === 'armor' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-72 overflow-y-auto pr-1">
                  {FIVE_TOOLS_ARMOR.filter((a) =>
                    a.name.toLowerCase().includes(builderGearSearch.toLowerCase()) ||
                    a.category.toLowerCase().includes(builderGearSearch.toLowerCase())
                  ).map((a) => {
                    const isAlreadyEquipped = character.armor?.some((ca) => ca.name === a.name && ca.equipped);

                    return (
                      <div
                        key={a.id}
                        className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex flex-col justify-between gap-2"
                      >
                        <div>
                          <div className="flex items-start justify-between gap-1">
                            <span className="font-bold text-slate-100 text-xs">{a.name}</span>
                            <span className="font-mono text-cyan-400 text-[11px] font-bold whitespace-nowrap">
                              {a.category === 'Shield' ? `+${a.ac} AC` : `AC ${a.ac}`}
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-2 flex-wrap">
                            <span>{a.category}</span>
                            <span>· {a.weight} lbs</span>
                            <span className="text-amber-500/90">· {a.cost}</span>
                            {a.stealthDisadvantage && <span className="text-rose-400">· Stealth Disadv</span>}
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 pt-1.5 border-t border-slate-800/80">
                          <button
                            onClick={() => {
                              const newA: ArmorItem = { ...a, id: `${a.id}_${Date.now()}`, equipped: true };
                              update({ armor: [...(character.armor || []), newA] });
                            }}
                            className={`flex-1 py-1 px-2 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                              isAlreadyEquipped
                                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                                : 'bg-cyan-600 text-white hover:bg-cyan-500'
                            }`}
                          >
                            {isAlreadyEquipped ? 'Equipped ✓' : '+ Equip'}
                          </button>
                          <button
                            onClick={() => {
                              const newA: ArmorItem = { ...a, id: `${a.id}_${Date.now()}`, equipped: false };
                              update({ armor: [...(character.armor || []), newA] });
                            }}
                            className="py-1 px-2 rounded bg-slate-800 hover:bg-slate-750 text-slate-300 text-[11px] font-medium cursor-pointer"
                          >
                            + In Pack
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Gear & Magic Items Tab */}
              {builderGearTab === 'gear' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-72 overflow-y-auto pr-1">
                  {FIVE_TOOLS_STANDARD_GEAR.filter((g) =>
                    g.name.toLowerCase().includes(builderGearSearch.toLowerCase()) ||
                    (g.category && g.category.toLowerCase().includes(builderGearSearch.toLowerCase())) ||
                    (g.description && g.description.toLowerCase().includes(builderGearSearch.toLowerCase()))
                  ).map((g) => {
                    const isAdded = character.inventory?.some((cg) => cg.name === g.name);

                    return (
                      <div
                        key={g.id}
                        className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex flex-col justify-between gap-2"
                      >
                        <div>
                          <div className="flex items-start justify-between gap-1">
                            <span className="font-bold text-slate-100 text-xs">{g.name}</span>
                            <span className="text-[11px] text-amber-400 font-mono">{g.cost || '—'}</span>
                          </div>
                          <div className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-2">
                            <span>{g.category || 'Gear'}</span>
                            <span>· {g.weight} lbs</span>
                          </div>
                          {g.description && (
                            <div className="text-[10px] text-slate-500 mt-1 line-clamp-2">
                              {g.description}
                            </div>
                          )}
                        </div>

                        <div className="pt-1.5 border-t border-slate-800/80">
                          <button
                            onClick={() => {
                              const existing = character.inventory || [];
                              const matchIndex = existing.findIndex((item) => item.name === g.name);
                              if (matchIndex >= 0) {
                                const copy = [...existing];
                                copy[matchIndex] = {
                                  ...copy[matchIndex],
                                  quantity: (copy[matchIndex].quantity || 1) + 1,
                                };
                                update({ inventory: copy });
                              } else {
                                update({
                                  inventory: [...existing, { ...g, id: `${g.id}_${Date.now()}` }],
                                });
                              }
                            }}
                            className="w-full py-1 px-2 rounded bg-slate-800 hover:bg-slate-750 text-slate-200 text-[11px] font-semibold flex items-center justify-center gap-1 cursor-pointer transition-colors"
                          >
                            <Plus className="w-3 h-3 text-amber-400" />
                            <span>{isAdded ? 'Add Another (+1)' : 'Add to Pack'}</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}


        {/* STEP 6: SPELLS */}
        {currentStep.id === 'spells' && (() => {
          const maxSpellLevel = getMaxSpellLevel(character.className, character.level);
          const isCaster = isSpellcastingClass(character.className);
          const slots = getClassSpellSlots(character.className, character.level);
          const invalidSpells = (character.spells || []).filter((s) => s.level > maxSpellLevel);

          // Filter spells list
          const filteredSpells = FIVE_TOOLS_SPELLS.filter((sp) => {
            const matchesSearch =
              !spellSearch ||
              sp.name.toLowerCase().includes(spellSearch.toLowerCase()) ||
              sp.school.toLowerCase().includes(spellSearch.toLowerCase()) ||
              (sp.damageType && sp.damageType.toLowerCase().includes(spellSearch.toLowerCase()));

            if (!matchesSearch) return false;

            if (filterClassOnly && isCaster) {
              const onList = sp.classes?.some((c) => c.toLowerCase() === character.className.toLowerCase());
              const isAlreadyKnown = character.spells?.some((s) => s.id === sp.id);
              if (!onList && !isAlreadyKnown) return false;
            }

            if (spellLevelFilter === 'eligible') {
              return sp.level <= maxSpellLevel;
            } else if (spellLevelFilter === '0') {
              return sp.level === 0;
            } else if (spellLevelFilter === '1') {
              return sp.level === 1;
            } else if (spellLevelFilter === '2') {
              return sp.level === 2;
            } else if (spellLevelFilter === '3') {
              return sp.level === 3;
            } else if (spellLevelFilter === '4+') {
              return sp.level >= 4;
            }

            return true;
          });

          return (
            <div className="space-y-6">
              {/* Header with Caster Level & Slot Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-serif text-xl font-bold text-amber-100 flex items-center gap-2">
                    <span>Spells & Grimoire</span>
                    <span className="text-xs font-sans px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      Level {character.level} {character.className}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Select cantrips and prepared spells for your grimoire. Spell options are dynamically restricted by your class and spell slot availability.
                  </p>
                </div>

                {/* Spell Slots Chips */}
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                    <span className="text-slate-400 mr-1.5">Max Spell Level:</span>
                    <span className={`font-mono font-bold ${maxSpellLevel > 0 ? 'text-amber-400' : 'text-slate-500'}`}>
                      {maxSpellLevel > 0 ? `Level ${maxSpellLevel}` : 'No Slots'}
                    </span>
                  </div>

                  {maxSpellLevel > 0 && (
                    <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                      <span className="text-slate-400 mr-1.5">Available Slots:</span>
                      <span className="font-mono font-bold text-cyan-400">
                        {slots.slice(0, maxSpellLevel).map((s, i) => `${i + 1}st:${s}`).join(', ')}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Ineligible spells warning banner (e.g. if user downgraded level) */}
              {invalidSpells.length > 0 && (
                <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/40 text-xs flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 text-rose-300">
                    <AlertTriangle className="w-5 h-5 shrink-0 text-rose-400" />
                    <div>
                      <span className="font-bold">Ineligible Spells Detected: </span>
                      <span>
                        Your character has {invalidSpells.length} spell(s) above Level {maxSpellLevel} ({invalidSpells.map((s) => s.name).join(', ')}). A Level {character.level} {character.className} cannot cast these.
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      update({
                        spells: (character.spells || []).filter((s) => s.level <= maxSpellLevel),
                      });
                      setSpellNotice(`Removed ${invalidSpells.length} ineligible spell(s) from character.`);
                      setTimeout(() => setSpellNotice(null), 3500);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs whitespace-nowrap cursor-pointer transition-colors"
                  >
                    Remove Ineligible Spells
                  </button>
                </div>
              )}

              {/* Non-caster or Half-caster explanation notice */}
              {!isCaster && (
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 flex items-start gap-2.5">
                  <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-100">{character.className}s are martial/non-spellcasting by default. </span>
                    <span>
                      Cantrips can still be chosen if granted by your race (e.g. High Elf, Tiefling) or feats. Subclasses like Eldritch Knight or Arcane Trickster unlock spells at Level 3.
                    </span>
                  </div>
                </div>
              )}

              {isCaster && maxSpellLevel === 0 && (
                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 flex items-start gap-2.5">
                  <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Level 1 {character.className}s have no spell slots yet! </span>
                    <span>
                      {character.className}s unlock 1st-level spellcasting starting at Level 2. Higher level spells remain locked until higher levels are achieved.
                    </span>
                  </div>
                </div>
              )}

              {/* Feedback toast / restriction notice */}
              {spellNotice && (
                <div className="p-3 rounded-lg bg-amber-500/20 border border-amber-500/40 text-xs text-amber-300 flex items-center justify-between gap-2 animate-in fade-in">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>{spellNotice}</span>
                  </div>
                  <button
                    onClick={() => setSpellNotice(null)}
                    className="text-amber-400 hover:text-white text-xs font-bold px-1"
                  >
                    ✕
                  </button>
                </div>
              )}

              {/* Search, Filter Tabs & Class Toggle */}
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-3">
                {/* Search */}
                <div className="relative w-full md:w-64">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search spells (name, school, damage)..."
                    value={spellSearch}
                    onChange={(e) => setSpellSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/60"
                  />
                  {spellSearch && (
                    <button
                      onClick={() => setSpellSearch('')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white text-xs"
                    >
                      ×
                    </button>
                  )}
                </div>

                {/* Level Tabs */}
                <div className="flex items-center gap-1 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
                  {[
                    { id: 'eligible', label: maxSpellLevel > 0 ? `Eligible (0–${maxSpellLevel})` : 'Eligible' },
                    { id: '0', label: 'Cantrips (0)' },
                    { id: '1', label: '1st Level' },
                    { id: '2', label: '2nd Level' },
                    { id: '3', label: '3rd Level' },
                    { id: '4+', label: '4th+ Level' },
                    { id: 'all', label: 'All Spells' },
                  ].map((tab) => {
                    const isActive = spellLevelFilter === tab.id;
                    const tabLvl = parseInt(tab.id);
                    const isTabAboveCap = !isNaN(tabLvl) && tabLvl > maxSpellLevel && isCaster;

                    return (
                      <button
                        key={tab.id}
                        onClick={() => setSpellLevelFilter(tab.id)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap flex items-center gap-1 cursor-pointer transition-colors ${
                          isActive
                            ? 'bg-amber-500 text-slate-950'
                            : 'bg-slate-900 text-slate-400 hover:text-white'
                        }`}
                      >
                        {isTabAboveCap && <Lock className="w-2.5 h-2.5 opacity-60" />}
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Class Only Checkbox */}
                {isCaster && (
                  <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer self-start md:self-auto select-none">
                    <input
                      type="checkbox"
                      checked={filterClassOnly}
                      onChange={(e) => setFilterClassOnly(e.target.checked)}
                      className="rounded border-slate-700 bg-slate-900 text-amber-500 focus:ring-0 cursor-pointer"
                    />
                    <span>Only {character.className} spells</span>
                  </label>
                )}
              </div>

              {/* Grid of Spells with Lock Enforcements */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[500px] overflow-y-auto pr-1">
                {filteredSpells.map((sp) => {
                  const isKnown = character.spells?.some((s) => s.id === sp.id);
                  const eligibility = isSpellEligible(sp, character.className, character.level);
                  const isLocked = !eligibility.eligible && eligibility.isHigherLevel;

                  const handleToggleSpell = () => {
                    if (isKnown) {
                      update({
                        spells: character.spells.filter((s) => s.id !== sp.id),
                      });
                      return;
                    }

                    // Enforce restriction!
                    if (isLocked) {
                      setSpellNotice(
                        `Cannot learn "${sp.name}" (Level ${sp.level}): A Level ${character.level} ${character.className} can only cast up to Level ${maxSpellLevel} spells.`
                      );
                      setTimeout(() => setSpellNotice(null), 4000);
                      return;
                    }

                    update({
                      spells: [...(character.spells || []), { ...sp, prepared: true }],
                    });
                  };

                  return (
                    <div
                      key={sp.id}
                      onClick={handleToggleSpell}
                      className={`p-3.5 rounded-xl border transition-all ${
                        isKnown
                          ? 'bg-amber-500/15 border-amber-500 text-amber-200 cursor-pointer shadow-sm'
                          : isLocked
                          ? 'bg-slate-950/40 border-slate-800/60 opacity-65 hover:border-rose-500/50 cursor-not-allowed'
                          : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 text-slate-300 cursor-pointer'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-100">{sp.name}</span>
                          {isLocked && (
                            <span className="flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                              <Lock className="w-2.5 h-2.5" />
                              <span>Level {sp.level} Locked</span>
                            </span>
                          )}
                          {isKnown && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500 text-slate-950">
                              Selected ✓
                            </span>
                          )}
                        </div>

                        <span className="text-[11px] font-mono text-amber-300 whitespace-nowrap">
                          {sp.level === 0 ? 'Cantrip' : `Level ${sp.level}`}
                        </span>
                      </div>

                      <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-2 flex-wrap">
                        <span>{sp.school}</span>
                        <span>· {sp.castingTime}</span>
                        <span>· {sp.range}</span>
                        {sp.damage && (
                          <span className="text-amber-400/90 font-mono">· {sp.damage} {sp.damageType || ''}</span>
                        )}
                        {sp.classes && sp.classes.length > 0 && (
                          <span className="text-slate-500 text-[10px]">
                            ({sp.classes.join(', ')})
                          </span>
                        )}
                      </div>

                      <div className="text-[11px] text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                        {clean5eToolsText(sp.description)}
                      </div>

                      {isLocked && (
                        <div className="mt-2 text-[10px] text-rose-400 font-medium flex items-center gap-1 bg-rose-950/30 px-2 py-1 rounded border border-rose-900/40">
                          <Lock className="w-3 h-3 text-rose-400 shrink-0" />
                          <span>
                            Unlocks at higher level (Level {character.level} {character.className} max: Level {maxSpellLevel})
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {filteredSpells.length === 0 && (
                <div className="text-center py-10 text-slate-400 space-y-2">
                  <p className="text-sm font-semibold">No spells match the current filters.</p>
                  <p className="text-xs text-slate-500">
                    Try unchecking "Only {character.className} spells" or switching the level filter tab.
                  </p>
                </div>
              )}
            </div>
          );
        })()}


        {/* STEP 7: REVIEW & EXPORT */}
        {currentStep.id === 'review' && (
          <div className="space-y-6">
            <div>
              <h3 className="font-serif text-xl font-bold text-amber-100">
                Character Summary & PDF Generation
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Verify your stats, customize your character's name, and generate the fillable PDF sheet.
              </p>
            </div>

            {/* Name & Player input */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Character Name
                </label>
                <input
                  type="text"
                  value={character.name}
                  onChange={(e) => update({ name: e.target.value })}
                  placeholder="Hero's Name"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm font-serif font-bold text-slate-100 focus:outline-none focus:border-amber-500/60"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Player Name
                </label>
                <input
                  type="text"
                  value={character.playerName}
                  onChange={(e) => update({ playerName: e.target.value })}
                  placeholder="Your Name"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-amber-500/60"
                />
              </div>
            </div>

            {/* Core Stats Overview Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Armor Class</span>
                <span className="text-2xl font-mono font-black text-amber-400 tabular-nums">
                  {calculateArmorClass(character.armor, totalAbilities.dex)}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Hit Points</span>
                <span className="text-2xl font-mono font-black text-emerald-400 tabular-nums">
                  {character.hpMax}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Initiative</span>
                <span className="text-2xl font-mono font-black text-slate-200 tabular-nums">
                  {formatModifier(getAbilityModifier(totalAbilities.dex))}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Speed</span>
                <span className="text-2xl font-mono font-black text-slate-200 tabular-nums">
                  {character.speed} ft
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Prof Bonus</span>
                <span className="text-2xl font-mono font-black text-amber-300 tabular-nums">
                  {formatModifier(getProficiencyBonus(character.level))}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Passive Perc</span>
                <span className="text-2xl font-mono font-black text-slate-200 tabular-nums">
                  {calculatePassivePerception(totalAbilities, character.skillProficiencies, character.skillExpertise, getProficiencyBonus(character.level))}
                </span>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="p-6 rounded-xl bg-gradient-to-r from-amber-500/10 via-slate-900 to-amber-500/10 border border-amber-500/30 flex items-center justify-between flex-wrap gap-4">
              <div>
                <h4 className="font-serif text-lg font-bold text-amber-200">
                  Ready to Play & Export
                </h4>
                <p className="text-xs text-slate-300 mt-1 max-w-md">
                  Your character sheet is fully calculated and ready. Export as a standard 3-page fillable PDF or dive into the digital sheet.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={onSwitchToSheet}
                  className="px-5 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
                >
                  Open Digital Sheet
                </button>

                <button
                  onClick={onExportPdf}
                  disabled={isExportingPdf}
                  className="px-6 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-450 active:bg-amber-600 text-slate-950 text-xs font-bold transition-all shadow-md shadow-amber-500/20 flex items-center gap-2 disabled:opacity-60"
                >
                  <FileDown className="w-4 h-4" />
                  <span>{isExportingPdf ? 'Exporting PDF...' : 'Download Fillable PDF'}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Builder Footer Navigation (Prev / Next) */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={() => setCurrentStepIndex((prev) => Math.max(0, prev - 1))}
          disabled={currentStepIndex === 0}
          className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold flex items-center gap-1.5 disabled:opacity-30 disabled:pointer-events-none transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous Step</span>
        </button>

        {currentStepIndex < STEPS.length - 1 ? (
          <button
            onClick={() => setCurrentStepIndex((prev) => Math.min(STEPS.length - 1, prev + 1))}
            className="px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-450 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <span>Next Step</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={onSwitchToSheet}
            className="px-5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-450 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <span>View Full Character Sheet</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* 5e.tools Armory Modal */}
      <EquipmentArmoryModal
        isOpen={isArmoryModalOpen}
        onClose={() => setIsArmoryModalOpen(false)}
        character={character}
        onUpdateCharacter={onUpdateCharacter}
      />
    </div>
  );
};



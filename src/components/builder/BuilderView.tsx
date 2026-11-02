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
  Wand2,
  Check,
  Heart,
  Zap,
  Footprints,
  Eye,
  RotateCcw,
} from 'lucide-react';
import { Character, AbilityScores, WeaponItem, ArmorItem, GearItem, Spell, AbilityName } from '../../types/character';
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
  getStartingSpellsForClass,
  getOptimalArmoryForClass,
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
  { id: 'race', num: '01', label: 'Lineage', subtitle: 'Race & Species', icon: Shield },
  { id: 'class', num: '02', label: 'Calling', subtitle: 'Class & Subclass', icon: Swords },
  { id: 'abilities', num: '03', label: 'Attributes', subtitle: 'Ability Scores', icon: Dices },
  { id: 'background', num: '04', label: 'Background', subtitle: 'Identity & Origin', icon: User },
  { id: 'equipment', num: '05', label: 'Armory', subtitle: 'Weapons & Gear', icon: Backpack },
  { id: 'spells', num: '06', label: 'Grimoire', subtitle: 'Spells & Cantrips', icon: Sparkles },
  { id: 'review', num: '07', label: 'Chronicle', subtitle: 'Review & PDF Export', icon: CheckCircle2 },
];

// Recommended standard array distributions per class
const CLASS_RECOMMENDED_SCORES: Record<string, AbilityScores> = {
  Barbarian: { str: 15, con: 14, dex: 13, wis: 12, cha: 10, int: 8 },
  Bard: { cha: 15, dex: 14, con: 13, wis: 12, int: 10, str: 8 },
  Cleric: { wis: 15, con: 14, str: 13, dex: 12, cha: 10, int: 8 },
  Druid: { wis: 15, con: 14, dex: 13, int: 12, cha: 10, str: 8 },
  Fighter: { str: 15, con: 14, dex: 13, wis: 12, cha: 10, int: 8 },
  Monk: { dex: 15, wis: 14, con: 13, str: 12, int: 10, cha: 8 },
  Paladin: { str: 15, cha: 14, con: 13, wis: 12, dex: 10, int: 8 },
  Ranger: { dex: 15, wis: 14, con: 13, str: 12, int: 10, cha: 8 },
  Rogue: { dex: 15, int: 14, con: 13, cha: 12, wis: 10, str: 8 },
  Sorcerer: { cha: 15, con: 14, dex: 13, wis: 12, int: 10, str: 8 },
  Warlock: { cha: 15, con: 14, dex: 13, wis: 12, int: 10, str: 8 },
  Wizard: { int: 15, con: 14, dex: 13, wis: 12, cha: 10, str: 8 },
  Artificer: { int: 15, con: 14, dex: 13, wis: 12, str: 10, cha: 8 },
};

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
  const [raceSearch, setRaceSearch] = useState('');

  const selectedRaceObj =
    FIVE_TOOLS_RACES.find((r) => r.name.toLowerCase() === character.race.toLowerCase()) || FIVE_TOOLS_RACES[0];
  const selectedClassObj =
    FIVE_TOOLS_CLASSES.find((c) => c.name.toLowerCase() === character.className.toLowerCase()) || FIVE_TOOLS_CLASSES[4];
  const selectedBgObj =
    FIVE_TOOLS_BACKGROUNDS.find((b) => b.name.toLowerCase() === character.background.toLowerCase()) || FIVE_TOOLS_BACKGROUNDS[0];

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

    if (race.ability?.[0]) {
      const b = race.ability[0];
      if (b.str) racialBonuses.str = b.str;
      if (b.dex) racialBonuses.dex = b.dex;
      if (b.con) racialBonuses.con = b.con;
      if (b.int) racialBonuses.int = b.int;
      if (b.wis) racialBonuses.wis = b.wis;
      if (b.cha) racialBonuses.cha = b.cha;
    }

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
    const isCaster = isSpellcastingClass(c.name) || !!c.spellcastingAbility;
    const optimalSpells = isCaster ? getStartingSpellsForClass(c.name) : [];
    const optimalArmory = getOptimalArmoryForClass(c.name);

    // If standard array mode is active, automatically apply optimal score distribution for the chosen class
    const updatedAbilities =
      character.abilityMode === 'standard' && CLASS_RECOMMENDED_SCORES[c.name]
        ? { ...CLASS_RECOMMENDED_SCORES[c.name] }
        : character.baseAbilities;

    update({
      className: c.name,
      subclass: defaultSub,
      savingThrowProficiencies: c.proficiency,
      armorProficiencies: c.armorProficiencies || [],
      weaponProficiencies: c.weaponProficiencies || [],
      spellcastingAbility: c.spellcastingAbility,
      spellSlotsTotal: spellSlots,
      spells: optimalSpells,
      weapons: optimalArmory.weapons,
      armor: optimalArmory.armor,
      inventory: optimalArmory.inventory,
      currency: optimalArmory.currency,
      baseAbilities: updatedAbilities,
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
    const existingSkills = character.skillProficiencies.filter(
      (s) => !selectedBgObj.skillProficiencies?.map((bs) => bs.toLowerCase().replace(/\s+/g, '_')).includes(s)
    );

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

    const bgTrait = bg.suggestedTraits?.[0] || '';
    const bgIdeal = bg.suggestedIdeals?.[0] || '';
    const bgBond = bg.suggestedBonds?.[0] || '';
    const bgFlaw = bg.suggestedFlaws?.[0] || '';

    update({
      background: bg.name,
      skillProficiencies: Array.from(new Set([...existingSkills, ...bgSkills])),
      features: [
        ...character.features.filter((f) => f.source !== 'Background'),
        ...bgFeature,
      ],
      personalityTraits: character.personalityTraits?.trim() ? character.personalityTraits : bgTrait,
      ideals: character.ideals?.trim() ? character.ideals : bgIdeal,
      bonds: character.bonds?.trim() ? character.bonds : bgBond,
      flaws: character.flaws?.trim() ? character.flaws : bgFlaw,
    });
  };

  // Ability calculations
  const totalAbilities = getAbilityScoresTotal(character);
  const pointBuyUsed = calculatePointBuyUsed(character.baseAbilities);
  const pointBuyRemaining = 27 - pointBuyUsed;
  const currentStep = STEPS[currentStepIndex];

  // Auto-apply recommended scores for current class
  const handleApplyRecommendedScores = () => {
    const rec = CLASS_RECOMMENDED_SCORES[character.className] || CLASS_RECOMMENDED_SCORES.Fighter;
    update({ baseAbilities: { ...rec } });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* 1. Serene Character Dossier Card (Continuous Living Summary) */}
      <div className="bg-white border border-[#E5DFD5] rounded-2xl p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-1.5 flex-1 min-w-0">
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={character.name}
                onChange={(e) => update({ name: e.target.value })}
                placeholder="Name your hero..."
                className="font-serif text-2xl sm:text-3xl font-semibold text-stone-900 bg-transparent border-b border-transparent hover:border-stone-300 focus:border-[#B85D36] focus:outline-none transition-colors w-full max-w-md tracking-tight"
                title="Click to edit character name"
              />
            </div>

            {/* Zero-pill metadata line */}
            <div className="text-xs text-stone-600 flex items-center gap-2 flex-wrap">
              <span className="font-medium text-stone-800">{character.race}{character.subrace ? ` (${character.subrace})` : ''}</span>
              <span className="text-stone-300">·</span>
              <span className="font-medium text-stone-800">{character.className}{character.subclass ? ` · ${character.subclass}` : ''}</span>
              <span className="text-stone-300">·</span>
              <span>{character.background}</span>
              <span className="text-stone-300">·</span>
              <span className="text-stone-700 font-semibold tabular-nums">Level {character.level}</span>
            </div>
          </div>

          {/* Quiet Vitals Strip */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0 overflow-x-auto pb-1 lg:pb-0">
            <div className="px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#E8E3DA] text-center min-w-[64px]">
              <div className="text-[10px] uppercase tracking-wider text-stone-600 font-medium">Armor</div>
              <div className="text-lg font-mono font-bold text-stone-900 tabular-nums">
                {calculateArmorClass(character.armor, totalAbilities.dex)}
              </div>
            </div>

            <div className="px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#E8E3DA] text-center min-w-[64px]">
              <div className="text-[10px] uppercase tracking-wider text-stone-600 font-medium">Hit Points</div>
              <div className="text-lg font-mono font-bold text-[#2E4A3E] tabular-nums">
                {character.hpMax}
              </div>
            </div>

            <div className="px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#E8E3DA] text-center min-w-[64px]">
              <div className="text-[10px] uppercase tracking-wider text-stone-600 font-medium">Speed</div>
              <div className="text-lg font-mono font-bold text-stone-900 tabular-nums">
                {character.speed} <span className="text-xs font-normal text-stone-600">ft</span>
              </div>
            </div>

            <div className="px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#E8E3DA] text-center min-w-[64px]">
              <div className="text-[10px] uppercase tracking-wider text-stone-600 font-medium">Initiative</div>
              <div className="text-lg font-mono font-bold text-stone-900 tabular-nums">
                {formatModifier(getAbilityModifier(totalAbilities.dex))}
              </div>
            </div>

            <div className="px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#E8E3DA] text-center min-w-[64px]">
              <div className="text-[10px] uppercase tracking-wider text-stone-600 font-medium">Passive Perc</div>
              <div className="text-lg font-mono font-bold text-stone-900 tabular-nums">
                {calculatePassivePerception(totalAbilities, character.skillProficiencies, character.skillExpertise, getProficiencyBonus(character.level))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Step Progression Bar (Minimalist Scandinavian Track) */}
      <div className="bg-white border border-[#E5DFD5] rounded-2xl p-2 shadow-sm flex items-center justify-between gap-1 overflow-x-auto">
        {STEPS.map((step, idx) => {
          const isActive = idx === currentStepIndex;
          const isDone = idx < currentStepIndex;

          return (
            <button
              key={step.id}
              onClick={() => setCurrentStepIndex(idx)}
              className={`flex-1 min-w-[120px] px-3 py-2.5 rounded-xl text-left transition-all ${
                isActive
                  ? 'bg-stone-900 text-white shadow-sm'
                  : isDone
                  ? 'bg-transparent text-stone-900 hover:bg-[#FAF8F5]'
                  : 'bg-transparent text-stone-600 hover:text-stone-900 hover:bg-[#FAF8F5]'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span className={`text-[10px] font-mono tracking-wider ${isActive ? 'text-[#EBD6CA]' : 'text-stone-600'}`}>
                  {step.num}
                </span>
                {isDone && <Check className="w-3 h-3 text-[#2E4A3E]" />}
              </div>
              <div className="text-xs font-semibold truncate leading-snug">
                {step.label}
              </div>
              <div className={`text-[10px] truncate ${isActive ? 'text-stone-300' : 'text-stone-600'}`}>
                {step.subtitle}
              </div>
            </button>
          );
        })}
      </div>

      {/* 3. Main Step Workspace Canvas */}
      <div className="bg-white border border-[#E5DFD5] rounded-2xl p-6 sm:p-8 shadow-sm min-h-[520px]">
        {/* STEP 1: LINEAGE (Race & Species) */}
        {currentStep.id === 'race' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-serif text-2xl font-semibold text-stone-900">
                  Select Lineage & Species
                </h3>
                <p className="text-xs text-stone-600 mt-1">
                  Heritage bestows biological features, innate languages, movement speed, and ability score increases.
                </p>
              </div>

              {/* Clean search bar */}
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-600" />
                <input
                  type="text"
                  placeholder="Filter lineages..."
                  value={raceSearch}
                  onChange={(e) => setRaceSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-[#FAF8F5] border border-[#E5DFD5] rounded-xl text-xs text-stone-900 placeholder-stone-600 focus:outline-none focus:border-stone-400"
                />
              </div>
            </div>

            {/* Race Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {FIVE_TOOLS_RACES.filter((r) => r.name.toLowerCase().includes(raceSearch.toLowerCase())).map((race) => {
                const isSelected = character.race.toLowerCase() === race.name.toLowerCase();
                return (
                  <button
                    key={race.name}
                    onClick={() => handleSelectRace(race.name)}
                    className={`p-4 rounded-xl border text-left transition-all relative ${
                      isSelected
                        ? 'bg-white border-stone-900 ring-1 ring-stone-900/10 shadow-sm'
                        : 'bg-[#FAF8F5] hover:bg-[#F5F1EB] border-[#E5DFD5] text-stone-800'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#B85D36]" />
                    )}
                    <div className="font-serif font-semibold text-sm text-stone-900">{race.name}</div>
                    <div className="text-[11px] text-stone-600 mt-1">
                      Speed: {typeof race.speed === 'number' ? race.speed : 30} ft
                    </div>
                    {race.subraces && race.subraces.length > 0 && (
                      <div className="text-[10px] text-stone-600 mt-0.5">
                        {race.subraces.length} subraces
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Subrace selector if available */}
            {selectedRaceObj.subraces && selectedRaceObj.subraces.length > 0 && (
              <div className="p-5 rounded-xl bg-[#FAF8F5] border border-[#E8E3DA] space-y-3">
                <div className="text-xs font-semibold text-stone-900 uppercase tracking-wider">
                  Select {selectedRaceObj.name} Variant / Subrace
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {selectedRaceObj.subraces.map((sub) => {
                    const isSelected = character.subrace === sub.name;
                    return (
                      <button
                        key={sub.name}
                        onClick={() => handleSelectSubrace(sub.name)}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                          isSelected
                            ? 'bg-stone-900 text-white border-stone-900 shadow-sm'
                            : 'bg-white border-[#E0D9CE] text-stone-700 hover:border-stone-400'
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
            <div className="p-5 rounded-xl bg-[#FAF8F5] border border-[#E8E3DA] space-y-3">
              <h4 className="font-serif text-sm font-semibold text-stone-900">
                {selectedRaceObj.name} Traits & Compendium Entries
              </h4>
              <div className="text-xs text-stone-700 leading-relaxed space-y-2">
                {render5eToolsEntries(selectedRaceObj.entries)}
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: CALLING (Class & Subclass) */}
        {currentStep.id === 'class' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-serif text-2xl font-semibold text-stone-900">
                  Choose Class & Subclass
                </h3>
                <p className="text-xs text-stone-600 mt-1">
                  Your class determines your combat training, hit die, saving throws, and magical disciplines.
                </p>
              </div>

              {/* Level Selector */}
              <div className="flex items-center gap-2 bg-[#FAF8F5] px-3 py-1.5 rounded-xl border border-[#E5DFD5]">
                <span className="text-xs text-stone-600 font-medium">Starting Level:</span>
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
                  className="bg-transparent text-stone-900 font-mono font-semibold text-xs focus:outline-none"
                >
                  {Array.from({ length: 20 }, (_, i) => i + 1).map((lvl) => (
                    <option key={lvl} value={lvl} className="bg-white text-stone-900">
                      Level {lvl}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Class Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {FIVE_TOOLS_CLASSES.map((cls) => {
                const isSelected = character.className.toLowerCase() === cls.name.toLowerCase();
                return (
                  <button
                    key={cls.name}
                    onClick={() => handleSelectClass(cls.name)}
                    className={`p-4 rounded-xl border text-left transition-all relative ${
                      isSelected
                        ? 'bg-white border-stone-900 ring-1 ring-stone-900/10 shadow-sm'
                        : 'bg-[#FAF8F5] hover:bg-[#F5F1EB] border-[#E5DFD5] text-stone-800'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#B85D36]" />
                    )}
                    <div className="font-serif font-semibold text-sm text-stone-900">{cls.name}</div>
                    <div className="text-[11px] text-stone-600 mt-1">
                      Hit Die: <span className="font-mono font-semibold text-stone-800">d{cls.hd.faces}</span>
                    </div>
                    {cls.spellcastingAbility && (
                      <div className="text-[10px] text-[#B85D36] mt-0.5 capitalize">
                        {cls.spellcastingAbility} Spellcaster
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Subclasses Selection */}
            {selectedClassObj.subclasses && selectedClassObj.subclasses.length > 0 && (
              <div className="p-5 rounded-xl bg-[#FAF8F5] border border-[#E8E3DA] space-y-3">
                <div className="text-xs font-semibold text-stone-900 uppercase tracking-wider">
                  Select {selectedClassObj.name} Subclass / Archetype
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {selectedClassObj.subclasses.map((sub) => {
                    const isSelected = character.subclass === sub.name;
                    return (
                      <button
                        key={sub.name}
                        onClick={() => update({ subclass: sub.name })}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                          isSelected
                            ? 'bg-stone-900 text-white border-stone-900 shadow-sm'
                            : 'bg-white border-[#E0D9CE] text-stone-700 hover:border-stone-400'
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
            <div className="p-5 rounded-xl bg-[#FAF8F5] border border-[#E8E3DA] space-y-3">
              <h4 className="font-serif text-sm font-semibold text-stone-900">
                {selectedClassObj.name} Features (Level {character.level})
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {(selectedClassObj.features || [])
                  .filter((f) => f.level <= character.level)
                  .map((feat) => (
                    <div key={feat.name} className="p-3.5 rounded-xl bg-white border border-[#E5DFD5]">
                      <div className="font-semibold text-stone-900 flex items-center justify-between">
                        <span>{feat.name}</span>
                        <span className="text-[10px] text-stone-600 font-normal">Level {feat.level}</span>
                      </div>
                      <div className="text-stone-600 mt-1 leading-relaxed text-[11px]">
                        {render5eToolsEntries(feat.entries)}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: ATTRIBUTES (Ability Scores) */}
        {currentStep.id === 'abilities' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-serif text-2xl font-semibold text-stone-900">
                  Assign Ability Scores
                </h3>
                <p className="text-xs text-stone-600 mt-1">
                  Choose 27-Point Buy, Standard Array [15, 14, 13, 12, 10, 8], or 4d6-drop-lowest rolling.
                </p>
              </div>

              {/* Mode Switcher */}
              <div className="flex items-center gap-1 p-1 bg-[#FAF8F5] rounded-xl border border-[#E5DFD5] text-xs">
                {(['pointbuy', 'standard', 'rolled'] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => {
                      if (m === 'standard') {
                        const rec = CLASS_RECOMMENDED_SCORES[character.className] || CLASS_RECOMMENDED_SCORES.Fighter;
                        update({ abilityMode: m, baseAbilities: { ...rec } });
                      } else {
                        update({ abilityMode: m });
                      }
                    }}
                    className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                      character.abilityMode === m
                        ? 'bg-stone-900 text-white font-semibold shadow-sm'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    {m === 'pointbuy' ? 'Point Buy (27 pts)' : m === 'standard' ? 'Standard Array' : '4d6 Drop Lowest'}
                  </button>
                ))}
              </div>
            </div>

            {/* Helpful Quick-Start Actions: "Get out of the way" */}
            <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E8E3DA] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="text-xs font-semibold text-stone-900">
                  {character.abilityMode === 'pointbuy'
                    ? `Point Buy: ${pointBuyRemaining} Points Remaining (Used ${pointBuyUsed} / 27)`
                    : character.abilityMode === 'standard'
                    ? 'Standard Array: [15, 14, 13, 12, 10, 8]'
                    : '4d6 Drop Lowest Dice Rolls'}
                </div>
                <div className="text-[11px] text-stone-600 mt-0.5">
                  Scores 8 to 15 before lineage bonuses. Modifiers calculate automatically.
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleApplyRecommendedScores}
                  className="px-3 py-1.5 rounded-lg bg-white hover:bg-stone-50 border border-[#DDD5C7] text-stone-800 text-xs font-medium transition-all shadow-sm flex items-center gap-1.5"
                  title={`Set standard recommended scores for ${character.className}`}
                >
                  <Wand2 className="w-3.5 h-3.5 text-[#B85D36]" />
                  <span>Recommend for {character.className}</span>
                </button>

                {character.abilityMode === 'rolled' && (
                  <button
                    type="button"
                    onClick={() => {
                      update({
                        baseAbilities: {
                          str: roll4d6DropLowest().total,
                          dex: roll4d6DropLowest().total,
                          con: roll4d6DropLowest().total,
                          int: roll4d6DropLowest().total,
                          wis: roll4d6DropLowest().total,
                          cha: roll4d6DropLowest().total,
                        },
                      });
                    }}
                    className="px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium transition-all shadow-sm flex items-center gap-1.5"
                  >
                    <Dices className="w-3.5 h-3.5" />
                    <span>Roll All 6</span>
                  </button>
                )}
              </div>
            </div>

            {/* 6 Ability Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
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
                    className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E5DFD5] text-center flex flex-col items-center justify-between shadow-sm"
                  >
                    <div className="text-[11px] uppercase font-semibold tracking-wider text-stone-600">
                      {stat}
                    </div>

                    <div className="my-2.5">
                      <div className="text-3xl font-mono font-bold text-stone-900 tabular-nums">
                        {formatModifier(mod)}
                      </div>
                      <div className="text-xs text-stone-600 mt-0.5">
                        Total: <span className="font-semibold text-stone-900 tabular-nums">{total}</span>
                      </div>
                    </div>

                    <div className="w-full flex items-center justify-between gap-1 pt-2 border-t border-[#E8E3DA]">
                      <button
                        onClick={handleDecrement}
                        disabled={character.abilityMode === 'pointbuy' && baseVal <= 8}
                        className="w-7 h-7 rounded-lg bg-white hover:bg-stone-100 text-stone-800 border border-[#DDD5C7] font-semibold text-sm disabled:opacity-30 shadow-sm"
                      >
                        -
                      </button>
                      <span className="font-mono text-sm font-semibold text-stone-900 tabular-nums">
                        {baseVal}
                      </span>
                      <button
                        onClick={handleIncrement}
                        disabled={character.abilityMode === 'pointbuy' && baseVal >= 15}
                        className="w-7 h-7 rounded-lg bg-white hover:bg-stone-100 text-stone-800 border border-[#DDD5C7] font-semibold text-sm disabled:opacity-30 shadow-sm"
                      >
                        +
                      </button>
                    </div>

                    {racialBonus > 0 && (
                      <div className="text-[10px] text-[#2E4A3E] font-medium mt-1.5">
                        +{racialBonus} lineage
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
              <h3 className="font-serif text-2xl font-semibold text-stone-900">
                Background, Persona & Alignment
              </h3>
              <p className="text-xs text-stone-600 mt-1">
                Your origin story, training in skills, moral compass, and personal characteristics.
              </p>
            </div>

            {/* Background Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {FIVE_TOOLS_BACKGROUNDS.map((bg) => {
                const isSelected = character.background.toLowerCase() === bg.name.toLowerCase();
                return (
                  <button
                    key={bg.name}
                    onClick={() => handleSelectBackground(bg.name)}
                    className={`p-4 rounded-xl border text-left transition-all relative ${
                      isSelected
                        ? 'bg-white border-stone-900 ring-1 ring-stone-900/10 shadow-sm'
                        : 'bg-[#FAF8F5] hover:bg-[#F5F1EB] border-[#E5DFD5] text-stone-800'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#B85D36]" />
                    )}
                    <div className="font-serif font-semibold text-sm text-stone-900">{bg.name}</div>
                    <div className="text-[11px] text-stone-600 mt-1 truncate">
                      {bg.skillProficiencies?.join(', ')}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Alignment Row */}
            <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E8E3DA] space-y-2">
              <label className="text-xs font-semibold text-stone-900 block">Alignment</label>
              <div className="grid grid-cols-3 sm:grid-cols-9 gap-1.5 text-xs">
                {[
                  'Lawful Good', 'Neutral Good', 'Chaotic Good',
                  'Lawful Neutral', 'True Neutral', 'Chaotic Neutral',
                  'Lawful Evil', 'Neutral Evil', 'Chaotic Evil',
                ].map((align) => (
                  <button
                    key={align}
                    onClick={() => update({ alignment: align })}
                    className={`py-1.5 px-2 rounded-lg border text-center transition-all truncate text-xs ${
                      character.alignment === align
                        ? 'bg-stone-900 text-white font-semibold border-stone-900 shadow-sm'
                        : 'bg-white border-[#E0D9CE] text-stone-700 hover:border-stone-400'
                    }`}
                  >
                    {align}
                  </button>
                ))}
              </div>
            </div>

            {/* Roleplay Toolbar: Fast 1-click population */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-[#FAF8F5] border border-[#E8E3DA] rounded-xl">
              <div>
                <span className="text-xs font-semibold text-stone-900">
                  {selectedBgObj.name} Roleplay Tables
                </span>
                <p className="text-[11px] text-stone-600">
                  Quickly auto-fill or roll suggested traits, ideals, bonds, and flaws from the 5e compendium.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const traits = selectedBgObj.suggestedTraits || [];
                    const ideals = selectedBgObj.suggestedIdeals || [];
                    const bonds = selectedBgObj.suggestedBonds || [];
                    const flaws = selectedBgObj.suggestedFlaws || [];
                    update({
                      personalityTraits: traits[0] || character.personalityTraits,
                      ideals: ideals[0] || character.ideals,
                      bonds: bonds[0] || character.bonds,
                      flaws: flaws[0] || character.flaws,
                    });
                  }}
                  className="px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium transition-all shadow-sm"
                >
                  Auto-Fill 5e Defaults
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const traits = selectedBgObj.suggestedTraits || [];
                    const ideals = selectedBgObj.suggestedIdeals || [];
                    const bonds = selectedBgObj.suggestedBonds || [];
                    const flaws = selectedBgObj.suggestedFlaws || [];
                    update({
                      personalityTraits: traits[Math.floor(Math.random() * traits.length)] || character.personalityTraits,
                      ideals: ideals[Math.floor(Math.random() * ideals.length)] || character.ideals,
                      bonds: bonds[Math.floor(Math.random() * bonds.length)] || character.bonds,
                      flaws: flaws[Math.floor(Math.random() * flaws.length)] || character.flaws,
                    });
                  }}
                  className="px-3 py-1.5 rounded-lg bg-white hover:bg-stone-50 text-stone-800 border border-[#DDD5C7] text-xs font-medium transition-all shadow-sm flex items-center gap-1.5"
                >
                  <Dices className="w-3.5 h-3.5 text-[#B85D36]" />
                  <span>Roll 5e Tables</span>
                </button>
              </div>
            </div>

            {/* Personality 4-Field Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-900 block">Personality Traits</label>
                <textarea
                  value={character.personalityTraits}
                  onChange={(e) => update({ personalityTraits: e.target.value })}
                  placeholder="Quirks, habits, demeanor..."
                  className="w-full h-20 p-3 bg-[#FAF8F5] border border-[#E5DFD5] rounded-xl text-xs text-stone-900 focus:outline-none focus:border-stone-400 resize-none leading-relaxed"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-900 block">Ideals</label>
                <textarea
                  value={character.ideals}
                  onChange={(e) => update({ ideals: e.target.value })}
                  placeholder="Guiding principles, morals, beliefs..."
                  className="w-full h-20 p-3 bg-[#FAF8F5] border border-[#E5DFD5] rounded-xl text-xs text-stone-900 focus:outline-none focus:border-stone-400 resize-none leading-relaxed"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-900 block">Bonds</label>
                <textarea
                  value={character.bonds}
                  onChange={(e) => update({ bonds: e.target.value })}
                  placeholder="People, places, or heirlooms you would die for..."
                  className="w-full h-20 p-3 bg-[#FAF8F5] border border-[#E5DFD5] rounded-xl text-xs text-stone-900 focus:outline-none focus:border-stone-400 resize-none leading-relaxed"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-900 block">Flaws</label>
                <textarea
                  value={character.flaws}
                  onChange={(e) => update({ flaws: e.target.value })}
                  placeholder="Weaknesses, vices, blind spots..."
                  className="w-full h-20 p-3 bg-[#FAF8F5] border border-[#E5DFD5] rounded-xl text-xs text-stone-900 focus:outline-none focus:border-stone-400 resize-none leading-relaxed"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: ARMORY (Equipment & Gear) */}
        {currentStep.id === 'equipment' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-serif text-2xl font-semibold text-stone-900">
                  Equipment & Armory
                </h3>
                <p className="text-xs text-stone-600 mt-1">
                  Equip starting weapons, protective armor, and adventure gear. Equipped items instantly update Armor Class.
                </p>
              </div>

              <button
                onClick={() => setIsArmoryModalOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-white hover:bg-stone-50 border border-[#DDD5C7] text-stone-800 text-xs font-medium flex items-center gap-2 self-start sm:self-auto transition-all shadow-sm"
              >
                <Swords className="w-3.5 h-3.5 text-[#B85D36]" />
                <span>Open Armory Catalog</span>
              </button>
            </div>

            {/* Optimal Pre-Selected Armory Banner & Quick Loadout Archetypes */}
            <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E8E3DA] space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2.5 border-b border-[#E8E3DA]">
                <div>
                  <div className="text-xs font-semibold text-stone-900 flex items-center gap-2">
                    <Wand2 className="w-3.5 h-3.5 text-[#B85D36]" />
                    <span>Optimal 5e Armory Pre-Selected for {character.className}</span>
                  </div>
                  <div className="text-[11px] text-stone-600 mt-0.5">
                    Authentic 5e weapons, armor, shield, adventuring pack, and starting currency tailored for {character.className}.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const opt = getOptimalArmoryForClass(character.className);
                    update({
                      weapons: opt.weapons,
                      armor: opt.armor,
                      inventory: opt.inventory,
                      currency: opt.currency,
                    });
                  }}
                  className="px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium transition-all shadow-sm flex items-center gap-1.5 self-start sm:self-auto shrink-0"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Re-apply Optimal Armory</span>
                </button>
              </div>

              <div className="text-[11px] font-semibold text-stone-800 uppercase tracking-wider flex items-center justify-between">
                <span>Or Choose Quick Archetype Kit:</span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => {
                    const w1 = FIVE_TOOLS_WEAPONS.find((w) => w.id === 'w_longsword') || FIVE_TOOLS_WEAPONS[0];
                    const w2 = FIVE_TOOLS_WEAPONS.find((w) => w.id === 'w_heavy_crossbow') || FIVE_TOOLS_WEAPONS[1];
                    const a1 = FIVE_TOOLS_ARMOR.find((a) => a.id === 'a_chain_mail') || FIVE_TOOLS_ARMOR[0];
                    const a2 = FIVE_TOOLS_ARMOR.find((a) => a.id === 'a_shield') || FIVE_TOOLS_ARMOR[1];
                    update({
                      weapons: [{ ...w1, equipped: true }, { ...w2, equipped: false }],
                      armor: [{ ...a1, equipped: true }, { ...a2, equipped: true }],
                      inventory: FIVE_TOOLS_STANDARD_GEAR.slice(0, 8),
                      currency: { cp: 0, sp: 20, ep: 0, gp: 35, pp: 0 },
                    });
                  }}
                  className="px-3 py-1.5 rounded-lg bg-white hover:bg-stone-100 text-stone-800 border border-[#DDD5C7] text-xs font-medium shadow-sm transition-all"
                >
                  Martial Warrior Kit
                </button>

                <button
                  onClick={() => {
                    const w1 = FIVE_TOOLS_WEAPONS.find((w) => w.id === 'w_rapier') || FIVE_TOOLS_WEAPONS[0];
                    const w2 = FIVE_TOOLS_WEAPONS.find((w) => w.id === 'w_shortbow') || FIVE_TOOLS_WEAPONS[1];
                    const a1 = FIVE_TOOLS_ARMOR.find((a) => a.id === 'a_leather') || FIVE_TOOLS_ARMOR[0];
                    update({
                      weapons: [{ ...w1, equipped: true }, { ...w2, equipped: true }],
                      armor: [{ ...a1, equipped: true }],
                      inventory: FIVE_TOOLS_STANDARD_GEAR.slice(0, 8),
                      currency: { cp: 0, sp: 40, ep: 0, gp: 60, pp: 0 },
                    });
                  }}
                  className="px-3 py-1.5 rounded-lg bg-white hover:bg-stone-100 text-stone-800 border border-[#DDD5C7] text-xs font-medium shadow-sm transition-all"
                >
                  Finesse & Scout Kit
                </button>

                <button
                  onClick={() => {
                    const w1 = FIVE_TOOLS_WEAPONS.find((w) => w.id === 'w_quarterstaff') || FIVE_TOOLS_WEAPONS[0];
                    const w2 = FIVE_TOOLS_WEAPONS.find((w) => w.id === 'w_dagger') || FIVE_TOOLS_WEAPONS[1];
                    update({
                      weapons: [{ ...w1, equipped: true }, { ...w2, equipped: true }],
                      armor: [],
                      inventory: FIVE_TOOLS_STANDARD_GEAR.slice(0, 8),
                      currency: { cp: 10, sp: 15, ep: 0, gp: 75, pp: 0 },
                    });
                  }}
                  className="px-3 py-1.5 rounded-lg bg-white hover:bg-stone-100 text-stone-800 border border-[#DDD5C7] text-xs font-medium shadow-sm transition-all"
                >
                  Scholar & Mage Kit
                </button>

                <button
                  onClick={() => {
                    const w1 = FIVE_TOOLS_WEAPONS.find((w) => w.id === 'w_light_crossbow') || FIVE_TOOLS_WEAPONS[0];
                    const w2 = FIVE_TOOLS_WEAPONS.find((w) => w.id === 'w_dagger') || FIVE_TOOLS_WEAPONS[1];
                    const a1 = FIVE_TOOLS_ARMOR.find((a) => a.id === 'a_scale_mail') || FIVE_TOOLS_ARMOR[0];
                    const a2 = FIVE_TOOLS_ARMOR.find((a) => a.id === 'a_shield') || FIVE_TOOLS_ARMOR[1];
                    const thievesTools = FIVE_TOOLS_STANDARD_GEAR.find((g) => g.id === 'g_thieves_tools') || FIVE_TOOLS_STANDARD_GEAR[0];
                    update({
                      weapons: [{ ...w1, equipped: true }, { ...w2, equipped: true }],
                      armor: [{ ...a1, equipped: true }, { ...a2, equipped: true }],
                      inventory: [
                        thievesTools,
                        { id: 'g_tinker_tools', name: "Tinker's Tools", category: 'Tools', quantity: 1, weight: 10, cost: '50 gp' },
                        ...FIVE_TOOLS_STANDARD_GEAR.slice(0, 6),
                      ],
                      currency: { cp: 0, sp: 20, ep: 0, gp: 50, pp: 0 },
                    });
                  }}
                  className="px-3 py-1.5 rounded-lg bg-white hover:bg-stone-100 text-stone-800 border border-[#DDD5C7] text-xs font-medium shadow-sm transition-all"
                >
                  Artificer Kit
                </button>
              </div>
            </div>

            {/* Currently Equipped Weapons & Armor */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-xl bg-[#FAF8F5] border border-[#E8E3DA] space-y-3">
                <div className="text-xs font-semibold text-stone-900 uppercase tracking-wider flex items-center justify-between">
                  <span>Selected Weapons ({character.weapons?.length || 0})</span>
                  <span className="text-[10px] text-stone-600">Equip or stow</span>
                </div>
                {(!character.weapons || character.weapons.length === 0) ? (
                  <div className="text-xs text-stone-600 italic py-2">No weapons added yet. Pick from catalog below.</div>
                ) : (
                  character.weapons.map((w, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-[#E5DFD5] text-xs shadow-sm">
                      <div>
                        <span className="font-semibold text-stone-900">{w.name}</span>
                        <span className="text-stone-600 ml-2 font-mono">{w.damage} {w.damageType}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            const updated = [...character.weapons];
                            updated[idx].equipped = !updated[idx].equipped;
                            update({ weapons: updated });
                          }}
                          className={`px-2.5 py-0.5 rounded-md text-[11px] font-medium transition-all ${
                            w.equipped ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-600'
                          }`}
                        >
                          {w.equipped ? 'Equipped' : 'Stowed'}
                        </button>
                        <button
                          onClick={() => {
                            const updated = character.weapons.filter((_, i) => i !== idx);
                            update({ weapons: updated });
                          }}
                          className="p-1 text-stone-600 hover:text-stone-900 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="p-5 rounded-xl bg-[#FAF8F5] border border-[#E8E3DA] space-y-3">
                <div className="text-xs font-semibold text-stone-900 uppercase tracking-wider flex items-center justify-between">
                  <span>Selected Armor & Shield ({character.armor?.length || 0})</span>
                  <span className="text-[10px] text-stone-600">Equip or stow</span>
                </div>
                {(!character.armor || character.armor.length === 0) ? (
                  <div className="text-xs text-stone-600 italic py-2">No armor added yet. Pick from catalog below.</div>
                ) : (
                  character.armor.map((a, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-[#E5DFD5] text-xs shadow-sm">
                      <div>
                        <span className="font-semibold text-stone-900">{a.name}</span>
                        <span className="text-stone-600 ml-2 font-mono">AC {a.ac}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            const updated = [...character.armor];
                            updated[idx].equipped = !updated[idx].equipped;
                            update({ armor: updated });
                          }}
                          className={`px-2.5 py-0.5 rounded-md text-[11px] font-medium transition-all ${
                            a.equipped ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-600'
                          }`}
                        >
                          {a.equipped ? 'Equipped' : 'Packed'}
                        </button>
                        <button
                          onClick={() => {
                            const updated = character.armor.filter((_, i) => i !== idx);
                            update({ armor: updated });
                          }}
                          className="p-1 text-stone-600 hover:text-stone-900 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Direct Equipment Browser */}
            <div className="p-5 rounded-xl bg-[#FAF8F5] border border-[#E8E3DA] space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 bg-white p-0.5 rounded-xl border border-[#E0D9CE]">
                    <button
                      onClick={() => setBuilderGearTab('weapons')}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                        builderGearTab === 'weapons' ? 'bg-stone-900 text-white font-semibold' : 'text-stone-600 hover:text-stone-900'
                      }`}
                    >
                      Weapons
                    </button>
                    <button
                      onClick={() => setBuilderGearTab('armor')}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                        builderGearTab === 'armor' ? 'bg-stone-900 text-white font-semibold' : 'text-stone-600 hover:text-stone-900'
                      }`}
                    >
                      Armor & Shields
                    </button>
                    <button
                      onClick={() => setBuilderGearTab('gear')}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                        builderGearTab === 'gear' ? 'bg-stone-900 text-white font-semibold' : 'text-stone-600 hover:text-stone-900'
                      }`}
                    >
                      Standard Gear
                    </button>
                  </div>
                </div>

                <div className="relative w-full sm:w-64">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-600" />
                  <input
                    type="text"
                    placeholder="Search equipment..."
                    value={builderGearSearch}
                    onChange={(e) => setBuilderGearSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 bg-white border border-[#E5DFD5] rounded-xl text-xs text-stone-900 placeholder-stone-600 focus:outline-none focus:border-stone-400"
                  />
                </div>
              </div>

              {/* Items Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-72 overflow-y-auto pr-1">
                {builderGearTab === 'weapons' &&
                  FIVE_TOOLS_WEAPONS.filter(
                    (w) =>
                      w.name.toLowerCase().includes(builderGearSearch.toLowerCase()) ||
                      w.category.toLowerCase().includes(builderGearSearch.toLowerCase())
                  ).map((w) => {
                    const isAlreadyEquipped = character.weapons?.some((cw) => cw.name === w.name && cw.equipped);
                    return (
                      <div key={w.id} className="p-3.5 rounded-xl bg-white border border-[#E5DFD5] flex flex-col justify-between gap-2 shadow-sm">
                        <div>
                          <div className="flex items-start justify-between gap-1">
                            <span className="font-semibold text-stone-900 text-xs">{w.name}</span>
                            <span className="font-mono text-stone-800 text-[11px] font-semibold whitespace-nowrap">
                              {w.damage} {w.damageType}
                            </span>
                          </div>
                          <div className="text-[10px] text-stone-600 mt-0.5">
                            {w.category} · {w.weight} lbs · {w.cost}
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 pt-2 border-t border-[#F0EBE1]">
                          <button
                            onClick={() => {
                              const newW: WeaponItem = { ...w, id: `${w.id}_${Date.now()}`, equipped: true };
                              update({ weapons: [...(character.weapons || []), newW] });
                            }}
                            className="flex-1 py-1 px-2 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-[11px] font-medium transition-all"
                          >
                            + Equip
                          </button>
                          <button
                            onClick={() => {
                              const newW: WeaponItem = { ...w, id: `${w.id}_${Date.now()}`, equipped: false };
                              update({ weapons: [...(character.weapons || []), newW] });
                            }}
                            className="py-1 px-2 rounded-lg bg-[#FAF8F5] hover:bg-[#F2ECE3] text-stone-700 text-[11px] font-medium border border-[#E0D9CE]"
                          >
                            + Stowed
                          </button>
                        </div>
                      </div>
                    );
                  })}

                {builderGearTab === 'armor' &&
                  FIVE_TOOLS_ARMOR.filter(
                    (a) =>
                      a.name.toLowerCase().includes(builderGearSearch.toLowerCase()) ||
                      a.category.toLowerCase().includes(builderGearSearch.toLowerCase())
                  ).map((a) => (
                    <div key={a.id} className="p-3.5 rounded-xl bg-white border border-[#E5DFD5] flex flex-col justify-between gap-2 shadow-sm">
                      <div>
                        <div className="flex items-start justify-between gap-1">
                          <span className="font-semibold text-stone-900 text-xs">{a.name}</span>
                          <span className="font-mono text-[#2E4A3E] text-[11px] font-semibold whitespace-nowrap">
                            {a.category === 'Shield' ? `+${a.ac} AC` : `AC ${a.ac}`}
                          </span>
                        </div>
                        <div className="text-[10px] text-stone-600 mt-0.5">
                          {a.category} · {a.weight} lbs · {a.cost}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 pt-2 border-t border-[#F0EBE1]">
                        <button
                          onClick={() => {
                            const newA: ArmorItem = { ...a, id: `${a.id}_${Date.now()}`, equipped: true };
                            update({ armor: [...(character.armor || []), newA] });
                          }}
                          className="flex-1 py-1 px-2 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-[11px] font-medium transition-all"
                        >
                          + Equip
                        </button>
                        <button
                          onClick={() => {
                            const newA: ArmorItem = { ...a, id: `${a.id}_${Date.now()}`, equipped: false };
                            update({ armor: [...(character.armor || []), newA] });
                          }}
                          className="py-1 px-2 rounded-lg bg-[#FAF8F5] hover:bg-[#F2ECE3] text-stone-700 text-[11px] font-medium border border-[#E0D9CE]"
                        >
                          + In Pack
                        </button>
                      </div>
                    </div>
                  ))}

                {builderGearTab === 'gear' &&
                  FIVE_TOOLS_STANDARD_GEAR.filter(
                    (g) =>
                      g.name.toLowerCase().includes(builderGearSearch.toLowerCase()) ||
                      (g.category && g.category.toLowerCase().includes(builderGearSearch.toLowerCase()))
                  ).map((g) => (
                    <div key={g.id} className="p-3.5 rounded-xl bg-white border border-[#E5DFD5] flex flex-col justify-between gap-2 shadow-sm">
                      <div>
                        <div className="flex items-start justify-between gap-1">
                          <span className="font-semibold text-stone-900 text-xs">{g.name}</span>
                          <span className="font-mono text-stone-700 text-[11px]">{g.cost || '—'}</span>
                        </div>
                        <div className="text-[10px] text-stone-600 mt-0.5">
                          {g.category || 'Gear'} · {g.weight} lbs
                        </div>
                      </div>

                      <div className="pt-2 border-t border-[#F0EBE1]">
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
                          className="w-full py-1 px-2 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-[11px] font-medium transition-all"
                        >
                          + Add to Pack
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 6: GRIMOIRE (Spells & Cantrips) */}
        {currentStep.id === 'spells' && (() => {
          const maxSpellLevel = getMaxSpellLevel(character.className, character.level);
          const isCaster = isSpellcastingClass(character.className);
          const slots = getClassSpellSlots(character.className, character.level);

          const filteredSpells = FIVE_TOOLS_SPELLS.filter((sp) => {
            const matchesSearch =
              sp.name.toLowerCase().includes(spellSearch.toLowerCase()) ||
              sp.school.toLowerCase().includes(spellSearch.toLowerCase());

            const matchesClass = filterClassOnly
              ? sp.classes?.some((c) => c.toLowerCase() === character.className.toLowerCase())
              : true;

            const matchesLevel =
              spellLevelFilter === 'all'
                ? true
                : spellLevelFilter === 'eligible'
                ? sp.level <= maxSpellLevel
                : spellLevelFilter === 'cantrip'
                ? sp.level === 0
                : sp.level === parseInt(spellLevelFilter);

            return matchesSearch && matchesClass && matchesLevel;
          });

          return (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-serif text-2xl font-semibold text-stone-900">
                    Spell Grimoire & Cantrips
                  </h3>
                  <p className="text-xs text-stone-600 mt-1">
                    {isCaster
                      ? `Select prepared spells and cantrips. Max spell level for Level ${character.level} ${character.className}: ${maxSpellLevel === 0 ? 'Cantrips only' : `Level ${maxSpellLevel}`}.`
                      : `${character.className} is not a primary spellcasting class, but you may browse or add custom magical spells.`}
                  </p>
                </div>

                {isCaster && (
                  <div className="flex items-center gap-2 bg-[#FAF8F5] px-3 py-1.5 rounded-xl border border-[#E5DFD5]">
                    <span className="text-xs text-stone-600 font-medium">Prepared:</span>
                    <span className="text-xs font-mono font-bold text-stone-900 tabular-nums">
                      {(character.spells || []).length} Spells
                    </span>
                  </div>
                )}
              </div>

              {/* Optimal Grimoire Banner for Casters */}
              {isCaster && (
                <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E8E3DA] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-semibold text-stone-900 flex items-center gap-2">
                      <Wand2 className="w-3.5 h-3.5 text-[#B85D36]" />
                      <span>Optimal Grimoire Pre-Selected for {character.className}</span>
                    </div>
                    <div className="text-[11px] text-stone-600 mt-0.5">
                      Class-curated starter cantrips and 1st-level spells are pre-loaded so your spellcaster is adventure-ready immediately.
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const optSpells = getStartingSpellsForClass(character.className);
                      update({ spells: optSpells });
                    }}
                    className="px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium transition-all shadow-sm flex items-center gap-1.5 self-start sm:self-auto shrink-0"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset to Optimal Spells</span>
                  </button>
                </div>
              )}

              {/* Spell filters bar */}
              <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E8E3DA] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                  {['eligible', 'cantrip', '1', '2', '3', 'all'].map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => setSpellLevelFilter(lvl)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                        spellLevelFilter === lvl
                          ? 'bg-stone-900 text-white font-semibold shadow-sm'
                          : 'bg-white border border-[#E0D9CE] text-stone-700 hover:border-stone-400'
                      }`}
                    >
                      {lvl === 'eligible' ? 'Eligible' : lvl === 'cantrip' ? 'Cantrips' : lvl === 'all' ? 'All' : `Lvl ${lvl}`}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <label className="text-xs text-stone-700 flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filterClassOnly}
                      onChange={(e) => setFilterClassOnly(e.target.checked)}
                      className="rounded border-stone-300 text-stone-900 focus:ring-stone-900/10"
                    />
                    <span>{character.className} only</span>
                  </label>

                  <div className="relative w-48">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-600" />
                    <input
                      type="text"
                      placeholder="Search spells..."
                      value={spellSearch}
                      onChange={(e) => setSpellSearch(e.target.value)}
                      className="w-full pl-8 pr-3 py-1 bg-white border border-[#E5DFD5] rounded-xl text-xs text-stone-900 placeholder-stone-600 focus:outline-none focus:border-stone-400"
                    />
                  </div>
                </div>
              </div>

              {/* Spells Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-80 overflow-y-auto pr-1">
                {filteredSpells.map((sp) => {
                  const isAdded = (character.spells || []).some((s) => s.name === sp.name);
                  const isLocked = isSpellcastingClass(character.className) && sp.level > maxSpellLevel;

                  return (
                    <div
                      key={sp.id}
                      className={`p-3.5 rounded-xl border flex flex-col justify-between gap-2 shadow-sm transition-all ${
                        isLocked
                          ? 'bg-stone-50 border-stone-200 opacity-60'
                          : isAdded
                          ? 'bg-white border-stone-900 ring-1 ring-stone-900/10'
                          : 'bg-white border-[#E5DFD5]'
                      }`}
                    >
                      <div>
                        <div className="flex items-start justify-between gap-1">
                          <span className="font-semibold text-stone-900 text-xs">{sp.name}</span>
                          <span className="font-mono text-xs font-semibold text-[#B85D36]">
                            {sp.level === 0 ? 'Cantrip' : `Level ${sp.level}`}
                          </span>
                        </div>
                        <div className="text-[10px] text-stone-600 mt-0.5">
                          {sp.school} · {sp.castingTime} · {sp.range}
                        </div>
                        <div className="text-[11px] text-stone-600 mt-1 line-clamp-2 leading-relaxed">
                          {sp.description}
                        </div>
                      </div>

                      <div className="pt-2 border-t border-[#F0EBE1] flex items-center justify-between">
                        {isAdded ? (
                          <button
                            onClick={() => {
                              const updated = (character.spells || []).filter((s) => s.name !== sp.name);
                              update({ spells: updated });
                            }}
                            className="w-full py-1 px-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 text-[11px] font-medium transition-all"
                          >
                            Remove from Grimoire
                          </button>
                        ) : (
                          <button
                            disabled={isLocked}
                            onClick={() => {
                              update({ spells: [...(character.spells || []), { ...sp, prepared: true }] });
                            }}
                            className="w-full py-1 px-2 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-[11px] font-medium transition-all disabled:opacity-30"
                          >
                            {isLocked ? 'Level Locked' : '+ Add to Grimoire'}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}

        {/* STEP 7: CHRONICLE (Review & PDF Export) */}
        {currentStep.id === 'review' && (
          <div className="space-y-6">
            <div>
              <h3 className="font-serif text-2xl font-semibold text-stone-900">
                Hero Chronicle & Character Sheet
              </h3>
              <p className="text-xs text-stone-600 mt-1">
                Your character is complete. Confirm final details and download the official fillable PDF sheet.
              </p>
            </div>

            {/* Name and Player details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 rounded-xl bg-[#FAF8F5] border border-[#E8E3DA]">
              <div>
                <label className="text-xs font-semibold text-stone-900 block mb-1">
                  Character Name
                </label>
                <input
                  type="text"
                  value={character.name}
                  onChange={(e) => update({ name: e.target.value })}
                  placeholder="Hero's Full Name"
                  className="w-full px-3 py-2 bg-white border border-[#E5DFD5] rounded-xl text-sm font-serif font-semibold text-stone-900 focus:outline-none focus:border-stone-400"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-900 block mb-1">
                  Player Name
                </label>
                <input
                  type="text"
                  value={character.playerName}
                  onChange={(e) => update({ playerName: e.target.value })}
                  placeholder="Your Name"
                  className="w-full px-3 py-2 bg-white border border-[#E5DFD5] rounded-xl text-sm text-stone-900 focus:outline-none focus:border-stone-400"
                />
              </div>
            </div>

            {/* Core Stats Overview */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E5DFD5] text-center shadow-sm">
                <span className="text-[10px] uppercase font-semibold text-stone-600 block">Armor Class</span>
                <span className="text-2xl font-mono font-bold text-stone-900 tabular-nums">
                  {calculateArmorClass(character.armor, totalAbilities.dex)}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E5DFD5] text-center shadow-sm">
                <span className="text-[10px] uppercase font-semibold text-stone-600 block">Max HP</span>
                <span className="text-2xl font-mono font-bold text-[#2E4A3E] tabular-nums">
                  {character.hpMax}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E5DFD5] text-center shadow-sm">
                <span className="text-[10px] uppercase font-semibold text-stone-600 block">Initiative</span>
                <span className="text-2xl font-mono font-bold text-stone-900 tabular-nums">
                  {formatModifier(getAbilityModifier(totalAbilities.dex))}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E5DFD5] text-center shadow-sm">
                <span className="text-[10px] uppercase font-semibold text-stone-600 block">Speed</span>
                <span className="text-2xl font-mono font-bold text-stone-900 tabular-nums">
                  {character.speed} ft
                </span>
              </div>

              <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E5DFD5] text-center shadow-sm">
                <span className="text-[10px] uppercase font-semibold text-stone-600 block">Prof Bonus</span>
                <span className="text-2xl font-mono font-bold text-[#B85D36] tabular-nums">
                  {formatModifier(getProficiencyBonus(character.level))}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E5DFD5] text-center shadow-sm">
                <span className="text-[10px] uppercase font-semibold text-stone-600 block">Passive Perc</span>
                <span className="text-2xl font-mono font-bold text-stone-900 tabular-nums">
                  {calculatePassivePerception(totalAbilities, character.skillProficiencies, character.skillExpertise, getProficiencyBonus(character.level))}
                </span>
              </div>
            </div>

            {/* Primary Action Card */}
            <div className="p-6 rounded-2xl bg-[#FAF8F5] border border-[#E8E3DA] flex flex-col sm:flex-row sm:items-center justify-between gap-5 shadow-sm">
              <div className="space-y-1">
                <h4 className="font-serif text-lg font-semibold text-stone-900">
                  Ready for Adventure
                </h4>
                <p className="text-xs text-stone-600 max-w-md leading-relaxed">
                  Export as a standard 3-page fillable PDF character sheet with all AcroForm fields populated, or explore in the live interactive digital sheet.
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={onSwitchToSheet}
                  className="px-4 py-2.5 rounded-xl bg-white hover:bg-stone-100 text-stone-800 border border-[#DDD5C7] text-xs font-semibold shadow-sm transition-all"
                >
                  Open Digital Sheet
                </button>

                <button
                  onClick={onExportPdf}
                  disabled={isExportingPdf}
                  className="px-5 py-2.5 rounded-xl bg-[#B85D36] hover:bg-[#A34A25] active:bg-[#8F3E1D] text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-2 disabled:opacity-60"
                >
                  <FileDown className="w-4 h-4" />
                  <span>{isExportingPdf ? 'Exporting...' : 'Export Fillable PDF'}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 4. Bottom Navigation Controls */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={() => setCurrentStepIndex((prev) => Math.max(0, prev - 1))}
          disabled={currentStepIndex === 0}
          className="px-4 py-2.5 rounded-xl bg-white hover:bg-stone-50 text-stone-700 border border-[#DDD5C7] text-xs font-semibold flex items-center gap-1.5 disabled:opacity-30 disabled:pointer-events-none transition-all shadow-sm"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous Step</span>
        </button>

        {currentStepIndex < STEPS.length - 1 ? (
          <button
            onClick={() => setCurrentStepIndex((prev) => Math.min(STEPS.length - 1, prev + 1))}
            className="px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
          >
            <span>Next Step</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={onSwitchToSheet}
            className="px-5 py-2.5 rounded-xl bg-[#2E4A3E] hover:bg-[#243B31] text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
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

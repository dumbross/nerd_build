/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type AbilityName = 'str' | 'dex' | 'con' | 'int' | 'wis' | 'cha';

export interface AbilityScores {
  str: number;
  dex: number;
  con: number;
  int: number;
  wis: number;
  cha: number;
}

export type SkillName =
  | 'acrobatics'
  | 'animal_handling'
  | 'arcana'
  | 'athletics'
  | 'deception'
  | 'history'
  | 'insight'
  | 'intimidation'
  | 'investigation'
  | 'medicine'
  | 'nature'
  | 'perception'
  | 'performance'
  | 'persuasion'
  | 'religion'
  | 'sleight_of_hand'
  | 'stealth'
  | 'survival';

export interface SkillDefinition {
  name: SkillName;
  label: string;
  ability: AbilityName;
}

export const SKILLS_LIST: SkillDefinition[] = [
  { name: 'acrobatics', label: 'Acrobatics', ability: 'dex' },
  { name: 'animal_handling', label: 'Animal Handling', ability: 'wis' },
  { name: 'arcana', label: 'Arcana', ability: 'int' },
  { name: 'athletics', label: 'Athletics', ability: 'str' },
  { name: 'deception', label: 'Deception', ability: 'cha' },
  { name: 'history', label: 'History', ability: 'int' },
  { name: 'insight', label: 'Insight', ability: 'wis' },
  { name: 'intimidation', label: 'Intimidation', ability: 'cha' },
  { name: 'investigation', label: 'Investigation', ability: 'int' },
  { name: 'medicine', label: 'Medicine', ability: 'wis' },
  { name: 'nature', label: 'Nature', ability: 'int' },
  { name: 'perception', label: 'Perception', ability: 'wis' },
  { name: 'performance', label: 'Performance', ability: 'cha' },
  { name: 'persuasion', label: 'Persuasion', ability: 'cha' },
  { name: 'religion', label: 'Religion', ability: 'int' },
  { name: 'sleight_of_hand', label: 'Sleight of Hand', ability: 'dex' },
  { name: 'stealth', label: 'Stealth', ability: 'dex' },
  { name: 'survival', label: 'Survival', ability: 'wis' },
];

export interface WeaponItem {
  id: string;
  name: string;
  category: 'Simple Melee' | 'Simple Ranged' | 'Martial Melee' | 'Martial Ranged';
  damage: string; // e.g. "1d8"
  damageType: string; // e.g. "slashing", "piercing", "bludgeoning"
  properties: string[]; // e.g. ["finesse", "versatile (1d10)"]
  range?: string; // e.g. "20/60"
  weight: number;
  cost: string;
  equipped?: boolean;
}

export interface ArmorItem {
  id: string;
  name: string;
  category: 'Light' | 'Medium' | 'Heavy' | 'Shield';
  ac: number;
  dexBonus: 'full' | 'max2' | 'none';
  stealthDisadvantage?: boolean;
  minStr?: number;
  weight: number;
  cost: string;
  equipped?: boolean;
}

export interface GearItem {
  id: string;
  name: string;
  category?: string;
  quantity: number;
  weight: number;
  cost: string;
  description?: string;
  equipped?: boolean;
}

export interface Currency {
  cp: number;
  sp: number;
  ep: number;
  gp: number;
  pp: number;
}

export interface Spell {
  id: string;
  name: string;
  level: number; // 0 for cantrip
  school: string;
  castingTime: string;
  range: string;
  components: string;
  duration: string;
  description: string;
  damage?: string;
  damageType?: string;
  saveAbility?: AbilityName;
  attackType?: 'melee' | 'ranged';
  prepared?: boolean;
  source?: string;
}

export interface FeatureTrait {
  id: string;
  name: string;
  source: 'Race' | 'Class' | 'Subclass' | 'Background' | 'Feat' | 'Custom';
  level?: number;
  description: string;
  usesMax?: number;
  usesRemaining?: number;
}

export interface DeathSaves {
  successes: number; // 0-3
  failures: number; // 0-3
}

export interface Character {
  id: string;
  name: string;
  playerName: string;
  level: number;
  experience: number;
  alignment: string;
  race: string;
  subrace?: string;
  className: string;
  subclass?: string;
  background: string;
  portraitUrl?: string;

  // Ability generation mode
  abilityMode: 'pointbuy' | 'standard' | 'rolled';
  baseAbilities: AbilityScores;
  customAbilityBonuses?: Partial<AbilityScores>;

  // Proficiencies
  savingThrowProficiencies: AbilityName[];
  skillProficiencies: SkillName[];
  skillExpertise: SkillName[];
  armorProficiencies: string[];
  weaponProficiencies: string[];
  toolProficiencies: string[];
  languages: string[];

  // Combat Status
  hpMax: number;
  hpCurrent: number;
  tempHp: number;
  hitDiceTotal: number;
  hitDiceSpent: number;
  inspiration: boolean;
  deathSaves: DeathSaves;
  speed: number;
  initiativeBonus: number;

  // Equipment & Currency
  weapons: WeaponItem[];
  armor: ArmorItem[];
  inventory: GearItem[];
  currency: Currency;

  // Spellcasting
  spellcastingAbility?: AbilityName;
  spellSlotsTotal: number[]; // Index 1-9 (1st to 9th level)
  spellSlotsExpended: number[];
  spells: Spell[];

  // Features
  features: FeatureTrait[];

  // Personality / Roleplay
  personalityTraits: string;
  ideals: string;
  bonds: string;
  flaws: string;
  backstory: string;
  appearance: string;
  alliesAndOrgs: string;
  additionalNotes: string;

  updatedAt: string;
}

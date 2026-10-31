/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// 5e.tools schema conventions
export interface FiveToolsEntryObject {
  type?: string;
  name?: string;
  entries?: (string | FiveToolsEntryObject)[];
  items?: (string | FiveToolsEntryObject)[];
  caption?: string;
  colLabels?: string[];
  colStyles?: string[];
  rows?: (string | number | FiveToolsEntryObject)[][];
}

export type FiveToolsEntry = string | FiveToolsEntryObject;

export interface FiveToolsAbilityBonus {
  str?: number;
  dex?: number;
  con?: number;
  int?: number;
  wis?: number;
  cha?: number;
  choose?: {
    from: ('str' | 'dex' | 'con' | 'int' | 'wis' | 'cha')[];
    count: number;
    amount?: number;
  };
}

export interface FiveToolsRace {
  name: string;
  source: string;
  page?: number;
  size?: ('T' | 'S' | 'M' | 'L' | 'H' | 'G')[];
  speed?: number | { walk?: number; climb?: number; swim?: number; fly?: number };
  ability?: FiveToolsAbilityBonus[];
  traits?: string[];
  entries?: FiveToolsEntry[];
  subraces?: FiveToolsSubrace[];
  darkvision?: number;
  languages?: string[];
}

export interface FiveToolsSubrace {
  name: string;
  source: string;
  raceName: string;
  ability?: FiveToolsAbilityBonus[];
  entries?: FiveToolsEntry[];
  speed?: number;
  darkvision?: number;
}

export interface FiveToolsClassFeature {
  name: string;
  level: number;
  source: string;
  entries: FiveToolsEntry[];
}

export interface FiveToolsClass {
  name: string;
  source: string;
  hd: { number: number; faces: number };
  proficiency: ('str' | 'dex' | 'con' | 'int' | 'wis' | 'cha')[];
  spellcastingAbility?: 'str' | 'dex' | 'con' | 'int' | 'wis' | 'cha';
  casterProgression?: 'full' | '1/2' | '1/3' | 'pact';
  armorProficiencies?: string[];
  weaponProficiencies?: string[];
  toolProficiencies?: string[];
  skillChoices?: {
    from: string[];
    count: number;
  };
  subclasses?: FiveToolsSubclass[];
  features?: FiveToolsClassFeature[];
  entries?: FiveToolsEntry[];
}

export interface FiveToolsSubclass {
  name: string;
  shortName: string;
  source: string;
  className: string;
  subclassFeatures?: FiveToolsClassFeature[];
  entries?: FiveToolsEntry[];
}

export interface FiveToolsBackground {
  name: string;
  source: string;
  page?: number;
  skillProficiencies?: string[];
  toolProficiencies?: string[];
  languages?: string[];
  startingEquipment?: string[];
  feature?: {
    name: string;
    entries: FiveToolsEntry[];
  };
  entries?: FiveToolsEntry[];
}

export interface FiveToolsSpell {
  name: string;
  source: string;
  page?: number;
  level: number;
  school: string; // "V" (Evocation), "A" (Abjuration), etc. or full name
  time: { number: number; unit: string }[];
  range: { type: string; distance?: { type: string; amount?: number } };
  components: { v?: boolean; s?: boolean; m?: boolean | string };
  duration: { type: string; duration?: { amount: number; type: string }; concentration?: boolean }[];
  classes?: { fromClassList?: { name: string; source: string }[] };
  entries: FiveToolsEntry[];
  damageInflict?: string[];
  savingThrow?: ('str' | 'dex' | 'con' | 'int' | 'wis' | 'cha')[];
  spellAttack?: ('M' | 'R')[];
}

export interface FiveToolsItem {
  name: string;
  source: string;
  type?: string;
  rarity?: string;
  weight?: number;
  value?: number; // in cp
  weaponCategory?: string;
  property?: string[];
  dmg1?: string;
  dmgType?: string;
  ac?: number;
  entries?: FiveToolsEntry[];
}

export interface FiveToolsFeat {
  name: string;
  source: string;
  prerequisite?: any[];
  ability?: FiveToolsAbilityBonus[];
  entries: FiveToolsEntry[];
}

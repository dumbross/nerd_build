/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface MonsterAbilityScores {
  str: number;
  dex: number;
  con: number;
  int: number;
  wis: number;
  cha: number;
}

export interface MonsterTrait {
  name: string;
  desc: string;
}

export interface MonsterAction {
  name: string;
  desc: string;
  attackBonus?: number;
  reachRange?: string;
  damageDice?: string;
  damageBonus?: number;
  damageType?: string;
}

export interface MonsterLegendaryAction {
  name: string;
  desc: string;
  cost?: number;
}

export type MonsterSize = 'Tiny' | 'Small' | 'Medium' | 'Large' | 'Huge' | 'Gargantuan';

export interface Monster {
  id: string;
  name: string;
  source?: string;
  size: MonsterSize;
  type: string; // e.g. "Undead", "Dragon", "Aberration"
  subtype?: string; // e.g. "titan", "shapechanger", "goblinoid"
  alignment: string; // e.g. "Neutral Evil", "Lawful Evil", "Unaligned"
  ac: number;
  acType?: string; // e.g. "Natural armor", "Plate armor", "Shield"
  hp: number;
  hpFormula: string; // e.g. "150 (20d10 + 40)"
  speed: string; // e.g. "40 ft." or "30 ft., fly 60 ft., swim 30 ft."
  abilities: MonsterAbilityScores;
  savingThrows?: string; // e.g. "STR +9, CON +6"
  skills?: string; // e.g. "Athletics +9, Perception +4"
  damageVulnerabilities?: string;
  damageResistances?: string; // e.g. "Necrotic, Psychic"
  damageImmunities?: string; // e.g. "Poison, Fire"
  conditionImmunities?: string; // e.g. "Poisoned, Frightened"
  senses: string; // e.g. "Darkvision 60 ft., passive Perception 14"
  languages: string; // e.g. "Deep Speech, Telepathy 120 ft."
  cr: string; // e.g. "11", "1/4", "1/2", "0", "30"
  xp: number; // e.g. 7200
  proficiencyBonus: number; // e.g. 4
  traits?: MonsterTrait[];
  actions?: MonsterAction[];
  reactions?: MonsterTrait[];
  legendaryHeader?: string;
  legendaryActions?: MonsterLegendaryAction[];
  description?: string; // Lore / sensory description below stat block as in user's image
  imageUrl?: string;
  isCustom?: boolean;
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AbilityName, AbilityScores, Character, SkillName, SKILLS_LIST, Spell } from '../types/character';
import { FIVE_TOOLS_SPELLS } from '../data/spells';

export function getAbilityModifier(score: number): number {
  return Math.floor((score - 10) / 2);
}

export function formatModifier(mod: number): string {
  return mod >= 0 ? `+${mod}` : `${mod}`;
}

export function getProficiencyBonus(level: number): number {
  return Math.ceil(level / 4) + 1; // 1-4: +2, 5-8: +3, 9-12: +4, 13-16: +5, 17-20: +6
}

export function getAbilityScoresTotal(
  character: Pick<Character, 'baseAbilities' | 'customAbilityBonuses'>,
  racialBonuses: Partial<AbilityScores> = {}
): AbilityScores {
  const base = character.baseAbilities || { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 };
  const custom = character.customAbilityBonuses || {};

  return {
    str: (base.str || 10) + (racialBonuses.str || 0) + (custom.str || 0),
    dex: (base.dex || 10) + (racialBonuses.dex || 0) + (custom.dex || 0),
    con: (base.con || 10) + (racialBonuses.con || 0) + (custom.con || 0),
    int: (base.int || 10) + (racialBonuses.int || 0) + (custom.int || 0),
    wis: (base.wis || 10) + (racialBonuses.wis || 0) + (custom.wis || 0),
    cha: (base.cha || 10) + (racialBonuses.cha || 0) + (custom.cha || 0),
  };
}

export function getSavingThrowModifier(
  ability: AbilityName,
  abilityScore: number,
  isProficient: boolean,
  proficiencyBonus: number
): number {
  const baseMod = getAbilityModifier(abilityScore);
  return baseMod + (isProficient ? proficiencyBonus : 0);
}

export function getSkillModifier(
  skillName: SkillName,
  abilities: AbilityScores,
  proficientSkills: SkillName[],
  expertiseSkills: SkillName[],
  proficiencyBonus: number
): number {
  const skillDef = SKILLS_LIST.find((s) => s.name === skillName);
  if (!skillDef) return 0;

  const abilityScore = abilities[skillDef.ability] ?? 10;
  const abilityMod = getAbilityModifier(abilityScore);

  const isProf = proficientSkills.includes(skillName);
  const isExpert = expertiseSkills.includes(skillName);

  if (isExpert) return abilityMod + proficiencyBonus * 2;
  if (isProf) return abilityMod + proficiencyBonus;
  return abilityMod;
}

export function calculatePassivePerception(
  abilities: AbilityScores,
  proficientSkills: SkillName[],
  expertiseSkills: SkillName[],
  proficiencyBonus: number
): number {
  const mod = getSkillModifier('perception', abilities, proficientSkills, expertiseSkills, proficiencyBonus);
  return 10 + mod;
}

export function calculateArmorClass(
  armorList: Character['armor'],
  dexScore: number,
  hasShield: boolean = false,
  unarmoredBonus: number = 0
): number {
  const dexMod = getAbilityModifier(dexScore);
  const equippedArmor = armorList.find((a) => a.equipped && a.category !== 'Shield');
  const equippedShield = armorList.find((a) => a.equipped && a.category === 'Shield');

  let baseAc = 10 + dexMod + unarmoredBonus;

  if (equippedArmor) {
    if (equippedArmor.dexBonus === 'full') {
      baseAc = equippedArmor.ac + dexMod;
    } else if (equippedArmor.dexBonus === 'max2') {
      baseAc = equippedArmor.ac + Math.min(2, dexMod);
    } else {
      baseAc = equippedArmor.ac;
    }
  }

  if (equippedShield || hasShield) {
    baseAc += 2;
  }

  return baseAc;
}

export function calculateSpellSaveDC(
  spellcastingAbilityScore: number,
  proficiencyBonus: number
): number {
  const mod = getAbilityModifier(spellcastingAbilityScore);
  return 8 + proficiencyBonus + mod;
}

export function calculateSpellAttackModifier(
  spellcastingAbilityScore: number,
  proficiencyBonus: number
): number {
  const mod = getAbilityModifier(spellcastingAbilityScore);
  return proficiencyBonus + mod;
}

// Point Buy standard rules (27 points total, base 8)
export const POINT_BUY_COST: Record<number, number> = {
  8: 0,
  9: 1,
  10: 2,
  11: 3,
  12: 4,
  13: 5,
  14: 7,
  15: 9,
};

export function calculatePointBuyUsed(abilities: AbilityScores): number {
  return (
    (POINT_BUY_COST[abilities.str] ?? 0) +
    (POINT_BUY_COST[abilities.dex] ?? 0) +
    (POINT_BUY_COST[abilities.con] ?? 0) +
    (POINT_BUY_COST[abilities.int] ?? 0) +
    (POINT_BUY_COST[abilities.wis] ?? 0) +
    (POINT_BUY_COST[abilities.cha] ?? 0)
  );
}

// 5e standard spell slots progression for Full Casters (Wizard, Cleric, Druid, Sorcerer, Bard)
export const FULL_CASTER_SLOTS: Record<number, number[]> = {
  1: [2, 0, 0, 0, 0, 0, 0, 0, 0],
  2: [3, 0, 0, 0, 0, 0, 0, 0, 0],
  3: [4, 2, 0, 0, 0, 0, 0, 0, 0],
  4: [4, 3, 0, 0, 0, 0, 0, 0, 0],
  5: [4, 3, 2, 0, 0, 0, 0, 0, 0],
  6: [4, 3, 3, 0, 0, 0, 0, 0, 0],
  7: [4, 3, 3, 1, 0, 0, 0, 0, 0],
  8: [4, 3, 3, 2, 0, 0, 0, 0, 0],
  9: [4, 3, 3, 3, 1, 0, 0, 0, 0],
  10: [4, 3, 3, 3, 2, 0, 0, 0, 0],
  11: [4, 3, 3, 3, 2, 1, 0, 0, 0],
  12: [4, 3, 3, 3, 2, 1, 0, 0, 0],
  13: [4, 3, 3, 3, 2, 1, 1, 0, 0],
  14: [4, 3, 3, 3, 2, 1, 1, 0, 0],
  15: [4, 3, 3, 3, 2, 1, 1, 1, 0],
  16: [4, 3, 3, 3, 2, 1, 1, 1, 0],
  17: [4, 3, 3, 3, 2, 1, 1, 1, 1],
  18: [4, 3, 3, 3, 3, 1, 1, 1, 1],
  19: [4, 3, 3, 3, 3, 2, 1, 1, 1],
  20: [4, 3, 3, 3, 3, 2, 2, 1, 1],
};

// Half Casters (Paladin, Ranger)
export const HALF_CASTER_SLOTS: Record<number, number[]> = {
  1: [0, 0, 0, 0, 0, 0, 0, 0, 0],
  2: [2, 0, 0, 0, 0, 0, 0, 0, 0],
  3: [3, 0, 0, 0, 0, 0, 0, 0, 0],
  4: [3, 0, 0, 0, 0, 0, 0, 0, 0],
  5: [4, 2, 0, 0, 0, 0, 0, 0, 0],
  6: [4, 2, 0, 0, 0, 0, 0, 0, 0],
  7: [4, 3, 0, 0, 0, 0, 0, 0, 0],
  8: [4, 3, 0, 0, 0, 0, 0, 0, 0],
  9: [4, 3, 2, 0, 0, 0, 0, 0, 0],
  10: [4, 3, 2, 0, 0, 0, 0, 0, 0],
  11: [4, 3, 3, 0, 0, 0, 0, 0, 0],
  12: [4, 3, 3, 0, 0, 0, 0, 0, 0],
  13: [4, 3, 3, 1, 0, 0, 0, 0, 0],
  14: [4, 3, 3, 1, 0, 0, 0, 0, 0],
  15: [4, 3, 3, 2, 0, 0, 0, 0, 0],
  16: [4, 3, 3, 2, 0, 0, 0, 0, 0],
  17: [4, 3, 3, 3, 1, 0, 0, 0, 0],
  18: [4, 3, 3, 3, 1, 0, 0, 0, 0],
  19: [4, 3, 3, 3, 2, 0, 0, 0, 0],
  20: [4, 3, 3, 3, 2, 0, 0, 0, 0],
};

// Artificer Progression (Half Caster with 1st-level spellcasting, rounded up)
export const ARTIFICER_CASTER_SLOTS: Record<number, number[]> = {
  1: [2, 0, 0, 0, 0, 0, 0, 0, 0],
  2: [2, 0, 0, 0, 0, 0, 0, 0, 0],
  3: [3, 0, 0, 0, 0, 0, 0, 0, 0],
  4: [3, 0, 0, 0, 0, 0, 0, 0, 0],
  5: [4, 2, 0, 0, 0, 0, 0, 0, 0],
  6: [4, 2, 0, 0, 0, 0, 0, 0, 0],
  7: [4, 3, 0, 0, 0, 0, 0, 0, 0],
  8: [4, 3, 0, 0, 0, 0, 0, 0, 0],
  9: [4, 3, 2, 0, 0, 0, 0, 0, 0],
  10: [4, 3, 2, 0, 0, 0, 0, 0, 0],
  11: [4, 3, 3, 0, 0, 0, 0, 0, 0],
  12: [4, 3, 3, 0, 0, 0, 0, 0, 0],
  13: [4, 3, 3, 1, 0, 0, 0, 0, 0],
  14: [4, 3, 3, 1, 0, 0, 0, 0, 0],
  15: [4, 3, 3, 2, 0, 0, 0, 0, 0],
  16: [4, 3, 3, 2, 0, 0, 0, 0, 0],
  17: [4, 3, 3, 3, 1, 0, 0, 0, 0],
  18: [4, 3, 3, 3, 1, 0, 0, 0, 0],
  19: [4, 3, 3, 3, 2, 0, 0, 0, 0],
  20: [4, 3, 3, 3, 2, 0, 0, 0, 0],
};

export function getClassSpellSlots(className: string, level: number): number[] {
  const norm = className.toLowerCase();
  const lvl = Math.max(1, Math.min(20, level));

  if (['wizard', 'cleric', 'druid', 'sorcerer', 'bard'].includes(norm)) {
    return FULL_CASTER_SLOTS[lvl] || [0, 0, 0, 0, 0, 0, 0, 0, 0];
  }
  if (['paladin', 'ranger'].includes(norm)) {
    return HALF_CASTER_SLOTS[lvl] || [0, 0, 0, 0, 0, 0, 0, 0, 0];
  }
  if (norm === 'artificer') {
    return ARTIFICER_CASTER_SLOTS[lvl] || [0, 0, 0, 0, 0, 0, 0, 0, 0];
  }
  if (norm === 'warlock') {
    // Pact magic: slot count and level
    const pactSlots = lvl === 1 ? 1 : lvl < 11 ? 2 : lvl < 17 ? 3 : 4;
    const pactLvl = lvl < 3 ? 1 : lvl < 5 ? 2 : lvl < 7 ? 3 : lvl < 9 ? 4 : 5;
    const slots = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    slots[pactLvl - 1] = pactSlots;
    return slots;
  }
  return [0, 0, 0, 0, 0, 0, 0, 0, 0];
}

/**
 * Returns the maximum spell level (1-9) that the character can cast based on their class & level.
 * Returns 0 if the class does not have spell slots yet (e.g. Level 1 Paladin/Ranger, Barbarian, etc.).
 */
export function getMaxSpellLevel(className: string, level: number): number {
  const slots = getClassSpellSlots(className, level);
  for (let i = slots.length - 1; i >= 0; i--) {
    if (slots[i] > 0) {
      return i + 1;
    }
  }
  return 0;
}

/**
 * Checks whether a character has innate or class spellcasting capability.
 */
export function isSpellcastingClass(className: string): boolean {
  const norm = className.toLowerCase();
  return ['wizard', 'cleric', 'druid', 'sorcerer', 'bard', 'paladin', 'ranger', 'artificer', 'warlock'].includes(norm);
}

/**
 * Evaluates whether a spell can be selected by a character given their class, level, and spell slot restrictions.
 */
export function isSpellEligible(
  spell: { level: number; classes?: string[] },
  className: string,
  level: number
): { eligible: boolean; reason?: string; isHigherLevel?: boolean; isOffClass?: boolean } {
  const normClass = className.toLowerCase();
  const maxSlot = getMaxSpellLevel(className, level);
  const isCaster = isSpellcastingClass(className);

  // Cantrip (level 0)
  if (spell.level === 0) {
    if (!isCaster) {
      return {
        eligible: true,
        reason: `${className}s don't cast spells by default, but can learn cantrips through race or feats.`,
      };
    }
    const onClassList = !spell.classes || spell.classes.some((c) => c.toLowerCase() === normClass);
    if (!onClassList) {
      return {
        eligible: true,
        isOffClass: true,
        reason: `Not on standard ${className} spell list (available via Magic Initiate or DM option).`,
      };
    }
    return { eligible: true };
  }

  // Leveled Spell (level 1-9)
  if (!isCaster) {
    return {
      eligible: false,
      reason: `${className} does not have spellcasting. Subclasses (e.g., Eldritch Knight) gain spells at Level 3.`,
    };
  }

  if (maxSlot === 0) {
    return {
      eligible: false,
      isHigherLevel: true,
      reason: `No spell slots yet: A Level ${level} ${className} cannot cast leveled spells (${className}s unlock 1st-level spell slots at Level 2).`,
    };
  }

  if (spell.level > maxSlot) {
    return {
      eligible: false,
      isHigherLevel: true,
      reason: `Spell level too high: Level ${level} ${className} can only cast up to Level ${maxSlot} spells.`,
    };
  }

  const onClassList = !spell.classes || spell.classes.some((c) => c.toLowerCase() === normClass);
  if (!onClassList) {
    return {
      eligible: true,
      isOffClass: true,
      reason: `Not on standard ${className} spell list (normally requires domain/oath/special feat).`,
    };
  }

  return { eligible: true };
}

/**
 * Provides authentic 5e starting Cantrips (level 0) and 1st-level spells tailored for each spellcaster class.
 */
export function getStartingSpellsForClass(className: string): Spell[] {
  const norm = className.toLowerCase().trim();
  const starters: Record<string, string[]> = {
    wizard: ['Fire Bolt', 'Mage Hand', 'Minor Illusion', 'Magic Missile', 'Shield', 'Mage Armor', 'Detect Magic'],
    sorcerer: ['Fire Bolt', 'Ray of Frost', 'Prestidigitation', 'Shocking Grasp', 'Burning Hands', 'Shield'],
    cleric: ['Sacred Flame', 'Guidance', 'Thaumaturgy', 'Bless', 'Cure Wounds', 'Healing Word', 'Guiding Bolt'],
    druid: ['Druidcraft', 'Guidance', 'Thorn Whip', 'Cure Wounds', 'Healing Word', 'Faerie Fire'],
    bard: ['Vicious Mockery', 'Minor Illusion', 'Mage Hand', 'Dissonant Whispers', 'Healing Word', 'Cure Wounds'],
    warlock: ['Eldritch Blast', 'Minor Illusion', 'Hex', 'Burning Hands'],
    artificer: ['Fire Bolt', 'Guidance', 'Cure Wounds', 'Absorb Elements', 'Faerie Fire'],
    paladin: ['Bless', 'Cure Wounds'],
    ranger: ["Hunter's Mark", 'Cure Wounds'],
  };

  const spellNames = starters[norm] || [];
  return FIVE_TOOLS_SPELLS
    .filter((sp) => spellNames.some((n) => n.toLowerCase() === sp.name.toLowerCase()))
    .map((sp) => ({ ...sp, prepared: true }));
}


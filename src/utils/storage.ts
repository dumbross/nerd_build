/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Character } from '../types/character';
import { SAMPLE_CHARACTERS } from '../data/sampleCharacters';
import { getOptimalArmoryForClass } from './calculations';

const STORAGE_KEY = 'forge_grimoire_characters_v1';
const ACTIVE_CHAR_KEY = 'forge_grimoire_active_char_id';

export function loadSavedCharacters(): Character[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      saveCharacters(SAMPLE_CHARACTERS);
      return SAMPLE_CHARACTERS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      saveCharacters(SAMPLE_CHARACTERS);
      return SAMPLE_CHARACTERS;
    }
    // Automatically merge any newly added sample characters (like Fizwick Sparkfuse)
    let needsSave = false;
    for (const sample of SAMPLE_CHARACTERS) {
      if (!parsed.some((c: any) => c.id === sample.id)) {
        parsed.push(sample);
        needsSave = true;
      }
    }
    if (needsSave) {
      saveCharacters(parsed);
    }
    return parsed;
  } catch (e) {
    console.error('Failed to load saved characters', e);
    return SAMPLE_CHARACTERS;
  }
}

export function saveCharacters(chars: Character[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(chars));
  } catch (e) {
    console.error('Failed to save characters', e);
  }
}

export function getActiveCharacterId(): string {
  return localStorage.getItem(ACTIVE_CHAR_KEY) || SAMPLE_CHARACTERS[0].id;
}

export function setActiveCharacterId(id: string): void {
  localStorage.setItem(ACTIVE_CHAR_KEY, id);
}

export function createBlankCharacter(): Character {
  const id = `char_${Date.now()}`;
  const defaultArmory = getOptimalArmoryForClass('Fighter');
  return {
    id,
    name: 'New Hero',
    playerName: '',
    level: 1,
    experience: 0,
    alignment: 'Neutral Good',
    race: 'Human',
    className: 'Fighter',
    background: 'Folk Hero',
    abilityMode: 'standard',
    baseAbilities: { str: 15, con: 14, dex: 13, wis: 12, cha: 10, int: 8 },
    customAbilityBonuses: { str: 1, dex: 1, con: 1, int: 1, wis: 1, cha: 1 },
    savingThrowProficiencies: ['str', 'con'],
    skillProficiencies: ['athletics', 'survival'],
    skillExpertise: [],
    armorProficiencies: ['All armor', 'Shields'],
    weaponProficiencies: ['Simple weapons', 'Martial weapons'],
    toolProficiencies: [],
    languages: ['Common'],
    hpMax: 12,
    hpCurrent: 12,
    tempHp: 0,
    hitDiceTotal: 1,
    hitDiceSpent: 0,
    inspiration: false,
    deathSaves: { successes: 0, failures: 0 },
    speed: 30,
    initiativeBonus: 0,
    weapons: defaultArmory.weapons,
    armor: defaultArmory.armor,
    inventory: defaultArmory.inventory,
    currency: defaultArmory.currency,
    spellSlotsTotal: [0, 0, 0, 0, 0, 0, 0, 0, 0],
    spellSlotsExpended: [0, 0, 0, 0, 0, 0, 0, 0, 0],
    spells: [],
    features: [],
    personalityTraits: 'I judge people by their actions, not their titles or lineage. If someone is in trouble, I am always ready to lend help.',
    ideals: 'Respect. People deserve to be treated with dignity and respect. (Good)',
    bonds: 'I protect those who cannot protect themselves, and I will die for my home village.',
    flaws: 'I have trouble trusting in my allies when high stakes are involved, taking the burden on myself.',
    backstory: '',
    appearance: '',
    alliesAndOrgs: '',
    additionalNotes: '',
    updatedAt: new Date().toISOString(),
  };
}

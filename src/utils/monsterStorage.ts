/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Monster } from '../types/monster';
import { FIVE_TOOLS_MONSTERS } from '../data/monsters';

const CUSTOM_MONSTERS_STORAGE_KEY = 'forge_grimoire_custom_monsters';

let fullMonstersCache: Monster[] | null = null;
let isLoadingFullLibrary = false;

function getCustomMonsters(): Monster[] {
  try {
    const raw = localStorage.getItem(CUSTOM_MONSTERS_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load custom monsters', err);
    return [];
  }
}

export function loadAllMonsters(): Monster[] {
  const custom = getCustomMonsters();
  const base = fullMonstersCache || FIVE_TOOLS_MONSTERS;
  return [...custom, ...base];
}

export function isFullBestiaryLoaded(): boolean {
  return fullMonstersCache !== null;
}

export async function fetchFull5eToolsMonsters(): Promise<Monster[]> {
  if (fullMonstersCache) {
    return loadAllMonsters();
  }
  if (isLoadingFullLibrary) {
    await new Promise((r) => setTimeout(r, 200));
    return loadAllMonsters();
  }

  isLoadingFullLibrary = true;
  try {
    const res = await fetch('/data/5etools-monsters.json');
    if (res.ok) {
      const data: Monster[] = await res.json();
      const existingNames = new Set(data.map((m) => m.name.toLowerCase()));
      const extraCore = FIVE_TOOLS_MONSTERS.filter((m) => !existingNames.has(m.name.toLowerCase()));
      fullMonstersCache = [...extraCore, ...data];
    }
  } catch (err) {
    console.error('Failed to load full 5etools monsters bundle', err);
  } finally {
    isLoadingFullLibrary = false;
  }

  return loadAllMonsters();
}

export function saveCustomMonster(monster: Monster): Monster[] {
  try {
    const raw = localStorage.getItem(CUSTOM_MONSTERS_STORAGE_KEY);
    const existing: Monster[] = raw ? JSON.parse(raw) : [];
    const index = existing.findIndex((m) => m.id === monster.id);
    let updated: Monster[];
    if (index >= 0) {
      updated = [...existing];
      updated[index] = { ...monster, isCustom: true };
    } else {
      updated = [{ ...monster, isCustom: true }, ...existing];
    }
    localStorage.setItem(CUSTOM_MONSTERS_STORAGE_KEY, JSON.stringify(updated));
    const base = fullMonstersCache || FIVE_TOOLS_MONSTERS;
    return [...updated, ...base];
  } catch (err) {
    console.error('Failed to save custom monster', err);
    return loadAllMonsters();
  }
}

export function deleteCustomMonster(id: string): Monster[] {
  try {
    const raw = localStorage.getItem(CUSTOM_MONSTERS_STORAGE_KEY);
    if (!raw) return loadAllMonsters();
    const existing: Monster[] = JSON.parse(raw);
    const updated = existing.filter((m) => m.id !== id);
    localStorage.setItem(CUSTOM_MONSTERS_STORAGE_KEY, JSON.stringify(updated));
    const base = fullMonstersCache || FIVE_TOOLS_MONSTERS;
    return [...updated, ...base];
  } catch (err) {
    console.error('Failed to delete custom monster', err);
    return loadAllMonsters();
  }
}

export function createBlankMonster(): Monster {
  const id = `custom_m_${Date.now()}`;
  return {
    id,
    name: 'New Monster',
    source: 'Homebrew',
    size: 'Medium',
    type: 'Monstrosity',
    alignment: 'Unaligned',
    ac: 13,
    acType: 'Natural armor',
    hp: 45,
    hpFormula: '6d8 + 18',
    speed: '30 ft.',
    abilities: {
      str: 14,
      dex: 12,
      con: 16,
      int: 6,
      wis: 12,
      cha: 8,
    },
    senses: 'Darkvision 60 ft., passive Perception 11',
    languages: '—',
    cr: '2',
    xp: 450,
    proficiencyBonus: 2,
    traits: [
      {
        name: 'Relentless',
        desc: 'If the creature takes damage that reduces it to 0 hit points, it can choose to drop to 1 hit point instead once per day.',
      },
    ],
    actions: [
      {
        name: 'Multiattack',
        desc: 'The creature makes two melee attacks.',
      },
      {
        name: 'Slam',
        desc: 'Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 7 (1d8 + 2) bludgeoning damage.',
        attackBonus: 4,
        damageDice: '1d8',
        damageBonus: 2,
        damageType: 'bludgeoning',
      },
    ],
    description: 'A terrifying beast created through dark sorcery or primeval evolution.',
    isCustom: true,
  };
}

export function formatModifier(val: number): string {
  const mod = Math.floor((val - 10) / 2);
  return mod >= 0 ? `+${mod}` : `${mod}`;
}

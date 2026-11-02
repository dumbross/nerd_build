/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Monster, MonsterAction, MonsterLegendaryAction, MonsterSize, MonsterTrait } from '../types/monster';
import { clean5eToolsText, render5eToolsEntries } from './5eParser';

const SIZE_MAP: Record<string, MonsterSize> = {
  T: 'Tiny',
  S: 'Small',
  M: 'Medium',
  L: 'Large',
  H: 'Huge',
  G: 'Gargantuan',
  tiny: 'Tiny',
  small: 'Small',
  medium: 'Medium',
  large: 'Large',
  huge: 'Huge',
  gargantuan: 'Gargantuan',
};

const ALIGNMENT_MAP: Record<string, string> = {
  L: 'Lawful',
  C: 'Chaotic',
  N: 'Neutral',
  G: 'Good',
  E: 'Evil',
  U: 'Unaligned',
  A: 'Any',
};

const CR_XP_MAP: Record<string, number> = {
  '0': 10,
  '1/8': 25,
  '1/4': 50,
  '1/2': 100,
  '1': 200,
  '2': 450,
  '3': 700,
  '4': 1100,
  '5': 1800,
  '6': 2300,
  '7': 2900,
  '8': 3900,
  '9': 5000,
  '10': 5900,
  '11': 7200,
  '12': 8400,
  '13': 10000,
  '14': 11500,
  '15': 13000,
  '16': 15000,
  '17': 18000,
  '18': 20000,
  '19': 22000,
  '20': 25000,
  '21': 33000,
  '22': 41000,
  '23': 50000,
  '24': 62000,
  '25': 75000,
  '26': 90000,
  '27': 105000,
  '28': 120000,
  '29': 135000,
  '30': 155000,
};

function format5eAlignment(align: any): string {
  if (!align) return 'Unaligned';
  if (typeof align === 'string') return align;
  if (Array.isArray(align)) {
    if (align.length === 1) {
      if (align[0] === 'N') return 'Neutral';
      if (align[0] === 'U') return 'Unaligned';
      if (align[0] === 'A') return 'Any Alignment';
      return ALIGNMENT_MAP[align[0]] || align[0];
    }
    return align.map((a) => ALIGNMENT_MAP[a] || a).join(' ');
  }
  return 'Unaligned';
}

function format5eSpeed(speedObj: any): string {
  if (!speedObj) return '30 ft.';
  if (typeof speedObj === 'string') return speedObj;
  if (typeof speedObj === 'number') return `${speedObj} ft.`;

  const parts: string[] = [];
  if (speedObj.walk !== undefined) {
    const val = typeof speedObj.walk === 'object' ? speedObj.walk.number : speedObj.walk;
    parts.push(`${val} ft.`);
  }
  ['burrow', 'climb', 'fly', 'swim'].forEach((mode) => {
    if (speedObj[mode] !== undefined) {
      const val = typeof speedObj[mode] === 'object' ? speedObj[mode].number : speedObj[mode];
      const cond = typeof speedObj[mode] === 'object' && speedObj[mode].condition ? ` (${speedObj[mode].condition})` : '';
      parts.push(`${mode} ${val} ft.${cond}`);
    }
  });

  return parts.join(', ') || '30 ft.';
}

function parseEntryText(entries: any): string {
  if (!entries) return '';
  if (typeof entries === 'string') return clean5eToolsText(entries);
  if (Array.isArray(entries)) {
    return clean5eToolsText(render5eToolsEntries(entries));
  }
  return '';
}

/**
 * Parses a single 5e.tools monster object into the app's Monster schema.
 */
export function parse5eToolsMonster(raw: any): Monster {
  const id = `5et_${raw.source || 'SRD'}_${(raw.name || 'unnamed').toLowerCase().replace(/[^a-z0-9]/gi, '_')}`;

  // Size
  let size: MonsterSize = 'Medium';
  if (raw.size) {
    const rawSize = Array.isArray(raw.size) ? raw.size[0] : raw.size;
    size = SIZE_MAP[rawSize] || 'Medium';
  }

  // Type & Subtype
  let type = 'Monstrosity';
  let subtype: string | undefined;
  if (typeof raw.type === 'string') {
    type = raw.type.charAt(0).toUpperCase() + raw.type.slice(1);
  } else if (raw.type && typeof raw.type === 'object') {
    type = (raw.type.type || 'Monstrosity');
    type = type.charAt(0).toUpperCase() + type.slice(1);
    if (raw.type.tags && Array.isArray(raw.type.tags)) {
      subtype = raw.type.tags.join(', ');
    }
  }

  // AC
  let ac = 10;
  let acType: string | undefined;
  if (typeof raw.ac === 'number') {
    ac = raw.ac;
  } else if (Array.isArray(raw.ac) && raw.ac.length > 0) {
    const firstAc = raw.ac[0];
    if (typeof firstAc === 'number') {
      ac = firstAc;
    } else if (typeof firstAc === 'object' && firstAc !== null) {
      ac = firstAc.ac || 10;
      if (firstAc.from && Array.isArray(firstAc.from)) {
        acType = firstAc.from.join(', ');
      }
    }
  }

  // HP
  let hp = 10;
  let hpFormula = '2d8';
  if (typeof raw.hp === 'number') {
    hp = raw.hp;
    hpFormula = `${raw.hp}`;
  } else if (raw.hp && typeof raw.hp === 'object') {
    hp = raw.hp.average || 10;
    hpFormula = raw.hp.formula || `${hp}`;
  }

  // Speed
  const speed = format5eSpeed(raw.speed);

  // Abilities
  const abilities = {
    str: raw.str || 10,
    dex: raw.dex || 10,
    con: raw.con || 10,
    int: raw.int || 10,
    wis: raw.wis || 10,
    cha: raw.cha || 10,
  };

  // Saving Throws
  let savingThrows: string | undefined;
  if (raw.save && typeof raw.save === 'object') {
    savingThrows = Object.entries(raw.save)
      .map(([stat, val]) => `${stat.toUpperCase()} ${val}`)
      .join(', ');
  }

  // Skills
  let skills: string | undefined;
  if (raw.skill && typeof raw.skill === 'object') {
    skills = Object.entries(raw.skill)
      .map(([s, val]) => {
        const title = s.charAt(0).toUpperCase() + s.slice(1);
        return `${title} ${val}`;
      })
      .join(', ');
  }

  // Senses
  const sensesList: string[] = [];
  if (raw.senses) {
    if (Array.isArray(raw.senses)) {
      sensesList.push(...raw.senses);
    } else if (typeof raw.senses === 'string') {
      sensesList.push(raw.senses);
    }
  }
  if (raw.passive !== undefined) {
    sensesList.push(`passive Perception ${raw.passive}`);
  }
  const senses = sensesList.join(', ') || 'passive Perception 10';

  // Languages
  let languages = '—';
  if (raw.languages) {
    if (Array.isArray(raw.languages)) {
      languages = raw.languages.join(', ');
    } else if (typeof raw.languages === 'string') {
      languages = raw.languages;
    }
  }

  // CR & XP
  let cr = '1';
  if (typeof raw.cr === 'string') {
    cr = raw.cr;
  } else if (typeof raw.cr === 'object' && raw.cr !== null) {
    cr = raw.cr.cr || '1';
  } else if (typeof raw.cr === 'number') {
    cr = `${raw.cr}`;
  }
  const xp = CR_XP_MAP[cr] || 200;

  // Proficiency Bonus
  const numCr = parseFloat(cr) || 1;
  let proficiencyBonus = 2;
  if (numCr >= 29) proficiencyBonus = 9;
  else if (numCr >= 25) proficiencyBonus = 8;
  else if (numCr >= 21) proficiencyBonus = 7;
  else if (numCr >= 17) proficiencyBonus = 6;
  else if (numCr >= 13) proficiencyBonus = 5;
  else if (numCr >= 9) proficiencyBonus = 4;
  else if (numCr >= 5) proficiencyBonus = 3;

  // Traits
  const traits: MonsterTrait[] = [];
  if (raw.trait && Array.isArray(raw.trait)) {
    raw.trait.forEach((t: any) => {
      if (t.name) {
        traits.push({
          name: t.name,
          desc: parseEntryText(t.entries),
        });
      }
    });
  }

  // Actions
  const actions: MonsterAction[] = [];
  if (raw.action && Array.isArray(raw.action)) {
    raw.action.forEach((a: any) => {
      if (a.name) {
        const desc = parseEntryText(a.entries);
        // Attempt to extract attack bonus and damage dice
        const hitMatch = desc.match(/\+(\d+)\s+to\s+hit/i);
        const diceMatch = desc.match(/Hit:\s*\d+\s*\(([^)]+)\)/i);
        actions.push({
          name: a.name,
          desc,
          attackBonus: hitMatch ? parseInt(hitMatch[1], 10) : undefined,
          damageDice: diceMatch ? diceMatch[1] : undefined,
        });
      }
    });
  }

  // Reactions
  const reactions: MonsterTrait[] = [];
  if (raw.reaction && Array.isArray(raw.reaction)) {
    raw.reaction.forEach((r: any) => {
      if (r.name) {
        reactions.push({
          name: r.name,
          desc: parseEntryText(r.entries),
        });
      }
    });
  }

  // Legendary Actions
  const legendaryActions: MonsterLegendaryAction[] = [];
  if (raw.legendary && Array.isArray(raw.legendary)) {
    raw.legendary.forEach((la: any) => {
      if (la.name) {
        legendaryActions.push({
          name: la.name,
          desc: parseEntryText(la.entries),
        });
      }
    });
  }

  // Immunities & Resistances
  const formatList = (val: any) => {
    if (!val) return undefined;
    if (typeof val === 'string') return val;
    if (Array.isArray(val)) {
      return val
        .map((item) => (typeof item === 'string' ? item : item.resist?.join(', ') || item.immune?.join(', ')))
        .filter(Boolean)
        .join(', ');
    }
    return undefined;
  };

  return {
    id,
    name: raw.name || 'Unknown Monster',
    source: raw.source || '5e.tools',
    size,
    type,
    subtype,
    alignment: format5eAlignment(raw.alignment),
    ac,
    acType,
    hp,
    hpFormula,
    speed,
    abilities,
    savingThrows,
    skills,
    damageResistances: formatList(raw.resist),
    damageImmunities: formatList(raw.immune),
    conditionImmunities: formatList(raw.conditionImmune),
    damageVulnerabilities: formatList(raw.vulnerable),
    senses,
    languages,
    cr,
    xp,
    proficiencyBonus,
    traits: traits.length > 0 ? traits : undefined,
    actions: actions.length > 0 ? actions : undefined,
    reactions: reactions.length > 0 ? reactions : undefined,
    legendaryActions: legendaryActions.length > 0 ? legendaryActions : undefined,
    description: parseEntryText(raw.fluff?.entries || raw.entries),
    isCustom: false,
  };
}

/**
 * Parses any arbitrary 5e.tools JSON (single monster or collection array).
 */
export function parse5eToolsBestiaryJson(jsonText: string): Monster[] {
  const parsed = JSON.parse(jsonText);
  let rawMonsters: any[] = [];

  if (Array.isArray(parsed)) {
    rawMonsters = parsed;
  } else if (parsed.monster && Array.isArray(parsed.monster)) {
    rawMonsters = parsed.monster;
  } else if (parsed.name && (parsed.cr !== undefined || parsed.hp !== undefined)) {
    rawMonsters = [parsed];
  } else {
    throw new Error('Unrecognized 5e.tools monster format. Expected "monster" array or monster object.');
  }

  return rawMonsters
    .filter((m) => m && m.name && (m.hp || m.cr !== undefined || m.str !== undefined))
    .map(parse5eToolsMonster);
}

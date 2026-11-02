/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://raw.githubusercontent.com/5etools-mirror-3/5etools-src/main/data/bestiary/';

const SOURCE_NAMES = {
  MM: 'Monster Manual',
  VGM: "Volo's Guide to Monsters",
  MTF: "Mordenkainen's Tome of Foes",
  MPMM: 'Monsters of the Multiverse',
  FTD: "Fizban's Treasury of Dragons",
  BGG: 'Glory of the Giants',
  CoS: 'Curse of Strahd',
  BGDIA: "Descent into Avernus",
  ToA: 'Tomb of Annihilation',
  SKT: "Storm King's Thunder",
  ERLW: 'Eberron: Rising from the Last War',
  EGW: "Explorer's Guide to Wildemount",
  MOT: 'Mythic Odysseys of Theros',
  VRGR: "Van Richten's Guide to Ravenloft",
  SCC: 'Strixhaven',
  WBtW: 'The Wild Beyond the Witchlight',
  WDMM: 'Dungeon of the Mad Mage',
  WDH: 'Dragon Heist',
  GoS: 'Ghosts of Saltmarsh',
  TSoTF: 'The Shattered Obelisk',
  IDRotF: 'Rime of the Frostmaiden',
  PHB: "Player's Handbook",
  DMG: "Dungeon Master's Guide",
  TCE: "Tasha's Cauldron of Everything",
  XGE: "Xanathar's Guide to Everything",
  AI: 'Acquisitions Incorporated',
  BAM: 'Boo\'s Astral Menagerie',
  MCV1SC: 'Monstrous Compendium Vol 1',
  MCV2DC: 'Monstrous Compendium Vol 2',
  MCV3MC: 'Monstrous Compendium Vol 3',
  MCV4EC: 'Monstrous Compendium Vol 4',
  AAG: 'Astral Adventurer\'s Guide',
  PSX: 'Plane Shift: Ixalan',
  PSD: 'Plane Shift: Dominaria',
  PSK: 'Plane Shift: Kaladesh',
  PSI: 'Plane Shift: Innistrad',
  PSA: 'Plane Shift: Amonkhet',
  PSZ: 'Plane Shift: Zendikar',
  OotA: 'Out of the Abyss',
  PotA: 'Princes of the Apocalypse',
  RoT: 'The Rise of Tiamat',
  HotDQ: 'Hoard of the Dragon Queen',
  LMoP: 'Lost Mine of Phandelver',
  DoSI: 'Dragons of Stormwreck Isle',
  DIP: 'Dragon of Icespire Peak',
  SLW: 'Sleeping Dragon\'s Wake',
  SDW: 'Storm Lord\'s Wrath',
  DC: 'Divine Contention',
  XMM: '2024 Monster Manual',
  TftYP: 'Tales from the Yawning Portal',
  GGR: "Guildmasters' Guide to Ravnica",
  JttRC: 'Journeys through the Radiant Citadel',
  VEoR: 'Vecna: Eve of Ruin',
  RHW: 'Red Hand of Doom',
  QftIS: 'Quests from the Infinite Staircase',
  KftGV: 'Keys from the Golden Vault',
  PaB: 'Planescape: Adventures in the Multiverse',
  SatO: 'Sigil and the Outlands',
  ToFW: 'Turn of Fortune\'s Wheel',
  BoMT: 'The Book of Many Things',
  BMT: 'The Book of Many Things',
};

const CR_XP_MAP = {
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

function getProficiencyBonus(cr) {
  const num = cr === '1/8' ? 0.125 : cr === '1/4' ? 0.25 : cr === '1/2' ? 0.5 : parseFloat(cr) || 0;
  if (num < 5) return 2;
  if (num < 9) return 3;
  if (num < 13) return 4;
  if (num < 17) return 5;
  if (num < 21) return 6;
  if (num < 25) return 7;
  if (num < 29) return 8;
  return 9;
}

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          return fetchJson(res.headers.location).then(resolve).catch(reject);
        }
        if (res.statusCode !== 200) {
          return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
        }
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(e);
          }
        });
      })
      .on('error', reject);
  });
}

function clean5eTag(text) {
  if (typeof text !== 'string') return '';
  return text
    .replace(/\{@atk mw\}/gi, 'Melee Weapon Attack: ')
    .replace(/\{@atk rw\}/gi, 'Ranged Weapon Attack: ')
    .replace(/\{@atk mw,rw\}/gi, 'Melee or Ranged Weapon Attack: ')
    .replace(/\{@atk ms\}/gi, 'Melee Spell Attack: ')
    .replace(/\{@atk rs\}/gi, 'Ranged Spell Attack: ')
    .replace(/\{@h\}/gi, 'Hit: ')
    .replace(/\{@recharge(?: (\d+))?\}/gi, (_, d) => d ? `(Recharge ${d}-6)` : '(Recharge 5-6)')
    .replace(/\{@hit ([+-]?\d+)\}/gi, '$1')
    .replace(/\{@damage ([^}|]+)(?:\|[^}]+)?\}/gi, '$1')
    .replace(/\{@dc ([^}|]+)\}/gi, 'DC $1')
    .replace(/\{@dice ([^}|]+)\}/gi, '$1')
    .replace(/\{@b ([^}|]+)\}/gi, '$1')
    .replace(/\{@i ([^}|]+)\}/gi, '$1')
    .replace(/\{@spell ([^}|]+)(?:\|[^}]+)?\}/gi, '$1')
    .replace(/\{@creature ([^}|]+)(?:\|[^}]+)?\}/gi, '$1')
    .replace(/\{@item ([^}|]+)(?:\|[^}]+)?\}/gi, '$1')
    .replace(/\{@condition ([^}|]+)(?:\|[^}]+)?\}/gi, '$1')
    .replace(/\{@status ([^}|]+)(?:\|[^}]+)?\}/gi, '$1')
    .replace(/\{@skill ([^}|]+)(?:\|[^}]+)?\}/gi, '$1')
    .replace(/\{@sense ([^}|]+)(?:\|[^}]+)?\}/gi, '$1')
    .replace(/\{@quickref ([^}|]+)(?:\|[^}]+)?\}/gi, '$1')
    .replace(/\{@optfeature ([^}|]+)(?:\|[^}]+)?\}/gi, '$1')
    .replace(/\{@[a-zA-Z]+ ([^}|]+)(?:\|[^}]+)?\}/gi, '$1')
    .replace(/\{@[a-zA-Z]+\}/gi, '')
    .trim();
}

function flattenEntries(entries) {
  if (!entries) return '';
  if (typeof entries === 'string') return clean5eTag(entries);
  if (Array.isArray(entries)) {
    return entries
      .map((e) => {
        if (typeof e === 'string') return clean5eTag(e);
        if (e && typeof e === 'object') {
          if (e.type === 'list' && Array.isArray(e.items)) {
            return e.items.map((it) => `• ${flattenEntries(it)}`).join('\n');
          }
          if (e.entries) return flattenEntries(e.entries);
          if (e.text) return clean5eTag(e.text);
        }
        return '';
      })
      .filter(Boolean)
      .join(' ');
  }
  return '';
}

function parseSize(s) {
  if (!s) return 'Medium';
  const char = Array.isArray(s) ? s[0] : String(s);
  switch (char.toUpperCase()) {
    case 'T': return 'Tiny';
    case 'S': return 'Small';
    case 'M': return 'Medium';
    case 'L': return 'Large';
    case 'H': return 'Huge';
    case 'G': return 'Gargantuan';
    default: return 'Medium';
  }
}

function parseType(t) {
  if (!t) return { type: 'Monstrosity', subtype: undefined };
  if (typeof t === 'string') return { type: capitalize(t), subtype: undefined };
  if (typeof t === 'object') {
    const main = capitalize(t.type || 'Monstrosity');
    const sub = Array.isArray(t.tags)
      ? t.tags.map((tag) => (typeof tag === 'string' ? tag : tag.tag || '')).filter(Boolean).join(', ')
      : undefined;
    return { type: main, subtype: sub };
  }
  return { type: 'Monstrosity', subtype: undefined };
}

function capitalize(s) {
  if (!s) return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function parseAlignment(al) {
  if (!al) return 'Unaligned';
  if (typeof al === 'string') return al;
  if (!Array.isArray(al)) return 'Unaligned';

  const map = {
    L: 'Lawful',
    C: 'Chaotic',
    N: 'Neutral',
    G: 'Good',
    E: 'Evil',
    U: 'Unaligned',
    A: 'Any Alignment',
  };

  const parts = al
    .map((item) => {
      if (typeof item === 'string') return map[item] || item;
      if (typeof item === 'object' && item.alignment) {
        return item.alignment.map((k) => map[k] || k).join(' ');
      }
      return '';
    })
    .filter(Boolean);

  if (parts.length === 0) return 'Unaligned';
  if (parts.length === 1 && parts[0] === 'Neutral') return 'Neutral';
  return parts.join(' ');
}

function parseAc(ac) {
  if (ac == null) return { ac: 10, acType: undefined };
  if (typeof ac === 'number') return { ac, acType: undefined };
  if (Array.isArray(ac)) {
    const first = ac[0];
    if (typeof first === 'number') {
      const typeDesc = ac.length > 1 && ac[1]?.from ? clean5eTag(ac[1].from.join(', ')) : undefined;
      return { ac: first, acType: typeDesc };
    }
    if (typeof first === 'object' && first.ac) {
      const typeDesc = first.from ? clean5eTag(first.from.join(', ')) : undefined;
      return { ac: first.ac, acType: typeDesc };
    }
  }
  return { ac: 10, acType: undefined };
}

function parseHp(hp) {
  if (!hp) return { hp: 10, hpFormula: '2d8 + 2' };
  if (typeof hp === 'number') return { hp, hpFormula: `${hp}` };
  if (typeof hp === 'object') {
    const average = hp.average || 10;
    const formula = hp.formula || `${average}`;
    return { hp: average, hpFormula: formula };
  }
  return { hp: 10, hpFormula: '2d8 + 2' };
}

function parseSpeed(sp) {
  if (!sp) return '30 ft.';
  if (typeof sp === 'string') return sp;
  if (typeof sp === 'object') {
    const parts = [];
    if (sp.walk) parts.push(`${sp.walk} ft.`);
    if (sp.fly) {
      const flyStr = typeof sp.fly === 'object' ? `${sp.fly.number} ft.${sp.fly.condition ? ` ${sp.fly.condition}` : ''}` : `${sp.fly} ft.`;
      parts.push(`fly ${flyStr}`);
    }
    if (sp.swim) parts.push(`swim ${sp.swim} ft.`);
    if (sp.climb) parts.push(`climb ${sp.climb} ft.`);
    if (sp.burrow) parts.push(`burrow ${sp.burrow} ft.`);
    return parts.length > 0 ? parts.join(', ') : '30 ft.';
  }
  return '30 ft.';
}

function parseCr(cr) {
  if (!cr) return '0';
  if (typeof cr === 'string') return cr;
  if (typeof cr === 'object') {
    if (cr.cr) return String(cr.cr);
  }
  return String(cr);
}

function parseSaves(save) {
  if (!save || typeof save !== 'object') return undefined;
  const parts = [];
  ['str', 'dex', 'con', 'int', 'wis', 'cha'].forEach((st) => {
    if (save[st] != null) {
      parts.push(`${st.toUpperCase()} ${save[st]}`);
    }
  });
  return parts.length > 0 ? parts.join(', ') : undefined;
}

function parseSkills(skill) {
  if (!skill || typeof skill !== 'object') return undefined;
  const parts = [];
  Object.keys(skill).forEach((k) => {
    if (skill[k] != null) {
      parts.push(`${capitalize(k)} ${skill[k]}`);
    }
  });
  return parts.length > 0 ? parts.join(', ') : undefined;
}

function parseListOrString(val) {
  if (!val) return undefined;
  if (typeof val === 'string') return clean5eTag(val);
  if (Array.isArray(val)) {
    return val
      .map((item) => {
        if (typeof item === 'string') return clean5eTag(item);
        if (typeof item === 'object') {
          if (item.immune) return parseListOrString(item.immune);
          if (item.resist) return parseListOrString(item.resist);
          if (item.vulnerable) return parseListOrString(item.vulnerable);
          if (item.conditionImmune) return parseListOrString(item.conditionImmune);
        }
        return '';
      })
      .filter(Boolean)
      .join(', ');
  }
  return undefined;
}

function parseSenses(senses, passive) {
  const parts = [];
  if (senses) {
    if (Array.isArray(senses)) {
      parts.push(...senses.map(clean5eTag));
    } else if (typeof senses === 'string') {
      parts.push(clean5eTag(senses));
    }
  }
  if (passive != null) {
    parts.push(`passive Perception ${passive}`);
  }
  return parts.length > 0 ? parts.join(', ') : 'passive Perception 10';
}

function parseLanguages(lang) {
  if (!lang) return '—';
  if (typeof lang === 'string') return clean5eTag(lang);
  if (Array.isArray(lang)) {
    return lang.map(clean5eTag).filter(Boolean).join(', ') || '—';
  }
  return '—';
}

function normalizeRawMonster(raw) {
  const name = raw.name || 'Unknown Creature';
  const rawSource = raw.source || 'MM';
  const sourceName = SOURCE_NAMES[rawSource] || `5e.tools (${rawSource})`;
  const id = `m_${rawSource.toLowerCase()}_${name.toLowerCase().replace(/[^a-z0-9]+/g, '_')}`;

  const { type, subtype } = parseType(raw.type);
  const size = parseSize(raw.size);
  const alignment = parseAlignment(raw.alignment);
  const { ac, acType } = parseAc(raw.ac);
  const { hp, hpFormula } = parseHp(raw.hp);
  const speed = parseSpeed(raw.speed);
  const cr = parseCr(raw.cr);
  const xp = CR_XP_MAP[cr] || 0;
  const proficiencyBonus = getProficiencyBonus(cr);

  const abilities = {
    str: raw.str || 10,
    dex: raw.dex || 10,
    con: raw.con || 10,
    int: raw.int || 10,
    wis: raw.wis || 10,
    cha: raw.cha || 10,
  };

  const traits = Array.isArray(raw.trait)
    ? raw.trait.map((t) => ({
        name: clean5eTag(t.name || ''),
        desc: flattenEntries(t.entries),
      }))
    : undefined;

  const actions = Array.isArray(raw.action)
    ? raw.action.map((a) => {
        const desc = flattenEntries(a.entries);
        const hitMatch = desc.match(/\+?(-?\d+)\s+to hit/i);
        const attackBonus = hitMatch ? parseInt(hitMatch[1], 10) : undefined;
        const diceMatch = desc.match(/Hit:\s*(\d+)?\s*\(([^)]+)\)/i);
        let damageDice;
        let damageBonus;
        if (diceMatch && diceMatch[2]) {
          const formulaMatch = diceMatch[2].match(/(\d+d\d+)(?:\s*([+-]\s*\d+))?/i);
          if (formulaMatch) {
            damageDice = formulaMatch[1];
            damageBonus = formulaMatch[2] ? parseInt(formulaMatch[2].replace(/\s+/g, ''), 10) : 0;
          }
        }
        return {
          name: clean5eTag(a.name || ''),
          desc,
          attackBonus,
          damageDice,
          damageBonus,
        };
      })
    : undefined;

  const reactions = Array.isArray(raw.reaction)
    ? raw.reaction.map((r) => ({
        name: clean5eTag(r.name || ''),
        desc: flattenEntries(r.entries),
      }))
    : undefined;

  const legendaryActions = Array.isArray(raw.legendary)
    ? raw.legendary.map((la) => ({
        name: clean5eTag(la.name || ''),
        desc: flattenEntries(la.entries),
      }))
    : undefined;

  const legendaryHeader = raw.legendaryHeader
    ? flattenEntries(raw.legendaryHeader)
    : legendaryActions && legendaryActions.length > 0
    ? `The creature can take 3 legendary actions, choosing from the options below.`
    : undefined;

  return {
    id,
    name,
    source: `${sourceName}`,
    size,
    type,
    subtype,
    alignment,
    ac,
    acType,
    hp,
    hpFormula,
    speed,
    abilities,
    savingThrows: parseSaves(raw.save),
    skills: parseSkills(raw.skill),
    damageVulnerabilities: parseListOrString(raw.vulnerable),
    damageResistances: parseListOrString(raw.resist),
    damageImmunities: parseListOrString(raw.immune),
    conditionImmunities: parseListOrString(raw.conditionImmune),
    senses: parseSenses(raw.senses, raw.passive),
    languages: parseLanguages(raw.languages),
    cr,
    xp,
    proficiencyBonus,
    traits: traits && traits.length > 0 ? traits : undefined,
    actions: actions && actions.length > 0 ? actions : undefined,
    reactions: reactions && reactions.length > 0 ? reactions : undefined,
    legendaryHeader,
    legendaryActions: legendaryActions && legendaryActions.length > 0 ? legendaryActions : undefined,
    description: `Official D&D 5e monster published in ${sourceName}.`,
  };
}

async function main() {
  console.log('Fetching index.json...');
  const index = await fetchJson(`${BASE_URL}index.json`);
  const filenames = Object.values(index);
  console.log(`Discovered ${filenames.length} source files.`);

  const allMonsters = [];
  const seenIds = new Set();

  // Download files in chunks of 5
  const CHUNK_SIZE = 5;
  for (let i = 0; i < filenames.length; i += CHUNK_SIZE) {
    const chunk = filenames.slice(i, i + CHUNK_SIZE);
    const results = await Promise.allSettled(
      chunk.map((fn) => fetchJson(`${BASE_URL}${fn}`))
    );

    results.forEach((res, idx) => {
      if (res.status === 'fulfilled' && res.value && Array.isArray(res.value.monster)) {
        res.value.monster.forEach((m) => {
          try {
            const norm = normalizeRawMonster(m);
            // Deduplicate if identical ID
            if (!seenIds.has(norm.id)) {
              seenIds.add(norm.id);
              allMonsters.push(norm);
            }
          } catch (err) {
            // skip malformed
          }
        });
      }
    });

    process.stdout.write(`Processed ${Math.min(i + CHUNK_SIZE, filenames.length)}/${filenames.length} files (Monsters: ${allMonsters.length})\r`);
  }

  // Ensure Revivisect from reference sheet is always present
  if (!seenIds.has('m_revivisect')) {
    allMonsters.unshift({
      id: 'm_revivisect',
      name: 'Revivisect',
      source: 'Grim Hollow / Homebrewery',
      size: 'Large',
      type: 'Undead',
      alignment: 'Neutral Evil',
      ac: 17,
      acType: 'Natural armor',
      hp: 150,
      hpFormula: '20d10 + 40',
      speed: '40 ft.',
      abilities: { str: 20, dex: 14, con: 14, int: 6, wis: 10, cha: 6 },
      savingThrows: 'STR +9, CON +6',
      skills: 'Athletics +9',
      damageResistances: 'Necrotic, Psychic',
      conditionImmunities: 'Poisoned',
      senses: 'Darkvision 60 ft., passive Perception 10',
      languages: 'Deep Speech',
      cr: '11',
      xp: 7200,
      proficiencyBonus: 4,
      traits: [
        { name: 'Leeching Aura', desc: 'At the start of each of its turns, the Revivisect emits a sickly green aura in a 20-foot radius. Creatures within the aura take 10 (2d6+3) necrotic damage and must make a DC 15 Constitution saving throw. On a failed save, the creature\'s maximum hit points are reduced by an amount equal to the damage taken.' },
        { name: 'Regeneration', desc: 'The Revivisect regains 5 hit points at the start of each of its turns. This ability does not function if the Revivisect has taken radiant damage since the end of its last turn.' },
      ],
      actions: [
        { name: 'Multiattack', desc: 'The Revivisect can make four attacks per turn: two with its claws and two with its tentacles.' },
        { name: 'Claw', desc: 'Melee Weapon Attack: +9 to hit, reach 10 ft., one target. Hit: 12 (2d6+5) slashing damage.', attackBonus: 9, damageDice: '2d6', damageBonus: 5 },
        { name: 'Tentacle', desc: 'Melee Weapon Attack: +9 to hit, reach 15 ft., one target. Hit: 10 (1d10+5) bludgeoning damage and the target is grappled (escape DC 15). The Revivisect can have up to four creatures grappled at once.', attackBonus: 9, damageDice: '1d10', damageBonus: 5 },
      ],
      reactions: [
        { name: 'Sanguinomorph', desc: 'Whenever a creature misses an attack roll against the Revivisect, it can use its reaction to regain hit points equal to the number needed to hit. For example, if a player rolls a 15 and misses the Revivisect\'s AC of 17, the creature gains 2 hit points.' },
      ],
      description: 'The Revivisect is a large, grotesque creature with multiple limbs and a bloated, leathery body. Its skin is covered in pustules and sores that ooze a sickly green fluid, and its eyes glow with an eerie, otherworldly light. It emits a foul stench.',
    });
  }

  // Sort by name
  allMonsters.sort((a, b) => a.name.localeCompare(b.name));

  const outPath = path.resolve(__dirname, '../public/data/5etools-monsters.json');
  fs.writeFileSync(outPath, JSON.stringify(allMonsters));
  console.log(`Wrote JSON bundle to ${outPath} (${(fs.statSync(outPath).size / (1024 * 1024)).toFixed(2)} MB)`);
}

main().catch((err) => {
  console.error('Build failed:', err);
  process.exit(1);
});

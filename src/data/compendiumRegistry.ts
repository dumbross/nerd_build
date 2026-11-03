/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FIVE_TOOLS_SPELLS } from './spells';
import { FIVE_TOOLS_CLASSES } from './classes';
import { FIVE_TOOLS_RACES } from './races';
import { FIVE_TOOLS_BACKGROUNDS } from './backgrounds';
import { FIVE_TOOLS_FEATS } from './feats';
import { FIVE_TOOLS_WEAPONS, FIVE_TOOLS_ARMOR, FIVE_TOOLS_STANDARD_GEAR } from './equipment';
import { MAGIC_ITEMS, CONDITIONS_AND_RULES, MagicItemEntry, RuleEntry } from './magicItemsAndRules';
import { clean5eToolsText } from '../utils/5eParser';

export type CompendiumCategory =
  | 'all'
  | 'classes'
  | 'races'
  | 'spells'
  | 'weapons'
  | 'armor'
  | 'gear'
  | 'magic-items'
  | 'feats'
  | 'backgrounds'
  | 'rules';

export interface CompendiumItem {
  id: string;
  name: string;
  category: CompendiumCategory;
  categoryLabel: string;
  source: string; // e.g. "PHB", "XGE", "TCE", "DMG", "MPMM"
  sourceLabel: string; // e.g. "Player's Handbook"
  page?: number | string;
  subtitle: string; // e.g. "1st-level Evocation • 1 Action" or "Martial Melee • 1d8 slashing"
  summary: string;
  rawData: any;
  // Specific searchable & filterable facets
  spellLevel?: number;
  spellSchool?: string;
  spellClasses?: string[];
  damage?: string;
  properties?: string[];
  weaponCategory?: string;
  weaponDamage?: string;
  armorCategory?: string;
  armorAc?: number;
  itemRarity?: string;
  requiresAttunement?: boolean;
  hitDie?: string;
  primaryAbilities?: string[];
  subracesCount?: number;
  size?: string;
  prerequisite?: string;
}

export interface SourceOption {
  id: string;
  code: string;
  label: string;
  fullName: string;
}

export const COMPENDIUM_SOURCES: SourceOption[] = [
  { id: 'all', code: 'ALL', label: 'All Sourcebooks', fullName: 'All Sourcebooks' },
  { id: 'PHB', code: 'PHB', label: "Player's Handbook (PHB)", fullName: "Player's Handbook (2014)" },
  { id: 'XPHB', code: 'XPHB', label: "2024 Player's Handbook (XPHB)", fullName: "2024 Player's Handbook" },
  { id: 'DMG', code: 'DMG', label: "Dungeon Master's Guide (DMG)", fullName: "Dungeon Master's Guide (2014)" },
  { id: 'XDMG', code: 'XDMG', label: "2024 Dungeon Master's Guide (XDMG)", fullName: "2024 Dungeon Master's Guide" },
  { id: 'MM', code: 'MM', label: "Monster Manual (MM)", fullName: "Monster Manual (2014)" },
  { id: 'XGE', code: 'XGE', label: "Xanathar's Guide to Everything (XGE)", fullName: "Xanathar's Guide to Everything" },
  { id: 'TCE', code: 'TCE', label: "Tasha's Cauldron of Everything (TCE)", fullName: "Tasha's Cauldron of Everything" },
  { id: 'MPMM', code: 'MPMM', label: "Monsters of the Multiverse (MPMM)", fullName: "Mordenkainen Presents: Monsters of the Multiverse" },
  { id: 'VGM', code: 'VGM', label: "Volo's Guide to Monsters (VGM)", fullName: "Volo's Guide to Monsters" },
  { id: 'MTF', code: 'MTF', label: "Mordenkainen's Tome of Foes (MTF)", fullName: "Mordenkainen's Tome of Foes" },
  { id: 'FTD', code: 'FTD', label: "Fizban's Treasury of Dragons (FTD)", fullName: "Fizban's Treasury of Dragons" },
  { id: 'SCAG', code: 'SCAG', label: "Sword Coast Adventurer's Guide (SCAG)", fullName: "Sword Coast Adventurer's Guide" },
  { id: 'ERLW', code: 'ERLW', label: "Eberron: Rising from the Last War (ERLW)", fullName: "Eberron: Rising from the Last War" },
  { id: 'VRGR', code: 'VRGR', label: "Van Richten's Guide to Ravenloft (VRGR)", fullName: "Van Richten's Guide to Ravenloft" },
  { id: 'SRD', code: 'SRD', label: "Basic Rules / SRD 5.1 (SRD)", fullName: "System Reference Document 5.1" },
];

export function getSourceLabel(code?: string): string {
  if (!code) return "Player's Handbook";
  const found = COMPENDIUM_SOURCES.find(
    (s) => s.code.toLowerCase() === code.toLowerCase() || s.id.toLowerCase() === code.toLowerCase()
  );
  if (found && found.id !== 'all') return found.fullName;
  return code;
}

// Known spell source overrides for accurate attribution
const SPELL_SOURCES: Record<string, string> = {
  'sp_toll_the_dead': 'XGE',
  'sp_absorb_elements': 'XGE',
  'sp_chaos_bolt': 'XGE',
  'sp_synaptic_static': 'XGE',
  'sp_booming_blade': 'TCE',
  'sp_green_flame_blade': 'TCE',
  'sp_mind_sliver': 'TCE',
  'sp_sword_burst': 'TCE',
  'sp_silvery_barbs': 'TCE',
  'sp_healing_elixir': 'XGE',
  'sp_zephyr_strike': 'XGE',
  'sp_shadow_blade': 'XGE',
  'sp_tiny_servant': 'XGE',
};

let cachedCompendiumItems: CompendiumItem[] | null = null;

export function loadAllCompendiumItems(): CompendiumItem[] {
  if (cachedCompendiumItems) return cachedCompendiumItems;

  const items: CompendiumItem[] = [];

  // 1. Classes
  for (const c of FIVE_TOOLS_CLASSES) {
    const src = c.source || 'PHB';
    const hdFaces = c.hd?.faces || 8;
    const skills = c.skillChoices?.from?.join(', ') || '';
    const profs = c.proficiency?.map((p) => p.toUpperCase()).join(', ') || '';
    items.push({
      id: `class_${c.name.toLowerCase()}`,
      name: c.name,
      category: 'classes',
      categoryLabel: 'Class',
      source: src,
      sourceLabel: getSourceLabel(src),
      subtitle: `Hit Die: d${hdFaces} • Saves: ${profs}`,
      summary: clean5eToolsText(
        typeof c.entries?.[0] === 'string'
          ? c.entries[0]
          : (c.entries?.[0] as any)?.entries?.[0] || ''
      ),
      rawData: c,
      hitDie: `d${hdFaces}`,
      primaryAbilities: c.proficiency,
    });
  }

  // 2. Races / Species
  for (const r of FIVE_TOOLS_RACES) {
    const src = r.source || 'PHB';
    const subCount = r.subraces ? r.subraces.length : 0;
    const subraceNames = r.subraces?.map((s) => s.name).join(', ') || '';
    const abilityBonuses: string[] = [];
    if (r.ability && r.ability[0]) {
      const b = r.ability[0];
      for (const [k, v] of Object.entries(b)) {
        if (typeof v === 'number') abilityBonuses.push(`+${v} ${k.toUpperCase()}`);
      }
    }
    const bonusStr = abilityBonuses.join(', ') || 'Flexible';
    items.push({
      id: `race_${r.name.toLowerCase()}`,
      name: r.name,
      category: 'races',
      categoryLabel: 'Species / Race',
      source: src,
      sourceLabel: getSourceLabel(src),
      page: r.page,
      subtitle: `Speed: ${r.speed || 30} ft • ${bonusStr}${subCount > 0 ? ` • ${subCount} Subraces` : ''}`,
      summary: clean5eToolsText(
        typeof r.entries?.[0] === 'string' ? r.entries[0] : (r.entries?.[0] as any)?.entries?.[0] || ''
      ),
      rawData: r,
      size: r.size?.[0] || 'Medium',
      subracesCount: subCount,
    });
  }

  // 3. Spells
  for (const s of FIVE_TOOLS_SPELLS) {
    const src = s.source || SPELL_SOURCES[s.id] || 'PHB';
    const levelStr = s.level === 0 ? 'Cantrip' : `${s.level}${getOrdinalSuffix(s.level)}-level`;
    items.push({
      id: s.id,
      name: s.name,
      category: 'spells',
      categoryLabel: 'Spell',
      source: src,
      sourceLabel: getSourceLabel(src),
      subtitle: `${levelStr} ${s.school} • ${s.castingTime} • ${s.range}`,
      summary: clean5eToolsText(s.description || '').slice(0, 180) + '...',
      rawData: s,
      spellLevel: s.level,
      spellSchool: s.school,
      spellClasses: s.classes,
      damage: s.damage,
    });
  }

  // 4. Weapons
  for (const w of FIVE_TOOLS_WEAPONS) {
    const src = w.id === 'w_yklwa' ? 'ToA' : 'PHB';
    const props = w.properties?.length ? w.properties.join(', ') : 'Standard';
    items.push({
      id: w.id,
      name: w.name,
      category: 'weapons',
      categoryLabel: 'Weapon',
      source: src,
      sourceLabel: getSourceLabel(src),
      subtitle: `${w.category} • ${w.damage} ${w.damageType} • ${w.cost} • ${w.weight} lb`,
      summary: `Damage: ${w.damage} ${w.damageType}. Properties: ${props}.${w.range ? ` Range: ${w.range}.` : ''}`,
      rawData: w,
      weaponCategory: w.category,
      weaponDamage: w.damage,
      properties: w.properties,
    });
  }

  // 5. Armor & Shields
  for (const a of FIVE_TOOLS_ARMOR) {
    const src = 'PHB';
    const dexText =
      a.dexBonus === 'full' ? 'Full DEX' : a.dexBonus === 'max2' ? 'Max +2 DEX' : 'No DEX bonus';
    items.push({
      id: a.id,
      name: a.name,
      category: 'armor',
      categoryLabel: 'Armor & Shield',
      source: src,
      sourceLabel: getSourceLabel(src),
      subtitle: `${a.category} Armor • AC ${a.ac} (${dexText}) • ${a.cost} • ${a.weight} lb`,
      summary: `Provides AC ${a.ac}. Dexterity: ${dexText}.${a.stealthDisadvantage ? ' Imposes disadvantage on Stealth checks.' : ''}${a.minStr ? ` Requires Strength ${a.minStr}.` : ''}`,
      rawData: a,
      armorCategory: a.category,
      armorAc: a.ac,
    });
  }

  // 6. Adventuring Gear
  for (const g of FIVE_TOOLS_STANDARD_GEAR) {
    const src = 'PHB';
    items.push({
      id: g.id,
      name: g.name,
      category: 'gear',
      categoryLabel: 'Adventuring Gear',
      source: src,
      sourceLabel: getSourceLabel(src),
      subtitle: `${g.category || 'Gear'} • Cost: ${g.cost} • Weight: ${g.weight} lb`,
      summary: g.description || `Standard adventuring equipment. Weight: ${g.weight} lb, Cost: ${g.cost}.`,
      rawData: g,
    });
  }

  // 7. Magic Items
  for (const mi of MAGIC_ITEMS) {
    items.push({
      id: mi.id,
      name: mi.name,
      category: 'magic-items',
      categoryLabel: 'Magic Item',
      source: mi.source,
      sourceLabel: getSourceLabel(mi.source),
      page: mi.page,
      subtitle: `${mi.rarity} ${mi.type}${mi.attunement ? ' (Requires Attunement)' : ''}`,
      summary: mi.description.slice(0, 180) + '...',
      rawData: mi,
      itemRarity: mi.rarity,
      requiresAttunement: mi.attunement,
    });
  }

  // 8. Feats
  for (const f of FIVE_TOOLS_FEATS) {
    const src = f.source || 'PHB';
    const hasPrereq = f.prerequisite && f.prerequisite.length > 0;
    const prereqText = hasPrereq ? 'Prerequisite required' : 'No prerequisite';
    const firstEntry = f.entries?.[0] || 'Feat conferring special combat or adventuring abilities.';
    items.push({
      id: `feat_${f.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
      name: f.name,
      category: 'feats',
      categoryLabel: 'Feat',
      source: src,
      sourceLabel: getSourceLabel(src),
      subtitle: `Feat • ${prereqText}`,
      summary: clean5eToolsText(firstEntry).slice(0, 180),
      rawData: f,
      prerequisite: prereqText,
    });
  }

  // 9. Backgrounds
  for (const b of FIVE_TOOLS_BACKGROUNDS) {
    const src = b.source || 'PHB';
    const skills = b.skillProficiencies?.join(', ') || 'Choice';
    items.push({
      id: `bg_${b.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
      name: b.name,
      category: 'backgrounds',
      categoryLabel: 'Background',
      source: src,
      sourceLabel: getSourceLabel(src),
      page: b.page,
      subtitle: `Skills: ${skills} • Feature: ${b.feature?.name || 'Special Feature'}`,
      summary: `Proficiencies in ${skills}. Includes unique feature "${b.feature?.name || 'Background Feature'}" and starting equipment.`,
      rawData: b,
    });
  }

  // 10. Rules & Conditions
  for (const r of CONDITIONS_AND_RULES) {
    items.push({
      id: r.id,
      name: r.name,
      category: 'rules',
      categoryLabel: r.category,
      source: r.source,
      sourceLabel: getSourceLabel(r.source),
      page: r.page,
      subtitle: `${r.category} • Core 5e Rulebook`,
      summary: r.description,
      rawData: r,
    });
  }

  cachedCompendiumItems = items;
  return items;
}

function getOrdinalSuffix(n: number): string {
  if (n === 1) return 'st';
  if (n === 2) return 'nd';
  if (n === 3) return 'rd';
  return 'th';
}

/**
 * Calculates a search relevance score.
 * Strongly promotes the closest literal typed match to the top of the list!
 */
export function getCompendiumItemScore(item: CompendiumItem, query: string): number {
  if (!query) return 0;
  const q = query.toLowerCase().trim();
  const name = item.name.toLowerCase();
  const cat = item.category.toLowerCase();
  const catLabel = item.categoryLabel.toLowerCase();
  const src = item.source.toLowerCase();

  // Tier 1: Exact literal name match (e.g. typing "artificer" matches "Artificer")
  if (name === q) return 100000;

  // Tier 2: Name starts with query (shorter names prioritized)
  if (name.startsWith(q)) return 50000 - Math.min(name.length * 10, 5000);

  // Tier 3: Word boundary match in name (e.g. "Flame Tongue Longsword" when searching "Longsword")
  try {
    const wordBoundary = new RegExp(`\\b${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'i');
    if (wordBoundary.test(name)) return 35000 - Math.min(name.length * 10, 5000);
  } catch {
    // fallback
  }

  // Tier 4: Substring inside item name
  if (name.includes(q)) return 20000 - Math.min(name.length * 10, 5000);

  // Tier 5: Exact match on category or category label
  if (cat === q || catLabel === q) return 15000;

  // Tier 6: Sourcebook code exact match (e.g. typing "phb", "xge", "tce")
  if (src === q) return 12000;

  // Tier 7: Spell school or classes match
  if (item.spellSchool && item.spellSchool.toLowerCase() === q) return 10000;
  if (item.spellClasses && item.spellClasses.some((c) => c.toLowerCase() === q)) return 9000;
  if (item.spellClasses && item.spellClasses.some((c) => c.toLowerCase().includes(q))) return 6000;

  // Tier 8: Weapon / Armor category match
  if (item.weaponCategory && item.weaponCategory.toLowerCase().includes(q)) return 8000;
  if (item.armorCategory && item.armorCategory.toLowerCase().includes(q)) return 8000;

  // Tier 9: Summary or subtitle match
  if (item.subtitle.toLowerCase().includes(q)) return 3000;
  if (item.summary.toLowerCase().includes(q)) return 1500;

  return 0;
}

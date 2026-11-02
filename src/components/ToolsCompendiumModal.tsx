/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { X, Search, Sparkles, BookOpen, Shield, Swords, Plus, Check } from 'lucide-react';
import { FIVE_TOOLS_SPELLS } from '../data/spells';
import { FIVE_TOOLS_CLASSES } from '../data/classes';
import { FIVE_TOOLS_RACES } from '../data/races';
import { FIVE_TOOLS_BACKGROUNDS } from '../data/backgrounds';
import { FIVE_TOOLS_FEATS } from '../data/feats';
import { FIVE_TOOLS_WEAPONS, FIVE_TOOLS_ARMOR, FIVE_TOOLS_STANDARD_GEAR } from '../data/equipment';
import { clean5eToolsText, render5eToolsEntries } from '../utils/5eParser';
import { Character, Spell, WeaponItem, ArmorItem } from '../types/character';
import { getMaxSpellLevel, isSpellEligible } from '../utils/calculations';

interface ToolsCompendiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeCharacter: Character;
  onUpdateCharacter: (char: Character) => void;
}

type CompendiumCategory = 'all' | 'spells' | 'classes' | 'races' | 'backgrounds' | 'equipment' | 'feats';

/**
 * Calculates a relevance score for search results.
 * Higher scores mean a closer literal match to the typed query.
 */
function getSearchScore(item: any, q: string): number {
  if (!q) return 0;
  const name = (item.name || '').toLowerCase();
  const compType = (item.compType || '').toLowerCase();
  const category = (item.category || '').toLowerCase();
  const school = (item.school || '').toLowerCase();

  // Tier 1: Exact literal match on name (e.g. user typed "artificer" and item name is "Artificer")
  if (name === q) return 100000;

  // Tier 2: Name starts with query (e.g. user typed "artific" or "fire")
  // Shorter names get higher priority so closer literal lengths rank first
  if (name.startsWith(q)) return 50000 - Math.min(name.length * 10, 5000);

  // Tier 3: Word boundary match in name (e.g. "Battle Smith Artificer")
  try {
    const wordBoundaryRegex = new RegExp(`\\b${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'i');
    if (wordBoundaryRegex.test(name)) return 30000 - Math.min(name.length * 10, 5000);
  } catch {
    // fallback if regex fails
  }

  // Tier 4: Substring inside name
  if (name.includes(q)) return 20000 - Math.min(name.length * 10, 5000);

  // Tier 5: Exact match on component type or category (e.g. "class", "spell", "weapon")
  if (compType === q) return 12000;
  if (category === q) return 11000;

  // Tier 6: Subrace name match
  if (item.subraces && Array.isArray(item.subraces)) {
    for (const sr of item.subraces) {
      const srName = (sr.name || '').toLowerCase();
      if (srName === q) return 10000;
      if (srName.startsWith(q)) return 9000;
      if (srName.includes(q)) return 8000;
    }
  }

  // Tier 7: Magic school exact/substring
  if (school === q) return 7000;
  if (school.includes(q)) return 6000;

  // Tier 8: Category substring
  if (category.includes(q)) return 5000;
  if (compType.includes(q)) return 4500;

  // Tier 9: Classes list exact/substring (e.g. spells on the Artificer spell list)
  if (item.classes && Array.isArray(item.classes)) {
    if (item.classes.some((c: string) => c.toLowerCase() === q)) return 3000;
    if (item.classes.some((c: string) => c.toLowerCase().includes(q))) return 2000;
  }

  return 0;
}

export const ToolsCompendiumModal: React.FC<ToolsCompendiumModalProps> = ({
  isOpen,
  onClose,
  activeCharacter,
  onUpdateCharacter,
}) => {
  const [activeCategory, setActiveCategory] = useState<CompendiumCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [spellLevelFilter, setSpellLevelFilter] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [addedNotification, setAddedNotification] = useState<string | null>(null);

  const filteredItems = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    let list: any[] = [];

    if (activeCategory === 'all') {
      const allUnified = [
        ...FIVE_TOOLS_SPELLS.map((s) => ({ ...s, compType: 'Spell' })),
        ...FIVE_TOOLS_CLASSES.map((c) => ({ ...c, compType: 'Class' })),
        ...FIVE_TOOLS_RACES.map((r) => ({ ...r, compType: 'Race' })),
        ...FIVE_TOOLS_BACKGROUNDS.map((b) => ({ ...b, compType: 'Background' })),
        ...FIVE_TOOLS_FEATS.map((f) => ({ ...f, compType: 'Feat' })),
        ...FIVE_TOOLS_WEAPONS.map((w) => ({ ...w, eqType: 'Weapon', compType: 'Weapon' })),
        ...FIVE_TOOLS_ARMOR.map((a) => ({ ...a, eqType: 'Armor', compType: 'Armor' })),
        ...FIVE_TOOLS_STANDARD_GEAR.map((g) => ({ ...g, eqType: 'Gear', compType: 'Gear' })),
      ];

      if (!q) return allUnified;

      list = allUnified.filter((item: any) => {
        const matchesName = item.name?.toLowerCase().includes(q);
        const matchesType = item.compType?.toLowerCase().includes(q);
        const matchesSchool = item.school && item.school.toLowerCase().includes(q);
        const matchesCat = item.category && item.category.toLowerCase().includes(q);
        const matchesClasses =
          item.classes && Array.isArray(item.classes) && item.classes.some((c: string) => c.toLowerCase().includes(q));
        const matchesSubraces =
          item.subraces && Array.isArray(item.subraces) && item.subraces.some((sr: any) => sr.name?.toLowerCase().includes(q));

        return matchesName || matchesType || matchesSchool || matchesCat || matchesClasses || matchesSubraces;
      });
    } else if (activeCategory === 'spells') {
      list = FIVE_TOOLS_SPELLS.map((s) => ({ ...s, compType: 'Spell' })).filter((spell) => {
        const matchesQuery =
          !q ||
          spell.name.toLowerCase().includes(q) ||
          spell.school.toLowerCase().includes(q) ||
          spell.classes.some((c) => c.toLowerCase().includes(q));
        const matchesLevel = spellLevelFilter === 'all' || spell.level.toString() === spellLevelFilter;
        return matchesQuery && matchesLevel;
      });
    } else if (activeCategory === 'classes') {
      list = FIVE_TOOLS_CLASSES.map((c) => ({ ...c, compType: 'Class' })).filter(
        (c) => !q || c.name.toLowerCase().includes(q)
      );
    } else if (activeCategory === 'races') {
      list = FIVE_TOOLS_RACES.map((r) => ({ ...r, compType: 'Race' })).filter(
        (r) => !q || r.name.toLowerCase().includes(q) || r.subraces?.some((sr) => sr.name.toLowerCase().includes(q))
      );
    } else if (activeCategory === 'backgrounds') {
      list = FIVE_TOOLS_BACKGROUNDS.map((b) => ({ ...b, compType: 'Background' })).filter(
        (b) => !q || b.name.toLowerCase().includes(q)
      );
    } else if (activeCategory === 'feats') {
      list = FIVE_TOOLS_FEATS.map((f) => ({ ...f, compType: 'Feat' })).filter(
        (f) => !q || f.name.toLowerCase().includes(q)
      );
    } else if (activeCategory === 'equipment') {
      const allEq = [
        ...FIVE_TOOLS_WEAPONS.map((w) => ({ ...w, eqType: 'Weapon', compType: 'Weapon' })),
        ...FIVE_TOOLS_ARMOR.map((a) => ({ ...a, eqType: 'Armor', compType: 'Armor' })),
        ...FIVE_TOOLS_STANDARD_GEAR.map((g) => ({ ...g, eqType: 'Gear', compType: 'Gear' })),
      ];
      list = allEq.filter(
        (e) => !q || e.name.toLowerCase().includes(q) || (e.category && e.category.toLowerCase().includes(q))
      );
    }

    if (q) {
      list.sort((a, b) => {
        const scoreA = getSearchScore(a, q);
        const scoreB = getSearchScore(b, q);
        if (scoreB !== scoreA) {
          return scoreB - scoreA;
        }
        return (a.name || '').localeCompare(b.name || '');
      });
    }

    return list;
  }, [activeCategory, searchQuery, spellLevelFilter]);

  const activeSelected = useMemo(() => {
    if (selectedItem && filteredItems.some((fi: any) => fi.name === selectedItem.name)) {
      return selectedItem;
    }
    return filteredItems[0] || null;
  }, [selectedItem, filteredItems]);

  const item = activeSelected;

  if (!isOpen) return null;

  const handleAddSpellToCharacter = (spell: Spell) => {
    if (activeCharacter.spells?.some((s) => s.id === spell.id)) {
      setAddedNotification(`Spell "${spell.name}" is already known`);
      setTimeout(() => setAddedNotification(null), 2500);
      return;
    }

    const maxSpellLevel = getMaxSpellLevel(activeCharacter.className, activeCharacter.level);
    const eligibility = isSpellEligible(spell, activeCharacter.className, activeCharacter.level);

    if (!eligibility.eligible && eligibility.isHigherLevel) {
      setAddedNotification(
        `Notice: Level ${activeCharacter.level} ${activeCharacter.className} max spell level is ${maxSpellLevel}`
      );
      setTimeout(() => setAddedNotification(null), 3500);
      return;
    }

    const updated = {
      ...activeCharacter,
      spells: [...(activeCharacter.spells || []), { ...spell, prepared: true }],
      updatedAt: new Date().toISOString(),
    };
    onUpdateCharacter(updated);
    setAddedNotification(`Added "${spell.name}" to Grimoire`);
    setTimeout(() => setAddedNotification(null), 2500);
  };

  const handleAddWeaponToCharacter = (weapon: WeaponItem) => {
    const updated = {
      ...activeCharacter,
      weapons: [...(activeCharacter.weapons || []), { ...weapon, id: `w_${Date.now()}`, equipped: true }],
      updatedAt: new Date().toISOString(),
    };
    onUpdateCharacter(updated);
    setAddedNotification(`Equipped "${weapon.name}" on ${activeCharacter.name}`);
    setTimeout(() => setAddedNotification(null), 2500);
  };

  const handleAddArmorToCharacter = (armor: ArmorItem) => {
    const updated = {
      ...activeCharacter,
      armor: [...(activeCharacter.armor || []), { ...armor, id: `a_${Date.now()}`, equipped: true }],
      updatedAt: new Date().toISOString(),
    };
    onUpdateCharacter(updated);
    setAddedNotification(`Equipped "${armor.name}" on ${activeCharacter.name}`);
    setTimeout(() => setAddedNotification(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-900/40 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white border border-[#E5DFD5] rounded-2xl max-w-5xl w-full h-[85vh] shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8E3DA] bg-[#FBF9F5]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white border border-[#DDD5C7] flex items-center justify-center text-[#B85D36] shadow-sm">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-semibold text-stone-900 flex items-center gap-2">
                5e.tools Data Compendium
              </h3>
              <p className="text-xs text-stone-600">
                Official SRD 5.1 & 5e.tools dataset reference and direct integration
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Subheader: Category Tabs */}
        <div className="flex items-center gap-1 px-6 py-2.5 bg-[#FAF8F5] border-b border-[#E8E3DA] overflow-x-auto">
          {[
            { id: 'all', label: 'All', icon: Search },
            { id: 'spells', label: 'Spells', icon: Sparkles },
            { id: 'classes', label: 'Classes & Subclasses', icon: Swords },
            { id: 'races', label: 'Races & Species', icon: Shield },
            { id: 'backgrounds', label: 'Backgrounds', icon: BookOpen },
            { id: 'equipment', label: 'Weapons & Armor', icon: Swords },
            { id: 'feats', label: 'Feats', icon: Sparkles },
          ].map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id as CompendiumCategory);
                  setSelectedItem(null);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                  activeCategory === cat.id
                    ? 'bg-stone-900 text-white font-semibold shadow-sm'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Search & Filter Bar */}
        <div className="px-6 py-3 border-b border-[#E8E3DA] flex flex-wrap items-center justify-between gap-3 bg-white">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-3.5 h-3.5 text-stone-600 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={
                activeCategory === 'all'
                  ? 'Search all 5e entries (spells, classes, weapons, armor, feats, races)...'
                  : `Search ${activeCategory}...`
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#FAF8F5] border border-[#E5DFD5] rounded-xl text-stone-900 placeholder-stone-600 focus:outline-none focus:border-stone-400"
            />
          </div>

          <div className="text-xs text-stone-500 font-mono shrink-0">
            {filteredItems.length} {filteredItems.length === 1 ? 'entry' : 'entries'}
          </div>

          {activeCategory === 'spells' && (
            <div className="flex items-center gap-2 text-xs">
              <span className="text-stone-600">Level:</span>
              <select
                value={spellLevelFilter}
                onChange={(e) => setSpellLevelFilter(e.target.value)}
                className="bg-[#FAF8F5] border border-[#E5DFD5] rounded-lg px-2.5 py-1 text-stone-900 text-xs focus:outline-none"
              >
                <option value="all">All Levels</option>
                <option value="0">Cantrip (0)</option>
                <option value="1">1st Level</option>
                <option value="2">2nd Level</option>
                <option value="3">3rd Level</option>
                <option value="4">4th Level</option>
                <option value="5">5th Level</option>
                <option value="6">6th Level</option>
                <option value="7">7th Level</option>
                <option value="8">8th Level</option>
                <option value="9">9th Level</option>
              </select>
            </div>
          )}

          {addedNotification && (
            <div className="text-xs font-medium text-[#2E4A3E] flex items-center gap-1.5 animate-in fade-in">
              <Check className="w-3.5 h-3.5" />
              <span>{addedNotification}</span>
            </div>
          )}
        </div>

        {/* Master / Detail Split View */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
          {/* List Column */}
          <div className="md:col-span-5 border-r border-[#E8E3DA] overflow-y-auto divide-y divide-[#F0EBE1]">
                  {filteredItems.length === 0 ? (
                    <div className="p-8 text-center text-xs text-stone-600">
                      No entries found matching "{searchQuery}".
                    </div>
                  ) : (
                    filteredItems.map((item: any) => {
                      const isSelected = activeSelected?.name === item.name && (activeSelected?.compType === item.compType || !activeSelected?.compType);
                      return (
                        <button
                          key={`${item.compType || 'c'}_${item.id || item.name}`}
                          onClick={() => setSelectedItem(item)}
                          className={`w-full text-left p-4 transition-all flex items-center justify-between group ${
                            isSelected
                              ? 'bg-[#FAF8F5] border-l-2 border-l-[#B85D36] text-stone-900'
                              : 'hover:bg-[#FAF8F5] text-stone-800'
                          }`}
                        >
                          <div className="flex-1 min-w-0 pr-2">
                            <div className="flex items-center gap-2">
                              <span className="font-serif font-semibold text-sm text-stone-900 truncate">
                                {item.name}
                              </span>
                              {item.compType && (
                                <span className="text-[9px] uppercase font-mono tracking-wider px-1.5 py-0.5 rounded bg-stone-100 text-stone-600 border border-[#E5DFD5] shrink-0">
                                  {item.compType}
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-stone-600 mt-0.5 truncate">
                              {item.school && `${item.school} · ${item.level === 0 ? 'Cantrip' : `Lvl ${item.level}`}`}
                              {item.hd && `Hit Die: d${item.hd.faces}`}
                              {item.speed && `Speed: ${item.speed} ft`}
                              {item.category && `${item.category}`}
                              {item.damage && ` · ${item.damage} ${item.damageType || ''}`}
                              {item.ac !== undefined && ` · AC ${item.ac}`}
                            </div>
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>

          {/* Details Column */}
          <div className="md:col-span-7 overflow-y-auto p-6 bg-[#FAF8F5]">
            {!item ? (
              <div className="h-full flex items-center justify-center text-xs text-stone-600">
                Select an entry to view complete 5e rules and lore.
              </div>
            ) : (
              <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4 border-b border-[#E8E3DA] pb-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-serif text-2xl font-semibold text-stone-900">
                          {item.name}
                        </h4>
                        {item.compType && (
                          <span className="text-xs font-mono uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#FAF4ED] text-[#B85D36] border border-[#ECD9CE]">
                            {item.compType}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-stone-600 mt-1 flex items-center gap-2 flex-wrap">
                        {item.school && <span>{item.school} (Level {item.level})</span>}
                        {item.hd && <span>Hit Die: d{item.hd.faces}</span>}
                        {item.category && <span>{item.category}</span>}
                        {item.source && <span>· Source: {item.source}</span>}
                      </div>
                    </div>

                    {/* Quick Add Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      {(activeCategory === 'spells' || (activeCategory === 'all' && (item.compType === 'Spell' || item.school))) && (
                        <button
                          onClick={() => handleAddSpellToCharacter(item)}
                          className="px-3.5 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add to Grimoire</span>
                        </button>
                      )}

                      {((activeCategory === 'equipment' || activeCategory === 'all') && (item.damage || item.compType === 'Weapon')) && (
                        <button
                          onClick={() => handleAddWeaponToCharacter(item)}
                          className="px-3.5 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Equip Weapon</span>
                        </button>
                      )}

                      {((activeCategory === 'equipment' || activeCategory === 'all') && (item.ac !== undefined || item.compType === 'Armor')) && (
                        <button
                          onClick={() => handleAddArmorToCharacter(item)}
                          className="px-3.5 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Equip Armor</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Vitals summary cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    {item.castingTime && (
                      <div className="p-2.5 rounded-xl bg-white border border-[#E5DFD5]">
                        <span className="text-[10px] text-stone-600 block uppercase">Casting Time</span>
                        <span className="font-semibold text-stone-900">{item.castingTime}</span>
                      </div>
                    )}
                    {item.range && (
                      <div className="p-2.5 rounded-xl bg-white border border-[#E5DFD5]">
                        <span className="text-[10px] text-stone-600 block uppercase">Range</span>
                        <span className="font-semibold text-stone-900">{item.range}</span>
                      </div>
                    )}
                    {item.components && (
                      <div className="p-2.5 rounded-xl bg-white border border-[#E5DFD5]">
                        <span className="text-[10px] text-stone-600 block uppercase">Components</span>
                        <span className="font-semibold text-stone-900">{item.components}</span>
                      </div>
                    )}
                    {item.duration && (
                      <div className="p-2.5 rounded-xl bg-white border border-[#E5DFD5]">
                        <span className="text-[10px] text-stone-600 block uppercase">Duration</span>
                        <span className="font-semibold text-stone-900">{item.duration}</span>
                      </div>
                    )}
                    {item.damage && (
                      <div className="p-2.5 rounded-xl bg-white border border-[#E5DFD5]">
                        <span className="text-[10px] text-stone-600 block uppercase">Damage</span>
                        <span className="font-bold text-stone-900 font-mono">{item.damage} {item.damageType}</span>
                      </div>
                    )}
                    {item.cost && (
                      <div className="p-2.5 rounded-xl bg-white border border-[#E5DFD5]">
                        <span className="text-[10px] text-stone-600 block uppercase">Cost</span>
                        <span className="font-semibold text-stone-900">{item.cost}</span>
                      </div>
                    )}
                    {item.weight !== undefined && (
                      <div className="p-2.5 rounded-xl bg-white border border-[#E5DFD5]">
                        <span className="text-[10px] text-stone-600 block uppercase">Weight</span>
                        <span className="font-semibold text-stone-900">{item.weight} lbs</span>
                      </div>
                    )}
                  </div>

                  {/* Body Text */}
                  <div className="text-xs leading-relaxed text-stone-800 whitespace-pre-line bg-white p-5 rounded-2xl border border-[#E5DFD5] shadow-sm">
                    {item.description && clean5eToolsText(item.description)}
                    {item.entries && render5eToolsEntries(item.entries)}
                  </div>

                  {/* Class Features Accordion / List */}
                  {item.features && item.features.length > 0 && (
                    <div className="space-y-2 mt-4">
                      <h5 className="text-xs font-semibold uppercase tracking-wider text-stone-700">
                        Class Features Progression
                      </h5>
                      {item.features.map((feat: any) => (
                        <div key={feat.name} className="p-3.5 rounded-xl bg-white border border-[#E5DFD5]">
                          <div className="flex items-center justify-between text-xs font-semibold text-stone-900">
                            <span>{feat.name}</span>
                            <span className="text-stone-600 font-normal">Level {feat.level}</span>
                          </div>
                          <div className="text-[11px] text-stone-600 mt-1 leading-relaxed">
                            {render5eToolsEntries(feat.entries)}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Subclasses */}
                  {item.subclasses && item.subclasses.length > 0 && (
                    <div className="space-y-2 mt-4">
                      <h5 className="text-xs font-semibold uppercase tracking-wider text-stone-700">
                        Subclasses
                      </h5>
                      {item.subclasses.map((sub: any) => (
                        <div key={sub.name} className="p-3.5 rounded-xl bg-white border border-[#E5DFD5]">
                          <div className="text-xs font-semibold text-stone-900">{sub.name}</div>
                          {sub.subclassFeatures?.map((f: any) => (
                            <div key={f.name} className="mt-2 pl-2 border-l-2 border-stone-300">
                              <span className="text-xs font-medium text-stone-800">{f.name} (Lvl {f.level})</span>
                              <p className="text-[11px] text-stone-600 mt-0.5">{render5eToolsEntries(f.entries)}</p>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
        </div>
      </div>
    </div>
  );
};

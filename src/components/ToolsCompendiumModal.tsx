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

type CompendiumCategory = 'spells' | 'classes' | 'races' | 'backgrounds' | 'equipment' | 'feats';

export const ToolsCompendiumModal: React.FC<ToolsCompendiumModalProps> = ({
  isOpen,
  onClose,
  activeCharacter,
  onUpdateCharacter,
}) => {
  const [activeCategory, setActiveCategory] = useState<CompendiumCategory>('spells');
  const [searchQuery, setSearchQuery] = useState('');
  const [spellLevelFilter, setSpellLevelFilter] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [addedNotification, setAddedNotification] = useState<string | null>(null);

  const filteredItems = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    if (activeCategory === 'spells') {
      return FIVE_TOOLS_SPELLS.filter((spell) => {
        const matchesQuery =
          !q ||
          spell.name.toLowerCase().includes(q) ||
          spell.school.toLowerCase().includes(q) ||
          spell.classes.some((c) => c.toLowerCase().includes(q));
        const matchesLevel = spellLevelFilter === 'all' || spell.level.toString() === spellLevelFilter;
        return matchesQuery && matchesLevel;
      });
    }

    if (activeCategory === 'classes') {
      return FIVE_TOOLS_CLASSES.filter((c) => !q || c.name.toLowerCase().includes(q));
    }

    if (activeCategory === 'races') {
      return FIVE_TOOLS_RACES.filter(
        (r) => !q || r.name.toLowerCase().includes(q) || r.subraces?.some((sr) => sr.name.toLowerCase().includes(q))
      );
    }

    if (activeCategory === 'backgrounds') {
      return FIVE_TOOLS_BACKGROUNDS.filter((b) => !q || b.name.toLowerCase().includes(q));
    }

    if (activeCategory === 'feats') {
      return FIVE_TOOLS_FEATS.filter((f) => !q || f.name.toLowerCase().includes(q));
    }

    if (activeCategory === 'equipment') {
      const allEq = [
        ...FIVE_TOOLS_WEAPONS.map((w) => ({ ...w, eqType: 'Weapon' })),
        ...FIVE_TOOLS_ARMOR.map((a) => ({ ...a, eqType: 'Armor' })),
        ...FIVE_TOOLS_STANDARD_GEAR.map((g) => ({ ...g, eqType: 'Gear' })),
      ];
      return allEq.filter(
        (e) => !q || e.name.toLowerCase().includes(q) || (e.category && e.category.toLowerCase().includes(q))
      );
    }

    return [];
  }, [activeCategory, searchQuery, spellLevelFilter]);

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
              placeholder={`Search ${activeCategory}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#FAF8F5] border border-[#E5DFD5] rounded-xl text-stone-900 placeholder-stone-600 focus:outline-none focus:border-stone-400"
            />
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
              filteredItems.map((item: any, idx) => {
                const isSelected = selectedItem?.name === item.name || (!selectedItem && idx === 0);
                return (
                  <button
                    key={item.id || item.name}
                    onClick={() => setSelectedItem(item)}
                    className={`w-full text-left p-4 transition-all flex items-center justify-between group ${
                      isSelected
                        ? 'bg-[#FAF8F5] border-l-2 border-l-[#B85D36] text-stone-900'
                        : 'hover:bg-[#FAF8F5] text-stone-800'
                    }`}
                  >
                    <div>
                      <div className="font-serif font-semibold text-sm text-stone-900">
                        {item.name}
                      </div>
                      <div className="text-[11px] text-stone-600 mt-0.5">
                        {item.school && `${item.school} · ${item.level === 0 ? 'Cantrip' : `Lvl ${item.level}`}`}
                        {item.hd && `Hit Die: d${item.hd.faces}`}
                        {item.speed && `Speed: ${item.speed} ft`}
                        {item.category && `${item.category}`}
                        {item.damage && ` · ${item.damage} ${item.damageType || ''}`}
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Details Column */}
          <div className="md:col-span-7 overflow-y-auto p-6 bg-[#FAF8F5]">
            {(() => {
              const item = selectedItem || filteredItems[0];
              if (!item) {
                return (
                  <div className="h-full flex items-center justify-center text-xs text-stone-600">
                    Select an entry to view complete 5e rules and lore.
                  </div>
                );
              }

              return (
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4 border-b border-[#E8E3DA] pb-3">
                    <div>
                      <h4 className="font-serif text-2xl font-semibold text-stone-900">
                        {item.name}
                      </h4>
                      <div className="text-xs text-stone-600 mt-1 flex items-center gap-2 flex-wrap">
                        {item.school && <span>{item.school} (Level {item.level})</span>}
                        {item.hd && <span>Hit Die: d{item.hd.faces}</span>}
                        {item.category && <span>{item.category}</span>}
                        {item.source && <span>· Source: {item.source}</span>}
                      </div>
                    </div>

                    {/* Quick Add Actions */}
                    <div className="flex items-center gap-2">
                      {activeCategory === 'spells' && (
                        <button
                          onClick={() => handleAddSpellToCharacter(item)}
                          className="px-3.5 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add to Grimoire</span>
                        </button>
                      )}

                      {activeCategory === 'equipment' && item.damage && (
                        <button
                          onClick={() => handleAddWeaponToCharacter(item)}
                          className="px-3.5 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Equip Weapon</span>
                        </button>
                      )}

                      {activeCategory === 'equipment' && item.ac && (
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
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
};

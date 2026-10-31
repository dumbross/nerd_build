/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { X, Search, Sparkles, BookOpen, Shield, Swords, Plus, Check, Lock, AlertTriangle } from 'lucide-react';
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
        const matchesQuery = !q || spell.name.toLowerCase().includes(q) || spell.school.toLowerCase().includes(q) || spell.classes.some((c) => c.toLowerCase().includes(q));
        const matchesLevel = spellLevelFilter === 'all' || spell.level.toString() === spellLevelFilter;
        return matchesQuery && matchesLevel;
      });
    }

    if (activeCategory === 'classes') {
      return FIVE_TOOLS_CLASSES.filter((c) => !q || c.name.toLowerCase().includes(q));
    }

    if (activeCategory === 'races') {
      return FIVE_TOOLS_RACES.filter((r) => !q || r.name.toLowerCase().includes(q) || r.subraces?.some((sr) => sr.name.toLowerCase().includes(q)));
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
      return allEq.filter((e) => !q || e.name.toLowerCase().includes(q) || (e.category && e.category.toLowerCase().includes(q)));
    }

    return [];
  }, [activeCategory, searchQuery, spellLevelFilter]);

  if (!isOpen) return null;

  const handleAddSpellToCharacter = (spell: Spell) => {
    if (activeCharacter.spells?.some((s) => s.id === spell.id)) {
      setAddedNotification(`Spell "${spell.name}" is already known!`);
      setTimeout(() => setAddedNotification(null), 2500);
      return;
    }

    const maxSpellLevel = getMaxSpellLevel(activeCharacter.className, activeCharacter.level);
    const eligibility = isSpellEligible(spell, activeCharacter.className, activeCharacter.level);

    if (!eligibility.eligible && eligibility.isHigherLevel) {
      setAddedNotification(
        `⚠️ Level ${activeCharacter.level} ${activeCharacter.className} cannot cast Level ${spell.level} spells (Max: Level ${maxSpellLevel})!`
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
    setAddedNotification(`Added "${spell.name}" to ${activeCharacter.name}'s spells!`);
    setTimeout(() => setAddedNotification(null), 2500);
  };


  const handleAddWeaponToCharacter = (weapon: WeaponItem) => {
    const updated = {
      ...activeCharacter,
      weapons: [...(activeCharacter.weapons || []), { ...weapon, id: `w_${Date.now()}`, equipped: true }],
      updatedAt: new Date().toISOString(),
    };
    onUpdateCharacter(updated);
    setAddedNotification(`Equipped "${weapon.name}" on ${activeCharacter.name}!`);
    setTimeout(() => setAddedNotification(null), 2500);
  };

  const handleAddArmorToCharacter = (armor: ArmorItem) => {
    const updated = {
      ...activeCharacter,
      armor: [...(activeCharacter.armor || []), { ...armor, id: `a_${Date.now()}`, equipped: true }],
      updatedAt: new Date().toISOString(),
    };
    onUpdateCharacter(updated);
    setAddedNotification(`Equipped "${armor.name}" on ${activeCharacter.name}!`);
    setTimeout(() => setAddedNotification(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-5xl w-full h-[85vh] shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-slate-100 flex items-center gap-2">
                5e.tools Data Compendium
              </h3>
              <p className="text-xs text-slate-400">
                Official SRD 5.1 & 5e.tools dataset reference and direct integration
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Subheader: Category Tabs */}
        <div className="flex items-center gap-1 px-6 py-2.5 bg-slate-950/40 border-b border-slate-800/80 overflow-x-auto">
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
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                  activeCategory === cat.id
                    ? 'bg-amber-500/15 text-amber-300 font-semibold border border-amber-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Search & Filter Bar */}
        <div className="px-6 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-900/60">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={`Search ${activeCategory}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500/60"
            />
          </div>

          {activeCategory === 'spells' && (
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400">Level:</span>
              <select
                value={spellLevelFilter}
                onChange={(e) => setSpellLevelFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-slate-200 text-xs focus:outline-none focus:border-amber-500/50"
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
            <div className="text-xs font-medium text-emerald-400 flex items-center gap-1.5 animate-in fade-in">
              <Check className="w-3.5 h-3.5" />
              <span>{addedNotification}</span>
            </div>
          )}
        </div>

        {/* Master / Detail Split View */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
          {/* List Column */}
          <div className="md:col-span-5 border-r border-slate-800 overflow-y-auto divide-y divide-slate-800/60">
            {filteredItems.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">
                No entries found matching "{searchQuery}".
              </div>
            ) : (
              filteredItems.map((item: any, idx) => {
                const isSelected = selectedItem?.name === item.name || (!selectedItem && idx === 0);
                return (
                  <button
                    key={item.id || item.name}
                    onClick={() => setSelectedItem(item)}
                    className={`w-full text-left p-3.5 transition-colors flex items-center justify-between group ${
                      isSelected
                        ? 'bg-amber-500/10 border-l-2 border-l-amber-500 text-slate-100'
                        : 'hover:bg-slate-800/40 text-slate-300'
                    }`}
                  >
                    <div>
                      <div className="font-medium text-xs group-hover:text-amber-300 transition-colors">
                        {item.name}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {item.school && `${item.level === 0 ? 'Cantrip' : `Level ${item.level}`} · ${item.school}`}
                        {item.hd && `Hit Die: d${item.hd.faces}`}
                        {item.size && `Size: ${item.size.join(', ')} · Speed ${item.speed} ft`}
                        {item.damage && `${item.damage} ${item.damageType || ''} · ${item.category || ''}`}
                        {item.ac && `AC ${item.ac} · ${item.category || ''}`}
                        {item.source && ` [${item.source}]`}
                      </div>
                    </div>

                    {activeCategory === 'spells' && item.level > getMaxSpellLevel(activeCharacter.className, activeCharacter.level) && (
                      <span className="text-[10px] text-rose-400 flex items-center gap-1 shrink-0 px-1.5 py-0.5 rounded bg-rose-500/10 border border-rose-500/20">
                        <Lock className="w-2.5 h-2.5" />
                        <span>Lvl {item.level}</span>
                      </span>
                    )}
                  </button>

                );
              })
            )}
          </div>

          {/* Detail Column */}
          <div className="md:col-span-7 p-6 overflow-y-auto bg-slate-950/40">
            {(() => {
              const item = selectedItem || filteredItems[0];
              if (!item) {
                return (
                  <div className="h-full flex items-center justify-center text-xs text-slate-500">
                    Select an entry from the list to view its 5e.tools rules description.
                  </div>
                );
              }

              return (
                <div className="space-y-4">
                  {/* Item Header */}
                  <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-3">
                    <div>
                      <h4 className="font-serif text-xl font-bold text-amber-100">
                        {item.name}
                      </h4>
                      <div className="text-xs text-slate-400 mt-0.5">
                        {item.source && `Source: 5e.tools (${item.source}${item.page ? ` p.${item.page}` : ''})`}
                      </div>
                    </div>

                    {/* Action buttons depending on type */}
                    {activeCategory === 'spells' && (() => {
                      const maxLvl = getMaxSpellLevel(activeCharacter.className, activeCharacter.level);
                      const isLocked = item.level > maxLvl;
                      return (
                        <button
                          onClick={() => handleAddSpellToCharacter(item)}
                          disabled={isLocked}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0 ${
                            isLocked
                              ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/80'
                              : 'bg-amber-500 hover:bg-amber-450 text-slate-950 cursor-pointer'
                          }`}
                        >
                          {isLocked ? <Lock className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                          <span>{isLocked ? `Locked (Max: Lvl ${maxLvl})` : `Add Spell to ${activeCharacter.name}`}</span>
                        </button>
                      );
                    })()}


                    {activeCategory === 'equipment' && item.damage && (
                      <button
                        onClick={() => handleAddWeaponToCharacter(item)}
                        className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-450 text-slate-950 text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Equip Weapon</span>
                      </button>
                    )}

                    {activeCategory === 'equipment' && item.ac && (
                      <button
                        onClick={() => handleAddArmorToCharacter(item)}
                        className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-450 text-slate-950 text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Equip Armor</span>
                      </button>
                    )}
                  </div>

                  {/* Metadata Chips / Stats */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    {item.castingTime && (
                      <div className="p-2 rounded bg-slate-900 border border-slate-800">
                        <span className="text-[10px] text-slate-500 block uppercase">Casting Time</span>
                        <span className="font-medium text-slate-200">{item.castingTime}</span>
                      </div>
                    )}
                    {item.range && (
                      <div className="p-2 rounded bg-slate-900 border border-slate-800">
                        <span className="text-[10px] text-slate-500 block uppercase">Range</span>
                        <span className="font-medium text-slate-200">{item.range}</span>
                      </div>
                    )}
                    {item.components && (
                      <div className="p-2 rounded bg-slate-900 border border-slate-800">
                        <span className="text-[10px] text-slate-500 block uppercase">Components</span>
                        <span className="font-medium text-slate-200">{item.components}</span>
                      </div>
                    )}
                    {item.duration && (
                      <div className="p-2 rounded bg-slate-900 border border-slate-800">
                        <span className="text-[10px] text-slate-500 block uppercase">Duration</span>
                        <span className="font-medium text-slate-200">{item.duration}</span>
                      </div>
                    )}
                    {item.damage && (
                      <div className="p-2 rounded bg-slate-900 border border-slate-800">
                        <span className="text-[10px] text-slate-500 block uppercase">Damage</span>
                        <span className="font-bold text-amber-400 font-mono">{item.damage} {item.damageType}</span>
                      </div>
                    )}
                    {item.cost && (
                      <div className="p-2 rounded bg-slate-900 border border-slate-800">
                        <span className="text-[10px] text-slate-500 block uppercase">Cost</span>
                        <span className="font-medium text-amber-300">{item.cost}</span>
                      </div>
                    )}
                    {item.weight !== undefined && (
                      <div className="p-2 rounded bg-slate-900 border border-slate-800">
                        <span className="text-[10px] text-slate-500 block uppercase">Weight</span>
                        <span className="font-medium text-slate-200">{item.weight} lbs</span>
                      </div>
                    )}
                  </div>

                  {/* Body Text */}
                  <div className="prose prose-invert prose-sm text-xs leading-relaxed text-slate-300 whitespace-pre-line bg-slate-900/60 p-4 rounded-lg border border-slate-800/80">
                    {item.description && clean5eToolsText(item.description)}
                    {item.entries && render5eToolsEntries(item.entries)}
                  </div>

                  {/* Class Features Accordion / List if viewing class */}
                  {item.features && item.features.length > 0 && (
                    <div className="space-y-2 mt-4">
                      <h5 className="text-xs font-semibold uppercase tracking-wider text-amber-300">
                        Class Features Progression
                      </h5>
                      {item.features.map((feat: any) => (
                        <div key={feat.name} className="p-3 rounded bg-slate-900/80 border border-slate-800">
                          <div className="flex items-center justify-between text-xs font-bold text-slate-200">
                            <span>{feat.name}</span>
                            <span className="text-slate-500 font-normal">Level {feat.level}</span>
                          </div>
                          <div className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                            {render5eToolsEntries(feat.entries)}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Subclasses */}
                  {item.subclasses && item.subclasses.length > 0 && (
                    <div className="space-y-2 mt-4">
                      <h5 className="text-xs font-semibold uppercase tracking-wider text-amber-300">
                        Subclasses
                      </h5>
                      {item.subclasses.map((sub: any) => (
                        <div key={sub.name} className="p-3 rounded bg-slate-900/80 border border-slate-800">
                          <div className="text-xs font-bold text-slate-200">{sub.name}</div>
                          {sub.subclassFeatures?.map((f: any) => (
                            <div key={f.name} className="mt-2 pl-2 border-l border-amber-500/30">
                              <span className="text-xs font-semibold text-amber-300">{f.name} (Lvl {f.level})</span>
                              <p className="text-[11px] text-slate-400 mt-0.5">{render5eToolsEntries(f.entries)}</p>
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

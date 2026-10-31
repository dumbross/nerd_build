/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  X,
  Search,
  Swords,
  Shield,
  Backpack,
  Wrench,
  Sparkles,
  FlaskConical,
  Plus,
  Check,
  Coins,
} from 'lucide-react';
import { FIVE_TOOLS_WEAPONS, FIVE_TOOLS_ARMOR, FIVE_TOOLS_STANDARD_GEAR } from '../data/equipment';
import { WeaponItem, ArmorItem, GearItem, Character } from '../types/character';

interface EquipmentArmoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  character: Character;
  onUpdateCharacter: (char: Character) => void;
}

type TabType = 'all' | 'weapons' | 'armor' | 'gear' | 'tools' | 'magic' | 'consumables';

export const EquipmentArmoryModal: React.FC<EquipmentArmoryModalProps> = ({
  isOpen,
  onClose,
  character,
  onUpdateCharacter,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [addedItemNotice, setAddedItemNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  const showNotice = (name: string) => {
    setAddedItemNotice(`Added ${name} to inventory!`);
    setTimeout(() => setAddedItemNotice(null), 2500);
  };

  const handleAddWeapon = (weapon: WeaponItem, equipImmediately = false) => {
    const existing = character.weapons || [];
    const newWeapon: WeaponItem = {
      ...weapon,
      id: `${weapon.id}_${Date.now()}`,
      equipped: equipImmediately,
    };
    onUpdateCharacter({
      ...character,
      weapons: [...existing, newWeapon],
      updatedAt: new Date().toISOString(),
    });
    showNotice(weapon.name);
  };

  const handleAddArmor = (armor: ArmorItem, equipImmediately = false) => {
    const existing = character.armor || [];
    const newArmor: ArmorItem = {
      ...armor,
      id: `${armor.id}_${Date.now()}`,
      equipped: equipImmediately,
    };
    onUpdateCharacter({
      ...character,
      armor: [...existing, newArmor],
      updatedAt: new Date().toISOString(),
    });
    showNotice(armor.name);
  };

  const handleAddGear = (gear: GearItem) => {
    const existing = character.inventory || [];
    const matchIndex = existing.findIndex((g) => g.name === gear.name);

    let updatedInventory: GearItem[];
    if (matchIndex >= 0) {
      updatedInventory = [...existing];
      updatedInventory[matchIndex] = {
        ...updatedInventory[matchIndex],
        quantity: (updatedInventory[matchIndex].quantity || 1) + (gear.quantity || 1),
      };
    } else {
      updatedInventory = [
        ...existing,
        {
          ...gear,
          id: `${gear.id}_${Date.now()}`,
        },
      ];
    }

    onUpdateCharacter({
      ...character,
      inventory: updatedInventory,
      updatedAt: new Date().toISOString(),
    });
    showNotice(gear.name);
  };

  // Filtered lists
  const filteredWeapons = useMemo(() => {
    return FIVE_TOOLS_WEAPONS.filter((w) => {
      const matchSearch =
        w.name.toLowerCase().includes(search.toLowerCase()) ||
        w.category.toLowerCase().includes(search.toLowerCase()) ||
        w.properties?.some((p) => p.toLowerCase().includes(search.toLowerCase()));
      if (!matchSearch) return false;
      if (filterCategory !== 'all' && !w.category.toLowerCase().includes(filterCategory.toLowerCase())) return false;
      return true;
    });
  }, [search, filterCategory]);

  const filteredArmor = useMemo(() => {
    return FIVE_TOOLS_ARMOR.filter((a) => {
      const matchSearch =
        a.name.toLowerCase().includes(search.toLowerCase()) ||
        a.category.toLowerCase().includes(search.toLowerCase());
      if (!matchSearch) return false;
      if (filterCategory !== 'all' && a.category.toLowerCase() !== filterCategory.toLowerCase()) return false;
      return true;
    });
  }, [search, filterCategory]);

  const filteredGear = useMemo(() => {
    return FIVE_TOOLS_STANDARD_GEAR.filter((g) => {
      const matchSearch =
        g.name.toLowerCase().includes(search.toLowerCase()) ||
        (g.category && g.category.toLowerCase().includes(search.toLowerCase())) ||
        (g.description && g.description.toLowerCase().includes(search.toLowerCase()));
      if (!matchSearch) return false;

      if (activeTab === 'tools' && g.category !== 'Tools') return false;
      if (activeTab === 'magic' && g.category !== 'Magic Item') return false;
      if (activeTab === 'consumables' && g.category !== 'Consumable' && g.category !== 'Ammunition') return false;
      if (activeTab === 'gear' && g.category !== 'Gear' && g.category !== 'Focus') return false;

      return true;
    });
  }, [search, activeTab]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-amber-500/30 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Swords className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold text-slate-100 flex items-center gap-2">
                <span>5e.tools Armory & Equipment Catalog</span>
                <span className="text-[10px] font-sans font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Ready to Select
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Browse weapons, armor, tools, and adventuring gear. Add directly to {character.name || 'Character'}.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feedback notice toast */}
        {addedItemNotice && (
          <div className="bg-emerald-500/20 border-b border-emerald-500/40 px-6 py-2 text-xs font-semibold text-emerald-300 flex items-center gap-2 animate-in fade-in">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{addedItemNotice}</span>
          </div>
        )}

        {/* Filter & Search Bar */}
        <div className="px-6 py-3 border-b border-slate-800 bg-slate-900/90 flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search by name, damage, properties, or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500/60"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white text-xs"
              >
                ×
              </button>
            )}
          </div>

          {/* Navigation Category Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {[
              { id: 'all', label: 'All Items', icon: Backpack },
              { id: 'weapons', label: 'Weapons', icon: Swords },
              { id: 'armor', label: 'Armor & Shields', icon: Shield },
              { id: 'gear', label: 'Gear & Packs', icon: Backpack },
              { id: 'tools', label: 'Tools & Kits', icon: Wrench },
              { id: 'consumables', label: 'Potions & Ammo', icon: FlaskConical },
              { id: 'magic', label: 'Magic Items', icon: Sparkles },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as TabType);
                    setFilterCategory('all');
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition-colors ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'bg-slate-950/70 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* WEAPONS SECTION */}
          {(activeTab === 'all' || activeTab === 'weapons') && filteredWeapons.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-2">
                  <Swords className="w-4 h-4" />
                  <span>Weapons ({filteredWeapons.length})</span>
                </h3>
                {activeTab === 'weapons' && (
                  <div className="flex items-center gap-1 text-[11px]">
                    {['all', 'simple', 'martial', 'ranged'].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setFilterCategory(cat)}
                        className={`px-2 py-0.5 rounded capitalize ${
                          filterCategory === cat
                            ? 'bg-slate-800 text-amber-300 font-bold'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredWeapons.map((w) => (
                  <div
                    key={w.id}
                    className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 flex flex-col justify-between gap-2.5 transition-all"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-bold text-slate-100 text-sm">{w.name}</span>
                        <span className="font-mono text-amber-400 text-xs font-bold whitespace-nowrap">
                          {w.damage} {w.damageType}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1 flex-wrap">
                        <span className="px-1.5 py-0.5 rounded bg-slate-800/80 text-slate-300 text-[10px]">
                          {w.category}
                        </span>
                        {w.range && <span>Range: {w.range}</span>}
                        {w.weight !== undefined && <span>{w.weight} lbs</span>}
                        {w.cost && <span className="text-amber-500/90">{w.cost}</span>}
                      </div>

                      {w.properties && w.properties.length > 0 && (
                        <div className="text-[10px] text-slate-400 mt-1.5 italic">
                          Properties: {w.properties.join(', ')}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-slate-900">
                      <button
                        onClick={() => handleAddWeapon(w, false)}
                        className="flex-1 py-1 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5 text-amber-400" />
                        <span>Add to Pack</span>
                      </button>
                      <button
                        onClick={() => handleAddWeapon(w, true)}
                        className="py-1 px-3 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-semibold transition-colors"
                      >
                        Equip
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ARMOR SECTION */}
          {(activeTab === 'all' || activeTab === 'armor') && filteredArmor.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  <span>Armor & Shields ({filteredArmor.length})</span>
                </h3>
                {activeTab === 'armor' && (
                  <div className="flex items-center gap-1 text-[11px]">
                    {['all', 'light', 'medium', 'heavy', 'shield'].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setFilterCategory(cat)}
                        className={`px-2 py-0.5 rounded capitalize ${
                          filterCategory === cat
                            ? 'bg-slate-800 text-amber-300 font-bold'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredArmor.map((a) => (
                  <div
                    key={a.id}
                    className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 flex flex-col justify-between gap-2.5 transition-all"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-bold text-slate-100 text-sm">{a.name}</span>
                        <span className="font-mono text-cyan-400 text-xs font-bold whitespace-nowrap">
                          {a.category === 'Shield' ? `+${a.ac} AC` : `AC ${a.ac}`}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1 flex-wrap">
                        <span className="px-1.5 py-0.5 rounded bg-slate-800/80 text-slate-300 text-[10px]">
                          {a.category} Armor
                        </span>
                        {a.dexBonus === 'full' && <span>+ Dex Mod</span>}
                        {a.dexBonus === 'max2' && <span>+ Dex Mod (max 2)</span>}
                        {a.dexBonus === 'none' && <span>No Dex bonus</span>}
                        {a.minStr && <span>Req STR {a.minStr}</span>}
                        {a.stealthDisadvantage && <span className="text-rose-400">Stealth Disadv.</span>}
                        {a.weight !== undefined && <span>{a.weight} lbs</span>}
                        {a.cost && <span className="text-amber-500/90">{a.cost}</span>}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-slate-900">
                      <button
                        onClick={() => handleAddArmor(a, false)}
                        className="flex-1 py-1 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5 text-amber-400" />
                        <span>Add to Pack</span>
                      </button>
                      <button
                        onClick={() => handleAddArmor(a, true)}
                        className="py-1 px-3 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-semibold transition-colors"
                      >
                        Equip
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* GEAR & TOOLS & MAGIC ITEMS */}
          {(activeTab === 'all' ||
            activeTab === 'gear' ||
            activeTab === 'tools' ||
            activeTab === 'consumables' ||
            activeTab === 'magic') &&
            filteredGear.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-2">
                    <Backpack className="w-4 h-4" />
                    <span>
                      {activeTab === 'tools'
                        ? 'Tools, Kits & Artisan Supplies'
                        : activeTab === 'magic'
                        ? 'Magic Items & Wondrous Artifacts'
                        : activeTab === 'consumables'
                        ? 'Potions, Flasks & Ammunition'
                        : 'Adventuring Gear & Equipment'}{' '}
                      ({filteredGear.length})
                    </span>
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {filteredGear.map((g) => (
                    <div
                      key={g.id}
                      className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 flex flex-col justify-between gap-2 transition-all"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-bold text-slate-100 text-sm">{g.name}</span>
                          <span className="text-[11px] font-mono text-amber-400">{g.cost || '—'}</span>
                        </div>

                        <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
                          <span className="px-1.5 py-0.5 rounded bg-slate-800/80 text-slate-300 text-[10px]">
                            {g.category || 'Gear'}
                          </span>
                          <span>{g.weight} lbs</span>
                          {g.quantity > 1 && <span>Qty: {g.quantity}</span>}
                        </div>

                        {g.description && (
                          <div className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                            {g.description}
                          </div>
                        )}
                      </div>

                      <div className="pt-2 border-t border-slate-900">
                        <button
                          onClick={() => handleAddGear(g)}
                          className="w-full py-1 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5 text-amber-400" />
                          <span>Add to Inventory</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* Empty state */}
          {filteredWeapons.length === 0 && filteredArmor.length === 0 && filteredGear.length === 0 && (
            <div className="text-center py-12 text-slate-400 space-y-2">
              <Search className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-sm font-semibold">No equipment matching "{search}"</p>
              <p className="text-xs text-slate-500">
                Try searching for a different weapon, armor type, tool, or potion.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/70 flex items-center justify-between text-xs text-slate-400">
          <div>
            Total items in 5e.tools armory:{' '}
            <span className="text-amber-300 font-semibold">
              {FIVE_TOOLS_WEAPONS.length + FIVE_TOOLS_ARMOR.length + FIVE_TOOLS_STANDARD_GEAR.length}
            </span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-450 text-slate-950 font-bold text-xs transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

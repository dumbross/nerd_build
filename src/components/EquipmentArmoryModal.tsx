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
    setAddedItemNotice(`Added ${name} to inventory`);
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

  const filteredWeapons = useMemo(() => {
    return FIVE_TOOLS_WEAPONS.filter((w) => {
      const matchSearch =
        w.name.toLowerCase().includes(search.toLowerCase()) ||
        w.category.toLowerCase().includes(search.toLowerCase()) ||
        w.damageType.toLowerCase().includes(search.toLowerCase());
      if (!matchSearch) return false;
      if (filterCategory !== 'all' && w.category.toLowerCase() !== filterCategory.toLowerCase()) return false;
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border border-[#E5DFD5] rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E8E3DA] flex items-center justify-between bg-[#FBF9F5]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white border border-[#DDD5C7] flex items-center justify-center text-[#B85D36] shadow-sm">
              <Swords className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-semibold text-stone-900 flex items-center gap-2">
                <span>5e.tools Armory & Equipment Catalog</span>
              </h2>
              <p className="text-xs text-stone-600">
                Browse weapons, armor, tools, and adventuring gear. Add directly to {character.name || 'Character'}.
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

        {/* Feedback notice toast */}
        {addedItemNotice && (
          <div className="bg-[#FAF8F5] border-b border-[#E8E3DA] px-6 py-2 text-xs font-medium text-[#2E4A3E] flex items-center gap-2 animate-in fade-in">
            <Check className="w-4 h-4 text-[#2E4A3E]" />
            <span>{addedItemNotice}</span>
          </div>
        )}

        {/* Filter & Search Bar */}
        <div className="px-6 py-3 border-b border-[#E8E3DA] bg-[#FAF8F5] flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-600" />
            <input
              type="text"
              placeholder="Search by name, damage, properties, or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-4 py-1.5 bg-white border border-[#E5DFD5] rounded-xl text-xs text-stone-900 placeholder-stone-600 focus:outline-none focus:border-stone-400"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-600 hover:text-stone-900 text-xs"
              >
                ×
              </button>
            )}
          </div>

          {/* Navigation Category Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 bg-white p-0.5 rounded-xl border border-[#E5DFD5]">
            {[
              { id: 'all', label: 'All Items', icon: Backpack },
              { id: 'weapons', label: 'Weapons', icon: Swords },
              { id: 'armor', label: 'Armor', icon: Shield },
              { id: 'gear', label: 'Gear', icon: Backpack },
              { id: 'tools', label: 'Tools', icon: Wrench },
              { id: 'consumables', label: 'Potions', icon: FlaskConical },
              { id: 'magic', label: 'Magic', icon: Sparkles },
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
                  className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap flex items-center gap-1.5 transition-all ${
                    isActive
                      ? 'bg-stone-900 text-white font-semibold shadow-sm'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <Icon className="w-3 h-3" />
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
              <div className="flex items-center justify-between border-b border-[#E8E3DA] pb-2">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-700 flex items-center gap-2">
                  <Swords className="w-4 h-4 text-stone-600" />
                  <span>Weapons ({filteredWeapons.length})</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredWeapons.map((w) => (
                  <div
                    key={w.id}
                    className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E8E3DA] hover:border-stone-400 flex flex-col justify-between gap-2 transition-all shadow-sm"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-serif font-semibold text-stone-900 text-sm">{w.name}</span>
                        <span className="font-mono text-xs font-bold text-stone-900">
                          {w.damage} {w.damageType}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-[11px] text-stone-600 mt-1">
                        <span className="px-1.5 py-0.5 rounded bg-white text-stone-700 text-[10px] border border-[#E0D9CE]">
                          {w.category}
                        </span>
                        <span>{w.weight} lbs</span>
                        <span>· {w.cost}</span>
                      </div>

                      {w.properties && w.properties.length > 0 && (
                        <div className="text-[11px] text-stone-600 mt-1.5 italic">
                          {w.properties.join(', ')}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-[#E8E3DA]">
                      <button
                        onClick={() => handleAddWeapon(w, true)}
                        className="flex-1 py-1 px-3 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium flex items-center justify-center gap-1.5 shadow-sm transition-all"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Equip</span>
                      </button>
                      <button
                        onClick={() => handleAddWeapon(w, false)}
                        className="py-1 px-3 rounded-lg bg-white hover:bg-stone-100 text-stone-800 border border-[#DDD5C7] text-xs font-medium shadow-sm transition-all"
                      >
                        + In Pack
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
              <div className="flex items-center justify-between border-b border-[#E8E3DA] pb-2">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-700 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-stone-600" />
                  <span>Armor & Shields ({filteredArmor.length})</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredArmor.map((a) => (
                  <div
                    key={a.id}
                    className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E8E3DA] hover:border-stone-400 flex flex-col justify-between gap-2 transition-all shadow-sm"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-serif font-semibold text-stone-900 text-sm">{a.name}</span>
                        <span className="font-mono text-xs font-bold text-[#2E4A3E]">
                          {a.category === 'Shield' ? `+${a.ac} AC` : `AC ${a.ac}`}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-[11px] text-stone-600 mt-1">
                        <span className="px-1.5 py-0.5 rounded bg-white text-stone-700 text-[10px] border border-[#E0D9CE]">
                          {a.category}
                        </span>
                        <span>{a.weight} lbs</span>
                        <span>· {a.cost}</span>
                        {a.stealthDisadvantage && (
                          <span className="text-rose-700">· Stealth Disadv</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-[#E8E3DA]">
                      <button
                        onClick={() => handleAddArmor(a, true)}
                        className="flex-1 py-1 px-3 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium flex items-center justify-center gap-1.5 shadow-sm transition-all"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Equip</span>
                      </button>
                      <button
                        onClick={() => handleAddArmor(a, false)}
                        className="py-1 px-3 rounded-lg bg-white hover:bg-stone-100 text-stone-800 border border-[#DDD5C7] text-xs font-medium shadow-sm transition-all"
                      >
                        + In Pack
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
                <div className="flex items-center justify-between border-b border-[#E8E3DA] pb-2">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-700 flex items-center gap-2">
                    <Backpack className="w-4 h-4 text-stone-600" />
                    <span>
                      {activeTab === 'tools'
                        ? 'Tools, Kits & Artisan Supplies'
                        : activeTab === 'magic'
                        ? 'Magic Items'
                        : activeTab === 'consumables'
                        ? 'Potions & Ammunition'
                        : 'Adventuring Gear & Equipment'}{' '}
                      ({filteredGear.length})
                    </span>
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {filteredGear.map((g) => (
                    <div
                      key={g.id}
                      className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E8E3DA] hover:border-stone-400 flex flex-col justify-between gap-2 transition-all shadow-sm"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-serif font-semibold text-stone-900 text-sm">{g.name}</span>
                          <span className="text-[11px] font-mono text-stone-700">{g.cost || '—'}</span>
                        </div>

                        <div className="flex items-center gap-2 text-[11px] text-stone-600 mt-1">
                          <span className="px-1.5 py-0.5 rounded bg-white text-stone-700 text-[10px] border border-[#E0D9CE]">
                            {g.category || 'Gear'}
                          </span>
                          <span>{g.weight} lbs</span>
                          {g.quantity > 1 && <span>Qty: {g.quantity}</span>}
                        </div>

                        {g.description && (
                          <div className="text-[11px] text-stone-600 mt-2 leading-relaxed">
                            {g.description}
                          </div>
                        )}
                      </div>

                      <div className="pt-2 border-t border-[#E8E3DA]">
                        <button
                          onClick={() => handleAddGear(g)}
                          className="w-full py-1.5 px-3 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium flex items-center justify-center gap-1.5 shadow-sm transition-all"
                        >
                          <Plus className="w-3.5 h-3.5" />
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
            <div className="text-center py-12 text-stone-600 space-y-2">
              <Search className="w-8 h-8 text-stone-400 mx-auto" />
              <p className="text-sm font-semibold">No equipment matching "{search}"</p>
              <p className="text-xs text-stone-600">
                Try searching for a different weapon, armor type, tool, or potion.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-[#E8E3DA] bg-[#FBF9F5] flex items-center justify-between text-xs text-stone-600">
          <div>
            Total items in 5e.tools armory:{' '}
            <span className="font-semibold text-stone-900">
              {FIVE_TOOLS_WEAPONS.length + FIVE_TOOLS_ARMOR.length + FIVE_TOOLS_STANDARD_GEAR.length}
            </span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-medium text-xs transition-all shadow-sm"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

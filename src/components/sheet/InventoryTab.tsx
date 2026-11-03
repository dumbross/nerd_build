/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Backpack, Coins, Plus, Trash2, Shield, Swords, Sparkles, BookOpen } from 'lucide-react';
import { Character, GearItem, WeaponItem, ArmorItem } from '../../types/character';
import { getAbilityScoresTotal } from '../../utils/calculations';
import { EquipmentArmoryModal } from '../EquipmentArmoryModal';

interface InventoryTabProps {
  character: Character;
  onUpdateCharacter: (char: Character) => void;
  onOpenCompendium?: (category?: string) => void;
}

export const InventoryTab: React.FC<InventoryTabProps> = ({
  character,
  onUpdateCharacter,
  onOpenCompendium,
}) => {
  const [newItemName, setNewItemName] = useState('');
  const [newItemQty, setNewItemQty] = useState('1');
  const [newItemWeight, setNewItemWeight] = useState('1');
  const [isAddingGear, setIsAddingGear] = useState(false);
  const [isArmoryOpen, setIsArmoryOpen] = useState(false);

  const abilities = getAbilityScoresTotal(character);
  const maxCapacity = abilities.str * 15; // 5e standard carrying capacity

  // Calculate total weight
  const weaponsWeight = (character.weapons || []).reduce((acc, w) => acc + (w.weight || 0), 0);
  const armorWeight = (character.armor || []).reduce((acc, a) => acc + (a.weight || 0), 0);
  const gearWeight = (character.inventory || []).reduce((acc, g) => acc + (g.weight || 0) * (g.quantity || 1), 0);
  const totalWeight = Math.round((weaponsWeight + armorWeight + gearWeight) * 10) / 10;
  const weightPercent = Math.min(100, Math.round((totalWeight / maxCapacity) * 100));

  const update = (patch: Partial<Character>) => {
    onUpdateCharacter({
      ...character,
      ...patch,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleUpdateCurrency = (denom: 'cp' | 'sp' | 'ep' | 'gp' | 'pp', val: string) => {
    const num = Math.max(0, parseInt(val) || 0);
    update({
      currency: {
        ...(character.currency || { cp: 0, sp: 0, ep: 0, gp: 0, pp: 0 }),
        [denom]: num,
      },
    });
  };

  const handleAddGear = () => {
    if (!newItemName.trim()) return;
    const item: GearItem = {
      id: `g_custom_${Date.now()}`,
      name: newItemName.trim(),
      quantity: parseInt(newItemQty) || 1,
      weight: parseFloat(newItemWeight) || 0,
      cost: '—',
    };

    update({
      inventory: [...(character.inventory || []), item],
    });

    setNewItemName('');
    setIsAddingGear(false);
  };

  const handleToggleEquipWeapon = (idx: number) => {
    const updated = [...(character.weapons || [])];
    updated[idx].equipped = !updated[idx].equipped;
    update({ weapons: updated });
  };

  const handleDeleteWeapon = (idx: number) => {
    const updated = (character.weapons || []).filter((_, i) => i !== idx);
    update({ weapons: updated });
  };

  const handleToggleEquipArmor = (idx: number) => {
    const updated = [...(character.armor || [])];
    updated[idx].equipped = !updated[idx].equipped;
    update({ armor: updated });
  };

  const handleDeleteArmor = (idx: number) => {
    const updated = (character.armor || []).filter((_, i) => i !== idx);
    update({ armor: updated });
  };

  const handleAdjustGearQty = (id: string, delta: number) => {
    const updated = (character.inventory || [])
      .map((g) => {
        if (g.id === id) {
          const nextQ = (g.quantity || 1) + delta;
          return nextQ > 0 ? { ...g, quantity: nextQ } : null;
        }
        return g;
      })
      .filter(Boolean) as GearItem[];

    update({ inventory: updated });
  };

  const handleDeleteGear = (id: string) => {
    const updated = (character.inventory || []).filter((g) => g.id !== id);
    update({ inventory: updated });
  };

  const cur = character.currency || { cp: 0, sp: 0, ep: 0, gp: 0, pp: 0 };

  return (
    <div className="space-y-6">
      {/* Top Strip: Currency & Encumbrance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Currency Pouch */}
        <div className="p-5 rounded-2xl bg-white border border-[#E5DFD5] space-y-3 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-wider text-stone-600 flex items-center gap-2">
            <Coins className="w-4 h-4 text-stone-600" />
            <span>Coin Pouch & Wealth</span>
          </div>

          <div className="grid grid-cols-5 gap-2 text-center">
            {[
              { id: 'cp', label: 'CP', color: 'text-stone-700', val: cur.cp },
              { id: 'sp', label: 'SP', color: 'text-stone-700', val: cur.sp },
              { id: 'ep', label: 'EP', color: 'text-stone-700', val: cur.ep },
              { id: 'gp', label: 'GP', color: 'text-[#B85D36]', val: cur.gp },
              { id: 'pp', label: 'PP', color: 'text-stone-700', val: cur.pp },
            ].map((c) => (
              <div key={c.id} className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E8E3DA]">
                <span className={`text-[10px] font-semibold block ${c.color}`}>{c.label}</span>
                <input
                  type="number"
                  value={c.val || 0}
                  onChange={(e) => handleUpdateCurrency(c.id as any, e.target.value)}
                  className="w-full bg-transparent font-mono font-bold text-center text-xs text-stone-900 focus:outline-none"
                  min="0"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Carrying Capacity & Encumbrance */}
        <div className="p-5 rounded-2xl bg-white border border-[#E5DFD5] space-y-3 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold uppercase tracking-wider text-stone-600 flex items-center gap-2">
              <Backpack className="w-4 h-4 text-stone-600" />
              <span>Weight & Encumbrance</span>
            </span>
            <span className="font-mono font-bold text-stone-900 tabular-nums">
              {totalWeight} / {maxCapacity} lbs
            </span>
          </div>

          <div className="w-full bg-[#E5DFD5] h-2 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 rounded-full ${
                weightPercent > 100 ? 'bg-rose-700' : weightPercent > 80 ? 'bg-[#B85D36]' : 'bg-[#2E4A3E]'
              }`}
              style={{ width: `${Math.min(100, weightPercent)}%` }}
            />
          </div>

          <div className="text-[11px] text-stone-600 flex items-center justify-between">
            <span>Capacity = STR × 15 lbs</span>
            <span>{maxCapacity - totalWeight > 0 ? `${Math.round(maxCapacity - totalWeight)} lbs remaining` : 'Encumbered!'}</span>
          </div>
        </div>
      </div>

      {/* 5e.tools Quick Armory Launcher */}
      <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E8E3DA] flex items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white border border-[#DDD5C7] flex items-center justify-center text-[#B85D36] shadow-sm">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-semibold text-stone-900 flex items-center gap-2">
              <span>5e.tools Compendium Armory</span>
            </div>
            <div className="text-[11px] text-stone-600">
              Browse all 5e weapons, armor sets, shields, tools, and adventure packs.
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onOpenCompendium && (
            <button
              onClick={() => onOpenCompendium('weapons')}
              className="px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium flex items-center gap-1.5 transition-all shadow-xs"
              title="Open Weapons & Armor in Grand Compendium"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#EBD6CA]" />
              <span>Full Compendium</span>
            </button>
          )}
          <button
            onClick={() => setIsArmoryOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-white hover:bg-stone-50 border border-[#DDD5C7] text-stone-800 text-xs font-medium flex items-center gap-1.5 transition-all shadow-xs"
          >
            <Swords className="w-3.5 h-3.5 text-[#B85D36]" />
            <span>Quick Armory</span>
          </button>
        </div>
      </div>

      {/* Weapons Section */}
      <div className="p-5 rounded-2xl bg-white border border-[#E5DFD5] space-y-3 shadow-sm">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-600 flex items-center gap-2">
            <Swords className="w-4 h-4 text-stone-600" />
            <span>Weapons ({(character.weapons || []).length})</span>
          </h4>

          <button
            onClick={() => setIsArmoryOpen(true)}
            className="px-2.5 py-1 rounded-lg bg-[#FAF8F5] hover:bg-[#F2ECE3] border border-[#E0D9CE] text-stone-800 text-xs font-medium flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5 text-[#B85D36]" />
            <span>Add Weapon</span>
          </button>
        </div>

        <div className="space-y-2">
          {(character.weapons || []).map((w, idx) => (
            <div
              key={w.id || idx}
              className="flex items-center justify-between p-3 rounded-xl bg-[#FAF8F5] border border-[#E8E3DA] text-xs"
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleToggleEquipWeapon(idx)}
                  className={`px-2.5 py-0.5 rounded-md text-[10px] font-medium transition-all ${
                    w.equipped
                      ? 'bg-stone-900 text-white'
                      : 'bg-white border border-[#DDD5C7] text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {w.equipped ? 'Equipped' : 'Stowed'}
                </button>
                <span className="font-semibold text-stone-900">{w.name}</span>
                <span className="text-stone-600 font-mono">{w.damage} {w.damageType}</span>
                <span className="text-stone-600 text-[10px]">{w.weight} lbs</span>
              </div>

              <button
                onClick={() => handleDeleteWeapon(idx)}
                className="text-stone-600 hover:text-stone-900 transition-colors p-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Armor Section */}
      <div className="p-5 rounded-2xl bg-white border border-[#E5DFD5] space-y-3 shadow-sm">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-600 flex items-center gap-2">
            <Shield className="w-4 h-4 text-stone-600" />
            <span>Armor & Shields ({(character.armor || []).length})</span>
          </h4>

          <button
            onClick={() => setIsArmoryOpen(true)}
            className="px-2.5 py-1 rounded-lg bg-[#FAF8F5] hover:bg-[#F2ECE3] border border-[#E0D9CE] text-stone-800 text-xs font-medium flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5 text-[#B85D36]" />
            <span>Add Armor</span>
          </button>
        </div>

        <div className="space-y-2">
          {(character.armor || []).map((a, idx) => (
            <div
              key={a.id || idx}
              className="flex items-center justify-between p-3 rounded-xl bg-[#FAF8F5] border border-[#E8E3DA] text-xs"
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleToggleEquipArmor(idx)}
                  className={`px-2.5 py-0.5 rounded-md text-[10px] font-medium transition-all ${
                    a.equipped
                      ? 'bg-stone-900 text-white'
                      : 'bg-white border border-[#DDD5C7] text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {a.equipped ? 'Equipped' : 'Packed'}
                </button>
                <span className="font-semibold text-stone-900">{a.name}</span>
                <span className="text-stone-600 font-mono">AC {a.ac}</span>
                <span className="text-stone-600 text-[10px]">{a.weight} lbs</span>
              </div>

              <button
                onClick={() => handleDeleteArmor(idx)}
                className="text-stone-600 hover:text-stone-900 transition-colors p-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Adventuring Gear List */}
      <div className="p-5 rounded-2xl bg-white border border-[#E5DFD5] space-y-3 shadow-sm">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-600 flex items-center gap-2">
            <Backpack className="w-4 h-4 text-stone-600" />
            <span>Adventuring Gear & Consumables</span>
          </h4>

          <button
            onClick={() => setIsAddingGear(!isAddingGear)}
            className="px-2.5 py-1 rounded-lg bg-[#FAF8F5] hover:bg-[#F2ECE3] border border-[#E0D9CE] text-stone-800 text-xs font-medium flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5 text-[#B85D36]" />
            <span>Add Item</span>
          </button>
        </div>

        {isAddingGear && (
          <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E5DFD5] flex items-center gap-2 flex-wrap animate-in fade-in">
            <input
              type="text"
              placeholder="Item Name (e.g. Silk Rope, Potion)"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              className="flex-1 min-w-[160px] px-3 py-1.5 bg-white border border-[#E5DFD5] rounded-lg text-xs text-stone-900 focus:outline-none focus:border-stone-400"
            />
            <input
              type="number"
              placeholder="Qty"
              value={newItemQty}
              onChange={(e) => setNewItemQty(e.target.value)}
              className="w-16 px-2 py-1.5 bg-white border border-[#E5DFD5] rounded-lg text-xs text-stone-900 text-center"
              min="1"
            />
            <input
              type="number"
              placeholder="Weight"
              value={newItemWeight}
              onChange={(e) => setNewItemWeight(e.target.value)}
              className="w-16 px-2 py-1.5 bg-white border border-[#E5DFD5] rounded-lg text-xs text-stone-900 text-center"
              min="0"
              step="0.5"
            />
            <button
              onClick={handleAddGear}
              className="px-3.5 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white font-medium text-xs shadow-sm transition-all"
            >
              Add
            </button>
          </div>
        )}

        <div className="divide-y divide-[#F0EBE1] max-h-80 overflow-y-auto">
          {(character.inventory || []).map((g) => (
            <div
              key={g.id}
              className="py-2.5 flex items-center justify-between text-xs hover:bg-[#FAF8F5] px-2 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="font-medium text-stone-900">{g.name}</span>
                <span className="text-[10px] text-stone-600">({g.weight * (g.quantity || 1)} lbs)</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-[#FAF8F5] px-1.5 py-0.5 rounded-md border border-[#E8E3DA]">
                  <button
                    onClick={() => handleAdjustGearQty(g.id, -1)}
                    className="text-stone-600 hover:text-stone-900 font-bold px-1"
                  >
                    -
                  </button>
                  <span className="font-mono font-semibold text-stone-900 px-1 tabular-nums">
                    {g.quantity}
                  </span>
                  <button
                    onClick={() => handleAdjustGearQty(g.id, 1)}
                    className="text-stone-600 hover:text-stone-900 font-bold px-1"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => handleDeleteGear(g.id)}
                  className="text-stone-600 hover:text-stone-900 transition-colors p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5e.tools Full Armory Modal */}
      <EquipmentArmoryModal
        isOpen={isArmoryOpen}
        onClose={() => setIsArmoryOpen(false)}
        character={character}
        onUpdateCharacter={onUpdateCharacter}
      />
    </div>
  );
};

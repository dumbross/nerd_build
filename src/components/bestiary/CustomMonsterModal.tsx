/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Plus, Trash2, Sparkles, Check } from 'lucide-react';
import { Monster, MonsterSize } from '../../types/monster';

interface CustomMonsterModalProps {
  isOpen: boolean;
  onClose: () => void;
  monsterToEdit?: Monster | null;
  onSaveMonster: (monster: Monster) => void;
}

export const CustomMonsterModal: React.FC<CustomMonsterModalProps> = ({
  isOpen,
  onClose,
  monsterToEdit,
  onSaveMonster,
}) => {
  const [name, setName] = useState(monsterToEdit?.name || '');
  const [size, setSize] = useState<MonsterSize>(monsterToEdit?.size || 'Medium');
  const [type, setType] = useState(monsterToEdit?.type || 'Monstrosity');
  const [alignment, setAlignment] = useState(monsterToEdit?.alignment || 'Neutral Evil');
  const [ac, setAc] = useState<number>(monsterToEdit?.ac || 15);
  const [acType, setAcType] = useState(monsterToEdit?.acType || 'Natural armor');
  const [hp, setHp] = useState<number>(monsterToEdit?.hp || 60);
  const [hpFormula, setHpFormula] = useState(monsterToEdit?.hpFormula || '8d8 + 24');
  const [speed, setSpeed] = useState(monsterToEdit?.speed || '30 ft.');
  const [cr, setCr] = useState(monsterToEdit?.cr || '3');
  const [xp, setXp] = useState<number>(monsterToEdit?.xp || 700);
  const [proficiencyBonus, setProficiencyBonus] = useState<number>(
    monsterToEdit?.proficiencyBonus || 2
  );

  // Abilities
  const [str, setStr] = useState<number>(monsterToEdit?.abilities.str || 16);
  const [dex, setDex] = useState<number>(monsterToEdit?.abilities.dex || 12);
  const [con, setCon] = useState<number>(monsterToEdit?.abilities.con || 16);
  const [int, setInt] = useState<number>(monsterToEdit?.abilities.int || 8);
  const [wis, setWis] = useState<number>(monsterToEdit?.abilities.wis || 12);
  const [cha, setCha] = useState<number>(monsterToEdit?.abilities.cha || 8);

  // Secondary
  const [savingThrows, setSavingThrows] = useState(monsterToEdit?.savingThrows || '');
  const [skills, setSkills] = useState(monsterToEdit?.skills || '');
  const [damageResistances, setDamageResistances] = useState(
    monsterToEdit?.damageResistances || ''
  );
  const [damageImmunities, setDamageImmunities] = useState(
    monsterToEdit?.damageImmunities || ''
  );
  const [conditionImmunities, setConditionImmunities] = useState(
    monsterToEdit?.conditionImmunities || ''
  );
  const [senses, setSenses] = useState(
    monsterToEdit?.senses || 'Darkvision 60 ft., passive Perception 11'
  );
  const [languages, setLanguages] = useState(monsterToEdit?.languages || 'Common');
  const [description, setDescription] = useState(monsterToEdit?.description || '');

  // Dynamic Traits & Actions
  const [traits, setTraits] = useState<{ name: string; desc: string }[]>(
    monsterToEdit?.traits || [
      { name: 'Keen Senses', desc: 'The creature has advantage on Wisdom (Perception) checks.' },
    ]
  );
  const [actions, setActions] = useState<
    {
      name: string;
      desc: string;
      attackBonus?: number;
      damageDice?: string;
      damageBonus?: number;
    }[]
  >(
    monsterToEdit?.actions || [
      {
        name: 'Multiattack',
        desc: 'The creature makes two melee attacks.',
      },
      {
        name: 'Claw',
        desc: 'Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 8 (1d8 + 4) slashing damage.',
        attackBonus: 5,
        damageDice: '1d8',
        damageBonus: 4,
      },
    ]
  );

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalMonster: Monster = {
      id: monsterToEdit?.id || `custom_m_${Date.now()}`,
      name: name.trim() || 'Custom Monster',
      source: 'Homebrew',
      size,
      type: type.trim() || 'Monstrosity',
      alignment: alignment.trim() || 'Neutral',
      ac: Number(ac) || 10,
      acType: acType.trim() || undefined,
      hp: Number(hp) || 10,
      hpFormula: hpFormula.trim() || '2d8',
      speed: speed.trim() || '30 ft.',
      abilities: {
        str: Number(str) || 10,
        dex: Number(dex) || 10,
        con: Number(con) || 10,
        int: Number(int) || 10,
        wis: Number(wis) || 10,
        cha: Number(cha) || 10,
      },
      savingThrows: savingThrows.trim() || undefined,
      skills: skills.trim() || undefined,
      damageResistances: damageResistances.trim() || undefined,
      damageImmunities: damageImmunities.trim() || undefined,
      conditionImmunities: conditionImmunities.trim() || undefined,
      senses: senses.trim() || 'passive Perception 10',
      languages: languages.trim() || '—',
      cr: cr.trim() || '1',
      xp: Number(xp) || 200,
      proficiencyBonus: Number(proficiencyBonus) || 2,
      traits: traits.filter((t) => t.name.trim()),
      actions: actions.filter((a) => a.name.trim()),
      description: description.trim() || undefined,
      isCustom: true,
    };

    onSaveMonster(finalMonster);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-900/40 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white border border-[#E5DFD5] rounded-2xl max-w-3xl w-full max-h-[90vh] shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8E3DA] bg-[#FBF9F5]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white border border-[#DDD5C7] flex items-center justify-center text-[#B85D36] shadow-sm">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-semibold text-stone-900">
                {monsterToEdit ? `Edit ${monsterToEdit.name}` : 'New Homebrew Monster'}
              </h3>
              <p className="text-xs text-stone-600">
                Craft a custom monster with complete 5e stats and Homebrewery styling
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

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
          {/* Identity */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-1">
              <label className="font-medium text-stone-700 block mb-1">Monster Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Revivisect"
                className="w-full px-3 py-1.5 rounded-lg border border-[#E5DFD5] bg-[#FAF8F5] focus:outline-none focus:border-stone-400"
              />
            </div>
            <div>
              <label className="font-medium text-stone-700 block mb-1">Size</label>
              <select
                value={size}
                onChange={(e) => setSize(e.target.value as MonsterSize)}
                className="w-full px-3 py-1.5 rounded-lg border border-[#E5DFD5] bg-[#FAF8F5] focus:outline-none"
              >
                <option value="Tiny">Tiny</option>
                <option value="Small">Small</option>
                <option value="Medium">Medium</option>
                <option value="Large">Large</option>
                <option value="Huge">Huge</option>
                <option value="Gargantuan">Gargantuan</option>
              </select>
            </div>
            <div>
              <label className="font-medium text-stone-700 block mb-1">Type</label>
              <input
                type="text"
                value={type}
                onChange={(e) => setType(e.target.value)}
                placeholder="e.g. Undead, Dragon, Monstrosity"
                className="w-full px-3 py-1.5 rounded-lg border border-[#E5DFD5] bg-[#FAF8F5] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="font-medium text-stone-700 block mb-1">Alignment</label>
              <input
                type="text"
                value={alignment}
                onChange={(e) => setAlignment(e.target.value)}
                placeholder="e.g. Neutral Evil, Unaligned"
                className="w-full px-3 py-1.5 rounded-lg border border-[#E5DFD5] bg-[#FAF8F5] focus:outline-none"
              />
            </div>
            <div>
              <label className="font-medium text-stone-700 block mb-1">Challenge Rating (CR)</label>
              <input
                type="text"
                value={cr}
                onChange={(e) => setCr(e.target.value)}
                placeholder="e.g. 11, 1/4, 3"
                className="w-full px-3 py-1.5 rounded-lg border border-[#E5DFD5] bg-[#FAF8F5] focus:outline-none"
              />
            </div>
            <div>
              <label className="font-medium text-stone-700 block mb-1">XP Value</label>
              <input
                type="number"
                value={xp}
                onChange={(e) => setXp(Number(e.target.value))}
                className="w-full px-3 py-1.5 rounded-lg border border-[#E5DFD5] bg-[#FAF8F5] focus:outline-none"
              />
            </div>
          </div>

          {/* Vitals */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 border-t border-[#E8E3DA] pt-4">
            <div>
              <label className="font-medium text-stone-700 block mb-1">Armor Class</label>
              <input
                type="number"
                value={ac}
                onChange={(e) => setAc(Number(e.target.value))}
                className="w-full px-3 py-1.5 rounded-lg border border-[#E5DFD5] bg-[#FAF8F5] focus:outline-none"
              />
            </div>
            <div>
              <label className="font-medium text-stone-700 block mb-1">AC Type</label>
              <input
                type="text"
                value={acType}
                onChange={(e) => setAcType(e.target.value)}
                placeholder="Natural armor"
                className="w-full px-3 py-1.5 rounded-lg border border-[#E5DFD5] bg-[#FAF8F5] focus:outline-none"
              />
            </div>
            <div>
              <label className="font-medium text-stone-700 block mb-1">Hit Points</label>
              <input
                type="number"
                value={hp}
                onChange={(e) => setHp(Number(e.target.value))}
                className="w-full px-3 py-1.5 rounded-lg border border-[#E5DFD5] bg-[#FAF8F5] focus:outline-none"
              />
            </div>
            <div>
              <label className="font-medium text-stone-700 block mb-1">HP Formula</label>
              <input
                type="text"
                value={hpFormula}
                onChange={(e) => setHpFormula(e.target.value)}
                placeholder="20d10 + 40"
                className="w-full px-3 py-1.5 rounded-lg border border-[#E5DFD5] bg-[#FAF8F5] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="font-medium text-stone-700 block mb-1">Speed</label>
            <input
              type="text"
              value={speed}
              onChange={(e) => setSpeed(e.target.value)}
              placeholder="e.g. 40 ft., fly 60 ft."
              className="w-full px-3 py-1.5 rounded-lg border border-[#E5DFD5] bg-[#FAF8F5] focus:outline-none"
            />
          </div>

          {/* Ability Scores */}
          <div className="border-t border-[#E8E3DA] pt-4">
            <label className="font-medium text-stone-800 block mb-2">Ability Scores</label>
            <div className="grid grid-cols-6 gap-2 text-center">
              {[
                { label: 'STR', val: str, set: setStr },
                { label: 'DEX', val: dex, set: setDex },
                { label: 'CON', val: con, set: setCon },
                { label: 'INT', val: int, set: setInt },
                { label: 'WIS', val: wis, set: setWis },
                { label: 'CHA', val: cha, set: setCha },
              ].map((s) => (
                <div key={s.label} className="p-2 bg-[#FAF8F5] rounded-lg border border-[#E5DFD5]">
                  <span className="block font-bold text-stone-700 text-[11px] mb-1">{s.label}</span>
                  <input
                    type="number"
                    value={s.val}
                    onChange={(e) => s.set(Number(e.target.value))}
                    className="w-full text-center py-1 rounded border border-[#DDD5C7] bg-white font-semibold"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Secondary stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 border-t border-[#E8E3DA] pt-4">
            <div>
              <label className="font-medium text-stone-700 block mb-1">Saving Throws</label>
              <input
                type="text"
                value={savingThrows}
                onChange={(e) => setSavingThrows(e.target.value)}
                placeholder="e.g. STR +9, CON +6"
                className="w-full px-3 py-1.5 rounded-lg border border-[#E5DFD5] bg-[#FAF8F5] focus:outline-none"
              />
            </div>
            <div>
              <label className="font-medium text-stone-700 block mb-1">Skills</label>
              <input
                type="text"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="e.g. Athletics +9, Perception +4"
                className="w-full px-3 py-1.5 rounded-lg border border-[#E5DFD5] bg-[#FAF8F5] focus:outline-none"
              />
            </div>
            <div>
              <label className="font-medium text-stone-700 block mb-1">Damage Resistances</label>
              <input
                type="text"
                value={damageResistances}
                onChange={(e) => setDamageResistances(e.target.value)}
                placeholder="e.g. Necrotic, Psychic"
                className="w-full px-3 py-1.5 rounded-lg border border-[#E5DFD5] bg-[#FAF8F5] focus:outline-none"
              />
            </div>
            <div>
              <label className="font-medium text-stone-700 block mb-1">Damage Immunities</label>
              <input
                type="text"
                value={damageImmunities}
                onChange={(e) => setDamageImmunities(e.target.value)}
                placeholder="e.g. Poison, Fire"
                className="w-full px-3 py-1.5 rounded-lg border border-[#E5DFD5] bg-[#FAF8F5] focus:outline-none"
              />
            </div>
            <div>
              <label className="font-medium text-stone-700 block mb-1">Senses</label>
              <input
                type="text"
                value={senses}
                onChange={(e) => setSenses(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-[#E5DFD5] bg-[#FAF8F5] focus:outline-none"
              />
            </div>
            <div>
              <label className="font-medium text-stone-700 block mb-1">Languages</label>
              <input
                type="text"
                value={languages}
                onChange={(e) => setLanguages(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-[#E5DFD5] bg-[#FAF8F5] focus:outline-none"
              />
            </div>
          </div>

          {/* Traits */}
          <div className="border-t border-[#E8E3DA] pt-4 space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-medium text-stone-800">Special Traits</label>
              <button
                type="button"
                onClick={() => setTraits([...traits, { name: 'New Trait', desc: '' }])}
                className="text-[11px] font-medium text-[#B85D36] hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Trait</span>
              </button>
            </div>
            {traits.map((t, i) => (
              <div key={i} className="p-3 bg-[#FAF8F5] rounded-xl border border-[#E5DFD5] space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <input
                    type="text"
                    value={t.name}
                    onChange={(e) => {
                      const updated = [...traits];
                      updated[i].name = e.target.value;
                      setTraits(updated);
                    }}
                    placeholder="Trait Name"
                    className="flex-1 font-semibold px-2.5 py-1 rounded border border-[#E5DFD5] bg-white text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => setTraits(traits.filter((_, idx) => idx !== i))}
                    className="text-stone-500 hover:text-red-600 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <textarea
                  rows={2}
                  value={t.desc}
                  onChange={(e) => {
                    const updated = [...traits];
                    updated[i].desc = e.target.value;
                    setTraits(updated);
                  }}
                  placeholder="Trait rule description..."
                  className="w-full px-2.5 py-1.5 rounded border border-[#E5DFD5] bg-white text-xs leading-relaxed"
                />
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="border-t border-[#E8E3DA] pt-4 space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-medium text-stone-800">Actions & Attacks</label>
              <button
                type="button"
                onClick={() =>
                  setActions([
                    ...actions,
                    {
                      name: 'Attack',
                      desc: 'Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 7 (1d8 + 3) slashing damage.',
                      attackBonus: 5,
                      damageDice: '1d8',
                      damageBonus: 3,
                    },
                  ])
                }
                className="text-[11px] font-medium text-[#B85D36] hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Action</span>
              </button>
            </div>
            {actions.map((a, i) => (
              <div key={i} className="p-3 bg-[#FAF8F5] rounded-xl border border-[#E5DFD5] space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <input
                    type="text"
                    value={a.name}
                    onChange={(e) => {
                      const updated = [...actions];
                      updated[i].name = e.target.value;
                      setActions(updated);
                    }}
                    placeholder="Action Name (e.g. Claw, Multiattack)"
                    className="flex-1 font-semibold px-2.5 py-1 rounded border border-[#E5DFD5] bg-white text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => setActions(actions.filter((_, idx) => idx !== i))}
                    className="text-stone-500 hover:text-red-600 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-[10px] text-stone-500 block">Attack Bonus (+)</label>
                    <input
                      type="number"
                      value={a.attackBonus ?? ''}
                      onChange={(e) => {
                        const updated = [...actions];
                        updated[i].attackBonus = e.target.value ? Number(e.target.value) : undefined;
                        setActions(updated);
                      }}
                      placeholder="e.g. 5"
                      className="w-full px-2 py-1 rounded border border-[#E5DFD5] bg-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-stone-500 block">Damage Dice</label>
                    <input
                      type="text"
                      value={a.damageDice || ''}
                      onChange={(e) => {
                        const updated = [...actions];
                        updated[i].damageDice = e.target.value;
                        setActions(updated);
                      }}
                      placeholder="e.g. 2d6"
                      className="w-full px-2 py-1 rounded border border-[#E5DFD5] bg-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-stone-500 block">Damage Bonus (+)</label>
                    <input
                      type="number"
                      value={a.damageBonus ?? ''}
                      onChange={(e) => {
                        const updated = [...actions];
                        updated[i].damageBonus = e.target.value ? Number(e.target.value) : undefined;
                        setActions(updated);
                      }}
                      placeholder="e.g. 3"
                      className="w-full px-2 py-1 rounded border border-[#E5DFD5] bg-white text-xs"
                    />
                  </div>
                </div>
                <textarea
                  rows={2}
                  value={a.desc}
                  onChange={(e) => {
                    const updated = [...actions];
                    updated[i].desc = e.target.value;
                    setActions(updated);
                  }}
                  placeholder="Full action text..."
                  className="w-full px-2.5 py-1.5 rounded border border-[#E5DFD5] bg-white text-xs leading-relaxed"
                />
              </div>
            ))}
          </div>

          {/* Description Lore */}
          <div className="border-t border-[#E8E3DA] pt-4">
            <label className="font-medium text-stone-800 block mb-1">
              Description & Creature Lore
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Sensory description, lore, ecology, behavior..."
              className="w-full px-3 py-2 rounded-lg border border-[#E5DFD5] bg-[#FAF8F5] focus:outline-none"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E8E3DA]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-stone-700 hover:bg-stone-100 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-semibold shadow-sm flex items-center gap-1.5 transition-all"
            >
              <Check className="w-4 h-4" />
              <span>Save Monster</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

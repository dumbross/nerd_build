/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Upload, CheckCircle, AlertCircle, FileCode, Sparkles } from 'lucide-react';
import { Character } from '../types/character';
import { render5eToolsEntries, clean5eToolsText } from '../utils/5eParser';
import { parse5eToolsBestiaryJson } from '../utils/fiveToolsMonsterParser';
import { saveCustomMonster } from '../utils/monsterStorage';

interface ToolsImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeCharacter: Character;
  onUpdateCharacter: (char: Character) => void;
  onImportNewCharacter: (char: Character) => void;
}

export const ToolsImportModal: React.FC<ToolsImportModalProps> = ({
  isOpen,
  onClose,
  activeCharacter,
  onUpdateCharacter,
  onImportNewCharacter,
}) => {
  const [jsonText, setJsonText] = useState('');
  const [importStatus, setImportStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  if (!isOpen) return null;

  const handleProcessJson = () => {
    setImportStatus(null);
    if (!jsonText.trim()) {
      setImportStatus({ type: 'error', message: 'Please paste a 5e.tools JSON snippet or upload a file first.' });
      return;
    }

    try {
      const parsed = JSON.parse(jsonText);

      // Check if it is a full character object
      if (parsed.name && parsed.className && parsed.baseAbilities) {
        onImportNewCharacter({
          ...parsed,
          id: `char_imported_${Date.now()}`,
          updatedAt: new Date().toISOString(),
        });
        setImportStatus({
          type: 'success',
          message: `Successfully imported character "${parsed.name}" (${parsed.className} ${parsed.level || 1})!`,
        });
        setTimeout(() => onClose(), 1200);
        return;
      }

      // Check if it's a 5e.tools monster or bestiary
      if (parsed.monster || (parsed.name && (parsed.cr !== undefined || (parsed.hp && typeof parsed.hp === 'object')))) {
        const monsters = parse5eToolsBestiaryJson(jsonText);
        monsters.forEach((m) => saveCustomMonster(m));
        setImportStatus({
          type: 'success',
          message: `Integrated ${monsters.length} 5e.tools creature(s) into the Bestiary! Switch to Monster Focus to view their stat blocks.`,
        });
        return;
      }

      // Check if it's a 5e.tools spell array or single spell object
      const spells = Array.isArray(parsed) ? parsed : parsed.spell || [parsed];
      if (spells.length > 0 && spells[0].time && spells[0].range) {
        let addedCount = 0;
        const newSpells = [...(activeCharacter.spells || [])];

        spells.forEach((sp: any) => {
          if (!newSpells.some((existing) => existing.name.toLowerCase() === sp.name.toLowerCase())) {
            newSpells.push({
              id: `sp_import_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
              name: sp.name,
              level: sp.level ?? 0,
              school: sp.school ?? 'Evocation',
              castingTime: `${sp.time?.[0]?.number || 1} ${sp.time?.[0]?.unit || 'action'}`,
              range: `${sp.range?.distance?.amount || ''} ${sp.range?.distance?.type || sp.range?.type || 'Self'}`,
              components: Object.keys(sp.components || {}).join(', ').toUpperCase() || 'V, S',
              duration: `${sp.duration?.[0]?.duration?.amount || ''} ${sp.duration?.[0]?.duration?.type || sp.duration?.[0]?.type || 'Instant'}`,
              description: render5eToolsEntries(sp.entries),
              prepared: true,
            });
            addedCount++;
          }
        });

        onUpdateCharacter({
          ...activeCharacter,
          spells: newSpells,
          updatedAt: new Date().toISOString(),
        });

        setImportStatus({
          type: 'success',
          message: `Integrated ${addedCount} 5e.tools spell(s) into ${activeCharacter.name}'s grimoire!`,
        });
        return;
      }

      // Check if it's a 5e.tools item or weapon
      const items = Array.isArray(parsed) ? parsed : parsed.item || [parsed];
      if (items.length > 0 && (items[0].weaponCategory || items[0].ac || items[0].dmg1)) {
        let addedWeapons = 0;
        const newWeapons = [...(activeCharacter.weapons || [])];

        items.forEach((it: any) => {
          newWeapons.push({
            id: `w_import_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
            name: it.name,
            category: (it.weaponCategory || 'Simple Melee') as any,
            damage: it.dmg1 || '1d6',
            damageType: it.dmgType === 'S' ? 'slashing' : it.dmgType === 'P' ? 'piercing' : 'bludgeoning',
            weight: it.weight || 2,
            cost: it.value ? `${it.value / 100} gp` : '10 gp',
            properties: it.property || [],
            equipped: true,
          });
          addedWeapons++;
        });

        onUpdateCharacter({
          ...activeCharacter,
          weapons: newWeapons,
          updatedAt: new Date().toISOString(),
        });

        setImportStatus({
          type: 'success',
          message: `Added ${addedWeapons} 5e.tools item(s) to ${activeCharacter.name}'s armory!`,
        });
        return;
      }

      // Check if it's a class or race feature
      if (parsed.name && (parsed.entries || parsed.entry)) {
        const featureName = parsed.name;
        const featureDesc = render5eToolsEntries(parsed.entries || parsed.entry);

        const newFeat = {
          id: `feat_import_${Date.now()}`,
          name: featureName,
          source: 'Custom' as const,
          description: clean5eToolsText(featureDesc),
        };

        onUpdateCharacter({
          ...activeCharacter,
          features: [...(activeCharacter.features || []), newFeat],
          updatedAt: new Date().toISOString(),
        });

        setImportStatus({
          type: 'success',
          message: `Added feature "${featureName}" to ${activeCharacter.name}!`,
        });
        return;
      }

      setImportStatus({
        type: 'error',
        message: 'JSON parsed, but did not match recognized 5e.tools spell, item, character, or feature schema.',
      });
    } catch (e: any) {
      setImportStatus({
        type: 'error',
        message: `Invalid JSON syntax: ${e.message}`,
      });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setJsonText(content);
    };
    reader.readAsText(file);
  };

  const handleSample5eSpell = () => {
    const sample = {
      name: "Tasha's Caustic Brew",
      source: "TCE",
      page: 115,
      level: 1,
      school: "V",
      time: [{ number: 1, unit: "action" }],
      range: { type: "line", distance: { type: "feet", amount: 30 } },
      components: { v: true, s: true, m: "a bit of rotten food" },
      duration: [{ type: "timed", duration: { type: "minute", amount: 1 }, concentration: true }],
      entries: [
        "A stream of acid emanates from you in a line 30 feet long and 5 feet wide in a direction you choose. Each creature in the line must succeed on a Dexterity saving throw or be covered in acid for the duration or until a creature uses its action to scrape or wash the acid off itself or another creature. A creature covered in the acid takes {@damage 2d4} acid damage at the start of each of its turns."
      ]
    };
    setJsonText(JSON.stringify(sample, null, 2));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white border border-[#E5DFD5] rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8E3DA] bg-[#FBF9F5]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white border border-[#DDD5C7] flex items-center justify-center text-[#B85D36] shadow-sm">
              <Upload className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-semibold text-stone-900">
                5e.tools Data Integration & Importer
              </h3>
              <p className="text-xs text-stone-600">
                Import 5e.tools spells, items, features, or character JSON
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

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between text-xs">
            <span className="text-stone-600 font-medium">
              Paste 5e.tools JSON or upload a `.json` file:
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleSample5eSpell}
                className="text-[#B85D36] hover:underline flex items-center gap-1 text-[11px] font-medium"
              >
                <Sparkles className="w-3 h-3" />
                <span>Load Sample Spell</span>
              </button>
              <label className="cursor-pointer text-stone-700 hover:text-stone-900 flex items-center gap-1 text-[11px] bg-white px-2.5 py-1 rounded-lg border border-[#DDD5C7] shadow-sm">
                <FileCode className="w-3 h-3" />
                <span>Upload JSON</span>
                <input
                  type="file"
                  accept=".json,application/json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <textarea
            value={jsonText}
            onChange={(e) => setJsonText(e.target.value)}
            placeholder='Paste 5e.tools JSON here (e.g. {"name": "...", "entries": [...], ...})'
            className="w-full h-56 p-3 bg-[#FAF8F5] border border-[#E5DFD5] rounded-xl text-xs font-mono text-stone-900 placeholder-stone-600 focus:outline-none focus:border-stone-400 leading-relaxed resize-none"
          />

          {importStatus && (
            <div
              className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                importStatus.type === 'success'
                  ? 'bg-emerald-50 border border-emerald-200 text-[#2E4A3E]'
                  : 'bg-rose-50 border border-rose-200 text-rose-700'
              }`}
            >
              {importStatus.type === 'success' ? (
                <CheckCircle className="w-4 h-4 shrink-0 text-[#2E4A3E]" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-700" />
              )}
              <span>{importStatus.message}</span>
            </div>
          )}

          <div className="flex items-center justify-between pt-2 border-t border-[#E8E3DA]">
            <div className="text-[11px] text-stone-600">
              Target Hero: <span className="font-semibold text-stone-900">{activeCharacter.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 transition-colors"
              >
                Close
              </button>
              <button
                onClick={handleProcessJson}
                className="px-5 py-2 text-xs font-semibold rounded-xl bg-stone-900 hover:bg-stone-800 text-white transition-all shadow-sm flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                <span>Process & Integrate Data</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

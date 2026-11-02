/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Header } from './components/Header';
import { SheetView } from './components/sheet/SheetView';
import { BuilderView } from './components/builder/BuilderView';
import { DiceRollerModal } from './components/DiceRollerModal';
import { ToolsCompendiumModal } from './components/ToolsCompendiumModal';
import { ToolsImportModal } from './components/ToolsImportModal';
import { CharacterSelectorModal } from './components/CharacterSelectorModal';
import { Character } from './types/character';
import {
  loadSavedCharacters,
  saveCharacters,
  getActiveCharacterId,
  setActiveCharacterId,
  createBlankCharacter,
} from './utils/storage';
import { DiceRollResult, rollDice } from './utils/diceRoller';
import { generateFillablePdf, downloadPdf } from './utils/pdfExport';
import { Dices, CheckCircle, Sparkles, BookOpen } from 'lucide-react';

export default function App() {
  const [characters, setCharacters] = useState<Character[]>(() => loadSavedCharacters());
  const [activeId, setActiveId] = useState<string>(() => getActiveCharacterId());
  const [activeTab, setActiveTab] = useState<'sheet' | 'builder' | 'compendium'>('sheet');

  // Modals
  const [isCharModalOpen, setIsCharModalOpen] = useState(false);
  const [isDiceModalOpen, setIsDiceModalOpen] = useState(false);
  const [isCompendiumOpen, setIsCompendiumOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // Dice Rolls & Notifications
  const [recentRolls, setRecentRolls] = useState<DiceRollResult[]>([]);
  const [activeToast, setActiveToast] = useState<{ message: string; sub?: string } | null>(null);
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  // Active Character resolution
  const activeCharacter =
    characters.find((c) => c.id === activeId) || characters[0] || createBlankCharacter();

  // Save changes to localStorage
  useEffect(() => {
    saveCharacters(characters);
  }, [characters]);

  useEffect(() => {
    setActiveCharacterId(activeId);
  }, [activeId]);

  const handleUpdateCharacter = (updated: Character) => {
    setCharacters((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
  };

  const handleSelectCharacter = (id: string) => {
    setActiveId(id);
  };

  const handleCreateNewCharacter = () => {
    const newChar = createBlankCharacter();
    setCharacters((prev) => [newChar, ...prev]);
    setActiveId(newChar.id);
    setActiveTab('builder');
  };

  const handleCloneCharacter = (char: Character) => {
    const clone: Character = {
      ...char,
      id: `char_${Date.now()}`,
      name: `${char.name} (Copy)`,
      updatedAt: new Date().toISOString(),
    };
    setCharacters((prev) => [clone, ...prev]);
    setActiveId(clone.id);
  };

  const handleDeleteCharacter = (id: string) => {
    if (characters.length <= 1) return;
    const remaining = characters.filter((c) => c.id !== id);
    setCharacters(remaining);
    if (activeId === id) {
      setActiveId(remaining[0].id);
    }
  };

  // Quick Roll triggers
  const handleQuickRoll = (
    sides: number,
    count: number = 1,
    modifier: number = 0,
    label: string = 'Roll'
  ) => {
    const result = rollDice(sides, count, modifier, label);
    setRecentRolls((prev) => [result, ...prev.slice(0, 29)]);

    // Trigger visual toast
    setActiveToast({
      message: `${label}: ${result.total}`,
      sub: `${result.formula} -> [${result.rolls.join(', ')}]`,
    });
    setTimeout(() => setActiveToast(null), 3000);

    if (result.isCrit) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
      });
    }
  };

  const handleAddCustomRoll = (roll: DiceRollResult) => {
    setRecentRolls((prev) => [roll, ...prev.slice(0, 29)]);
    if (roll.isCrit) {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.8 },
      });
    }
  };

  // Export Fillable PDF
  const handleExportPdf = async () => {
    try {
      setIsExportingPdf(true);
      const pdfBytes = await generateFillablePdf(activeCharacter);
      const filename = `${activeCharacter.name.toLowerCase().replace(/[^a-z0-9]/gi, '_')}_fillable_sheet.pdf`;
      downloadPdf(pdfBytes, filename);

      confetti({
        particleCount: 60,
        spread: 80,
        origin: { y: 0.5 },
      });

      setActiveToast({
        message: 'Fillable PDF Exported!',
        sub: `Saved as ${filename}`,
      });
      setTimeout(() => setActiveToast(null), 3500);
    } catch (err: any) {
      console.error('Failed to export PDF', err);
      alert('Error generating PDF: ' + err.message);
    } finally {
      setIsExportingPdf(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-900 flex flex-col font-sans selection:bg-[#EBD6CA] selection:text-stone-900">
      {/* App Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeCharacter={activeCharacter}
        onOpenCharacterModal={() => setIsCharModalOpen(true)}
        onOpenDiceRoller={() => setIsDiceModalOpen(true)}
        onOpenCompendium={() => setIsCompendiumOpen(true)}
        onOpenImportModal={() => setIsImportModalOpen(true)}
        onExportPdf={handleExportPdf}
        isExportingPdf={isExportingPdf}
        onNewCharacter={handleCreateNewCharacter}
      />

      {/* Main View Area */}
      <main className="flex-1 pb-16">
        {activeTab === 'sheet' && (
          <SheetView
            character={activeCharacter}
            onUpdateCharacter={handleUpdateCharacter}
            onQuickRoll={handleQuickRoll}
            onOpenCompendium={() => setIsCompendiumOpen(true)}
          />
        )}

        {activeTab === 'builder' && (
          <BuilderView
            character={activeCharacter}
            onUpdateCharacter={handleUpdateCharacter}
            onSwitchToSheet={() => setActiveTab('sheet')}
            onExportPdf={handleExportPdf}
            isExportingPdf={isExportingPdf}
          />
        )}

        {activeTab === 'compendium' && (
          <div className="max-w-4xl mx-auto px-4 py-12">
            <div className="p-10 rounded-2xl bg-white border border-[#E5DFD5] shadow-sm text-center space-y-5">
              <div className="w-12 h-12 rounded-full bg-[#F5EFE6] border border-[#DDD5C7] text-[#B85D36] flex items-center justify-center mx-auto">
                <BookOpen className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h2 className="font-serif text-3xl font-semibold text-stone-900 tracking-tight">
                  5e.tools Data Compendium
                </h2>
                <p className="text-sm text-stone-600 max-w-md mx-auto">
                  Direct access to complete SRD and 5e.tools rules, lineages, subclasses, spells, and equipment.
                </p>
              </div>
              <div className="pt-2">
                <button
                  onClick={() => setIsCompendiumOpen(true)}
                  className="px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-medium text-xs inline-flex items-center gap-2 shadow-sm transition-all"
                >
                  <Sparkles className="w-4 h-4 text-[#EBD6CA]" />
                  <span>Open Interactive Compendium</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Floating Quick Dice Button */}
      <div className="fixed bottom-6 right-6 z-30">
        <button
          onClick={() => setIsDiceModalOpen(true)}
          className="h-12 w-12 rounded-full bg-white hover:bg-[#FDFBF7] text-stone-800 border border-[#DDD5C7] shadow-lg hover:shadow-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95 group"
          title="Open Dice Roller (d20, d12, d10, d8, d6, d4, d100)"
        >
          <Dices className="w-5 h-5 text-[#B85D36] transition-transform group-hover:rotate-12" />
        </button>
      </div>

      {/* Quick Roll Toast Notification */}
      {activeToast && (
        <div className="fixed bottom-6 left-6 z-50 bg-white border border-[#E0D9CE] rounded-xl px-4 py-3 shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom duration-200">
          <div className="w-7 h-7 rounded-lg bg-[#F5EFE6] text-[#B85D36] flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-semibold text-stone-900">{activeToast.message}</div>
            {activeToast.sub && (
              <div className="text-[11px] text-stone-600 font-mono">{activeToast.sub}</div>
            )}
          </div>
        </div>
      )}

      {/* Modals */}
      <CharacterSelectorModal
        isOpen={isCharModalOpen}
        onClose={() => setIsCharModalOpen(false)}
        characters={characters}
        activeCharacterId={activeCharacter.id}
        onSelectCharacter={handleSelectCharacter}
        onCreateNew={handleCreateNewCharacter}
        onCloneCharacter={handleCloneCharacter}
        onDeleteCharacter={handleDeleteCharacter}
      />

      <DiceRollerModal
        isOpen={isDiceModalOpen}
        onClose={() => setIsDiceModalOpen(false)}
        recentRolls={recentRolls}
        onAddRoll={handleAddCustomRoll}
        onClearHistory={() => setRecentRolls([])}
      />

      <ToolsCompendiumModal
        isOpen={isCompendiumOpen}
        onClose={() => setIsCompendiumOpen(false)}
        activeCharacter={activeCharacter}
        onUpdateCharacter={handleUpdateCharacter}
      />

      <ToolsImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        activeCharacter={activeCharacter}
        onUpdateCharacter={handleUpdateCharacter}
        onImportNewCharacter={(newChar) => {
          setCharacters((prev) => [newChar, ...prev]);
          setActiveId(newChar.id);
        }}
      />
    </div>
  );
}

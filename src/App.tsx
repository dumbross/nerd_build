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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
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
          <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-4">
              <BookOpen className="w-12 h-12 text-amber-400 mx-auto" />
              <h2 className="font-serif text-2xl font-bold text-slate-100">
                5e.tools Data Compendium
              </h2>
              <p className="text-sm text-slate-400 max-w-lg mx-auto">
                Explore races, classes, backgrounds, feats, spells, and equipment with full 5e.tools data schemas and direct character sheet integration.
              </p>
              <button
                onClick={() => setIsCompendiumOpen(true)}
                className="px-6 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-450 text-slate-950 font-bold text-xs inline-flex items-center gap-2 transition-all shadow-md shadow-amber-500/20"
              >
                <span>Launch Interactive Compendium</span>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Floating Quick Dice Button */}
      <div className="fixed bottom-6 right-6 z-30">
        <button
          onClick={() => setIsDiceModalOpen(true)}
          className="w-13 h-13 rounded-full bg-gradient-to-tr from-amber-600 to-amber-400 hover:from-amber-500 hover:to-amber-300 text-slate-950 shadow-xl shadow-amber-500/25 flex items-center justify-center transition-all hover:scale-105 active:scale-95 group"
          title="Open Dice Roller (d20, d12, d10, d8, d6, d4, d100)"
        >
          <Dices className="w-6 h-6 transition-transform group-hover:rotate-12" />
        </button>
      </div>

      {/* Quick Roll Toast Notification */}
      {activeToast && (
        <div className="fixed bottom-6 left-6 z-50 bg-slate-900 border border-amber-500/50 rounded-xl px-4 py-3 shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom duration-200">
          <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-100">{activeToast.message}</div>
            {activeToast.sub && (
              <div className="text-[11px] text-slate-400 font-mono">{activeToast.sub}</div>
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

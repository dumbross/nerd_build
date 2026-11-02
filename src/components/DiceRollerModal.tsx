/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, RotateCcw, Sparkles, Skull, Dices } from 'lucide-react';
import { DiceRollResult, rollDice, roll4d6DropLowest } from '../utils/diceRoller';

interface DiceRollerModalProps {
  isOpen: boolean;
  onClose: () => void;
  recentRolls: DiceRollResult[];
  onAddRoll: (roll: DiceRollResult) => void;
  onClearHistory: () => void;
}

const DIE_TYPES = [
  { sides: 4, label: 'd4' },
  { sides: 6, label: 'd6' },
  { sides: 8, label: 'd8' },
  { sides: 10, label: 'd10' },
  { sides: 12, label: 'd12' },
  { sides: 20, label: 'd20' },
  { sides: 100, label: 'd100' },
];

export const DiceRollerModal: React.FC<DiceRollerModalProps> = ({
  isOpen,
  onClose,
  recentRolls,
  onAddRoll,
  onClearHistory,
}) => {
  const [modifier, setModifier] = useState<number>(0);
  const [count, setCount] = useState<number>(1);
  const [advMode, setAdvMode] = useState<'adv' | 'dis' | null>(null);
  const [isRolling, setIsRolling] = useState(false);

  if (!isOpen) return null;

  const handleRoll = (sides: number) => {
    setIsRolling(true);
    setTimeout(() => {
      const result = rollDice(sides, count, modifier, `Custom ${count}d${sides}`, advMode);
      onAddRoll(result);
      setIsRolling(false);
    }, 120);
  };

  const handle4d6 = () => {
    setIsRolling(true);
    setTimeout(() => {
      const { rolls, dropped, total } = roll4d6DropLowest();
      const result: DiceRollResult = {
        id: `roll_${Date.now()}`,
        label: 'Ability Score (4d6 Drop Lowest)',
        formula: `[${rolls.join(', ')}] drop ${dropped}`,
        diceCount: 4,
        diceSides: 6,
        rolls,
        modifier: 0,
        total,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      };
      onAddRoll(result);
      setIsRolling(false);
    }, 120);
  };

  const latestRoll = recentRolls[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white border border-[#E5DFD5] rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8E3DA] bg-[#FBF9F5]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white border border-[#DDD5C7] flex items-center justify-center text-[#B85D36] shadow-sm">
              <Dices className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-base font-semibold text-stone-900">
                Interactive Dice Roller
              </h3>
              <p className="text-[11px] text-stone-600">Standard polyhedral dice with advantage & modifiers</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 overflow-y-auto">
          {/* Latest Roll Display Hero */}
          {latestRoll && (
            <div
              className={`p-5 rounded-2xl border text-center transition-all shadow-sm ${
                latestRoll.isCrit
                  ? 'bg-[#FAF8F5] border-[#B85D36] text-stone-900'
                  : latestRoll.isNat1
                  ? 'bg-rose-50 border-rose-300 text-stone-900'
                  : 'bg-[#FAF8F5] border-[#E8E3DA] text-stone-900'
              }`}
            >
              <div className="text-xs font-semibold uppercase tracking-wider text-stone-600 flex items-center justify-center gap-1.5">
                {latestRoll.label}
                {latestRoll.isCrit && <Sparkles className="w-3.5 h-3.5 text-[#B85D36] inline" />}
                {latestRoll.isNat1 && <Skull className="w-3.5 h-3.5 text-rose-600 inline" />}
              </div>

              <div className="text-5xl font-mono font-bold tracking-tight my-2 tabular-nums">
                {latestRoll.total}
              </div>

              <div className="text-xs text-stone-600 font-mono">
                {latestRoll.formula}
                {latestRoll.rolls.length > 0 && ` -> [${latestRoll.rolls.join(', ')}]`}
                {latestRoll.secondRoll !== undefined && ` vs [${latestRoll.secondRoll}]`}
                {latestRoll.modifier !== 0 && ` + (${latestRoll.modifier})`}
              </div>

              {latestRoll.isCrit && (
                <div className="text-xs font-bold text-[#B85D36] mt-2 uppercase tracking-wider">
                  Critical Hit · Natural 20
                </div>
              )}
              {latestRoll.isNat1 && (
                <div className="text-xs font-bold text-rose-700 mt-2 uppercase tracking-wider">
                  Critical Miss · Natural 1
                </div>
              )}
            </div>
          )}

          {/* Quick Dice Bar */}
          <div>
            <div className="text-xs font-semibold text-stone-600 uppercase tracking-wider mb-2">
              Select Die to Roll
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
              {DIE_TYPES.map((die) => (
                <button
                  key={die.sides}
                  onClick={() => handleRoll(die.sides)}
                  disabled={isRolling}
                  className="py-3 px-2 rounded-xl border border-[#E5DFD5] bg-[#FAF8F5] hover:bg-stone-900 hover:text-white hover:border-stone-900 transition-all flex flex-col items-center justify-center gap-1 active:scale-95 shadow-sm text-stone-900"
                >
                  <span className="font-serif font-bold text-base">{die.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Controls: Modifiers & Count & Advantage */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-[#FAF8F5] rounded-xl border border-[#E8E3DA]">
            {/* Number of Dice */}
            <div>
              <label className="text-[11px] font-semibold text-stone-700 block mb-1">
                Number of Dice
              </label>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCount((c) => Math.max(1, c - 1))}
                  className="w-7 h-7 rounded-lg bg-white hover:bg-stone-100 text-stone-800 border border-[#DDD5C7] font-semibold text-sm shadow-sm"
                >
                  -
                </button>
                <div className="flex-1 text-center font-mono font-bold text-xs bg-white py-1 rounded-lg border border-[#DDD5C7] tabular-nums text-stone-900">
                  {count}
                </div>
                <button
                  onClick={() => setCount((c) => Math.min(20, c + 1))}
                  className="w-7 h-7 rounded-lg bg-white hover:bg-stone-100 text-stone-800 border border-[#DDD5C7] font-semibold text-sm shadow-sm"
                >
                  +
                </button>
              </div>
            </div>

            {/* Modifier */}
            <div>
              <label className="text-[11px] font-semibold text-stone-700 block mb-1">
                Modifier (+/-)
              </label>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setModifier((m) => m - 1)}
                  className="w-7 h-7 rounded-lg bg-white hover:bg-stone-100 text-stone-800 border border-[#DDD5C7] font-semibold text-sm shadow-sm"
                >
                  -
                </button>
                <div className="flex-1 text-center font-mono font-bold text-xs bg-white py-1 rounded-lg border border-[#DDD5C7] tabular-nums text-stone-900">
                  {modifier >= 0 ? `+${modifier}` : modifier}
                </div>
                <button
                  onClick={() => setModifier((m) => m + 1)}
                  className="w-7 h-7 rounded-lg bg-white hover:bg-stone-100 text-stone-800 border border-[#DDD5C7] font-semibold text-sm shadow-sm"
                >
                  +
                </button>
              </div>
            </div>

            {/* Advantage Mode (for d20) */}
            <div>
              <label className="text-[11px] font-semibold text-stone-700 block mb-1">
                d20 Advantage
              </label>
              <div className="flex rounded-lg p-0.5 bg-white border border-[#DDD5C7] text-xs">
                <button
                  onClick={() => setAdvMode(null)}
                  className={`flex-1 py-1 rounded-md transition-all text-xs ${
                    advMode === null ? 'bg-stone-900 text-white font-semibold' : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Normal
                </button>
                <button
                  onClick={() => setAdvMode('adv')}
                  className={`flex-1 py-1 rounded-md transition-all text-xs ${
                    advMode === 'adv' ? 'bg-[#2E4A3E] text-white font-semibold' : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Adv
                </button>
                <button
                  onClick={() => setAdvMode('dis')}
                  className={`flex-1 py-1 rounded-md transition-all text-xs ${
                    advMode === 'dis' ? 'bg-[#B85D36] text-white font-semibold' : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Dis
                </button>
              </div>
            </div>
          </div>

          {/* Quick Special Roll: 4d6 Drop Lowest */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E8E3DA]">
            <div>
              <div className="text-xs font-semibold text-stone-900">Roll Ability Score (4d6)</div>
              <div className="text-[11px] text-stone-600">Rolls 4d6 and automatically drops lowest die</div>
            </div>
            <button
              onClick={handle4d6}
              className="px-3.5 py-1.5 rounded-lg bg-white hover:bg-stone-50 border border-[#DDD5C7] text-stone-800 text-xs font-medium shadow-sm transition-all"
            >
              Roll 4d6
            </button>
          </div>

          {/* Roll History */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-stone-600 uppercase tracking-wider">
                Recent Rolls ({recentRolls.length})
              </span>
              {recentRolls.length > 0 && (
                <button
                  onClick={onClearHistory}
                  className="text-[11px] text-stone-600 hover:text-stone-900 transition-colors flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Clear</span>
                </button>
              )}
            </div>

            {recentRolls.length === 0 ? (
              <div className="text-center py-6 text-xs text-stone-600 italic">
                No rolls yet. Click any die above or any skill on your character sheet!
              </div>
            ) : (
              <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
                {recentRolls.map((r) => (
                  <div
                    key={r.id}
                    className="flex items-center justify-between p-2 rounded-lg bg-[#FAF8F5] border border-[#E8E3DA] text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-stone-800">{r.label}</span>
                      <span className="text-stone-600 font-mono text-[10px]">({r.formula})</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] text-stone-600 tabular-nums">{r.timestamp}</span>
                      <span className="font-mono font-bold text-sm tabular-nums text-stone-900">
                        {r.total}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

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
  { sides: 4, label: 'd4', color: 'text-emerald-400 border-emerald-500/30' },
  { sides: 6, label: 'd6', color: 'text-blue-400 border-blue-500/30' },
  { sides: 8, label: 'd8', color: 'text-cyan-400 border-cyan-500/30' },
  { sides: 10, label: 'd10', color: 'text-amber-400 border-amber-500/30' },
  { sides: 12, label: 'd12', color: 'text-orange-400 border-orange-500/30' },
  { sides: 20, label: 'd20', color: 'text-rose-400 border-rose-500/30' },
  { sides: 100, label: 'd100', color: 'text-purple-400 border-purple-500/30' },
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
    }, 150);
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
    }, 150);
  };

  const latestRoll = recentRolls[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <Dices className="w-5 h-5 text-amber-400" />
            <h3 className="font-serif text-base font-bold text-slate-100">
              Interactive Dice Chamber
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-5 overflow-y-auto">
          {/* Latest Roll Display Hero */}
          {latestRoll && (
            <div className={`p-4 rounded-xl border text-center transition-all ${
              latestRoll.isCrit
                ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
                : latestRoll.isNat1
                ? 'bg-rose-500/10 border-rose-500/40 text-rose-300'
                : 'bg-slate-950/80 border-slate-800 text-slate-100'
            }`}>
              <div className="text-xs uppercase tracking-wider text-slate-400 flex items-center justify-center gap-1.5">
                {latestRoll.label}
                {latestRoll.isCrit && <Sparkles className="w-3.5 h-3.5 text-amber-400 inline" />}
                {latestRoll.isNat1 && <Skull className="w-3.5 h-3.5 text-rose-400 inline" />}
              </div>

              <div className="text-4xl font-extrabold font-mono tracking-tight my-1 tabular-nums">
                {latestRoll.total}
              </div>

              <div className="text-xs text-slate-400 font-mono">
                {latestRoll.formula}
                {latestRoll.rolls.length > 0 && ` -> [${latestRoll.rolls.join(', ')}]`}
                {latestRoll.secondRoll !== undefined && ` vs [${latestRoll.secondRoll}]`}
                {latestRoll.modifier !== 0 && ` + (${latestRoll.modifier})`}
              </div>

              {latestRoll.isCrit && (
                <div className="text-xs font-bold text-amber-400 mt-1 uppercase tracking-wider">
                  Critical Success! (Natural 20)
                </div>
              )}
              {latestRoll.isNat1 && (
                <div className="text-xs font-bold text-rose-400 mt-1 uppercase tracking-wider">
                  Critical Failure! (Natural 1)
                </div>
              )}
            </div>
          )}

          {/* Quick Dice Bar */}
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Select Die to Roll
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
              {DIE_TYPES.map((die) => (
                <button
                  key={die.sides}
                  onClick={() => handleRoll(die.sides)}
                  disabled={isRolling}
                  className={`py-3 px-2 rounded-lg border bg-slate-950/60 hover:bg-slate-800 transition-all flex flex-col items-center justify-center gap-1 active:scale-95 ${die.color}`}
                >
                  <span className="font-serif font-black text-lg">{die.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Controls: Modifiers & Count & Advantage */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-slate-950/40 rounded-lg border border-slate-800/80">
            {/* Number of Dice */}
            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                Number of Dice
              </label>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCount((c) => Math.max(1, c - 1))}
                  className="w-8 h-8 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold"
                >
                  -
                </button>
                <div className="flex-1 text-center font-mono font-bold text-sm bg-slate-900 py-1 rounded border border-slate-700/60 tabular-nums">
                  {count}
                </div>
                <button
                  onClick={() => setCount((c) => Math.min(20, c + 1))}
                  className="w-8 h-8 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold"
                >
                  +
                </button>
              </div>
            </div>

            {/* Modifier */}
            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                Modifier (+/-)
              </label>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setModifier((m) => m - 1)}
                  className="w-8 h-8 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold"
                >
                  -
                </button>
                <div className="flex-1 text-center font-mono font-bold text-sm bg-slate-900 py-1 rounded border border-slate-700/60 tabular-nums">
                  {modifier >= 0 ? `+${modifier}` : modifier}
                </div>
                <button
                  onClick={() => setModifier((m) => m + 1)}
                  className="w-8 h-8 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold"
                >
                  +
                </button>
              </div>
            </div>

            {/* Advantage Mode (for d20) */}
            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                d20 Mode
              </label>
              <div className="flex rounded-md p-0.5 bg-slate-900 border border-slate-800 text-xs">
                <button
                  onClick={() => setAdvMode(null)}
                  className={`flex-1 py-1 rounded transition-colors ${
                    advMode === null ? 'bg-slate-750 text-white font-medium' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Norm
                </button>
                <button
                  onClick={() => setAdvMode('adv')}
                  className={`flex-1 py-1 rounded transition-colors ${
                    advMode === 'adv' ? 'bg-emerald-600 text-white font-medium' : 'text-slate-400 hover:text-emerald-300'
                  }`}
                >
                  Adv
                </button>
                <button
                  onClick={() => setAdvMode('dis')}
                  className={`flex-1 py-1 rounded transition-colors ${
                    advMode === 'dis' ? 'bg-rose-600 text-white font-medium' : 'text-slate-400 hover:text-rose-300'
                  }`}
                >
                  Dis
                </button>
              </div>
            </div>
          </div>

          {/* Quick Special Roll: 4d6 Drop Lowest */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-amber-500/5 border border-amber-500/20">
            <div>
              <div className="text-xs font-semibold text-amber-200">Roll Ability Score</div>
              <div className="text-[11px] text-slate-400">Rolls 4d6 and automatically drops lowest die</div>
            </div>
            <button
              onClick={handle4d6}
              className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-semibold transition-colors"
            >
              Roll 4d6
            </button>
          </div>

          {/* Roll History */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Recent Rolls ({recentRolls.length})
              </span>
              {recentRolls.length > 0 && (
                <button
                  onClick={onClearHistory}
                  className="text-[11px] text-slate-500 hover:text-rose-400 transition-colors flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Clear History</span>
                </button>
              )}
            </div>

            {recentRolls.length === 0 ? (
              <div className="text-center py-6 text-xs text-slate-500 italic">
                No rolls yet. Click any die above or any skill on your character sheet!
              </div>
            ) : (
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {recentRolls.map((r) => (
                  <div
                    key={r.id}
                    className="flex items-center justify-between p-2 rounded bg-slate-950/60 border border-slate-800/60 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-300">{r.label}</span>
                      <span className="text-slate-500 font-mono text-[10px]">({r.formula})</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] text-slate-500 tabular-nums">{r.timestamp}</span>
                      <span className={`font-mono font-bold text-sm tabular-nums ${
                        r.isCrit ? 'text-amber-400 font-black' : r.isNat1 ? 'text-rose-400 font-black' : 'text-slate-100'
                      }`}>
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

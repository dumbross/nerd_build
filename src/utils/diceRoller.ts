/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface DiceRollResult {
  id: string;
  label: string;
  formula: string;
  diceCount: number;
  diceSides: number;
  rolls: number[];
  modifier: number;
  total: number;
  isCrit?: boolean;
  isNat1?: boolean;
  advantage?: 'adv' | 'dis' | null;
  secondRoll?: number;
  timestamp: string;
}

export function rollDice(
  sides: number,
  count: number = 1,
  modifier: number = 0,
  label: string = 'Roll',
  advMode: 'adv' | 'dis' | null = null
): DiceRollResult {
  const rolls: number[] = [];
  for (let i = 0; i < count; i++) {
    rolls.push(Math.floor(Math.random() * sides) + 1);
  }

  let totalRoll = rolls.reduce((acc, r) => acc + r, 0);
  let secondRoll: number | undefined;

  if (sides === 20 && count === 1 && advMode) {
    const roll2 = Math.floor(Math.random() * 20) + 1;
    secondRoll = roll2;
    if (advMode === 'adv') {
      totalRoll = Math.max(rolls[0], roll2);
    } else {
      totalRoll = Math.min(rolls[0], roll2);
    }
  }

  const isCrit = sides === 20 && count === 1 && totalRoll === 20;
  const isNat1 = sides === 20 && count === 1 && totalRoll === 1;

  const total = totalRoll + modifier;
  const modSign = modifier > 0 ? `+${modifier}` : modifier < 0 ? `${modifier}` : '';
  const advText = advMode === 'adv' ? ' (Adv)' : advMode === 'dis' ? ' (Dis)' : '';
  const formula = `${count}d${sides}${modSign}${advText}`;

  return {
    id: `roll_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    label,
    formula,
    diceCount: count,
    diceSides: sides,
    rolls,
    modifier,
    total,
    isCrit,
    isNat1,
    advantage: advMode,
    secondRoll,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
  };
}

export function roll4d6DropLowest(): { rolls: number[]; dropped: number; total: number } {
  const dice = [
    Math.floor(Math.random() * 6) + 1,
    Math.floor(Math.random() * 6) + 1,
    Math.floor(Math.random() * 6) + 1,
    Math.floor(Math.random() * 6) + 1,
  ].sort((a, b) => a - b);

  const dropped = dice[0];
  const kept = dice.slice(1);
  const total = kept.reduce((a, b) => a + b, 0);

  return { rolls: dice, dropped, total };
}

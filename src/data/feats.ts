/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FiveToolsFeat } from '../types/fivetools';

export const FIVE_TOOLS_FEATS: FiveToolsFeat[] = [
  {
    name: 'Alert',
    source: 'PHB',
    entries: [
      'Always on the lookout for danger, you gain the following benefits:',
      '• You gain a +5 bonus to initiative.',
      '• You can’t be surprised while you are conscious.',
      '• Other creatures don’t gain advantage on attack rolls against you as a result of being unseen by you.',
    ],
  },
  {
    name: 'War Caster',
    source: 'PHB',
    prerequisite: [{ spellcasting: true }],
    entries: [
      'You have practiced casting spells in the midst of combat, learning techniques that grant you the following benefits:',
      '• You have advantage on Constitution saving throws that you make to maintain your concentration on a spell when you take damage.',
      '• You can perform the somatic components of spells even when you have weapons or a shield in one or both hands.',
      '• When a hostile creature’s movement provokes an opportunity attack from you, you can use your reaction to cast a spell at the creature, rather than making an opportunity attack. The spell must have a casting time of 1 action and must target only that creature.',
    ],
  },
  {
    name: 'Sentinel',
    source: 'PHB',
    entries: [
      'You have mastered techniques that take advantage of every drop in any enemy’s guard, gaining the following benefits:',
      '• When you hit a creature with an opportunity attack, the creature’s speed becomes 0 for the rest of the turn.',
      '• Creatures provoke opportunity attacks from you even if they take the Disengage action before leaving your reach.',
      '• When a creature within 5 feet of you makes an attack against a target other than you, you can use your reaction to make a melee weapon attack against the attacking creature.',
    ],
  },
  {
    name: 'Mobile',
    source: 'PHB',
    entries: [
      'You are exceptionally speedy and agile, gaining the following benefits:',
      '• Your speed increases by 10 feet.',
      '• When you use the Dash action, difficult terrain doesn’t cost you extra movement on that turn.',
      '• When you make a melee attack against a creature, you don’t provoke opportunity attacks from that creature for the rest of the turn, whether you hit or not.',
    ],
  },
  {
    name: 'Sharpshooter',
    source: 'PHB',
    entries: [
      'You have mastered ranged weapons and can make shots that others find impossible. You gain the following benefits:',
      '• Attacking at long range doesn’t impose disadvantage on your ranged weapon attack rolls.',
      '• Your ranged weapon attacks ignore half cover and three-quarters cover.',
      '• Before you make an attack with a ranged weapon that you are proficient with, you can choose to take a -5 penalty to the attack roll. If the attack hits, you add +10 to the attack’s damage.',
    ],
  },
  {
    name: 'Great Weapon Master',
    source: 'PHB',
    entries: [
      'You’ve learned to put the weight of a weapon to your advantage, letting its momentum empower your strikes:',
      '• On your turn, when you score a critical hit with a melee weapon or reduce a creature to 0 hit points with one, you can make one melee weapon attack as a bonus action.',
      '• Before you make a melee attack with a heavy weapon that you are proficient with, you can choose to take a -5 penalty to the attack roll. If the attack hits, you add +10 to the attack’s damage.',
    ],
  },
  {
    name: 'Lucky',
    source: 'PHB',
    entries: [
      'You have inexplicable luck that seems to kick in at just the right moment.',
      '• You have 3 luck points. Whenever you make an attack roll, an ability check, or a saving throw, you can spend one luck point to roll an additional d20. You can choose to spend one of your luck points after you roll the die, but before the outcome is determined. You choose which of the d20s is used.',
      '• You regain your expended luck points when you finish a long rest.',
    ],
  },
  {
    name: 'Tough',
    source: 'PHB',
    entries: [
      'Your hit point maximum increases by an amount equal to twice your level when you gain this feat. Whenever you gain a level thereafter, your hit point maximum increases by an additional 2 hit points.',
    ],
  },
  {
    name: 'Crossbow Expert',
    source: 'PHB',
    entries: [
      'Thanks to extensive practice with the crossbow, you gain the following benefits:',
      '• You ignore the loading quality of crossbows with which you are proficient.',
      '• Being within 5 feet of a hostile creature doesn’t impose disadvantage on your ranged attack rolls.',
      '• When you use the Attack action and attack with a one-handed weapon, you can use a bonus action to attack with a hand crossbow you are holding.',
    ],
  },
  {
    name: 'Polearm Master',
    source: 'PHB',
    entries: [
      'You can keep your enemies at bay with reach weapons:',
      '• When you take the Attack action and attack with only a glaive, halberd, quarterstaff, or spear, you can use a bonus action to make a melee attack with the opposite end of the weapon (1d4 bludgeoning damage).',
      '• While you are wielding a glaive, halberd, pike, quarterstaff, or spear, other creatures provoke an opportunity attack from you when they enter the reach you have with that weapon.',
    ],
  },
  {
    name: 'Fey Touched',
    source: 'TCoE',
    entries: [
      'Your exposure to the Feywild’s magic has changed you, granting the following benefits:',
      '• Increase your Intelligence, Wisdom, or Charisma score by 1, to a maximum of 20.',
      '• You learn the Misty Step spell and one 1st-level spell of your choice from the divination or enchantment school. You can cast each of these spells without expending a spell slot once per long rest.',
    ],
  },
  {
    name: 'Shadow Touched',
    source: 'TCoE',
    entries: [
      'Your exposure to the Shadowfell’s magic has changed you, granting the following benefits:',
      '• Increase your Intelligence, Wisdom, or Charisma score by 1, to a maximum of 20.',
      '• You learn the Invisibility spell and one 1st-level spell of your choice from the illusion or necromancy school. You can cast each of these spells without expending a spell slot once per long rest.',
    ],
  },
  {
    name: 'Telekinetic',
    source: 'TCoE',
    entries: [
      'You learn to move things with your mind, gaining the following benefits:',
      '• Increase your Intelligence, Wisdom, or Charisma score by 1, to a maximum of 20.',
      '• You learn the Mage Hand cantrip. You can cast it without verbal or somatic components, and you can make the spectral hand invisible. Its range increases by 30 feet.',
      '• As a bonus action, you can telekinetically shove one creature within 30 feet of you (5-foot push or pull, DC 8 + prof + spellcasting modifier Strength save).',
    ],
  },
  {
    name: 'Resilient',
    source: 'PHB',
    entries: [
      'Choose one ability score. You gain the following benefits:',
      '• Increase the chosen ability score by 1, to a maximum of 20.',
      '• You gain proficiency in saving throws using the chosen ability.',
    ],
  },
  {
    name: 'Shield Master',
    source: 'PHB',
    entries: [
      'You use shields not just for protection but also for offense:',
      '• If you take the Attack action on your turn, you can use a bonus action to try to shove a creature within 5 feet of you with your shield.',
      '• If you aren’t incapacitated, you can add your shield’s AC bonus to any Dexterity saving throw you make against a spell or other harmful effect that targets only you.',
      '• If you are subjected to an effect that allows you to make a Dexterity saving throw to take only half damage, you can use your reaction to take no damage if you succeed.',
    ],
  },
  {
    name: 'Dual Wielder',
    source: 'PHB',
    entries: [
      'You master fighting with two weapons, gaining the following benefits:',
      '• You gain a +1 bonus to AC while you are wielding a separate melee weapon in each hand.',
      '• You can use two-weapon fighting even when the one-handed melee weapons you are wielding aren’t light.',
      '• You can draw or stow two one-handed weapons when you would normally be able to draw or stow only one.',
    ],
  },
  {
    name: 'Observant',
    source: 'PHB',
    entries: [
      'Quick to notice details in your environment, you gain the following benefits:',
      '• Increase your Intelligence or Wisdom score by 1, to a maximum of 20.',
      '• If you can see a creature’s mouth while it is speaking a language you understand, you can interpret what it’s saying by reading its lips.',
      '• You have a +5 bonus to your passive Wisdom (Perception) and passive Intelligence (Investigation) scores.',
    ],
  },
  {
    name: 'Magic Initiate',
    source: 'PHB',
    entries: [
      'Choose a class: bard, cleric, druid, sorcerer, warlock, or wizard. You learn two cantrips of your choice from that class’s spell list.',
      'In addition, choose one 1st-level spell from that same list. You learn that spell and can cast it at its lowest level once per long rest without expending a spell slot.',
    ],
  },
];


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
  // ==========================================
  // TASHA'S CAULDRON OF EVERYTHING (TCE)
  // ==========================================
  {
    name: 'Fey Touched',
    source: 'TCE',
    entries: [
      'Your exposure to the Feywild’s magic has changed you, granting the following benefits:',
      '• Increase your Intelligence, Wisdom, or Charisma score by 1, to a maximum of 20.',
      '• You learn the {@spell misty step} spell and one 1st-level spell of your choice from the divination or enchantment school of magic.',
      '• You can cast each of these spells without expending a spell slot once per long rest, or using spell slots you possess of the appropriate level.',
    ],
  },
  {
    name: 'Shadow Touched',
    source: 'TCE',
    entries: [
      'Your exposure to the Shadowfell’s gloom has changed you, granting the following benefits:',
      '• Increase your Intelligence, Wisdom, or Charisma score by 1, to a maximum of 20.',
      '• You learn the {@spell invisibility} spell and one 1st-level spell of your choice from the illusion or necromancy school of magic.',
      '• You can cast each of these spells without expending a spell slot once per long rest, or using spell slots you possess.',
    ],
  },
  {
    name: 'Telekinetic',
    source: 'TCE',
    entries: [
      'You learn to move things with your mind, gaining the following benefits:',
      '• Increase your Intelligence, Wisdom, or Charisma score by 1, to a maximum of 20.',
      '• You learn the {@spell mage hand} cantrip. You can cast it without verbal or somatic components, and you can make the spectral hand invisible. Its range increases by 30 feet.',
      '• As a bonus action, you can telekinetically shove one creature you can see within 30 feet of you. Unless the target succeeds on a Strength saving throw against your spell save DC (8 + PB + ability), it is moved 5 feet toward or away from you.',
    ],
  },
  {
    name: 'Telepathic',
    source: 'TCE',
    entries: [
      'You awaken the ability to mentally connect with others, granting the following benefits:',
      '• Increase your Intelligence, Wisdom, or Charisma score by 1, to a maximum of 20.',
      '• You can speak telepathically to any creature you can see within 60 feet of you in a language you know.',
      '• You can cast the {@spell detect thoughts} spell without expending a spell slot once per long rest, and using any spell slots you possess.',
    ],
  },
  {
    name: 'Chef',
    source: 'TCE',
    entries: [
      'Time and effort spent mastering the culinary arts has paid off, granting the following benefits:',
      '• Increase your Constitution or Wisdom score by 1, to a maximum of 20.',
      '• You gain proficiency with cook’s utensils if you don’t already have it.',
      '• As part of a short rest, you can prepare special food. Up to a number of creatures equal to 4 + your proficiency bonus who eat this food and spend Hit Dice regain an extra {@dice 1d8} hit points.',
      '• At the end of a long rest, you can cook special treats. Eating a treat as a bonus action grants temporary hit points equal to your proficiency bonus.',
    ],
  },
  {
    name: 'Crusher',
    source: 'TCE',
    entries: [
      'You are practiced in the art of crushing your enemies, granting the following benefits:',
      '• Increase your Strength or Constitution score by 1, to a maximum of 20.',
      '• Once per turn, when you hit a creature with an attack that deals bludgeoning damage, you can move it 5 feet to an unoccupied space, provided the target is no more than one size larger than you.',
      '• When you score a critical hit that deals bludgeoning damage to a creature, attack rolls against that creature are made with advantage until the start of your next turn.',
    ],
  },
  {
    name: 'Piercer',
    source: 'TCE',
    entries: [
      'You have achieved a penetrating accuracy in combat, granting the following benefits:',
      '• Increase your Strength or Dexterity score by 1, to a maximum of 20.',
      '• Once per turn, when you hit a creature with an attack that deals piercing damage, you can reroll one of the attack’s damage dice, and you must use the new roll.',
      '• When you score a critical hit that deals piercing damage to a creature, you can roll one additional damage die when determining the extra piercing damage dealt.',
    ],
  },
  {
    name: 'Slasher',
    source: 'TCE',
    entries: [
      'You have learned where to cut to have the greatest results, granting the following benefits:',
      '• Increase your Strength or Dexterity score by 1, to a maximum of 20.',
      '• Once per turn when you hit a creature with an attack that deals slashing damage, you can reduce the speed of the target by 10 feet until the start of your next turn.',
      '• When you score a critical hit that deals slashing damage to a creature, you grievously wound it. Until the start of your next turn, the target has disadvantage on all attack rolls.',
    ],
  },
  {
    name: 'Skill Expert',
    source: 'TCE',
    entries: [
      'You have honed your proficiency with particular skills, granting the following benefits:',
      '• Increase one ability score of your choice by 1, to a maximum of 20.',
      '• You gain proficiency in one skill of your choice.',
      '• Choose one skill in which you have proficiency. You gain expertise with that skill, which means your proficiency bonus is doubled for any ability check you make with it.',
    ],
  },
  {
    name: 'Eldritch Adept',
    source: 'TCE',
    prerequisite: [{ spellcasting: true }],
    entries: [
      'Studying occult lore, you have unlocked the secrets of the multiverse: You learn one Eldritch Invocation option of your choice from the warlock class. If the invocation has a prerequisite, you can choose that invocation only if you’re a warlock and meet the prerequisite.',
    ],
  },
  {
    name: 'Metamagic Adept',
    source: 'TCE',
    prerequisite: [{ spellcasting: true }],
    entries: [
      'You’ve learned how to exert your will on your spells to alter how they function:',
      '• You learn two Metamagic options of your choice from the sorcerer class.',
      '• You gain 2 sorcery points to spend on Metamagic (these points are added to any sorcery points you have from another source). You regain all spent sorcery points when you finish a long rest.',
    ],
  },
  // ==========================================
  // FIZBAN'S TREASURY OF DRAGONS (FTD)
  // ==========================================
  {
    name: 'Gift of the Chromatic Dragon',
    source: 'FTD',
    entries: [
      'You’ve manifested some of the raw elemental power of chromatic dragons:',
      '• Chromatic Infusion: As a bonus action, you can touch a simple or martial weapon and infuse it with acid, cold, fire, lightning, or poison. For 1 minute, the weapon deals an extra {@dice 1d4} damage of the chosen type.',
      '• Reactive Resistance: When you take acid, cold, fire, lightning, or poison damage, you can use your reaction to give yourself resistance to that instance of damage (Proficiency Bonus times per long rest).',
    ],
  },
  {
    name: 'Gift of the Metallic Dragon',
    source: 'FTD',
    entries: [
      'You’ve manifested some of the protective spirit of metallic dragons:',
      '• Draconic Healing: You learn the {@spell cure wounds} spell. You can cast it without expending a spell slot once per long rest, and using any spell slots you possess.',
      '• Protective Wings: When you or another creature within 5 feet of you is hit by an attack roll, you can manifest protective wings as a reaction, granting a bonus to AC equal to your proficiency bonus against that attack.',
    ],
  },
  {
    name: 'Gift of the Gem Dragon',
    source: 'FTD',
    entries: [
      'You’ve manifested some of the psionic power of gem dragons:',
      '• Increase your Intelligence, Wisdom, or Charisma score by 1, to a maximum of 20.',
      '• Telekinetic Reprisal: When you take damage from a creature within 10 feet of you, you can use your reaction to deal {@dice 2d8} force damage and push the creature up to 10 feet away if it fails a Strength saving throw (Proficiency Bonus times per long rest).',
    ],
  },
];


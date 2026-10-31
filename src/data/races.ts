/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FiveToolsRace } from '../types/fivetools';

export const FIVE_TOOLS_RACES: FiveToolsRace[] = [
  {
    name: 'Human',
    source: 'PHB',
    page: 29,
    size: ['M'],
    speed: 30,
    ability: [{ str: 1, dex: 1, con: 1, int: 1, wis: 1, cha: 1 }],
    languages: ['Common', 'One additional language of your choice'],
    entries: [
      'Humans are the most adaptable and ambitious people among the common races. Whatever drives them, humans are the innovators, the achievers, and the pioneers of the worlds.',
      {
        type: 'entries',
        name: 'Age',
        entries: ['Humans reach adulthood in their late teens and live less than a century.'],
      },
      {
        type: 'entries',
        name: 'Size',
        entries: ['Humans vary widely in height and build, from barely 5 feet to well over 6 feet tall. Your size is Medium.'],
      },
    ],
  },
  {
    name: 'Elf',
    source: 'PHB',
    page: 21,
    size: ['M'],
    speed: 30,
    darkvision: 60,
    ability: [{ dex: 2 }],
    languages: ['Common', 'Elvish'],
    traits: ['Keen Senses', 'Fey Ancestry', 'Trance'],
    entries: [
      'Elves are a magical people of otherworldly grace, living in places of ethereal beauty, in the midst of ancient-growth forests or in silvery spires glittering with faerie light.',
      {
        type: 'entries',
        name: 'Darkvision',
        entries: ['Accustomed to twilit forests and the night sky, you have superior vision in dark and dim conditions. You can see in dim light within 60 feet of you as if it were bright light, and in darkness as if it were dim light.'],
      },
      {
        type: 'entries',
        name: 'Keen Senses',
        entries: ['You have proficiency in the {@skill Perception} skill.'],
      },
      {
        type: 'entries',
        name: 'Fey Ancestry',
        entries: ['You have advantage on saving throws against being {@condition charmed}, and magic cannot put you to sleep.'],
      },
      {
        type: 'entries',
        name: 'Trance',
        entries: ['Elves do not sleep. Instead, they meditate deeply for 4 hours a day, gaining the same benefit a human does from 8 hours of sleep.'],
      },
    ],
    subraces: [
      {
        name: 'High Elf',
        source: 'PHB',
        raceName: 'Elf',
        ability: [{ int: 1 }],
        entries: [
          'As a high elf, you have a keen mind and a mastery of at least the basics of magic.',
          {
            type: 'entries',
            name: 'Elf Weapon Training',
            entries: ['You have proficiency with the {@item longsword}, {@item shortsword}, {@item shortbow}, and {@item longbow}.'],
          },
          {
            type: 'entries',
            name: 'Cantrip',
            entries: ['You know one cantrip of your choice from the wizard spell list. Intelligence is your spellcasting ability for it.'],
          },
          {
            type: 'entries',
            name: 'Extra Language',
            entries: ['You can speak, read, and write one extra language of your choice.'],
          },
        ],
      },
      {
        name: 'Wood Elf',
        source: 'PHB',
        raceName: 'Elf',
        speed: 35,
        ability: [{ wis: 1 }],
        entries: [
          'As a wood elf, you have keen senses and intuition, and your fleet feet carry you quickly and stealthily through your native forests.',
          {
            type: 'entries',
            name: 'Elf Weapon Training',
            entries: ['You have proficiency with the {@item longsword}, {@item shortsword}, {@item shortbow}, and {@item longbow}.'],
          },
          {
            type: 'entries',
            name: 'Fleet of Foot',
            entries: ['Your base walking speed increases to 35 feet.'],
          },
          {
            type: 'entries',
            name: 'Mask of the Wild',
            entries: ['You can attempt to hide even when you are only lightly obscured by foliage, heavy rain, falling snow, mist, and other natural phenomena.'],
          },
        ],
      },
      {
        name: 'Drow (Dark Elf)',
        source: 'PHB',
        raceName: 'Elf',
        darkvision: 120,
        ability: [{ cha: 1 }],
        entries: [
          'Descended from an earlier subrace of dark-skinned elves, the drow were banished from the surface world for following the goddess Lolth.',
          {
            type: 'entries',
            name: 'Superior Darkvision',
            entries: ['Your darkvision has a radius of 120 feet.'],
          },
          {
            type: 'entries',
            name: 'Sunlight Sensitivity',
            entries: ['You have disadvantage on attack rolls and on Wisdom ({@skill Perception}) checks that rely on sight when you, the target of your attack, or whatever you are trying to perceive is in direct sunlight.'],
          },
          {
            type: 'entries',
            name: 'Drow Magic',
            entries: ['You know the {@spell dancing lights} cantrip. When you reach 3rd level, you can cast {@spell faerie fire} once per day. At 5th level, you can cast {@spell darkness} once per day. Charisma is your spellcasting ability for these spells.'],
          },
        ],
      },
    ],
  },
  {
    name: 'Dwarf',
    source: 'PHB',
    page: 18,
    size: ['M'],
    speed: 25,
    darkvision: 60,
    ability: [{ con: 2 }],
    languages: ['Common', 'Dwarvish'],
    traits: ['Dwarven Resilience', 'Dwarven Combat Training', 'Stonecunning'],
    entries: [
      'Bold and hardy, dwarves are known as skilled warriors, miners, and workers of stone and metal.',
      {
        type: 'entries',
        name: 'Dwarven Resilience',
        entries: ['You have advantage on saving throws against poison, and you have resistance against poison damage.'],
      },
      {
        type: 'entries',
        name: 'Dwarven Combat Training',
        entries: ['You have proficiency with the {@item battleaxe}, {@item handaxe}, {@item light hammer}, and {@item warhammer}.'],
      },
      {
        type: 'entries',
        name: 'Stonecunning',
        entries: ['Whenever you make an Intelligence ({@skill History}) check related to the origin of stonework, you add double your proficiency bonus to the check.'],
      },
    ],
    subraces: [
      {
        name: 'Hill Dwarf',
        source: 'PHB',
        raceName: 'Dwarf',
        ability: [{ wis: 1 }],
        entries: [
          'As a hill dwarf, you have keen senses, deep intuition, and remarkable resilience.',
          {
            type: 'entries',
            name: 'Dwarven Toughness',
            entries: ['Your hit point maximum increases by 1, and it increases by 1 every time you gain a level.'],
          },
        ],
      },
      {
        name: 'Mountain Dwarf',
        source: 'PHB',
        raceName: 'Dwarf',
        ability: [{ str: 2 }],
        entries: [
          'As a mountain dwarf, you are strong and hardy, accustomed to a difficult life in rugged terrain.',
          {
            type: 'entries',
            name: 'Dwarven Armor Training',
            entries: ['You have proficiency with light and medium armor.'],
          },
        ],
      },
    ],
  },
  {
    name: 'Halfling',
    source: 'PHB',
    page: 26,
    size: ['S'],
    speed: 25,
    ability: [{ dex: 2 }],
    languages: ['Common', 'Halfling'],
    traits: ['Lucky', 'Brave', 'Halfling Nimbleness'],
    entries: [
      'The diminutive halflings survive in a world full of larger creatures by avoiding notice or, barring that, avoiding offense.',
      {
        type: 'entries',
        name: 'Lucky',
        entries: ['When you roll a 1 on the {@dice d20} for an attack roll, ability check, or saving throw, you can reroll the die and must use the new roll.'],
      },
      {
        type: 'entries',
        name: 'Brave',
        entries: ['You have advantage on saving throws against being {@condition frightened}.'],
      },
      {
        type: 'entries',
        name: 'Halfling Nimbleness',
        entries: ['You can move through the space of any creature that is of a size larger than yours.'],
      },
    ],
    subraces: [
      {
        name: 'Lightfoot Halfling',
        source: 'PHB',
        raceName: 'Halfling',
        ability: [{ cha: 1 }],
        entries: [
          {
            type: 'entries',
            name: 'Naturally Stealthy',
            entries: ['You can attempt to hide even when you are obscured only by a creature that is at least one size larger than you.'],
          },
        ],
      },
      {
        name: 'Stout Halfling',
        source: 'PHB',
        raceName: 'Halfling',
        ability: [{ con: 1 }],
        entries: [
          {
            type: 'entries',
            name: 'Stout Resilience',
            entries: ['You have advantage on saving throws against poison, and you have resistance against poison damage.'],
          },
        ],
      },
    ],
  },
  {
    name: 'Dragonborn',
    source: 'PHB',
    page: 32,
    size: ['M'],
    speed: 30,
    ability: [{ str: 2, cha: 1 }],
    languages: ['Common', 'Draconic'],
    traits: ['Draconic Ancestry', 'Breath Weapon', 'Damage Resistance'],
    entries: [
      'Born of dragons, as their name proclaims, the dragonborn walk proudly through a world that greets them with fearful incomprehension.',
      {
        type: 'entries',
        name: 'Draconic Ancestry',
        entries: ['You have draconic ancestry. Choose one type of dragon from the Draconic Ancestry table (e.g. Red for Fire damage, Gold for Fire, Silver for Cold, Blue for Lightning). Your breath weapon and damage resistance are determined by the dragon type.'],
      },
      {
        type: 'entries',
        name: 'Breath Weapon',
        entries: ['You can use your action to exhale destructive energy. Each creature in the area must make a saving throw. DC = 8 + your Con modifier + your proficiency bonus. A creature takes {@dice 2d6} damage on a failed save, half on a success. Damage increases to 3d6 at 6th, 4d6 at 11th, and 5d6 at 16th level. Recharge on short or long rest.'],
      },
      {
        type: 'entries',
        name: 'Damage Resistance',
        entries: ['You have resistance to the damage type associated with your draconic ancestry.'],
      },
    ],
  },
  {
    name: 'Gnome',
    source: 'PHB',
    page: 35,
    size: ['S'],
    speed: 25,
    darkvision: 60,
    ability: [{ int: 2 }],
    languages: ['Common', 'Gnomish'],
    traits: ['Gnome Cunning'],
    entries: [
      'A constant hum of busy activity pervades the warrens and neighborhoods where gnomes form their close-knit communities.',
      {
        type: 'entries',
        name: 'Gnome Cunning',
        entries: ['You have advantage on all Intelligence, Wisdom, and Charisma saving throws against magic.'],
      },
    ],
    subraces: [
      {
        name: 'Rock Gnome',
        source: 'PHB',
        raceName: 'Gnome',
        ability: [{ con: 1 }],
        entries: [
          {
            type: 'entries',
            name: "Artificer's Lore",
            entries: ['Whenever you make an Intelligence ({@skill History}) check related to magic items, alchemical objects, or technological devices, add twice your proficiency bonus.'],
          },
          {
            type: 'entries',
            name: 'Tinker',
            entries: ['You have proficiency with artisan tools (tinker tools). Using those tools, you can spend 1 hour and 10 gp of materials to construct a Tiny clockwork device.'],
          },
        ],
      },
      {
        name: 'Forest Gnome',
        source: 'PHB',
        raceName: 'Gnome',
        ability: [{ dex: 1 }],
        entries: [
          {
            type: 'entries',
            name: 'Natural Illusionist',
            entries: ['You know the {@spell minor illusion} cantrip. Intelligence is your spellcasting ability for it.'],
          },
          {
            type: 'entries',
            name: 'Speak with Small Beasts',
            entries: ['Through sounds and gestures, you can communicate simple ideas with Small or smaller beasts.'],
          },
        ],
      },
    ],
  },
  {
    name: 'Half-Elf',
    source: 'PHB',
    page: 38,
    size: ['M'],
    speed: 30,
    darkvision: 60,
    ability: [{ cha: 2, choose: { from: ['str', 'dex', 'con', 'int', 'wis'], count: 2, amount: 1 } }],
    languages: ['Common', 'Elvish', 'One extra language of your choice'],
    traits: ['Fey Ancestry', 'Skill Versatility'],
    entries: [
      'Walking in two worlds but truly belonging to neither, half-elves combine what some say are the best qualities of their elf and human parents.',
      {
        type: 'entries',
        name: 'Fey Ancestry',
        entries: ['You have advantage on saving throws against being {@condition charmed}, and magic cannot put you to sleep.'],
      },
      {
        type: 'entries',
        name: 'Skill Versatility',
        entries: ['You gain proficiency in two skills of your choice.'],
      },
    ],
  },
  {
    name: 'Half-Orc',
    source: 'PHB',
    page: 40,
    size: ['M'],
    speed: 30,
    darkvision: 60,
    ability: [{ str: 2, con: 1 }],
    languages: ['Common', 'Orc'],
    traits: ['Menacing', 'Relentless Endurance', 'Savage Attacks'],
    entries: [
      'Half-orcs gray pigmentation, sloping foreheads, jutting jaws, prominent teeth, and towering builds make their orcish heritage plain for all to see.',
      {
        type: 'entries',
        name: 'Menacing',
        entries: ['You gain proficiency in the {@skill Intimidation} skill.'],
      },
      {
        type: 'entries',
        name: 'Relentless Endurance',
        entries: ['When you are reduced to 0 hit points but not killed outright, you can drop to 1 hit point instead. You can use this feature once per long rest.'],
      },
      {
        type: 'entries',
        name: 'Savage Attacks',
        entries: ['When you score a critical hit with a melee weapon attack, you can roll one of the weapon damage dice one additional time and add it to the extra damage of the critical hit.'],
      },
    ],
  },
  {
    name: 'Tiefling',
    source: 'PHB',
    page: 42,
    size: ['M'],
    speed: 30,
    darkvision: 60,
    ability: [{ int: 1, cha: 2 }],
    languages: ['Common', 'Infernal'],
    traits: ['Hellish Resistance', 'Infernal Legacy'],
    entries: [
      'To be greeted with stares and whispers, to suffer violence and insult on the street, to see mistrust and fear in every eye: this is the lot of the tiefling.',
      {
        type: 'entries',
        name: 'Hellish Resistance',
        entries: ['You have resistance to fire damage.'],
      },
      {
        type: 'entries',
        name: 'Infernal Legacy',
        entries: ['You know the {@spell thaumaturgy} cantrip. When you reach 3rd level, you can cast {@spell hellish rebuke} once per day as a 2nd-level spell. At 5th level, you can cast {@spell darkness} once per day. Charisma is your spellcasting ability for these.'],
      },
    ],
  },
  {
    name: 'Goblin',
    source: 'VGM',
    page: 119,
    size: ['S'],
    speed: 30,
    darkvision: 60,
    ability: [{ dex: 2, con: 1 }],
    languages: ['Common', 'Goblin'],
    traits: ['Fury of the Small', 'Nimble Escape'],
    entries: [
      'Goblins occupy an uneasy place in a dangerous world, and they react by harboring a ferocious desire for power, cunning, and an unrivaled knack for survival.',
      {
        type: 'entries',
        name: 'Age',
        entries: ['Goblins reach adulthood at age 8 and live up to 60 years.'],
      },
      {
        type: 'entries',
        name: 'Size',
        entries: ['Goblins are between 3 and 4 feet tall and weigh between 40 and 80 pounds. Your size is Small.'],
      },
      {
        type: 'entries',
        name: 'Darkvision',
        entries: ['You can see in dim light within 60 feet of you as if it were bright light, and in darkness as if it were dim light.'],
      },
      {
        type: 'entries',
        name: 'Fury of the Small',
        entries: [
          'When you damage a creature with an attack or a spell and the creature’s size is larger than yours, you can cause the attack or spell to deal extra damage to the creature. The extra damage equals your level. Once you use this trait, you must finish a short or long rest before you can use it again.',
        ],
      },
      {
        type: 'entries',
        name: 'Nimble Escape',
        entries: [
          'You can take the Disengage or Hide action as a bonus action on each of your turns.',
        ],
      },
    ],
  },
  {
    name: 'Aasimar',
    source: 'VGM',
    page: 104,
    size: ['M'],
    speed: 30,
    darkvision: 60,
    ability: [{ cha: 2 }],
    languages: ['Common', 'Celestial'],
    traits: ['Celestial Resistance', 'Healing Hands', 'Light Bearer'],
    entries: [
      'Aasimar bear in their souls the light of the heavens. They are descended from humans with a touch of the power of Mount Celestia, the glorious realm of good.',
      {
        type: 'entries',
        name: 'Celestial Resistance',
        entries: ['You have resistance to necrotic damage and radiant damage.'],
      },
      {
        type: 'entries',
        name: 'Healing Hands',
        entries: ['As an action, you can touch a creature and cause it to regain hit points equal to your level. Once per long rest.'],
      },
      {
        type: 'entries',
        name: 'Light Bearer',
        entries: ['You know the {@spell light} cantrip. Charisma is your spellcasting ability for it.'],
      },
    ],
    subraces: [
      {
        name: 'Protector Aasimar',
        source: 'VGM',
        raceName: 'Aasimar',
        ability: [{ wis: 1 }],
        entries: [
          {
            type: 'entries',
            name: 'Radiant Soul',
            entries: ['Starting at 3rd level, you can use your action to unleash divine energy, gaining 30 ft fly speed and dealing extra radiant damage equal to your level once per turn for 1 minute.'],
          },
        ],
      },
    ],
  },
  {
    name: 'Goliath',
    source: 'VGM',
    page: 108,
    size: ['M'],
    speed: 30,
    ability: [{ str: 2, con: 1 }],
    languages: ['Common', 'Giant'],
    traits: ['Natural Athlete', "Stone's Endurance", 'Powerful Build', 'Mountain Born'],
    entries: [
      'Strong and reclusive, every day brings a new challenge to a goliath. Food, water, and shelter are rarely in abundant supply in their mountain homes.',
      {
        type: 'entries',
        name: 'Natural Athlete',
        entries: ['You have proficiency in the {@skill Athletics} skill.'],
      },
      {
        type: 'entries',
        name: "Stone's Endurance",
        entries: ['When you take damage, you can use your reaction to roll a {@dice d12}. Add your Constitution modifier to the number rolled, and reduce the damage by that total. Recharge on short or long rest.'],
      },
      {
        type: 'entries',
        name: 'Powerful Build',
        entries: ['You count as one size larger when determining your carrying capacity and the weight you can push, drag, or lift.'],
      },
      {
        type: 'entries',
        name: 'Mountain Born',
        entries: ['You have resistance to cold damage and are acclimated to high altitude.'],
      },
    ],
  },
  {
    name: 'Tabaxi',
    source: 'VGM',
    page: 113,
    size: ['M'],
    speed: 30,
    darkvision: 60,
    ability: [{ dex: 2, cha: 1 }],
    languages: ['Common', 'One extra language'],
    traits: ['Feline Agility', "Cat's Claws", "Cat's Talent"],
    entries: [
      'Hailing from a strange and distant land, wandering tabaxi are catlike humanoids driven by curiosity to collect interesting artifacts, gather stories, and lay eyes on wonder.',
      {
        type: 'entries',
        name: 'Feline Agility',
        entries: ['When you move on your tum in combat, you can double your speed until the end of the turn. Once you use this trait, you can’t use it again until you move 0 feet on one of your turns.'],
      },
      {
        type: 'entries',
        name: "Cat's Claws",
        entries: ['You have a climbing speed of 20 feet and your claws are natural weapons dealing {@dice 1d4} slashing damage.'],
      },
      {
        type: 'entries',
        name: "Cat's Talent",
        entries: ['You have proficiency in the {@skill Perception} and {@skill Stealth} skills.'],
      },
    ],
  },
  {
    name: 'Kobold',
    source: 'VGM',
    page: 119,
    size: ['S'],
    speed: 30,
    darkvision: 60,
    ability: [{ dex: 2 }],
    languages: ['Common', 'Draconic'],
    traits: ['Grovel, Cower, and Beg', 'Pack Tactics', 'Sunlight Sensitivity'],
    entries: [
      'Kobolds are often dismissed as cowardly and weak, but their ingenuity, trap-making skills, and deep devotion to dragons make them formidable in numbers.',
      {
        type: 'entries',
        name: 'Pack Tactics',
        entries: ['You have advantage on an attack roll against a creature if at least one of your allies is within 5 feet of the creature and the ally isn’t incapacitated.'],
      },
      {
        type: 'entries',
        name: 'Grovel, Cower, and Beg',
        entries: ['As an action on your turn, you can cower pathetically to distract nearby foes. Until the end of your next turn, your allies gain advantage on attack rolls against enemies within 10 feet of you. Once per short or long rest.'],
      },
    ],
  },
  {
    name: 'Genasi',
    source: 'EEPC',
    page: 7,
    size: ['M'],
    speed: 30,
    ability: [{ con: 2 }],
    languages: ['Common', 'Primordial'],
    entries: [
      'Genasi carry the magical power of the four elemental planes in their blood, manifesting fiery hair, earthy stone skin, aquatic gills, or breezy winds.',
    ],
    subraces: [
      {
        name: 'Fire Genasi',
        source: 'EEPC',
        raceName: 'Genasi',
        darkvision: 60,
        ability: [{ int: 1 }],
        entries: [
          { type: 'entries', name: 'Fire Resistance', entries: ['You have resistance to fire damage.'] },
          { type: 'entries', name: 'Reach to the Blaze', entries: ['You know the {@spell produce flame} cantrip. At 3rd level, you can cast {@spell burning hands} once per long rest.'] },
        ],
      },
      {
        name: 'Water Genasi',
        source: 'EEPC',
        raceName: 'Genasi',
        ability: [{ wis: 1 }],
        speed: 30,
        entries: [
          { type: 'entries', name: 'Amphibious', entries: ['You can breathe air and water.'] },
          { type: 'entries', name: 'Swim', entries: ['You have a swimming speed of 30 feet.'] },
          { type: 'entries', name: 'Call to the Wave', entries: ['You know the {@spell shape water} cantrip. At 3rd level, cast {@spell create or destroy water} once per long rest.'] },
        ],
      },
      {
        name: 'Air Genasi',
        source: 'EEPC',
        raceName: 'Genasi',
        ability: [{ dex: 1 }],
        entries: [
          { type: 'entries', name: 'Unending Breath', entries: ['You can hold your breath indefinitely while not incapacitated.'] },
          { type: 'entries', name: 'Mingle with the Wind', entries: ['You can cast {@spell levitate} once per long rest.'] },
        ],
      },
      {
        name: 'Earth Genasi',
        source: 'EEPC',
        raceName: 'Genasi',
        ability: [{ str: 1 }],
        entries: [
          { type: 'entries', name: 'Earth Walk', entries: ['You move across difficult terrain made of earth or stone without expending extra movement.'] },
          { type: 'entries', name: 'Merge with Stone', entries: ['You can cast {@spell pass without trace} once per long rest.'] },
        ],
      },
    ],
  },
  {
    name: 'Warforged',
    source: 'ERLW',
    page: 35,
    size: ['M'],
    speed: 30,
    ability: [{ con: 2, choose: { from: ['str', 'dex', 'int', 'wis', 'cha'], count: 1, amount: 1 } }],
    languages: ['Common', 'One additional language'],
    traits: ['Constructed Resilience', "Sentry's Rest", 'Integrated Protection', 'Specialized Design'],
    entries: [
      'Sculpted from wood and metal, then infused with life and sentience, warforged were built as mindless soldiers in the Last War before gaining freedom.',
      {
        type: 'entries',
        name: 'Constructed Resilience',
        entries: ['Advantage on saving throws against poison, resistance against poison damage, immune to disease, don’t need to eat, drink, or breathe, and magic cannot put you to sleep.'],
      },
      {
        type: 'entries',
        name: "Sentry's Rest",
        entries: ['Instead of sleeping, you spend 6 hours in an inactive, motionless state, retaining full awareness of your surroundings.'],
      },
      {
        type: 'entries',
        name: 'Integrated Protection',
        entries: ['Your body has built-in armor. You gain a +1 bonus to Armor Class.'],
      },
    ],
  },
  {
    name: 'Changeling',
    source: 'ERLW',
    page: 17,
    size: ['M'],
    speed: 30,
    ability: [{ cha: 2, choose: { from: ['str', 'dex', 'con', 'int', 'wis'], count: 1, amount: 1 } }],
    languages: ['Common', 'Two extra languages'],
    traits: ['Shapechanger', 'Changeling Instincts'],
    entries: [
      'Changelings can alter their physical appearance at will, shifting their forms between different faces, genders, and humanoid species with seamless artistry.',
      {
        type: 'entries',
        name: 'Shapechanger',
        entries: ['As an action, you can change your appearance and voice. You can adjust your height, weight, hair, and coloration to match any humanoid you have seen.'],
      },
      {
        type: 'entries',
        name: 'Changeling Instincts',
        entries: ['You gain proficiency with two skills of your choice from Deception, Insight, Intimidation, and Persuasion.'],
      },
    ],
  },
  {
    name: 'Tortle',
    source: 'TP',
    page: 4,
    size: ['M'],
    speed: 30,
    ability: [{ str: 2, wis: 1 }],
    languages: ['Common', 'Aquan'],
    traits: ['Natural Armor', 'Shell Defense', 'Survival Instinct', 'Claws'],
    entries: [
      'Tortles walk the world with their homes upon their backs, living simple, peaceful lives along coastlines and tranquil estuaries.',
      {
        type: 'entries',
        name: 'Natural Armor',
        entries: ['Due to your heavy shell, you have a base Armor Class of 17 (Dexterity provides no bonus or penalty). You cannot wear armor, but you can wield a shield to increase AC to 19.'],
      },
      {
        type: 'entries',
        name: 'Shell Defense',
        entries: ['As an action, you can withdraw into your shell, gaining a +4 bonus to AC and advantage on Strength and Constitution saving throws.'],
      },
    ],
  },
  {
    name: 'Bugbear',
    source: 'VGM',
    page: 119,
    size: ['M'],
    speed: 30,
    darkvision: 60,
    ability: [{ str: 2, dex: 1 }],
    languages: ['Common', 'Goblin'],
    traits: ['Long-Limbed', 'Powerful Build', 'Sneaky', 'Surprise Attack'],
    entries: [
      'Bugbears are born for stealth and ambush, possessing remarkably long limbs and quiet footing despite their hulking frames.',
      {
        type: 'entries',
        name: 'Long-Limbed',
        entries: ['When you make a melee attack on your turn, your reach for it is 5 feet greater than normal.'],
      },
      {
        type: 'entries',
        name: 'Surprise Attack',
        entries: ['If you surprise a creature and hit it with an attack on your first turn in combat, the attack deals an extra {@dice 2d6} damage.'],
      },
    ],
  },
];

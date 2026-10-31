/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FiveToolsClass } from '../types/fivetools';

export const FIVE_TOOLS_CLASSES: FiveToolsClass[] = [
  {
    name: 'Barbarian',
    source: 'PHB',
    hd: { number: 1, faces: 12 },
    proficiency: ['str', 'con'],
    armorProficiencies: ['Light armor', 'Medium armor', 'Shields'],
    weaponProficiencies: ['Simple weapons', 'Martial weapons'],
    skillChoices: {
      from: ['Animal Handling', 'Athletics', 'Intimidation', 'Nature', 'Perception', 'Survival'],
      count: 2,
    },
    entries: [
      'A fierce warrior of primitive background who can enter a battle rage to gain incredible physical power, resilience, and speed.',
    ],
    features: [
      {
        name: 'Rage',
        level: 1,
        source: 'PHB',
        entries: [
          'In battle, you fight with primal ferocity. On your turn, you can enter a rage as a bonus action. While raging, you gain advantage on Strength checks and Strength saving throws, deal bonus damage to melee weapon attacks using Strength (+2 at 1st level), and have resistance to bludgeoning, piercing, and slashing damage. Rage lasts for 1 minute or until you are knocked unconscious.',
        ],
      },
      {
        name: 'Unarmored Defense (Barbarian)',
        level: 1,
        source: 'PHB',
        entries: [
          'While you are not wearing any armor, your Armor Class equals 10 + your Dexterity modifier + your Constitution modifier. You can use a shield and still gain this benefit.',
        ],
      },
      {
        name: 'Reckless Attack',
        level: 2,
        source: 'PHB',
        entries: [
          'Starting at 2nd level, you can throw aside all concern for defense to attack with fierce desperation. When you make your first attack on your turn, you can decide to attack recklessly. Doing so gives you advantage on melee weapon attack rolls using Strength during this turn, but attack rolls against you have advantage until your next turn.',
        ],
      },
      {
        name: 'Danger Sense',
        level: 2,
        source: 'PHB',
        entries: [
          'At 2nd level, you gain an uncanny sense of when things nearby aren’t as they should be, giving you an edge when you dodge away from danger. You have advantage on Dexterity saving throws against effects that you can see, such as traps and spells.',
        ],
      },
      {
        name: 'Extra Attack',
        level: 5,
        source: 'PHB',
        entries: [
          'Beginning at 5th level, you can attack twice, instead of once, whenever you take the Attack action on your turn.',
        ],
      },
      {
        name: 'Fast Movement',
        level: 5,
        source: 'PHB',
        entries: [
          'Starting at 5th level, your speed increases by 10 feet while you aren’t wearing heavy armor.',
        ],
      },
    ],
    subclasses: [
      {
        name: 'Path of the Berserker',
        shortName: 'Berserker',
        source: 'PHB',
        className: 'Barbarian',
        subclassFeatures: [
          {
            name: 'Frenzy',
            level: 3,
            source: 'PHB',
            entries: [
              'Starting when you choose this path at 3rd level, you can go into a frenzy when you rage. If you do so, for the duration of your rage you can make a single melee weapon attack as a bonus action on each of your turns after this one. When your rage ends, you suffer one level of exhaustion.',
            ],
          },
          {
            name: 'Mindless Rage',
            level: 6,
            source: 'PHB',
            entries: [
              'Beginning at 6th level, you can’t be {@condition charmed} or {@condition frightened} while raging. If you are charmed or frightened when you enter your rage, the effect is suspended for the duration of the rage.',
            ],
          },
        ],
      },
    ],
  },
  {
    name: 'Bard',
    source: 'PHB',
    hd: { number: 1, faces: 8 },
    proficiency: ['dex', 'cha'],
    spellcastingAbility: 'cha',
    casterProgression: 'full',
    armorProficiencies: ['Light armor'],
    weaponProficiencies: ['Simple weapons', 'Hand crossbows', 'Longswords', 'Rapiers', 'Shortswords'],
    toolProficiencies: ['Three musical instruments of your choice'],
    skillChoices: {
      from: [
        'Acrobatics', 'Animal Handling', 'Arcana', 'Athletics', 'Deception', 'History',
        'Insight', 'Intimidation', 'Investigation', 'Medicine', 'Nature', 'Perception',
        'Performance', 'Persuasion', 'Religion', 'Sleight of Hand', 'Stealth', 'Survival',
      ],
      count: 3,
    },
    entries: [
      'An inspiring magician whose power echoes the music of creation.',
    ],
    features: [
      {
        name: 'Spellcasting',
        level: 1,
        source: 'PHB',
        entries: [
          'You have learned to untangle and reshape the fabric of reality in harmony with your wishes and music. You know cantrips and spells from the bard spell list. Charisma is your spellcasting ability.',
        ],
      },
      {
        name: 'Bardic Inspiration',
        level: 1,
        source: 'PHB',
        entries: [
          'You can inspire others through stirring words or music. To do so, you use a bonus action on your turn to choose one creature other than yourself within 60 feet of you who can hear you. That creature gains one Bardic Inspiration die, a {@dice d6}. Once within the next 10 minutes, the creature can roll the die and add the number rolled to one ability check, attack roll, or saving throw it makes.',
        ],
      },
      {
        name: 'Jack of All Trades',
        level: 2,
        source: 'PHB',
        entries: [
          'Starting at 2nd level, you can add half your proficiency bonus, rounded down, to any ability check you make that doesn’t already include your proficiency bonus.',
        ],
      },
      {
        name: 'Song of Rest',
        level: 2,
        source: 'PHB',
        entries: [
          'Beginning at 2nd level, you can use soothing music or oration to help revitalize your wounded allies during a short rest. If you or any friendly creatures who can hear your performance regain hit points at the end of the short rest, each of those creatures regains an extra {@dice 1d6} hit points.',
        ],
      },
      {
        name: 'Expertise',
        level: 3,
        source: 'PHB',
        entries: [
          'At 3rd level, choose two of your skill proficiencies. Your proficiency bonus is doubled for any ability check you make that uses either of the chosen proficiencies.',
        ],
      },
      {
        name: 'Font of Inspiration',
        level: 5,
        source: 'PHB',
        entries: [
          'Beginning when you reach 5th level, you regain all of your expended uses of Bardic Inspiration when you finish a short or long rest.',
        ],
      },
    ],
    subclasses: [
      {
        name: 'College of Lore',
        shortName: 'Lore',
        source: 'PHB',
        className: 'Bard',
        subclassFeatures: [
          {
            name: 'Bonus Proficiencies',
            level: 3,
            source: 'PHB',
            entries: ['When you join the College of Lore at 3rd level, you gain proficiency with three skills of your choice.'],
          },
          {
            name: 'Cutting Words',
            level: 3,
            source: 'PHB',
            entries: [
              'Also at 3rd level, you learn how to use your wit to distract, confuse, and otherwise sap the confidence and competence of others. When a creature that you can see within 60 feet of you makes an attack roll, an ability check, or a damage roll, you can use your reaction to expend one of your uses of Bardic Inspiration, rolling a Bardic Inspiration die and subtracting the number rolled from the creature’s roll.',
            ],
          },
        ],
      },
    ],
  },
  {
    name: 'Cleric',
    source: 'PHB',
    hd: { number: 1, faces: 8 },
    proficiency: ['wis', 'cha'],
    spellcastingAbility: 'wis',
    casterProgression: 'full',
    armorProficiencies: ['Light armor', 'Medium armor', 'Shields'],
    weaponProficiencies: ['Simple weapons'],
    skillChoices: {
      from: ['History', 'Insight', 'Medicine', 'Persuasion', 'Religion'],
      count: 2,
    },
    entries: [
      'A priestly champion who wields divine magic in service of a higher power.',
    ],
    features: [
      {
        name: 'Spellcasting',
        level: 1,
        source: 'PHB',
        entries: [
          'As a conduit for divine power, you can cast cleric spells. Wisdom is your spellcasting ability for your cleric spells.',
        ],
      },
      {
        name: 'Divine Domain',
        level: 1,
        source: 'PHB',
        entries: [
          'Choose one domain related to your deity: Life, Light, Nature, Tempest, Trickery, War, or Knowledge. Your choice grants you domain spells and other features.',
        ],
      },
      {
        name: 'Channel Divinity',
        level: 2,
        source: 'PHB',
        entries: [
          'At 2nd level, you gain the ability to channel divine energy directly from your deity, using that energy to fuel magical effects like Turn Undead or your domain feature.',
        ],
      },
      {
        name: 'Turn Undead',
        level: 2,
        source: 'PHB',
        entries: [
          'As an action, you present your holy symbol and speak a prayer censuring the undead. Each undead that can see or hear you within 30 feet of you must make a Wisdom saving throw. If the creature fails its saving throw, it is turned for 1 minute or until it takes any damage.',
        ],
      },
      {
        name: 'Destroy Undead',
        level: 5,
        source: 'PHB',
        entries: [
          'Starting at 5th level, when an undead fails its saving throw against your Turn Undead feature, the creature is instantly destroyed if its challenge rating is at or below a certain threshold (CR 1/2 at 5th level).',
        ],
      },
    ],
    subclasses: [
      {
        name: 'Life Domain',
        shortName: 'Life',
        source: 'PHB',
        className: 'Cleric',
        subclassFeatures: [
          {
            name: 'Bonus Proficiency',
            level: 1,
            source: 'PHB',
            entries: ['When you choose this domain at 1st level, you gain proficiency with heavy armor.'],
          },
          {
            name: 'Disciple of Life',
            level: 1,
            source: 'PHB',
            entries: [
              'Also starting at 1st level, your healing spells are more effective. Whenever you use a spell of 1st level or higher to restore hit points to a creature, the creature regains additional hit points equal to 2 + the spell’s level.',
            ],
          },
          {
            name: 'Channel Divinity: Preserve Life',
            level: 2,
            source: 'PHB',
            entries: [
              'Starting at 2nd level, you can use your Channel Divinity to heal the badly injured. As an action, you present your holy symbol and evoke healing energy that can restore a number of hit points equal to 5 times your cleric level. Choose any creatures within 30 feet of you, and divide those hit points among them. This feature can’t restore a creature to more than half of its hit point maximum.',
            ],
          },
        ],
      },
    ],
  },
  {
    name: 'Druid',
    source: 'PHB',
    hd: { number: 1, faces: 8 },
    proficiency: ['int', 'wis'],
    spellcastingAbility: 'wis',
    casterProgression: 'full',
    armorProficiencies: ['Light armor (non-metal)', 'Medium armor (non-metal)', 'Shields (non-metal)'],
    weaponProficiencies: ['Clubs', 'Daggers', 'Darts', 'Javelins', 'Maces', 'Quarterstaffs', 'Scimitars', 'Sickles', 'Slings', 'Spears'],
    toolProficiencies: ['Herbalism kit'],
    skillChoices: {
      from: ['Arcana', 'Animal Handling', 'Insight', 'Medicine', 'Nature', 'Perception', 'Religion', 'Survival'],
      count: 2,
    },
    entries: [
      'A priest of the Old Faith, wielding the powers of nature and adopting animal forms.',
    ],
    features: [
      {
        name: 'Druidic',
        level: 1,
        source: 'PHB',
        entries: ['You know Druidic, the secret language of druids.'],
      },
      {
        name: 'Wild Shape',
        level: 2,
        source: 'PHB',
        entries: [
          'Starting at 2nd level, you can use your action to magically assume the shape of a beast that you have seen before. You can use this feature twice per short or long rest.',
        ],
      },
    ],
    subclasses: [
      {
        name: 'Circle of the Land',
        shortName: 'Land',
        source: 'PHB',
        className: 'Druid',
        subclassFeatures: [
          {
            name: 'Bonus Cantrip',
            level: 2,
            source: 'PHB',
            entries: ['When you choose this circle at 2nd level, you learn one additional druid cantrip of your choice.'],
          },
          {
            name: 'Natural Recovery',
            level: 2,
            source: 'PHB',
            entries: [
              'Starting at 2nd level, you can regain some of your magical energy by sitting in meditation. During a short rest, you choose expended spell slots to recover. The spell slots can have a combined level that is equal to or less than half your druid level (rounded up).',
            ],
          },
        ],
      },
    ],
  },
  {
    name: 'Fighter',
    source: 'PHB',
    hd: { number: 1, faces: 10 },
    proficiency: ['str', 'con'],
    armorProficiencies: ['All armor', 'Shields'],
    weaponProficiencies: ['Simple weapons', 'Martial weapons'],
    skillChoices: {
      from: ['Acrobatics', 'Animal Handling', 'Athletics', 'History', 'Insight', 'Intimidation', 'Perception', 'Survival'],
      count: 2,
    },
    entries: [
      'A master of martial combat, skilled with a variety of weapons and armor.',
    ],
    features: [
      {
        name: 'Fighting Style',
        level: 1,
        source: 'PHB',
        entries: [
          'You adopt a particular style of fighting as your specialty (e.g. Archery: +2 bonus to attack rolls with ranged weapons; Defense: +1 bonus to AC while wearing armor; Dueling: +2 bonus to damage with single one-handed weapon; Great Weapon Fighting: reroll 1s and 2s on damage dice; Protection; Two-Weapon Fighting).',
        ],
      },
      {
        name: 'Second Wind',
        level: 1,
        source: 'PHB',
        entries: [
          'You have a limited well of stamina that you can draw on to protect yourself from harm. On your turn, you can use a bonus action to regain hit points equal to {@dice 1d10} + your fighter level. Once you use this feature, you must finish a short or long rest before you can use it again.',
        ],
      },
      {
        name: 'Action Surge',
        level: 2,
        source: 'PHB',
        entries: [
          'Starting at 2nd level, you can push yourself beyond your normal limits for a moment. On your turn, you can take one additional action on top of your regular action and a possible bonus action. Once you use this feature, you must finish a short or long rest before you can use it again.',
        ],
      },
      {
        name: 'Martial Archetype',
        level: 3,
        source: 'PHB',
        entries: ['At 3rd level, you choose an archetype that you strive to emulate in your combat styles and techniques, such as Champion or Battle Master.'],
      },
      {
        name: 'Extra Attack',
        level: 5,
        source: 'PHB',
        entries: [
          'Beginning at 5th level, you can attack twice, instead of once, whenever you take the Attack action on your turn. The number of attacks increases to three at 11th level and to four at 20th level.',
        ],
      },
      {
        name: 'Indomitable',
        level: 9,
        source: 'PHB',
        entries: [
          'Beginning at 9th level, you can reroll a saving throw that you fail. If you do so, you must use the new roll, and you can’t use this feature again until you finish a long rest.',
        ],
      },
    ],
    subclasses: [
      {
        name: 'Champion',
        shortName: 'Champion',
        source: 'PHB',
        className: 'Fighter',
        subclassFeatures: [
          {
            name: 'Improved Critical',
            level: 3,
            source: 'PHB',
            entries: [
              'Beginning when you choose this archetype at 3rd level, your weapon attacks score a critical hit on a roll of 19 or 20.',
            ],
          },
          {
            name: 'Remarkable Athlete',
            level: 7,
            source: 'PHB',
            entries: [
              'Starting at 7th level, you can add half your proficiency bonus (round up) to any Strength, Dexterity, or Constitution check you make that doesn’t already use your proficiency bonus.',
            ],
          },
        ],
      },
      {
        name: 'Battle Master',
        shortName: 'Battle Master',
        source: 'PHB',
        className: 'Fighter',
        subclassFeatures: [
          {
            name: 'Combat Superiority',
            level: 3,
            source: 'PHB',
            entries: [
              'You gain four superiority dice (d8s) and learn three maneuvers of your choice (such as Riposte, Precision Attack, Trip Attack, Menacing Attack). Superiority dice recharge on a short or long rest.',
            ],
          },
          {
            name: 'Student of War',
            level: 3,
            source: 'PHB',
            entries: ['You gain proficiency with one type of artisan’s tools of your choice.'],
          },
        ],
      },
    ],
  },
  {
    name: 'Monk',
    source: 'PHB',
    hd: { number: 1, faces: 8 },
    proficiency: ['str', 'dex'],
    armorProficiencies: ['None'],
    weaponProficiencies: ['Simple weapons', 'Shortswords'],
    toolProficiencies: ['One type of artisan tools or one musical instrument'],
    skillChoices: {
      from: ['Acrobatics', 'Athletics', 'History', 'Insight', 'Religion', 'Stealth'],
      count: 2,
    },
    entries: [
      'A master of martial arts, harnessing the power of the body in pursuit of physical and spiritual perfection.',
    ],
    features: [
      {
        name: 'Unarmored Defense (Monk)',
        level: 1,
        source: 'PHB',
        entries: [
          'Beginning at 1st level, while you are wearing no armor and not wielding a shield, your AC equals 10 + your Dexterity modifier + your Wisdom modifier.',
        ],
      },
      {
        name: 'Martial Arts',
        level: 1,
        source: 'PHB',
        entries: [
          'You can use Dexterity instead of Strength for monk weapons and unarmed strikes. You can roll a {@dice d4} in place of normal damage. When you use the Attack action with an unarmed strike or a monk weapon on your turn, you can make one unarmed strike as a bonus action.',
        ],
      },
      {
        name: 'Ki',
        level: 2,
        source: 'PHB',
        entries: [
          'Starting at 2nd level, your training allows you to harness the mystic energy of ki. You have a number of ki points equal to your monk level. You can spend these points to fuel various ki features: Flurry of Blows, Patient Defense, and Step of the Wind. Ki points recharge on a short or long rest.',
        ],
      },
      {
        name: 'Deflect Missiles',
        level: 3,
        source: 'PHB',
        entries: [
          'Starting at 3rd level, you can use your reaction to deflect or catch the missile when you are hit by a ranged weapon attack. When you do so, the damage you take from the attack is reduced by {@dice 1d10} + your Dexterity modifier + your monk level.',
        ],
      },
      {
        name: 'Slow Fall',
        level: 4,
        source: 'PHB',
        entries: ['Beginning at 4th level, you can use your reaction when you fall to reduce any falling damage you take by an amount equal to five times your monk level.'],
      },
      {
        name: 'Extra Attack',
        level: 5,
        source: 'PHB',
        entries: ['Beginning at 5th level, you can attack twice, instead of once, whenever you take the Attack action on your turn.'],
      },
      {
        name: 'Stunning Strike',
        level: 5,
        source: 'PHB',
        entries: [
          'Starting at 5th level, you can interfere with the flow of ki in an opponent’s body. When you hit another creature with a melee weapon attack, you can spend 1 ki point to attempt a stunning strike. The target must succeed on a Constitution saving throw or be {@condition stunned} until the end of your next turn.',
        ],
      },
    ],
    subclasses: [
      {
        name: 'Way of the Open Hand',
        shortName: 'Open Hand',
        source: 'PHB',
        className: 'Monk',
        subclassFeatures: [
          {
            name: 'Open Hand Technique',
            level: 3,
            source: 'PHB',
            entries: [
              'Whenever you hit a creature with one of the attacks granted by your Flurry of Blows, you can impose one of the following effects: knock it prone (Dex save), push it up to 15 feet away (Str save), or prevent it from taking reactions until the end of your next turn.',
            ],
          },
          {
            name: 'Wholeness of Body',
            level: 6,
            source: 'PHB',
            entries: [
              'At 6th level, you gain the ability to heal yourself. As an action, you can regain hit points equal to three times your monk level. Recharge on a long rest.',
            ],
          },
        ],
      },
    ],
  },
  {
    name: 'Paladin',
    source: 'PHB',
    hd: { number: 1, faces: 10 },
    proficiency: ['wis', 'cha'],
    spellcastingAbility: 'cha',
    casterProgression: '1/2',
    armorProficiencies: ['All armor', 'Shields'],
    weaponProficiencies: ['Simple weapons', 'Martial weapons'],
    skillChoices: {
      from: ['Athletics', 'Insight', 'Intimidation', 'Medicine', 'Persuasion', 'Religion'],
      count: 2,
    },
    entries: [
      'A holy warrior bound to a sacred oath, combining martial prowess with divine spells.',
    ],
    features: [
      {
        name: 'Divine Sense',
        level: 1,
        source: 'PHB',
        entries: [
          'The presence of strong evil registers on your senses like a noxious odor, and powerful good rings like heavenly music in your ears. As an action, you can detect the location of any celestial, fiend, or undead within 60 feet. Uses = 1 + Cha modifier per long rest.',
        ],
      },
      {
        name: 'Lay on Hands',
        level: 1,
        source: 'PHB',
        entries: [
          'Your blessed touch can heal wounds. You have a pool of healing power that replenishes when you take a long rest. With that pool, you can restore a total number of hit points equal to your paladin level × 5. You can also expend 5 hit points from your pool of healing to cure the target of one disease or neutralize one poison affecting it.',
        ],
      },
      {
        name: 'Divine Smite',
        level: 2,
        source: 'PHB',
        entries: [
          'Starting at 2nd level, when you hit a creature with a melee weapon attack, you can expend one spell slot to deal radiant damage to the target, in addition to the weapon’s damage. The extra damage is {@dice 2d8} for a 1st-level spell slot, plus {@dice 1d8} for each spell level higher than 1st, to a maximum of {@dice 5d8}. The damage increases by {@dice 1d8} if the target is an undead or a fiend.',
        ],
      },
      {
        name: 'Aura of Protection',
        level: 6,
        source: 'PHB',
        entries: [
          'Starting at 6th level, whenever you or a friendly creature within 10 feet of you must make a saving throw, the creature gains a bonus to the saving throw equal to your Charisma modifier (with a minimum bonus of +1). You must be conscious to grant this bonus.',
        ],
      },
    ],
    subclasses: [
      {
        name: 'Oath of Devotion',
        shortName: 'Devotion',
        source: 'PHB',
        className: 'Paladin',
        subclassFeatures: [
          {
            name: 'Channel Divinity: Sacred Weapon',
            level: 3,
            source: 'PHB',
            entries: [
              'As an action, you can imbue one weapon that you are holding with positive energy. For 1 minute, you add your Charisma modifier to attack rolls made with that weapon (minimum of +1). The weapon also emits bright light in a 20-foot radius.',
            ],
          },
          {
            name: 'Channel Divinity: Turn the Unholy',
            level: 3,
            source: 'PHB',
            entries: ['As an action, you present your holy symbol and censure fiends and undead within 30 feet.'],
          },
        ],
      },
    ],
  },
  {
    name: 'Ranger',
    source: 'PHB',
    hd: { number: 1, faces: 10 },
    proficiency: ['str', 'dex'],
    spellcastingAbility: 'wis',
    casterProgression: '1/2',
    armorProficiencies: ['Light armor', 'Medium armor', 'Shields'],
    weaponProficiencies: ['Simple weapons', 'Martial weapons'],
    skillChoices: {
      from: ['Animal Handling', 'Athletics', 'Insight', 'Investigation', 'Nature', 'Perception', 'Stealth', 'Survival'],
      count: 3,
    },
    entries: [
      'A warrior who uses martial prowess and nature magic to combat threats on the edges of civilization.',
    ],
    features: [
      {
        name: 'Favored Enemy',
        level: 1,
        source: 'PHB',
        entries: [
          'Beginning at 1st level, you have significant experience studying, tracking, hunting, and even talking to a certain type of enemy (e.g. Aberrations, Beasts, Dragons, Fiends, Undead, Humanoids). You have advantage on Wisdom ({@skill Survival}) checks to track your favored enemies, as well as on Intelligence checks to recall information about them.',
        ],
      },
      {
        name: 'Natural Explorer',
        level: 1,
        source: 'PHB',
        entries: [
          'You are particularly familiar with one type of natural environment and are adept at traveling and surviving in such regions (e.g. Forest, Mountain, Swamp, Desert, Coast). Difficult terrain doesn’t slow your group’s travel, and you can’t become lost except by magical means.',
        ],
      },
      {
        name: 'Spellcasting',
        level: 2,
        source: 'PHB',
        entries: ['By the time you reach 2nd level, you have learned to use the magical essence of nature to cast spells, much as a druid does. Wisdom is your spellcasting ability.'],
      },
    ],
    subclasses: [
      {
        name: 'Hunter',
        shortName: 'Hunter',
        source: 'PHB',
        className: 'Ranger',
        subclassFeatures: [
          {
            name: "Hunter's Prey: Colossus Slayer",
            level: 3,
            source: 'PHB',
            entries: [
              'Your tenacity can wear down the most potent foes. When you hit a creature with a weapon attack, the creature takes an extra {@dice 1d8} damage if it’s below its hit point maximum. You can deal this extra damage only once per turn.',
            ],
          },
        ],
      },
    ],
  },
  {
    name: 'Rogue',
    source: 'PHB',
    hd: { number: 1, faces: 8 },
    proficiency: ['dex', 'int'],
    armorProficiencies: ['Light armor'],
    weaponProficiencies: ['Simple weapons', 'Hand crossbows', 'Longswords', 'Rapiers', 'Shortswords'],
    toolProficiencies: ["Thieves' tools"],
    skillChoices: {
      from: ['Acrobatics', 'Athletics', 'Deception', 'Insight', 'Intimidation', 'Investigation', 'Perception', 'Performance', 'Persuasion', 'Sleight of Hand', 'Stealth'],
      count: 4,
    },
    entries: [
      'A scoundrel who uses stealth and trickery to overcome obstacles and enemies.',
    ],
    features: [
      {
        name: 'Expertise',
        level: 1,
        source: 'PHB',
        entries: [
          'At 1st level, choose two of your skill proficiencies, or one of your skill proficiencies and your proficiency with thieves’ tools. Your proficiency bonus is doubled for any ability check you make that uses either of the chosen proficiencies.',
        ],
      },
      {
        name: 'Sneak Attack',
        level: 1,
        source: 'PHB',
        entries: [
          'Beginning at 1st level, you know how to strike subtly and exploit a foe’s distraction. Once per turn, you can deal an extra {@dice 1d6} damage to one creature you hit with an attack if you have advantage on the attack roll. The attack must use a finesse or a ranged weapon. You don’t need advantage on the attack roll if another enemy of the target is within 5 feet of it, that enemy isn’t incapacitated, and you don’t have disadvantage on the attack roll. Extra damage: 1d6 at 1st-2nd, 2d6 at 3rd-4th, 3d6 at 5th-6th, 4d6 at 7th-8th, 5d6 at 9th-10th.',
        ],
      },
      {
        name: "Thieves' Cant",
        level: 1,
        source: 'PHB',
        entries: [
          'During your rogue training you learned thieves’ cant, a secret mix of dialect, jargon, and code that allows you to hide messages in seemingly normal conversation.',
        ],
      },
      {
        name: 'Cunning Action',
        level: 2,
        source: 'PHB',
        entries: [
          'Starting at 2nd level, your quick thinking and agility allow you to move and act quickly. You can take a bonus action on each of your turns in combat. This action can be used only to take the Dash, Disengage, or Hide action.',
        ],
      },
      {
        name: 'Uncanny Dodge',
        level: 5,
        source: 'PHB',
        entries: [
          'Starting at 5th level, when an attacker that you can see hits you with an attack, you can use your reaction to halve the attack’s damage against you.',
        ],
      },
      {
        name: 'Evasion',
        level: 7,
        source: 'PHB',
        entries: [
          'Beginning at 7th level, you can nimbly dodge out of the way of certain area effects, such as a red dragon’s fiery breath or an Ice Storm spell. When you are subjected to an effect that allows you to make a Dexterity saving throw to take only half damage, you instead take no damage if you succeed on the saving throw, and only half damage if you fail.',
        ],
      },
    ],
    subclasses: [
      {
        name: 'Thief',
        shortName: 'Thief',
        source: 'PHB',
        className: 'Rogue',
        subclassFeatures: [
          {
            name: 'Fast Hands',
            level: 3,
            source: 'PHB',
            entries: [
              'Starting at 3rd level, you can use the bonus action granted by your Cunning Action to make a Dexterity ({@skill Sleight of Hand}) check, use your thieves’ tools to disarm a trap or open a lock, or take the Use an Object action.',
            ],
          },
          {
            name: 'Second-Story Work',
            level: 3,
            source: 'PHB',
            entries: [
              'When you choose this archetype at 3rd level, you gain the ability to climb faster than normal; climbing no longer costs you extra movement. In addition, when you make a running jump, the distance you cover increases by a number of feet equal to your Dexterity modifier.',
            ],
          },
        ],
      },
      {
        name: 'Assassin',
        shortName: 'Assassin',
        source: 'PHB',
        className: 'Rogue',
        subclassFeatures: [
          {
            name: 'Assassinate',
            level: 3,
            source: 'PHB',
            entries: [
              'Starting at 3rd level, you are at your deadliest when you get the drop on your enemies. You have advantage on attack rolls against any creature that hasn’t taken a turn in the combat yet. In addition, any hit you score against a creature that is {@condition surprised} is a critical hit.',
            ],
          },
        ],
      },
    ],
  },
  {
    name: 'Sorcerer',
    source: 'PHB',
    hd: { number: 1, faces: 6 },
    proficiency: ['con', 'cha'],
    spellcastingAbility: 'cha',
    casterProgression: 'full',
    armorProficiencies: ['None'],
    weaponProficiencies: ['Daggers', 'Darts', 'Slings', 'Quarterstaffs', 'Light crossbows'],
    skillChoices: {
      from: ['Arcana', 'Deception', 'Insight', 'Intimidation', 'Persuasion', 'Religion'],
      count: 2,
    },
    entries: [
      'A spellcaster who draws on inherent magic from a gift or bloodline.',
    ],
    features: [
      {
        name: 'Sorcerous Origin',
        level: 1,
        source: 'PHB',
        entries: ['Choose a sorcerous origin, which describes the source of your innate magical power: Draconic Bloodline or Wild Magic.'],
      },
      {
        name: 'Font of Magic',
        level: 2,
        source: 'PHB',
        entries: [
          'At 2nd level, you tap into a deep wellspring of magic within yourself. This wellspring is represented by sorcery points, which allow you to create a variety of magical effects.',
        ],
      },
      {
        name: 'Metamagic',
        level: 3,
        source: 'PHB',
        entries: [
          'At 3rd level, you gain the ability to twist your spells to suit your needs. You gain two of the following Metamagic options of your choice: Quickened Spell, Twinned Spell, Subtle Spell, Empowered Spell, Heightened Spell.',
        ],
      },
    ],
    subclasses: [
      {
        name: 'Draconic Bloodline',
        shortName: 'Draconic',
        source: 'PHB',
        className: 'Sorcerer',
        subclassFeatures: [
          {
            name: 'Dragon Ancestor',
            level: 1,
            source: 'PHB',
            entries: ['You can speak, read, and write Draconic. You also have a specific dragon ancestor associated with an energy damage type.'],
          },
          {
            name: 'Draconic Resilience',
            level: 1,
            source: 'PHB',
            entries: [
              'As magic flows through your body, it causes physical traits of your dragon ancestors to emerge. Your hit point maximum increases by 1 for each sorcerer level you have. Additionally, parts of your skin are covered by a thin sheen of dragon-like scales. When you aren’t wearing armor, your AC equals 13 + your Dexterity modifier.',
            ],
          },
        ],
      },
    ],
  },
  {
    name: 'Warlock',
    source: 'PHB',
    hd: { number: 1, faces: 8 },
    proficiency: ['wis', 'cha'],
    spellcastingAbility: 'cha',
    casterProgression: 'pact',
    armorProficiencies: ['Light armor'],
    weaponProficiencies: ['Simple weapons'],
    skillChoices: {
      from: ['Arcana', 'Deception', 'History', 'Intimidation', 'Investigation', 'Nature', 'Religion'],
      count: 2,
    },
    entries: [
      'A wielder of magic that is derived from a bargain with an otherworldly entity.',
    ],
    features: [
      {
        name: 'Otherworldly Patron',
        level: 1,
        source: 'PHB',
        entries: ['At 1st level, you have struck a bargain with an otherworldly being of your choice: the Archfey, the Fiend, or the Great Old One.'],
      },
      {
        name: 'Pact Magic',
        level: 1,
        source: 'PHB',
        entries: [
          'Your arcane research and the magic bestowed on you by your patron have given you facility with spells. Unlike other spellcasters, your spell slots are all of the highest level you can cast and recharge on a short or long rest.',
        ],
      },
      {
        name: 'Eldritch Invocations',
        level: 2,
        source: 'PHB',
        entries: [
          'In your study of occult lore, you have unearned eldritch invocations, fragments of forbidden knowledge that imbue you with an abiding magical ability (e.g. Agonizing Blast, Armor of Shadows, Devil’s Sight).',
        ],
      },
      {
        name: 'Pact Boon',
        level: 3,
        source: 'PHB',
        entries: ['At 3rd level, your otherworldly patron bestows a gift upon you for your loyal service: Pact of the Chain, Pact of the Blade, or Pact of the Tome.'],
      },
    ],
    subclasses: [
      {
        name: 'The Fiend',
        shortName: 'Fiend',
        source: 'PHB',
        className: 'Warlock',
        subclassFeatures: [
          {
            name: "Dark One's Blessing",
            level: 1,
            source: 'PHB',
            entries: [
              'Starting at 1st level, when you reduce a hostile creature to 0 hit points, you gain temporary hit points equal to your Charisma modifier + your warlock level (minimum of 1).',
            ],
          },
        ],
      },
    ],
  },
  {
    name: 'Wizard',
    source: 'PHB',
    hd: { number: 1, faces: 6 },
    proficiency: ['int', 'wis'],
    spellcastingAbility: 'int',
    casterProgression: 'full',
    armorProficiencies: ['None'],
    weaponProficiencies: ['Daggers', 'Darts', 'Slings', 'Quarterstaffs', 'Light crossbows'],
    skillChoices: {
      from: ['Arcana', 'History', 'Insight', 'Investigation', 'Medicine', 'Religion'],
      count: 2,
    },
    entries: [
      'A scholarly magic-user capable of manipulating the structures of reality.',
    ],
    features: [
      {
        name: 'Spellcasting',
        level: 1,
        source: 'PHB',
        entries: [
          'As a student of arcane magic, you have a spellbook containing spells that show the first glimmerings of your true power. Intelligence is your spellcasting ability for your wizard spells.',
        ],
      },
      {
        name: 'Arcane Recovery',
        level: 1,
        source: 'PHB',
        entries: [
          'You have learned to regain some of your magical energy by studying your spellbook. Once per day when you finish a short rest, you can choose expended spell slots to recover. The spell slots can have a combined level that is equal to or less than half your wizard level (rounded up), and none of the slots can be 6th level or higher.',
        ],
      },
      {
        name: 'Arcane Tradition',
        level: 2,
        source: 'PHB',
        entries: ['When you reach 2nd level, you choose an arcane tradition, shaping your practice of magic through one of eight schools: Abjuration, Conjuration, Divination, Enchantment, Evocation, Illusion, Necromancy, or Transmutation.'],
      },
    ],
    subclasses: [
      {
        name: 'School of Evocation',
        shortName: 'Evocation',
        source: 'PHB',
        className: 'Wizard',
        subclassFeatures: [
          {
            name: 'Evocation Savant',
            level: 2,
            source: 'PHB',
            entries: ['Beginning when you select this school at 2nd level, the gold and time you must spend to copy an evocation spell into your spellbook is halved.'],
          },
          {
            name: 'Sculpt Spells',
            level: 2,
            source: 'PHB',
            entries: [
              'Beginning at 2nd level, you can create pockets of relative safety within the effects of your evocation spells. When you cast an evocation spell that affects other creatures that you can see, you can choose a number of them equal to 1 + the spell’s level. The chosen creatures automatically succeed on their saving throws against the spell, and they take no damage if they would normally take half damage on a successful save.',
            ],
          },
          {
            name: 'Potent Cantrip',
            level: 6,
            source: 'PHB',
            entries: [
              'Starting at 6th level, your damaging cantrips affect even creatures that avoid the brunt of the effect. When a creature succeeds on a saving throw against your cantrip, the creature takes half the cantrip’s damage (if any) but suffers no additional effect from the cantrip.',
            ],
          },
        ],
      },
    ],
  },
  {
    name: 'Artificer',
    source: 'TCE',
    hd: { number: 1, faces: 8 },
    proficiency: ['con', 'int'],
    spellcastingAbility: 'int',
    casterProgression: '1/2',
    armorProficiencies: ['Light armor', 'Medium armor', 'Shields'],
    weaponProficiencies: ['Simple weapons', 'Firearms'],
    toolProficiencies: ["Thieves' tools", "Tinker's tools", 'One type of artisan tools of your choice'],
    skillChoices: {
      from: ['Arcana', 'History', 'Investigation', 'Medicine', 'Nature', 'Perception', 'Sleight of Hand'],
      count: 2,
    },
    entries: [
      'Masters of invention, artificers use ingenuity and magic to unlock extraordinary capabilities in objects.',
    ],
    features: [
      {
        name: 'Magical Tinkering',
        level: 1,
        source: 'TCE',
        entries: [
          'At 1st level, you learn how to invest a spark of magic into mundane objects. To use this ability, you must have thieves’ tools or artisan’s tools in hand. You touch a Tiny nonmagical object as an action and give it one magical property of your choice: light shed in 5-ft radius, recorded message playback, odor or visual manifestation. Max objects = your Int modifier.',
        ],
      },
      {
        name: 'Spellcasting (Artificer)',
        level: 1,
        source: 'TCE',
        entries: [
          'You study the magical workings of the multiverse and channel arcane energy through tools. Intelligence is your spellcasting ability for your artificer spells. You prepare your list of artificer spells after finishing a long rest (Int modifier + half your artificer level, rounded down, minimum of 1 spell). You can also cast artificer spells as rituals if you have the spell prepared.',
        ],
      },
      {
        name: 'Infuse Item',
        level: 2,
        source: 'TCE',
        entries: [
          'At 2nd level, you gain the ability to imbue mundane items with certain magical infusions, turning them into magic items. Infusions known: 4 at 2nd level, up to 12 at 18th level. Infused items active at one time: 2 at 2nd, up to 6 at 18th level. Examples include: Enhanced Defense (+1/+2 AC), Enhanced Arcane Focus (+1/+2 spell attacks and ignores half cover), Enhanced Weapon (+1/+2 attack and damage), Repeating Shot, Radiant Weapon, and Replicate Magic Item (Bag of Holding, Goggles of Night, etc.).',
        ],
      },
      {
        name: 'The Right Tool for the Job',
        level: 3,
        source: 'TCE',
        entries: [
          'At 3rd level, you learn how to produce exactly the tool you need: with thieves’ tools or artisan’s tools in hand, you can magically create one set of artisan’s tools in an unoccupied space within 5 feet of you. This takes 1 hour of uninterrupted work and coincides with a rest.',
        ],
      },
      {
        name: 'Tool Expertise',
        level: 6,
        source: 'TCE',
        entries: [
          'Starting at 6th level, your proficiency bonus is doubled for any ability check you make that uses your proficiency with a tool.',
        ],
      },
      {
        name: 'Flash of Genius',
        level: 7,
        source: 'TCE',
        entries: [
          'At 7th level, you gain the ability to come up with solutions under pressure. When you or another creature you can see within 30 feet makes an ability check or a saving throw, you can use your reaction to add your Intelligence modifier to the roll. Uses = Intelligence modifier per long rest.',
        ],
      },
      {
        name: 'Magic Item Adept',
        level: 10,
        source: 'TCE',
        entries: [
          'When you reach 10th level, you can attune to up to four magic items at once, and crafting common or uncommon magic items takes a quarter of normal time and half the gold.',
        ],
      },
    ],
    subclasses: [
      {
        name: 'Battle Smith',
        shortName: 'Battle Smith',
        source: 'TCE',
        className: 'Artificer',
        subclassFeatures: [
          {
            name: 'Tool Proficiency & Battle Smith Spells',
            level: 3,
            source: 'TCE',
            entries: ['You gain proficiency with smith’s tools and martial weapons. You also prepare domain spells like {@spell shield} and {@spell heroism}.'],
          },
          {
            name: 'Battle Ready',
            level: 3,
            source: 'TCE',
            entries: [
              'When you attack with a magic weapon, you can use your Intelligence modifier, instead of Strength or Dexterity, for the attack and damage rolls.',
            ],
          },
          {
            name: 'Steel Defender',
            level: 3,
            source: 'TCE',
            entries: [
              'Your tinkering has borne you a faithful companion: a steel defender automaton. In combat, the steel defender shares your initiative count, but takes its turn immediately after yours. It can take reactions (such as Deflect Attack to impose disadvantage on attacks against an ally within 5 feet) and you can use a bonus action to command it to take the Force-Empowered Rend action.',
            ],
          },
          {
            name: 'Extra Attack',
            level: 5,
            source: 'TCE',
            entries: ['You can attack twice, instead of once, whenever you take the Attack action on your turn.'],
          },
        ],
      },
      {
        name: 'Armorer',
        shortName: 'Armorer',
        source: 'TCE',
        className: 'Artificer',
        subclassFeatures: [
          {
            name: 'Arcane Armor',
            level: 3,
            source: 'TCE',
            entries: [
              'You turn a suit of armor you wear into arcane armor. The armor attaches to you and can’t be removed against your will. It expands to cover your entire body, replaces missing limbs, and ignores Strength requirements.',
            ],
          },
          {
            name: 'Armor Model: Guardian & Infiltrator',
            level: 3,
            source: 'TCE',
            entries: [
              'Guardian: Thunder Gauntlets (1d8 thunder damage, hit creatures have disadvantage on attacks against anyone other than you) + Defensive Field (temporary HP equal to artificer level as a bonus action).\n\nInfiltrator: Lightning Launcher (1d6 lightning damage, extra 1d6 once per turn, 90/300 ft range) + 5 ft walking speed + advantage on Stealth checks.',
            ],
          },
          {
            name: 'Extra Attack',
            level: 5,
            source: 'TCE',
            entries: ['You can attack twice, instead of once, whenever you take the Attack action on your turn.'],
          },
        ],
      },
      {
        name: 'Artillerist',
        shortName: 'Artillerist',
        source: 'TCE',
        className: 'Artificer',
        subclassFeatures: [
          {
            name: 'Eldritch Cannon',
            level: 3,
            source: 'TCE',
            entries: [
              'You can create a Small or Tiny eldritch cannon with 1 action. Types: Flamethrower (2d8 fire in 15-ft cone, Dex save), Force Ballista (2d8 force ranged spell attack, pushes 5 ft), or Protector (grants 1d8 + Int mod temporary HP to creatures within 10 ft). Bonus action to activate.',
            ],
          },
          {
            name: 'Arcane Firearm',
            level: 5,
            source: 'TCE',
            entries: ['You turn a wand, staff, or rod into an arcane firearm, dealing an extra {@dice 1d8} damage when you cast an artificer spell through it.'],
          },
        ],
      },
      {
        name: 'Alchemist',
        shortName: 'Alchemist',
        source: 'TCE',
        className: 'Artificer',
        subclassFeatures: [
          {
            name: 'Experimental Elixir',
            level: 3,
            source: 'TCE',
            entries: [
              'Whenever you finish a long rest, you can produce an experimental elixir in an empty flask: Healing (2d4+Int HP), Swiftness (+10 ft speed), Resilience (+1 AC), Boldness (1d4 to attacks/saves), Flight (10 ft fly speed), or Transformation (Alter Self).',
            ],
          },
          {
            name: 'Alchemical Savant',
            level: 5,
            source: 'TCE',
            entries: ['Add your Intelligence modifier to healing rolls or acid, fire, necrotic, or poison damage dealt with alchemical supplies.'],
          },
        ],
      },
    ],
  },
];

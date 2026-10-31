/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FiveToolsBackground } from '../types/fivetools';

export const FIVE_TOOLS_BACKGROUNDS: FiveToolsBackground[] = [
  {
    name: 'Acolyte',
    source: 'PHB',
    page: 127,
    skillProficiencies: ['Insight', 'Religion'],
    languages: ['Two languages of your choice'],
    startingEquipment: [
      'A holy symbol (a gift to you when you entered the priesthood)',
      'A prayer book or prayer wheel',
      '5 sticks of incense',
      'Vestments',
      'A set of common clothes',
      'A pouch containing 15 gp',
    ],
    feature: {
      name: 'Shelter of the Faithful',
      entries: [
        'As an acolyte, you command the respect of those who share your faith, and you can perform the religious ceremonies of your deity. You and your adventuring companions can expect to receive free healing and care at a temple, shrine, or other established presence of your faith, though you must provide any material components needed for spells.',
      ],
    },
    entries: [
      'You have spent your life in the service of a temple to a specific god or pantheon of gods. You act as an intermediary between the realm of the holy and the mortal world, performing sacred rites and offering sacrifices.',
    ],
  },
  {
    name: 'Criminal / Spy',
    source: 'PHB',
    page: 129,
    skillProficiencies: ['Deception', 'Stealth'],
    toolProficiencies: ['One type of gaming set', "Thieves' tools"],
    startingEquipment: [
      'A crowbar',
      'A set of dark common clothes including a hood',
      'A pouch containing 15 gp',
    ],
    feature: {
      name: 'Criminal Contact',
      entries: [
        'You have a reliable and trustworthy contact who acts as your liaison to a network of other criminals. You know how to get messages to and from your contact, even over great distances.',
      ],
    },
    entries: [
      'You are an experienced criminal with a history of breaking the law. You have spent plenty of time among other criminals and still have contacts within the criminal underworld.',
    ],
  },
  {
    name: 'Folk Hero',
    source: 'PHB',
    page: 131,
    skillProficiencies: ['Animal Handling', 'Survival'],
    toolProficiencies: ["One type of artisan's tools", 'Vehicles (land)'],
    startingEquipment: [
      "A set of artisan's tools",
      'A shovel',
      'An iron pot',
      'A set of common clothes',
      'A pouch containing 10 gp',
    ],
    feature: {
      name: 'Rustic Hospitality',
      entries: [
        'Since you come from the ranks of the common folk, you fit in among them with ease. You can find a place to hide, rest, or recuperate among other commoners, unless you have shown yourself to be a danger to them.',
      ],
    },
    entries: [
      'You come from a humble social rank, but you are destined for so much more. Already the people of your home village regard you as their champion.',
    ],
  },
  {
    name: 'Noble',
    source: 'PHB',
    page: 135,
    skillProficiencies: ['History', 'Persuasion'],
    toolProficiencies: ['One type of gaming set'],
    languages: ['One language of your choice'],
    startingEquipment: [
      'A set of fine clothes',
      'A signet ring',
      'A scroll of pedigree',
      'A purse containing 25 gp',
    ],
    feature: {
      name: 'Position of Privilege',
      entries: [
        'Thanks to your noble birth, people are inclined to think the best of you. You are welcome in high society, and people assume you have the right to be wherever you are. Commoners make every effort to accommodate you and avoid your displeasure.',
      ],
    },
    entries: [
      'You understand wealth, power, and privilege. You carry a noble title, and your family owns land, collects taxes, and wields significant political influence.',
    ],
  },
  {
    name: 'Sage',
    source: 'PHB',
    page: 137,
    skillProficiencies: ['Arcana', 'History'],
    languages: ['Two languages of your choice'],
    startingEquipment: [
      'A bottle of black ink',
      'A quill',
      'A small knife',
      'A letter from a dead colleague posing a question you have not yet been able to answer',
      'A set of common clothes',
      'A pouch containing 10 gp',
    ],
    feature: {
      name: 'Researcher',
      entries: [
        'When you attempt to learn or recall a piece of lore, if you do not know that information, you often know where and from whom you can obtain it. Usually, this information comes from a library, scriptorium, university, or a sage or other learned person or creature.',
      ],
    },
    entries: [
      'You spent years learning the lore of the multiverse. You scoured manuscripts, studied scrolls, and listened to the greatest experts on the subjects that interest you.',
    ],
  },
  {
    name: 'Soldier',
    source: 'PHB',
    page: 140,
    skillProficiencies: ['Athletics', 'Intimidation'],
    toolProficiencies: ['One type of gaming set', 'Vehicles (land)'],
    startingEquipment: [
      'An insignia of rank',
      'A trophy taken from a fallen enemy (a dagger, broken blade, or piece of a banner)',
      'A set of bone dice or deck of cards',
      'A set of common clothes',
      'A pouch containing 10 gp',
    ],
    feature: {
      name: 'Military Rank',
      entries: [
        'You have a military rank from your career as a soldier. Soldiers loyal to your former military organization still recognize your authority and influence, and they defer to you if they are of a lower rank. You can invoke your rank to exert influence over other soldiers and requisition simple equipment or horses for temporary use.',
      ],
    },
    entries: [
      'War has been your life for as long as you can remember. You trained as a youth, studied the use of weapons and armor, learned basic survival techniques, and served with honor.',
    ],
  },
  {
    name: 'Entertainer',
    source: 'PHB',
    page: 130,
    skillProficiencies: ['Acrobatics', 'Performance'],
    toolProficiencies: ['Disguise kit', 'One type of musical instrument'],
    startingEquipment: [
      'A musical instrument (one of your choice)',
      'The favor of an admirer (love letter, lock of hair, or trinket)',
      'A costume',
      'A pouch containing 15 gp',
    ],
    feature: {
      name: 'By Popular Demand',
      entries: [
        'You can always find a place to perform, usually in an inn or tavern but possibly with a circus, at a theater, or even in a noble’s court. At such a place, you receive free lodging and food of a modest or comfortable standard, as long as you perform each night.',
      ],
    },
    entries: [
      'You thrive in front of an audience. You know how to entrance them, entertain them, and even inspire them. Your poetics, music, or dance stirs their emotions.',
    ],
  },
  {
    name: 'Guild Artisan',
    source: 'PHB',
    page: 132,
    skillProficiencies: ['Insight', 'Persuasion'],
    toolProficiencies: ["One type of artisan's tools"],
    languages: ['One language of your choice'],
    startingEquipment: [
      "A set of artisan's tools",
      'A letter of introduction from your guild',
      'A set of traveler’s clothes',
      'A pouch containing 15 gp',
    ],
    feature: {
      name: 'Guild Membership',
      entries: [
        'As an established and respected member of a guild, you can rely on certain benefits that membership provides. Your fellow guild members will provide you with lodging and food if necessary, and pay for your funeral if needed.',
      ],
    },
    entries: [
      'You are a member of an artisan’s guild, skilled in a particular field and closely associated with other artisans. You are a well-established part of the mercantile world.',
    ],
  },
  {
    name: 'Outlander',
    source: 'PHB',
    page: 136,
    skillProficiencies: ['Athletics', 'Survival'],
    toolProficiencies: ['One type of musical instrument'],
    languages: ['One language of your choice'],
    startingEquipment: [
      'A staff',
      'A hunting trap',
      'A trophy from an animal you killed',
      'A set of traveler’s clothes',
      'A pouch containing 10 gp',
    ],
    feature: {
      name: 'Wanderer',
      entries: [
        'You have an excellent memory for maps and geography, and you can always recall the general layout of terrain, settlements, and other features around you. In addition, you can find fresh water and food for yourself and up to five other people each day, provided the land offers berries, small game, water, etc.',
      ],
    },
    entries: [
      'You grew up in the wilds, far from the comfort of town and technology. You’ve witnessed the migration of herds larger than forests, survived weather more extreme than any city-dweller can imagine, and enjoyed the solitude of being the only thinking creature for miles.',
    ],
  },
  {
    name: 'Urchin',
    source: 'PHB',
    page: 141,
    skillProficiencies: ['Sleight of Hand', 'Stealth'],
    toolProficiencies: ['Disguise kit', "Thieves' tools"],
    startingEquipment: [
      'A small knife',
      'A map of the city you grew up in',
      'A pet mouse',
      'A token to remember your parents by',
      'A set of common clothes',
      'A pouch containing 10 gp',
    ],
    feature: {
      name: 'City Secrets',
      entries: [
        'You know the secret patterns and flow to cities and can find passages through the urban sprawl that others would miss. When you are not in combat, you (and companions you lead) can travel between any two locations in the city twice as fast as your speed would normally allow.',
      ],
    },
    entries: [
      'You grew up on the rough streets alone, orphaned, and poor. You had no one to watch over you or provide for you, so you learned to provide for yourself.',
    ],
  },
];

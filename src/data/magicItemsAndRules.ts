/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface MagicItemEntry {
  id: string;
  name: string;
  type: string;
  rarity: 'Common' | 'Uncommon' | 'Rare' | 'Very Rare' | 'Legendary' | 'Artifact';
  attunement: boolean;
  attunementPrereq?: string;
  source: string;
  page?: number;
  weight?: number;
  description: string;
  properties?: string[];
}

export interface RuleEntry {
  id: string;
  name: string;
  category: 'Condition' | 'Combat Rule' | 'Adventuring Rule' | 'Environment';
  source: string;
  page?: number;
  description: string;
  bulletPoints: string[];
}

export const MAGIC_ITEMS: MagicItemEntry[] = [
  {
    id: 'mi_bag_of_holding',
    name: 'Bag of Holding',
    type: 'Wondrous Item',
    rarity: 'Uncommon',
    attunement: false,
    source: 'DMG',
    page: 153,
    weight: 15,
    description: 'This bag has an interior space considerably larger than its outside dimensions, roughly 2 feet in diameter at the mouth and 4 feet deep. The bag can hold up to 500 pounds, not exceeding a volume of 64 cubic feet. The bag always weighs 15 pounds, regardless of its contents.',
    properties: ['Capacity: 500 lbs / 64 cu. ft.', 'Weight: Always 15 lbs', 'Breathing: 10 person-minutes of air'],
  },
  {
    id: 'mi_cloak_of_protection',
    name: 'Cloak of Protection',
    type: 'Wondrous Item',
    rarity: 'Uncommon',
    attunement: true,
    source: 'DMG',
    page: 159,
    weight: 1,
    description: 'You gain a +1 bonus to Armor Class and saving throws while you wear this cloak.',
    properties: ['+1 AC', '+1 to all Saving Throws'],
  },
  {
    id: 'mi_boots_of_elvenkind',
    name: 'Boots of Elvenkind',
    type: 'Wondrous Item',
    rarity: 'Uncommon',
    attunement: false,
    source: 'DMG',
    page: 155,
    weight: 0.5,
    description: 'While you wear these boots, your steps make no sound, regardless of the surface you are moving across. You also have advantage on Dexterity (Stealth) checks that rely on moving silently.',
    properties: ['Silent movement', 'Advantage on Stealth (moving silently)'],
  },
  {
    id: 'mi_ring_of_protection',
    name: 'Ring of Protection',
    type: 'Ring',
    rarity: 'Rare',
    attunement: true,
    source: 'DMG',
    page: 191,
    weight: 0,
    description: 'You gain a +1 bonus to Armor Class and saving throws while wearing this ring.',
    properties: ['+1 AC', '+1 to all Saving Throws'],
  },
  {
    id: 'mi_flametongue',
    name: 'Flame Tongue Longsword',
    type: 'Weapon (Longsword)',
    rarity: 'Rare',
    attunement: true,
    source: 'DMG',
    page: 170,
    weight: 3,
    description: 'You can use a bonus action to speak this magic sword’s command word, causing flames to erupt from the blade. These flames shed bright light in a 40-foot radius and dim light for an additional 40 feet. While the sword is ablaze, it deals an extra 2d6 fire damage to any target it hits.',
    properties: ['Extra 2d6 Fire Damage on hit', 'Bonus Action ignite/extinguish', 'Sheds 40 ft bright / 40 ft dim light'],
  },
  {
    id: 'mi_sun_blade',
    name: 'Sun Blade',
    type: 'Weapon (Longsword)',
    rarity: 'Rare',
    attunement: true,
    source: 'DMG',
    page: 205,
    weight: 3,
    description: 'This item appears to be a longsword hilt. While grasping the hilt, you can use a bonus action to cause a blade of pure radiance to spring into existence. The weapon has finesse. It deals 1d8 radiant damage (or 1d10 versatile). You gain a +2 bonus to attack and damage rolls made with this weapon, which deals an extra 1d8 radiant damage to undead.',
    properties: ['+2 to Attack & Damage rolls', 'Pure radiant damage', 'Finesse property', 'Extra 1d8 radiant vs Undead'],
  },
  {
    id: 'mi_wand_of_magic_missiles',
    name: 'Wand of Magic Missiles',
    type: 'Wand',
    rarity: 'Uncommon',
    attunement: false,
    source: 'DMG',
    page: 211,
    weight: 1,
    description: 'This wand has 7 charges. While holding it, you can use an action to expend 1 or more of its charges to cast the Magic Missile spell from it. For 1 charge, you cast the 1st-level version. You can increase the spell slot level by one for each additional charge you expend. Regains 1d6 + 1 charges daily at dawn.',
    properties: ['7 Charges', 'Cast Magic Missile (1st-7th level)', 'Regains 1d6+1 charges at dawn'],
  },
  {
    id: 'mi_winged_boots',
    name: 'Winged Boots',
    type: 'Wondrous Item',
    rarity: 'Uncommon',
    attunement: true,
    source: 'DMG',
    page: 214,
    weight: 1,
    description: 'While you wear these boots, you have a flying speed equal to your walking speed. You can use the boots to fly for up to 4 hours, all at once or in several shorter flights, each one using a minimum of 1 minute from the duration.',
    properties: ['Fly speed = Walking speed', '4 hours fly duration per day', 'Regains 2 hours for every 12 hours unused'],
  },
  {
    id: 'mi_pearl_of_power',
    name: 'Pearl of Power',
    type: 'Wondrous Item',
    rarity: 'Uncommon',
    attunement: true,
    attunementPrereq: 'by a spellcaster',
    source: 'DMG',
    page: 184,
    weight: 0.1,
    description: 'While this pearl is on your person, you can use an action to speak its command word and regain one expended spell slot of up to 3rd level. Once used, the pearl can’t be used again until the next dawn.',
    properties: ['Regain one expended spell slot up to 3rd level', 'Usable once per day at dawn'],
  },
  {
    id: 'mi_potion_of_healing_standard',
    name: 'Potion of Healing',
    type: 'Potion',
    rarity: 'Common',
    attunement: false,
    source: 'PHB',
    page: 153,
    weight: 0.5,
    description: 'You regain 2d4 + 2 hit points when you drink this potion. Drinking or administering a potion takes an action.',
    properties: ['Regains 2d4+2 Hit Points', 'Consumable'],
  },
  {
    id: 'mi_potion_of_healing_greater',
    name: 'Potion of Greater Healing',
    type: 'Potion',
    rarity: 'Uncommon',
    attunement: false,
    source: 'DMG',
    page: 187,
    weight: 0.5,
    description: 'You regain 4d4 + 4 hit points when you drink this potion.',
    properties: ['Regains 4d4+4 Hit Points', 'Consumable'],
  },
  {
    id: 'mi_vorpal_sword',
    name: 'Vorpal Sword',
    type: 'Weapon (Any sword that deals slashing damage)',
    rarity: 'Legendary',
    attunement: true,
    source: 'DMG',
    page: 209,
    weight: 3,
    description: 'You gain a +3 bonus to attack and damage rolls made with this magic weapon. In addition, the weapon ignores resistance to slashing damage. When you attack a creature that has at least one head with this weapon and roll a 20 on the attack roll, you cut off one of the creature’s heads.',
    properties: ['+3 Attack & Damage bonus', 'Ignores Slashing Resistance', 'Decapitates on Natural 20'],
  },
];

export const CONDITIONS_AND_RULES: RuleEntry[] = [
  {
    id: 'rule_blinded',
    name: 'Blinded',
    category: 'Condition',
    source: 'PHB',
    page: 290,
    description: 'A blinded creature can’t see and automatically fails any ability check that requires sight.',
    bulletPoints: [
      'A blinded creature can’t see and automatically fails any ability check that requires sight.',
      'Attack rolls against the creature have advantage, and the creature’s attack rolls have disadvantage.',
    ],
  },
  {
    id: 'rule_charmed',
    name: 'Charmed',
    category: 'Condition',
    source: 'PHB',
    page: 290,
    description: 'A charmed creature can’t attack the charmer or target the charmer with harmful abilities or magical effects.',
    bulletPoints: [
      'A charmed creature can’t attack the charmer or target the charmer with harmful abilities or magical effects.',
      'The charmer has advantage on any ability check to interact socially with the creature.',
    ],
  },
  {
    id: 'rule_deafened',
    name: 'Deafened',
    category: 'Condition',
    source: 'PHB',
    page: 290,
    description: 'A deafened creature can’t hear and automatically fails any ability check that requires hearing.',
    bulletPoints: ['A deafened creature can’t hear and automatically fails any ability check that requires hearing.'],
  },
  {
    id: 'rule_frightened',
    name: 'Frightened',
    category: 'Condition',
    source: 'PHB',
    page: 290,
    description: 'A frightened creature has disadvantage on ability checks and attack rolls while the source of its fear is within line of sight.',
    bulletPoints: [
      'A frightened creature has disadvantage on ability checks and attack rolls while the source of its fear is within line of sight.',
      'The creature can’t willingly move closer to the source of its fear.',
    ],
  },
  {
    id: 'rule_grappled',
    name: 'Grappled',
    category: 'Condition',
    source: 'PHB',
    page: 290,
    description: 'A grappled creature’s speed becomes 0, and it can’t benefit from any bonus to its speed.',
    bulletPoints: [
      'A grappled creature’s speed becomes 0, and it can’t benefit from any bonus to its speed.',
      'The condition ends if the grappler is incapacitated.',
      'The condition also ends if an effect removes the grappled creature from the reach of the grappler or grappling effect.',
    ],
  },
  {
    id: 'rule_incapacitated',
    name: 'Incapacitated',
    category: 'Condition',
    source: 'PHB',
    page: 290,
    description: 'An incapacitated creature can’t take actions or reactions.',
    bulletPoints: [
      'An incapacitated creature can’t take actions or reactions.',
      'Concentration on spells is immediately broken when incapacitated.',
    ],
  },
  {
    id: 'rule_invisible',
    name: 'Invisible',
    category: 'Condition',
    source: 'PHB',
    page: 291,
    description: 'An invisible creature is impossible to see without the aid of magic or a special sense.',
    bulletPoints: [
      'An invisible creature is impossible to see without the aid of magic or a special sense.',
      'For the purpose of hiding, the creature is heavily obscured. The creature’s location can be detected by any noise it makes or tracks it leaves.',
      'Attack rolls against the creature have disadvantage, and the creature’s attack rolls have advantage.',
    ],
  },
  {
    id: 'rule_paralyzed',
    name: 'Paralyzed',
    category: 'Condition',
    source: 'PHB',
    page: 291,
    description: 'A paralyzed creature is incapacitated and can’t move or speak.',
    bulletPoints: [
      'A paralyzed creature is incapacitated (can’t take actions or reactions) and can’t move or speak.',
      'The creature automatically fails Strength and Dexterity saving throws.',
      'Attack rolls against the creature have advantage.',
      'Any attack that hits the creature is a critical hit if the attacker is within 5 feet of the creature.',
    ],
  },
  {
    id: 'rule_petrified',
    name: 'Petrified',
    category: 'Condition',
    source: 'PHB',
    page: 291,
    description: 'A petrified creature is transformed, along with any nonmagical object it is wearing or carrying, into a solid inanimate substance (usually stone).',
    bulletPoints: [
      'Its weight increases by a factor of ten, and it ceases aging.',
      'The creature is incapacitated, can’t move or speak, and is unaware of its surroundings.',
      'Attack rolls against the creature have advantage.',
      'The creature automatically fails Strength and Dexterity saving throws.',
      'The creature has resistance to all damage, and is immune to poison and disease.',
    ],
  },
  {
    id: 'rule_poisoned',
    name: 'Poisoned',
    category: 'Condition',
    source: 'PHB',
    page: 292,
    description: 'A poisoned creature has disadvantage on attack rolls and ability checks.',
    bulletPoints: ['A poisoned creature has disadvantage on attack rolls and ability checks.'],
  },
  {
    id: 'rule_prone',
    name: 'Prone',
    category: 'Condition',
    source: 'PHB',
    page: 292,
    description: 'A prone creature’s only movement option is to crawl, unless it stands up and thereby ends the condition.',
    bulletPoints: [
      'Standing up costs an amount of movement equal to half your speed.',
      'The creature has disadvantage on attack rolls.',
      'An attack roll against the creature has advantage if the attacker is within 5 feet of the creature. Otherwise, the attack roll has disadvantage.',
    ],
  },
  {
    id: 'rule_restrained',
    name: 'Restrained',
    category: 'Condition',
    source: 'PHB',
    page: 292,
    description: 'A restrained creature’s speed becomes 0, and it can’t benefit from any bonus to its speed.',
    bulletPoints: [
      'A restrained creature’s speed becomes 0, and it can’t benefit from any bonus to its speed.',
      'Attack rolls against the creature have advantage, and the creature’s attack rolls have disadvantage.',
      'The creature has disadvantage on Dexterity saving throws.',
    ],
  },
  {
    id: 'rule_stunned',
    name: 'Stunned',
    category: 'Condition',
    source: 'PHB',
    page: 292,
    description: 'A stunned creature is incapacitated, can’t move, and can speak only falteringly.',
    bulletPoints: [
      'A stunned creature is incapacitated, can’t move, and can speak only falteringly.',
      'The creature automatically fails Strength and Dexterity saving throws.',
      'Attack rolls against the creature have advantage.',
    ],
  },
  {
    id: 'rule_unconscious',
    name: 'Unconscious',
    category: 'Condition',
    source: 'PHB',
    page: 292,
    description: 'An unconscious creature is incapacitated, can’t move or speak, and is unaware of its surroundings.',
    bulletPoints: [
      'The creature drops whatever it’s holding and falls prone.',
      'The creature automatically fails Strength and Dexterity saving throws.',
      'Attack rolls against the creature have advantage.',
      'Any attack that hits the creature is a critical hit if the attacker is within 5 feet of the creature.',
    ],
  },
  {
    id: 'rule_exhaustion',
    name: 'Exhaustion',
    category: 'Condition',
    source: 'PHB',
    page: 291,
    description: 'Exhaustion is measured in six cumulative levels. An effect can give a creature one or more levels of exhaustion.',
    bulletPoints: [
      'Level 1: Disadvantage on ability checks',
      'Level 2: Speed halved',
      'Level 3: Disadvantage on attack rolls and saving throws',
      'Level 4: Hit point maximum halved',
      'Level 5: Speed reduced to 0',
      'Level 6: Death',
      'Finishing a long rest reduces a creature’s exhaustion level by 1, provided the creature has food and water.',
    ],
  },
  {
    id: 'rule_concentration',
    name: 'Concentration',
    category: 'Combat Rule',
    source: 'PHB',
    page: 203,
    description: 'Some spells require concentration to keep their magic active. If you lose concentration, such a spell ends.',
    bulletPoints: [
      'You lose concentration if you cast another spell that requires concentration.',
      'Taking damage: Make a DC 10 Constitution saving throw, or half the damage taken (whichever is higher).',
      'Being incapacitated or killed instantly ends concentration.',
    ],
  },
];

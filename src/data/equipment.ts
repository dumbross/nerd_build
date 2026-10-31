/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ArmorItem, GearItem, WeaponItem } from '../types/character';

export const FIVE_TOOLS_WEAPONS: WeaponItem[] = [
  // Simple Melee Weapons
  { id: 'w_club', name: 'Club', category: 'Simple Melee', damage: '1d4', damageType: 'bludgeoning', properties: ['light'], weight: 2, cost: '1 sp' },
  { id: 'w_dagger', name: 'Dagger', category: 'Simple Melee', damage: '1d4', damageType: 'piercing', properties: ['finesse', 'light', 'thrown'], range: '20/60', weight: 1, cost: '2 gp' },
  { id: 'w_greatclub', name: 'Greatclub', category: 'Simple Melee', damage: '1d8', damageType: 'bludgeoning', properties: ['two-handed'], weight: 10, cost: '2 sp' },
  { id: 'w_handaxe', name: 'Handaxe', category: 'Simple Melee', damage: '1d6', damageType: 'slashing', properties: ['light', 'thrown'], range: '20/60', weight: 2, cost: '5 gp' },
  { id: 'w_javelin', name: 'Javelin', category: 'Simple Melee', damage: '1d6', damageType: 'piercing', properties: ['thrown'], range: '30/120', weight: 2, cost: '5 sp' },
  { id: 'w_light_hammer', name: 'Light Hammer', category: 'Simple Melee', damage: '1d4', damageType: 'bludgeoning', properties: ['light', 'thrown'], range: '20/60', weight: 2, cost: '2 gp' },
  { id: 'w_mace', name: 'Mace', category: 'Simple Melee', damage: '1d6', damageType: 'bludgeoning', properties: [], weight: 4, cost: '5 gp' },
  { id: 'w_quarterstaff', name: 'Quarterstaff', category: 'Simple Melee', damage: '1d6', damageType: 'bludgeoning', properties: ['versatile (1d8)'], weight: 4, cost: '2 sp' },
  { id: 'w_sickle', name: 'Sickle', category: 'Simple Melee', damage: '1d4', damageType: 'slashing', properties: ['light'], weight: 2, cost: '1 gp' },
  { id: 'w_spear', name: 'Spear', category: 'Simple Melee', damage: '1d6', damageType: 'piercing', properties: ['thrown', 'versatile (1d8)'], range: '20/60', weight: 3, cost: '1 gp' },
  { id: 'w_yklwa', name: 'Yklwa', category: 'Simple Melee', damage: '1d8', damageType: 'piercing', properties: ['thrown'], range: '10/30', weight: 2, cost: '1 gp' },

  // Simple Ranged Weapons
  { id: 'w_light_crossbow', name: 'Light Crossbow', category: 'Simple Ranged', damage: '1d8', damageType: 'piercing', properties: ['ammunition', 'loading', 'two-handed'], range: '80/320', weight: 5, cost: '25 gp' },
  { id: 'w_dart', name: 'Dart', category: 'Simple Ranged', damage: '1d4', damageType: 'piercing', properties: ['finesse', 'thrown'], range: '20/60', weight: 0.25, cost: '5 cp' },
  { id: 'w_shortbow', name: 'Shortbow', category: 'Simple Ranged', damage: '1d6', damageType: 'piercing', properties: ['ammunition', 'two-handed'], range: '80/320', weight: 2, cost: '25 gp' },
  { id: 'w_sling', name: 'Sling', category: 'Simple Ranged', damage: '1d4', damageType: 'bludgeoning', properties: ['ammunition'], range: '30/120', weight: 0, cost: '1 sp' },

  // Martial Melee Weapons
  { id: 'w_battleaxe', name: 'Battleaxe', category: 'Martial Melee', damage: '1d8', damageType: 'slashing', properties: ['versatile (1d10)'], weight: 4, cost: '10 gp' },
  { id: 'w_flail', name: 'Flail', category: 'Martial Melee', damage: '1d8', damageType: 'bludgeoning', properties: [], weight: 2, cost: '10 gp' },
  { id: 'w_glaive', name: 'Glaive', category: 'Martial Melee', damage: '1d10', damageType: 'slashing', properties: ['heavy', 'reach', 'two-handed'], weight: 6, cost: '20 gp' },
  { id: 'w_greataxe', name: 'Greataxe', category: 'Martial Melee', damage: '1d12', damageType: 'slashing', properties: ['heavy', 'two-handed'], weight: 7, cost: '30 gp' },
  { id: 'w_greatsword', name: 'Greatsword', category: 'Martial Melee', damage: '2d6', damageType: 'slashing', properties: ['heavy', 'two-handed'], weight: 6, cost: '50 gp' },
  { id: 'w_halberd', name: 'Halberd', category: 'Martial Melee', damage: '1d10', damageType: 'slashing', properties: ['heavy', 'reach', 'two-handed'], weight: 6, cost: '20 gp' },
  { id: 'w_lance', name: 'Lance', category: 'Martial Melee', damage: '1d12', damageType: 'piercing', properties: ['reach', 'special'], weight: 6, cost: '10 gp' },
  { id: 'w_longsword', name: 'Longsword', category: 'Martial Melee', damage: '1d8', damageType: 'slashing', properties: ['versatile (1d10)'], weight: 3, cost: '15 gp' },
  { id: 'w_maul', name: 'Maul', category: 'Martial Melee', damage: '2d6', damageType: 'bludgeoning', properties: ['heavy', 'two-handed'], weight: 10, cost: '10 gp' },
  { id: 'w_morningstar', name: 'Morningstar', category: 'Martial Melee', damage: '1d8', damageType: 'piercing', properties: [], weight: 4, cost: '15 gp' },
  { id: 'w_pike', name: 'Pike', category: 'Martial Melee', damage: '1d10', damageType: 'piercing', properties: ['heavy', 'reach', 'two-handed'], weight: 18, cost: '5 gp' },
  { id: 'w_rapier', name: 'Rapier', category: 'Martial Melee', damage: '1d8', damageType: 'piercing', properties: ['finesse'], weight: 2, cost: '25 gp' },
  { id: 'w_scimitar', name: 'Scimitar', category: 'Martial Melee', damage: '1d6', damageType: 'slashing', properties: ['finesse', 'light'], weight: 3, cost: '25 gp' },
  { id: 'w_shortsword', name: 'Shortsword', category: 'Martial Melee', damage: '1d6', damageType: 'piercing', properties: ['finesse', 'light'], weight: 2, cost: '10 gp' },
  { id: 'w_trident', name: 'Trident', category: 'Martial Melee', damage: '1d6', damageType: 'piercing', properties: ['thrown', 'versatile (1d8)'], range: '20/60', weight: 4, cost: '5 gp' },
  { id: 'w_war_pick', name: 'War Pick', category: 'Martial Melee', damage: '1d8', damageType: 'piercing', properties: [], weight: 2, cost: '5 gp' },
  { id: 'w_warhammer', name: 'Warhammer', category: 'Martial Melee', damage: '1d8', damageType: 'bludgeoning', properties: ['versatile (1d10)'], weight: 2, cost: '15 gp' },
  { id: 'w_whip', name: 'Whip', category: 'Martial Melee', damage: '1d4', damageType: 'slashing', properties: ['finesse', 'reach'], weight: 3, cost: '2 gp' },
  { id: 'w_double_scimitar', name: 'Double-Bladed Scimitar', category: 'Martial Melee', damage: '2d4', damageType: 'slashing', properties: ['two-handed', 'special'], weight: 6, cost: '100 gp' },

  // Martial Ranged Weapons
  { id: 'w_blowgun', name: 'Blowgun', category: 'Martial Ranged', damage: '1', damageType: 'piercing', properties: ['ammunition', 'loading'], range: '25/100', weight: 1, cost: '10 gp' },
  { id: 'w_hand_crossbow', name: 'Hand Crossbow', category: 'Martial Ranged', damage: '1d6', damageType: 'piercing', properties: ['ammunition', 'light', 'loading'], range: '30/120', weight: 3, cost: '75 gp' },
  { id: 'w_heavy_crossbow', name: 'Heavy Crossbow', category: 'Martial Ranged', damage: '1d10', damageType: 'piercing', properties: ['ammunition', 'heavy', 'loading', 'two-handed'], range: '100/400', weight: 18, cost: '50 gp' },
  { id: 'w_longbow', name: 'Longbow', category: 'Martial Ranged', damage: '1d8', damageType: 'piercing', properties: ['ammunition', 'heavy', 'two-handed'], range: '150/600', weight: 2, cost: '50 gp' },
  { id: 'w_net', name: 'Net', category: 'Martial Ranged', damage: '0', damageType: 'special', properties: ['thrown', 'special'], range: '5/15', weight: 3, cost: '1 gp' },

  // 5e.tools Renaissance Firearms (DMG / TCE)
  { id: 'w_pistol', name: 'Pistol', category: 'Martial Ranged', damage: '1d10', damageType: 'piercing', properties: ['ammunition', 'loading'], range: '30/90', weight: 3, cost: '250 gp' },
  { id: 'w_musket', name: 'Musket', category: 'Martial Ranged', damage: '1d12', damageType: 'piercing', properties: ['ammunition', 'loading', 'two-handed'], range: '40/120', weight: 10, cost: '500 gp' },

  // Magic & Enhanced Weapons
  { id: 'w_weapon_plus1', name: 'Weapon +1', category: 'Martial Melee', damage: '1d8+1', damageType: 'slashing', properties: ['magical', 'versatile (1d10+1)'], weight: 3, cost: '500 gp' },
  { id: 'w_weapon_plus2', name: 'Weapon +2', category: 'Martial Melee', damage: '1d8+2', damageType: 'slashing', properties: ['magical', 'versatile (1d10+2)'], weight: 3, cost: '2,000 gp' },
  { id: 'w_flame_tongue', name: 'Flame Tongue Longsword', category: 'Martial Melee', damage: '1d8 (+2d6 fire)', damageType: 'slashing/fire', properties: ['magical', 'versatile (1d10)'], weight: 3, cost: '5,000 gp' },
  { id: 'w_sun_blade', name: 'Sun Blade', category: 'Martial Melee', damage: '1d8+2', damageType: 'radiant', properties: ['finesse', 'magical', 'versatile (1d10+2)'], weight: 3, cost: '8,000 gp' },
  { id: 'w_moon_touched', name: 'Moon-Touched Sword', category: 'Martial Melee', damage: '1d8', damageType: 'slashing', properties: ['magical', 'sheds moonlight', 'versatile (1d10)'], weight: 3, cost: '100 gp' },
];

export const FIVE_TOOLS_ARMOR: ArmorItem[] = [
  // Light Armor
  { id: 'a_padded', name: 'Padded', category: 'Light', ac: 11, dexBonus: 'full', stealthDisadvantage: true, weight: 8, cost: '5 gp' },
  { id: 'a_leather', name: 'Leather Armor', category: 'Light', ac: 11, dexBonus: 'full', weight: 10, cost: '10 gp' },
  { id: 'a_studded_leather', name: 'Studded Leather', category: 'Light', ac: 12, dexBonus: 'full', weight: 13, cost: '45 gp' },
  { id: 'a_studded_leather_plus1', name: 'Studded Leather +1', category: 'Light', ac: 13, dexBonus: 'full', weight: 13, cost: '1,500 gp' },

  // Medium Armor
  { id: 'a_hide', name: 'Hide Armor', category: 'Medium', ac: 12, dexBonus: 'max2', weight: 12, cost: '10 gp' },
  { id: 'a_chain_shirt', name: 'Chain Shirt', category: 'Medium', ac: 13, dexBonus: 'max2', weight: 20, cost: '50 gp' },
  { id: 'a_scale_mail', name: 'Scale Mail', category: 'Medium', ac: 14, dexBonus: 'max2', stealthDisadvantage: true, weight: 45, cost: '50 gp' },
  { id: 'a_spiked_armor', name: 'Spiked Armor', category: 'Medium', ac: 14, dexBonus: 'max2', stealthDisadvantage: true, weight: 45, cost: '75 gp' },
  { id: 'a_breastplate', name: 'Breastplate', category: 'Medium', ac: 14, dexBonus: 'max2', weight: 20, cost: '400 gp' },
  { id: 'a_half_plate', name: 'Half Plate', category: 'Medium', ac: 15, dexBonus: 'max2', stealthDisadvantage: true, weight: 40, cost: '750 gp' },
  { id: 'a_breastplate_plus1', name: 'Breastplate +1', category: 'Medium', ac: 15, dexBonus: 'max2', weight: 20, cost: '2,500 gp' },
  { id: 'a_half_plate_plus1', name: 'Half Plate +1', category: 'Medium', ac: 16, dexBonus: 'max2', stealthDisadvantage: true, weight: 40, cost: '3,000 gp' },
  { id: 'a_mithral_half_plate', name: 'Mithral Half Plate (No Stealth Disadv)', category: 'Medium', ac: 15, dexBonus: 'max2', stealthDisadvantage: false, weight: 20, cost: '1,200 gp' },

  // Heavy Armor
  { id: 'a_ring_mail', name: 'Ring Mail', category: 'Heavy', ac: 14, dexBonus: 'none', stealthDisadvantage: true, weight: 40, cost: '30 gp' },
  { id: 'a_chain_mail', name: 'Chain Mail', category: 'Heavy', ac: 16, dexBonus: 'none', stealthDisadvantage: true, minStr: 13, weight: 55, cost: '75 gp' },
  { id: 'a_splint', name: 'Splint Armor', category: 'Heavy', ac: 17, dexBonus: 'none', stealthDisadvantage: true, minStr: 15, weight: 60, cost: '200 gp' },
  { id: 'a_plate', name: 'Plate Armor', category: 'Heavy', ac: 18, dexBonus: 'none', stealthDisadvantage: true, minStr: 15, weight: 65, cost: '1,500 gp' },
  { id: 'a_plate_plus1', name: 'Plate Armor +1', category: 'Heavy', ac: 19, dexBonus: 'none', stealthDisadvantage: true, minStr: 15, weight: 65, cost: '5,000 gp' },
  { id: 'a_plate_plus2', name: 'Plate Armor +2', category: 'Heavy', ac: 20, dexBonus: 'none', stealthDisadvantage: true, minStr: 15, weight: 65, cost: '15,000 gp' },
  { id: 'a_adamantine_plate', name: 'Adamantine Plate (Crit Immune)', category: 'Heavy', ac: 18, dexBonus: 'none', stealthDisadvantage: true, minStr: 15, weight: 65, cost: '2,000 gp' },

  // Shields
  { id: 'a_shield', name: 'Shield', category: 'Shield', ac: 2, dexBonus: 'none', weight: 6, cost: '10 gp' },
  { id: 'a_shield_plus1', name: 'Shield +1', category: 'Shield', ac: 3, dexBonus: 'none', weight: 6, cost: '1,000 gp' },
  { id: 'a_shield_plus2', name: 'Shield +2', category: 'Shield', ac: 4, dexBonus: 'none', weight: 6, cost: '4,000 gp' },
  { id: 'a_sentinel_shield', name: 'Sentinel Shield (Adv on Initiative & Perception)', category: 'Shield', ac: 2, dexBonus: 'none', weight: 6, cost: '1,500 gp' },
];

export const FIVE_TOOLS_STANDARD_GEAR: GearItem[] = [
  // Packs
  { id: 'g_backpack', name: 'Backpack', category: 'Gear', quantity: 1, weight: 5, cost: '2 gp', description: 'Can hold 1 cubic foot or 30 pounds of gear.' },
  { id: 'g_bedroll', name: 'Bedroll', category: 'Gear', quantity: 1, weight: 7, cost: '1 gp' },
  { id: 'g_mess_kit', name: 'Mess Kit', category: 'Gear', quantity: 1, weight: 1, cost: '2 sp' },
  { id: 'g_tinderbox', name: 'Tinderbox', category: 'Gear', quantity: 1, weight: 1, cost: '5 sp' },
  { id: 'g_torches', name: 'Torches (10)', category: 'Gear', quantity: 10, weight: 10, cost: '1 sp', description: 'Burns for 1 hour, providing bright light in a 20-foot radius.' },
  { id: 'g_rations', name: 'Rations (1 day)', category: 'Gear', quantity: 10, weight: 20, cost: '5 gp' },
  { id: 'g_waterskin', name: 'Waterskin', category: 'Gear', quantity: 1, weight: 5, cost: '2 sp', description: 'Holds 4 pints of liquid.' },
  { id: 'g_hempen_rope', name: 'Hempen Rope (50 ft)', category: 'Gear', quantity: 1, weight: 10, cost: '1 gp' },
  { id: 'g_silk_rope', name: 'Silk Rope (50 ft)', category: 'Gear', quantity: 1, weight: 5, cost: '10 gp', description: 'Lightweight superior climbing rope.' },
  { id: 'g_grappling_hook', name: 'Grappling Hook', category: 'Gear', quantity: 1, weight: 4, cost: '2 gp' },
  { id: 'g_crowbar', name: 'Crowbar', category: 'Gear', quantity: 1, weight: 5, cost: '2 gp', description: 'Grants advantage to Strength checks to pry open objects.' },
  { id: 'g_hooded_lantern', name: 'Hooded Lantern', category: 'Gear', quantity: 1, weight: 2, cost: '5 gp', description: 'Casts bright light in a 30-foot radius and dim light for an additional 30 feet.' },
  { id: 'g_oil_flask', name: 'Flask of Oil', category: 'Gear', quantity: 3, weight: 3, cost: '3 sp' },
  { id: 'g_manacles', name: 'Manacles', category: 'Gear', quantity: 1, weight: 6, cost: '2 gp' },
  { id: 'g_spyglass', name: 'Spyglass', category: 'Gear', quantity: 1, weight: 1, cost: '1,000 gp', description: 'Magnifies objects to twice their size.' },
  { id: 'g_magnifying_glass', name: 'Magnifying Glass', category: 'Gear', quantity: 1, weight: 0.5, cost: '100 gp', description: 'Grants advantage on ability checks to appraise or examine small objects.' },

  // Tools & Kits
  { id: 'g_thieves_tools', name: "Thieves' Tools", category: 'Tools', quantity: 1, weight: 1, cost: '25 gp', description: 'Lockpicks, files, miniature shears, and small mirror.' },
  { id: 'g_tinker_tools', name: "Tinker's Tools", category: 'Tools', quantity: 1, weight: 10, cost: '50 gp', description: 'Small hammer, pliers, wire, glue, whetstone, clockwork gears.' },
  { id: 'g_smith_tools', name: "Smith's Tools", category: 'Tools', quantity: 1, weight: 8, cost: '20 gp' },
  { id: 'g_alchemist_supplies', name: "Alchemist's Supplies", category: 'Tools', quantity: 1, weight: 8, cost: '50 gp' },
  { id: 'g_herbalism_kit', name: 'Herbalism Kit', category: 'Tools', quantity: 1, weight: 3, cost: '5 gp', description: 'Required for identifying medicinal plants and crafting healing potions.' },
  { id: 'g_poisoner_kit', name: "Poisoner's Kit", category: 'Tools', quantity: 1, weight: 2, cost: '50 gp' },
  { id: 'g_disguise_kit', name: 'Disguise Kit', category: 'Tools', quantity: 1, weight: 3, cost: '25 gp', description: 'Cosmetics, hair dye, small props, and clothing items.' },
  { id: 'g_forgery_kit', name: 'Forgery Kit', category: 'Tools', quantity: 1, weight: 5, cost: '15 gp' },
  { id: 'g_navigator_tools', name: "Navigator's Tools", category: 'Tools', quantity: 1, weight: 2, cost: '25 gp' },
  { id: 'g_musical_lute', name: 'Lute', category: 'Tools', quantity: 1, weight: 2, cost: '35 gp' },
  { id: 'g_musical_flute', name: 'Flute', category: 'Tools', quantity: 1, weight: 1, cost: '2 gp' },

  // Spellcasting Focuses
  { id: 'g_arcane_focus', name: 'Arcane Focus (Wand/Crystal)', category: 'Focus', quantity: 1, weight: 1, cost: '10 gp' },
  { id: 'g_holy_symbol', name: 'Holy Symbol (Amulet)', category: 'Focus', quantity: 1, weight: 1, cost: '5 gp' },
  { id: 'g_druidic_focus', name: 'Druidic Focus (Wooden Staff)', category: 'Focus', quantity: 1, weight: 4, cost: '5 gp' },
  { id: 'g_component_pouch', name: 'Component Pouch', category: 'Focus', quantity: 1, weight: 2, cost: '25 gp' },
  { id: 'g_spellbook', name: 'Blank Spellbook (100 parchment pages)', category: 'Gear', quantity: 1, weight: 3, cost: '50 gp' },

  // Consumables & Potions
  { id: 'g_potion_healing', name: 'Potion of Healing', category: 'Consumable', quantity: 2, weight: 1, cost: '50 gp', description: 'Regains 2d4 + 2 hit points when drank.' },
  { id: 'g_potion_greater', name: 'Potion of Greater Healing', category: 'Consumable', quantity: 1, weight: 1, cost: '150 gp', description: 'Regains 4d4 + 4 hit points when drank.' },
  { id: 'g_potion_superior', name: 'Potion of Superior Healing', category: 'Consumable', quantity: 1, weight: 1, cost: '450 gp', description: 'Regains 8d4 + 8 hit points when drank.' },
  { id: 'g_antitoxin', name: 'Antitoxin (vial)', category: 'Consumable', quantity: 1, weight: 0.5, cost: '50 gp', description: 'Advantage on saving throws against poison for 1 hour.' },
  { id: 'g_holy_water', name: 'Holy Water (flask)', category: 'Consumable', quantity: 1, weight: 1, cost: '25 gp', description: 'Deals 2d6 radiant damage to fiends and undead.' },
  { id: 'g_alchemists_fire', name: "Alchemist's Fire (flask)", category: 'Consumable', quantity: 1, weight: 1, cost: '50 gp', description: 'Adheres to a target and deals 1d4 fire damage at the start of each turn.' },

  // Ammunition
  { id: 'g_quiver_arrows', name: 'Quiver with 20 Arrows', category: 'Ammunition', quantity: 20, weight: 2, cost: '2 gp' },
  { id: 'g_crossbow_bolts', name: 'Crossbow Bolt Case (20 bolts)', category: 'Ammunition', quantity: 20, weight: 2, cost: '2 gp' },
  { id: 'g_sling_bullets', name: 'Sling Bullets (20)', category: 'Ammunition', quantity: 20, weight: 1.5, cost: '4 cp' },

  // Magic Items from 5e.tools
  { id: 'g_bag_of_holding', name: 'Bag of Holding', category: 'Magic Item', quantity: 1, weight: 15, cost: '500 gp', description: 'Holds up to 500 lbs and 64 cubic feet while always weighing 15 lbs.' },
  { id: 'g_cloak_protection', name: 'Cloak of Protection', category: 'Magic Item', quantity: 1, weight: 1, cost: '1,500 gp', description: 'Grants +1 bonus to AC and all saving throws.' },
  { id: 'g_ring_protection', name: 'Ring of Protection', category: 'Magic Item', quantity: 1, weight: 0, cost: '2,500 gp', description: 'Grants +1 bonus to AC and all saving throws.' },
  { id: 'g_boots_elvenkind', name: 'Boots of Elvenkind', category: 'Magic Item', quantity: 1, weight: 1, cost: '800 gp', description: 'Your steps make no sound, granting advantage on Stealth checks to move silently.' },
  { id: 'g_goggles_night', name: 'Goggles of Night', category: 'Magic Item', quantity: 1, weight: 0.5, cost: '1,200 gp', description: 'Grants darkvision out to 60 feet or extends existing darkvision by 60 feet.' },
  { id: 'g_pearl_power', name: 'Pearl of Power', category: 'Magic Item', quantity: 1, weight: 0.1, cost: '2,000 gp', description: 'Action to regain one expended spell slot up to 3rd level once per day.' },
  { id: 'g_immovable_rod', name: 'Immovable Rod', category: 'Magic Item', quantity: 1, weight: 2, cost: '1,000 gp', description: 'Button click fixes rod in place magically, holding up to 8,000 pounds.' },
  { id: 'g_winged_boots', name: 'Winged Boots', category: 'Magic Item', quantity: 1, weight: 1, cost: '4,000 gp', description: 'Grants flying speed equal to your walking speed for up to 4 hours per day.' },
  { id: 'g_bracers_defense', name: 'Bracers of Defense', category: 'Magic Item', quantity: 1, weight: 1, cost: '3,000 gp', description: '+2 bonus to AC while wearing no armor and using no shield.' },
];

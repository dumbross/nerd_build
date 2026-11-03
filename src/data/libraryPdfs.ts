/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface LibraryTome {
  id: string;
  title: string;
  subtitle: string;
  category: 'Monsters & Foes' | 'Player Expansions' | 'Draconic Lore' | 'Adventures & Modules' | 'Custom';
  description: string;
  sourceCode: string;
  driveUrl: string; // File or folder link in Google Drive
  pageCount?: number;
  coverAccent: string; // Hex color for stylized spine/badge
  tags: string[];
  addedAt: string;
}

export const INITIAL_LIBRARY_TOMES: LibraryTome[] = [
  {
    id: 'tome_volos_guide_to_monsters',
    title: "Volo's Guide to Monsters (Deluxe)",
    subtitle: 'Monster Lore, Playable Monstrous Races & Bestiary',
    category: 'Monsters & Foes',
    description:
      'Immerse yourself in monster lore featuring Beholders, Giants, Gnolls, Goblinoids, Hags, Kobolds, Mind Flayers, Orcs, and Yuan-ti. Includes playable monstrous character races and dozens of stat blocks.',
    sourceCode: 'VGM',
    driveUrl: '',
    pageCount: 224,
    coverAccent: '#1E3A8A', // Deep arcane blue
    tags: ['Bestiary', 'Monster Lore', 'Subraces', 'Monstrous Races', 'Deluxe'],
    addedAt: '2026-11-03',
  },
  {
    id: 'tome_tashas_cauldron_of_everything',
    title: "Tasha's Cauldron of Everything",
    subtitle: 'Artificer Class, Subclasses, Group Patrons & Magic Rules (HQ, Both Covers)',
    category: 'Player Expansions',
    description:
      'A vast cauldron of character options including the official Artificer class, new subclasses for every 5e class, character origin customization, group patrons, spells, magical tattoos, and DM environment rules.',
    sourceCode: 'TCE',
    driveUrl: '',
    pageCount: 192,
    coverAccent: '#6B21A8', // Witchcraft purple
    tags: ['Artificer', 'Subclasses', 'Group Patrons', 'Feats', 'Puzzles', 'HQ OCR'],
    addedAt: '2026-11-03',
  },
  {
    id: 'tome_mordenkainens_tome_of_foes',
    title: "Mordenkainen's Tome of Foes",
    subtitle: 'The Blood War, Planar Conflicts & High-CR Horrors',
    category: 'Monsters & Foes',
    description:
      'Uncovers the deep cosmic conflicts of the multiverse: the Blood War between demons and devils, the schisms of the Elves, the dwarf and duergan wars, the gith civil war, plus high-challenge creatures and Archdevils.',
    sourceCode: 'MTF',
    driveUrl: '',
    pageCount: 256,
    coverAccent: '#991B1B', // Deep blood crimson
    tags: ['Blood War', 'Fiends', 'Archdevils', 'Elven Lore', 'High CR', 'Planar'],
    addedAt: '2026-11-03',
  },
  {
    id: 'tome_fizbans_treasury_of_dragons',
    title: "Fizban's Treasury of Dragons",
    subtitle: 'Chromatic, Metallic & Gem Dragons, Subclasses & Lairs (HQ OCR Bookmarked)',
    category: 'Draconic Lore',
    description:
      'The definitive guide to dragons in the D&D multiverse. Introduces Gem Dragons (Amethyst, Crystal, Emerald, Sapphire, Topaz), Greatwyrms, Draconic Monk & Ranger subclasses, dragon hoards, lairs, and Draconomicon lore.',
    sourceCode: 'FTD',
    driveUrl: '',
    pageCount: 224,
    coverAccent: '#B45309', // Burnished dragon amber / gold
    tags: ['Gem Dragons', 'Greatwyrms', 'Draconic Subclasses', 'Hoards', 'Lairs', 'HQ OCR'],
    addedAt: '2026-11-03',
  },
];

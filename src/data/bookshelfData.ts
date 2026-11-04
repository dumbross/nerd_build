/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface BookshelfBook {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  filename: string;
  fileId: string;
  driveViewUrl: string;
  driveDownloadUrl: string;
  drivePreviewUrl: string;
  thumbnailUrl: string;
  pageCount: number;
  fileSize: string;
  sourceCategory: 'Core Expansion' | 'Monsters & Foes' | 'Lore & Dragons';
  description: string;
  contents: string[];
  color: {
    accent: string;
    border: string;
    badgeBg: string;
    badgeText: string;
    gradientFrom: string;
    gradientTo: string;
  };
}

export const GOOGLE_DRIVE_FOLDER_URL =
  'https://drive.google.com/drive/folders/1Qyi9pRVT_uvXcnGaQfBAqhjUzSZ9zZTo?usp=drive_link';

export const BOOKSHELF_BOOKS: BookshelfBook[] = [
  {
    id: 'book_tce',
    code: 'TCE',
    title: "Tasha's Cauldron of Everything",
    subtitle: 'Subclasses, Spells, Magical Tattoos & Group Patrons',
    filename: "Tasha's Cauldron of Everything (HQ, Both Covers).pdf",
    fileId: '1G9h0BRj97qdmlv1gOCaXTWtJ8lIGs1V-',
    driveViewUrl: 'https://drive.google.com/file/d/1G9h0BRj97qdmlv1gOCaXTWtJ8lIGs1V-/view?usp=sharing',
    driveDownloadUrl: 'https://drive.google.com/uc?export=download&id=1G9h0BRj97qdmlv1gOCaXTWtJ8lIGs1V-',
    drivePreviewUrl: 'https://drive.google.com/file/d/1G9h0BRj97qdmlv1gOCaXTWtJ8lIGs1V-/preview',
    thumbnailUrl: 'https://drive.google.com/thumbnail?id=1G9h0BRj97qdmlv1gOCaXTWtJ8lIGs1V-&sz=w800',
    pageCount: 192,
    fileSize: '45 MB',
    sourceCategory: 'Core Expansion',
    description:
      'A magical miscellany of rules expansions, containing the full Artificer class with all four subclasses, 22 additional subclasses for every class, 15 game-changing feats, 21 summon and combat spells, magical tattoos, and rules for group patrons.',
    contents: [
      'Artificer Class with Alchemist, Armorer, Artillerist & Battle Smith',
      '22 Subclasses (Soulknife, Aberrant Mind, Twilight Domain, Peace Domain)',
      '15 Feats including Fey Touched, Shadow Touched, Telekinetic & Telepathic',
      'Summon Spells: Aberration, Beast, Celestial, Construct, Fey, Fiend, Undead',
      'Magical Tattoos: Eldritch Claw, Blood Fury, Shadowfell Brand & Ghost Step',
      'Custom Lineages and expanded Origin options',
    ],
    color: {
      accent: '#6B21A8',
      border: '#D8B4FE',
      badgeBg: '#F3E8FF',
      badgeText: '#581C87',
      gradientFrom: '#3B0764',
      gradientTo: '#581C87',
    },
  },
  {
    id: 'book_ftd',
    code: 'FTD',
    title: "Fizban's Treasury of Dragons",
    subtitle: 'The Definitive Guide to Dragons, Draconic Lineages & Hoards',
    filename: "Fizban's Treasury of Dragons (HQ) (OCR) (Bookmarked) (Both Covers).pdf",
    fileId: '1uOUwhQwKjHktLB7Hp61Bw8gHn2of4aLW',
    driveViewUrl: 'https://drive.google.com/file/d/1uOUwhQwKjHktLB7Hp61Bw8gHn2of4aLW/view?usp=sharing',
    driveDownloadUrl: 'https://drive.google.com/uc?export=download&id=1uOUwhQwKjHktLB7Hp61Bw8gHn2of4aLW',
    drivePreviewUrl: 'https://drive.google.com/file/d/1uOUwhQwKjHktLB7Hp61Bw8gHn2of4aLW/preview',
    thumbnailUrl: 'https://drive.google.com/thumbnail?id=1uOUwhQwKjHktLB7Hp61Bw8gHn2of4aLW&sz=w800',
    pageCount: 224,
    fileSize: '54 MB',
    sourceCategory: 'Lore & Dragons',
    description:
      'Uncover the secrets of dragons across the multiverse guided by the archmage Fizban the Fabulous. Introducing Gem Dragonborn with psionic flight, Chromatic Warding, Draconic spells and gifts, and 85 creature stat blocks including ancient Greatwyrms.',
    contents: [
      'Gem Dragonborn (Amethyst, Crystal, Emerald, Sapphire & Topaz)',
      'Enhanced Chromatic & Metallic Dragonborn breath weapons and warding',
      'Draconic Feats: Gift of Chromatic, Metallic & Gem Dragons',
      'Draconic Magic: *Draconic Transformation*, *Fizban’s Platinum Shield*, *Ashardalon’s Stride*',
      '85 Creature Stat Blocks: Greatwyrms, Dracohydras, Dragonflesh Golems',
      'Rules for Draconic Hoards, Lair Actions, and Regional Effects',
    ],
    color: {
      accent: '#065F46',
      border: '#6EE7B7',
      badgeBg: '#D1FAE5',
      badgeText: '#064E3B',
      gradientFrom: '#064E3B',
      gradientTo: '#047857',
    },
  },
  {
    id: 'book_vgm',
    code: 'VGM',
    title: "Volo's Guide to Monsters",
    subtitle: 'Deep Monster Lore, Monstrous Playable Species & Bestiary',
    filename: "Volo's Guide to Monsters Deluxe.pdf",
    fileId: '1nSwtvYPtxQBNBsrat80R4VF5mumYtgtZ',
    driveViewUrl: 'https://drive.google.com/file/d/1nSwtvYPtxQBNBsrat80R4VF5mumYtgtZ/view?usp=sharing',
    driveDownloadUrl: 'https://drive.google.com/uc?export=download&id=1nSwtvYPtxQBNBsrat80R4VF5mumYtgtZ',
    drivePreviewUrl: 'https://drive.google.com/file/d/1nSwtvYPtxQBNBsrat80R4VF5mumYtgtZ/preview',
    thumbnailUrl: 'https://drive.google.com/thumbnail?id=1nSwtvYPtxQBNBsrat80R4VF5mumYtgtZ&sz=w800',
    pageCount: 224,
    fileSize: '72 MB',
    sourceCategory: 'Monsters & Foes',
    description:
      'An immersive exploration of monster lore with field commentary from Volo and annotations by Elminster. Features playable monstrous species like Tabaxi, Yuan-ti, Firbolg, Kenku, Lizardfolk, and Triton, alongside 143 monster stat blocks.',
    contents: [
      'Playable Species: Tabaxi, Yuan-ti Pureblood, Firbolg, Kenku, Lizardfolk, Triton',
      'Monstrous Player Lineages: Kobold, Goblin, Bugbear, Orc',
      'Deep Cultural Lore on Beholders, Giants, Gnolls, Mind Flayers & Yuan-ti',
      '143 Monster Stat Blocks including Mind Flayer Arcanists, Hags, Beholder variants',
      'Tactical combat strategies and lair designs for Dungeon Masters',
    ],
    color: {
      accent: '#9F1239',
      border: '#FDA4AF',
      badgeBg: '#FFE4E6',
      badgeText: '#881337',
      gradientFrom: '#4C0519',
      gradientTo: '#881337',
    },
  },
  {
    id: 'book_mtf',
    code: 'MTF',
    title: "Mordenkainen's Tome of Foes",
    subtitle: 'The Blood War, Elven Diaspora & High-CR Multiverse Foes',
    filename: 'Mordenkainen\'s Tome Of Foes.pdf',
    fileId: '160OHaKLIHUPhHyHZSbixoEA8nXWMHmGE',
    driveViewUrl: 'https://drive.google.com/file/d/160OHaKLIHUPhHyHZSbixoEA8nXWMHmGE/view?usp=sharing',
    driveDownloadUrl: 'https://drive.google.com/uc?export=download&id=160OHaKLIHUPhHyHZSbixoEA8nXWMHmGE',
    drivePreviewUrl: 'https://drive.google.com/file/d/160OHaKLIHUPhHyHZSbixoEA8nXWMHmGE/preview',
    thumbnailUrl: 'https://drive.google.com/thumbnail?id=160OHaKLIHUPhHyHZSbixoEA8nXWMHmGE&sz=w800',
    pageCount: 256,
    fileSize: '68 MB',
    sourceCategory: 'Monsters & Foes',
    description:
      'The legendary archmage Mordenkainen expounds on the greatest multiversal conflicts in D&D cosmology, including the eternal Blood War, the rift between elves and drow, and the astral saga of the Gith. Includes Githyanki, Githzerai, Eladrin, Shadar-kai, and 140 high-CR foes.',
    contents: [
      'Gith Species: Martial Githyanki & Ascetic Githzerai Psionics',
      'Elven Subraces: Seasonal Eladrin, Shadowfell Shadar-kai, Sea Elves',
      'Duergar (Gray Dwarves) and Deep Gnomes (Svirfneblin)',
      'Cosmic Lore: The Blood War between Devils and Demons, Dwarven Clans & Duergar',
      '140 Extraplanar Stat Blocks (Archdevils, Demon Princes, Star Spawn, Astral Dreadnoughts)',
    ],
    color: {
      accent: '#1E3A8A',
      border: '#93C5FD',
      badgeBg: '#DBEAFE',
      badgeText: '#1E40AF',
      gradientFrom: '#172554',
      gradientTo: '#1E3A8A',
    },
  },
];

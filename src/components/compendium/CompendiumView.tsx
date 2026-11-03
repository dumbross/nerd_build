/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  X,
  BookOpen,
  Filter,
  Sparkles,
  Shield,
  Swords,
  Backpack,
  Wand2,
  Plus,
  Check,
  ChevronRight,
  ExternalLink,
  Layers,
  Scroll,
  Info,
  Flame,
  UserCheck,
  Dices,
  RotateCcw,
  Skull,
} from 'lucide-react';
import {
  CompendiumCategory,
  CompendiumItem,
  COMPENDIUM_SOURCES,
  loadAllCompendiumItems,
  getCompendiumItemScore,
} from '../../data/compendiumRegistry';
import { Character, Spell, WeaponItem, ArmorItem, GearItem } from '../../types/character';
import { clean5eToolsText, render5eToolsEntries } from '../../utils/5eParser';

interface CompendiumViewProps {
  activeCharacter: Character;
  onUpdateCharacter: (char: Character) => void;
  onSwitchToSheet?: () => void;
  onSwitchToBestiary?: () => void;
  initialCategory?: CompendiumCategory;
}

interface CategoryTab {
  id: CompendiumCategory;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  count?: number;
}

export const CompendiumView: React.FC<CompendiumViewProps> = ({
  activeCharacter,
  onUpdateCharacter,
  onSwitchToSheet,
  onSwitchToBestiary,
  initialCategory = 'all',
}) => {
  const allItems = useMemo(() => loadAllCompendiumItems(), []);

  // Primary navigation & filters
  const [activeCategory, setActiveCategory] = useState<CompendiumCategory>(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSource, setSelectedSource] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<CompendiumItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Category-specific secondary filters
  const [spellLevelFilter, setSpellLevelFilter] = useState<string>('all');
  const [spellSchoolFilter, setSpellSchoolFilter] = useState<string>('all');
  const [spellClassFilter, setSpellClassFilter] = useState<string>('all');
  const [weaponCategoryFilter, setWeaponCategoryFilter] = useState<string>('all');
  const [armorCategoryFilter, setArmorCategoryFilter] = useState<string>('all');
  const [magicItemRarityFilter, setMagicItemRarityFilter] = useState<string>('all');
  const [visibleCount, setVisibleCount] = useState<number>(50);

  // Pre-select category if initialCategory changes
  useEffect(() => {
    if (initialCategory) {
      setActiveCategory(initialCategory);
    }
  }, [initialCategory]);

  // Reset pagination when search or filters change
  useEffect(() => {
    setVisibleCount(50);
  }, [
    searchQuery,
    activeCategory,
    selectedSource,
    spellLevelFilter,
    spellSchoolFilter,
    spellClassFilter,
    weaponCategoryFilter,
    armorCategoryFilter,
    magicItemRarityFilter,
  ]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Category tabs configuration
  const CATEGORY_TABS: CategoryTab[] = [
    { id: 'all', label: 'All Content', icon: BookOpen },
    { id: 'classes', label: 'Classes', icon: Swords },
    { id: 'races', label: 'Species & Races', icon: Sparkles },
    { id: 'spells', label: 'Spells', icon: Wand2 },
    { id: 'weapons', label: 'Weapons', icon: Swords },
    { id: 'armor', label: 'Armor & Shields', icon: Shield },
    { id: 'gear', label: 'Adventuring Gear', icon: Backpack },
    { id: 'magic-items', label: 'Magic Items', icon: Sparkles },
    { id: 'feats', label: 'Feats', icon: Layers },
    { id: 'backgrounds', label: 'Backgrounds', icon: Scroll },
    { id: 'rules', label: 'Rules & Conditions', icon: Info },
  ];

  // Filter & Rank items with literal match promotion
  const filteredItems = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return allItems
      .filter((item) => {
        // Category filter
        if (activeCategory !== 'all' && item.category !== activeCategory) {
          return false;
        }

        // Sourcebook filter
        if (selectedSource !== 'all') {
          const itemSrc = (item.source || '').toLowerCase();
          const targetSrc = selectedSource.toLowerCase();
          if (itemSrc !== targetSrc) {
            // Also match if target is in full source name
            const fullLabel = (item.sourceLabel || '').toLowerCase();
            if (!fullLabel.includes(targetSrc)) return false;
          }
        }

        // Secondary Filters: Spells
        if (item.category === 'spells') {
          if (spellLevelFilter !== 'all' && item.spellLevel?.toString() !== spellLevelFilter) {
            return false;
          }
          if (
            spellSchoolFilter !== 'all' &&
            item.spellSchool?.toLowerCase() !== spellSchoolFilter.toLowerCase()
          ) {
            return false;
          }
          if (spellClassFilter !== 'all') {
            const hasClass = item.spellClasses?.some(
              (c) => c.toLowerCase() === spellClassFilter.toLowerCase()
            );
            if (!hasClass) return false;
          }
        }

        // Secondary Filters: Weapons
        if (item.category === 'weapons' && weaponCategoryFilter !== 'all') {
          if (item.weaponCategory !== weaponCategoryFilter) return false;
        }

        // Secondary Filters: Armor
        if (item.category === 'armor' && armorCategoryFilter !== 'all') {
          if (item.armorCategory !== armorCategoryFilter) return false;
        }

        // Secondary Filters: Magic Items
        if (item.category === 'magic-items' && magicItemRarityFilter !== 'all') {
          if (item.itemRarity !== magicItemRarityFilter) return false;
        }

        // Search Query filter
        if (q) {
          const score = getCompendiumItemScore(item, q);
          return score > 0;
        }

        return true;
      })
      .sort((a, b) => {
        if (q) {
          const scoreB = getCompendiumItemScore(b, q);
          const scoreA = getCompendiumItemScore(a, q);
          if (scoreB !== scoreA) {
            return scoreB - scoreA; // Highest score (closest literal match) first!
          }
        }
        return a.name.localeCompare(b.name);
      });
  }, [
    allItems,
    activeCategory,
    selectedSource,
    searchQuery,
    spellLevelFilter,
    spellSchoolFilter,
    spellClassFilter,
    weaponCategoryFilter,
    armorCategoryFilter,
    magicItemRarityFilter,
  ]);

  // Set default selected item if none selected or if selection no longer in list
  useEffect(() => {
    if (filteredItems.length > 0) {
      if (!selectedItem || !filteredItems.some((i) => i.id === selectedItem.id)) {
        setSelectedItem(filteredItems[0]);
      }
    } else {
      setSelectedItem(null);
    }
  }, [filteredItems, selectedItem]);

  // Quick reset all filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setActiveCategory('all');
    setSelectedSource('all');
    setSpellLevelFilter('all');
    setSpellSchoolFilter('all');
    setSpellClassFilter('all');
    setWeaponCategoryFilter('all');
    setArmorCategoryFilter('all');
    setMagicItemRarityFilter('all');
  };

  const isAnyFilterActive =
    searchQuery !== '' ||
    selectedSource !== 'all' ||
    activeCategory !== 'all' ||
    spellLevelFilter !== 'all' ||
    spellSchoolFilter !== 'all' ||
    spellClassFilter !== 'all' ||
    weaponCategoryFilter !== 'all' ||
    armorCategoryFilter !== 'all' ||
    magicItemRarityFilter !== 'all';

  // Character add actions
  const handleAddSpellToSheet = (spell: Spell) => {
    if (activeCharacter.spells.some((s) => s.name === spell.name)) {
      showToast(`"${spell.name}" is already in ${activeCharacter.name}'s grimoire`);
      return;
    }
    const updatedSpells = [...activeCharacter.spells, { ...spell, prepared: true }];
    onUpdateCharacter({
      ...activeCharacter,
      spells: updatedSpells,
    });
    showToast(`Added "${spell.name}" to ${activeCharacter.name}'s Spellbook!`);
  };

  const handleAddWeaponToSheet = (weapon: WeaponItem) => {
    const updated = [
      ...activeCharacter.weapons,
      { ...weapon, id: `w_${Date.now()}_${Math.random().toString(36).substring(2, 6)}` },
    ];
    onUpdateCharacter({
      ...activeCharacter,
      weapons: updated,
    });
    showToast(`Added "${weapon.name}" to ${activeCharacter.name}'s Arsenal!`);
  };

  const handleAddArmorToSheet = (armor: ArmorItem) => {
    const updated = [
      ...activeCharacter.armor,
      { ...armor, id: `a_${Date.now()}_${Math.random().toString(36).substring(2, 6)}` },
    ];
    onUpdateCharacter({
      ...activeCharacter,
      armor: updated,
    });
    showToast(`Added "${armor.name}" to ${activeCharacter.name}'s Armory!`);
  };

  const handleAddGearToSheet = (gear: GearItem) => {
    const updated = [
      ...activeCharacter.inventory,
      { ...gear, id: `g_${Date.now()}_${Math.random().toString(36).substring(2, 6)}` },
    ];
    onUpdateCharacter({
      ...activeCharacter,
      inventory: updated,
    });
    showToast(`Added "${gear.name}" to ${activeCharacter.name}'s Pack!`);
  };

  const handleAddFeatToSheet = (feat: any) => {
    const featureName = feat.name;
    if (activeCharacter.features.some((f) => f.name === featureName)) {
      showToast(`Feat "${featureName}" already equipped on ${activeCharacter.name}`);
      return;
    }
    const desc = feat.entries
      ? render5eToolsEntries(feat.entries)
      : clean5eToolsText(feat.description || '');
    const newFeature = {
      id: `feat_${Date.now()}`,
      name: featureName,
      source: 'Feat' as const,
      description: desc,
    };
    onUpdateCharacter({
      ...activeCharacter,
      features: [...activeCharacter.features, newFeature],
    });
    showToast(`Feat "${featureName}" added to ${activeCharacter.name}!`);
  };

  const handleApplyBackground = (bg: any) => {
    onUpdateCharacter({
      ...activeCharacter,
      background: bg.name,
    });
    showToast(`Set ${activeCharacter.name}'s background to ${bg.name}!`);
  };

  // Get category badge color
  const getCategoryBadgeClass = (cat: CompendiumCategory) => {
    switch (cat) {
      case 'classes':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'races':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300';
      case 'spells':
        return 'bg-purple-100 text-purple-900 border-purple-300';
      case 'weapons':
        return 'bg-red-100 text-red-900 border-red-300';
      case 'armor':
        return 'bg-blue-100 text-blue-900 border-blue-300';
      case 'gear':
        return 'bg-stone-200 text-stone-800 border-stone-300';
      case 'magic-items':
        return 'bg-fuchsia-100 text-fuchsia-900 border-fuchsia-300';
      case 'feats':
        return 'bg-indigo-100 text-indigo-900 border-indigo-300';
      case 'backgrounds':
        return 'bg-orange-100 text-orange-900 border-orange-300';
      case 'rules':
        return 'bg-rose-100 text-rose-900 border-rose-300';
      default:
        return 'bg-stone-100 text-stone-700 border-stone-300';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-6 z-50 bg-stone-900 text-white border border-stone-700 rounded-xl px-4 py-3 shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom duration-200">
          <Sparkles className="w-4 h-4 text-[#EBD6CA]" />
          <span className="text-xs font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-[#FAF6EE] border border-[#E3DDD1] rounded-2xl p-5 sm:p-6 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-full opacity-5 pointer-events-none bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-stone-900 to-transparent" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono tracking-wider font-semibold uppercase bg-[#B85D36]/10 text-[#B85D36] border border-[#B85D36]/20">
                5e Codex & Archives
              </span>
              <span className="text-xs text-stone-500 font-medium">
                {allItems.length} rules, spells, gear & character options
              </span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight flex items-center gap-2.5">
              <BookOpen className="w-7 h-7 text-[#B85D36]" />
              <span>The Grand 5e Compendium</span>
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 max-w-2xl">
              Complete reference for classes, species, spells, weapons, armor, adventuring gear,
              magic items, feats, and backgrounds across all official sourcebooks.
            </p>
          </div>

          {/* Quick Active Character Status Card */}
          <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm p-3 rounded-xl border border-[#E3DDD1] shadow-xs">
            <div className="w-10 h-10 rounded-lg bg-[#F5EFE6] border border-[#DDD5C7] flex items-center justify-center text-[#B85D36] shrink-0 font-serif font-bold text-base">
              {activeCharacter.name.charAt(0)}
            </div>
            <div className="min-w-0 pr-2">
              <div className="text-xs font-semibold text-stone-900 truncate">
                {activeCharacter.name}
              </div>
              <div className="text-[11px] text-stone-500 truncate">
                Level {activeCharacter.level} {activeCharacter.race} {activeCharacter.className}
              </div>
            </div>
            {onSwitchToSheet && (
              <button
                onClick={onSwitchToSheet}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-stone-900 hover:bg-stone-800 text-white flex items-center gap-1.5 transition-colors shrink-0 shadow-xs"
                title="Return to Active Character Sheet"
              >
                <UserCheck className="w-3.5 h-3.5 text-[#EBD6CA]" />
                <span className="hidden sm:inline">Go to Sheet</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Global Search & Category Tabs */}
      <div className="space-y-3">
        {/* Search Row & Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Main search bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, spell, class, weapon property, or school (closest matches appear first)..."
              className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white border border-[#DDD5C7] focus:border-[#B85D36] focus:ring-2 focus:ring-[#B85D36]/15 outline-hidden text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 shadow-2xs transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-1"
                title="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sourcebook Selector Dropdown */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-stone-700 whitespace-nowrap hidden sm:inline">
              Source:
            </label>
            <select
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              className="py-2.5 px-3 rounded-xl bg-white border border-[#DDD5C7] text-xs font-medium text-stone-800 focus:border-[#B85D36] focus:ring-2 focus:ring-[#B85D36]/15 outline-hidden shadow-2xs cursor-pointer"
            >
              {COMPENDIUM_SOURCES.map((src) => (
                <option key={src.id} value={src.id}>
                  {src.label}
                </option>
              ))}
            </select>

            {/* Clear All Filters Button */}
            {isAnyFilterActive && (
              <button
                onClick={handleResetFilters}
                className="px-2.5 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium flex items-center gap-1 transition-colors"
                title="Reset all search queries and filters"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Category Selector Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORY_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeCategory === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 border ${
                  isActive
                    ? 'bg-stone-900 text-white border-stone-900 shadow-xs font-semibold'
                    : 'bg-white hover:bg-[#F7F4EE] text-stone-700 border-[#DDD5C7]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#EBD6CA]' : 'text-stone-500'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}

          {/* Quick link to Bestiary Monsters */}
          {onSwitchToBestiary && (
            <button
              onClick={onSwitchToBestiary}
              className="px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 border bg-[#FDF5F2] hover:bg-[#FAEAE5] text-[#7A200D] border-[#E8C5BE]"
              title="Switch to 5e.tools Bestiary (4,569 monsters)"
            >
              <Skull className="w-3.5 h-3.5 text-[#7A200D]" />
              <span>Monsters Bestiary (4,569)</span>
              <ChevronRight className="w-3 h-3 text-[#7A200D]" />
            </button>
          )}
        </div>

        {/* Dynamic Secondary Filters Row depending on active category */}
        {(activeCategory === 'spells' ||
          activeCategory === 'weapons' ||
          activeCategory === 'armor' ||
          activeCategory === 'magic-items' ||
          activeCategory === 'all') && (
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <span className="text-stone-500 font-medium flex items-center gap-1">
              <Filter className="w-3 h-3" /> Filters:
            </span>

            {/* Spell Level Filter */}
            {(activeCategory === 'spells' || activeCategory === 'all') && (
              <select
                value={spellLevelFilter}
                onChange={(e) => setSpellLevelFilter(e.target.value)}
                className="py-1 px-2.5 rounded-lg bg-white border border-[#DDD5C7] text-stone-700 outline-hidden font-medium"
              >
                <option value="all">Spell Level: All</option>
                <option value="0">Cantrips (0)</option>
                <option value="1">1st Level</option>
                <option value="2">2nd Level</option>
                <option value="3">3rd Level</option>
                <option value="4">4th Level</option>
                <option value="5">5th Level</option>
                <option value="6">6th Level</option>
                <option value="7">7th Level</option>
                <option value="8">8th Level</option>
                <option value="9">9th Level</option>
              </select>
            )}

            {/* Spell School Filter */}
            {(activeCategory === 'spells' || activeCategory === 'all') && (
              <select
                value={spellSchoolFilter}
                onChange={(e) => setSpellSchoolFilter(e.target.value)}
                className="py-1 px-2.5 rounded-lg bg-white border border-[#DDD5C7] text-stone-700 outline-hidden font-medium"
              >
                <option value="all">School: All</option>
                <option value="Abjuration">Abjuration</option>
                <option value="Conjuration">Conjuration</option>
                <option value="Divination">Divination</option>
                <option value="Enchantment">Enchantment</option>
                <option value="Evocation">Evocation</option>
                <option value="Illusion">Illusion</option>
                <option value="Necromancy">Necromancy</option>
                <option value="Transmutation">Transmutation</option>
              </select>
            )}

            {/* Spell Class Filter */}
            {activeCategory === 'spells' && (
              <select
                value={spellClassFilter}
                onChange={(e) => setSpellClassFilter(e.target.value)}
                className="py-1 px-2.5 rounded-lg bg-white border border-[#DDD5C7] text-stone-700 outline-hidden font-medium"
              >
                <option value="all">Class: All</option>
                <option value="Artificer">Artificer</option>
                <option value="Bard">Bard</option>
                <option value="Cleric">Cleric</option>
                <option value="Druid">Druid</option>
                <option value="Paladin">Paladin</option>
                <option value="Ranger">Ranger</option>
                <option value="Sorcerer">Sorcerer</option>
                <option value="Warlock">Warlock</option>
                <option value="Wizard">Wizard</option>
              </select>
            )}

            {/* Weapon Category Filter */}
            {activeCategory === 'weapons' && (
              <select
                value={weaponCategoryFilter}
                onChange={(e) => setWeaponCategoryFilter(e.target.value)}
                className="py-1 px-2.5 rounded-lg bg-white border border-[#DDD5C7] text-stone-700 outline-hidden font-medium"
              >
                <option value="all">Weapon Type: All</option>
                <option value="Simple Melee">Simple Melee</option>
                <option value="Simple Ranged">Simple Ranged</option>
                <option value="Martial Melee">Martial Melee</option>
                <option value="Martial Ranged">Martial Ranged</option>
              </select>
            )}

            {/* Armor Category Filter */}
            {activeCategory === 'armor' && (
              <select
                value={armorCategoryFilter}
                onChange={(e) => setArmorCategoryFilter(e.target.value)}
                className="py-1 px-2.5 rounded-lg bg-white border border-[#DDD5C7] text-stone-700 outline-hidden font-medium"
              >
                <option value="all">Armor Type: All</option>
                <option value="Light">Light Armor</option>
                <option value="Medium">Medium Armor</option>
                <option value="Heavy">Heavy Armor</option>
                <option value="Shield">Shield</option>
              </select>
            )}

            {/* Magic Item Rarity */}
            {activeCategory === 'magic-items' && (
              <select
                value={magicItemRarityFilter}
                onChange={(e) => setMagicItemRarityFilter(e.target.value)}
                className="py-1 px-2.5 rounded-lg bg-white border border-[#DDD5C7] text-stone-700 outline-hidden font-medium"
              >
                <option value="all">Rarity: All</option>
                <option value="Common">Common</option>
                <option value="Uncommon">Uncommon</option>
                <option value="Rare">Rare</option>
                <option value="Very Rare">Very Rare</option>
                <option value="Legendary">Legendary</option>
              </select>
            )}

            {/* Quick search chips */}
            {!searchQuery && (
              <div className="hidden xl:flex items-center gap-1.5 ml-auto text-[11px] text-stone-500">
                <span>Quick:</span>
                {['Artificer', 'Fireball', 'Greatsword', 'Alert', 'Bag of Holding', 'Shield'].map(
                  (term) => (
                    <button
                      key={term}
                      onClick={() => setSearchQuery(term)}
                      className="px-2 py-0.5 rounded-md bg-[#F0EBE1] hover:bg-[#EAE4D9] text-stone-700 transition-colors"
                    >
                      {term}
                    </button>
                  )
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Main 2-Column Split View: Results List (Left) + Detailed Parchment Inspector (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Filtered Items List (5 cols on large) */}
        <div className="lg:col-span-5 bg-white border border-[#E3DDD1] rounded-2xl p-4 shadow-sm space-y-3">
          {/* List stats header */}
          <div className="flex items-center justify-between text-xs text-stone-600 pb-2 border-b border-[#EFEAE2]">
            <span className="font-semibold text-stone-900">
              {filteredItems.length} {filteredItems.length === 1 ? 'entry' : 'entries'} found
            </span>
            {selectedSource !== 'all' && (
              <span className="px-2 py-0.5 rounded bg-[#F0EBE1] text-[#B85D36] font-medium font-mono text-[10px]">
                Source: {selectedSource}
              </span>
            )}
          </div>

          {/* Items scroll container */}
          <div className="space-y-2 max-h-[720px] overflow-y-auto pr-1">
            {filteredItems.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <BookOpen className="w-10 h-10 text-stone-300 mx-auto" />
                <div className="text-sm font-semibold text-stone-700">No matching entries</div>
                <p className="text-xs text-stone-500 max-w-xs mx-auto">
                  Try adjusting your search query, selecting "All Sources", or clearing secondary
                  filters.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-3 py-1.5 rounded-lg bg-stone-900 text-white text-xs font-medium"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              filteredItems.slice(0, visibleCount).map((item) => {
                const isSelected = selectedItem?.id === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all group ${
                      isSelected
                        ? 'bg-[#FDFBF7] border-[#B85D36] shadow-xs ring-1 ring-[#B85D36]/20'
                        : 'bg-white hover:bg-[#FAF8F5] border-[#E8E3DA]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-0.5 flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-serif font-bold text-sm text-stone-900 group-hover:text-[#B85D36] transition-colors">
                            {item.name}
                          </span>
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-medium border ${getCategoryBadgeClass(
                              item.category
                            )}`}
                          >
                            {item.categoryLabel}
                          </span>
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono text-stone-600 bg-stone-100 border border-stone-200">
                            {item.source}
                          </span>
                        </div>
                        <div className="text-xs text-stone-500 font-medium truncate">
                          {item.subtitle}
                        </div>
                      </div>

                      <ChevronRight
                        className={`w-4 h-4 shrink-0 mt-1 transition-transform ${
                          isSelected ? 'text-[#B85D36] translate-x-0.5' : 'text-stone-300'
                        }`}
                      />
                    </div>
                  </div>
                );
              })
            )}

            {/* Load more button */}
            {filteredItems.length > visibleCount && (
              <button
                onClick={() => setVisibleCount((prev) => prev + 50)}
                className="w-full py-2.5 mt-2 rounded-xl border border-dashed border-[#DDD5C7] hover:border-stone-400 bg-[#FAF8F5] text-stone-700 text-xs font-semibold transition-colors"
              >
                Load More ({filteredItems.length - visibleCount} remaining)
              </button>
            )}
          </div>
        </div>

        {/* Right Column: Detailed Authentic D&D Parchment Inspector (7 cols on large) */}
        <div className="lg:col-span-7">
          {selectedItem ? (
            <div className="bg-[#FAF6EE] border-2 border-[#D9CEBC] rounded-2xl p-6 sm:p-8 shadow-sm space-y-6 relative overflow-hidden">
              {/* Parchment background accent */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-100/60 to-transparent pointer-events-none" />

              {/* Item Header Banner */}
              <div className="border-b-2 border-[#B85D36] pb-4 space-y-2">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-semibold border ${getCategoryBadgeClass(
                        selectedItem.category
                      )}`}
                    >
                      {selectedItem.categoryLabel}
                    </span>
                    <span className="px-2 py-0.5 rounded text-xs font-mono font-medium text-stone-700 bg-white/80 border border-[#DDD5C7]">
                      {selectedItem.source} {selectedItem.page ? `p.${selectedItem.page}` : ''}
                    </span>
                  </div>

                  {/* Sourcebook Full Name */}
                  <span className="text-xs text-stone-500 italic">
                    Source: {selectedItem.sourceLabel}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#7A200D] tracking-tight">
                    {selectedItem.name}
                  </h2>

                  {/* Contextual Action Button based on item type */}
                  {selectedItem.category === 'spells' && (
                    <button
                      onClick={() => handleAddSpellToSheet(selectedItem.rawData)}
                      className="px-3.5 py-1.5 rounded-xl bg-[#7A200D] hover:bg-[#631A0B] text-white text-xs font-medium flex items-center gap-1.5 shadow-xs transition-colors shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5 text-[#EBD6CA]" />
                      <span>Learn Spell</span>
                    </button>
                  )}

                  {selectedItem.category === 'weapons' && (
                    <button
                      onClick={() => handleAddWeaponToSheet(selectedItem.rawData)}
                      className="px-3.5 py-1.5 rounded-xl bg-[#7A200D] hover:bg-[#631A0B] text-white text-xs font-medium flex items-center gap-1.5 shadow-xs transition-colors shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5 text-[#EBD6CA]" />
                      <span>Add to Arsenal</span>
                    </button>
                  )}

                  {selectedItem.category === 'armor' && (
                    <button
                      onClick={() => handleAddArmorToSheet(selectedItem.rawData)}
                      className="px-3.5 py-1.5 rounded-xl bg-[#7A200D] hover:bg-[#631A0B] text-white text-xs font-medium flex items-center gap-1.5 shadow-xs transition-colors shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5 text-[#EBD6CA]" />
                      <span>Add to Armory</span>
                    </button>
                  )}

                  {(selectedItem.category === 'gear' || selectedItem.category === 'magic-items') && (
                    <button
                      onClick={() => handleAddGearToSheet(selectedItem.rawData)}
                      className="px-3.5 py-1.5 rounded-xl bg-[#7A200D] hover:bg-[#631A0B] text-white text-xs font-medium flex items-center gap-1.5 shadow-xs transition-colors shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5 text-[#EBD6CA]" />
                      <span>Add to Pack</span>
                    </button>
                  )}

                  {selectedItem.category === 'feats' && (
                    <button
                      onClick={() => handleAddFeatToSheet(selectedItem.rawData)}
                      className="px-3.5 py-1.5 rounded-xl bg-[#7A200D] hover:bg-[#631A0B] text-white text-xs font-medium flex items-center gap-1.5 shadow-xs transition-colors shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5 text-[#EBD6CA]" />
                      <span>Equip Feat</span>
                    </button>
                  )}

                  {selectedItem.category === 'backgrounds' && (
                    <button
                      onClick={() => handleApplyBackground(selectedItem.rawData)}
                      className="px-3.5 py-1.5 rounded-xl bg-[#7A200D] hover:bg-[#631A0B] text-white text-xs font-medium flex items-center gap-1.5 shadow-xs transition-colors shrink-0"
                    >
                      <Check className="w-3.5 h-3.5 text-[#EBD6CA]" />
                      <span>Set Background</span>
                    </button>
                  )}
                </div>

                <div className="text-xs sm:text-sm text-stone-700 italic font-serif">
                  {selectedItem.subtitle}
                </div>
              </div>

              {/* Entity Specific Inspector Renderers */}

              {/* 1. CLASS VIEW */}
              {selectedItem.category === 'classes' && (
                <div className="space-y-5">
                  {/* Class Core Stats Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white/70 p-3.5 rounded-xl border border-[#E3DDD1]">
                    <div>
                      <div className="text-[10px] text-stone-500 font-semibold uppercase tracking-wider">
                        Hit Die
                      </div>
                      <div className="font-serif text-lg font-bold text-stone-900">
                        {selectedItem.hitDie}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-stone-500 font-semibold uppercase tracking-wider">
                        Saving Throws
                      </div>
                      <div className="font-serif text-sm font-bold text-stone-900">
                        {selectedItem.rawData.proficiency?.join(', ').toUpperCase()}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-stone-500 font-semibold uppercase tracking-wider">
                        Armor Prof.
                      </div>
                      <div className="text-xs font-medium text-stone-800">
                        {selectedItem.rawData.armorProficiencies?.join(', ') || 'None'}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-stone-500 font-semibold uppercase tracking-wider">
                        Weapons
                      </div>
                      <div className="text-xs font-medium text-stone-800">
                        {selectedItem.rawData.weaponProficiencies?.join(', ') || 'None'}
                      </div>
                    </div>
                  </div>

                  {/* Class Overview description */}
                  <div className="space-y-2">
                    <h3 className="font-serif text-base font-bold text-stone-900">Overview</h3>
                    <div className="text-xs sm:text-sm text-stone-700 leading-relaxed whitespace-pre-line">
                      {render5eToolsEntries(selectedItem.rawData.entries) ||
                        clean5eToolsText(selectedItem.rawData.description || '')}
                    </div>
                  </div>

                  {/* Class Features List */}
                  {selectedItem.rawData.features && selectedItem.rawData.features.length > 0 && (
                    <div className="space-y-3 pt-2">
                      <h3 className="font-serif text-base font-bold text-stone-900 border-b border-[#E3DDD1] pb-1">
                        Class Features
                      </h3>
                      <div className="space-y-2.5">
                        {selectedItem.rawData.features.map((feat: any, idx: number) => (
                          <div
                            key={idx}
                            className="bg-white/80 p-3.5 rounded-xl border border-[#E3DDD1] space-y-1.5"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-serif font-bold text-sm text-stone-900">
                                {feat.name}
                              </span>
                              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#F0EBE1] text-[#B85D36]">
                                Level {feat.level}
                              </span>
                            </div>
                            <div className="text-xs text-stone-700 leading-relaxed whitespace-pre-line">
                              {render5eToolsEntries(feat.entries) ||
                                clean5eToolsText(feat.entries?.[0] || feat.description || '')}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Subclasses */}
                  {selectedItem.rawData.subclasses && selectedItem.rawData.subclasses.length > 0 && (
                    <div className="space-y-2 pt-2">
                      <h3 className="font-serif text-base font-bold text-stone-900 border-b border-[#E3DDD1] pb-1">
                        Subclasses / Archetypes
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {selectedItem.rawData.subclasses.map((sc: any, idx: number) => (
                          <div
                            key={idx}
                            className="p-3 bg-white/70 rounded-xl border border-[#E3DDD1]"
                          >
                            <div className="font-serif font-bold text-xs text-[#7A200D]">
                              {sc.name}
                            </div>
                            <div className="text-[11px] text-stone-500">Source: {sc.source}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 2. SPECIES / RACE VIEW */}
              {selectedItem.category === 'races' && (
                <div className="space-y-5">
                  {/* Core Traits Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-white/70 p-3.5 rounded-xl border border-[#E3DDD1]">
                    <div>
                      <div className="text-[10px] text-stone-500 font-semibold uppercase tracking-wider">
                        Size
                      </div>
                      <div className="font-serif text-base font-bold text-stone-900">
                        {selectedItem.size}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-stone-500 font-semibold uppercase tracking-wider">
                        Base Speed
                      </div>
                      <div className="font-serif text-base font-bold text-stone-900">
                        {selectedItem.rawData.speed || 30} ft.
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-stone-500 font-semibold uppercase tracking-wider">
                        Darkvision
                      </div>
                      <div className="font-serif text-base font-bold text-stone-900">
                        {selectedItem.rawData.darkvision
                          ? `${selectedItem.rawData.darkvision} ft.`
                          : 'None'}
                      </div>
                    </div>
                  </div>

                  {/* Description / Racial Traits */}
                  <div className="space-y-2">
                    <h3 className="font-serif text-base font-bold text-stone-900">Racial Traits & Details</h3>
                    <div className="text-xs sm:text-sm text-stone-700 leading-relaxed whitespace-pre-line space-y-2">
                      {render5eToolsEntries(selectedItem.rawData.entries) ||
                        clean5eToolsText(selectedItem.rawData.description || '')}
                    </div>
                  </div>

                  {/* Languages */}
                  {selectedItem.rawData.languages && (
                    <div className="space-y-1 bg-white/60 p-3 rounded-xl border border-[#E3DDD1]">
                      <div className="text-[11px] font-semibold text-stone-800">Languages</div>
                      <div className="text-xs text-stone-600">
                        {selectedItem.rawData.languages.join(', ')}
                      </div>
                    </div>
                  )}

                  {/* Subraces */}
                  {selectedItem.rawData.subraces && selectedItem.rawData.subraces.length > 0 && (
                    <div className="space-y-3 pt-2">
                      <h3 className="font-serif text-base font-bold text-stone-900 border-b border-[#E3DDD1] pb-1">
                        Lineages & Subraces
                      </h3>
                      <div className="space-y-2.5">
                        {selectedItem.rawData.subraces.map((sr: any, idx: number) => (
                          <div
                            key={idx}
                            className="bg-white/80 p-3.5 rounded-xl border border-[#E3DDD1] space-y-1"
                          >
                            <div className="font-serif font-bold text-sm text-[#7A200D]">
                              {sr.name}
                            </div>
                            <div className="text-xs text-stone-600 whitespace-pre-line">
                              {render5eToolsEntries(sr.entries) ||
                                clean5eToolsText(sr.entries?.[0] || sr.description || '')}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 3. SPELL VIEW */}
              {selectedItem.category === 'spells' && (
                <div className="space-y-4">
                  {/* Spell Attributes Bar */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-white/70 p-3 rounded-xl border border-[#E3DDD1] text-xs">
                    <div>
                      <span className="text-[10px] text-stone-500 font-semibold uppercase block">
                        Casting Time
                      </span>
                      <span className="font-medium text-stone-900">
                        {selectedItem.rawData.castingTime}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-stone-500 font-semibold uppercase block">
                        Range
                      </span>
                      <span className="font-medium text-stone-900">
                        {selectedItem.rawData.range}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-stone-500 font-semibold uppercase block">
                        Components
                      </span>
                      <span className="font-medium text-stone-900">
                        {selectedItem.rawData.components}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-stone-500 font-semibold uppercase block">
                        Duration
                      </span>
                      <span className="font-medium text-stone-900">
                        {selectedItem.rawData.duration}
                      </span>
                    </div>
                  </div>

                  {/* Spell Text */}
                  <div className="space-y-2 pt-1">
                    <h3 className="font-serif text-base font-bold text-stone-900">Description</h3>
                    <p className="text-xs sm:text-sm text-stone-800 leading-relaxed whitespace-pre-line bg-white/50 p-4 rounded-xl border border-[#E3DDD1]">
                      {clean5eToolsText(selectedItem.rawData.description || '')}
                    </p>
                  </div>

                  {/* Available Classes */}
                  {selectedItem.rawData.classes && selectedItem.rawData.classes.length > 0 && (
                    <div className="pt-2 flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-semibold text-stone-600">Spell Lists:</span>
                      {selectedItem.rawData.classes.map((cls: string) => (
                        <span
                          key={cls}
                          className="px-2 py-0.5 rounded-md bg-[#F0EBE1] text-stone-800 text-xs font-medium border border-[#DDD5C7]"
                        >
                          {cls}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* 4. WEAPONS VIEW */}
              {selectedItem.category === 'weapons' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white/70 p-3.5 rounded-xl border border-[#E3DDD1]">
                    <div>
                      <span className="text-[10px] text-stone-500 font-semibold uppercase block">
                        Damage
                      </span>
                      <span className="font-serif text-lg font-bold text-[#7A200D]">
                        {selectedItem.rawData.damage} {selectedItem.rawData.damageType}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-stone-500 font-semibold uppercase block">
                        Category
                      </span>
                      <span className="text-xs font-medium text-stone-900">
                        {selectedItem.rawData.category}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-stone-500 font-semibold uppercase block">
                        Weight
                      </span>
                      <span className="text-xs font-medium text-stone-900">
                        {selectedItem.rawData.weight} lb.
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-stone-500 font-semibold uppercase block">
                        Cost
                      </span>
                      <span className="text-xs font-medium text-stone-900">
                        {selectedItem.rawData.cost}
                      </span>
                    </div>
                  </div>

                  {/* Weapon Properties */}
                  {selectedItem.rawData.properties &&
                    selectedItem.rawData.properties.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                          Properties
                        </h4>
                        <div className="flex flex-wrap gap-1.5">
                          {selectedItem.rawData.properties.map((prop: string) => (
                            <span
                              key={prop}
                              className="px-2.5 py-1 rounded-lg bg-white border border-[#DDD5C7] text-stone-800 text-xs font-medium shadow-2xs"
                            >
                              {prop}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                  {selectedItem.rawData.range && (
                    <div className="text-xs text-stone-700 bg-white/60 p-3 rounded-xl border border-[#E3DDD1]">
                      <span className="font-semibold">Range:</span> {selectedItem.rawData.range} ft.
                    </div>
                  )}
                </div>
              )}

              {/* 5. ARMOR VIEW */}
              {selectedItem.category === 'armor' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white/70 p-3.5 rounded-xl border border-[#E3DDD1]">
                    <div>
                      <span className="text-[10px] text-stone-500 font-semibold uppercase block">
                        Armor Class (AC)
                      </span>
                      <span className="font-serif text-xl font-bold text-[#7A200D]">
                        {selectedItem.rawData.ac}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-stone-500 font-semibold uppercase block">
                        Type
                      </span>
                      <span className="text-xs font-medium text-stone-900">
                        {selectedItem.rawData.category}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-stone-500 font-semibold uppercase block">
                        Weight
                      </span>
                      <span className="text-xs font-medium text-stone-900">
                        {selectedItem.rawData.weight} lb.
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-stone-500 font-semibold uppercase block">
                        Cost
                      </span>
                      <span className="text-xs font-medium text-stone-900">
                        {selectedItem.rawData.cost}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 bg-white/60 p-4 rounded-xl border border-[#E3DDD1] text-xs space-y-1.5">
                    <div>
                      <span className="font-semibold text-stone-900">Dexterity Modifier:</span>{' '}
                      {selectedItem.rawData.dexBonus === 'full'
                        ? 'Full Dexterity Modifier added to AC'
                        : selectedItem.rawData.dexBonus === 'max2'
                          ? 'Dexterity modifier (max +2)'
                          : 'No Dexterity modifier added'}
                    </div>
                    {selectedItem.rawData.stealthDisadvantage && (
                      <div className="text-amber-800 font-medium">
                        ⚠️ Stealth: Disadvantage on Dexterity (Stealth) checks
                      </div>
                    )}
                    {selectedItem.rawData.minStr && (
                      <div className="text-stone-700">
                        ⚠️ Requires Strength score of {selectedItem.rawData.minStr} or speed is
                        reduced by 10 ft.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 6. MAGIC ITEMS VIEW */}
              {selectedItem.category === 'magic-items' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-1 rounded-lg bg-fuchsia-100 text-fuchsia-900 font-semibold text-xs border border-fuchsia-300">
                      {selectedItem.rawData.rarity} {selectedItem.rawData.type}
                    </span>
                    {selectedItem.rawData.attunement && (
                      <span className="px-2 py-0.5 rounded text-xs bg-amber-100 text-amber-900 font-medium border border-amber-300">
                        Requires Attunement {selectedItem.rawData.attunementPrereq || ''}
                      </span>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm text-stone-800 leading-relaxed bg-white/60 p-4 rounded-xl border border-[#E3DDD1]">
                    {selectedItem.rawData.description}
                  </p>

                  {selectedItem.rawData.properties && (
                    <div className="space-y-1.5">
                      <div className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                        Key Enchantments
                      </div>
                      <div className="space-y-1">
                        {selectedItem.rawData.properties.map((p: string, idx: number) => (
                          <div
                            key={idx}
                            className="text-xs text-stone-700 flex items-center gap-1.5"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-[#B85D36]" />
                            <span>{p}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 7. FEATS VIEW */}
              {selectedItem.category === 'feats' && (
                <div className="space-y-4">
                  {selectedItem.rawData.prerequisite && (
                    <div className="text-xs text-stone-600 bg-white/60 p-2.5 rounded-xl border border-[#E3DDD1]">
                      <span className="font-semibold text-stone-800">Prerequisite:</span>{' '}
                      {selectedItem.rawData.prerequisite
                        .map((p: any) => {
                          if (typeof p === 'string') return p;
                          if (p.spellcasting) return 'Ability to cast at least one spell';
                          if (p.ability && Array.isArray(p.ability)) {
                            return p.ability
                              .map((abObj: any) =>
                                Object.entries(abObj)
                                  .map(([k, v]) => `${k.toUpperCase()} ${v}+`)
                                  .join(' or ')
                              )
                              .join(', ');
                          }
                          if (p.race && Array.isArray(p.race)) {
                            return p.race.map((r: any) => r.name || r.subrace || r).join(' or ');
                          }
                          if (p.proficiency && Array.isArray(p.proficiency)) {
                            return `Proficiency with ${p.proficiency.map((prof: any) => Object.values(prof).join(' ')).join(', ')}`;
                          }
                          if (p.other) return p.other;
                          return clean5eToolsText(p);
                        })
                        .filter(Boolean)
                        .join('; ')}
                    </div>
                  )}

                  <div className="space-y-2">
                    <h4 className="font-serif text-base font-bold text-stone-900">Benefits</h4>
                    <div className="space-y-2 bg-white/70 p-4 rounded-xl border border-[#E3DDD1] text-xs sm:text-sm text-stone-800 leading-relaxed whitespace-pre-line">
                      {render5eToolsEntries(selectedItem.rawData.entries) ||
                        clean5eToolsText(selectedItem.rawData.description || '')}
                    </div>
                  </div>
                </div>
              )}

              {/* 8. BACKGROUNDS VIEW */}
              {selectedItem.category === 'backgrounds' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white/70 p-3.5 rounded-xl border border-[#E3DDD1] text-xs">
                    <div>
                      <span className="text-[10px] text-stone-500 font-semibold uppercase block">
                        Skill Proficiencies
                      </span>
                      <span className="font-medium text-stone-900">
                        {selectedItem.rawData.skillProficiencies?.join(', ') || 'Choice'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-stone-500 font-semibold uppercase block">
                        Languages
                      </span>
                      <span className="font-medium text-stone-900">
                        {selectedItem.rawData.languages?.join(', ') || 'None'}
                      </span>
                    </div>
                  </div>

                  {/* Feature */}
                  {selectedItem.rawData.feature && (
                    <div className="space-y-1.5 bg-white/80 p-4 rounded-xl border border-[#E3DDD1]">
                      <div className="font-serif font-bold text-sm text-[#7A200D]">
                        Feature: {selectedItem.rawData.feature.name}
                      </div>
                      <div className="text-xs text-stone-700 leading-relaxed whitespace-pre-line">
                        {render5eToolsEntries(selectedItem.rawData.feature.entries) ||
                          clean5eToolsText(selectedItem.rawData.feature.entry || selectedItem.rawData.feature.entries?.[0] || '')}
                      </div>
                    </div>
                  )}

                  {/* Suggested Traits */}
                  {selectedItem.rawData.suggestedTraits && (
                    <div className="space-y-2">
                      <div className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                        Suggested Personality Traits
                      </div>
                      <div className="space-y-1.5">
                        {selectedItem.rawData.suggestedTraits.map((t: string, idx: number) => (
                          <div
                            key={idx}
                            onClick={() => {
                              onUpdateCharacter({
                                ...activeCharacter,
                                personalityTraits: t,
                              });
                              showToast(`Applied trait to ${activeCharacter.name}`);
                            }}
                            className="p-2.5 rounded-lg bg-white/80 hover:bg-white border border-[#E3DDD1] text-xs text-stone-800 cursor-pointer transition-colors flex items-start gap-2"
                            title="Click to apply to active character"
                          >
                            <span className="font-mono text-stone-400 font-bold">{idx + 1}.</span>
                            <span className="flex-1">{t}</span>
                            <Plus className="w-3.5 h-3.5 text-stone-400 hover:text-[#B85D36] shrink-0 mt-0.5" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 9. RULES & CONDITIONS VIEW */}
              {selectedItem.category === 'rules' && (
                <div className="space-y-4">
                  <p className="text-xs sm:text-sm text-stone-800 leading-relaxed bg-white/60 p-4 rounded-xl border border-[#E3DDD1]">
                    {selectedItem.rawData.description}
                  </p>

                  {selectedItem.rawData.bulletPoints && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                        Tactical Effects & Rules
                      </h4>
                      <div className="space-y-2">
                        {selectedItem.rawData.bulletPoints.map((bp: string, idx: number) => (
                          <div
                            key={idx}
                            className="p-3 rounded-xl bg-white border border-[#E3DDD1] text-xs text-stone-800 flex items-start gap-2.5 shadow-2xs"
                          >
                            <span className="w-2 h-2 rounded-full bg-[#7A200D] shrink-0 mt-1.5" />
                            <span className="leading-relaxed">{bp}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 10. ADVENTURING GEAR VIEW */}
              {selectedItem.category === 'gear' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-white/70 p-3.5 rounded-xl border border-[#E3DDD1]">
                    <div>
                      <span className="text-[10px] text-stone-500 font-semibold uppercase block">
                        Cost
                      </span>
                      <span className="font-serif text-base font-bold text-[#7A200D]">
                        {selectedItem.rawData.cost}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-stone-500 font-semibold uppercase block">
                        Weight
                      </span>
                      <span className="text-xs font-medium text-stone-900">
                        {selectedItem.rawData.weight} lb.
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-stone-500 font-semibold uppercase block">
                        Category
                      </span>
                      <span className="text-xs font-medium text-stone-900">
                        {selectedItem.rawData.category || 'Gear'}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-stone-800 leading-relaxed bg-white/60 p-4 rounded-xl border border-[#E3DDD1]">
                    {selectedItem.rawData.description ||
                      'Standard equipment for wilderness exploration and dungeon delving.'}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white border border-[#E3DDD1] rounded-2xl p-12 text-center space-y-3">
              <BookOpen className="w-12 h-12 text-stone-300 mx-auto" />
              <div className="font-serif text-lg font-bold text-stone-700">
                Select an entry to inspect
              </div>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Choose any class, race, spell, weapon, armor, feat, or condition from the left column
                to read its full rules and stats.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

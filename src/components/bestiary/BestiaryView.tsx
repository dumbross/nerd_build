/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  Plus,
  Copy,
  Trash2,
  Edit3,
  Sparkles,
  BookOpen,
  Filter,
  Check,
  Dices,
} from 'lucide-react';
import { Monster } from '../../types/monster';
import {
  loadAllMonsters,
  saveCustomMonster,
  deleteCustomMonster,
  fetchFull5eToolsMonsters,
  isFullBestiaryLoaded,
} from '../../utils/monsterStorage';
import { HomebreweryStatBlock } from './HomebreweryStatBlock';
import { CustomMonsterModal } from './CustomMonsterModal';

interface BestiaryViewProps {
  onQuickRoll?: (sides: number, count?: number, modifier?: number, label?: string) => void;
  onSwitchToCharacter?: () => void;
}

// Relevance scorer for monsters
function getMonsterSearchScore(m: Monster, q: string): number {
  if (!q) return 0;
  const name = m.name.toLowerCase();
  const type = m.type.toLowerCase();
  const cr = m.cr.toLowerCase();

  // Tier 1: Exact match on name
  if (name === q) return 100000;

  // Tier 2: Starts with query
  if (name.startsWith(q)) return 50000 - Math.min(name.length * 10, 5000);

  // Tier 3: Word boundary match
  try {
    const regex = new RegExp(`\\b${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'i');
    if (regex.test(name)) return 30000 - Math.min(name.length * 10, 5000);
  } catch {
    // fallback
  }

  // Tier 4: Substring in name
  if (name.includes(q)) return 20000 - Math.min(name.length * 10, 5000);

  // Tier 5: Exact CR match (e.g. user typed "11" or "1/4")
  if (cr === q) return 15000;

  // Tier 6: Type exact or substring
  if (type === q) return 12000;
  if (type.includes(q)) return 8000;

  // Tier 7: Trait or action match
  if (m.traits?.some((t) => t.name.toLowerCase().includes(q) || t.desc.toLowerCase().includes(q))) {
    return 3000;
  }
  if (m.actions?.some((a) => a.name.toLowerCase().includes(q) || a.desc.toLowerCase().includes(q))) {
    return 2000;
  }

  return 0;
}

// Numerical CR value for range filtering
function parseCrToNumber(cr: string): number {
  if (cr === '1/8') return 0.125;
  if (cr === '1/4') return 0.25;
  if (cr === '1/2') return 0.5;
  const val = parseFloat(cr);
  return isNaN(val) ? 0 : val;
}

export const BestiaryView: React.FC<BestiaryViewProps> = ({
  onQuickRoll,
  onSwitchToCharacter,
}) => {
  const [monsters, setMonsters] = useState<Monster[]>(() => loadAllMonsters());
  const [isLoadingFull, setIsLoadingFull] = useState(!isFullBestiaryLoaded());
  const [selectedMonsterId, setSelectedMonsterId] = useState<string>('m_revivisect');

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedCrRange, setSelectedCrRange] = useState('all');
  const [selectedSize, setSelectedSize] = useState('all');
  const [selectedSource, setSelectedSource] = useState('all');
  const [visibleCount, setVisibleCount] = useState(60);

  // Load all 4,568 5e.tools monsters seamlessly on mount
  useEffect(() => {
    fetchFull5eToolsMonsters().then((list) => {
      setMonsters(list);
      setIsLoadingFull(false);
    });
  }, []);

  // Reset pagination limit when filter parameters change
  useEffect(() => {
    setVisibleCount(60);
  }, [searchQuery, selectedType, selectedCrRange, selectedSize, selectedSource]);

  // Custom Monster Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [monsterToEdit, setMonsterToEdit] = useState<Monster | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Filtered & Ranked Monsters
  const filteredMonsters = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    const list = monsters.filter((m) => {
      // Type filter
      if (selectedType !== 'all' && m.type.toLowerCase() !== selectedType.toLowerCase()) {
        return false;
      }

      // Size filter
      if (selectedSize !== 'all' && m.size.toLowerCase() !== selectedSize.toLowerCase()) {
        return false;
      }

      // Source filter
      if (selectedSource !== 'all') {
        const src = (m.source || '').toLowerCase();
        if (selectedSource === 'custom') {
          if (!m.isCustom) return false;
        } else if (selectedSource === 'MM') {
          if (!src.includes('monster manual') && !src.includes('(mm)')) return false;
        } else if (selectedSource === 'TCE') {
          if (!src.includes('tasha') && !src.includes('(tce)')) return false;
        } else if (selectedSource === 'VGM') {
          if (!src.includes("volo's") && !src.includes('(vgm)')) return false;
        } else if (selectedSource === 'MTF') {
          if (!src.includes("mordenkainen's tome") && !src.includes('(mtf)')) return false;
        } else if (selectedSource === 'MPMM') {
          if (!src.includes('monsters of the multiverse') && !src.includes('(mpmm)')) return false;
        } else if (selectedSource === 'FTD') {
          if (!src.includes("fizban") && !src.includes('(ftd)')) return false;
        } else if (selectedSource === 'BGG') {
          if (!src.includes('giants') && !src.includes('(bgg)')) return false;
        } else if (selectedSource === 'CoS') {
          if (!src.includes('strahd') && !src.includes('(cos)')) return false;
        } else if (selectedSource === 'BGDIA') {
          if (!src.includes('avernus') && !src.includes('(bgdia)')) return false;
        } else if (selectedSource === 'ToA') {
          if (!src.includes('annihilation') && !src.includes('(toa)')) return false;
        } else if (selectedSource === 'SKT') {
          if (!src.includes("storm king") && !src.includes('(skt)')) return false;
        } else if (selectedSource === 'VRGR') {
          if (!src.includes('ravenloft') && !src.includes('(vrgr)')) return false;
        } else if (selectedSource === 'WDMM') {
          if (!src.includes('mad mage') && !src.includes('(wdmm)')) return false;
        } else if (selectedSource === 'WDH') {
          if (!src.includes('dragon heist') && !src.includes('(wdh)')) return false;
        } else if (selectedSource === 'IDRotF') {
          if (!src.includes('frostmaiden') && !src.includes('(idrotf)')) return false;
        } else if (selectedSource === 'XMM') {
          if (!src.includes('2024 monster manual') && !src.includes('(xmm)')) return false;
        } else if (selectedSource === 'ERLW') {
          if (!src.includes('eberron') && !src.includes('(erlw)')) return false;
        } else if (selectedSource === 'BAM') {
          if (!src.includes('astral menagerie') && !src.includes('(bam)')) return false;
        } else if (selectedSource === 'EGW') {
          if (!src.includes('wildemount') && !src.includes('(egw)')) return false;
        } else if (selectedSource === 'MOT') {
          if (!src.includes('theros') && !src.includes('(mot)')) return false;
        } else if (selectedSource === 'SCC') {
          if (!src.includes('strixhaven') && !src.includes('(scc)')) return false;
        } else if (selectedSource === 'AU') {
          if (!src.includes('unearthed arcana') && !src.includes('(au)')) return false;
        }
      }

      // CR range filter
      if (selectedCrRange !== 'all') {
        const numCr = parseCrToNumber(m.cr);
        if (selectedCrRange === '0-0.5' && numCr > 0.5) return false;
        if (selectedCrRange === '1-4' && (numCr < 1 || numCr > 4)) return false;
        if (selectedCrRange === '5-10' && (numCr < 5 || numCr > 10)) return false;
        if (selectedCrRange === '11-16' && (numCr < 11 || numCr > 16)) return false;
        if (selectedCrRange === '17+' && numCr < 17) return false;
      }

      // Search query
      if (q) {
        const score = getMonsterSearchScore(m, q);
        return score > 0;
      }

      return true;
    });

    if (q) {
      list.sort((a, b) => {
        const scoreA = getMonsterSearchScore(a, q);
        const scoreB = getMonsterSearchScore(b, q);
        if (scoreB !== scoreA) {
          return scoreB - scoreA;
        }
        return a.name.localeCompare(b.name);
      });
    } else {
      // Default order: Sort by CR ascending, then name
      list.sort((a, b) => {
        const crA = parseCrToNumber(a.cr);
        const crB = parseCrToNumber(b.cr);
        if (crA !== crB) return crA - crB;
        return a.name.localeCompare(b.name);
      });
    }

    return list;
  }, [monsters, searchQuery, selectedType, selectedCrRange, selectedSize, selectedSource]);

  // Paginated/windowed list for 60fps rendering with 4,500+ items
  const visibleMonsters = useMemo(() => {
    return filteredMonsters.slice(0, visibleCount);
  }, [filteredMonsters, visibleCount]);

  // Active monster resolution
  const activeMonster = useMemo(() => {
    const found = filteredMonsters.find((m) => m.id === selectedMonsterId);
    return found || filteredMonsters[0] || monsters[0];
  }, [filteredMonsters, selectedMonsterId, monsters]);

  // Handlers for Homebrew Monsters
  const handleSaveMonster = (m: Monster) => {
    const updatedList = saveCustomMonster(m);
    setMonsters(updatedList);
    setSelectedMonsterId(m.id);
    showToast(`Saved "${m.name}" to Bestiary`);
  };

  const handleDeleteMonster = (id: string) => {
    const m = monsters.find((item) => item.id === id);
    if (!m) return;
    const confirmed = window.confirm(`Delete custom monster "${m.name}"?`);
    if (!confirmed) return;
    const updatedList = deleteCustomMonster(id);
    setMonsters(updatedList);
    if (selectedMonsterId === id) {
      setSelectedMonsterId(updatedList[0]?.id || '');
    }
    showToast(`Deleted "${m.name}"`);
  };

  const handleCloneMonster = (source: Monster) => {
    const clone: Monster = {
      ...source,
      id: `custom_m_${Date.now()}`,
      name: `${source.name} (Custom)`,
      source: 'Homebrew',
      isCustom: true,
    };
    const updatedList = saveCustomMonster(clone);
    setMonsters(updatedList);
    setSelectedMonsterId(clone.id);
    showToast(`Cloned "${source.name}" as Homebrew`);
  };

  const allCreatureTypes = useMemo(() => {
    const set = new Set<string>();
    monsters.forEach((m) => set.add(m.type));
    return Array.from(set).sort();
  }, [monsters]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Bestiary Banner & Focus Switch Prompt */}
      <div className="bg-[#FAF8F5] border border-[#E8E3DA] rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#F0EBE1] border border-[#DDD5C7] flex items-center justify-center text-[#B85D36] shadow-sm">
            <BookOpen className="w-5 h-5" />
          </div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-2xl font-semibold text-stone-900 tracking-tight">
                Bestiary & Monster Folio
              </h1>
              <span className="text-[10px] font-sans font-semibold tracking-wide uppercase px-2 py-0.5 rounded-full bg-[#EFE9DF] text-[#7A200D] border border-[#DDD5C7]">
                {monsters.length.toLocaleString()} Monsters
              </span>
            </div>
            <p className="text-xs text-stone-600">
              Complete 5e.tools bestiary repository with all 4,575 monsters from Monster Manual, 2024 MM, Volo's Guide, Multiverse & 112 sourcebooks
            </p>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto">
          {onSwitchToCharacter && (
            <button
              onClick={onSwitchToCharacter}
              className="px-3.5 py-1.5 rounded-xl border border-[#E5DFD5] bg-white hover:bg-stone-50 text-stone-800 text-xs font-medium shadow-xs transition-colors"
            >
              Switch to Characters
            </button>
          )}

          <button
            onClick={() => {
              setMonsterToEdit(null);
              setIsModalOpen(true);
            }}
            className="px-4 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold shadow-sm flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>New Homebrew Monster</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white border border-[#E5DFD5] rounded-2xl p-4 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search monsters by name (e.g. Revivisect, Dragon), trait, action, or CR..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-[#FAF8F5] border border-[#E5DFD5] text-stone-900 placeholder-stone-500 focus:outline-none focus:border-stone-400"
            />
          </div>

          {/* Quick Filter Selectors */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            {/* Creature Type */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-2.5 py-1.5 text-xs rounded-xl bg-[#FAF8F5] border border-[#E5DFD5] text-stone-800 focus:outline-none"
            >
              <option value="all">All Types</option>
              {allCreatureTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>

            {/* CR Range */}
            <select
              value={selectedCrRange}
              onChange={(e) => setSelectedCrRange(e.target.value)}
              className="px-2.5 py-1.5 text-xs rounded-xl bg-[#FAF8F5] border border-[#E5DFD5] text-stone-800 focus:outline-none"
            >
              <option value="all">All CRs</option>
              <option value="0-0.5">CR 0 — 1/2</option>
              <option value="1-4">CR 1 — 4</option>
              <option value="5-10">CR 5 — 10</option>
              <option value="11-16">CR 11 — 16</option>
              <option value="17+">CR 17+</option>
            </select>

            {/* Size */}
            <select
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              className="px-2.5 py-1.5 text-xs rounded-xl bg-[#FAF8F5] border border-[#E5DFD5] text-stone-800 focus:outline-none"
            >
              <option value="all">All Sizes</option>
              <option value="Tiny">Tiny</option>
              <option value="Small">Small</option>
              <option value="Medium">Medium</option>
              <option value="Large">Large</option>
              <option value="Huge">Huge</option>
              <option value="Gargantuan">Gargantuan</option>
            </select>

            {/* Source */}
            <select
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              className="px-2.5 py-1.5 text-xs rounded-xl bg-[#FAF8F5] border border-[#E5DFD5] text-stone-800 focus:outline-none"
            >
              <option value="all">All Books & Sources (4,575 Monsters)</option>
              <option value="MM">Monster Manual (MM)</option>
              <option value="XMM">2024 Monster Manual (XMM)</option>
              <option value="TCE">Tasha's Cauldron of Everything (TCE)</option>
              <option value="VGM">Volo's Guide to Monsters (VGM)</option>
              <option value="MTF">Mordenkainen's Tome of Foes (MTF)</option>
              <option value="MPMM">Monsters of the Multiverse (MPMM)</option>
              <option value="FTD">Fizban's Treasury of Dragons (FTD)</option>
              <option value="BGG">Bigby: Glory of the Giants (BGG)</option>
              <option value="CoS">Curse of Strahd (CoS)</option>
              <option value="BGDIA">Descent into Avernus (BGDIA)</option>
              <option value="ToA">Tomb of Annihilation (ToA)</option>
              <option value="SKT">Storm King's Thunder (SKT)</option>
              <option value="WDMM">Dungeon of the Mad Mage (WDMM)</option>
              <option value="WDH">Dragon Heist (WDH)</option>
              <option value="IDRotF">Rime of the Frostmaiden (IDRotF)</option>
              <option value="VRGR">Van Richten's Guide to Ravenloft (VRGR)</option>
              <option value="ERLW">Eberron: Rising from the Last War (ERLW)</option>
              <option value="BAM">Boo's Astral Menagerie (BAM)</option>
              <option value="EGW">Explorer's Guide to Wildemount (EGW)</option>
              <option value="MOT">Mythic Odysseys of Theros (MOT)</option>
              <option value="SCC">Strixhaven: Curriculum of Chaos (SCC)</option>
              <option value="AU">Unearthed Arcana (AU)</option>
              <option value="custom">Homebrew Only</option>
            </select>

            {/* Clear Filters */}
            {(searchQuery ||
              selectedType !== 'all' ||
              selectedCrRange !== 'all' ||
              selectedSize !== 'all' ||
              selectedSource !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedType('all');
                  setSelectedCrRange('all');
                  setSelectedSize('all');
                  setSelectedSource('all');
                }}
                className="text-xs text-[#B85D36] hover:underline whitespace-nowrap px-2"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Counter and Notification */}
        <div className="flex items-center justify-between text-xs text-stone-500 pt-1 border-t border-[#F0EBE1]">
          <span>
            Showing <strong className="text-stone-800">{visibleMonsters.length}</strong> of{' '}
            <strong className="text-stone-800">{filteredMonsters.length.toLocaleString()}</strong> matching monsters{' '}
            <span className="text-stone-400">({monsters.length.toLocaleString()} total library)</span>
          </span>

          {toastMessage && (
            <span className="text-[#2E4A3E] font-medium flex items-center gap-1 animate-in fade-in">
              <Check className="w-3.5 h-3.5" />
              <span>{toastMessage}</span>
            </span>
          )}
        </div>
      </div>

      {/* Main Split Layout: Monster Index & Homebrewery Stat Block View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Monster List Column */}
        <div className="lg:col-span-4 bg-white border border-[#E5DFD5] rounded-2xl shadow-sm overflow-hidden flex flex-col max-h-[85vh]">
          <div className="p-3 border-b border-[#E8E3DA] bg-[#FAF8F5] flex items-center justify-between text-xs font-semibold text-stone-700">
            <span>Monster Index</span>
            <span className="font-mono text-[11px] text-stone-500">CR / Source</span>
          </div>

          <div className="overflow-y-auto divide-y divide-[#F0EBE1] flex-1">
            {filteredMonsters.length === 0 ? (
              <div className="p-8 text-center text-xs text-stone-500">
                No monsters match your filter criteria.
              </div>
            ) : (
              <>
                {visibleMonsters.map((monster) => {
                  const isSelected = monster.id === activeMonster?.id;
                  return (
                    <button
                      key={monster.id}
                      onClick={() => setSelectedMonsterId(monster.id)}
                      className={`w-full text-left p-3.5 transition-all flex items-center justify-between group ${
                        isSelected
                          ? 'bg-[#FAF4ED] border-l-4 border-l-[#B85D36] text-stone-900'
                          : 'hover:bg-[#FAF8F5] text-stone-800'
                      }`}
                    >
                      <div className="flex-1 min-w-0 pr-2">
                        <div className="flex items-center gap-2">
                          <span className="font-serif font-semibold text-sm text-stone-900 truncate">
                            {monster.name}
                          </span>
                          {monster.isCustom && (
                            <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 rounded bg-[#FAF4ED] text-[#B85D36] border border-[#ECD9CE]">
                              HB
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-stone-500 mt-0.5 truncate">
                          {monster.size} {monster.type} · AC {monster.ac} · {monster.hp} HP
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="px-2 py-0.5 text-[11px] font-mono font-semibold rounded bg-stone-100 text-stone-700 border border-stone-200">
                          CR {monster.cr}
                        </span>
                      </div>
                    </button>
                  );
                })}

                {visibleCount < filteredMonsters.length && (
                  <div className="p-3 text-center bg-[#FAF8F5] sticky bottom-0 border-t border-[#E8E3DA]">
                    <button
                      onClick={() => setVisibleCount((prev) => prev + 60)}
                      className="w-full py-2 px-3 rounded-xl bg-white border border-[#E5DFD5] hover:bg-stone-50 text-xs font-semibold text-stone-800 transition-colors shadow-xs"
                    >
                      Load More Monsters ({visibleMonsters.length} of {filteredMonsters.length.toLocaleString()})
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Right Detail Column: Homebrewery Stat Block */}
        <div className="lg:col-span-8 space-y-4">
          {activeMonster ? (
            <>
              {/* Stat Block Action Bar */}
              <div className="flex items-center justify-between gap-3 bg-white border border-[#E5DFD5] rounded-xl px-4 py-2.5 shadow-sm">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-stone-900 font-serif">
                    {activeMonster.name}
                  </span>
                  <span className="text-[11px] text-stone-500 font-mono">
                    Source: {activeMonster.source || 'SRD 5.1'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCloneMonster(activeMonster)}
                    className="px-2.5 py-1 text-xs font-medium rounded-lg border border-[#E5DFD5] hover:bg-stone-50 text-stone-700 flex items-center gap-1.5 transition-colors"
                    title="Duplicate as editable homebrew monster"
                  >
                    <Copy className="w-3.5 h-3.5 text-stone-500" />
                    <span>Clone / Homebrew</span>
                  </button>

                  {activeMonster.isCustom && (
                    <>
                      <button
                        onClick={() => {
                          setMonsterToEdit(activeMonster);
                          setIsModalOpen(true);
                        }}
                        className="px-2.5 py-1 text-xs font-medium rounded-lg border border-[#E5DFD5] hover:bg-stone-50 text-stone-700 flex items-center gap-1.5 transition-colors"
                        title="Edit custom monster"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-stone-500" />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => handleDeleteMonster(activeMonster.id)}
                        className="px-2 py-1 text-xs font-medium rounded-lg border border-[#E5DFD5] hover:bg-red-50 text-red-600 flex items-center gap-1 transition-colors"
                        title="Delete custom monster"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Homebrewery Rendered Stat Block */}
              <HomebreweryStatBlock monster={activeMonster} onQuickRoll={onQuickRoll} />
            </>
          ) : (
            <div className="p-12 text-center text-stone-500 bg-white border border-[#E5DFD5] rounded-2xl">
              Select a monster from the index to display its stat block.
            </div>
          )}
        </div>
      </div>

      {/* Custom Monster Crafting Modal */}
      <CustomMonsterModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        monsterToEdit={monsterToEdit}
        onSaveMonster={handleSaveMonster}
      />
    </div>
  );
};

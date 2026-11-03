/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Download,
  ExternalLink,
  Search,
  Plus,
  Folder,
  Link as LinkIcon,
  Check,
  Edit2,
  Trash2,
  Sparkles,
  Shield,
  FileText,
} from 'lucide-react';
import { LibraryTome } from '../../data/libraryPdfs';
import {
  loadLibraryTomes,
  saveLibraryTomes,
  loadMasterDriveFolderUrl,
  saveMasterDriveFolderUrl,
} from '../../utils/libraryStorage';
import { parseGoogleDriveUrl } from '../../utils/googleDrive';
import { PdfReaderModal } from './PdfReaderModal';

export const LibraryView: React.FC = () => {
  const [tomes, setTomes] = useState<LibraryTome[]>(() => loadLibraryTomes());
  const [masterFolderUrl, setMasterFolderUrl] = useState<string>(() => loadMasterDriveFolderUrl());
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [folderInput, setFolderInput] = useState(masterFolderUrl);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Active Reading Modal
  const [activeReadingTome, setActiveReadingTome] = useState<LibraryTome | null>(null);

  // New Book Dialog
  const [isAddBookModalOpen, setIsAddBookModalOpen] = useState(false);
  const [newBookTitle, setNewBookTitle] = useState('');
  const [newBookSubtitle, setNewBookSubtitle] = useState('');
  const [newBookCategory, setNewBookCategory] = useState<LibraryTome['category']>('Custom');
  const [newBookUrl, setNewBookUrl] = useState('');
  const [newBookCode, setNewBookCode] = useState('');
  const [newBookColor, setNewBookColor] = useState('#7A200D');

  const parsedFolder = useMemo(() => parseGoogleDriveUrl(masterFolderUrl), [masterFolderUrl]);

  const handleUpdateTomeUrl = (tomeId: string, newUrl: string) => {
    setTomes((prev) => {
      const updated = prev.map((t) => (t.id === tomeId ? { ...t, driveUrl: newUrl.trim() } : t));
      saveLibraryTomes(updated);
      return updated;
    });
    if (activeReadingTome?.id === tomeId) {
      setActiveReadingTome((prev) => (prev ? { ...prev, driveUrl: newUrl.trim() } : null));
    }
  };

  const handleSaveMasterFolder = () => {
    const trimmed = folderInput.trim();
    setMasterFolderUrl(trimmed);
    saveMasterDriveFolderUrl(trimmed);
    setIsFolderModalOpen(false);

    // If tomes don't have individual URLs, offer to fill with master folder so they can open folder view
    if (trimmed) {
      setTomes((prev) => {
        const updated = prev.map((t) => {
          if (!t.driveUrl) {
            return { ...t, driveUrl: trimmed };
          }
          return t;
        });
        saveLibraryTomes(updated);
        return updated;
      });
    }
  };

  const handleCreateNewBook = () => {
    if (!newBookTitle.trim()) return;
    const newTome: LibraryTome = {
      id: `tome_${Date.now()}`,
      title: newBookTitle.trim(),
      subtitle: newBookSubtitle.trim() || 'Custom Reference Tome',
      category: newBookCategory,
      description: 'Custom PDF linked via Google Drive.',
      sourceCode: newBookCode.trim().toUpperCase() || 'CUSTOM',
      driveUrl: newBookUrl.trim(),
      coverAccent: newBookColor,
      tags: ['Custom', 'Google Drive'],
      addedAt: new Date().toISOString().split('T')[0],
    };
    const updated = [newTome, ...tomes];
    setTomes(updated);
    saveLibraryTomes(updated);
    setIsAddBookModalOpen(false);
    setNewBookTitle('');
    setNewBookSubtitle('');
    setNewBookUrl('');
    setNewBookCode('');
  };

  const handleDeleteTome = (id: string) => {
    const updated = tomes.filter((t) => t.id !== id);
    setTomes(updated);
    saveLibraryTomes(updated);
  };

  // Filtered tomes
  const filteredTomes = useMemo(() => {
    return tomes.filter((tome) => {
      if (selectedCategory !== 'all' && tome.category !== selectedCategory) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        tome.title.toLowerCase().includes(q) ||
        tome.subtitle.toLowerCase().includes(q) ||
        tome.sourceCode.toLowerCase().includes(q) ||
        tome.description.toLowerCase().includes(q) ||
        tome.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    });
  }, [tomes, selectedCategory, searchQuery]);

  const categories = ['all', 'Monsters & Foes', 'Player Expansions', 'Draconic Lore', 'Custom'];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Master Banner */}
      <div className="bg-gradient-to-r from-[#2B1B17] via-[#3B2820] to-[#1F1614] rounded-2xl p-6 sm:p-8 text-[#FAF8F5] border border-[#523B33] shadow-lg relative overflow-hidden">
        {/* Background Decorative Crest */}
        <div className="absolute -right-8 -bottom-10 opacity-10 pointer-events-none">
          <BookOpen className="w-80 h-80 text-white" />
        </div>

        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs text-[#EBD6CA] font-medium backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#E68A60]" />
            <span>Google Drive PDF Vault & Reader</span>
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#FAF8F5]">
            Grimoire Library & Sourcebooks
          </h2>

          <p className="text-xs sm:text-sm text-[#D5CDBD] leading-relaxed">
            Read complete 5e rulebooks, bestiaries, and supplements directly in your browser or download them for offline sessions. Hosted seamlessly through your public Google Drive.
          </p>

          {/* Master Folder Actions */}
          <div className="flex flex-wrap items-center gap-2.5 pt-2">
            <button
              onClick={() => {
                setFolderInput(masterFolderUrl);
                setIsFolderModalOpen(true);
              }}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#B85D36] hover:bg-[#A34A25] text-white transition-all flex items-center gap-2 shadow-sm"
            >
              <Folder className="w-4 h-4" />
              <span>{masterFolderUrl ? 'Edit Google Drive Folder' : 'Link Google Drive Folder'}</span>
            </button>

            {parsedFolder && (
              <a
                href={parsedFolder.viewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 rounded-xl text-xs font-medium bg-white/10 hover:bg-white/20 text-[#FAF8F5] border border-white/20 transition-all flex items-center gap-1.5"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open Drive Folder</span>
              </a>
            )}

            <button
              onClick={() => setIsAddBookModalOpen(true)}
              className="px-3.5 py-2 rounded-xl text-xs font-medium bg-white/10 hover:bg-white/20 text-[#FAF8F5] border border-white/20 transition-all flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Custom PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-[#E3DDD1] shadow-2xs">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search books by title, author, rules, or tag..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#FAF8F5] border border-[#DDD5C7] text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#B85D36] transition-all"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all border ${
                selectedCategory === cat
                  ? 'bg-stone-900 text-white border-stone-900 shadow-2xs'
                  : 'bg-white hover:bg-[#FAF8F5] text-stone-600 border-[#E0D9CE]'
              }`}
            >
              {cat === 'all' ? 'All Tomes' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Tomes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6">
        {filteredTomes.map((tome) => {
          const parsed = parseGoogleDriveUrl(tome.driveUrl);
          const hasLink = Boolean(parsed);

          return (
            <div
              key={tome.id}
              className="bg-white rounded-2xl border border-[#E3DDD1] hover:border-[#D0C7B8] shadow-2xs hover:shadow-md transition-all flex flex-col overflow-hidden group"
            >
              {/* Top Accent Strip */}
              <div
                className="h-2 w-full transition-all group-hover:h-2.5"
                style={{ backgroundColor: tome.coverAccent || '#7A200D' }}
              />

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                {/* Book Header & Title */}
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span
                        className="text-[10px] font-mono font-bold px-2 py-0.5 rounded text-white shadow-2xs"
                        style={{ backgroundColor: tome.coverAccent || '#7A200D' }}
                      >
                        {tome.sourceCode}
                      </span>
                      <span className="text-[11px] font-medium text-stone-500 uppercase tracking-wider">
                        {tome.category}
                      </span>
                    </div>

                    {hasLink ? (
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <Check className="w-3 h-3" />
                        <span>Ready</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                        <LinkIcon className="w-3 h-3" />
                        <span>Link Pending</span>
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="font-serif text-lg font-bold text-stone-900 group-hover:text-[#B85D36] transition-colors leading-snug">
                      {tome.title}
                    </h3>
                    <p className="text-xs text-stone-500 mt-0.5">{tome.subtitle}</p>
                  </div>

                  <p className="text-xs text-stone-700 leading-relaxed pt-1">
                    {tome.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {tome.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-[#FAF8F5] border border-[#E3DDD1] text-stone-600 font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="pt-4 border-t border-[#F0EBE1] flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {hasLink ? (
                      <button
                        onClick={() => setActiveReadingTome(tome)}
                        className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-[#B85D36] hover:bg-[#A34A25] active:bg-[#8F3E1D] text-white flex items-center gap-1.5 transition-colors shadow-2xs"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Read in Browser</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => setActiveReadingTome(tome)}
                        className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-stone-900 hover:bg-stone-800 text-white flex items-center gap-1.5 transition-colors shadow-2xs"
                      >
                        <LinkIcon className="w-3.5 h-3.5" />
                        <span>Connect Link</span>
                      </button>
                    )}

                    {hasLink && parsed && (
                      <a
                        href={parsed.downloadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-xl text-xs font-medium bg-[#FAF8F5] hover:bg-[#F0EBE1] border border-[#DDD5C7] text-stone-700 flex items-center gap-1.5 transition-colors"
                        title="Download PDF"
                      >
                        <Download className="w-3.5 h-3.5 text-stone-500" />
                        <span className="hidden sm:inline">Download</span>
                      </a>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setActiveReadingTome(tome)}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
                      title="Edit Google Drive Link"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    {tome.id.startsWith('tome_1') && (
                      <button
                        onClick={() => handleDeleteTome(tome.id)}
                        className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Delete custom tome"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Master Folder Modal */}
      {isFolderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white border border-[#D5CDBD] shadow-2xl rounded-2xl w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#F5EFE6] text-[#B85D36] flex items-center justify-center">
                <Folder className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-base text-stone-900">
                  Google Drive Master Folder
                </h3>
                <p className="text-xs text-stone-500">
                  Link your shared Google Drive folder containing your D&D PDF files
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-stone-700 block">
                Google Drive Folder Link
              </label>
              <input
                type="text"
                value={folderInput}
                onChange={(e) => setFolderInput(e.target.value)}
                placeholder="https://drive.google.com/drive/folders/..."
                className="w-full px-3 py-2 rounded-xl border border-[#DDD5C7] text-xs font-mono bg-[#FAF8F5] focus:outline-none focus:ring-2 focus:ring-[#B85D36]"
              />
              <p className="text-[11px] text-stone-500">
                Ensure the folder sharing settings in Google Drive are set to <strong>"Anyone with the link can view"</strong>.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setIsFolderModalOpen(false)}
                className="px-3.5 py-1.5 rounded-xl text-xs font-medium text-stone-600 hover:bg-stone-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveMasterFolder}
                className="px-4 py-1.5 rounded-xl text-xs font-semibold bg-[#B85D36] hover:bg-[#A34A25] text-white transition-colors shadow-2xs"
              >
                Save Folder Link
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Custom Book Modal */}
      {isAddBookModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white border border-[#D5CDBD] shadow-2xl rounded-2xl w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#F5EFE6] text-[#B85D36] flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-base text-stone-900">
                  Add New Tome to Library
                </h3>
                <p className="text-xs text-stone-500">
                  Connect any 5e rulebook, adventure, or homebrew PDF
                </p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-stone-700 block mb-1">Book Title *</label>
                <input
                  type="text"
                  value={newBookTitle}
                  onChange={(e) => setNewBookTitle(e.target.value)}
                  placeholder="e.g. Dungeon Master's Guide 2024"
                  className="w-full px-3 py-2 rounded-xl border border-[#DDD5C7] bg-[#FAF8F5] focus:outline-none focus:ring-2 focus:ring-[#B85D36]"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Subtitle / Edition</label>
                <input
                  type="text"
                  value={newBookSubtitle}
                  onChange={(e) => setNewBookSubtitle(e.target.value)}
                  placeholder="e.g. Core Rulebook, OCR Bookmarked"
                  className="w-full px-3 py-2 rounded-xl border border-[#DDD5C7] bg-[#FAF8F5] focus:outline-none focus:ring-2 focus:ring-[#B85D36]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Category</label>
                  <select
                    value={newBookCategory}
                    onChange={(e) => setNewBookCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-[#DDD5C7] bg-[#FAF8F5] focus:outline-none focus:ring-2 focus:ring-[#B85D36]"
                  >
                    <option value="Monsters & Foes">Monsters & Foes</option>
                    <option value="Player Expansions">Player Expansions</option>
                    <option value="Draconic Lore">Draconic Lore</option>
                    <option value="Adventures & Modules">Adventures & Modules</option>
                    <option value="Custom">Custom</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Source Code</label>
                  <input
                    type="text"
                    value={newBookCode}
                    onChange={(e) => setNewBookCode(e.target.value)}
                    placeholder="e.g. DMG"
                    className="w-full px-3 py-2 rounded-xl border border-[#DDD5C7] bg-[#FAF8F5] focus:outline-none focus:ring-2 focus:ring-[#B85D36]"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">
                  Google Drive Share Link
                </label>
                <input
                  type="text"
                  value={newBookUrl}
                  onChange={(e) => setNewBookUrl(e.target.value)}
                  placeholder="https://drive.google.com/file/d/..."
                  className="w-full px-3 py-2 rounded-xl border border-[#DDD5C7] font-mono text-[11px] bg-[#FAF8F5] focus:outline-none focus:ring-2 focus:ring-[#B85D36]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#F0EBE1]">
              <button
                onClick={() => setIsAddBookModalOpen(false)}
                className="px-3.5 py-1.5 rounded-xl text-xs font-medium text-stone-600 hover:bg-stone-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateNewBook}
                disabled={!newBookTitle.trim()}
                className="px-4 py-1.5 rounded-xl text-xs font-semibold bg-[#B85D36] hover:bg-[#A34A25] disabled:opacity-50 text-white transition-colors shadow-2xs"
              >
                Add Tome
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reader Modal */}
      <PdfReaderModal
        tome={activeReadingTome}
        isOpen={Boolean(activeReadingTome)}
        onClose={() => setActiveReadingTome(null)}
        onUpdateTomeUrl={handleUpdateTomeUrl}
      />
    </div>
  );
};

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  BOOKSHELF_BOOKS,
  BookshelfBook,
  GOOGLE_DRIVE_FOLDER_URL,
} from '../../data/bookshelfData';
import {
  BookOpen,
  Download,
  ExternalLink,
  Search,
  FolderOpen,
  X,
  Maximize2,
  FileText,
  Sparkles,
  ChevronRight,
  Layers,
  Skull,
  BookMarked,
  Check,
} from 'lucide-react';

interface BookshelfViewProps {
  onOpenCompendiumWithSource?: (source: string) => void;
  onOpenBestiaryWithSource?: (source: string) => void;
}

export const BookshelfView: React.FC<BookshelfViewProps> = ({
  onOpenCompendiumWithSource,
  onOpenBestiaryWithSource,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeReadingBook, setActiveReadingBook] = useState<BookshelfBook | null>(null);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const filteredBooks = BOOKSHELF_BOOKS.filter((book) => {
    if (selectedCategory !== 'all' && book.sourceCategory !== selectedCategory) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = book.title.toLowerCase().includes(q);
      const matchSubtitle = book.subtitle.toLowerCase().includes(q);
      const matchCode = book.code.toLowerCase().includes(q);
      const matchDesc = book.description.toLowerCase().includes(q);
      const matchContents = book.contents.some((c) => c.toLowerCase().includes(q));
      return matchTitle || matchSubtitle || matchCode || matchDesc || matchContents;
    }
    return true;
  });

  const handleImageError = (bookId: string) => {
    setImageErrors((prev) => ({ ...prev, [bookId]: true }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Bookshelf Header */}
      <div className="bg-gradient-to-r from-[#29221C] via-[#382D24] to-[#241D17] text-amber-50 rounded-2xl p-6 sm:p-8 border border-[#524538] shadow-md relative overflow-hidden">
        {/* Background decorative parchment glow */}
        <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
        <div className="absolute right-1/4 -bottom-20 w-64 h-64 rounded-full bg-orange-600/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-200 text-xs font-medium">
              <BookMarked className="w-3.5 h-3.5 text-amber-300" />
              <span>5e Atelier Library & Tome Archive</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#FAF4EB]">
              The Grand Bookshelf
            </h1>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              Read and download complete 5e sourcebook PDFs directly from your linked Google Drive
              archive. Each book is indexed with its full rules, spells, races, and creatures.
            </p>
          </div>

          {/* Drive Folder Link */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0 w-full sm:w-auto">
            <a
              href={GOOGLE_DRIVE_FOLDER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 active:bg-amber-700 text-white text-xs font-semibold shadow-sm transition-all flex items-center justify-center gap-2 group"
              title="Open full Google Drive folder in a new tab"
            >
              <FolderOpen className="w-4 h-4 text-amber-200 group-hover:scale-110 transition-transform" />
              <span>Open Google Drive Folder</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80" />
            </a>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-[#E3DDD1] rounded-2xl p-4 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search books by title, spells, monsters, or rules (e.g. Tasha, Dragons, Volo)..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-[#FAF8F5] border border-[#E3DDD1] text-stone-900 placeholder-stone-400 focus:outline-none focus:border-stone-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-xs"
            >
              Clear
            </button>
          )}
        </div>

        {/* Categories */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 shrink-0">
          {[
            { id: 'all', label: 'All Tomes' },
            { id: 'Core Expansion', label: 'Core Expansions' },
            { id: 'Monsters & Foes', label: 'Monsters & Foes' },
            { id: 'Lore & Dragons', label: 'Dragons & Lore' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-[#FAF8F5] text-stone-600 hover:bg-[#F2ECE1] border border-[#E3DDD1]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Shelf Display Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {filteredBooks.map((book) => {
          const hasImageError = imageErrors[book.id];

          return (
            <div
              key={book.id}
              className="bg-white rounded-2xl border border-[#E3DDD1] overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col group hover:border-[#D0C7B7]"
            >
              {/* Top Cover / Header Banner */}
              <div
                className="relative p-6 text-white flex flex-col justify-between overflow-hidden min-h-[170px]"
                style={{
                  background: `linear-gradient(135deg, ${book.color.gradientFrom} 0%, ${book.color.gradientTo} 100%)`,
                }}
              >
                {/* Decorative background cover thumbnail with soft blur */}
                {!hasImageError && (
                  <img
                    src={book.thumbnailUrl}
                    alt={book.title}
                    onError={() => handleImageError(book.id)}
                    className="absolute right-0 top-0 h-full w-48 object-cover opacity-25 group-hover:opacity-40 transition-opacity filter blur-[1px] pointer-events-none"
                  />
                )}

                {/* Top Badges */}
                <div className="relative z-10 flex items-center justify-between gap-2">
                  <span
                    className="px-2.5 py-1 rounded-lg text-[11px] font-bold tracking-wider uppercase border shadow-2xs"
                    style={{
                      backgroundColor: book.color.badgeBg,
                      color: book.color.badgeText,
                      borderColor: book.color.border,
                    }}
                  >
                    {book.code} · {book.sourceCategory}
                  </span>

                  <div className="flex items-center gap-2 text-[11px] text-white/80 font-mono">
                    <span>{book.pageCount} pages</span>
                    <span>·</span>
                    <span>{book.fileSize}</span>
                  </div>
                </div>

                {/* Title & Subtitle */}
                <div className="relative z-10 mt-4 space-y-1">
                  <h3 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-white leading-tight">
                    {book.title}
                  </h3>
                  <p className="text-xs text-white/80 line-clamp-1">{book.subtitle}</p>
                </div>
              </div>

              {/* Book Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <p className="text-xs text-stone-600 leading-relaxed">{book.description}</p>

                {/* Highlights / Content Chips */}
                <div className="space-y-2">
                  <div className="text-[11px] font-bold text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>Included Material & Rules</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {book.contents.slice(0, 4).map((item, idx) => (
                      <div
                        key={idx}
                        className="text-[11px] text-stone-700 bg-[#FAF8F5] p-2 rounded-lg border border-[#EAE4D9] flex items-start gap-1.5"
                      >
                        <Check className="w-3 h-3 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="line-clamp-2">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-2 border-t border-[#EFEAE2] flex flex-wrap items-center gap-2">
                  {/* Primary Read/Preview Button */}
                  <button
                    onClick={() => setActiveReadingBook(book)}
                    className="flex-1 px-4 py-2 rounded-xl text-xs font-semibold bg-stone-900 hover:bg-stone-800 text-white flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                    title={`Open and read ${book.title} inside the app`}
                  >
                    <BookOpen className="w-3.5 h-3.5 text-amber-300" />
                    <span>Read in Viewer</span>
                  </button>

                  {/* Direct Google Drive Open */}
                  <a
                    href={book.driveViewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2 rounded-xl text-xs font-medium bg-[#F5EFE6] hover:bg-[#EAE2D5] text-stone-800 border border-[#E3DDD1] flex items-center gap-1.5 transition-colors"
                    title="Open PDF directly in Google Drive"
                  >
                    <span>Drive</span>
                    <ExternalLink className="w-3.5 h-3.5 text-stone-500" />
                  </a>

                  {/* Direct Download Button */}
                  <a
                    href={book.driveDownloadUrl}
                    className="px-3 py-2 rounded-xl text-xs font-medium bg-[#F5EFE6] hover:bg-[#EAE2D5] text-stone-800 border border-[#E3DDD1] flex items-center gap-1.5 transition-colors"
                    title={`Download ${book.filename}`}
                  >
                    <Download className="w-3.5 h-3.5 text-stone-600" />
                    <span>Download</span>
                  </a>

                  {/* Quick Jump to Compendium */}
                  {onOpenCompendiumWithSource && (
                    <button
                      onClick={() => onOpenCompendiumWithSource(book.code)}
                      className="px-2.5 py-2 rounded-xl text-[11px] font-medium text-stone-600 hover:text-stone-900 hover:bg-[#FAF8F5] transition-colors flex items-center gap-1"
                      title={`Filter Compendium rules for ${book.code}`}
                    >
                      <Layers className="w-3 h-3" />
                      <span>Compendium</span>
                    </button>
                  )}

                  {/* Quick Jump to Bestiary */}
                  {onOpenBestiaryWithSource && (
                    <button
                      onClick={() => onOpenBestiaryWithSource(book.code)}
                      className="px-2.5 py-2 rounded-xl text-[11px] font-medium text-[#7A200D] hover:text-[#5A1406] hover:bg-[#FDF5F2] transition-colors flex items-center gap-1"
                      title={`Filter Bestiary monsters from ${book.code}`}
                    >
                      <Skull className="w-3 h-3" />
                      <span>Monsters</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredBooks.length === 0 && (
        <div className="bg-white border border-[#E3DDD1] rounded-2xl p-12 text-center space-y-3">
          <BookOpen className="w-12 h-12 text-stone-300 mx-auto" />
          <div className="font-serif text-lg font-bold text-stone-700">No books found</div>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            No sourcebooks matched &quot;{searchQuery}&quot;. Try clearing your search or browsing
            all books.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-stone-900 text-white"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Embedded PDF Reader Modal */}
      {activeReadingBook && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex flex-col animate-in fade-in duration-200">
          {/* Reader Top Bar */}
          <div className="bg-[#241D17] border-b border-[#3E342B] px-4 sm:px-6 py-3 flex items-center justify-between text-white shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <span
                className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider"
                style={{
                  backgroundColor: activeReadingBook.color.badgeBg,
                  color: activeReadingBook.color.badgeText,
                }}
              >
                {activeReadingBook.code}
              </span>
              <div className="min-w-0">
                <h3 className="font-serif font-bold text-sm sm:text-base text-white truncate">
                  {activeReadingBook.title}
                </h3>
                <p className="text-[11px] text-stone-400 truncate hidden sm:block">
                  {activeReadingBook.filename} · {activeReadingBook.pageCount} pages ·{' '}
                  {activeReadingBook.fileSize}
                </p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2 shrink-0">
              <a
                href={activeReadingBook.driveViewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[#382D24] hover:bg-[#483B30] text-amber-100 flex items-center gap-1.5 transition-colors"
                title="Open in new Google Drive tab"
              >
                <Maximize2 className="w-3.5 h-3.5 text-amber-300" />
                <span className="hidden sm:inline">Open in Drive</span>
              </a>

              <a
                href={activeReadingBook.driveDownloadUrl}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-600 hover:bg-amber-500 text-white flex items-center gap-1.5 transition-colors"
                title="Download PDF"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Download</span>
              </a>

              <button
                onClick={() => setActiveReadingBook(null)}
                className="p-1.5 rounded-lg hover:bg-white/10 text-stone-300 hover:text-white transition-colors"
                title="Close Reader"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Embedded PDF iframe */}
          <div className="flex-1 bg-stone-900 relative">
            <iframe
              src={activeReadingBook.drivePreviewUrl}
              title={activeReadingBook.title}
              className="w-full h-full border-0"
              allow="autoplay"
            />
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  X,
  Download,
  ExternalLink,
  Maximize2,
  Minimize2,
  BookOpen,
  Link as LinkIcon,
  Check,
  AlertCircle,
  Folder,
} from 'lucide-react';
import { LibraryTome } from '../../data/libraryPdfs';
import { parseGoogleDriveUrl } from '../../utils/googleDrive';

interface PdfReaderModalProps {
  tome: LibraryTome | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateTomeUrl: (tomeId: string, newUrl: string) => void;
}

export const PdfReaderModal: React.FC<PdfReaderModalProps> = ({
  tome,
  isOpen,
  onClose,
  onUpdateTomeUrl,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [inputUrl, setInputUrl] = useState('');
  const [isEditingUrl, setIsEditingUrl] = useState(false);

  useEffect(() => {
    if (tome) {
      setInputUrl(tome.driveUrl || '');
      setIsEditingUrl(!tome.driveUrl);
    }
  }, [tome]);

  // Handle ESC key to exit
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        if (isFullscreen) {
          setIsFullscreen(false);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isFullscreen, onClose]);

  if (!isOpen || !tome) return null;

  const parsed = parseGoogleDriveUrl(tome.driveUrl);

  const handleSaveUrl = () => {
    if (tome) {
      onUpdateTomeUrl(tome.id, inputUrl);
      setIsEditingUrl(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-stone-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className={`bg-white border border-[#D5CDBD] shadow-2xl rounded-2xl flex flex-col overflow-hidden transition-all duration-300 ${
          isFullscreen
            ? 'w-full h-full rounded-none border-none'
            : 'w-full max-w-6xl h-[92vh] max-h-[1050px]'
        }`}
      >
        {/* Header Bar */}
        <div className="bg-[#FAF7F2] border-b border-[#E3DDD1] px-4 py-3 flex items-center justify-between gap-3 shrink-0">
          {/* Tome Title & Info */}
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white shrink-0 shadow-2xs"
              style={{ backgroundColor: tome.coverAccent || '#7A200D' }}
            >
              {parsed?.isFolder ? <Folder className="w-4 h-4" /> : <BookOpen className="w-4 h-4" />}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-sm sm:text-base text-stone-900 truncate">
                  {tome.title}
                </h3>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white border border-[#DDD5C7] text-stone-600 shrink-0">
                  {tome.sourceCode}
                </span>
                {tome.pageCount && (
                  <span className="hidden sm:inline text-xs text-stone-500">
                    · {tome.pageCount} pages
                  </span>
                )}
              </div>
              <p className="text-[11px] text-stone-500 truncate hidden sm:block">
                {tome.subtitle}
              </p>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {parsed && (
              <>
                {/* Download PDF button */}
                <a
                  href={parsed.downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 sm:px-3 py-1.5 rounded-lg bg-white hover:bg-stone-100 border border-[#DDD5C7] text-stone-800 text-xs font-medium flex items-center gap-1.5 transition-colors shadow-2xs"
                  title="Download PDF directly to your device"
                >
                  <Download className="w-3.5 h-3.5 text-[#B85D36]" />
                  <span className="hidden md:inline">Download PDF</span>
                </a>

                {/* Open in Google Drive */}
                <a
                  href={parsed.viewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 sm:px-3 py-1.5 rounded-lg bg-white hover:bg-stone-100 border border-[#DDD5C7] text-stone-800 text-xs font-medium flex items-center gap-1.5 transition-colors shadow-2xs"
                  title="Open in new Google Drive tab"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-stone-500" />
                  <span className="hidden md:inline">Google Drive</span>
                </a>
              </>
            )}

            {/* Edit / Change URL */}
            <button
              onClick={() => setIsEditingUrl(!isEditingUrl)}
              className="p-1.5 rounded-lg bg-white hover:bg-stone-100 border border-[#DDD5C7] text-stone-700 text-xs font-medium transition-colors"
              title="Edit Google Drive link"
            >
              <LinkIcon className="w-4 h-4" />
            </button>

            {/* Toggle Fullscreen */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 rounded-lg bg-white hover:bg-stone-100 border border-[#DDD5C7] text-stone-700 transition-colors hidden sm:block"
              title={isFullscreen ? 'Exit Fullscreen (ESC)' : 'Fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-stone-200 hover:bg-stone-300 text-stone-700 transition-colors"
              title="Close reader"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Link configuration banner if editing or if link not set */}
        {isEditingUrl && (
          <div className="bg-[#FFFDF9] border-b border-[#E3DDD1] px-4 py-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 text-xs animate-in slide-in-from-top-2 duration-150">
            <span className="font-semibold text-stone-800 shrink-0 flex items-center gap-1.5">
              <LinkIcon className="w-3.5 h-3.5 text-[#B85D36]" />
              Google Drive Link:
            </span>
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder="Paste Google Drive file or folder share link (e.g. https://drive.google.com/file/d/...)"
              className="flex-1 px-3 py-1.5 rounded-lg border border-[#DDD5C7] focus:outline-none focus:ring-2 focus:ring-[#B85D36] text-xs font-mono bg-white"
            />
            <div className="flex items-center gap-2">
              <button
                onClick={handleSaveUrl}
                className="px-3 py-1.5 rounded-lg bg-[#B85D36] hover:bg-[#A34A25] text-white font-medium transition-colors flex items-center gap-1 shadow-2xs"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save Link</span>
              </button>
              {tome.driveUrl && (
                <button
                  onClick={() => setIsEditingUrl(false)}
                  className="px-2.5 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 bg-stone-100 relative overflow-hidden">
          {parsed ? (
            <iframe
              src={parsed.embedUrl}
              title={tome.title}
              className="w-full h-full border-none bg-white"
              allow="autoplay"
              allowFullScreen
            />
          ) : (
            <div className="h-full flex items-center justify-center p-6 text-center">
              <div className="max-w-md bg-white border border-[#DDD5C7] p-8 rounded-2xl shadow-sm space-y-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white mx-auto shadow-sm"
                  style={{ backgroundColor: tome.coverAccent || '#7A200D' }}
                >
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-serif font-bold text-base text-stone-900">
                    Connect Google Drive Link
                  </h4>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Paste the sharing link for <strong>{tome.title}</strong> (or your shared folder) to read it right inside the app or download it anytime.
                  </p>
                </div>

                <div className="space-y-2 pt-2">
                  <input
                    type="text"
                    value={inputUrl}
                    onChange={(e) => setInputUrl(e.target.value)}
                    placeholder="https://drive.google.com/file/d/..."
                    className="w-full px-3 py-2 rounded-lg border border-[#DDD5C7] focus:outline-none focus:ring-2 focus:ring-[#B85D36] text-xs font-mono bg-[#FAF8F5]"
                  />
                  <button
                    onClick={handleSaveUrl}
                    disabled={!inputUrl.trim()}
                    className="w-full py-2 rounded-lg bg-[#B85D36] hover:bg-[#A34A25] disabled:opacity-50 text-white font-medium text-xs transition-colors shadow-sm"
                  >
                    Save & Load Book
                  </button>
                </div>

                <div className="text-[11px] text-stone-400 border-t border-stone-200 pt-3 text-left space-y-1">
                  <span className="font-semibold text-stone-600 block">How to get the link:</span>
                  <ol className="list-decimal pl-4 space-y-0.5">
                    <li>In Google Drive, right-click the PDF or folder.</li>
                    <li>Click <strong>Share</strong> &rarr; ensure it is set to <em>"Anyone with the link can view"</em>.</li>
                    <li>Click <strong>Copy link</strong> and paste it here.</li>
                  </ol>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

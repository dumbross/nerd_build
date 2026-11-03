/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { INITIAL_LIBRARY_TOMES, LibraryTome } from '../data/libraryPdfs';

const TOMES_STORAGE_KEY = 'forge_grimoire_library_tomes_v1';
const FOLDER_STORAGE_KEY = 'forge_grimoire_library_master_folder_v1';

export function loadLibraryTomes(): LibraryTome[] {
  try {
    const raw = localStorage.getItem(TOMES_STORAGE_KEY);
    if (!raw) return INITIAL_LIBRARY_TOMES;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) return INITIAL_LIBRARY_TOMES;

    // Merge in any newly added default tomes if they don't exist yet in saved data
    const existingIds = new Set(parsed.map((t: any) => t.id));
    const merged = [...parsed];
    for (const initTome of INITIAL_LIBRARY_TOMES) {
      if (!existingIds.has(initTome.id)) {
        merged.push(initTome);
      }
    }
    return merged;
  } catch (e) {
    console.error('Failed to load library tomes from storage', e);
    return INITIAL_LIBRARY_TOMES;
  }
}

export function saveLibraryTomes(tomes: LibraryTome[]): void {
  try {
    localStorage.setItem(TOMES_STORAGE_KEY, JSON.stringify(tomes));
  } catch (e) {
    console.error('Failed to save library tomes', e);
  }
}

export function loadMasterDriveFolderUrl(): string {
  try {
    return localStorage.getItem(FOLDER_STORAGE_KEY) || '';
  } catch {
    return '';
  }
}

export function saveMasterDriveFolderUrl(url: string): void {
  try {
    localStorage.setItem(FOLDER_STORAGE_KEY, url.trim());
  } catch (e) {
    console.error('Failed to save master folder url', e);
  }
}

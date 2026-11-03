/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface GoogleDriveParsedInfo {
  id: string;
  isFolder: boolean;
  embedUrl: string;
  downloadUrl: string;
  viewUrl: string;
}

/**
 * Extracts the file or folder ID from various Google Drive URL formats.
 * Supports:
 * - https://drive.google.com/file/d/FILE_ID/view?usp=sharing
 * - https://drive.google.com/drive/folders/FOLDER_ID?usp=sharing
 * - https://drive.google.com/drive/u/0/folders/FOLDER_ID
 * - https://drive.google.com/open?id=FILE_ID
 * - https://drive.google.com/uc?id=FILE_ID
 * - Raw ID string
 */
export function parseGoogleDriveUrl(urlOrId: string): GoogleDriveParsedInfo | null {
  if (!urlOrId || typeof urlOrId !== 'string') return null;

  const trimmed = urlOrId.trim();

  // Check if it's a folder
  const folderMatch = trimmed.match(/\/folders\/([a-zA-Z0-9_-]+)/);
  if (folderMatch && folderMatch[1]) {
    const folderId = folderMatch[1];
    return {
      id: folderId,
      isFolder: true,
      embedUrl: `https://drive.google.com/embeddedfolderview?id=${folderId}#grid`,
      downloadUrl: `https://drive.google.com/drive/folders/${folderId}`,
      viewUrl: `https://drive.google.com/drive/folders/${folderId}`,
    };
  }

  // Check file/d/ format
  const fileMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileMatch && fileMatch[1]) {
    const fileId = fileMatch[1];
    return {
      id: fileId,
      isFolder: false,
      embedUrl: `https://drive.google.com/file/d/${fileId}/preview`,
      downloadUrl: `https://drive.google.com/uc?export=download&id=${fileId}`,
      viewUrl: `https://drive.google.com/file/d/${fileId}/view`,
    };
  }

  // Check ?id= or ?export=download&id= format
  const idQueryMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (idQueryMatch && idQueryMatch[1]) {
    const fileId = idQueryMatch[1];
    return {
      id: fileId,
      isFolder: false,
      embedUrl: `https://drive.google.com/file/d/${fileId}/preview`,
      downloadUrl: `https://drive.google.com/uc?export=download&id=${fileId}`,
      viewUrl: `https://drive.google.com/file/d/${fileId}/view`,
    };
  }

  // Check if string looks like a bare Google Drive ID (typically 28-44 chars alphanumeric)
  if (/^[a-zA-Z0-9_-]{20,}$/.test(trimmed)) {
    return {
      id: trimmed,
      isFolder: false,
      embedUrl: `https://drive.google.com/file/d/${trimmed}/preview`,
      downloadUrl: `https://drive.google.com/uc?export=download&id=${trimmed}`,
      viewUrl: `https://drive.google.com/file/d/${trimmed}/view`,
    };
  }

  return null;
}

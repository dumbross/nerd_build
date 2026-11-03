/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FiveToolsEntry } from '../types/fivetools';

/**
 * Strips 5e.tools tags (e.g. {@spell fireball|phb}, {@dice 1d6}, {@condition poisoned})
 * into clean readable plain text for displays and fillable PDF fields.
 * Safely accepts strings, objects, arrays, and primitives.
 */
export function clean5eToolsText(text: any): string {
  if (text === null || text === undefined) return '';

  // If passed an array of entries or strings
  if (Array.isArray(text)) {
    return text.map(clean5eToolsText).filter(Boolean).join('\n\n');
  }

  // If passed a 5eTools entry object (e.g. { type: 'entries', name: '...', entries: [...] })
  if (typeof text === 'object') {
    if (text.type === 'list' && Array.isArray(text.items)) {
      return text.items
        .map((item: any) => `• ${clean5eToolsText(item)}`)
        .filter(Boolean)
        .join('\n');
    }
    if (text.type === 'table') {
      const parts: string[] = [];
      if (text.caption) parts.push(`*Table: ${clean5eToolsText(text.caption)}*`);
      if (text.colLabels && Array.isArray(text.colLabels)) {
        parts.push(text.colLabels.map(clean5eToolsText).join(' | '));
      }
      if (text.rows && Array.isArray(text.rows)) {
        text.rows.forEach((row: any) => {
          if (Array.isArray(row)) {
            parts.push(row.map(clean5eToolsText).join(' | '));
          } else {
            parts.push(clean5eToolsText(row));
          }
        });
      }
      return parts.join('\n');
    }
    const parts: string[] = [];
    if (text.name) parts.push(`**${clean5eToolsText(text.name)}**`);
    if (text.entry) parts.push(clean5eToolsText(text.entry));
    if (text.entries) parts.push(clean5eToolsText(text.entries));
    if (text.text) parts.push(clean5eToolsText(text.text));
    if (text.items) parts.push(clean5eToolsText(text.items));
    if (parts.length > 0) {
      return parts.join(text.name && (text.entry || text.entries || text.text) ? ': ' : '\n');
    }
    return '';
  }

  let str = typeof text === 'string' ? text : String(text);

  // Iteratively strip / resolve 5eTools {@tag ...} tags
  // Run up to 3 passes to handle nested tags like {@b {@spell fireball}}
  for (let pass = 0; pass < 3; pass++) {
    if (!str.includes('{@')) break;
    str = str.replace(/\{@([a-zA-Z0-9_]+)\s+([^}]+)\}/g, (_match, tag, content) => {
      const parts = content.split('|');
      const primary = parts[0]?.trim() || '';
      const customDisplay = parts[2]?.trim();

      switch (tag.toLowerCase()) {
        case 'dice':
        case 'damage':
        case 'hit':
        case 'dc':
        case 'd20':
        case 'scaledice':
        case 'scaledamage':
        case 'recharge':
          return customDisplay || primary;
        case 'spell':
        case 'item':
        case 'creature':
        case 'condition':
        case 'disease':
        case 'status':
        case 'skill':
        case 'sense':
        case 'action':
        case 'hazard':
        case 'race':
        case 'class':
        case 'subclass':
        case 'background':
        case 'feat':
        case 'optfeature':
        case 'reward':
        case 'vehicle':
        case 'object':
        case 'boon':
        case 'cult':
        case 'deck':
        case 'trap':
          return customDisplay || primary;
        case 'b':
        case 'bold':
          return `**${primary}**`;
        case 'i':
        case 'italic':
          return `*${primary}*`;
        case 'note':
          return `[Note: ${primary}]`;
        case 'filter':
        case 'link':
          return parts[1] || primary;
        default:
          return customDisplay || primary;
      }
    });
  }

  return str.replace(/[ \t]+/g, ' ').trim();
}

/**
 * Cleans text specifically for fillable PDF fields, removing markdown asterisks too.
 */
export function cleanForPdf(text: any): string {
  return clean5eToolsText(text)
    .replace(/\*\*/g, '')
    .replace(/\*/g, '')
    .replace(/_/g, '')
    .trim();
}

/**
 * Parses recursively 5e.tools entry objects into an array of paragraphs or string list.
 */
export function render5eToolsEntries(entries?: FiveToolsEntry[] | any): string {
  if (!entries) return '';
  if (typeof entries === 'string') return clean5eToolsText(entries);
  if (!Array.isArray(entries)) {
    return clean5eToolsText(entries);
  }

  const output: string[] = [];

  for (const entry of entries) {
    if (typeof entry === 'string') {
      output.push(clean5eToolsText(entry));
    } else if (entry && typeof entry === 'object') {
      if (entry.type === 'list' && entry.items) {
        entry.items.forEach((item: any) => {
          if (typeof item === 'string') {
            output.push(`• ${clean5eToolsText(item)}`);
          } else if (item && typeof item === 'object') {
            const itemName = item.name ? `**${clean5eToolsText(item.name)}**: ` : '';
            const itemText = item.entries ? render5eToolsEntries(item.entries) : clean5eToolsText(item.entry || '');
            output.push(`• ${itemName}${itemText}`);
          }
        });
      } else if (entry.type === 'entries' || entry.type === 'section') {
        const title = entry.name ? `\n### ${clean5eToolsText(entry.name)}\n` : '';
        const body = entry.entries ? render5eToolsEntries(entry.entries) : '';
        output.push(`${title}${body}`.trim());
      } else if (entry.type === 'table') {
        if (entry.caption) output.push(`*Table: ${clean5eToolsText(entry.caption)}*`);
        if (entry.colLabels) output.push(entry.colLabels.map(clean5eToolsText).join(' | '));
        if (entry.rows && Array.isArray(entry.rows)) {
          entry.rows.forEach((row: any) => {
            if (Array.isArray(row)) {
              output.push(row.map(clean5eToolsText).join(' | '));
            } else {
              output.push(clean5eToolsText(row));
            }
          });
        }
      } else {
        const title = entry.name ? `**${clean5eToolsText(entry.name)}**: ` : '';
        const subContent = entry.entries ? render5eToolsEntries(entry.entries) : clean5eToolsText(entry.entry || '');
        output.push(`${title}${subContent}`.trim());
      }
    }
  }

  return output.filter(Boolean).join('\n\n');
}

/**
 * Converts 5e.tools spell school codes to full display name
 */
export function getSpellSchoolName(code: string): string {
  const map: Record<string, string> = {
    A: 'Abjuration',
    C: 'Conjuration',
    D: 'Divination',
    E: 'Enchantment',
    V: 'Evocation',
    I: 'Illusion',
    N: 'Necromancy',
    T: 'Transmutation',
    abjuration: 'Abjuration',
    conjuration: 'Conjuration',
    divination: 'Divination',
    enchantment: 'Enchantment',
    evocation: 'Evocation',
    illusion: 'Illusion',
    necromancy: 'Necromancy',
    transmutation: 'Transmutation',
  };
  return map[code] || code;
}

/**
 * Converts cp amount from 5e.tools to readable gp/sp/cp string
 */
export function format5eToolsValue(cp?: number): string {
  if (cp === undefined || cp === null) return '—';
  if (cp >= 100) {
    const gp = cp / 100;
    return `${gp} gp`;
  }
  if (cp >= 10) {
    const sp = cp / 10;
    return `${sp} sp`;
  }
  return `${cp} cp`;
}

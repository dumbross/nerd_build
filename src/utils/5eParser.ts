/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FiveToolsEntry } from '../types/fivetools';

/**
 * Strips 5e.tools tags (e.g. {@spell fireball|phb}, {@dice 1d6}, {@condition poisoned})
 * into clean readable plain text for displays and fillable PDF fields.
 */
export function clean5eToolsText(text: string): string {
  if (!text) return '';

  return text
    // Replace standard tags like {@spell fireball|phb|custom text} or {@dice 1d6+2}
    .replace(/\{@([a-zA-Z0-9_]+)\s+([^}]+)\}/g, (_match, tag, content) => {
      const parts = content.split('|');
      const primary = parts[0]?.trim() || '';
      const customDisplay = parts[2]?.trim();

      switch (tag.toLowerCase()) {
        case 'dice':
        case 'damage':
        case 'hit':
        case 'dc':
        case 'd20':
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
    })
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Cleans text specifically for fillable PDF fields, removing markdown asterisks too.
 */
export function cleanForPdf(text: string): string {
  return clean5eToolsText(text)
    .replace(/\*\*/g, '')
    .replace(/\*/g, '')
    .replace(/_/g, '')
    .trim();
}

/**
 * Parses recursively 5e.tools entry objects into an array of paragraphs or string list.
 */
export function render5eToolsEntries(entries?: FiveToolsEntry[]): string {
  if (!entries || !Array.isArray(entries)) return '';

  const output: string[] = [];

  for (const entry of entries) {
    if (typeof entry === 'string') {
      output.push(clean5eToolsText(entry));
    } else if (entry && typeof entry === 'object') {
      if (entry.type === 'list' && entry.items) {
        entry.items.forEach((item) => {
          if (typeof item === 'string') {
            output.push(`• ${clean5eToolsText(item)}`);
          } else if (item && typeof item === 'object') {
            const itemName = item.name ? `**${item.name}**: ` : '';
            const itemText = item.entries ? render5eToolsEntries(item.entries) : '';
            output.push(`• ${itemName}${itemText}`);
          }
        });
      } else if (entry.type === 'entries' || entry.type === 'section') {
        const title = entry.name ? `\n### ${entry.name}\n` : '';
        const body = entry.entries ? render5eToolsEntries(entry.entries) : '';
        output.push(`${title}${body}`.trim());
      } else if (entry.type === 'table') {
        if (entry.caption) output.push(`*Table: ${entry.caption}*`);
        if (entry.colLabels) output.push(entry.colLabels.join(' | '));
        if (entry.rows) {
          entry.rows.forEach((row) => {
            const rowText = row.map((cell) => (typeof cell === 'object' ? JSON.stringify(cell) : cell)).join(' | ');
            output.push(rowText);
          });
        }
      } else {
        const title = entry.name ? `**${entry.name}**: ` : '';
        const subContent = entry.entries ? render5eToolsEntries(entry.entries) : '';
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

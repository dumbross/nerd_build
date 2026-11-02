/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { toPng } from 'html-to-image';

export async function downloadStatBlockAsImage(
  element: HTMLElement,
  monsterName: string
): Promise<void> {
  try {
    const dataUrl = await toPng(element, {
      quality: 0.98,
      pixelRatio: 2, // Crisp 2x retina resolution
      backgroundColor: '#FDF1DC',
    });

    const safeName = monsterName
      .toLowerCase()
      .replace(/[^a-z0-9]/gi, '_')
      .replace(/_+/g, '_');

    const link = document.createElement('a');
    link.download = `${safeName}_stat_block.png`;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Failed to export stat block as image', error);
    throw error;
  }
}

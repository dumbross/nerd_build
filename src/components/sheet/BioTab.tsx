/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { User, ScrollText, Heart, Shield } from 'lucide-react';
import { Character } from '../../types/character';

interface BioTabProps {
  character: Character;
  onUpdateCharacter: (char: Character) => void;
}

export const BioTab: React.FC<BioTabProps> = ({
  character,
  onUpdateCharacter,
}) => {
  const update = (patch: Partial<Character>) => {
    onUpdateCharacter({
      ...character,
      ...patch,
      updatedAt: new Date().toISOString(),
    });
  };

  return (
    <div className="space-y-6">
      {/* Personality & Ideals Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-[#E5DFD5] space-y-2 shadow-sm">
          <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 block flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-[#B85D36]" />
            <span>Personality Traits</span>
          </label>
          <textarea
            value={character.personalityTraits}
            onChange={(e) => update({ personalityTraits: e.target.value })}
            placeholder="Mannerisms, speech habits, recurring quirks..."
            className="w-full h-24 p-3 bg-[#FAF8F5] border border-[#E5DFD5] rounded-xl text-xs text-stone-900 focus:outline-none focus:border-stone-400 resize-none leading-relaxed"
          />
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#E5DFD5] space-y-2 shadow-sm">
          <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 block flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-stone-600" />
            <span>Ideals</span>
          </label>
          <textarea
            value={character.ideals}
            onChange={(e) => update({ ideals: e.target.value })}
            placeholder="Beliefs, ethical code, moral philosophy..."
            className="w-full h-24 p-3 bg-[#FAF8F5] border border-[#E5DFD5] rounded-xl text-xs text-stone-900 focus:outline-none focus:border-stone-400 resize-none leading-relaxed"
          />
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#E5DFD5] space-y-2 shadow-sm">
          <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 block flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-[#2E4A3E]" />
            <span>Bonds</span>
          </label>
          <textarea
            value={character.bonds}
            onChange={(e) => update({ bonds: e.target.value })}
            placeholder="People, home village, treasured oath..."
            className="w-full h-24 p-3 bg-[#FAF8F5] border border-[#E5DFD5] rounded-xl text-xs text-stone-900 focus:outline-none focus:border-stone-400 resize-none leading-relaxed"
          />
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#E5DFD5] space-y-2 shadow-sm">
          <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 block flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-stone-600" />
            <span>Flaws & Vices</span>
          </label>
          <textarea
            value={character.flaws}
            onChange={(e) => update({ flaws: e.target.value })}
            placeholder="Weaknesses, temptations, emotional blindspots..."
            className="w-full h-24 p-3 bg-[#FAF8F5] border border-[#E5DFD5] rounded-xl text-xs text-stone-900 focus:outline-none focus:border-stone-400 resize-none leading-relaxed"
          />
        </div>
      </div>

      {/* Backstory & Chronicle */}
      <div className="p-5 rounded-2xl bg-white border border-[#E5DFD5] space-y-2 shadow-sm">
        <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 block flex items-center gap-1.5">
          <ScrollText className="w-3.5 h-3.5 text-[#B85D36]" />
          <span>Character Backstory & Origin</span>
        </label>
        <textarea
          value={character.backstory}
          onChange={(e) => update({ backstory: e.target.value })}
          placeholder="How did your adventurer begin their journey? Key past events, mentors, and turning points..."
          className="w-full h-36 p-3 bg-[#FAF8F5] border border-[#E5DFD5] rounded-xl text-xs text-stone-900 focus:outline-none focus:border-stone-400 resize-none leading-relaxed"
        />
      </div>

      {/* Appearance & Notes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-[#E5DFD5] space-y-2 shadow-sm">
          <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 block">
            Physical Description & Appearance
          </label>
          <textarea
            value={character.appearance}
            onChange={(e) => update({ appearance: e.target.value })}
            placeholder="Height, build, scars, distinctive garments, facial features..."
            className="w-full h-28 p-3 bg-[#FAF8F5] border border-[#E5DFD5] rounded-xl text-xs text-stone-900 focus:outline-none focus:border-stone-400 resize-none leading-relaxed"
          />
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#E5DFD5] space-y-2 shadow-sm">
          <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 block">
            Allies, Organizations & Notes
          </label>
          <textarea
            value={character.alliesAndOrgs}
            onChange={(e) => update({ alliesAndOrgs: e.target.value })}
            placeholder="Factions, guild affiliations, active bounties, campaign notes..."
            className="w-full h-28 p-3 bg-[#FAF8F5] border border-[#E5DFD5] rounded-xl text-xs text-stone-900 focus:outline-none focus:border-stone-400 resize-none leading-relaxed"
          />
        </div>
      </div>
    </div>
  );
};

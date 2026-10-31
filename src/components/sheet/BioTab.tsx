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
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-amber-300 block flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-amber-400" />
            <span>Personality Traits</span>
          </label>
          <textarea
            value={character.personalityTraits}
            onChange={(e) => update({ personalityTraits: e.target.value })}
            placeholder="Mannerisms, speech habits, recurring quirks..."
            className="w-full h-24 p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-amber-500/60 resize-none leading-relaxed"
          />
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-amber-300 block flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-amber-400" />
            <span>Ideals</span>
          </label>
          <textarea
            value={character.ideals}
            onChange={(e) => update({ ideals: e.target.value })}
            placeholder="Beliefs, ethical code, moral philosophy..."
            className="w-full h-24 p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-amber-500/60 resize-none leading-relaxed"
          />
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-amber-300 block flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-amber-400" />
            <span>Bonds</span>
          </label>
          <textarea
            value={character.bonds}
            onChange={(e) => update({ bonds: e.target.value })}
            placeholder="People, home village, treasured oath..."
            className="w-full h-24 p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-amber-500/60 resize-none leading-relaxed"
          />
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-amber-300 block flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-amber-400" />
            <span>Flaws & Vices</span>
          </label>
          <textarea
            value={character.flaws}
            onChange={(e) => update({ flaws: e.target.value })}
            placeholder="Weaknesses, temptations, emotional blindspots..."
            className="w-full h-24 p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-amber-500/60 resize-none leading-relaxed"
          />
        </div>
      </div>

      {/* Backstory & Chronicle */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-amber-300 block flex items-center gap-1.5">
          <ScrollText className="w-3.5 h-3.5 text-amber-400" />
          <span>Character Backstory & Origin</span>
        </label>
        <textarea
          value={character.backstory}
          onChange={(e) => update({ backstory: e.target.value })}
          placeholder="How did your adventurer begin their journey? Key past events, mentors, and turning points..."
          className="w-full h-40 p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-amber-500/60 resize-none leading-relaxed"
        />
      </div>

      {/* Appearance & Notes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-amber-300 block">
            Physical Description & Appearance
          </label>
          <textarea
            value={character.appearance}
            onChange={(e) => update({ appearance: e.target.value })}
            placeholder="Height, build, scars, tattoos, distinctive garments, facial features..."
            className="w-full h-28 p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-amber-500/60 resize-none leading-relaxed"
          />
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-amber-300 block">
            Allies, Organizations & Quest Notes
          </label>
          <textarea
            value={character.alliesAndOrgs}
            onChange={(e) => update({ alliesAndOrgs: e.target.value })}
            placeholder="Factions, guild affiliations, active bounties, campaign quest notes..."
            className="w-full h-28 p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-amber-500/60 resize-none leading-relaxed"
          />
        </div>
      </div>
    </div>
  );
};

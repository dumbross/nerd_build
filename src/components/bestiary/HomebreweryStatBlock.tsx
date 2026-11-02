/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState } from 'react';
import { Monster, MonsterAction } from '../../types/monster';
import { formatModifier } from '../../utils/monsterStorage';
import { downloadStatBlockAsImage } from '../../utils/statBlockExport';
import { Dices, Copy, Check, Sparkles, Download, Image as ImageIcon } from 'lucide-react';

interface HomebreweryStatBlockProps {
  monster: Monster;
  onQuickRoll?: (sides: number, count?: number, modifier?: number, label?: string) => void;
}

export const HomebreweryStatBlock: React.FC<HomebreweryStatBlockProps> = ({
  monster,
  onQuickRoll,
}) => {
  const [copiedMd, setCopiedMd] = useState(false);
  const [isExportingImage, setIsExportingImage] = useState(false);
  const statBlockRef = useRef<HTMLDivElement>(null);

  const handleDownloadImage = async () => {
    if (!statBlockRef.current) return;
    try {
      setIsExportingImage(true);
      await downloadStatBlockAsImage(statBlockRef.current, monster.name);
    } catch (err) {
      console.error('Failed to export stat block image', err);
    } finally {
      setIsExportingImage(false);
    }
  };

  // Parse dice string like "2d6+5" or "1d10"
  const parseDiceFormula = (diceStr?: string, defaultBonus: number = 0) => {
    if (!diceStr) return { count: 1, sides: 6, bonus: defaultBonus };
    const match = diceStr.match(/(\d+)?d(\d+)([+-]\d+)?/i);
    if (!match) return { count: 1, sides: 6, bonus: defaultBonus };
    const count = match[1] ? parseInt(match[1], 10) : 1;
    const sides = parseInt(match[2], 10);
    const bonus = match[3] ? parseInt(match[3], 10) : defaultBonus;
    return { count, sides, bonus };
  };

  const handleRollActionAttack = (action: MonsterAction) => {
    if (!onQuickRoll) return;
    const bonus = action.attackBonus ?? 0;
    onQuickRoll(20, 1, bonus, `${monster.name}: ${action.name} Attack`);
  };

  const handleRollActionDamage = (action: MonsterAction) => {
    if (!onQuickRoll) return;
    const { count, sides, bonus } = parseDiceFormula(action.damageDice, action.damageBonus ?? 0);
    onQuickRoll(sides, count, bonus, `${monster.name}: ${action.name} Damage`);
  };

  const handleRollAbilityCheck = (statName: string, statScore: number) => {
    if (!onQuickRoll) return;
    const mod = Math.floor((statScore - 10) / 2);
    onQuickRoll(20, 1, mod, `${monster.name}: ${statName.toUpperCase()} Check`);
  };

  const copyAsHomebreweryMarkdown = () => {
    const md = `___
> ## ${monster.name}
>*${monster.size} ${monster.type}${monster.subtype ? ` (${monster.subtype})` : ''}, ${monster.alignment}*
> ___
> - **Armor Class** ${monster.ac} ${monster.acType ? `(${monster.acType})` : ''}
> - **Hit Points** ${monster.hp} (${monster.hpFormula})
> - **Speed** ${monster.speed}
>___
>|STR|DEX|CON|INT|WIS|CHA|
>|:---:|:---:|:---:|:---:|:---:|:---:|
>|${monster.abilities.str} (${formatModifier(monster.abilities.str)})|${monster.abilities.dex} (${formatModifier(monster.abilities.dex)})|${monster.abilities.con} (${formatModifier(monster.abilities.con)})|${monster.abilities.int} (${formatModifier(monster.abilities.int)})|${monster.abilities.wis} (${formatModifier(monster.abilities.wis)})|${monster.abilities.cha} (${formatModifier(monster.abilities.cha)})|
>___
>${monster.savingThrows ? `> - **Saving Throws** ${monster.savingThrows}\n` : ''}${monster.skills ? `> - **Skills** ${monster.skills}\n` : ''}${monster.damageResistances ? `> - **Damage Resistances** ${monster.damageResistances}\n` : ''}${monster.damageImmunities ? `> - **Damage Immunities** ${monster.damageImmunities}\n` : ''}${monster.conditionImmunities ? `> - **Condition Immunities** ${monster.conditionImmunities}\n` : ''}> - **Senses** ${monster.senses}
> - **Languages** ${monster.languages}
> - **Challenge** ${monster.cr} (${monster.xp.toLocaleString()} XP) **Proficiency Bonus** +${monster.proficiencyBonus}
>___
${(monster.traits || []).map((t) => `> ***${t.name}.*** ${t.desc}`).join('\n>\n')}
>
> ### Actions
${(monster.actions || []).map((a) => `> ***${a.name}.*** ${a.desc}`).join('\n>\n')}
${
  monster.reactions && monster.reactions.length > 0
    ? `>
> ### Reactions
${monster.reactions.map((r) => `> ***${r.name}.*** ${r.desc}`).join('\n>\n')}`
    : ''
}
${
  monster.legendaryActions && monster.legendaryActions.length > 0
    ? `>
> ### Legendary Actions
> ${monster.legendaryHeader || 'The creature can take 3 legendary actions.'}
>
${monster.legendaryActions.map((la) => `> ***${la.name}.*** ${la.desc}`).join('\n>\n')}`
    : ''
}
`;
    navigator.clipboard.writeText(md);
    setCopiedMd(true);
    setTimeout(() => setCopiedMd(false), 2500);
  };

  // Tapered rule matching Homebrewery SVG banner
  const TaperedDivider = () => (
    <svg className="w-full h-1.5 my-2 text-[#7A200D] opacity-90" viewBox="0 0 400 4" preserveAspectRatio="none">
      <polygon points="0,2 200,4 400,2 200,0" fill="currentColor" />
    </svg>
  );

  return (
    <div className="space-y-6">
      {/* Quick Toolbar */}
      <div className="flex items-center justify-between gap-3 px-1">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono uppercase tracking-wider text-stone-600 bg-[#EFEAE2] px-2 py-0.5 rounded border border-[#E3DDD1]">
            CR {monster.cr} ({monster.xp.toLocaleString()} XP)
          </span>
          <span className="text-[11px] font-mono uppercase tracking-wider text-stone-600 bg-[#EFEAE2] px-2 py-0.5 rounded border border-[#E3DDD1]">
            {monster.size} {monster.type}
          </span>
          {monster.isCustom && (
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#B85D36] bg-[#FAF4ED] px-2 py-0.5 rounded border border-[#ECD9CE]">
              Homebrew
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Download as Image Button */}
          <button
            onClick={handleDownloadImage}
            disabled={isExportingImage}
            className="px-2.5 py-1 text-xs font-medium text-stone-700 hover:text-stone-900 bg-white hover:bg-stone-50 border border-[#E5DFD5] rounded-lg shadow-sm flex items-center gap-1.5 transition-all disabled:opacity-50"
            title="Download stat block as a high-resolution PNG image"
          >
            <Download className="w-3.5 h-3.5 text-stone-500" />
            <span>{isExportingImage ? 'Exporting Image...' : 'Download Image'}</span>
          </button>

          {/* Copy Markdown Button */}
          <button
            onClick={copyAsHomebreweryMarkdown}
            className="px-2.5 py-1 text-xs font-medium text-stone-700 hover:text-stone-900 bg-white hover:bg-stone-50 border border-[#E5DFD5] rounded-lg shadow-sm flex items-center gap-1.5 transition-all"
            title="Copy Homebrewery markdown to clipboard"
          >
            {copiedMd ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Copied MD</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-stone-500" />
                <span>Copy MD</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* The Authentic Homebrewery Parchment Stat Block Container */}
      <div
        ref={statBlockRef}
        className="relative bg-[#FDF1DC] border-2 border-[#E69A28] rounded-sm p-6 sm:p-7 shadow-lg shadow-stone-900/10 text-[#291814] font-sans text-xs leading-relaxed"
        style={{
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08), inset 0 0 40px rgba(220, 185, 130, 0.25)',
        }}
      >
        {/* Top Decorative Border Banner */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#C5311B] via-[#E69A28] to-[#C5311B]" />

        {/* 2-Column Responsive Layout matching Homebrewery wide stat blocks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-4">
          {/* Left Column: Identity, Vitals, Abilities, Saves/Skills, and initial traits */}
          <div className="space-y-2.5">
            {/* Header: Name and Subtitle */}
            <div>
              <h2 className="font-serif text-3xl font-bold tracking-tight text-[#7A200D] uppercase font-['Cinzel',serif] leading-none">
                {monster.name}
              </h2>
              <p className="font-serif italic text-xs text-stone-700 mt-1">
                {monster.size} {monster.type}
                {monster.subtype ? ` (${monster.subtype})` : ''}, {monster.alignment}
              </p>
            </div>

            <TaperedDivider />

            {/* Basic Vitals */}
            <div className="space-y-0.5 text-xs text-[#291814]">
              <div>
                <span className="font-bold text-[#7A200D]">Armor Class </span>
                <span>
                  {monster.ac} {monster.acType ? `(${monster.acType})` : ''}
                </span>
              </div>
              <div>
                <span className="font-bold text-[#7A200D]">Hit Points </span>
                <span>
                  {monster.hp} ({monster.hpFormula})
                </span>
              </div>
              <div>
                <span className="font-bold text-[#7A200D]">Speed </span>
                <span>{monster.speed}</span>
              </div>
            </div>

            <TaperedDivider />

            {/* Ability Scores Grid */}
            <div className="grid grid-cols-6 gap-1 py-1 text-center border-y border-[#7A200D]/20 my-1">
              {[
                { name: 'STR', val: monster.abilities.str },
                { name: 'DEX', val: monster.abilities.dex },
                { name: 'CON', val: monster.abilities.con },
                { name: 'INT', val: monster.abilities.int },
                { name: 'WIS', val: monster.abilities.wis },
                { name: 'CHA', val: monster.abilities.cha },
              ].map((stat) => (
                <button
                  key={stat.name}
                  onClick={() => handleRollAbilityCheck(stat.name, stat.val)}
                  title={`Click to roll ${stat.name} check`}
                  className="group hover:bg-[#F4E5CE] p-1 rounded transition-colors"
                >
                  <span className="block font-serif font-bold text-[11px] text-[#7A200D]">
                    {stat.name}
                  </span>
                  <span className="block text-xs font-semibold text-stone-900 group-hover:text-[#B85D36]">
                    {stat.val} ({formatModifier(stat.val)})
                  </span>
                </button>
              ))}
            </div>

            <TaperedDivider />

            {/* Secondary Attributes */}
            <div className="space-y-1 text-xs">
              {monster.savingThrows && (
                <div>
                  <span className="font-bold text-[#7A200D]">Saving Throws </span>
                  <span>{monster.savingThrows}</span>
                </div>
              )}
              {monster.skills && (
                <div>
                  <span className="font-bold text-[#7A200D]">Skills </span>
                  <span>{monster.skills}</span>
                </div>
              )}
              {monster.damageVulnerabilities && (
                <div>
                  <span className="font-bold text-[#7A200D]">Damage Vulnerabilities </span>
                  <span>{monster.damageVulnerabilities}</span>
                </div>
              )}
              {monster.damageResistances && (
                <div>
                  <span className="font-bold text-[#7A200D]">Damage Resistances </span>
                  <span>{monster.damageResistances}</span>
                </div>
              )}
              {monster.damageImmunities && (
                <div>
                  <span className="font-bold text-[#7A200D]">Damage Immunities </span>
                  <span>{monster.damageImmunities}</span>
                </div>
              )}
              {monster.conditionImmunities && (
                <div>
                  <span className="font-bold text-[#7A200D]">Condition Immunities </span>
                  <span>{monster.conditionImmunities}</span>
                </div>
              )}
              <div>
                <span className="font-bold text-[#7A200D]">Senses </span>
                <span>{monster.senses}</span>
              </div>
              <div>
                <span className="font-bold text-[#7A200D]">Languages </span>
                <span>{monster.languages}</span>
              </div>
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <span className="font-bold text-[#7A200D]">Challenge </span>
                  <span>
                    {monster.cr} ({monster.xp.toLocaleString()} XP)
                  </span>
                </div>
                <div>
                  <span className="font-bold text-[#7A200D]">Proficiency Bonus </span>
                  <span>+{monster.proficiencyBonus}</span>
                </div>
              </div>
            </div>

            <TaperedDivider />

            {/* Special Traits (Left Column) */}
            {monster.traits && monster.traits.length > 0 && (
              <div className="space-y-2 pt-1">
                {monster.traits.map((trait) => (
                  <p key={trait.name} className="text-xs leading-relaxed text-[#291814]">
                    <strong className="font-serif italic font-bold text-[#7A200D] mr-1">
                      {trait.name}.
                    </strong>
                    <span>{trait.desc}</span>
                  </p>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Actions, Reactions, Legendary Actions */}
          <div className="space-y-3">
            {/* Actions Section Header */}
            {monster.actions && monster.actions.length > 0 && (
              <div>
                <h3 className="font-serif text-lg font-bold text-[#7A200D] border-b border-[#7A200D]/30 pb-0.5 tracking-wide">
                  Actions
                </h3>
                <div className="space-y-2.5 mt-2">
                  {monster.actions.map((action) => (
                    <div key={action.name} className="group text-xs leading-relaxed">
                      <p>
                        <strong className="font-serif italic font-bold text-[#7A200D] mr-1">
                          {action.name}.
                        </strong>
                        <span>{action.desc}</span>
                      </p>

                      {/* Interactive Dice Roll Triggers for Attack and Damage */}
                      {(action.attackBonus !== undefined || action.damageDice) && onQuickRoll && (
                        <div className="flex items-center gap-2 mt-1 opacity-80 group-hover:opacity-100 transition-opacity">
                          {action.attackBonus !== undefined && (
                            <button
                              onClick={() => handleRollActionAttack(action)}
                              className="px-2 py-0.5 rounded bg-[#FAF2E1] hover:bg-[#F3E3CA] text-[#7A200D] text-[11px] font-semibold border border-[#E69A28]/60 flex items-center gap-1 shadow-xs transition-colors"
                              title={`Roll attack for ${action.name}`}
                            >
                              <Dices className="w-3 h-3" />
                              <span>Roll Attack (+{action.attackBonus})</span>
                            </button>
                          )}
                          {action.damageDice && (
                            <button
                              onClick={() => handleRollActionDamage(action)}
                              className="px-2 py-0.5 rounded bg-[#FAF2E1] hover:bg-[#F3E3CA] text-[#7A200D] text-[11px] font-semibold border border-[#E69A28]/60 flex items-center gap-1 shadow-xs transition-colors"
                              title={`Roll damage for ${action.name}`}
                            >
                              <Sparkles className="w-3 h-3" />
                              <span>
                                Roll Damage ({action.damageDice}
                                {action.damageBonus ? `+${action.damageBonus}` : ''})
                              </span>
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reactions Section */}
            {monster.reactions && monster.reactions.length > 0 && (
              <div className="pt-2">
                <h3 className="font-serif text-lg font-bold text-[#7A200D] border-b border-[#7A200D]/30 pb-0.5 tracking-wide">
                  Reactions
                </h3>
                <div className="space-y-2 mt-2">
                  {monster.reactions.map((reaction) => (
                    <p key={reaction.name} className="text-xs leading-relaxed">
                      <strong className="font-serif italic font-bold text-[#7A200D] mr-1">
                        {reaction.name}.
                      </strong>
                      <span>{reaction.desc}</span>
                    </p>
                  ))}
                </div>
              </div>
            )}

            {/* Legendary Actions Section */}
            {monster.legendaryActions && monster.legendaryActions.length > 0 && (
              <div className="pt-2">
                <h3 className="font-serif text-lg font-bold text-[#7A200D] border-b border-[#7A200D]/30 pb-0.5 tracking-wide">
                  Legendary Actions
                </h3>
                <p className="text-[11px] italic text-stone-700 mt-1 leading-normal">
                  {monster.legendaryHeader ||
                    'The creature can take 3 legendary actions, choosing from the options below. Only one legendary action can be used at a time and only at the end of another creature\'s turn.'}
                </p>
                <div className="space-y-2 mt-2">
                  {monster.legendaryActions.map((la) => (
                    <p key={la.name} className="text-xs leading-relaxed">
                      <strong className="font-serif italic font-bold text-[#7A200D] mr-1">
                        {la.name}.
                      </strong>
                      <span>{la.desc}</span>
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Decorative Border Banner */}
        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#C5311B] via-[#E69A28] to-[#C5311B]" />
      </div>

      {/* Description Section (as shown directly beneath the stat block in the user's reference image) */}
      {monster.description && (
        <div className="bg-white border border-[#E5DFD5] rounded-xl p-6 shadow-sm">
          <h3 className="font-serif text-xl font-bold text-stone-900 mb-2">
            Description
          </h3>
          <p className="text-xs sm:text-sm leading-relaxed text-stone-700 whitespace-pre-line font-serif">
            {monster.description}
          </p>
        </div>
      )}
    </div>
  );
};

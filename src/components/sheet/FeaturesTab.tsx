/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Award, Plus, Trash2 } from 'lucide-react';
import { Character, FeatureTrait } from '../../types/character';
import { clean5eToolsText } from '../../utils/5eParser';

interface FeaturesTabProps {
  character: Character;
  onUpdateCharacter: (char: Character) => void;
}

export const FeaturesTab: React.FC<FeaturesTabProps> = ({
  character,
  onUpdateCharacter,
}) => {
  const [filterSource, setFilterSource] = useState<string>('all');
  const [newFeatureName, setNewFeatureName] = useState('');
  const [newFeatureDesc, setNewFeatureDesc] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const features = character.features || [];

  const handleAddFeature = () => {
    if (!newFeatureName.trim()) return;
    const newFeat: FeatureTrait = {
      id: `f_custom_${Date.now()}`,
      name: newFeatureName.trim(),
      source: 'Custom',
      description: newFeatureDesc.trim(),
    };

    onUpdateCharacter({
      ...character,
      features: [...features, newFeat],
      updatedAt: new Date().toISOString(),
    });

    setNewFeatureName('');
    setNewFeatureDesc('');
    setIsAdding(false);
  };

  const handleDeleteFeature = (id: string) => {
    onUpdateCharacter({
      ...character,
      features: features.filter((f) => f.id !== id),
      updatedAt: new Date().toISOString(),
    });
  };

  const filteredFeatures = features.filter((f) => {
    if (filterSource === 'all') return true;
    return f.source.toLowerCase() === filterSource.toLowerCase();
  });

  return (
    <div className="space-y-6">
      {/* Header & Source Filter */}
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-1 overflow-x-auto text-xs">
          {['all', 'Class', 'Subclass', 'Race', 'Background', 'Feat', 'Custom'].map((src) => (
            <button
              key={src}
              onClick={() => setFilterSource(src)}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                filterSource === src
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {src === 'all' ? 'All Features' : src}
            </button>
          ))}
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700/60"
        >
          <Plus className="w-3.5 h-3.5 text-amber-400" />
          <span>Add Custom Feature</span>
        </button>
      </div>

      {/* Add Custom Feature Form */}
      {isAdding && (
        <div className="p-4 rounded-xl bg-slate-900 border border-amber-500/30 space-y-3 animate-in fade-in">
          <div className="text-xs font-bold text-amber-300 uppercase tracking-wider">
            Create Custom Trait / Feat
          </div>
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Feature Name (e.g. Fey Touched, Darkvision)"
              value={newFeatureName}
              onChange={(e) => setNewFeatureName(e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-amber-500/60"
            />
            <textarea
              placeholder="Full rules description, mechanics, uses..."
              value={newFeatureDesc}
              onChange={(e) => setNewFeatureDesc(e.target.value)}
              className="w-full h-20 p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-amber-500/60 resize-none"
            />
          </div>
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={() => setIsAdding(false)}
              className="px-3 py-1 text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleAddFeature}
              className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-450 text-slate-950 font-bold text-xs"
            >
              Save Feature
            </button>
          </div>
        </div>
      )}

      {/* Features List */}
      <div className="space-y-3">
        {filteredFeatures.length === 0 ? (
          <div className="p-8 rounded-xl bg-slate-900/60 border border-slate-800 text-center text-xs text-slate-400">
            No features found for "{filterSource}".
          </div>
        ) : (
          filteredFeatures.map((feat) => (
            <div
              key={feat.id}
              className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-serif font-bold text-sm text-slate-100">
                    {feat.name}
                  </span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-amber-300 border border-slate-700">
                    {feat.source}
                    {feat.level ? ` Lvl ${feat.level}` : ''}
                  </span>
                </div>

                {feat.source === 'Custom' && (
                  <button
                    onClick={() => handleDeleteFeature(feat.id)}
                    className="p-1 rounded text-slate-500 hover:text-rose-400 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                {clean5eToolsText(feat.description)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

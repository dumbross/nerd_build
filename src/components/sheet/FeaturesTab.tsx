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
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-[#E8E3DA] pb-3">
        <div className="flex items-center gap-1 overflow-x-auto text-xs bg-white p-1 rounded-xl border border-[#E5DFD5] shadow-sm">
          {['all', 'Class', 'Subclass', 'Race', 'Background', 'Feat', 'Custom'].map((src) => (
            <button
              key={src}
              onClick={() => setFilterSource(src)}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                filterSource === src
                  ? 'bg-stone-900 text-white font-semibold shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {src === 'all' ? 'All Features' : src}
            </button>
          ))}
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-stone-50 text-stone-800 text-xs font-medium flex items-center gap-1.5 transition-all border border-[#DDD5C7] shadow-sm"
        >
          <Plus className="w-3.5 h-3.5 text-[#B85D36]" />
          <span>Add Custom Feature</span>
        </button>
      </div>

      {/* Add Custom Feature Form */}
      {isAdding && (
        <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#E5DFD5] space-y-3 animate-in fade-in shadow-sm">
          <div className="text-xs font-semibold text-stone-900 uppercase tracking-wider">
            Create Custom Trait / Feat
          </div>
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Feature Name (e.g. Fey Touched, Darkvision)"
              value={newFeatureName}
              onChange={(e) => setNewFeatureName(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-[#E5DFD5] rounded-xl text-xs text-stone-900 focus:outline-none focus:border-stone-400"
            />
            <textarea
              placeholder="Full rules description, mechanics, uses..."
              value={newFeatureDesc}
              onChange={(e) => setNewFeatureDesc(e.target.value)}
              className="w-full h-20 p-3 bg-white border border-[#E5DFD5] rounded-xl text-xs text-stone-900 focus:outline-none focus:border-stone-400 resize-none leading-relaxed"
            />
          </div>
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={() => setIsAdding(false)}
              className="px-3 py-1 text-xs text-stone-600 hover:text-stone-900 font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleAddFeature}
              className="px-4 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs shadow-sm transition-all"
            >
              Save Feature
            </button>
          </div>
        </div>
      )}

      {/* Features List */}
      <div className="space-y-3">
        {filteredFeatures.length === 0 ? (
          <div className="p-8 rounded-2xl bg-white border border-[#E5DFD5] text-center text-xs text-stone-600 shadow-sm">
            No features found for "{filterSource}".
          </div>
        ) : (
          filteredFeatures.map((feat) => (
            <div
              key={feat.id}
              className="p-5 rounded-2xl bg-white border border-[#E5DFD5] hover:border-stone-400 transition-all space-y-1.5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-serif font-semibold text-base text-stone-900">
                    {feat.name}
                  </span>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-[#FAF8F5] text-stone-700 border border-[#E0D9CE]">
                    {feat.source}
                    {feat.level ? ` Lvl ${feat.level}` : ''}
                  </span>
                </div>

                {feat.source === 'Custom' && (
                  <button
                    onClick={() => handleDeleteFeature(feat.id)}
                    className="p-1 rounded text-stone-600 hover:text-stone-900 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="text-xs text-stone-700 leading-relaxed whitespace-pre-line">
                {clean5eToolsText(feat.description)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

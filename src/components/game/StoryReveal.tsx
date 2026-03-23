import React from 'react';
import { IStory } from '../../types/models';

interface StoryRevealProps {
  story: IStory;
  isRevealed?: boolean;
}

const StoryReveal: React.FC<StoryRevealProps> = ({ 
  story,
  isRevealed = false 
}) => {
  const getDifficultyText = (difficulty: string) => {
    switch(difficulty) {
      case 'easy': return '入门';
      case 'medium': return '中等';
      case 'hard': return '困难';
      case 'expert': return '专家';
      default: return '未知';
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-base font-semibold text-white">{story.title}</h3>
          <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-1 rounded-full">
            {getDifficultyText(story.difficulty)} | {story.estimatedTime}分钟
          </span>
        </div>
        <div className="mt-2">
          <h4 className="text-xs font-medium text-amber-400 mb-1">汤面（已知信息）</h4>
          <p className="text-white text-sm leading-relaxed">{story.surface}</p>
        </div>
      </div>
      
      {isRevealed && story.bottom && (
        <div className="pt-4 border-t border-white/10">
          <h4 className="text-xs font-medium text-amber-400 mb-1">汤底（真相）</h4>
          <p className="text-white text-sm leading-relaxed">{story.bottom}</p>
        </div>
      )}
      
      {!isRevealed && (
        <div className="pt-4 border-t border-white/10">
          <button className="text-sm text-slate-400 hover:text-amber-400 transition-colors">
            点击揭晓真相（需全员投票同意）
          </button>
        </div>
      )}
    </div>
  );
};

export default StoryReveal;
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

  const getDifficultyColor = (difficulty: string) => {
    switch(difficulty) {
      case 'easy': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'medium': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'hard': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'expert': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-base font-semibold text-white line-clamp-2">{story.title}</h3>
          <span className={`text-xs px-2 py-1 rounded-full border ${getDifficultyColor(story.difficulty)}`}>
            {getDifficultyText(story.difficulty)}
          </span>
        </div>
        <div className="mt-3">
          <h4 className="text-xs font-medium text-amber-400 mb-2 flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            汤面（已知信息）
          </h4>
          <p className="text-white text-sm leading-relaxed bg-slate-800/30 p-3 rounded-lg border border-white/10">
            {story.surface}
          </p>
        </div>
        <div className="mt-2 text-xs text-slate-400 flex items-center justify-between">
          <span>预估时长: {story.estimatedTime}分钟</span>
          <span>{story.tags?.slice(0, 2).map(tag => `#${tag}`).join(' ') || ''}</span>
        </div>
      </div>
      
      {isRevealed && story.bottom && (
        <div className="pt-4 border-t border-white/10">
          <h4 className="text-xs font-medium text-amber-400 mb-2 flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            汤底（真相）
          </h4>
          <p className="text-white text-sm leading-relaxed bg-amber-900/20 p-3 rounded-lg border border-amber-500/30">
            {story.bottom}
          </p>
        </div>
      )}
      
      {!isRevealed && (
        <div className="pt-4 border-t border-white/10">
          <button className="text-sm text-slate-400 hover:text-amber-400 transition-colors flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            点击揭晓真相（需全员投票同意）
          </button>
        </div>
      )}
    </div>
  );
};

export default StoryReveal;
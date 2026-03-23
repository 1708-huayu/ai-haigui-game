import React from 'react';
import { Link } from 'react-router-dom';
import { IStory } from '../../types/models';
import FrostedCard from '../common/FrostedCard';
import GlassButton from '../common/GlassButton';

interface GameCardProps {
  story: IStory;
}

const GameCard: React.FC<GameCardProps> = ({ story }) => {
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
      case 'easy': return 'bg-emerald-500/20 text-emerald-400';
      case 'medium': return 'bg-amber-500/20 text-amber-400';
      case 'hard': return 'bg-orange-500/20 text-orange-400';
      case 'expert': return 'bg-red-500/20 text-red-400';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // 如果点击的是按钮，则不触发卡片链接
    if ((e.target as HTMLElement).closest('button')) {
      e.preventDefault();
    }
  };

  return (
    <div className="block">
      <Link 
        to={`/room/new?storyId=${story.id}`} 
        className="block h-full"
        onClick={handleCardClick}
      >
        <FrostedCard className="h-full group transition-all duration-300 hover:scale-[1.02] hover:ring-2 hover:ring-amber-400/30 cursor-pointer h-full">
          <div className="p-5 h-full flex flex-col">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-bold text-white text-lg group-hover:text-amber-300 transition-colors line-clamp-1">
                {story.title}
              </h3>
              <span className={`text-xs px-2.5 py-1 rounded-full ${getDifficultyColor(story.difficulty)}`}>
                {getDifficultyText(story.difficulty)}
              </span>
            </div>
            
            <div className="flex-1">
              <p className="text-slate-300 text-sm line-clamp-3 mb-4">
                {story.surface}
              </p>
              
              <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/10">
                <span className="text-xs text-slate-400">
                  预估时长: {story.estimatedTime}分钟
                </span>
                <GlassButton size="sm" variant="outline">
                  开始游戏
                </GlassButton>
              </div>
            </div>
          </div>
        </FrostedCard>
      </Link>
    </div>
  );
};

export default GameCard;
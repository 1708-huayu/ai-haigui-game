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
    if ((e.target as Element).closest('button, a')) {
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
        <FrostedCard className="h-full group transition-all duration-300 hover:scale-[1.03] hover:ring-2 hover:ring-amber-400/50 cursor-pointer h-full overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          <div className="p-5 h-full flex flex-col relative z-10">
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
                <div className="flex flex-col">
                  <span className="text-xs text-slate-400">
                    预估时长: {story.estimatedTime}分钟
                  </span>
                  <div className="flex gap-1 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <div 
                        key={i} 
                        className={`w-1 h-1 rounded-full ${
                          i < Math.floor(story.estimatedTime / 5) 
                            ? 'bg-amber-400' 
                            : 'bg-slate-600'
                        }`}
                      ></div>
                    ))}
                  </div>
                </div>
                
                <div onClick={(e) => e.stopPropagation()}>
                  <GlassButton 
                    size="sm" 
                    variant="primary"
                    className="group/btn"
                  >
                    <span className="group-hover/btn:scale-110 transition-transform">
                      开始游戏 →
                    </span>
                  </GlassButton>
                </div>
              </div>
            </div>
          </div>
        </FrostedCard>
      </Link>
    </div>
  );
};

export default GameCard;
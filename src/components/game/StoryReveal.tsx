import React from 'react';

interface StoryRevealProps {
  surface: string;
  bottom?: string;
  isRevealed?: boolean;
}

const StoryReveal: React.FC<StoryRevealProps> = ({ 
  surface, 
  bottom, 
  isRevealed = false 
}) => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium text-amber-400 mb-1">汤面（已知信息）</h3>
        <p className="text-white text-sm leading-relaxed">{surface}</p>
      </div>
      
      {isRevealed && bottom && (
        <div className="pt-4 border-t border-white/10">
          <h3 className="text-sm font-medium text-amber-400 mb-1">汤底（真相）</h3>
          <p className="text-white text-sm leading-relaxed">{bottom}</p>
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
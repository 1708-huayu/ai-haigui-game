import React from 'react';
import { useParams } from 'react-router-dom';
import FrostedCard from '../components/common/FrostedCard';
import GlassButton from '../components/common/GlassButton';

const Game: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4">
      <div className="max-w-4xl mx-auto">
        <header className="py-6 text-center">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-500">
            游戏房间: {id}
          </h1>
          <p className="text-slate-300 mt-2">与AI进行海龟汤推理</p>
        </header>

        <FrostedCard className="p-8 text-center">
          <h2 className="text-2xl font-semibold text-white mb-4">游戏进行中</h2>
          <p className="text-slate-300 mb-6">房间 {id} 的游戏正在进行...</p>
          
          <div className="space-y-4">
            <div className="bg-white/10 rounded-xl p-4 text-left">
              <p className="text-white"><span className="text-amber-400">AI主持人:</span> 欢迎来到海龟汤游戏！请提出你的第一个问题。</p>
            </div>
            
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="输入你的问题..." 
                className="flex-1 bg-white/10 backdrop-blur-md rounded-xl px-4 py-3 border border-white/20 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
              <GlassButton>发送</GlassButton>
            </div>
          </div>
        </FrostedCard>
      </div>
    </div>
  );
};

export default Game;
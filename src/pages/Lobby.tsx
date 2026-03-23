import React from 'react';
import BentoGrid from '../components/layout/BentoGrid';
import BentoItem from '../components/layout/BentoItem';
import FrostedCard from '../components/common/FrostedCard';
import GlassButton from '../components/common/GlassButton';

const Lobby: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4">
      <div className="max-w-6xl mx-auto">
        <header className="py-6 text-center">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-500">
            AI 海龟汤
          </h1>
          <p className="text-slate-300 mt-2">多人推理派对游戏</p>
        </header>

        <BentoGrid>
          <BentoItem size="md">
            <FrostedCard className="h-full flex flex-col items-center justify-center p-6 text-center">
              <h2 className="text-xl font-semibold text-white mb-4">快速匹配</h2>
              <GlassButton>随机加入房间</GlassButton>
            </FrostedCard>
          </BentoItem>

          <BentoItem size="lg">
            <FrostedCard className="h-full p-6">
              <h2 className="text-xl font-semibold text-white mb-4">热门剧本</h2>
              <div className="space-y-4">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                    <h3 className="font-medium text-white">神秘案件 #{item}</h3>
                    <p className="text-slate-300 text-sm mt-1">难度: 中等 | 时长: 15分钟</p>
                    <div className="mt-3 flex gap-2">
                      <GlassButton size="sm">查看详情</GlassButton>
                      <GlassButton size="sm" variant="secondary">创建房间</GlassButton>
                    </div>
                  </div>
                ))}
              </div>
            </FrostedCard>
          </BentoItem>

          <BentoItem size="sm">
            <FrostedCard className="h-full flex flex-col items-center justify-center p-4">
              <h3 className="font-medium text-white">房间数量</h3>
              <p className="text-3xl font-bold text-amber-400 mt-2">24</p>
            </FrostedCard>
          </BentoItem>

          <BentoItem size="md">
            <FrostedCard className="h-full p-6">
              <h2 className="text-xl font-semibold text-white mb-4">创建房间</h2>
              <div className="space-y-4">
                <input 
                  type="text" 
                  placeholder="房间名称" 
                  className="w-full bg-white/10 backdrop-blur-md rounded-xl px-4 py-3 border border-white/20 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
                <select className="w-full bg-white/10 backdrop-blur-md rounded-xl px-4 py-3 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-amber-400">
                  <option>选择剧本</option>
                  <option>神秘案件 #1</option>
                  <option>神秘案件 #2</option>
                </select>
                <GlassButton className="w-full">创建房间</GlassButton>
              </div>
            </FrostedCard>
          </BentoItem>
        </BentoGrid>
      </div>
    </div>
  );
};

export default Lobby;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BentoGrid from '../components/layout/BentoGrid';
import BentoItem from '../components/layout/BentoItem';
import FrostedCard from '../components/common/FrostedCard';
import GlassButton from '../components/common/GlassButton';
import GameCard from '../components/game/GameCard';
import { stories } from '../stories';
import { IStory } from '../types/models';

const Lobby: React.FC = () => {
  const [selectedStory, setSelectedStory] = useState<IStory | null>(null);
  const navigate = useNavigate();

  const getDifficultyText = (difficulty: string) => {
    switch(difficulty) {
      case 'easy': return '入门';
      case 'medium': return '中等';
      case 'hard': return '困难';
      case 'expert': return '专家';
      default: return '未知';
    }
  };

  const handleCreateRoom = () => {
    if (selectedStory) {
      // 在实际应用中，这里应该调用API创建房间
      // 现在我们模拟生成一个房间ID并导航到房间页面
      const roomId = `room_${Date.now()}`;
      navigate(`/room/${roomId}`);
    }
  };

  const handleQuickJoin = () => {
    // 在实际应用中，这里应该调用API快速匹配房间
    // 现在我们模拟加入一个随机房间
    const roomId = `room_${Date.now()}`;
    navigate(`/room/${roomId}`);
  };

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
              <GlassButton onClick={handleQuickJoin}>随机加入房间</GlassButton>
            </FrostedCard>
          </BentoItem>

          <BentoItem size="lg">
            <FrostedCard className="h-full p-6">
              <h2 className="text-xl font-semibold text-white mb-4">热门剧本</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
                {stories.slice(0, 3).map((story) => (
                  <GameCard key={story.id} story={story} />
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
                <select 
                  className="w-full bg-white/10 backdrop-blur-md rounded-xl px-4 py-3 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                  value={selectedStory?.id || ''}
                  onChange={(e) => {
                    const story = stories.find(s => s.id === e.target.value);
                    if (story) setSelectedStory(story);
                  }}
                >
                  <option value="">选择剧本</option>
                  {stories.map(story => (
                    <option key={story.id} value={story.id}>{story.title}</option>
                  ))}
                </select>
                <GlassButton 
                  className="w-full"
                  disabled={!selectedStory}
                  onClick={handleCreateRoom}
                >
                  {selectedStory ? `使用 "${selectedStory.title}" 创建房间` : '请选择剧本'}
                </GlassButton>
              </div>
            </FrostedCard>
          </BentoItem>
        </BentoGrid>
      </div>
    </div>
  );
};

export default Lobby;
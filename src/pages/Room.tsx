import React, { useEffect, useState } from 'react';
import FrostedCard from '../components/common/FrostedCard';
import ChatBoard from '../components/game/ChatBoard';
import StoryReveal from '../components/game/StoryReveal';
import { useParams, useLocation } from 'react-router-dom';
import { stories } from '../stories';
import { IStory } from '../types/models';
import { getUrlParams } from '../utils/urlHelper';

const Room: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const location = useLocation();
  const [selectedStory, setSelectedStory] = useState<IStory | null>(null);

  useEffect(() => {
    // 从URL参数中获取故事ID
    const params = getUrlParams(location);
    const storyIdFromParam = params.storyId;
    
    // 如果是新房间且带有故事ID参数，则使用该故事；否则使用默认故事
    const storyId = (roomId === 'new' && storyIdFromParam) ? storyIdFromParam : 
                   roomId?.startsWith('room_') ? 'story-001' : // 对于新生成的房间ID
                   roomId || 'story-001'; // 对于普通房间ID
    
    const story = stories.find(s => s.id === storyId);
    if (story) {
      setSelectedStory(story);
    } else if (storyIdFromParam) {
      // 如果指定了故事ID但找不到对应故事，则使用第一个故事
      setSelectedStory(stories[0]);
    }
  }, [roomId, location]);

  // 生成一个友好的房间ID显示名
  const displayRoomId = roomId && !roomId.startsWith('room_new') ? roomId : '新房间';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4">
      <div className="max-w-6xl mx-auto">
        <header className="py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-500">
            房间: {displayRoomId}
          </h1>
          <div className="flex gap-2">
            <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">在线</span>
            <span className="px-3 py-1 bg-white/10 text-white rounded-full text-sm">4/6 玩家</span>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mt-4">
          {/* 玩家列表 */}
          <div className="lg:col-span-1 space-y-4">
            <FrostedCard className="p-4">
              <h2 className="text-lg font-semibold text-white mb-3">玩家列表</h2>
              <div className="space-y-2">
                {['玩家A (房主)', '玩家B', '玩家C', 'AI主持人'].map((player, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${index === 3 ? 'bg-purple-500' : 'bg-green-500'}`}></div>
                    <span className="text-white">{player}</span>
                    {index === 0 && <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-1 rounded">房主</span>}
                  </div>
                ))}
              </div>
            </FrostedCard>

            <FrostedCard className="p-4">
              <h2 className="text-lg font-semibold text-white mb-3">故事信息</h2>
              {selectedStory ? (
                <StoryReveal 
                  story={selectedStory}
                  isRevealed={false}
                />
              ) : (
                <p className="text-slate-400">正在加载故事信息...</p>
              )}
            </FrostedCard>
          </div>

          {/* 聊天区域 */}
          <div className="lg:col-span-3">
            <FrostedCard className="h-[calc(100vh-200px)] flex flex-col">
              <ChatBoard />
            </FrostedCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Room;
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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-4">
      <div className="max-w-6xl mx-auto">
        <header className="py-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-500 flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
              </svg>
              房间: {displayRoomId}
            </h1>
            <p className="text-slate-400 text-sm mt-1">与朋友们一起解开谜题</p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <div className="px-4 py-2 bg-green-500/20 text-green-400 rounded-xl text-sm flex items-center gap-2 border border-green-500/30">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              在线
            </div>
            <div className="px-4 py-2 bg-white/10 text-white rounded-xl text-sm flex items-center gap-2 border border-white/20">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              4/6 玩家
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-6">
          {/* 玩家列表和故事信息 */}
          <div className="lg:col-span-1 space-y-6">
            {/* 玩家列表 */}
            <FrostedCard className="p-5 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-amber-500 to-yellow-500"></div>
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                玩家列表
              </h2>
              <div className="space-y-3">
                {[
                  { name: '玩家A (房主)', isHost: true, isOnline: true },
                  { name: '玩家B', isHost: false, isOnline: true },
                  { name: '玩家C', isHost: false, isOnline: true },
                  { name: 'AI主持人', isHost: false, isOnline: true, isAI: true }
                ].map((player, index) => (
                  <div key={index} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors">
                    <div className={`w-2 h-2 rounded-full ${player.isOnline ? (player.isAI ? 'bg-purple-500' : 'bg-green-500') : 'bg-gray-500'}`}></div>
                    <span className="text-white flex-1">{player.name}</span>
                    {player.isHost && (
                      <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-1 rounded border border-amber-500/30">
                        房主
                      </span>
                    )}
                    {player.isAI && (
                      <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded border border-purple-500/30">
                        AI
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </FrostedCard>

            {/* 故事信息 */}
            <FrostedCard className="p-5 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                故事信息
              </h2>
              {selectedStory ? (
                <StoryReveal 
                  story={selectedStory}
                  isRevealed={false}
                />
              ) : (
                <p className="text-slate-400">正在加载故事信息...</p>
              )}
            </FrostedCard>
            
            {/* 房间操作 */}
            <FrostedCard className="p-5 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-green-500 to-teal-500"></div>
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                房间设置
              </h2>
              <div className="space-y-3">
                <button className="w-full text-left p-2 rounded-lg hover:bg-white/5 transition-colors text-slate-300 hover:text-white flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  复制房间链接
                </button>
                <button className="w-full text-left p-2 rounded-lg hover:bg-white/5 transition-colors text-slate-300 hover:text-white flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  房间规则
                </button>
              </div>
            </FrostedCard>
          </div>

          {/* 聊天区域 */}
          <div className="lg:col-span-3">
            <FrostedCard className="h-[calc(100vh-250px)] max-h-[calc(100vh-250px)] flex flex-col relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-amber-500 to-transparent"></div>
              <div className="flex-1 overflow-hidden">
                <ChatBoard />
              </div>
            </FrostedCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Room;
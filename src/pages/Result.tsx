import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import FrostedCard from '../components/common/FrostedCard';
import GlassButton from '../components/common/GlassButton';
import Message from '../components/game/Message';
import { stories } from '../stories';
import { IStory, IMessage } from '../types/models';
import { getUrlParams } from '../utils/urlHelper';

const Result: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = getUrlParams(location);
  
  const storyId = params.storyId || 'story-001'; // 从URL参数获取故事ID
  const [currentStory, setCurrentStory] = useState<IStory | null>(null);
  const [showReveal, setShowReveal] = useState(false);
  const [animateTitle, setAnimateTitle] = useState(false);
  
  // 从location state获取对话历史，如果不存在则使用默认值
  const conversationHistory: IMessage[] = location.state?.conversationHistory || [];

  useEffect(() => {
    // 获取故事信息
    const story = stories.find(s => s.id === storyId);
    if (story) {
      setCurrentStory(story);
    }
    
    // 触发标题动画
    setAnimateTitle(true);
    
    // 延迟显示揭晓动画
    const timer = setTimeout(() => {
      setShowReveal(true);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [storyId]);

  const handlePlayAgain = () => {
    navigate('/');
  };

  if (!currentStory) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-500 mb-4">
            故事未找到
          </h2>
          <p className="text-slate-300">抱歉，找不到对应的故事</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4">
      <div className="max-w-4xl mx-auto py-8">
        <div className={`text-center mb-12 transition-all duration-1000 ${animateTitle ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-500 mb-4">
            推理成功！
          </h1>
          <p className="text-slate-300 text-lg">恭喜你揭开了真相</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 故事信息 */}
          <div>
            <FrostedCard className="p-6 h-full">
              <h2 className="text-2xl font-bold text-white mb-4 text-center">{currentStory.title}</h2>
              
              <div className="my-6">
                <h3 className="text-lg font-semibold text-amber-400 mb-3">汤面（已知信息）</h3>
                <p className="text-white leading-relaxed">{currentStory.surface}</p>
              </div>
              
              <div className="my-6">
                <h3 className="text-lg font-semibold text-amber-400 mb-3">对话历史</h3>
                <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
                  {conversationHistory.length > 0 ? (
                    conversationHistory.map((msg) => (
                      <Message key={msg.id} message={msg} />
                    ))
                  ) : (
                    <p className="text-slate-400 text-center py-4">暂无对话记录</p>
                  )}
                </div>
              </div>
            </FrostedCard>
          </div>

          {/* 汤底揭晓 */}
          <div>
            <FrostedCard className="p-6 h-full flex flex-col">
              <h2 className="text-2xl font-bold text-white mb-6 text-center">真相揭晓</h2>
              
              <div className="flex-1 flex flex-col items-center justify-center">
                <div className={`transition-all duration-1000 ease-in-out ${showReveal ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                  <div className="bg-gradient-to-r from-amber-900/30 to-yellow-900/30 rounded-2xl p-6 border-2 border-amber-500/50 shadow-lg shadow-amber-500/20">
                    <h3 className="text-xl font-bold text-amber-400 mb-4 text-center">汤底（真相）</h3>
                    <p className="text-white text-lg leading-relaxed text-center">{currentStory.bottom}</p>
                  </div>
                </div>
                
                {!showReveal && (
                  <div className="flex flex-col items-center justify-center h-full">
                    <div className="relative">
                      <div className="w-24 h-24 border-4 border-amber-500/30 rounded-full animate-ping absolute"></div>
                      <div className="w-24 h-24 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full flex items-center justify-center relative">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </div>
                    </div>
                    <p className="mt-4 text-slate-400 text-center">真相即将揭晓...</p>
                  </div>
                )}
              </div>
              
              <div className="mt-8 flex justify-center">
                <GlassButton 
                  onClick={handlePlayAgain}
                  className="px-8 py-3 text-lg"
                >
                  再来一局
                </GlassButton>
              </div>
            </FrostedCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Result;
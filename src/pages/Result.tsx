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
  const [showConfetti, setShowConfetti] = useState(false);
  
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
    
    // 显示庆祝效果
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
    
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
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-4 flex items-center justify-center">
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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-4 relative overflow-hidden">
      {/* 装饰元素 */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-amber-500/10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-xl animate-pulse delay-500"></div>
      
      {/* 庆祝效果 */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-amber-400 rounded-full animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1 + Math.random()}s`
              }}
            ></div>
          ))}
        </div>
      )}

      <div className="max-w-4xl mx-auto py-8 relative z-10">
        <div className={`text-center mb-12 transition-all duration-1000 ${animateTitle ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
          <div className="inline-block relative">
            <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-300 mb-4 relative z-10">
              推理成功！
            </h1>
            <div className="absolute -top-2 -right-4 w-8 h-8 bg-gradient-to-r from-amber-400 to-yellow-400 rounded-full flex items-center justify-center animate-float">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <p className="text-slate-300 text-lg">恭喜你揭开了真相</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 故事信息 */}
          <div>
            <FrostedCard className="p-6 h-full relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-yellow-500"></div>
              <h2 className="text-2xl font-bold text-white mb-4 text-center relative z-10">{currentStory.title}</h2>
              
              <div className="my-6 relative z-10">
                <h3 className="text-lg font-semibold text-amber-400 mb-3 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  汤面（已知信息）
                </h3>
                <p className="text-white leading-relaxed bg-slate-800/30 p-4 rounded-xl border border-white/10">
                  {currentStory.surface}
                </p>
              </div>
              
              <div className="my-6 relative z-10">
                <h3 className="text-lg font-semibold text-amber-400 mb-3 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  推理过程
                </h3>
                <div className="max-h-60 overflow-y-auto space-y-3 pr-2">
                  {conversationHistory.length > 0 ? (
                    conversationHistory.slice(-8).map((msg) => (
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
            <FrostedCard className="p-6 h-full flex flex-col relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-yellow-500"></div>
              <h2 className="text-2xl font-bold text-white mb-6 text-center relative z-10">真相揭晓</h2>
              
              <div className="flex-1 flex flex-col items-center justify-center relative z-10">
                <div className={`transition-all duration-1000 ease-in-out ${showReveal ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                  <div className="bg-gradient-to-r from-amber-900/30 to-yellow-900/30 rounded-2xl p-6 border-2 border-amber-500/50 shadow-lg shadow-amber-500/20 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500/5 to-transparent transform -skew-x-12 -rotate-6"></div>
                    <div className="relative z-10">
                      <h3 className="text-xl font-bold text-amber-400 mb-4 text-center flex items-center justify-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        汤底（真相）
                      </h3>
                      <p className="text-white text-lg leading-relaxed text-center">{currentStory.bottom}</p>
                    </div>
                  </div>
                </div>
                
                {!showReveal && (
                  <div className="flex flex-col items-center justify-center h-full">
                    <div className="relative">
                      <div className="w-24 h-24 border-4 border-amber-500/30 rounded-full animate-ping absolute"></div>
                      <div className="w-24 h-24 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full flex items-center justify-center relative animate-float">
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
              
              <div className="mt-8 flex justify-center relative z-10">
                <GlassButton 
                  onClick={handlePlayAgain}
                  className="px-8 py-3 text-lg flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  再来一局
                </GlassButton>
              </div>
            </FrostedCard>
          </div>
        </div>
        
        <div className="text-center mt-12 text-slate-500">
          <p>感谢游玩 AI 海龟汤 - 挑战你的逻辑极限</p>
        </div>
      </div>
    </div>
  );
};

export default Result;
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import FrostedCard from '../components/common/FrostedCard';
import GlassButton from '../components/common/GlassButton';
import ChatBox from '../components/game/ChatBox';
import { stories } from '../stories';
import { IStory, IMessage } from '../types/models';
import { getAIJudgment } from '../api';

const Game: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [currentStory, setCurrentStory] = useState<IStory | null>(null);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'ended'>('playing'); // 游戏状态管理
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    // 根据URL参数获取故事
    const story = stories.find(s => s.id === id);
    if (story) {
      setCurrentStory(story);
      
      // 初始化消息列表
      setMessages([
        {
          id: '1',
          senderId: 'ai',
          senderName: 'AI主持人',
          content: `欢迎来到《${story.title}》！故事即将开始...`,
          type: 'system',
          timestamp: Date.now() - 30000
        },
        {
          id: '2',
          senderId: 'ai',
          senderName: 'AI主持人',
          content: story.surface,
          type: 'chat',
          timestamp: Date.now() - 20000
        }
      ]);
    }
  }, [id]);

  const handleSendMessage = async (content: string) => {
    if (isLoading || gameStatus !== 'playing') return; // 防止重复提交或在游戏结束后继续提问
    
    // 添加用户消息
    const userMessage: IMessage = {
      id: Date.now().toString(),
      senderId: 'current-player',
      senderName: '我',
      content: content,
      type: 'chat',
      timestamp: Date.now()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setErrorMessage(null); // 清除之前的错误

    try {
      // 调用AI API获取判断
      if (!currentStory) {
        throw new Error('当前故事未加载');
      }
      
      const aiResult = await getAIJudgment(content, currentStory);
      
      // 创建AI响应消息
      const aiResponse: IMessage = {
        id: (Date.now() + 1).toString(),
        senderId: 'ai',
        senderName: 'AI主持人',
        content: aiResult.reply,
        type: 'judgment',
        aiResult: aiResult.isWin ? 'WIN' : aiResult.decision,
        timestamp: Date.now()
      };
      
      setMessages(prev => [...prev, aiResponse]);
      
      // 如果AI判断玩家获胜，则更新游戏状态
      if (aiResult.isWin) {
        setGameStatus('won');
        setTimeout(() => {
          // 跳转到结果页面
          navigate(`/result?storyId=${currentStory?.id}`, { state: { conversationHistory: [...messages, userMessage, aiResponse] } });
        }, 1500);
      }
    } catch (error: any) {
      console.error('AI调用错误:', error);
      
      // 设置错误消息，将在ChatBox中显示
      setErrorMessage(error.message || 'AI暂时无法回应，请稍后再试');
      
      // 添加错误消息到聊天记录
      const errorMessage: IMessage = {
        id: (Date.now() + 1).toString(),
        senderId: 'system',
        senderName: '系统',
        content: error.message || 'AI暂时无法回应，请稍后再试',
        type: 'system',
        timestamp: Date.now()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShowBottom = () => {
    // 跳转到结果页面
    navigate(`/result?storyId=${currentStory?.id}`, { state: { conversationHistory: messages } });
  };

  const handleEndGame = () => {
    // 返回大厅
    navigate('/');
  };

  const handleAbortGame = () => {
    // 确认是否要放弃游戏
    if (window.confirm('确定要放弃当前游戏吗？')) {
      navigate('/');
    }
  };

  if (!currentStory) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-500 mb-4">
              故事未找到
            </h2>
            <p className="text-slate-300">抱歉，找不到ID为 "{id}" 的故事</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-4">
      <div className="max-w-4xl mx-auto">
        <header className="py-6 text-center relative">
          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
            <div className="w-3 h-3 bg-amber-400 rounded-full animate-pulse"></div>
          </div>
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-500 animate-fade-in">
            AI 海龟汤
          </h1>
          <p className="text-slate-300 mt-2 transition-all duration-300">
            {gameStatus === 'won' ? (
              <span className="text-amber-400 font-semibold">推理成功！🎉</span>
            ) : gameStatus === 'ended' ? (
              <span className="text-slate-400">游戏已结束</span>
            ) : (
              <span>与AI进行推理游戏</span>
            )}
          </p>
        </header>

        <div className="space-y-6">
          {/* 故事信息区域 */}
          <FrostedCard className="p-6 animate-slide-up relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-yellow-500"></div>
            <div className="text-center mb-4">
              <h2 className="text-2xl font-bold text-white mb-2">{currentStory.title}</h2>
              <div className="flex items-center justify-center gap-4">
                <span className="inline-block px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full text-sm">
                  {currentStory.difficulty === 'easy' ? '入门' : 
                   currentStory.difficulty === 'medium' ? '中等' : 
                   currentStory.difficulty === 'hard' ? '困难' : '专家'}
                </span>
                <span className="text-slate-400 text-sm">
                  预估时长: {currentStory.estimatedTime}分钟
                </span>
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-semibold text-amber-400 mb-2 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                汤面（已知信息）
              </h3>
              <p className="text-white text-lg leading-relaxed bg-slate-800/30 p-4 rounded-xl border border-white/10">
                {currentStory.surface}
              </p>
            </div>
          </FrostedCard>

          {/* 聊天区域 */}
          <FrostedCard className="h-[500px] flex flex-col animate-slide-up delay-100 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-amber-500 to-transparent"></div>
            <ChatBox 
              initialMessages={messages} 
              onSendMessage={handleSendMessage} 
              isLoading={isLoading}
              errorMessage={errorMessage}
            />
          </FrostedCard>

          {/* 底部按钮区域 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-slide-up delay-200">
            <GlassButton 
              variant="secondary" 
              onClick={handleShowBottom}
              disabled={isLoading}
              className="transform hover:scale-105 active:scale-95 transition-transform flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              查看汤底
            </GlassButton>
            <GlassButton 
              variant="outline" 
              onClick={handleAbortGame}
              disabled={isLoading}
              className="transform hover:scale-105 active:scale-95 transition-transform flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              放弃游戏
            </GlassButton>
            <GlassButton 
              onClick={handleEndGame}
              disabled={isLoading}
              className="transform hover:scale-105 active:scale-95 transition-transform flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              返回大厅
            </GlassButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Game;
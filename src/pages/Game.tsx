import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import FrostedCard from '../components/common/FrostedCard';
import GlassButton from '../components/common/GlassButton';
import ChatBox from '../components/game/ChatBox';
import { stories } from '../stories';
import { IStory, IMessage } from '../types/models';
import { getAIJudgment } from '../api';

const Game: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [currentStory, setCurrentStory] = useState<IStory | null>(null);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [showBottom, setShowBottom] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
    if (isLoading) return; // 防止重复提交
    
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
      
      // 如果AI判断玩家获胜，则显示胜利信息
      if (aiResult.isWin) {
        setTimeout(() => {
          alert('恭喜！你成功推理出了真相！');
          setShowBottom(true);
        }, 500);
      }
    } catch (error: any) {
      console.error('AI调用错误:', error);
      
      // 添加错误消息
      const errorMessage: IMessage = {
        id: (Date.now() + 1).toString(),
        senderId: 'ai',
        senderName: 'AI主持人',
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
    setShowBottom(true);
  };

  const handleEndGame = () => {
    // 在实际应用中，这里会导航到总结页面
    alert('游戏结束！');
  };

  if (!currentStory) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4">
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4">
      <div className="max-w-4xl mx-auto">
        <header className="py-6 text-center">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-500">
            AI 海龟汤
          </h1>
          <p className="text-slate-300 mt-2">与AI进行推理游戏</p>
        </header>

        <div className="space-y-6">
          {/* 故事信息区域 */}
          <FrostedCard className="p-6">
            <div className="text-center mb-4">
              <h2 className="text-2xl font-bold text-white mb-2">{currentStory.title}</h2>
              <span className="inline-block px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full text-sm">
                {currentStory.difficulty === 'easy' ? '入门' : 
                 currentStory.difficulty === 'medium' ? '中等' : 
                 currentStory.difficulty === 'hard' ? '困难' : '专家'} | 
                预估时长: {currentStory.estimatedTime}分钟
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-semibold text-amber-400 mb-2">汤面（已知信息）</h3>
              <p className="text-white text-lg leading-relaxed">{currentStory.surface}</p>
            </div>
          </FrostedCard>

          {/* 聊天区域 */}
          <FrostedCard className="h-[400px] flex flex-col">
            <ChatBox 
              initialMessages={messages} 
              onSendMessage={handleSendMessage} 
              isLoading={isLoading}
            />
          </FrostedCard>

          {/* 底部按钮区域 */}
          <div className="flex justify-center gap-4">
            <GlassButton 
              variant="secondary" 
              onClick={handleShowBottom}
              disabled={isLoading}
            >
              查看汤底
            </GlassButton>
            <GlassButton 
              variant="outline" 
              onClick={handleEndGame}
              disabled={isLoading}
            >
              结束游戏
            </GlassButton>
          </div>
        </div>

        {/* 汤底弹窗 */}
        {showBottom && currentStory && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="relative w-full max-w-2xl">
              <FrostedCard className="p-8">
                <h3 className="text-2xl font-bold text-amber-400 mb-4 text-center">真相揭晓</h3>
                
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-white mb-2">汤底（真相）</h4>
                  <p className="text-white text-lg leading-relaxed">{currentStory.bottom}</p>
                </div>
                
                <div className="flex justify-center gap-4">
                  <GlassButton 
                    variant="secondary" 
                    onClick={() => setShowBottom(false)}
                  >
                    关闭
                  </GlassButton>
                  <GlassButton 
                    onClick={handleEndGame}
                  >
                    结束游戏
                  </GlassButton>
                </div>
              </FrostedCard>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Game;
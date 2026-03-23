import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import FrostedCard from '../components/common/FrostedCard';
import GlassButton from '../components/common/GlassButton';
import { stories } from '../stories';
import { IStory } from '../types/models';

const Summary: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const [selectedStory, setSelectedStory] = useState<IStory | null>(null);

  useEffect(() => {
    // 在实际应用中，这里应该从服务器获取房间和故事信息
    // 现在我们模拟从URL或存储中获取故事信息
    const mockStoryId = 'story-001'; // 这里应该是从房间信息中获取的实际故事ID
    const story = stories.find(s => s.id === mockStoryId);
    if (story) {
      setSelectedStory(story);
    }
  }, [roomId]);

  // 模拟推理时间线数据
  const timelineData = [
    { player: '玩家A', question: '死者是否喝酒？', response: '是', type: 'positive' },
    { player: '玩家B', question: '酒是否有毒？', response: '是', type: 'positive' },
    { player: '玩家C', question: '是否是他自己下的毒？', response: '否', type: 'negative' },
    { player: '玩家A', question: '酒是不是他自带的？', response: '是 - <span class="text-amber-400">关键突破！</span>', type: 'key' },
  ];

  const handleReturnToLobby = () => {
    navigate('/');
  };

  const handlePlayAgain = () => {
    // 在实际应用中，这里应该创建一个新房间或重新开始游戏
    // 现在我们简单地返回大厅让用户重新选择
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4 flex items-center justify-center">
      <div className="max-w-3xl w-full">
        <FrostedCard className="p-8 text-center">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-500 mb-6">
            推理成功！
          </h1>
          
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">真相揭晓</h2>
            {selectedStory ? (
              <div className="bg-gradient-to-r from-amber-900/30 to-yellow-900/30 rounded-xl p-6 border border-amber-500/30">
                <h3 className="text-lg font-medium text-amber-400 mb-2">汤底：</h3>
                <p className="text-white">{selectedStory.bottom}</p>
              </div>
            ) : (
              <p className="text-slate-400">正在加载故事详情...</p>
            )}
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">推理时间线</h2>
            <div className="space-y-3 text-left">
              {timelineData.map((item, index) => (
                <div 
                  key={index} 
                  className={`rounded-lg p-3 ${
                    item.type === 'positive' ? 'bg-green-500/10 border border-green-500/20' :
                    item.type === 'negative' ? 'bg-red-500/10 border border-red-500/20' :
                    item.type === 'key' ? 'bg-amber-500/10 border border-amber-500/30 ring-2 ring-amber-500/30' :
                    'bg-white/10'
                  }`}
                >
                  <span className="text-amber-400">{item.player}:</span> 问"{item.question}" →{' '}
                  <span 
                    className={
                      item.type === 'positive' ? 'text-green-400' :
                      item.type === 'negative' ? 'text-red-400' :
                      item.type === 'key' ? 'text-amber-400' : 'text-white'
                    }
                    dangerouslySetInnerHTML={{ __html: `AI: ${item.response}` }}
                  ></span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-4 justify-center">
            <GlassButton onClick={handleReturnToLobby}>返回大厅</GlassButton>
            <GlassButton variant="secondary" onClick={handlePlayAgain}>再来一局</GlassButton>
            <GlassButton variant="outline">分享战绩</GlassButton>
          </div>
        </FrostedCard>
      </div>
    </div>
  );
};

export default Summary;
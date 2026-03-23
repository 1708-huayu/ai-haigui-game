import React from 'react';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  type: 'system' | 'chat' | 'judgment';
  aiResult?: 'YES' | 'NO' | 'IRRELEVANT' | 'WIN';
  timestamp: number;
}

const MessageBubble: React.FC<{ message: Message }> = ({ message }) => {
  const isAI = message.senderId === 'ai';
  const isSystem = message.type === 'system';
  
  let bubbleColor = 'bg-white/10';
  if (isAI) {
    if (message.aiResult === 'YES') {
      bubbleColor = 'bg-green-500/20 border border-green-500/30';
    } else if (message.aiResult === 'NO') {
      bubbleColor = 'bg-red-500/20 border border-red-500/30';
    } else if (message.aiResult === 'IRRELEVANT') {
      bubbleColor = 'bg-gray-500/20 border border-gray-500/30';
    } else if (message.aiResult === 'WIN') {
      bubbleColor = 'bg-amber-500/20 border border-amber-500/30';
    } else {
      bubbleColor = 'bg-purple-500/20 border border-purple-500/30';
    }
  } else if (isSystem) {
    bubbleColor = 'bg-blue-500/20 border border-blue-500/30';
  }

  // 如果是AI的关键回应，添加特殊标记
  const isHighlight = message.aiResult && ['YES', 'NO', 'WIN'].includes(message.aiResult);

  return (
    <div className={`flex ${isAI ? 'justify-start' : 'justify-end'}`}>
      <div className={`max-w-[80%] ${isHighlight ? 'ring-2 ring-amber-400/50 rounded-xl' : ''}`}>
        {!isSystem && (
          <div className={`text-xs ${isAI ? 'text-purple-300' : 'text-slate-400'} mb-1`}>
            {message.senderName}
          </div>
        )}
        <div className={`${bubbleColor} rounded-2xl px-4 py-3 backdrop-blur-sm`}>
          <p className="text-white">{message.content}</p>
          {message.aiResult && (
            <div className="mt-1 text-xs text-right">
              {message.aiResult === 'YES' && <span className="text-green-400">✓ 是</span>}
              {message.aiResult === 'NO' && <span className="text-red-400">✗ 否</span>}
              {message.aiResult === 'IRRELEVANT' && <span className="text-gray-400">∅ 无关</span>}
              {message.aiResult === 'WIN' && <span className="text-amber-400 font-bold">🎉 胜利!</span>}
            </div>
          )}
        </div>
        <div className={`text-xs text-slate-500 mt-1 ${isAI ? 'text-left' : 'text-right'}`}>
          {format(new Date(message.timestamp), 'HH:mm', { locale: zhCN })}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
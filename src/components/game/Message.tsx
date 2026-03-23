import React from 'react';
import { IMessage } from '../types/models';

interface MessageProps {
  message: IMessage;
}

const Message: React.FC<MessageProps> = ({ message }) => {
  const isUser = message.senderId !== 'ai';
  const isSystem = message.type === 'system';

  // 根据消息类型确定样式
  let bgColor = 'bg-white/10';
  if (message.type === 'judgment') {
    if (message.aiResult === 'YES') {
      bgColor = 'bg-green-500/20 border border-green-500/30';
    } else if (message.aiResult === 'NO') {
      bgColor = 'bg-red-500/20 border border-red-500/30';
    } else if (message.aiResult === 'IRRELEVANT') {
      bgColor = 'bg-gray-500/20 border border-gray-500/30';
    } else if (message.aiResult === 'WIN') {
      bgColor = 'bg-amber-500/20 border border-amber-500/30';
    } else {
      bgColor = 'bg-purple-500/20 border border-purple-500/30';
    }
  } else if (isSystem) {
    bgColor = 'bg-blue-500/20 border border-blue-500/30';
  } else if (isUser) {
    bgColor = 'bg-slate-700/30 border border-slate-600/40';
  } else {
    bgColor = 'bg-indigo-500/20 border border-indigo-500/30';
  }

  // 根据消息类型确定头像/图标
  const getAvatar = () => {
    if (isUser) {
      return (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 flex items-center justify-center">
          <span className="text-white text-sm font-bold">我</span>
        </div>
      );
    } else if (message.senderId === 'ai') {
      return (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
      );
    } else {
      return (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-slate-500 to-slate-700 flex items-center justify-center">
          <span className="text-white text-sm font-bold">{message.senderName.charAt(0)}</span>
        </div>
      );
    }
  };

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`flex items-start max-w-[80%] ${isUser ? 'flex-row-reverse' : ''}`}>
        {getAvatar()}
        <div className={`mx-2 ${isUser ? 'mr-2' : 'ml-2'}`}>
          <div className={`rounded-2xl px-4 py-3 backdrop-blur-sm ${bgColor} ${isUser ? 'rounded-tr-none' : 'rounded-tl-none'}`}>
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
          <div className={`text-xs text-slate-500 mt-1 ${isUser ? 'text-right' : 'text-left'}`}>
            {message.senderName}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Message;
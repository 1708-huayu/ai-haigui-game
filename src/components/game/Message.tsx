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
  let glowEffect = '';
  if (message.type === 'judgment') {
    if (message.aiResult === 'YES') {
      bgColor = 'bg-green-500/20 border border-green-500/30';
      glowEffect = 'shadow-green-500/20';
    } else if (message.aiResult === 'NO') {
      bgColor = 'bg-red-500/20 border border-red-500/30';
      glowEffect = 'shadow-red-500/20';
    } else if (message.aiResult === 'IRRELEVANT') {
      bgColor = 'bg-gray-500/20 border border-gray-500/30';
      glowEffect = 'shadow-gray-500/20';
    } else if (message.aiResult === 'WIN') {
      bgColor = 'bg-amber-500/20 border border-amber-500/30 animate-pulse-glow';
      glowEffect = 'shadow-amber-500/40';
    } else {
      bgColor = 'bg-purple-500/20 border border-purple-500/30';
      glowEffect = 'shadow-purple-500/20';
    }
  } else if (isSystem) {
    bgColor = 'bg-blue-500/20 border border-blue-500/30';
    glowEffect = 'shadow-blue-500/20';
  } else if (isUser) {
    bgColor = 'bg-slate-700/30 border border-slate-600/40';
    glowEffect = 'shadow-slate-600/20';
  } else {
    bgColor = 'bg-indigo-500/20 border border-indigo-500/30';
    glowEffect = 'shadow-indigo-500/20';
  }

  // 根据消息类型确定头像/图标
  const getAvatar = () => {
    if (isUser) {
      return (
        <div className="flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
          <span className="text-white text-sm font-bold">我</span>
        </div>
      );
    } else if (message.senderId === 'ai') {
      return (
        <div className="flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
      );
    } else {
      return (
        <div className="flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-r from-slate-500 to-slate-700 flex items-center justify-center shadow-lg shadow-slate-600/30">
          <span className="text-white text-sm font-bold">{message.senderName.charAt(0)}</span>
        </div>
      );
    }
  };

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-6`}>
      <div className={`flex items-start max-w-[80%] ${isUser ? 'flex-row-reverse' : ''}`}>
        {getAvatar()}
        <div className={`mx-3 ${isUser ? 'mr-3' : 'ml-3'} flex flex-col`}>
          <div className={`rounded-2xl px-5 py-4 backdrop-blur-sm ${bgColor} ${isUser ? 'rounded-tr-none' : 'rounded-tl-none'} shadow-lg ${glowEffect} shadow-current/10`}>
            <p className="text-white leading-relaxed">{message.content}</p>
            {message.aiResult && (
              <div className="mt-2 text-xs text-right">
                {message.aiResult === 'YES' && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/20 rounded-full text-green-400 border border-green-500/30">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    是
                  </span>
                )}
                {message.aiResult === 'NO' && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-500/20 rounded-full text-red-400 border border-red-500/30">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    否
                  </span>
                )}
                {message.aiResult === 'IRRELEVANT' && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-500/20 rounded-full text-gray-400 border border-gray-500/30">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    无关
                  </span>
                )}
                {message.aiResult === 'WIN' && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-500/20 rounded-full text-amber-400 border border-amber-500/30 font-bold animate-pulse">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    推理成功!
                  </span>
                )}
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
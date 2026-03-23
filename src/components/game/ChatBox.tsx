import React, { useState, useRef, useEffect } from 'react';
import Message from './Message';
import { IMessage } from '../../types/models';

interface ChatBoxProps {
  initialMessages?: IMessage[];
  onSendMessage?: (content: string) => void;
  isLoading?: boolean;
  errorMessage?: string;
}

const ChatBox: React.FC<ChatBoxProps> = ({ 
  initialMessages = [], 
  onSendMessage,
  isLoading = false,
  errorMessage
}) => {
  const [messages, setMessages] = useState<IMessage[]>(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSend = () => {
    if (inputValue.trim() && onSendMessage && !isLoading) {
      // 创建用户消息
      const userMessage: IMessage = {
        id: Date.now().toString(),
        senderId: 'current-player',
        senderName: '我',
        content: inputValue,
        type: 'chat',
        timestamp: Date.now()
      };
      
      // 更新本地消息列表
      setMessages(prev => [...prev, userMessage]);
      
      // 清空输入框
      setInputValue('');
      
      // 调用父组件的发送处理函数
      onSendMessage(inputValue);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // 当消息更新时，自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 允许父组件更新消息列表
  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);

  return (
    <div className="flex flex-col h-full">
      {/* 消息列表 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.length === 0 && !isLoading && (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <div className="mb-4">
              <div className="w-16 h-16 mx-auto bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">开始提问吧</h3>
            <p className="text-slate-400">向AI主持人提出你的疑问，揭开故事的真相</p>
          </div>
        )}
        
        {messages.map((message) => (
          <Message 
            key={message.id} 
            message={message} 
          />
        ))}
        
        {isLoading && (
          <div className="flex justify-start mb-4 animate-fade-in">
            <div className="flex items-start max-w-[80%]">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center animate-pulse">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="mx-2 ml-2">
                <div className="rounded-2xl px-4 py-3 backdrop-blur-sm bg-indigo-500/20 border border-indigo-500/30 rounded-tl-none">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 rounded-full bg-amber-400 animate-bounce"></div>
                    <div className="w-2 h-2 rounded-full bg-amber-400 animate-bounce delay-100"></div>
                    <div className="w-2 h-2 rounded-full bg-amber-400 animate-bounce delay-200"></div>
                  </div>
                </div>
                <div className="text-xs text-slate-500 mt-1 text-left">
                  AI主持人
                </div>
              </div>
            </div>
          </div>
        )}
        
        {errorMessage && (
          <div className="flex justify-start mb-4 animate-shake">
            <div className="flex items-start max-w-[80%]">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-red-500 to-red-700 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="mx-2 ml-2">
                <div className="rounded-2xl px-4 py-3 backdrop-blur-sm bg-red-500/20 border border-red-500/30 rounded-tl-none">
                  <p className="text-red-300">{errorMessage}</p>
                </div>
                <div className="text-xs text-slate-500 mt-1 text-left">
                  系统
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* 输入区域 */}
      <div className="p-4 border-t border-white/10">
        <div className="flex gap-2">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="输入你的问题..."
            className="flex-1 bg-white/10 backdrop-blur-md rounded-xl px-4 py-3 border border-white/20 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none transition-all"
            rows={1}
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={!inputValue.trim() || isLoading}
            className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white rounded-xl px-6 py-3 font-medium hover:from-amber-600 hover:to-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95"
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                发送中...
              </span>
            ) : '发送'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
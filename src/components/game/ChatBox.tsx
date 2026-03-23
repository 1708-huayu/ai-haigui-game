import React, { useState, useRef, useEffect } from 'react';
import Message from './Message';
import { IMessage } from '../../types/models';

interface ChatBoxProps {
  initialMessages?: IMessage[];
  onSendMessage?: (content: string) => void;
}

const ChatBox: React.FC<ChatBoxProps> = ({ 
  initialMessages = [], 
  onSendMessage 
}) => {
  const [messages, setMessages] = useState<IMessage[]>(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSend = () => {
    if (inputValue.trim() && onSendMessage) {
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
    if (initialMessages.length !== messages.length || 
        (initialMessages.length > 0 && initialMessages[0].id !== messages[0].id)) {
      setMessages(initialMessages);
    }
  }, [initialMessages]);

  return (
    <div className="flex flex-col h-full">
      {/* 消息列表 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((message) => (
          <Message key={message.id} message={message} />
        ))}
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
            className="flex-1 bg-white/10 backdrop-blur-md rounded-xl px-4 py-3 border border-white/20 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
            rows={1}
          />
          <button
            onClick={handleSend}
            disabled={!inputValue.trim()}
            className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white rounded-xl px-6 py-3 font-medium hover:from-amber-600 hover:to-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            发送
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
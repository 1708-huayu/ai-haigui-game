import React, { useState, useRef, useEffect } from 'react';
import MessageBubble from './MessageBubble';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  type: 'system' | 'chat' | 'judgment';
  aiResult?: 'YES' | 'NO' | 'IRRELEVANT' | 'WIN';
  timestamp: number;
}

const ChatBoard: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      senderId: 'ai',
      senderName: 'AI主持人',
      content: '欢迎来到海龟汤游戏！我是您的AI主持人，故事即将开始...',
      type: 'system',
      timestamp: Date.now() - 30000
    },
    {
      id: '2',
      senderId: 'ai',
      senderName: 'AI主持人',
      content: '一个男人在酒吧喝完酒后突然死亡，身上没有外伤，法医检验发现他体内有剧毒物质。',
      type: 'chat',
      timestamp: Date.now() - 20000
    },
    {
      id: '3',
      senderId: 'player1',
      senderName: '玩家A',
      content: '死者是否喝酒？',
      type: 'chat',
      aiResult: 'YES',
      timestamp: Date.now() - 10000
    },
    {
      id: '4',
      senderId: 'ai',
      senderName: 'AI主持人',
      content: '是的，他确实喝下了那杯酒。',
      type: 'judgment',
      aiResult: 'YES',
      timestamp: Date.now() - 5000
    }
  ]);
  
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSend = () => {
    if (inputValue.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        senderId: 'current-player',
        senderName: '我',
        content: inputValue,
        type: 'chat',
        timestamp: Date.now()
      };
      
      setMessages([...messages, newMessage]);
      setInputValue('');
      
      // 模拟AI回复
      setTimeout(() => {
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          senderId: 'ai',
          senderName: 'AI主持人',
          content: '这是一个有趣的提问，但还不能确定答案。',
          type: 'judgment',
          aiResult: Math.random() > 0.7 ? 'YES' : Math.random() > 0.5 ? 'NO' : 'IRRELEVANT',
          timestamp: Date.now()
        };
        setMessages(prev => [...prev, aiResponse]);
      }, 1000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </div>
      
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

export default ChatBoard;
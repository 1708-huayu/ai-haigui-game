import React, { useState, useEffect } from 'react';
import ChatBox from './ChatBox';
import { IMessage } from '../../types/models';

const ChatBoard: React.FC = () => {
  const [messages, setMessages] = useState<IMessage[]>([
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

  const handleSendMessage = (content: string) => {
    // 模拟AI回复
    setTimeout(() => {
      const aiResponse: IMessage = {
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
  };

  return (
    <ChatBox 
      initialMessages={messages} 
      onSendMessage={handleSendMessage} 
    />
  );
};

export default ChatBoard;
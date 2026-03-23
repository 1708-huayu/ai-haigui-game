import { useState, useEffect, useRef } from 'react';
import { useGameStore } from '../store/roomStore';
import { IWSMessage, IMessage } from '../types/models';

// 自定义 Hook 集中处理 WebSocket 连接、心跳与事件监听
const useGameSocket = (roomId: string | null) => {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;
  
  const { addMessage, updatePlayerStatus, joinRoom, leaveRoom } = useGameStore();

  // 初始化连接
  useEffect(() => {
    if (!roomId) return;

    connect();

    return () => {
      disconnect();
    };
  }, [roomId]);

  const connect = () => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    try {
      // 在实际部署时，这里应该从环境变量获取WebSocket地址
      const wsUrl = import.meta.env.VITE_WS_URL || `ws://localhost:3001/ws/${roomId}`;
      socketRef.current = new WebSocket(wsUrl);

      socketRef.current.onopen = () => {
        console.log(`Connected to room ${roomId}`);
        setIsConnected(true);
        setConnectionError(null);
        reconnectAttempts.current = 0;
      };

      socketRef.current.onmessage = (event) => {
        try {
          const data: IWSMessage = JSON.parse(event.data);
          handleMessage(data);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      socketRef.current.onclose = (event) => {
        console.log(`Disconnected from room ${roomId}:`, event.code, event.reason);
        setIsConnected(false);
        
        // 尝试重连（除非是手动关闭）
        if (event.code !== 1000 && reconnectAttempts.current < maxReconnectAttempts) {
          reconnectAttempts.current++;
          console.log(`Attempting to reconnect... (${reconnectAttempts.current}/${maxReconnectAttempts})`);
          reconnectTimeoutRef.current = setTimeout(connect, 3000 * reconnectAttempts.current);
        }
      };

      socketRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        setConnectionError('连接发生错误');
      };
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      setConnectionError('无法建立连接');
    }
  };

  const disconnect = () => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    
    if (socketRef.current) {
      socketRef.current.close(1000, 'Component unmount'); // 正常关闭
      socketRef.current = null;
    }
    
    setIsConnected(false);
    leaveRoom();
  };

  const sendMessage = (message: IWSMessage) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket is not connected, cannot send message:', message);
    }
  };

  const handleMessage = (data: IWSMessage) => {
    switch (data.type) {
      case 'JOIN_ROOM':
        // 处理加入房间的响应
        if (data.payload.room) {
          joinRoom(data.payload.room);
        }
        break;
        
      case 'CHAT_MESSAGE':
        // 添加聊天消息
        if (data.payload.message) {
          const message: IMessage = data.payload.message;
          addMessage(message);
        }
        break;
        
      case 'ROOM_UPDATE':
        // 更新房间信息
        if (data.payload.room) {
          joinRoom(data.payload.room);
        }
        break;
        
      case 'PLAYER_STATUS_UPDATE':
        // 更新玩家状态
        if (data.payload.playerId && typeof data.payload.isOnline === 'boolean') {
          updatePlayerStatus(data.payload.playerId, data.payload.isOnline);
        }
        break;
        
      default:
        console.log('Received unknown message type:', data.type);
        break;
    }
  };

  // 发送心跳
  const sendHeartbeat = () => {
    if (isConnected && socketRef.current) {
      sendMessage({
        type: 'HEARTBEAT',
        payload: { timestamp: Date.now() },
        timestamp: Date.now()
      });
    }
  };

  // 定期发送心跳
  useEffect(() => {
    if (isConnected) {
      const heartbeatInterval = setInterval(sendHeartbeat, 30000); // 每30秒发送一次心跳
      return () => clearInterval(heartbeatInterval);
    }
  }, [isConnected]);

  return {
    isConnected,
    connectionError,
    sendMessage,
    sendHeartbeat,
  };
};

export default useGameSocket;
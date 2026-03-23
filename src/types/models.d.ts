// 全局 TS 类型定义

// 房间核心状态
export interface IRoom {
  roomId: string;
  hostId: string;       // 房主 ID (拥有踢人权限)
  players: IPlayer[];
  story: IStory;
  status: 'waiting' | 'playing' | 'voting' | 'finished';
  voteState?: IVote;    // 当前进行的投票状态
}

// 玩家信息
export interface IPlayer {
  id: string;
  name: string;
  isHost: boolean;
  isOnline: boolean;
  score?: number;
}

// 故事信息
export interface IStory {
  id: string;
  title: string;
  surface: string;      // 汤面（玩家已知）
  bottom: string;       // 汤底（绝对机密）
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  estimatedTime: number; // 预估时长（分钟）
  winConditions: string[]; // 核心通关条件（必须全部猜中才算赢）
}

// 聊天消息 (支持状态标记)
export interface IMessage {
  id: string;
  senderId: string;     // 'ai' 或具体的玩家 ID
  senderName: string;
  content: string;
  type: 'system' | 'chat' | 'judgment'; 
  aiResult?: 'YES' | 'NO' | 'IRRELEVANT' | 'WIN'; // 核心判定
  timestamp: number;
}

// 投票状态
export interface IVote {
  id: string;
  type: 'reveal' | 'kick' | 'restart' | 'end_game'; // 投票类型
  targetId?: string; // 被投票的目标（如踢出玩家ID）
  proposerId: string; // 发起者ID
  yesVotes: string[]; // 投票同意的玩家ID列表
  noVotes: string[]; // 投票反对的玩家ID列表
  totalPlayers: number; // 总玩家数（用于计算过半数）
  expiresAt: number; // 投票截止时间
}

// WebSocket 消息类型
export interface IWSMessage {
  type: 'JOIN_ROOM' | 'LEAVE_ROOM' | 'CHAT_MESSAGE' | 'VOTE_START' | 'VOTE_CAST' | 'GAME_STATE_UPDATE' | 'ROOM_UPDATE';
  payload: any;
  timestamp: number;
}

// AI 响应格式
export interface IAIResponse {
  decision: 'YES' | 'NO' | 'IRRELEVANT';
  is_win: boolean;
  reply: string;
}
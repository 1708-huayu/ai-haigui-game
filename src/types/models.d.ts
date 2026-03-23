// 全局TS类型定义

export interface IPlayer {
  id: string;
  name: string;
  isHost: boolean;
  isOnline: boolean;
}

export interface IStory {
  id: string;
  title: string;
  difficulty: '入门' | '烧脑' | '诡异';
  surface: string;
  bottom: string;
  winConditions: string[];
}

export interface IMessage {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  type: 'system' | 'chat' | 'judgment';
  aiResult?: 'YES' | 'NO' | 'IRRELEVANT' | 'WIN';
  timestamp: number;
}

export interface IVote {
  voteId: string;
  initiatorId: string;
  targetAction: 'reveal' | 'kick' | 'restart';
  targetPlayerId?: string;
  votes: Record<string, boolean>; // player_id -> vote (true for agree)
  startTime: number;
  endTime: number;
  status: 'active' | 'passed' | 'rejected' | 'expired';
}

export interface IRoom {
  roomId: string;
  hostId: string;
  players: IPlayer[];
  story: IStory;
  status: 'waiting' | 'playing' | 'voting' | 'finished';
  voteState?: IVote;
}

export type TMessage = IMessage;
export type TStory = IStory;
export type TPlayer = IPlayer;
export type TVoteState = IVote;
export type TRoom = IRoom;
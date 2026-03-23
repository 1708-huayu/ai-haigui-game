import { create } from 'zustand';
import { IRoom, IPlayer, IMessage, IVote } from '../types/models';

interface GameState {
  // 房间状态
  room: IRoom | null;
  players: IPlayer[];
  messages: IMessage[];
  currentVote: IVote | null;
  
  // 操作方法
  joinRoom: (room: IRoom) => void;
  leaveRoom: () => void;
  addMessage: (message: IMessage) => void;
  updatePlayerStatus: (playerId: string, isOnline: boolean) => void;
  startVote: (vote: IVote) => void;
  castVote: (playerId: string, voteId: string, approve: boolean) => void;
  endCurrentVote: () => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  room: null,
  players: [],
  messages: [],
  currentVote: null,
  
  joinRoom: (room) => set({ room, players: room.players, messages: [] }),
  
  leaveRoom: () => set({ room: null, players: [], messages: [], currentVote: null }),
  
  addMessage: (message) => set((state) => ({ 
    messages: [...state.messages, message] 
  })),
  
  updatePlayerStatus: (playerId, isOnline) => set((state) => ({
    players: state.players.map(player => 
      player.id === playerId ? { ...player, isOnline } : player
    )
  })),
  
  startVote: (vote) => set({ currentVote: vote }),
  
  castVote: (playerId, voteId, approve) => {
    const { currentVote } = get();
    if (!currentVote || currentVote.id !== voteId) return;
    
    const updatedVote = { ...currentVote };
    if (approve) {
      if (!updatedVote.yesVotes.includes(playerId)) {
        updatedVote.yesVotes = [...updatedVote.yesVotes, playerId];
      }
      updatedVote.noVotes = updatedVote.noVotes.filter(id => id !== playerId);
    } else {
      if (!updatedVote.noVotes.includes(playerId)) {
        updatedVote.noVotes = [...updatedVote.noVotes, playerId];
      }
      updatedVote.yesVotes = updatedVote.yesVotes.filter(id => id !== playerId);
    }
    
    set({ currentVote: updatedVote });
  },
  
  endCurrentVote: () => set({ currentVote: null })
}));
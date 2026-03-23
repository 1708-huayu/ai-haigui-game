import { create } from 'zustand';
import type { IRoom, IPlayer, IMessage, IVote } from '../types/models';

interface RoomState {
  currentRoom: IRoom | null;
  messages: IMessage[];
  currentPlayer: IPlayer | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setCurrentRoom: (room: IRoom | null) => void;
  addMessage: (message: IMessage) => void;
  setMessages: (messages: IMessage[]) => void;
  setCurrentPlayer: (player: IPlayer | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  updateVoteState: (vote: IVote) => void;
  clearRoom: () => void;
}

export const useRoomStore = create<RoomState>((set) => ({
  currentRoom: null,
  messages: [],
  currentPlayer: null,
  isLoading: false,
  error: null,

  setCurrentRoom: (room) => set({ currentRoom: room }),
  addMessage: (message) => set((state) => ({ 
    messages: [...state.messages, message] 
  })),
  setMessages: (messages) => set({ messages }),
  setCurrentPlayer: (player) => set({ currentPlayer: player }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  updateVoteState: (vote) => set((state) => ({
    currentRoom: state.currentRoom ? {
      ...state.currentRoom,
      voteState: vote
    } : null
  })),
  clearRoom: () => set({ 
    currentRoom: null, 
    messages: [], 
    currentPlayer: null, 
    error: null 
  }),
}));
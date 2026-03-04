import { create } from 'zustand'
import { v4 as uuidv4 } from 'uuid'
import type { ChatMessage } from '../types/schema'

interface ChatState {
  messages: ChatMessage[]
  isLoading: boolean

  addMessage: (role: ChatMessage['role'], content: string, image?: string) => void
  setLoading: (loading: boolean) => void
  clearMessages: () => void
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  isLoading: false,

  addMessage: (role, content, image) => {
    const message: ChatMessage = {
      id: uuidv4(),
      role,
      content,
      image,
      timestamp: Date.now(),
    }
    set((state) => ({ messages: [...state.messages, message] }))
  },

  setLoading: (isLoading) => set({ isLoading }),

  clearMessages: () => set({ messages: [] }),
}))

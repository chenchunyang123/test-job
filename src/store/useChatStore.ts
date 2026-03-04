import { create } from 'zustand'
import { v4 as uuidv4 } from 'uuid'
import type { ChatMessage } from '../types/schema'

interface ChatState {
  messages: ChatMessage[]
  isLoading: boolean
  progressChars: number

  addMessage: (role: ChatMessage['role'], content: string, image?: string) => void
  setLoading: (loading: boolean) => void
  setProgressChars: (chars: number) => void
  clearMessages: () => void
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  isLoading: false,
  progressChars: 0,

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

  setLoading: (isLoading) => set({ isLoading, progressChars: 0 }),

  setProgressChars: (progressChars) => set({ progressChars }),

  clearMessages: () => set({ messages: [] }),
}))

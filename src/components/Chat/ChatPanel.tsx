import { useRef } from 'react'
import { MessageList } from './MessageList'
import { ChatInput, type ChatInputHandle } from './ChatInput'

export function ChatPanel() {
  const chatInputRef = useRef<ChatInputHandle>(null)

  const handleQuickPrompt = (text: string) => {
    chatInputRef.current?.sendMessage(text)
  }

  return (
    <div
      style={{
        width: '380px',
        minWidth: '320px',
        display: 'flex',
        flexDirection: 'column',
        borderRight: '1px solid #e8e8e8',
        backgroundColor: '#fff',
        height: '100%',
      }}
    >
      <div
        style={{
          padding: '16px 20px',
          borderBottom: '1px solid #f0f0f0',
          fontWeight: 600,
          fontSize: '15px',
          color: '#333',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <span style={{ fontSize: '18px' }}>💬</span>
        对话
      </div>
      <MessageList onQuickPrompt={handleQuickPrompt} />
      <ChatInput ref={chatInputRef} />
    </div>
  )
}

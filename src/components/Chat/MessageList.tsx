import { useEffect, useRef } from 'react'
import type { ChatMessage } from '../../types/schema'
import { useChatStore } from '../../store/useChatStore'
import { LoadingOutlined, UserOutlined, RobotOutlined } from '@ant-design/icons'

const QUICK_PROMPTS = [
  '设计一个登录页面，包含邮箱和密码输入框',
  '做一个电商首页，有轮播图和商品列表',
  '设计一个聊天界面，带消息列表和输入框',
  '做一个个人中心页面，有头像和设置选项',
]

function MessageBubble({ msg }: { msg: ChatMessage }) {
  const isUser = msg.role === 'user'

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: isUser ? 'row-reverse' : 'row',
        gap: '8px',
        alignItems: 'flex-start',
      }}
    >
      <div
        style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          backgroundColor: isUser ? '#1677ff' : '#722ed1',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '14px',
          flexShrink: 0,
        }}
      >
        {isUser ? <UserOutlined /> : <RobotOutlined />}
      </div>
      <div
        style={{
          maxWidth: '80%',
          padding: '10px 14px',
          borderRadius: isUser ? '12px 2px 12px 12px' : '2px 12px 12px 12px',
          backgroundColor: isUser ? '#1677ff' : '#f6f6f6',
          color: isUser ? '#fff' : '#333',
          fontSize: '14px',
          lineHeight: '1.5',
          wordBreak: 'break-word',
        }}
      >
        {msg.image && (
          <img
            src={msg.image}
            alt="uploaded"
            style={{
              maxWidth: '200px',
              borderRadius: '8px',
              marginBottom: msg.content ? '8px' : '0',
              display: 'block',
            }}
          />
        )}
        {msg.content}
      </div>
    </div>
  )
}

function LoadingIndicator() {
  const { progressChars } = useChatStore()

  return (
    <div
      style={{
        display: 'flex',
        gap: '8px',
        alignItems: 'center',
        color: '#999',
        fontSize: '13px',
        padding: '8px 0',
      }}
    >
      <LoadingOutlined spin />
      <span>
        {progressChars > 0
          ? `AI 正在生成... 已接收 ${progressChars} 字符`
          : 'AI 正在思考...'}
      </span>
    </div>
  )
}

interface MessageListProps {
  onQuickPrompt?: (text: string) => void
}

export function MessageList({ onQuickPrompt }: MessageListProps) {
  const { messages, isLoading } = useChatStore()
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  return (
    <div
      style={{
        flex: 1,
        overflow: 'auto',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}
    >
      {messages.length === 0 && (
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#bbb',
            gap: '12px',
            padding: '40px 20px',
            textAlign: 'center',
          }}
        >
          <RobotOutlined style={{ fontSize: '36px' }} />
          <div style={{ fontSize: '15px', fontWeight: 500, color: '#666' }}>
            AI 原型图设计助手
          </div>
          <div style={{ fontSize: '13px', lineHeight: '1.6' }}>
            描述你想要的界面，我来帮你生成原型图。
            <br />
            也可以上传截图来还原设计。
          </div>
          <div
            style={{
              marginTop: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              width: '100%',
              padding: '0 16px',
            }}
          >
            {QUICK_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                onClick={() => onQuickPrompt?.(prompt)}
                style={{
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: '1px solid #e8e8e8',
                  backgroundColor: '#fafafa',
                  color: '#555',
                  fontSize: '13px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#1677ff'
                  e.currentTarget.style.color = '#1677ff'
                  e.currentTarget.style.backgroundColor = '#f0f5ff'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#e8e8e8'
                  e.currentTarget.style.color = '#555'
                  e.currentTarget.style.backgroundColor = '#fafafa'
                }}
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}
      {messages
        .filter((m) => m.role !== 'system')
        .map((msg) => (
          <MessageBubble key={msg.id} msg={msg} />
        ))}
      {isLoading && (
        <LoadingIndicator />
      )}
      <div ref={bottomRef} />
    </div>
  )
}

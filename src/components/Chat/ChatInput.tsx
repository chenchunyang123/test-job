import { useState, useRef, useImperativeHandle, forwardRef } from 'react'
import { Button, Upload, Tooltip, message } from 'antd'
import { SendOutlined, PictureOutlined, ClearOutlined } from '@ant-design/icons'
import { useChatStore } from '../../store/useChatStore'
import { useSchemaStore } from '../../store/useSchemaStore'
import { modifySchema, screenshotToSchema } from '../../services/zhipuAI'

export interface ChatInputHandle {
  sendMessage: (text: string) => void
}

export const ChatInput = forwardRef<ChatInputHandle>(function ChatInput(_, ref) {
  const [inputValue, setInputValue] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { addMessage, setLoading, isLoading, clearMessages, setProgressChars } = useChatStore()
  const { schema, updateSchema, setSchema } = useSchemaStore()

  const handleProgress = (chars: number) => {
    setProgressChars(chars)
  }

  const doSend = async (text: string) => {
    if (!text.trim() || isLoading) return

    setInputValue('')
    addMessage('user', text)
    setLoading(true)

    try {
      const newSchema = await modifySchema(schema, text, handleProgress)
      updateSchema(newSchema)
      addMessage('assistant', '原型图已更新！')
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : '未知错误'
      addMessage('assistant', `操作失败：${errorMsg}`)
      message.error('AI 调用失败，请检查 API Key 配置')
    } finally {
      setLoading(false)
    }
  }

  useImperativeHandle(ref, () => ({
    sendMessage: (text: string) => {
      setInputValue(text)
      doSend(text)
    },
  }))

  const handleSend = () => doSend(inputValue)

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleImageUpload = async (file: File) => {
    if (isLoading) return false

    const reader = new FileReader()
    reader.onload = async (e) => {
      const base64 = e.target?.result as string
      addMessage('user', '请根据这张截图生成原型图', base64)
      setLoading(true)

      try {
        const newSchema = await screenshotToSchema(base64, handleProgress)
        setSchema(newSchema)
        addMessage('assistant', '已根据截图生成原型图！你可以继续通过对话来修改。')
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : '未知错误'
        addMessage('assistant', `截图分析失败：${errorMsg}`)
        message.error('截图分析失败')
      } finally {
        setLoading(false)
      }
    }
    reader.readAsDataURL(file)
    return false
  }

  const handleClear = () => {
    clearMessages()
  }

  return (
    <div
      style={{
        padding: '12px 16px',
        borderTop: '1px solid #f0f0f0',
        backgroundColor: '#fff',
      }}
    >
      <div
        style={{
          display: 'flex',
          gap: '8px',
          alignItems: 'flex-end',
        }}
      >
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'flex-end',
            border: '1px solid #d9d9d9',
            borderRadius: '8px',
            padding: '8px 12px',
            backgroundColor: '#fafafa',
            transition: 'border-color 0.2s',
          }}
        >
          <textarea
            ref={textareaRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="描述你想要的修改..."
            disabled={isLoading}
            rows={1}
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              resize: 'none',
              fontSize: '14px',
              lineHeight: '1.5',
              backgroundColor: 'transparent',
              maxHeight: '120px',
              fontFamily: 'inherit',
            }}
          />
        </div>
        <div style={{ display: 'flex', gap: '4px' }}>
          <Upload
            accept="image/*"
            showUploadList={false}
            beforeUpload={handleImageUpload}
          >
            <Tooltip title="上传截图还原原型图">
              <Button
                icon={<PictureOutlined />}
                disabled={isLoading}
                style={{ borderRadius: '8px' }}
              />
            </Tooltip>
          </Upload>
          <Tooltip title="清空对话">
            <Button
              icon={<ClearOutlined />}
              onClick={handleClear}
              disabled={isLoading}
              style={{ borderRadius: '8px' }}
            />
          </Tooltip>
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={handleSend}
            disabled={!inputValue.trim() || isLoading}
            loading={isLoading}
            style={{ borderRadius: '8px' }}
          />
        </div>
      </div>
    </div>
  )
})

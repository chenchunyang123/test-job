import { useEffect } from 'react'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import { ChatPanel } from './components/Chat/ChatPanel'
import { CanvasPanel } from './components/Canvas/CanvasPanel'
import { Toolbar } from './components/Toolbar/Toolbar'
import { useSchemaStore } from './store/useSchemaStore'

export default function App() {
  const { undo, redo, canUndo, canRedo } = useSchemaStore()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        e.preventDefault()
        if (e.shiftKey) {
          if (canRedo()) redo()
        } else {
          if (canUndo()) undo()
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [undo, redo, canUndo, canRedo])

  return (
    <ConfigProvider locale={zhCN}>
      <div
        style={{
          width: '100vw',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          backgroundColor: '#f5f5f5',
        }}
      >
        <Toolbar />
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          <ChatPanel />
          <CanvasPanel />
        </div>
      </div>
    </ConfigProvider>
  )
}

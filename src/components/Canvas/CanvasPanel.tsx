import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch'
import { useSchemaStore } from '../../store/useSchemaStore'
import { ComponentRenderer } from './ComponentRenderer'

export function CanvasPanel() {
  const { schema, selectNode, selectedNodeId } = useSchemaStore()

  const handleCanvasClick = () => {
    selectNode(null)
  }

  return (
    <div
      className="flex-1 overflow-hidden"
      style={{ backgroundColor: '#f0f2f5' }}
    >
      <TransformWrapper
        initialScale={1}
        minScale={0.25}
        maxScale={3}
        centerOnInit
        limitToBounds={false}
      >
        <TransformComponent
          wrapperStyle={{ width: '100%', height: '100%' }}
          contentStyle={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '60px',
          }}
        >
          <div
            onClick={handleCanvasClick}
            style={{
              width: schema.width,
              minHeight: schema.height,
              backgroundColor: schema.backgroundColor,
              boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
              borderRadius: '8px',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            {schema.children.length === 0 ? (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: schema.height,
                  color: '#bbb',
                  gap: '12px',
                }}
              >
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <path d="M3 9h18M9 21V9" />
                </svg>
                <span style={{ fontSize: '14px' }}>
                  通过左侧对话或上传截图来创建原型图
                </span>
              </div>
            ) : (
              schema.children.map((node) => (
                <ComponentRenderer
                  key={node.id}
                  node={node}
                  onSelect={selectNode}
                  selectedId={selectedNodeId}
                />
              ))
            )}
          </div>
        </TransformComponent>
      </TransformWrapper>
    </div>
  )
}

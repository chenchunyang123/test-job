import type { ComponentNode } from '../../../types/schema'
import { ComponentRenderer } from '../ComponentRenderer'

interface Props {
  node: ComponentNode
  onSelect?: (id: string) => void
  selectedId?: string | null
}

export function Card({ node, onSelect, selectedId }: Props) {
  const title = node.props.title as string | undefined

  return (
    <div
      style={{
        backgroundColor: '#fff',
        borderRadius: '8px',
        border: '1px solid #e8e8e8',
        overflow: 'hidden',
        ...node.style,
      }}
    >
      {title && (
        <div
          style={{
            padding: '12px 16px',
            borderBottom: '1px solid #f0f0f0',
            fontWeight: 600,
            fontSize: '15px',
          }}
        >
          {title}
        </div>
      )}
      <div style={{ padding: '16px' }}>
        {node.children?.map((child) => (
          <ComponentRenderer
            key={child.id}
            node={child}
            onSelect={onSelect}
            selectedId={selectedId}
          />
        ))}
      </div>
    </div>
  )
}

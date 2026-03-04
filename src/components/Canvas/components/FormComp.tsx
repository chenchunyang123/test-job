import type { ComponentNode } from '../../../types/schema'
import { ComponentRenderer } from '../ComponentRenderer'

interface Props {
  node: ComponentNode
  onSelect?: (id: string) => void
  selectedId?: string | null
}

export function FormComp({ node, onSelect, selectedId }: Props) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        ...node.style,
      }}
    >
      {node.children?.map((child) => (
        <ComponentRenderer
          key={child.id}
          node={child}
          onSelect={onSelect}
          selectedId={selectedId}
        />
      ))}
    </div>
  )
}

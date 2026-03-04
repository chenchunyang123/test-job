import type { ComponentNode } from '../../../types/schema'
import { ComponentRenderer } from '../ComponentRenderer'

interface Props {
  node: ComponentNode
  onSelect?: (id: string) => void
  selectedId?: string | null
}

export function Container({ node, onSelect, selectedId }: Props) {
  return (
    <div style={node.style}>
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

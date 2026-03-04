import type { ComponentNode } from '../../../types/schema'

interface Props {
  node: ComponentNode
}

export function Tag({ node }: Props) {
  const text = (node.props.text as string) || ''
  const color = (node.props.color as string) || '#1677ff'

  return (
    <span
      style={{
        display: 'inline-block',
        padding: '2px 8px',
        borderRadius: '4px',
        fontSize: '12px',
        color,
        backgroundColor: `${color}18`,
        border: `1px solid ${color}40`,
        ...node.style,
      }}
    >
      {text}
    </span>
  )
}

import type { ComponentNode } from '../../../types/schema'

interface Props {
  node: ComponentNode
}

export function Badge({ node }: Props) {
  const text = (node.props.text as string) || ''
  const color = (node.props.color as string) || '#1677ff'

  return (
    <span
      style={{
        display: 'inline-block',
        padding: '2px 8px',
        borderRadius: '10px',
        fontSize: '12px',
        color: '#fff',
        backgroundColor: color,
        ...node.style,
      }}
    >
      {text}
    </span>
  )
}

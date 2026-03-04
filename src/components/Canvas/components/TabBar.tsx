import type { ComponentNode } from '../../../types/schema'

interface TabItem {
  label: string
  icon?: string
  active?: boolean
}

interface Props {
  node: ComponentNode
}

export function TabBar({ node }: Props) {
  const items = (node.props.items as TabItem[]) || []

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        height: '50px',
        backgroundColor: '#fff',
        borderTop: '1px solid #e8e8e8',
        ...node.style,
      }}
    >
      {items.map((item, idx) => (
        <div
          key={idx}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2px',
            color: item.active ? '#1677ff' : '#999',
            fontSize: '10px',
          }}
        >
          <span style={{ fontSize: '20px' }}>{item.icon || '○'}</span>
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  )
}

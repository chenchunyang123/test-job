import type { ComponentNode } from '../../../types/schema'

interface Props {
  node: ComponentNode
}

export function ListItem({ node }: Props) {
  const title = (node.props.title as string) || ''
  const subtitle = node.props.subtitle as string | undefined
  const extra = node.props.extra as string | undefined

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 16px',
        borderBottom: '1px solid #f0f0f0',
        ...node.style,
      }}
    >
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '15px', color: '#333' }}>{title}</div>
        {subtitle && (
          <div style={{ fontSize: '13px', color: '#999', marginTop: '4px' }}>
            {subtitle}
          </div>
        )}
      </div>
      {extra && (
        <div style={{ fontSize: '14px', color: '#999', marginLeft: '12px' }}>
          {extra}
        </div>
      )}
    </div>
  )
}

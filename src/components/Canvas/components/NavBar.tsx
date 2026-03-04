import type { ComponentNode } from '../../../types/schema'

interface Props {
  node: ComponentNode
}

export function NavBar({ node }: Props) {
  const title = (node.props.title as string) || ''
  const showBack = node.props.showBack as boolean | undefined

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        height: '44px',
        backgroundColor: '#fff',
        borderBottom: '1px solid #e8e8e8',
        ...node.style,
      }}
    >
      {showBack && (
        <span
          style={{
            position: 'absolute',
            left: '16px',
            fontSize: '16px',
            color: '#333',
          }}
        >
          ← 
        </span>
      )}
      <span style={{ fontWeight: 600, fontSize: '17px' }}>{title}</span>
    </div>
  )
}

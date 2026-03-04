import type { ComponentNode } from '../../../types/schema'

interface Props {
  node: ComponentNode
}

export function Divider({ node }: Props) {
  const text = node.props.text as string | undefined

  if (text) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          margin: '12px 0',
          ...node.style,
        }}
      >
        <div style={{ flex: 1, height: '1px', backgroundColor: '#e8e8e8' }} />
        <span style={{ fontSize: '13px', color: '#999' }}>{text}</span>
        <div style={{ flex: 1, height: '1px', backgroundColor: '#e8e8e8' }} />
      </div>
    )
  }

  return (
    <div
      style={{
        height: '1px',
        backgroundColor: '#e8e8e8',
        margin: '12px 0',
        ...node.style,
      }}
    />
  )
}

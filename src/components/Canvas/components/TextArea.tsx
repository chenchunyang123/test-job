import type { ComponentNode } from '../../../types/schema'

interface Props {
  node: ComponentNode
}

export function TextArea({ node }: Props) {
  const placeholder = (node.props.placeholder as string) || ''
  const label = node.props.label as string | undefined
  const rows = (node.props.rows as number) || 3

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', ...node.style }}>
      {label && (
        <label style={{ fontSize: '14px', color: '#333', fontWeight: 500 }}>
          {label}
        </label>
      )}
      <textarea
        placeholder={placeholder}
        rows={rows}
        readOnly
        style={{
          padding: '8px 12px',
          border: '1px solid #d9d9d9',
          borderRadius: '6px',
          fontSize: '14px',
          outline: 'none',
          resize: 'none',
          backgroundColor: '#fff',
        }}
      />
    </div>
  )
}

import type { ComponentNode } from '../../../types/schema'

interface Props {
  node: ComponentNode
}

export function Select({ node }: Props) {
  const placeholder = (node.props.placeholder as string) || '请选择'
  const label = node.props.label as string | undefined
  const options = (node.props.options as string[]) || []

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', ...node.style }}>
      {label && (
        <label style={{ fontSize: '14px', color: '#333', fontWeight: 500 }}>
          {label}
        </label>
      )}
      <select
        style={{
          padding: '8px 12px',
          border: '1px solid #d9d9d9',
          borderRadius: '6px',
          fontSize: '14px',
          backgroundColor: '#fff',
          appearance: 'auto',
        }}
        defaultValue=""
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((opt, i) => (
          <option key={i} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  )
}

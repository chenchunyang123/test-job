import type { ComponentNode } from '../../../types/schema'

interface Props {
  node: ComponentNode
}

export function Radio({ node }: Props) {
  const label = (node.props.label as string) || ''
  const options = (node.props.options as string[]) || []

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', ...node.style }}>
      {label && (
        <label style={{ fontSize: '14px', color: '#333', fontWeight: 500 }}>
          {label}
        </label>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {options.map((opt, i) => (
          <label
            key={i}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}
          >
            <input type="radio" name={node.id} readOnly defaultChecked={i === 0} />
            <span>{opt}</span>
          </label>
        ))}
      </div>
    </div>
  )
}
